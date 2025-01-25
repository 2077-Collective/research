/**
 * Unescapes HTML entities in a string, commonly used for sanitizing titles and metadata.
 * @param title - The string containing HTML entities to unescape
 * @returns The unescaped string, or empty string if input is null/undefined
 */
export function sanitizeTitle(title: string): string {
    if (!title) return '';
    return title
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}