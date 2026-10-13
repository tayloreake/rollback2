import React, { useState } from "react"

// Drop-in replacement for the react-bootstrap Tabs/Tab subset used on this
// site (defaultActiveKey + onSelect). Saves ~100KB+ of bootstrap JS.
export const Tab = ({ children }) => <>{children}</>

const Tabs = ({ children, defaultActiveKey, activeKey: controlledKey, onSelect, className = "", id }) => {
  const [inner, setInner] = useState(defaultActiveKey)
  const active = controlledKey !== undefined ? controlledKey : inner
  const tabs = React.Children.toArray(children).filter(Boolean)
  const current = tabs.find((t) => t.props.eventKey === active) || tabs[0]

  return (
    <div id={id}>
      <div className={`flex gap-1 overflow-x-auto ${className}`} role="tablist">
        {tabs.map((t, i) => {
          const key = t.props.eventKey ?? i
          const selected = key === (current?.props.eventKey ?? i)
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                if (controlledKey === undefined) setInner(key)
                onSelect?.(key)
                t.props.onSelect?.()
              }}
              className={`whitespace-nowrap px-3 md:px-5 py-1 rounded-3xl mb-2 transition-colors ${
                selected ? "bg-[#FF5000] text-white" : "bg-[#6D6E71] text-white hover:bg-[#FF5000]"
              }`}
            >
              {t.props.title}
            </button>
          )
        })}
      </div>
      <div className={current?.props.className || ""} role="tabpanel">
        {current?.props.children}
      </div>
    </div>
  )
}

export default Tabs
