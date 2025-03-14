const { default: algoliasearch } = require('algoliasearch');

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Verify the secret key
  const secretKey = req.query.key;
  if (secretKey !== process.env.VERCEL_SECRET_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { post } = req.body.current;

  try {
    // Delete the post from Algolia
    await index.deleteObject(post.id);

    return res.status(200).json({ message: 'Post removed from index' });
  } catch (error) {
    console.error('Error removing post:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};