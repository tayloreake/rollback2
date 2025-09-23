// BACKUP: Original Navbar mainServicesItems configuration with specialized services
// This was the original mainServicesItems array before removal

const mainServicesItems = [
    { name: 'Residential Moving', href: '/services/residential-moving' },
    { name: 'Office Relocation', href: '/services/office-relocation' },
    { name: 'Corporate Staff Relocation', href: '/services/corporate-staff-relocation' },
    { name: 'International Moving', href: '/services/international-moving' },
    { name: 'Storage Services', href: '/services/storage-services' },
    { 
        name: 'Specialized Services', 
        href: '/services/specialized-services',
        hasSubmenu: true,
        submenu: [
            { name: 'Furniture Assembly', href: '/services/furniture-assembly' },
            { name: 'Piano Moving', href: '/services/piano-moving' },
            { name: 'Pet Relocation', href: '/services/pet-relocation' },
            { name: 'Packing Services', href: '/services/packing-services' }
        ]
    },
    { name: 'Consolidated Moves', href: '/services/consolidated-moves' }
]

// Also needed these state variables:
// const [specializedSubmenuOpen, setSpecializedSubmenuOpen] = useState(false)
// const [mobileSpecializedOpen, setMobileSpecializedOpen] = useState(false)

// And the submenu handling logic in the dropdown and mobile menu components