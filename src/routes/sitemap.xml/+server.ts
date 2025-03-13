import type { RequestHandler } from '@sveltejs/kit';
import { fetchGhostArticles } from '$lib/services/ghost.service';

interface Article {
  slug: string;
  updatedAt: string | Date;
}

export const GET: RequestHandler = async ({ request }) => {
  try {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:5173';
    const baseURL = import.meta.env.VITE_BASE_URL || `${protocol}://${host}`;
    console.log('Base URL:', baseURL);

    console.log('Fetching articles from Ghost CMS...');
    const articles = await fetchGhostArticles();
    console.log('Fetched articles:', articles);

    console.log('Generating sitemap XML...');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <!-- Static Pages -->
        <url>
          <loc>${baseURL}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>

        <url>
          <loc>${baseURL}/reports</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.4</priority>
        </url>

        <url>
          <loc>${baseURL}/article-review</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>

        <!-- Dynamic Articles from Ghost -->
        ${articles
          .map(
            (article: Article) => `
          <url>
            <loc>${baseURL}/${article.slug}</loc>
            <lastmod>${new Date(article.updatedAt || new Date()).toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
          </url>
        `
          )
          .join('')}
      </urlset>`;

    console.log('Sitemap generated successfully.');
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};