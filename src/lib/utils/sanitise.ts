export function sanitizeTitle(title: string): string {
	return title
		.replace(/&#039;/g, "'")
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"');
}