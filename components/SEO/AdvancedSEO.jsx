import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'

const AdvancedSEO = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noindex = false,
  breadcrumbs = [],
  faqData = [],
  articleData = null,
  localBusinessData = null,
  serviceData = null,
  alternateLanguages = []
}) => {
  const router = useRouter()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taylorea.com'
  const currentUrl = `${siteUrl}${router.asPath}`

  // Generate canonical URL
  const canonicalUrl = canonical || currentUrl.split('?')[0] // Remove query params

  // Default meta tags
  const defaultTitle = "Taylor Movers - Your Trusted Professional House, office & International movers."
  const defaultDescription = "Looking for reliable moving companies in Kenya? Taylor Movers Nairobi offers safe, affordable, stress-free relocations locally & abroad since 2008."
  const defaultKeywords = [
    "professional movers Nairobi Kenya",
    "household moving services Kenya",
    "office relocation Nairobi",
    "international moving Kenya",
    "packing services Nairobi",
    "storage solutions Kenya",
    "logistics company Kenya"
  ]

  const metaTitle = title || defaultTitle
  const metaDescription = description || defaultDescription
  const metaKeywords = keywords.length > 0 ? keywords : defaultKeywords

  // Generate structured data
  const generateStructuredData = () => {
    const data = []

    // Organization/Local Business Schema
    if (localBusinessData) {
      data.push({
        "@context": "https://schema.org",
        "@type": "MovingCompany",
        "name": "Taylor Movers Kenya",
        "description": "Professional moving and relocation services in Nairobi, Kenya",
        "url": siteUrl,
        "logo": `${siteUrl}/assets/logos/header-logo.jpg`,
        "image": ogImage || `${siteUrl}/assets/logos/header-logo.jpg`,
        "telephone": localBusinessData.phone || "+254721410517",
        "email": "info@taylorea.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": localBusinessData.address?.street || "Nairobi, Kenya",
          "addressLocality": "Nairobi",
          "addressRegion": "Nairobi",
          "postalCode": localBusinessData.address?.zip || "00100",
          "addressCountry": "KE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": localBusinessData.geo?.lat || "-1.2864",
          "longitude": localBusinessData.geo?.lng || "36.8172"
        },
        "openingHours": "Mo-Fr 08:00-18:00",
        "priceRange": "$$",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150"
        },
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "-1.2864",
            "longitude": "36.8172"
          },
          "geoRadius": "500000"
        }
      })
    }

    // Service Schema
    if (serviceData) {
      data.push({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceData.name,
        "description": serviceData.description,
        "provider": {
          "@type": "MovingCompany",
          "name": "Taylor Movers Kenya"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Kenya"
        },
        "serviceType": serviceData.type || "Moving Service"
      })
    }

    // Article Schema
    if (articleData) {
      data.push({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.title,
        "description": articleData.description,
        "image": articleData.image,
        "datePublished": articleData.publishDate,
        "dateModified": articleData.modifiedDate,
        "author": {
          "@type": "Person",
          "name": articleData.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Taylor Movers Kenya",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/assets/logos/header-logo.jpg`
          }
        }
      })
    }

    // FAQ Schema
    if (faqData.length > 0) {
      data.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      })
    }

    // Breadcrumb Schema
    if (breadcrumbs.length > 0) {
      data.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": `${siteUrl}${crumb.url}`
        }))
      })
    }

    // Custom structured data
    if (structuredData) {
      data.push(...structuredData)
    }

    return data
  }

  const structuredDataJson = generateStructuredData()

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords.join(', ')} />
        <meta name="author" content="Taylor Movers Kenya" />
        <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />
        <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Alternate Language Links */}
        {alternateLanguages.map(lang => (
          <link
            key={lang.code}
            rel="alternate"
            hreflang={lang.code}
            href={lang.url}
          />
        ))}

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Taylor Movers Kenya" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {ogImage && <meta property="og:image:width" content="1200" />}
        {ogImage && <meta property="og:image:height" content="630" />}
        <meta property="og:locale" content="en_KE" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <meta name="twitter:site" content="@taylormoverske" />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#F05423" />
        <meta name="msapplication-TileColor" content="#F05423" />
        <meta name="application-name" content="Taylor Movers Kenya" />

        {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="KE-30" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="geo.position" content="-1.2864;36.8172" />
        <meta name="ICBM" content="-1.2864, 36.8172" />

        {/* Business Specific Meta Tags */}
        <meta name="business:contact_data:street_address" content="Nairobi, Kenya" />
        <meta name="business:contact_data:locality" content="Nairobi" />
        <meta name="business:contact_data:region" content="Nairobi" />
        <meta name="business:contact_data:postal_code" content="00100" />
        <meta name="business:contact_data:country_name" content="Kenya" />
        <meta name="business:contact_data:phone_number" content="+254721410517" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </Head>

      {/* Structured Data JSON-LD */}
      {structuredDataJson.map((data, index) => (
        <Script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2)
          }}
        />
      ))}

      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXXXXX'}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXXXXX'}', {
            page_title: '${metaTitle}',
            page_location: '${currentUrl}',
            custom_map: {'dimension1': 'page_type'}
          });
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID || 'XXXXXXXXXX'}");
        `}
      </Script>
    </>
  )
}

export default AdvancedSEO