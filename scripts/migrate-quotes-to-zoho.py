# One-off migration: Sanity production `quote` docs → Zoho Website_Quotes.
# The Free-plan project cannot host a private leads-ledger dataset, so Zoho
# is the system of record instead (user decision, 11 Oct 2026).
#
# stdlib only:  python3 scripts/migrate-quotes-to-zoho.py --dry-run [--limit 10]
#   python3 scripts/migrate-quotes-to-zoho.py --limit 20      # smoke batch
#   python3 scripts/migrate-quotes-to-zoho.py                 # full run (~1h)
#   python3 scripts/migrate-quotes-to-zoho.py --resume        # after interrupt
#
# Env (repo .env): ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN,
# ZOHO_DC (default com). Progress: scripts/migration-log.jsonl (has emails —
# delete it when finished). Resume skips already-logged emails.

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOG = ROOT / "scripts" / "migration-log.jsonl"

raw = sys.argv[1:]
ARGS = {}
i = 0
while i < len(raw):
    a = raw[i].lstrip("-")
    if "=" in a:
        k, v = a.split("=", 1)
        ARGS[k] = v
    elif i + 1 < len(raw) and not raw[i + 1].startswith("--"):
        ARGS[a] = raw[i + 1]
        i += 1
    else:
        ARGS[a] = True
    i += 1

DRY = bool(ARGS.get("dry-run"))
LIMIT = int(ARGS["limit"]) if ARGS.get("limit") else float("inf")
RESUME = bool(ARGS.get("resume"))

env = {}
try:
    for line in (ROOT / ".env").read_text().splitlines():
        if line.startswith("ZOHO_") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
except FileNotFoundError:
    pass
for k in ("ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"):
    if not env.get(k):
        sys.exit(f"Missing {k} in .env — aborting")
DC = env.get("ZOHO_DC", "com") or "com"
ACCOUNTS = {"com": "https://accounts.zoho.com", "eu": "https://accounts.zoho.eu", "in": "https://accounts.zoho.in"}[DC]
API = {"com": "https://www.zohoapis.com", "eu": "https://www.zohoapis.eu", "in": "https://www.zohoapis.in"}[DC]

TOKEN = {"v": None}


def req(method, url, body=None, headers=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method,
                               headers={"Content-Type": "application/json", **(headers or {})})
    with urllib.request.urlopen(r, timeout=30) as resp:
        return json.loads(resp.read().decode() or "{}")


def refresh_token():
    p = urllib.parse.urlencode({
        "refresh_token": env["ZOHO_REFRESH_TOKEN"],
        "client_id": env["ZOHO_CLIENT_ID"],
        "client_secret": env["ZOHO_CLIENT_SECRET"],
        "grant_type": "refresh_token",
    })
    t = req("POST", f"{ACCOUNTS}/oauth/v2/token?{p}")
    if not t.get("access_token"):
        raise RuntimeError("Zoho token refresh failed: " + json.dumps(t)[:200])
    TOKEN["v"] = t["access_token"]
    TOKEN["at"] = time.time()


def zoho(path, method="GET", body=None, _retried=False):
    # Access tokens live ~1h; proactively refresh and retry once on 401.
    if not TOKEN["v"] or time.time() - TOKEN.get("at", 0) > 3300:
        refresh_token()
    try:
        return req(method, f"{API}/crm/v8{path}", body,
                   {"Authorization": f"Zoho-oauthtoken {TOKEN['v']}"})
    except Exception as e:
        if not _retried and ("401" in str(e) or "INVALID_TOKEN" in str(e).upper()):
            refresh_token()
            return zoho(path, method, body, True)
        raise


def sanity(query):
    url = "https://bsg3746e.api.sanity.io/v2021-10-21/data/query/production?query=" + urllib.parse.quote(query)
    with urllib.request.urlopen(url, timeout=30) as resp:
        return json.loads(resp.read().decode())["result"]


def map_quote(q):
    return {
        "Name": str(q.get("firstName") or "Website Lead")[:100],
        "Email": q.get("email") or None,
        "Phone": str(q.get("phoneNumber") or "")[:30],
        "Lead_Source": str(q.get("refferals") or "Website")[:100],
        "Move_Type": str(q.get("moveType") or "")[:100] or None,
        "Move_From": str(q.get("location") or "")[:255] or None,
        "Move_To": str(q.get("destination") or "")[:255] or None,
        "Property_Size": str(q.get("bedrooms") or "")[:100] or None,
        "Move_Date": str(q.get("moveDate") or "")[:50] or None,
        "Quote_Notes": f"Migrated website quote {q.get('_id')} ({q.get('submittedAt') or q.get('_createdAt') or ''})"[:255],
    }


def log(entry):
    with open(LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")


def done_emails():
    done = set()
    if RESUME and LOG.exists():
        for line in LOG.read_text().splitlines():
            try:
                e = json.loads(line)
                if e.get("status") in ("created", "skipped-existing"):
                    done.add(e.get("email"))
            except ValueError:
                pass
    return done


def main():
    print(f"Mode: {'DRY-RUN (no writes)' if DRY else 'LIVE'} | limit={'all' if LIMIT == float('inf') else LIMIT} | resume={RESUME}")
    done = done_emails()
    if done:
        print(f"Resume: skipping {len(done)} already-processed emails")
    print("Loading existing Website_Quotes emails (dedupe)…")
    existing = set()
    if not DRY:
        page = 1
        while True:
            try:
                j = zoho(f"/Website_Quotes?per_page=200&page={page}&fields=Email")
            except Exception as e:
                # A failing page (e.g. past the last page) just ends the preload
                if page > 1:
                    print(f"preload stopped at page {page} ({str(e)[:80]})")
                    break
                raise
            for r in j.get("data", []) or []:
                if r.get("Email"):
                    existing.add(str(r["Email"]).lower())
            if not (j.get("info") or {}).get("more_records"):
                break
            page += 1
            if page > 200:
                break
            time.sleep(0.3)
    print(f"Zoho already has {len(existing)} Website_Quotes emails on file")

    FIELDS = "_id,_createdAt,firstName,email,phoneNumber,location,destination,moveType,bedrooms,moveDate,refferals,submittedAt"
    offset, processed, created, skipped, failed = 0, 0, 0, 0, 0
    PAGE = 100
    while True:
        batch = sanity(f'*[_type=="quote" && !(_id in path("drafts.**"))] | order(_createdAt asc) [{offset}...{offset + PAGE}] {{{FIELDS}}}') or []
        if not batch:
            break
        for q in batch:
            if processed >= LIMIT:
                break
            email = str(q.get("email") or "").lower()
            if not email or email in done or email in existing:
                skipped += 1
                if not DRY:
                    log({"email": email, "status": "skipped-existing", "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
                processed += 1
                continue
            if DRY:
                created += 1
            else:
                try:
                    r = zoho("/Website_Quotes", "POST", {"data": [map_quote(q)]})
                    rid = ((r.get("data") or [{}])[0].get("details") or {}).get("id")
                    if rid:
                        created += 1
                        log({"email": email, "status": "created", "zohoId": rid, "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
                    else:
                        failed += 1
                        log({"email": email, "status": "failed", "error": json.dumps(r)[:300]})
                except Exception as e:  # noqa: BLE001 — keep going, log for retry
                    failed += 1
                    log({"email": email, "status": "failed", "error": str(e)[:300]})
                time.sleep(0.4)
            processed += 1
        print(f"progress: processed={processed} created={created} skipped={skipped} failed={failed}", flush=True)
        if processed >= LIMIT:
            break
        offset += PAGE
    print(f"DONE: processed={processed} created={created} skipped={skipped} failed={failed}")
    print("Next: spot-check Zoho, then delete production quotes (see SANITY-SECURITY.md).")
    print("Remember to delete scripts/migration-log.jsonl when finished (contains emails).")


main()
