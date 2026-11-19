import React from "react"
import ReCAPTCHA from "react-google-recaptcha"

// Crash-proof wrapper: react-google-recaptcha THROWS on mount when sitekey
// is missing (blanked the production homepage when the env var wasn't set).
// Renders nothing without a key; callers must use
// recaptchaRef.current?.executeAsync?.() and handle a falsy token.
const SafeRecaptcha = React.forwardRef((props, ref) => {
  // The deployed key carried a trailing newline (k=...%0A in the widget URL); trim it.
  const siteKey = String(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "").trim()
  if (!siteKey) return null
  return <ReCAPTCHA ref={ref} {...props} sitekey={siteKey} />
})
SafeRecaptcha.displayName = "SafeRecaptcha"

export default SafeRecaptcha
