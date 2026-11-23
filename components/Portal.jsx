import { createPortal } from "react-dom"
import { useEffect, useState } from "react"

// Popups must escape transformed page content (e.g. main page transitions),
// otherwise position:fixed is anchored to that content instead of the viewport.
export default function Portal({ children }) {
  const [target, setTarget] = useState(null)

  useEffect(() => {
    setTarget(document.getElementById("modal-root") || document.body)
  }, [])

  return target ? createPortal(children, target) : null
}
