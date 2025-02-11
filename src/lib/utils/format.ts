
export function formatCategorySlug(category: string): string {
    if (!category) return '';
    return category.trim().toLowerCase().replace(/\s+/g, '-');
}

export function unformatCategorySlug(slug: string): string {
    if (!slug) return '';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
