<script lang="ts">
	import type { TableOfContents, TableOfContentsItem } from '$lib/types/article';
	import { ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';

	export let tableOfContents: TableOfContents = [];

	console.log({ tableOfContents });

	let currentHash = '';
	let selectedItemIndex = 0;
	let isOpen = false;
	let showMobileTOC = false;

	let items = Array.isArray(tableOfContents) ? tableOfContents : [];

	onMount(() => {
		currentHash = window.location.hash.slice(1);

		const headingObserver = getHeadingObserver();
		document.querySelectorAll('h1[id], h2[id]').forEach((heading) => {
			headingObserver.observe(heading);
		});

		window.addEventListener('hashchange', () => {
			currentHash = window.location.hash.slice(1);
		});

		const tocElement = document.getElementById('toc');
		if (tocElement) {
			getTocObserver().observe(tocElement);
		}

		return () => {
			headingObserver.disconnect();
			getTocObserver().disconnect();
		};
	});

	function getTocObserver() {
		return new IntersectionObserver(
			([entry]) => {
				showMobileTOC = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);
	}

	function getHeadingObserver() {
		return new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.id;
						if (id && id !== currentHash) {
							currentHash = id;
							history.pushState(null, '', `#${id}`);
							updateSelectedIndex(id);
						}
					}
				});
			},
			{ threshold: 1 }
		);
	}

	function updateSelectedIndex(id: string) {
		const index = tableOfContents.findIndex((item) => item.id === id);
		selectedItemIndex = index !== -1 ? index : 0;
	}

	function calculateItemOpacity(index: number) {
		return 1 - Math.abs(selectedItemIndex - index) / tableOfContents.length;
	}

	function handleClick(e: MouseEvent, href: string) {
		e.preventDefault();
		const targetId = href.substring(1);
		const targetElement = document.getElementById(targetId);

		if (targetElement) {
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			history.pushState(null, '', href);
		}
	}
</script>

<!-- <script lang="ts">
	import type { TableOfContents, TableOfContentsItem } from '$lib/types/article';
	import { ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const { tableOfContents = [] } = $props<{ tableOfContents: TableOfContents }>();
	//const { tableOfContents }: { tableOfContents: TableOfContents } = $props();
	let currentHash = $state('');
	let selectedItemIndex = $state(0);
	let isOpen = $state(false);
	let showMobileTOC = $state(false);

	$: items = Array.isArray(tableOfContents) ? tableOfContents : [];

	onMount(() => {
		currentHash = window.location.hash.slice(1);
		
		// Observe all headings, regardless of reading mode
		const headingObserver = getHeadingObserver();
		document.querySelectorAll('h1[id], h2[id]').forEach((heading) => {
			headingObserver.observe(heading);
		});

		window.addEventListener('hashchange', () => {
			currentHash = window.location.hash.slice(1);
		});

		// Table of contents observer
		const tocElement = document.getElementById('toc');
		if (tocElement) {
			getTocObserver().observe(tocElement);
		}

		return () => {
			headingObserver.disconnect();
			getTocObserver().disconnect();
		};
	});

	function getTocObserver() {
		const observer = new IntersectionObserver(
			([entry]) => {
				showMobileTOC = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);
		return observer;
	}

	function getHeadingObserver() {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.id;
						if (id && id !== currentHash) {
							currentHash = id;
							// Use pushState instead of replaceState to maintain history
							history.pushState(null, '', `#${id}`);
							updateSelectedIndex(id);
						}
					}
				});
			},
			{ threshold: 1 }
		);

		return observer;
	}

	function updateSelectedIndex(id: string) {
		const index = tableOfContents.findIndex((item) => item.id === id);

		if (index === -1) {
			const parentIndex = tableOfContents.findIndex((item) =>
				item.children.some((child) => child.id === id)
			);
			if (parentIndex !== -1) {
				selectedItemIndex = parentIndex;
			}
		} else {
			selectedItemIndex = index;
		}
	}

	function calculateItemOpacity(index: number) {
		return 1 - Math.abs(selectedItemIndex - index) / tableOfContents.length;
	}

	function handleClick(e: MouseEvent, href: string) {
		e.preventDefault();
		const targetId = href.substring(1); // Remove the # from href
		const targetElement = document.getElementById(targetId);
		
		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
			
			// Optionally update URL without jumping
			history.pushState(null, '', href);
		}
	}
</script>

<!-- <ul
	class="hidden lg:block pl-12 w-1/5 sticky top-24 space-y-4 text-sm max-h-[calc(100vh-6rem)] overflow-y-auto font-hubot"
>
	{#each tableOfContents as item, index}
		<li>
			<a
				href={`#${item.id}`}
				class={`hover:underline hover:text-primary block transition-colors duration-200 ${selectedItemIndex === index ? 'font-medium' : 'font-normal'}`}
				style="opacity: {calculateItemOpacity(index)}"
				onmouseenter={(e) => (e.currentTarget.style.opacity = '1')}
				onmouseleave={(e) => (e.currentTarget.style.opacity = calculateItemOpacity(index).toString())}
				onclick={(e) => handleClick(e, `#${item.id}`)}
			>
				{item.title}
			</a>
			{@render subItem(item)}
		</li>
	{/each}
</ul> -->

<ul
	class="hidden lg:block pl-12 w-1/5 sticky top-24 space-y-4 text-sm max-h-[calc(100vh-6rem)] overflow-y-auto font-hubot"
>
	{#each items as item, index}
		<li>
			<a
				href={`#${item.id}`}
				class={`hover:underline hover:text-primary block transition-colors duration-200 ${selectedItemIndex === index ? 'font-medium' : 'font-normal'}`}
				style="opacity: {calculateItemOpacity(index)}"
				onmouseenter={(e) => (e.currentTarget.style.opacity = '1')}
				onmouseleave={(e) =>
					(e.currentTarget.style.opacity = calculateItemOpacity(index).toString())}
				onclick={(e) => handleClick(e, `#${item.id}`)}
			>
				{item.title}
			</a>
			{@render subItem(item)}
		</li>
	{/each}
</ul>

<!-- This prevent the TOC to be visible before the user scroll past the first heading element-->
{#if showMobileTOC}
	<button
		class="sticky top-[72px] md:top-[86px] p-0 lg:hidden text-left w-full bg-black bg-opacity-40 flex items-start text-sm"
		class:h-screen={isOpen}
		onclick={() => (isOpen = !isOpen)}
	>
		<ChevronDown
			class="absolute right-3 top-3 w-5 h-5 transition-transform duration-200"
			style="transform: rotate({isOpen ? '180deg' : '0deg'})"
		/>
		{#if !isOpen}
			<div class="p-3 bg-secondary w-full">
				<div class="w-11/12 overflow-hidden whitespace-nowrap text-ellipsis">
					{tableOfContents.find((item) => item.id === currentHash)?.title ||
						tableOfContents[selectedItemIndex].children.find((child) => child.id === currentHash)
							?.title}
				</div>
			</div>
		{/if}
		{#if isOpen}
			<ul class="flex font-hubot flex-col gap-3 bg-secondary p-3 grow">
				{#each tableOfContents as item, index}
					<li>
						<a
							href={`#${item.id}`}
							class={`text-sm block w-full transition-colors duration-200 ${selectedItemIndex === index ? 'font-medium' : 'font-normal'}`}
							onclick={(e) => handleClick(e, `#${item.id}`)}
						>
							{item.title}
						</a>
						{@render subItem(item)}
					</li>
				{/each}
			</ul>
		{/if}
	</button>
{/if}

{#snippet subItem(item: TableOfContentsItem)}
	{#if item.children.length > 0 && (currentHash === item.id || item.children.some((child) => child.id === currentHash))}
		<ul class="mt-2 space-y-2">
			{#each item.children as subItem}
				<li class={`border-l-2 pl-3  ${currentHash === subItem.id ? '' : 'border-subtle'}`}>
					<a
						href={`#${subItem.id}`}
						class={`text-sm ${currentHash === subItem.id ? 'font-medium' : 'font-normal'}`}
						onclick={(e) => handleClick(e, `#${subItem.id}`)}
					>
						{subItem.title}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}
