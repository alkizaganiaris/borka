import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: 'dfc32l7w',
  dataset: 'production',
  useCdn: false, // Set to false for development to get fresh data, set to true for production
  apiVersion: '2024-01-01',
})

// Helper for generating image URLs
const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)

