<script lang="ts">
	import { cn } from '$lib/utils/ui-components';
	import { BrainCog, ForwardIcon, Home, User } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

	const {
		loadingBookmarks,
		isLoggedIn,
		isSummaryDisabled,
		onSummaryClick,
		userEmail,
		onShareClick
	} = $props();

	let lastScrollY = $state(0);
	let isScrolling = $state(false);
	let scrollDirection: 'none' | 'up' | 'down' = $state('none');
	let scrollTimeout: ReturnType<typeof setTimeout>;

	function handleScroll() {
		const currentScrollY = window.scrollY;

		if (currentScrollY > lastScrollY) {
			scrollDirection = 'down';
		} else if (currentScrollY < lastScrollY) {
			scrollDirection = 'up';
		}

		lastScrollY = currentScrollY;
		isScrolling = true;

		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			isScrolling = false;
		}, 200);
	}

	onMount(() => {
		if (isMobile) {
			window.addEventListener('scroll', handleScroll);

			return () => window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

{#if scrollDirection === 'none' || !isScrolling}
	<div
		class={cn(
			'hidden max-md:grid grid-cols-4 gap-1 fixed bottom-0 w-full z-[9999999] bg-[#010102] border-t border-[#202020] py-4 text-neutral-40',
			loadingBookmarks && 'max-md:hidden'
		)}
		transition:fade={{ duration: 150 }}
	>
		<a href="/" class="flex items-center justify-center">
			<button
				class="min-h-10 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
				aria-label="Go back to home"
			>
				<Home class="size-5" />
				<span class="text-xs font-medium font-ibm">Home</span>
			</button>
		</a>

		<button
			class="min-h-10 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
			aria-label="Show AI Summary"
			data-summary-toggle
			onclick={onSummaryClick}
			disabled={isSummaryDisabled}
		>
			<BrainCog class="size-5" />
			<span class="text-xs font-medium font-ibm">AI Summary</span>
		</button>

		<button class="min-h-10 flex flex-col items-center justify-center gap-2" onclick={onShareClick}>
			<ForwardIcon class="size-5 stroke-[3px]" />
			<span class="text-xs font-medium font-ibm">Share</span>
		</button>

		<div class="flex items-center justify-center">
			{#if isLoggedIn}
				<button class="min-h-10 flex flex-col items-center gap-2">
					<span
						class="flex items-center justify-center text-white uppercase font-medium size-7 rounded-full bg-[#202020] text-xs"
						>{(userEmail || '').charAt(0)}</span
					>
					<span class="text-xs font-medium font-ibm">Account</span>
				</button>
			{:else}
				<a href="/signin">
					<button class="min-h-10 flex flex-col items-center gap-2">
						<User class={cn('size-5 transition')} />
						<span class="text-xs font-medium font-ibm">Sign in</span>
					</button></a
				>
			{/if}
		</div>
	</div>
{/if}
