const plainText = (value, maxLength = 160) =>
  String(value || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength)

// Keep email and phone out of the wa.me URL; Zoho already stores them.
// The message contains only the short service summary and a lookup reference.
export function buildWhatsAppMessage(quote = {}, reference = "") {
  const firstName = plainText(quote.firstName, 80) || plainText(quote.lastName, 80) || ""
  const moveType = plainText(quote.moveType, 100) || "move"
  const moveDate = plainText(quote.moveDate, 30)
  const bedrooms = plainText(quote.bedrooms, 60)
  const ref = /^\d{8}$/.test(String(reference)) ? String(reference) : ""
  const date = moveDate ? ` around ${moveDate}` : ""
  const size = bedrooms ? ` (${bedrooms})` : ""
  const greeting = firstName ? `Hi Taylor Movers, I'm ${firstName}.` : "Hi Taylor Movers."
  const lookup = ref ? ` My enquiry reference is ${ref}.` : ""

  return `${greeting} I'd like a quote for a ${moveType}${date}${size}.${lookup}`
}
