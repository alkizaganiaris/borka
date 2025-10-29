// Quick test script to verify Sanity connection
import { sanityClient } from './src/lib/sanity.ts';

async function testConnection() {
  try {
    console.log('Testing Sanity connection...');
    console.log('Project ID: dfc32l7w');
    console.log('Dataset: production');
    
    // Test query - count photography galleries
    const galleries = await sanityClient.fetch(`*[_type == "photographyGallery"]`);
    console.log(`\n✅ Connection successful!`);
    console.log(`Found ${galleries.length} photography galleries`);
    
    if (galleries.length > 0) {
      console.log('\nFirst gallery:', {
        id: galleries[0]._id,
        title: galleries[0].title,
        published: galleries[0].published,
        imageCount: galleries[0].images?.length || 0
      });
    } else {
      console.log('\n⚠️  No galleries found. Make sure:');
      console.log('1. You have galleries in Sanity Studio');
      console.log('2. They have images added');
      console.log('3. They are saved (published checkbox is optional since we removed the filter)');
    }
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. CORS not configured - Go to https://sanity.io/manage and add your localhost to CORS origins');
    console.log('2. Project ID or dataset mismatch');
    console.log('3. Network issue');
  }
}

testConnection();

