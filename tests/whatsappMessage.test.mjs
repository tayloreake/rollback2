import test from "node:test"
import assert from "node:assert/strict"
import { buildWhatsAppMessage } from "../utils/whatsappMessage.js"

test("WhatsApp draft is personalized from the move request and includes the CRM reference", () => {
  const message = buildWhatsAppMessage({
    firstName: "Amina",
    lastName: "Kamau",
    email: "amina@example.com",
    phoneNumber: "+254712345678",
    moveType: "Local House Move",
    bedrooms: "2 Bedrooms",
    moveDate: "2099-12-31",
    location: "Westlands",
    destination: "Karen",
  }, "12345678")
  assert.match(message, /Hi Taylor Movers, I'm Amina/)
  assert.match(message, /Local House Move/)
  assert.doesNotMatch(message, /Westlands|Karen/)
  assert.match(message, /2099-12-31/)
  assert.match(message, /2 Bedrooms/)
  assert.match(message, /12345678/)
  assert.doesNotMatch(message, /amina@example.com/)
  assert.doesNotMatch(message, /\+254712345678/)
})
