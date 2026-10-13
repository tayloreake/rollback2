import React from "react"
import ReCAPTCHA from "react-google-recaptcha"

// Crash-proof wrapper: react-google-recaptcha THROWS on mount when sitekey
// is missing (blanked the production homepage when the env var wasn't set).
// Renders nothing without a key; callers must use
// recaptchaRef.current?.executeAsync?.() and handle a falsy token.
const SafeRecaptcha = React.forwardRef((props, ref) => {
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return null
  return <ReCAPTCHA ref={ref} {...props} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
})
SafeRecaptcha.displayName = "SafeRecaptcha"

export default SafeRecaptcha
