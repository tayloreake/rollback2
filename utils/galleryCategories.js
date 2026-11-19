// Single source of truth for the website gallery categories.
// Imported by the Sanity schema + Studio structure AND the public gallery page,
// so adding a category here updates the dropdown, the Studio menu and the tabs.
// `id` is the stored value in Sanity - never change an existing id.
export const GALLERY_CATEGORIES = [
  { id: "household-moves", title: "Household Moves" },
  { id: "office-moves", title: "Office Moves" },
  { id: "staff-relocation", title: "Staff Relocation" },
  { id: "cross-border-moves", title: "Cross-Border Moves" },
  { id: "international-moves", title: "International Moves" },
  { id: "crating-services", title: "Crating Services" },
]

export const categoryTitle = (id) => GALLERY_CATEGORIES.find((c) => c.id === id)?.title || id
