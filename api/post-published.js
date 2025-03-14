import { default as algoliasearch } from 'algoliasearch';

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Verify the secret key (optional but recommended)
  const secretKey = req.query.key;
  if (secretKey !== process.env.VERCEL_SECRET_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { post } = req.body.current;

  try {
    // Transform the post into an Algolia record
    const record = {
      objectID: post.id,
      title: post.title,
      slug: post.slug,
      html: post.html,
      excerpt: post.excerpt,
      tags: post.tags,
      authors: post.authors,
      created_at: post.created_at,
      updated_at: post.updated_at,
      published_at: post.published_at,
    };

    // Save the record to Algolia
    await index.saveObject(record);

    return res.status(200).json({ message: 'Post indexed successfully' });
  } catch (error) {
    console.error('Error indexing post:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};