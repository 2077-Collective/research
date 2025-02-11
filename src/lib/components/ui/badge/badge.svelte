<script lang="ts">
	import { goto } from '$app/navigation';
	import { type Variant, badgeVariants } from './index.js';
	import { cn } from '$lib/utils/ui-components.js';
  
	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = 'default';
	export { className as class };
  
	function handleClick() {
	  if (href) {
		goto(href);
	  }
	}
  </script>
  
  <span
  	role="button"
  	tabindex="0"
	on:click={handleClick}
	class={cn(badgeVariants({ variant, className }), href && 'cursor-pointer')}
	{...$$restProps}
  >
	<slot />
  </span>