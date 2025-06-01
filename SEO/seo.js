import Head from "next/head"
import keywords from "./keywords"
import descriptions from "./descriptions"

const getPageMetadata = (pageName) => {
  const capitalizedPageName =
    pageName.charAt(0).toUpperCase() + pageName.slice(1)
  const pageKeywords = keywords[pageName] || []
  const pageDescription = descriptions[pageName] || ""

  return (
    <Head>
      <title>{capitalizedPageName == "Home" && "Taylor Movers" || capitalizedPageName == "About" && "About Taylor Movers" || capitalizedPageName == "OurBlog" && "Taylor Movers Handy Blog"} Page</title>
      <meta name='keywords' content={pageKeywords.join(", ")} />
      <meta name='description' content={pageDescription} />
    </Head>
  )
}
export const generateServicesPageMetadata = (serviceKeys) => {
  const title = "Services Page"
  const kw = serviceKeys
    .map((key) => keywords[key] || [])
    .reduce((acc, val) => acc.concat(val), [])
  const pageDescription = "Explore our various services in Nairobi, Kenya."

  return (
    <Head>
      <title>{title == "Home" && "Taylor Movers" || title == "About" && "About Taylor Movers" || title == "ourBlog" && "Taylor Movers Handy Blog"}</title>
      <meta name='keywords' content={kw.join(", ")} />
      <meta name='description' content={pageDescription} />
      {/* Add more meta tags as needed */}
    </Head>
  )
}

export default getPageMetadata
