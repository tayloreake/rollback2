// moment replacement (saves ~230KB): Intl-based date formatting.
export const formatDate = (value, style = "MMM DD, YYYY") => {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  if (style === "MMMM DD, YYYY")
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "2-digit", year: "numeric" }).format(d)
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(d)
}
