<script lang="ts">
	import { cn } from '$lib/utils/ui-components';
	import { ForwardIcon, Headphones, Home, User } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import AudioListen from './AudioListen.svelte';
	import ReadingCustomize from './ReadingCustomize.svelte';

	let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

	const {
		loadingBookmarks,
		isLoggedIn,
		articleAudioUrl,
		isAudioLoading,
		userEmail,
		onShareClick,
		audioOnLoggedOut,
		onNotSignedInReadCustomizeClick
	} = $props();

	let lastScrollY = $state(0);
	let scrollDirection: 'up' | 'down' = $state('up');

	let openCustomize = $state(false);

	function handleScroll() {
		const currentScrollY = window.scrollY;

		if (currentScrollY > lastScrollY) {
			scrollDirection = 'down';
		} else if (currentScrollY < lastScrollY) {
			scrollDirection = 'up';
		}

		lastScrollY = currentScrollY;
	}

	onMount(() => {
		if (isMobile) {
			window.addEventListener('scroll', handleScroll);

			return () => window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<div
	class={cn(
		'hidden max-md:grid grid-cols-5 gap-1 fixed bottom-0 w-full bg-[#010102] border-t border-[#202020] py-4 text-neutral-40 opacity-0 transition duration-100 -z-[9999999]',
		loadingBookmarks && 'max-md:hidden',
		scrollDirection === 'up' && 'z-[9999999] opacity-100'
	)}
>
	<a href="/" class="flex items-center justify-center">
		<button
			class="min-h-10 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
			aria-label="Go back to home"
		>
			<Home class="size-5" />
			<span class="text-xs font-medium">Home</span>
		</button>
	</a>

	{#if isLoggedIn}
		<AudioListen
			{articleAudioUrl}
			isLoading={isAudioLoading}
			mobileClassName="text-xs [&_svg]:size-5 flex flex-col justify-center items-center font-medium"
		/>
	{:else}
		<button
			class="min-h-10 flex flex-col items-center justify-center gap-2"
			onclick={audioOnLoggedOut}
		>
			<Headphones class="size-5" />
			<span class="text-xs font-medium">Listen</span>
		</button>
	{/if}

	<button
		class="min-h-10 flex flex-col items-center justify-center gap-2"
		onclick={() => (!isLoggedIn ? onNotSignedInReadCustomizeClick() : (openCustomize = true))}
	>
		<svg class="size-5" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M5.92676 16.25V6.99902M21.25 0.75H8.75M11.25 7H0.75M15 1V16.25"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>

		<span class="text-xs font-medium">Customize</span>
	</button>

	<button class="min-h-10 flex flex-col items-center justify-center gap-2" onclick={onShareClick}>
		<ForwardIcon class="size-5 stroke-[3px]" />
		<span class="text-xs font-medium">Share</span>
	</button>

	<div class="flex items-center justify-center">
		{#if isLoggedIn}
			<button class="min-h-10 flex flex-col items-center gap-2">
				<span
					class="flex items-center justify-center text-white uppercase font-medium size-5 rounded-full text-xs bg-[#2B6662]"
				></span>
				<span class="text-xs font-medium">Account</span>
			</button>
		{:else}
			<a href="/signin">
				<button class="min-h-10 flex flex-col items-center gap-2">
					<User class={cn('size-5 transition')} />
					<span class="text-xs font-medium">Sign in</span>
				</button></a
			>
		{/if}
	</div>
</div>

<ReadingCustomize open={openCustomize} onClose={() => (openCustomize = false)} />
