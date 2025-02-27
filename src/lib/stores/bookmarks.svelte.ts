import { writable, type Writable } from 'svelte/store';

let bookmarks: string[] = $state([]);
export let storedBookmarks: Writable<string[]> = writable([]);

export function setBookmarks(newBookmarks: string[]) {
	bookmarks = newBookmarks;
}

export function getBookmarks() {
	return bookmarks;
}
