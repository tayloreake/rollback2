// Receives CSP violation reports (see Content-Security-Policy-Report-Only
// in next.config.js). Logs for review before promoting CSP to enforcing.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }
  try {
    const report = req.body?.["csp-report"] || req.body;
    console.warn("CSP report:", JSON.stringify(report)?.slice(0, 1000));
  } catch (e) { /* no-op */ }
  res.status(204).end()
}
