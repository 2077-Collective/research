/**
 * Type definition for an author object
 */
export interface Author {
    username: string;
    full_name?: string | null;
  }
  
  /**
   * Gets the display name for an author, preferring full name if available
   * @param author - The author object containing username and optional full name
   * @returns The author's display name
   */
  export function getAuthorDisplayName(author: Author): string {
    if (!author) return 'Unknown';
    return author.full_name || author.username;
  }
  
  /**
   * Formats a list of authors into a comma-separated string
   * @param authors - Array of author objects
   * @returns Format string of author names or "Unknown" if no authors
   */
  export function getAuthorsText(authors: Author[] | null | undefined): string {
    if (!authors?.length) return 'Unknown';
    return authors.map(getAuthorDisplayName).join(', ');
  }