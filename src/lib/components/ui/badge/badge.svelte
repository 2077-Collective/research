<script lang="ts">
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils/ui-components.js';
	import { type Variant, badgeVariants } from './index.js';

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = 'default';
	export { className as class };

	function handleClick() {
		if (href) {
			goto(href);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (href && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			goto(href);
		}
	}
</script>

<span
	role="button"
	tabindex="0"
	on:click={handleClick}
	on:keydown={handleKeyDown}
	class={cn('font-mono', badgeVariants({ variant, className }), href && 'cursor-pointer')}
	{...$$restProps}
>
	<slot />
</span>
