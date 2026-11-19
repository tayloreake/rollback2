import { useRef, useCallback } from "react"
import React from "react"

// Invisible bot trap: a hidden "website" field humans never fill plus the time
// the form has been on screen. The server (utils/spamGuard.botSignals) treats a
// filled honeypot or a sub-1.5s submit as a bot. Spread getBotFields() into the
// JSON body of the submit request and render {trap} inside the <form>.
export default function useBotTrap() {
  const startedAt = useRef(typeof Date !== "undefined" ? Date.now() : 0)
  const inputRef = useRef(null)
  const getBotFields = useCallback(
    () => ({
      website: inputRef.current ? String(inputRef.current.value || "") : "",
      elapsedMs: Date.now() - startedAt.current,
    }),
    []
  )
  const trap = (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input ref={inputRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
  return { trap, getBotFields }
}
