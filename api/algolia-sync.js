const algoliasearch = require('algoliasearch');
const GhostContentAPI = require('@tryghost/content-api');

module.exports = async (req, res) => {
    console.log('--- Webhook Received ---');
    console.log('Request Method:', req.method);
    console.log('Request Query:', req.query);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    if (req.method !== 'POST') {
        console.error('Invalid HTTP Method:', req.method);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const secretKey = req.query.key;
    console.log('Received Secret Key:', secretKey);
    console.log('Expected Secret Key:', process.env.VERCEL_SECRET_KEY);

    if (secretKey !== process.env.VERCEL_SECRET_KEY) {
        console.error('Unauthorized Access - Invalid Secret Key');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const requiredEnvVars = [
        'ALGOLIA_APP_ID',
        'ALGOLIA_ADMIN_KEY',
        'ALGOLIA_INDEX_NAME',
        'GHOST_API_URL',
        'GHOST_CONTENT_API_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
        console.error('Missing Environment Variables:', missingEnvVars);
        return res.status(500).json({
            message: 'Server Configuration Error',
            missingVars: missingEnvVars
        });
    }

    // Initialize clients
    let client, index, ghost;
    try {
        client = algoliasearch(
            process.env.ALGOLIA_APP_ID,
            process.env.ALGOLIA_ADMIN_KEY
        );
        index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

        ghost = new GhostContentAPI({
            url: process.env.GHOST_API_URL,
            key: process.env.GHOST_CONTENT_API_KEY,
            version: 'v5.0'
        });
    } catch (initError) {
        console.error('Client Initialization Error:', initError);
        return res.status(500).json({
            message: 'Client Initialization Failed',
            error: initError.message
        });
    }

    try {
        if (!req.body || !req.body.current || !req.body.current.post) {
            console.error('Invalid Webhook Payload', req.body);
            return res.status(400).json({
                message: 'Invalid Webhook Payload',
                receivedBody: req.body
            });
        }

        const { post } = req.body.current;
        const event = req.body.event;

        console.log('Event Type:', event);
        console.log('Post ID:', post.id);
        console.log('Post Title:', post.title);

        switch (event) {
            case 'post.published':
                console.log('Attempting to fetch full post details...');
                let fullPost;
                try {
                    fullPost = await ghost.posts.read({
                        id: post.id,
                        include: 'tags,authors'
                    });
                    console.log('Full Post Retrieved:', JSON.stringify(fullPost, null, 2));
                } catch (fetchError) {
                    console.error('Error Fetching Full Post:', fetchError);
                    return res.status(500).json({
                        message: 'Failed to fetch post details',
                        error: fetchError.message
                    });
                }

                const record = {
                    objectID: fullPost.id,
                    title: fullPost.title,
                    slug: fullPost.slug,
                    html: fullPost.html,
                    excerpt: fullPost.excerpt,
                    content: fullPost.plaintext,
                    tags: fullPost.tags ? fullPost.tags.map(tag => tag.name) : [],
                    authors: fullPost.authors ? fullPost.authors.map(author => author.name) : [],
                    created_at: fullPost.created_at,
                    updated_at: fullPost.updated_at,
                    published_at: fullPost.published_at,
                };

                console.log('Prepared Algolia Record:', JSON.stringify(record, null, 2));

                try {
                    const indexResponse = await index.saveObject(record);
                    console.log('Algolia Indexing Response:', indexResponse);
                    return res.status(200).json({
                        message: 'Post indexed successfully',
                        indexResponse
                    });
                } catch (indexError) {
                    console.error('Algolia Indexing Error:', indexError);
                    return res.status(500).json({
                        message: 'Failed to index post',
                        error: indexError.message
                    });
                }

            case 'post.unpublished':
            case 'post.deleted':
                console.log(`Attempting to delete post ${post.id} from Algolia index`);
                try {
                    const deleteResponse = await index.deleteObject(post.id);
                    console.log('Algolia Delete Response:', deleteResponse);
                    return res.status(200).json({
                        message: 'Post removed from index',
                        deleteResponse
                    });
                } catch (deleteError) {
                    console.error('Algolia Delete Error:', deleteError);
                    return res.status(500).json({
                        message: 'Failed to remove post from index',
                        error: deleteError.message
                    });
                }

            default:
                console.warn('Unhandled Event Type:', event);
                return res.status(400).json({
                    message: 'Unhandled event type',
                    event
                });
        }
    } catch (error) {
        console.error('Unexpected Webhook Processing Error:', error);
        return res.status(500).json({
            message: 'Unexpected Internal Error',
            error: error.message,
            stack: error.stack
        });
    }
};