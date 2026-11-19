// Enhanced SEO utilities with location-based and competitive keywords
import keywords from './keywords'
import descriptions from './descriptions'

// Location-based keywords for local SEO dominance
const locationKeywords = {
  nairobi: [
    'Nairobi', 'Karen', 'Westlands', 'Kileleshwa', 'Kilimani', 'Lavington', 
    'Runda', 'Muthaiga', 'Spring Valley', 'Parklands', 'Eastleigh', 'South C',
    'South B', 'Langata', 'Ngong Road', 'Upperhill', 'CBD', 'Industrial Area'
  ],
  kenya: [
    'Kenya', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos',
    'Nyeri', 'Meru', 'Embu', 'Garissa', 'Malindi', 'Lamu', 'Kitale'
  ],
  regions: [
    'East Africa', 'Central Kenya', 'Coast Region', 'Western Kenya',
    'Rift Valley', 'Northern Kenya', 'Nyanza Region'
  ]
}

// Competitive keywords to outrank competitors
const competitiveKeywords = {
  primary: [
    'best movers in Kenya',
    'top moving company Nairobi',
    'professional movers Kenya',
    'reliable moving services',
    'affordable movers Nairobi',
    'experienced moving company',
    'trusted movers Kenya',
    'leading moving services'
  ],
  services: [
    'household moving specialists',
    'office relocation experts',
    'international moving services',
    'corporate relocation solutions',
    'warehousing and storage',
    'packing and unpacking services',
    'furniture moving services',
    'appliance moving specialists'
  ],
  longTail: [
    'how much does it cost to move in Nairobi',
    'best moving company for office relocation Kenya',
    'professional household movers in Nairobi',
    'international moving services from Kenya',
    'reliable moving company with storage',
    'affordable office moving services Nairobi',
    'experienced house movers in Kenya',
    'top rated moving company East Africa'
  ]
}

// Generate dynamic page titles with location and service optimization
export const generateOptimizedTitle = (page, location = 'Nairobi', service = null) => {
  const year = new Date().getFullYear()
  
  const titleTemplates = {
    home: [
      `Taylor Movers - Your Trusted Professional House, office & International movers.`,
      `Taylor Movers ${location} | Your Trusted Professional House, office & International movers.`,
      `Professional House, office & International movers | Taylor Movers ${location}`
    ],
    about: [
      `About Taylor Movers - Your Trusted Professional House, office & International movers.`,
      `About Taylor Movers ${location} | Your Trusted Professional movers since 2008`,
      `Learn About Taylor Movers - Safe, Affordable, Stress-free Relocations`
    ],
    services: [
      `Professional Moving Services in ${location}, Kenya | Taylor Movers`,
      `Complete Moving Solutions ${location} | Household, Office & International`,
      `${location} Moving Services - Reliable, Fast & Affordable | Taylor Movers`
    ],
    quote: [
      `Get Free Moving Quote ${location} | Professional Movers | Taylor Movers`,
      `Request Moving Estimate ${location} Kenya | Best Rates Guaranteed`,
      `Free Moving Quote ${location} - Compare Our Rates | Taylor Movers`
    ],
    contact: [
      `Contact Taylor Movers ${location} | Your Trusted Professional House, office & International movers.`,
      `Get In Touch - Taylor Movers ${location} | Safe, Affordable, Stress-free Relocations`,
      `Contact Taylor Movers | Professional Moving Services ${location} | Call +254 721 410 517`
    ],
    blog: [
      `Moving Tips & Guides ${location} | Expert Advice | Taylor Movers Blog`,
      `Professional Moving Blog ${location} Kenya | Tips from the Experts`,
      `Moving Resources & Guides | Taylor Movers ${location} Blog`
    ]
  }

  if (service) {
    const serviceTemplates = {
      'household-moving': [
        `Professional Household Moving ${location} | Best House Movers Kenya`,
        `Reliable Home Moving Services ${location} | Taylor Movers`,
        `Expert House Movers ${location} Kenya | Safe & Secure Relocation`
      ],
      'office-moving': [
        `Professional Office Moving ${location} | Business Relocation Experts`,
        `Office Relocation Services ${location} Kenya | Minimize Downtime`,
        `Expert Office Movers ${location} | Corporate Relocation Solutions`
      ],
      'corporate-moving': [
        `Corporate Relocation Services ${location} | Enterprise Moving Solutions`,
        `Business Moving Experts ${location} Kenya | Corporate Relocations`,
        `Professional Corporate Movers ${location} | Large Scale Relocations`
      ],
      'warehousing-and-storage': [
        `Secure Storage & Warehousing ${location} | Professional Storage Solutions`,
        `Storage Services ${location} Kenya | Warehouse & Document Storage`,
        `Professional Warehousing ${location} | Secure Storage Facilities`
      ],
      'piano-moving': [
        `Professional Piano Moving Services ${location} | Safe Piano Transport Kenya`,
        `Expert Piano Movers ${location} | Grand & Upright Piano Specialists`,
        `Piano Transport Services ${location} Kenya | Specialized Piano Movers`
      ],
      'pet-relocation': [
        `Professional Pet Relocation Services ${location} | Safe Pet Transport Kenya`,
        `Pet Moving Services ${location} Kenya | Licensed Pet Transport`,
        `Expert Pet Relocation ${location} | International Pet Shipping`
      ],
      'packing-services': [
        `Professional Packing Services ${location} | Expert Packers Kenya`,
        `Home Packing Services ${location} Kenya | Professional Packers`,
        `Expert Packing & Unpacking ${location} | Fragile Item Specialists`
      ],
      'furniture-assembly': [
        `Professional Furniture Assembly Services ${location} | Expert Assembly Kenya`,
        `IKEA Furniture Assembly ${location} Kenya | Professional Assembly`,
        `Expert Furniture Assembly ${location} | All Brands & Types`
      ]
    }
    
    return serviceTemplates[service] 
      ? serviceTemplates[service][Math.floor(Math.random() * serviceTemplates[service].length)]
      : titleTemplates[page][0]
  }

  const templates = titleTemplates[page] || titleTemplates.home
  return templates[Math.floor(Math.random() * templates.length)]
}

// Generate enhanced meta descriptions with call-to-actions
export const generateOptimizedDescription = (page, location = 'Nairobi', service = null) => {
  const year = new Date().getFullYear()
  
  const descriptionTemplates = {
    home: [
      `Looking for reliable moving companies in Kenya? Taylor Movers Nairobi offers safe, affordable, stress-free relocations locally & abroad since 2008.`,
      `Looking for reliable moving companies in ${location}? Taylor Movers offers safe, affordable, stress-free relocations locally & abroad since 2008.`,
      `Taylor Movers ${location} - Your trusted professional movers offering safe, affordable, stress-free relocations locally & internationally since 2008.`
    ],
    about: [
      `Learn about Taylor Movers Kenya - Your trusted moving company offering safe, affordable, stress-free relocations locally & abroad since 2008.`,
      `Discover Taylor Movers ${location} - Professional house, office & international movers providing reliable relocation services since 2008.`,
      `About Taylor Movers: Your trusted partner for safe, affordable moving services in ${location} and internationally since 2008.`
    ],
    services: [
      `Complete moving services in ${location}, Kenya. Household, office, corporate & international relocations. Professional packing, storage & insurance. Get quote now!`,
      `Professional moving solutions ${location} Kenya. From small apartments to large offices - we handle it all. Licensed, insured & experienced movers.`
    ],
    quote: [
      `Get your free moving quote for ${location}, Kenya in under 5 minutes. Professional movers with transparent pricing. No hidden fees. Call +254 721 410 517 now!`,
      `Request free moving estimate ${location} Kenya. Professional movers offering competitive rates for household, office & international moves. Quote in minutes!`
    ],
    contact: [
      `Contact Taylor Movers ${location} for professional moving services. Call +254 721 410 517 or email info@taylorea.com. Safe, affordable relocations since 2008.`,
      `Get in touch with your trusted movers. Taylor Movers ${location} offers reliable moving services locally & internationally. Free consultations available.`,
      `Contact Taylor Movers for stress-free relocations in ${location} and abroad. Professional house, office & international moving services since 2008.`
    ]
  }

  if (service) {
    const serviceDescriptions = {
      'household-moving': [
        `Professional household moving services ${location}, Kenya. Expert packers, secure transport, storage options. ✓ Licensed ✓ Insured ✓ 10+ years experience. Free quote!`,
        `Reliable house movers ${location} Kenya. Complete home relocation services including packing, moving & unpacking. Same-day service available. Call now!`
      ],
      'office-moving': [
        `Expert office moving services ${location}, Kenya. Minimize downtime with our professional business relocation team. IT equipment specialists. Get free quote!`,
        `Professional office relocation ${location} Kenya. Corporate moving experts handling everything from small offices to large enterprises. Weekend moves available.`
      ],
      'corporate-moving': [
        `Corporate relocation specialists ${location}, Kenya. Large-scale business moves, employee relocations, project management. Trusted by 500+ companies. Quote now!`,
        `Enterprise moving solutions ${location} Kenya. Professional corporate relocations with dedicated project managers. Minimize business disruption.`
      ],
      'warehousing-and-storage': [
        `Secure storage & warehousing ${location}, Kenya. Climate-controlled facilities, 24/7 security, flexible terms. Document storage specialists. Visit our facility!`,
        `Professional storage solutions ${location} Kenya. Short & long-term warehousing for household & business items. Secure, clean, accessible facilities.`
      ],
      'piano-moving': [
        `Expert piano moving services in ${location} with specialized equipment and trained professionals. Safe transport for grand, upright, and digital pianos across Kenya.`,
        `Professional piano movers in ${location} offering secure transport for all piano types. Fully insured with specialized equipment and experienced technicians.`,
        `Specialized piano transport services in ${location} with expert handling, protective equipment, and professional tuning coordination.`
      ],
      'pet-relocation': [
        `Professional pet relocation services in ${location} with expert care and safe transport. Licensed pet movers serving all of Kenya with international options.`,
        `Trusted pet moving services in ${location} offering stress-free relocation for dogs, cats, and exotic pets. Fully licensed and insured pet transport.`,
        `Expert pet relocation in ${location} with veterinary partnerships, climate-controlled transport, and comprehensive care throughout the journey.`
      ],
      'packing-services': [
        `Professional packing services in ${location} with expert packers and premium materials. Specializing in fragile items, artwork, and valuable possessions.`,
        `Expert packing and unpacking services in ${location} using professional-grade materials. Custom solutions for delicate and valuable items.`,
        `Professional home packing services in ${location} with trained packers, quality materials, and specialized techniques for all item types.`
      ],
      'furniture-assembly': [
        `Professional furniture assembly services in ${location} for all brands including IKEA, Jumia, and custom furniture. Expert technicians with all tools provided.`,
        `Expert furniture assembly in ${location} with experienced technicians, quality tools, and satisfaction guarantee. All furniture brands and types.`,
        `Professional furniture assembly services in ${location} offering efficient, reliable assembly for home and office furniture with cleanup included.`
      ]
    }
    
    return serviceDescriptions[service] 
      ? serviceDescriptions[service][Math.floor(Math.random() * serviceDescriptions[service].length)]
      : descriptionTemplates[page][0]
  }

  const templates = descriptionTemplates[page] || descriptionTemplates.home
  return templates[Math.floor(Math.random() * templates.length)]
}

// Generate enhanced keywords combining location, service, and competitive terms
export const generateEnhancedKeywords = (page, location = 'Nairobi', service = null) => {
  const baseKeywords = keywords[page] || keywords.home
  const locationTerms = [
    ...locationKeywords.nairobi.filter(loc => 
      location.toLowerCase().includes(loc.toLowerCase()) || loc.toLowerCase().includes(location.toLowerCase())
    ),
    ...locationKeywords.kenya,
    ...locationKeywords.regions
  ]
  
  const competitive = [
    ...competitiveKeywords.primary,
    ...competitiveKeywords.services,
    ...competitiveKeywords.longTail.slice(0, 3) // Limit long-tail to avoid keyword stuffing
  ]

  // Service-specific keywords
  let serviceKeywords = []
  if (service) {
    const serviceKeywordMap = {
      'household-moving': [
        'house movers', 'home relocation', 'residential moving', 'furniture movers',
        'apartment moving', 'villa relocation', 'domestic moving', 'household goods'
      ],
      'office-moving': [
        'office relocation', 'business moving', 'commercial movers', 'workplace relocation',
        'IT equipment moving', 'cubicle relocation', 'office furniture moving'
      ],
      'corporate-moving': [
        'corporate relocation', 'enterprise moving', 'business relocation', 'company moving',
        'staff relocation', 'employee moving', 'corporate services'
      ],
      'warehousing-and-storage': [
        'storage services', 'warehouse storage', 'document storage', 'furniture storage',
        'business storage', 'climate controlled storage', 'secure storage'
      ],
      'piano-moving': [
        'piano movers', 'piano transport', 'grand piano moving', 'upright piano movers',
        'piano relocation', 'musical instrument moving', 'piano specialists', 'safe piano transport'
      ],
      'pet-relocation': [
        'pet moving', 'pet transport', 'animal relocation', 'pet shipping', 'dog moving',
        'cat transport', 'pet travel', 'animal moving services', 'pet logistics'
      ],
      'packing-services': [
        'professional packing', 'packing services', 'home packing', 'fragile packing',
        'packing materials', 'unpacking services', 'moving packing', 'expert packers'
      ],
      'furniture-assembly': [
        'furniture assembly', 'IKEA assembly', 'furniture installation', 'furniture setup',
        'bed assembly', 'wardrobe assembly', 'furniture experts', 'assembly services'
      ]
    }
    serviceKeywords = serviceKeywordMap[service] || []
  }

  // Combine all keywords intelligently
  const combinedKeywords = [
    ...baseKeywords.slice(0, 5), // Limit base keywords
    ...locationTerms.slice(0, 8), // Top location terms
    ...competitive.slice(0, 6), // Top competitive terms
    ...serviceKeywords.slice(0, 5), // Service-specific terms
    // Location + service combinations
    `${service ? service.replace('-', ' ') : 'moving services'} ${location}`,
    `professional movers ${location}`,
    `best moving company ${location}`,
    `${location} relocation services`,
    `moving services Kenya`
  ].filter(Boolean)

  // Remove duplicates and return
  return [...new Set(combinedKeywords)]
}

// Generate FAQ data for structured data
export const generateFAQData = (page, service = null) => {
  const generalFAQs = [
    {
      question: "How much does it cost to move in Nairobi?",
      answer: "Moving costs in Nairobi vary based on distance, volume, and services needed. Taylor Movers offers competitive rates starting from KSh 15,000 for small moves. Contact us for a free, personalized quote."
    },
    {
      question: "Do you provide packing materials?",
      answer: "Yes, we provide all necessary packing materials including boxes, bubble wrap, packing paper, and protective covers. Our professional packers ensure your items are safely secured."
    },
    {
      question: "Are you licensed and insured?",
      answer: "Yes, Taylor Movers is fully licensed and insured. We carry comprehensive insurance to protect your belongings during the move, giving you complete peace of mind."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 1-2 weeks in advance, especially during peak moving seasons. However, we also accommodate last-minute moves based on availability."
    }
  ]

  const serviceFAQs = {
    'household-moving': [
      {
        question: "What's included in household moving services?",
        answer: "Our household moving includes packing, loading, transportation, unloading, and unpacking. We also provide furniture assembly/disassembly and can arrange storage if needed."
      },
      {
        question: "How do you protect fragile items during house moves?",
        answer: "We use specialized packing materials, custom crating for valuable items, and professional handling techniques. All fragile items are clearly labeled and handled with extra care."
      }
    ],
    'office-moving': [
      {
        question: "How do you minimize business downtime during office moves?",
        answer: "We plan moves during weekends or after hours, use systematic labeling, and coordinate with your IT team. Our goal is to have your office operational within 24 hours."
      },
      {
        question: "Do you handle IT equipment and servers?",
        answer: "Yes, our team includes IT equipment specialists who can safely disconnect, move, and reconnect computers, servers, and other electronic equipment."
      }
    ]
  }

  const serviceFAQData = service ? serviceFAQs[service] || [] : []
  return [...generalFAQs.slice(0, 4), ...serviceFAQData]
}

// Generate breadcrumb data
export const generateBreadcrumbs = (router) => {
  const paths = router.asPath.split('/').filter(Boolean)
  const breadcrumbs = [{ name: 'Home', url: '/' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const name = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ')
    breadcrumbs.push({ name, url: currentPath })
  })
  
  return breadcrumbs
}

// Export enhanced SEO utilities
export const enhancedSEO = {
  generateOptimizedTitle,
  generateOptimizedDescription,
  generateEnhancedKeywords,
  generateFAQData,
  generateBreadcrumbs,
  competitiveKeywords,
  locationKeywords
}

export default enhancedSEO