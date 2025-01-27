<script>
	import { ArrowUpRight, Menu, Mail, X } from 'lucide-svelte';
	import Button from './button/button.svelte';
	import { fade } from 'svelte/transition';
	import Research from './icons/Research.svelte';

	let mobileMenuOpen = $state(false);
</script>

<div
	class="sticky top-0 z-50 flex justify-between items-center px-3 md:px-12 py-4 md:py-6 max-w-screen-2xl mx-auto bg-background"
>
	<!-- Logo -->
	<a href="/" class="ml-1"><Research /></a>

	<!-- Desktop Navigation -->
	<div class="items-center gap-4 hidden md:flex">
		<!-- About and Work With Us Links -->
		<a href="/about" class="text-gray-200 hover:text-gray-500 transition-colors">About us</a>
		<a href="/work-with-us" class="text-gray-200 hover:text-gray-500 transition-colors">Work With Us</a>

		<!-- Subscribe Button -->
		<Button
			class="flex items-center gap-1 justify-center w-fit px-8 bg-special-blue rounded-full"
			onclick={() => {
				document.querySelector('#subscribe')?.scrollIntoView({ behavior: 'smooth' });
			}}
		>
			Subscribe
			<Mail class="w-4 h-4 ml-1" />
		</Button>
	</div>

	<!-- Mobile Menu Toggle -->
	<div class="md:hidden">
		{@render mobileMenu()}
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
				<div class="flex flex-col gap-2 items-center">
					<a
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
					>
				</div>

				<Button
					href="#subscribe"
					class="mt-4 flex items-center gap-1 justify-center px-8 bg-special-blue"
					onclick={() => {
						mobileMenuOpen = false;
						document.querySelector('#subscribe')?.scrollIntoView({ behavior: 'smooth' });
					}}
				>
					Subscribe to our newsletter
					<Mail class="w-4 h-4 ml-1" />
				</Button>
			</div>
		</div>
	{/if}
{/snippet}