<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils/ui-components';
	import { ArrowUpRight, Menu, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import Button from './button/button.svelte';
	import Research from './icons/Research.svelte';
	import Search from './Search.svelte';

	let mobileMenuOpen = $state(false);

	type LinkType = {
		name: string;
		href: string;
		isExternal?: boolean;
	};

	// Links
	const links: LinkType[] = [
		{
			name: 'Research',
			href: '/reports'
		},

		{
			name: 'Newsletter',
			href: '/ethereum-navigator'
		},

		{
			name: 'About',
			href: '/about'
		},

		{
			name: 'Work with Us',
			href: '/work-with-us'
		}
	];

	let addBackgroundColor = $state(false);

	function scrollContainer() {
		return document.documentElement || document.body;
	}

	function handleScroll() {
		addBackgroundColor = scrollContainer().scrollTop > 50;
	}
</script>

<svelte:window on:scroll={handleScroll} />

<div
	class={cn(
		'fixed top-0 pt-4 pb-4 md:pt-4 w-full z-[999] transition',
		addBackgroundColor && 'bg-background'
	)}
>
	<div class="container flex items-center justify-between">
		<div class="flex items-center gap-[45px] max-md:justify-between w-full">
			<!-- Logo -->
			<a href="/" class="ml-1"><Research /></a>

			<!-- Desktop Navigation -->
			<div class="items-center gap-10 hidden lg:flex font-mono text-sm">
				{#each links as link}
					{@const isActive = $page.url.pathname === link.href}
					<a
						href={link.href}
						class={cn(
							'text-gray-200 hover:text-neutral-40 transition-colors flex items-center gap-1 group',
							isActive && 'text-[#0CDEE9] hover:text-[#0CDEE9] font-bold'
						)}
						data-sveltekit-preload-data
					>
						{link.name}
						{#if link.isExternal}
							<ArrowUpRight
								class="size-4 group-hover:-translate-y-px group-hover:translate-x-px transition will-change-transform"
							/>
						{/if}
					</a>
				{/each}
			</div>
		</div>

		<Search />

		<!-- Mobile Menu Toggle -->
		<div class="lg:hidden">
			{@render mobileMenu()}
		</div>
	</div>
</div>

<!-- Mobile Menu Snippet -->
{#snippet mobileMenu()}
	<div class="lg:hidden ml-6">
		<button class="flex items-center justify-center" onclick={() => (mobileMenuOpen = true)}>
			<Menu class="w-6 h-6" />
		</button>
	</div>

	<!-- Mobile Menu Overlay -->
	{#if mobileMenuOpen}
		<div
			class="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 150 }}
		>
			<div class="flex flex-col gap-4 p-4">
				<!-- Header with Close Button -->
				<div class="flex justify-between items-center">
					<a href="/"><Research /></a>
					<Button variant="ghost" class="w-fit p-1" onclick={() => (mobileMenuOpen = false)}>
						<X class="w-5 h-5" />
					</Button>
				</div>

				<!-- Mobile Menu Links -->
				<div class="flex flex-col gap-4 items-center">
					{#each links as link}
						<a
							class="flex items-center gap-1 group"
							href={link.href}
							onclick={() => {
								mobileMenuOpen = false;
							}}
							>{link.name}
							{#if link.isExternal}
								<ArrowUpRight
									class="size-5 group-hover:-translate-y-px group-hover:translate-x-px transition will-change-transform"
								/>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
{/snippet}
