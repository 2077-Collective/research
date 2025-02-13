const cache = new Map<string, Promise<Response>>();

export async function cachedFetch(url: string): Promise<Response> {
	if (cache.has(url)) return cache.get(url)!;

	const promise = fetch(url);
	cache.set(url, promise);

	return (await promise).clone();
}
