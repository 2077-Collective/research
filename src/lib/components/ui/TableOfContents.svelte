<script lang="ts">
	import type { TableOfContents, TableOfContentsItem } from '$lib/types/article';
	import { ArrowDown, ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';

	export let tableOfContents: TableOfContents = [];

	let currentHash = '';
	let selectedItemIndex = 0;
	let isOpen = false;
	let showMobileTOC = false;

	// Ensure tableOfContents is always an array
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

	function getTocObserver(): IntersectionObserver {
		return new IntersectionObserver(
			([entry]) => {
				showMobileTOC = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);
	}

	function getHeadingObserver(): IntersectionObserver {
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

	function updateSelectedIndex(id: string): void {
		const index = items.findIndex((item) => item.id === id);
		if (index === -1) {
			const parentIndex = items.findIndex((item) =>
				item.children?.some((child: TableOfContentsItem) => child.id === id)
			);
			selectedItemIndex = parentIndex !== -1 ? parentIndex : 0;
		} else {
			selectedItemIndex = index;
		}
	}

	function calculateItemOpacity(index: number): number {
		return 1 - Math.abs(selectedItemIndex - index) / items.length;
	}

	function handleClick(e: MouseEvent, href: string): void {
		e.preventDefault();
		const targetId = href.substring(1);
		const targetElement = document.getElementById(targetId);

		if (targetElement) {
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			history.pushState(null, '', href);
		}
	}
</script>

<div
	class="hidden lg:flex pl-12 w-1/5 sticky top-24 space-y-4 text-sm max-h-[calc(100vh-6rem)] font-hubot flex-col"
>
	<div class="flex-shrink-0 flex items-center gap-2 text-neutral-40">
		<h4 class="text-base font-mono">Table of Contents</h4>

		<ArrowDown class="size-4" />
	</div>

	<ul class="overflow-y-auto flex-1 space-y-4 text-sm pb-8">
		{#each items as item, index}
			<li>
				<a
					href={`#${item.id}`}
					class={`hover:underline hover:text-primary block transition-colors duration-200 ${
						selectedItemIndex === index
							? 'font-medium text-[#0CDEE9]'
							: 'font-normal text-neutral-60'
					}`}
					on:mouseenter={(e) => (e.currentTarget.style.opacity = '1')}
					on:mouseleave={(e) =>
						(e.currentTarget.style.opacity = calculateItemOpacity(index).toString())}
					on:click={(e) => handleClick(e, `#${item.id}`)}
				>
					{item.title}
				</a>
				{#if item.children?.length > 0 && (currentHash === item.id || item.children.some((child: TableOfContentsItem) => child.id === currentHash))}
					<ul class="mt-2 space-y-2">
						{#each item.children as subItem}
							<li class={`border-l-2 pl-3 ${currentHash === subItem.id ? '' : 'border-subtle'}`}>
								<a
									href={`#${subItem.id}`}
									class={`text-sm ${currentHash === subItem.id ? 'font-medium text-neutral-20' : 'font-normal text-neutral-60'}`}
									on:click={(e) => handleClick(e, `#${subItem.id}`)}
								>
									{subItem.title}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
</div>

{#if showMobileTOC}
	<button
		class="sticky top-[72px] md:top-[86px] p-0 lg:hidden text-left w-full bg-black bg-opacity-40 flex items-start text-sm"
		class:h-screen={isOpen}
		on:click={() => (isOpen = !isOpen)}
	>
		<ChevronDown
			class="absolute right-3 top-3 w-5 h-5 transition-transform duration-200"
			style="transform: rotate({isOpen ? '180deg' : '0deg'})"
		/>
		{#if !isOpen}
			<div class="p-3 bg-secondary w-full">
				<div class="w-11/12 overflow-hidden whitespace-nowrap text-ellipsis">
					{items.find((item) => item.id === currentHash)?.title ||
						items[selectedItemIndex]?.children?.find(
							(child: TableOfContentsItem) => child.id === currentHash
						)?.title}
				</div>
			</div>
		{/if}
		{#if isOpen}
			<ul class="flex font-hubot flex-col gap-3 bg-secondary p-3 grow">
				{#each items as item, index}
					<li>
						<a
							href={`#${item.id}`}
							class={`text-sm block w-full transition-colors duration-200 ${
								selectedItemIndex === index ? 'font-medium' : 'font-normal'
							}`}
							on:click={(e) => handleClick(e, `#${item.id}`)}
						>
							{item.title}
						</a>
						{#if item.children?.length > 0 && (currentHash === item.id || item.children.some((child: TableOfContentsItem) => child.id === currentHash))}
							<ul class="mt-2 space-y-2">
								{#each item.children as subItem}
									<li
										class={`border-l-2 pl-3 ${currentHash === subItem.id ? '' : 'border-subtle'}`}
									>
										<a
											href={`#${subItem.id}`}
											class={`text-sm ${currentHash === subItem.id ? 'font-medium' : 'font-normal'}`}
											on:click={(e) => handleClick(e, `#${subItem.id}`)}
										>
											{subItem.title}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</button>
{/if}
