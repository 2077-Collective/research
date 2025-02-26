import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const storedToken = browser ? sessionStorage.getItem('jwt') : '';
export const jwt = writable(storedToken);

jwt.subscribe((value) => {
	if (value && browser) {
		sessionStorage.setItem('jwt', value);
	} else {
		if (browser) {
			sessionStorage.removeItem('jwt');
		}
	}
});
