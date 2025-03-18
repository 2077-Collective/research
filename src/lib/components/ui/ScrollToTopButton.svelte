<script lang="ts">
	import { cn } from '$lib/utils/ui-components';
	import { ArrowUp } from 'lucide-svelte';

	interface $$Props {
		className?: string;
	}

	const { className = '' }: $$Props = $props();

	let showButton = $state(false);

	function scrollContainer() {
		return document.documentElement || document.body;
	}

	function handleScroll() {
		showButton = scrollContainer().scrollTop > 600;
	}

	function handleScrollToTop() {
		document.body.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<svelte:window on:scroll={handleScroll} />

<div class={cn('container flex items-center justify-end')}>
	<button
		class={cn(
			'flex items-center justify-center gap-1 text-2xl group text-[12.667px] size-10 bg-[#19191A] rounded-full text-[#B4B4B4] group fixed bottom-8 md:bottom-11 font-semibold shadow-2xl hover:shadow-hover hover:bg-white border border-[#333] -z-50 transition opacity-0',
			showButton && 'opacity-100 z-[999999]',
			className
		)}
		aria-label="Scroll back to the top of the page"
		onclick={handleScrollToTop}
	>
		<ArrowUp
			class="size-4 rounded-full group-hover:-translate-y-[2px] will-change-transform transition group-hover:text-black flex-shrink-0"
			style="stroke-width: 1.4"
		/>
	</button>
</div>
