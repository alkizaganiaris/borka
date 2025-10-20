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

