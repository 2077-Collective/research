export const cache = new Map<string, { data: any; timestamp: number }>();
export const CACHE_TTL = 5 * 60 * 1000;

export const isCacheValid = (timestamp: number): boolean => {
	return Date.now() - timestamp < CACHE_TTL;
};
