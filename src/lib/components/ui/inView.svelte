<!-- inView.svelte -->
<script lang="ts">
	import { writable } from 'svelte/store';

	export let inView = writable(false);

	export function trackInView(node: any, options = { threshold: 0.5 }) {
		const observer = new IntersectionObserver(([entry]) => {
			inView.set(entry.isIntersecting);
		}, options);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>
