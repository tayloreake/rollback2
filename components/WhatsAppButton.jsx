import React, { useEffect, useId, useRef, useState } from "react"
import SafeRecaptcha from "./SafeRecaptcha"
import Portal from "./Portal"
import useBotTrap from "../hooks/useBotTrap"
import { getFormAttribution } from "../utils/attribution"
import { gtmPushLead, gtmPushWhatsAppClick } from "../utils/gtm"
import { buildWhatsAppMessage } from "../utils/whatsappMessage.js"

const PHONE = "254721410517"
const BASE_HREF = `https://wa.me/${PHONE}`
const MOVE_TYPES = [
  "Local House Move",
  "Office Move",
  "International Move",
  "Corporate Staff Relocation",
  "Storage & Warehousing",
  "Long-Distance Move",
  "Business Move",
  "Other",
]
const BEDROOM_OPTIONS = [
  "Studio Apartment",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4 Bedrooms",
  "5 Bedrooms",
  "6 Bedrooms",
  "More than 6 Bedrooms",
]

const localDate = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

const emptyForm = () => ({
  fullName: "",
  phoneNumber: "",
  email: "",
  location: "",
  destination: "",
  moveType: MOVE_TYPES[0],
  bedrooms: BEDROOM_OPTIONS[1],
  moveDate: localDate(),
})

const splitName = (fullName) => {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return { firstName: "", lastName: parts[0] || "" }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") }
}

const prefillForm = (data = {}) => {
  const name = data.fullName || [data.firstName, data.lastName].filter(Boolean).join(" ")
  return {
    ...emptyForm(),
    ...(name ? { fullName: name } : {}),
    ...((data.phoneNumber || data.number) ? { phoneNumber: data.phoneNumber || data.number } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...(data.location ? { location: data.location } : {}),
    ...(data.destination ? { destination: data.destination } : {}),
    ...(data.moveType ? { moveType: data.moveType } : {}),
    ...((data.bedrooms || data.propertySize) ? { bedrooms: data.bedrooms || data.propertySize } : {}),
    ...(data.moveDate ? { moveDate: data.moveDate } : {}),
  }
}

const validForm = (form) => {
  if (!/^[\p{L}\p{M}' .-]{2,80}$/u.test(String(form.fullName || "").trim())) return "Enter your full name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email || "").trim())) return "Enter a valid email address."
  const phone = String(form.phoneNumber || "").trim()
  const digits = phone.replace(/\D/g, "")
  if (!/^\+?\d[\d\s-]{7,15}$/.test(phone) || digits.length < 7 || digits.length > 15) {
    return "Enter a valid WhatsApp number, including the country code."
  }
  if (String(form.location || "").trim().length < 3) return "Enter where the move is starting from."
  if (String(form.destination || "").trim().length < 3) return "Enter the move destination."
  if (!form.moveDate) return "Choose your preferred move date."
  return ""
}

const createRef = () => {
  const bytes = new Uint32Array(1)
  window.crypto.getRandomValues(bytes)
  return String(10000000 + (bytes[0] % 90000000))
}

export default function WhatsAppButton({ placement, children, initialData, ...props }) {
  const { target, rel, onClick: onTriggerClick, ...buttonProps } = props
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [hasConsent, setHasConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState("")
  const [savedRef, setSavedRef] = useState("")
  const [error, setError] = useState("")
  const recaptchaRef = useRef(null)
  const refRef = useRef("")
  const { trap, getBotFields } = useBotTrap()
  const titleId = useId()
  const formId = useId()
  const today = localDate()

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) setIsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, isSubmitting])

  const handleOpen = (event) => {
    if (typeof onTriggerClick === "function") onTriggerClick(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    refRef.current = createRef()
    setForm(prefillForm(initialData))
    setHasConsent(false)
    setSaved(false)
    setMessage("")
    setSavedRef("")
    setError("")
    setIsOpen(true)
  }

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    if (!hasConsent) {
      setError("Please agree to be contacted on WhatsApp about this enquiry.")
      return
    }
    const validationError = validForm(form)
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setIsSubmitting(true)
    try {
      const recaptchaToken = await recaptchaRef.current?.executeAsync?.()
      if (!recaptchaToken) throw new Error("Human verification failed. Please try again.")

      const ref = refRef.current || createRef()
      const name = splitName(form.fullName)
      const quoteData = {
        ...name,
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        location: form.location.trim(),
        destination: form.destination.trim(),
        moveType: form.moveType,
        bedrooms: form.bedrooms,
        moveDate: form.moveDate,
      }
      const response = await fetch("/api/wa-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref,
          placement,
          page: window.location.pathname,
          referrer: document.referrer,
          utm: getFormAttribution(),
          quoteData,
          whatsappConsent: true,
          recaptchaToken,
          ...getBotFields(),
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.success) {
        throw new Error(result.message || "We couldn't save your enquiry. Please try again.")
      }

      const reference = String(result.ref || ref)
      const tailoredMessage = buildWhatsAppMessage(quoteData, reference)
      setSavedRef(reference)
      setMessage(tailoredMessage)
      setSaved(true)
      gtmPushLead({
        formId: "whatsapp",
        source: "Web - WhatsApp",
        move_type: quoteData.moveType,
        bedrooms: quoteData.bedrooms,
        attribution: getFormAttribution(),
      })
    } catch (submitError) {
      setError(submitError?.message || "We couldn't save your enquiry. Please try again.")
    } finally {
      setIsSubmitting(false)
      recaptchaRef.current?.reset?.()
    }
  }

  const fieldClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#FF5000] focus:outline-none focus:ring-2 focus:ring-[#FF5000]/20"
  const labelClass = "mb-1 block text-xs font-semibold text-slate-700"

  return (
    <>
      <button
        {...buttonProps}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={handleOpen}
      >
        {children}
      </button>

      {isOpen && (
        <Portal>
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-4"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) setIsOpen(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-lg font-bold text-slate-900">Get a tailored WhatsApp quote</h2>
                <p className="mt-1 text-sm text-slate-600">Share your contact and move details. We’ll save your enquiry before opening WhatsApp.</p>
              </div>
              <button
                type="button"
                aria-label="Close WhatsApp enquiry"
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-2xl leading-none text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {!saved ? (
              <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {trap}
                <label className="sm:col-span-2">
                  <span className={labelClass}>Full name *</span>
                  <input autoFocus autoComplete="name" required maxLength={80} value={form.fullName} onChange={update("fullName")} className={fieldClass} />
                </label>
                <label>
                  <span className={labelClass}>WhatsApp number *</span>
                  <input type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} placeholder="+254 7XX XXX XXX" value={form.phoneNumber} onChange={update("phoneNumber")} className={fieldClass} />
                </label>
                <label>
                  <span className={labelClass}>Email *</span>
                  <input type="email" autoComplete="email" required maxLength={120} value={form.email} onChange={update("email")} className={fieldClass} />
                </label>
                <label>
                  <span className={labelClass}>Moving from *</span>
                  <input required maxLength={255} value={form.location} onChange={update("location")} className={fieldClass} placeholder="Westlands, Nairobi" />
                </label>
                <label>
                  <span className={labelClass}>Moving to *</span>
                  <input required maxLength={255} value={form.destination} onChange={update("destination")} className={fieldClass} placeholder="Karen, Nairobi" />
                </label>
                <label>
                  <span className={labelClass}>Move type *</span>
                  <select value={form.moveType} onChange={update("moveType")} className={fieldClass}>
                    {MOVE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Property size *</span>
                  <select value={form.bedrooms} onChange={update("bedrooms")} className={fieldClass}>
                    {BEDROOM_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Preferred move date *</span>
                  <input type="date" min={today} required value={form.moveDate} onChange={update("moveDate")} className={fieldClass} />
                </label>
                <label className="flex items-start gap-2 text-xs text-slate-600 sm:col-span-2">
                  <input type="checkbox" required checked={hasConsent} onChange={(event) => setHasConsent(event.target.checked)} className="mt-0.5 accent-[#FF5000]" />
                  <span>I agree that Taylor Movers may contact me on WhatsApp about this move enquiry. *</span>
                </label>
                <div className="sm:col-span-2">
                  <SafeRecaptcha ref={recaptchaRef} size="invisible" />
                </div>
                {error && <p role="alert" className="text-sm font-medium text-red-700 sm:col-span-2">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#FF5000] px-4 py-3 font-bold text-white hover:bg-[#D94300] disabled:cursor-wait disabled:opacity-60 sm:col-span-2"
                >
                  {isSubmitting ? "Saving your enquiry…" : "Save details & prepare WhatsApp message"}
                </button>
                <p className="text-xs text-slate-500 sm:col-span-2">Your details are used to respond to this move enquiry. WhatsApp opens only after your enquiry is saved.</p>
              </form>
            ) : (
              <div className="space-y-4">
                <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                  Enquiry saved. Reference: <strong>{savedRef}</strong>. Review the draft, then choose whether to send it to Taylor Movers.
                </p>
                <label htmlFor={`${formId}-message`} className={labelClass}>Your WhatsApp message</label>
                <textarea
                  id={`${formId}-message`}
                  rows={5}
                  maxLength={1000}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className={fieldClass}
                />
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`${BASE_HREF}?text=${encodeURIComponent(message)}`}
                    data-wa-click-tracked="true"
                    target={target || "_blank"}
                    rel={rel || "noopener noreferrer"}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-center font-bold text-white hover:bg-green-700"
                    onClick={() => {
                      gtmPushWhatsAppClick(savedRef || refRef.current, placement || "Website")
                      setIsOpen(false)
                    }}
                  >
                    Open WhatsApp to send
                  </a>
                  <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                    Done
                  </button>
                </div>
                <p className="text-xs text-slate-500">Your phone, email and move locations stay in the enquiry record; they are not added to the WhatsApp link.</p>
              </div>
            )}
          </section>
        </div>
        </Portal>
      )}
    </>
  )
}
