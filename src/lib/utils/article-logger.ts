export function logArticleCardData(article: any, context: string) {
    console.group(`ArticleCard Data: ${context}`);
    console.log('Article ID:', article.id);
    console.log('Title:', article.title);
    console.log('Slug:', article.slug);
    console.log('Categories:', article.categories);
    console.log('Thumbnail:', {
        isString: typeof article.thumb === 'string',
        hasData: !!article.thumb?.data,
        finalUrl: typeof article.thumb === 'string' 
            ? article.thumb 
            : article.thumb?.data?.attributes?.url || article.thumb_url || ''
    });
    console.log('Authors:', article.authors);
    console.log('Sponsor Info:', {
        isSponsored: article.isSponsored,
        sponsorColor: article.sponsorColor,
        sponsorTextColor: article.sponsorTextColor
    });
    console.groupEnd();
}