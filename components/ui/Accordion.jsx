import React, { useState } from "react"

// Drop-in replacement for the react-bootstrap Accordion subset used here
// (defaultActiveKey, single expanded). Saves ~100KB+ of bootstrap JS.
const Ctx = React.createContext({ openKey: null, toggle: () => {} })

export const Item = ({ eventKey, children }) => <>{children}</>
export const Header = ({ children, className = "" }) => {
  const { toggle } = React.useContext(Ctx)
  return (
    <button type="button" onClick={toggle} className={`w-full text-left ${className}`}>
      {children}
    </button>
  )
}
export const Body = ({ children, className = "" }) => {
  const { open } = React.useContext(Ctx)
  if (!open) return null
  return <div className={className}>{children}</div>
}

const AccordionItem = ({ eventKey, children, openKey, setOpenKey }) => {
  const open = openKey === eventKey
  const toggle = () => setOpenKey(open ? null : eventKey)
  return <Ctx.Provider value={{ open, openKey, toggle }}><div>{children}</div></Ctx.Provider>
}

const Accordion = ({ children, defaultActiveKey, className = "", id }) => {
  const [openKey, setOpenKey] = useState(defaultActiveKey ?? null)
  return (
    <div className={className} id={id}>
      {React.Children.toArray(children).filter(Boolean).map((child, i) => (
        <AccordionItem key={child.props.eventKey ?? i} eventKey={child.props.eventKey} openKey={openKey} setOpenKey={setOpenKey}>
          {child.props.children}
        </AccordionItem>
      ))}
    </div>
  )
}

Accordion.Item = Item
Accordion.Header = Header
Accordion.Body = Body

export default Accordion
