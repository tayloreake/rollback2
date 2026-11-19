import { useEffect, useState } from "react"
import { ATTRIBUTION_KEYS, getFormAttribution } from "../utils/attribution"

// T7 hidden attribution inputs for the Quote + Contact forms.
// Values come from the first-touch cookie (utils/attribution.js) with URL
// param fallback — the SAME source the server payload uses, so the DOM fields
// and the Zoho record can never disagree.
// Populated in an effect so SSR/hydration output stays identical.
export default function AttributionHiddenFields() {
  const [values, setValues] = useState({})

  useEffect(() => {
    setValues(getFormAttribution())
  }, [])

  return (
    <>
      {ATTRIBUTION_KEYS.map((key) => (
        <input
          key={key}
          type="hidden"
          name={key}
          value={values[key] || ""}
          readOnly
        />
      ))}
    </>
  )
}
