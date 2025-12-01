import { sanityClient } from './sanity'

// Fetch all published journal entries
export async function getJournalEntries() {
  const query = `*[_type == "journalEntry" && published == true] | order(date desc) {
    _id,
    title,
    date,
    content,
    categories,
    "authorName": author->name
  }`
  return await sanityClient.fetch(query)
}

// Fetch all published photography galleries
export async function getPhotographyGalleries() {
  const query = `*[_type == "photographyGallery" && published == true] {
    _id,
    title,
    subtitle,
    filmUsed,
    year,
    description,
    order,
    _updatedAt,
    images[] {
      asset->{
        _id,
        url
      }
    }
  }`
  const galleries = await sanityClient.fetch(query)
  
  // Sort by order first, then by _updatedAt desc (newest first) as tiebreaker
  return galleries.sort((a, b) => {
    // First sort by order
    if (a.order !== b.order) {
      return (a.order || 0) - (b.order || 0)
    }
    // If order is the same, sort by _updatedAt desc (newest first)
    const dateA = new Date(a._updatedAt || 0).getTime()
    const dateB = new Date(b._updatedAt || 0).getTime()
    return dateB - dateA
  })
}

// Fetch all ceramic projects
export async function getCeramicProjects() {
  const query = `*[_type == "ceramicProject" && published == true] | order(_createdAt desc) {
    _id,
    title,
    subtitle,
    description,
    status,
    price,
    images[] {
      _key,
      alt,
      "url": asset->url,
      "height": asset->metadata.dimensions.height
    },
    heroVideo {
      asset->{
        _id,
        url,
        mimeType
      }
    }
  }`

  return await sanityClient.fetch(query)
}

