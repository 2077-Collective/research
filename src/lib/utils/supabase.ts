import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

const sessionStorageAdapter = {
	getItem: (key: string) => sessionStorage.getItem(key),
	setItem: (key: string, value: string) => sessionStorage.setItem(key, value),
	removeItem: (key: string) => sessionStorage.removeItem(key)
};

const options = {
	db: {
		schema: 'public'
	},
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
		storage: isBrowser ? sessionStorageAdapter : undefined
	}
};

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, options);
