// Server-only leads ledger (Sanity Security §8).
// Writes go to a NEW PRIVATE dataset (default "leads-ledger") — never to the
// public `production` dataset that currently exposes 3,500+ quote records.
// Requires env: SANITY_LEADS_TOKEN (write-scoped token for the ledger dataset)
// and optionally SANITY_LEADS_DATASET (default "leads-ledger").
// All functions no-op gracefully when unconfigured (email/SMS still send).
import { createClient } from "next-sanity"

const dataset = process.env.SANITY_LEADS_DATASET || "leads-ledger"

const getClient = () => {
  const token = process.env.SANITY_LEADS_TOKEN
  if (!token || token.startsWith("REVOKED")) return null
  return createClient({
    projectId: "bsg3746e",
    dataset,
    apiVersion: "2023-06-19",
    token,
    useCdn: false,
  })
}

export const ledgerConfigured = () => Boolean(getClient())

export async function createLeadRecord(lead) {
  const client = getClient()
  if (!client) {
    // Loud on purpose: a silent null here means every quote is only in Zoho,
    // with no independent record of "was this received".
    console.warn(
      "Leads ledger NOT configured — quote will not be recorded in Sanity. " +
      "Set SANITY_LEADS_TOKEN (write-scoped token for the private 'leads-ledger' dataset). " +
      "See SANITY-SECURITY.md §2."
    )
    return null
  }
  try {
    const doc = await client.create({
      _type: "lead",
      status: "received",
      ...lead,
      submittedAt: new Date().toISOString(),
    })
    return doc
  } catch (e) {
    // Distinguish a real write failure from "not configured".
    console.error("Leads ledger write failed:", e?.message)
    return null
  }
}

export async function patchLeadRecord(id, patch) {
  const client = getClient()
  if (!client || !id) return null
  return client.patch(id).set(patch).commit()
}
