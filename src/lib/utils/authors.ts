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
export function getAuthorDisplayName(author: Author | null | undefined): string {
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

	const authorsWithHyperlink = authors
		.map((author) => {
			const displayName = escapeHtml(author?.full_name || author?.username);
			const username = escapeHtml(author?.username);
			return `<a class="hover:underline underline-offset-[3px]" href="/authors/${username}">${displayName}</a>`;
		})
		.join(', ');

	return authorsWithHyperlink;
}

function escapeHtml(unsafe: string | undefined | null): string {
	if (!unsafe) return '';
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
