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
  const query = `*[_type == "photographyGallery" && published == true] | order(order asc) {
    _id,
    title,
    subtitle,
    filmUsed,
    year,
    description,
    order,
    images[] {
      asset->{
        _id,
        url
      }
    }
  }`
  return await sanityClient.fetch(query)
}
i
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

