<script lang="ts">
	import { cn } from '$lib/utils/ui-components';
	import { ArrowUpRight, Menu, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import Button from './button/button.svelte';
	import Research from './icons/Research.svelte';

	let mobileMenuOpen = $state(false);

	type LinkType = {
		name: string;
		href: string;
		isExternal?: boolean;
	};

	// Links
	const links: LinkType[] = [
		{
			name: 'About',
			href: '/about'
		},

		{
			name: 'Work with Us',
			href: '/work-with-us'
		},

		{
			name: 'Metrics',
			href: '/metrics'
		},

		{
			name: 'Twitter',
			href: '/metrics',
			isExternal: true
		},

		{
			name: 'Newletter',
			href: '/metrics',
			isExternal: true
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
		<div class="flex items-center gap-[45px]">
			<!-- Logo -->
			<a href="/" class="ml-1"><Research /></a>

			<!-- Desktop Navigation -->
			<div class="items-center gap-10 hidden md:flex font-mono text-sm">
				{#each links as link}
					<a
						href={link.href}
						class="text-gray-200 hover:text-gray-400 transition-colors flex items-center gap-1 group"
					>
						{link.name}
						{#if link.isExternal}
							<ArrowUpRight
								class="size-4 group-hover:-translate-y-px group-hover:translate-x-px transition will-change-transform"
							/>
						{/if}
					</a>
				{/each}

				<!-- Subscribe Button
				<Button
					class="flex items-center gap-1 justify-center w-fit px-8 bg-special-blue rounded-full"
					onclick={() => {
						document.querySelector('#subscribe')?.scrollIntoView({ behavior: 'smooth' });
					}}
				>
					Subscribe
					<Mail class="w-4 h-4 ml-1" />
				</Button> -->
			</div>
		</div>

		<!-- Mobile Menu Toggle -->
		<div class="md:hidden">
			{@render mobileMenu()}
		</div>
	</div>
</div>

<!-- Mobile Menu Snippet -->
{#snippet mobileMenu()}
	<div class="md:hidden">
		<Button variant="ghost" class="w-fit p-1" onclick={() => (mobileMenuOpen = true)}>
			<Menu class="w-5 h-5" />
		</Button>
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
							href="/about"
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
					<!-- <a
						href="/about"
						onclick={() => {
							mobileMenuOpen = false;
						}}>About us</a
					>
					<a
						href="/work-with-us"
						onclick={() => {
							mobileMenuOpen = false;
						}}>Work with us</a
					> -->
				</div>

				<!-- <Button
					href="#subscribe"
					class="mt-4 flex items-center gap-1 justify-center px-8 bg-special-blue"
					onclick={() => {
						mobileMenuOpen = false;
						document.querySelector('#subscribe')?.scrollIntoView({ behavior: 'smooth' });
					}}
				>
					Subscribe to our newsletter
					<Mail class="w-4 h-4 ml-1" />
				</Button> -->
			</div>
		</div>
	{/if}
{/snippet}
