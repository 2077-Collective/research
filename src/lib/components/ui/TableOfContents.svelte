<script lang="ts">
	import { onMount } from 'svelte';
	import { init, destroy } from 'tocbot';
	import { ChevronDown } from 'lucide-svelte';

	const {
		tocSelector = '#toc',
		contentSelector = '#content-container',
		headingSelector = 'h1, h2'
	} = $props<{
		tableOfContents: {
			id: string;
			title: string;
			children: Array<{
				id: string;
				title: string;
				children: any[];
			}>;
		}[];
		tocSelector?: string;
		contentSelector?: string;
		headingSelector?: string;
	}>();

	let currentHash = $state('');
	let selectedItemIndex = $state(0);
	let isOpen = $state(false);
	let showMobileTOC = $state(false);
	let tocLinks = $state<Element[]>([]);
	let expandedItems = $state<Set<string>>(new Set()); // Track expanded h1 items

	onMount(() => {
		init({
			tocSelector,
			contentSelector,
			headingSelector,
			hasInnerContainers: true,
			linkClass: 'toc-link',
			activeLinkClass: 'is-active-link',
			listClass: 'toc-list',
			listItemClass: 'toc-list-item',
			extraLinkClasses: 'hover:underline hover:text-primary transition-colors duration-200',
			headingsOffset: 100,
			scrollSmoothOffset: -100,
			headingLabelCallback: (headingText) => {
				return headingText.replace(/#/g, '').trim();
			}
		});

		const headingObserver = new IntersectionObserver(
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

		document.querySelectorAll('h1[id], h2[id]').forEach((heading) => {
			headingObserver.observe(heading);
		});

		const tocElement = document.getElementById('toc');
		if (tocElement) {
			const tocObserver = new IntersectionObserver(
				([entry]) => {
					showMobileTOC = !entry.isIntersecting;
				},
				{ threshold: 0 }
			);
			tocObserver.observe(tocElement);
		}

		return () => {
			headingObserver.disconnect();
			destroy();
		};
	});

	function updateSelectedIndex(id: string) {
		const tocLinks = document.querySelectorAll('.toc-link');
		tocLinks.forEach((link, index) => {
			if (link.getAttribute('href') === `#${id}`) {
				selectedItemIndex = index;

				const parentH1 = link.closest('.toc-list-item.node-name--H1')?.querySelector('.toc-link');
				if (parentH1) {
					const parentH1Id = parentH1.getAttribute('href')?.substring(1);
					if (parentH1Id) {
						expandedItems.clear();
						expandedItems.add(parentH1Id);
					}
				} else if (link.classList.contains('node-name--H1')) {
					expandedItems.clear();
					expandedItems.add(id);
				}
			}
		});
	}

	function handleClick(e: MouseEvent, href: string | null) {
		e.preventDefault();
		if (!href) return;

		const targetId = href.substring(1);
		const targetElement = document.getElementById(targetId);

		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
			history.pushState(null, '', href);
		}
	}

	function toggleItem(id: string) {
		if (expandedItems.has(id)) {
			expandedItems.delete(id);
		} else {
			expandedItems.add(id);
		}
		expandedItems = new Set(expandedItems);
	}

	function isExpanded(href: string | null): boolean {
		const id = href?.substring(1) || '';
		return expandedItems.has(id);
	}
</script>

<!-- Desktop TOC -->
<div
	class="hidden lg:block w-1/5 sticky top-24 space-y-4 text-sm max-h-[calc(100vh-6rem)] overflow-y-auto font-hubot"
>
	<div id={tocSelector.replace('#', '')} class="toc">
		<ul class="toc-list">
			{#each Array.from(document.querySelectorAll('.toc-link')) as link, index}
				<li class="toc-list-item">
					<a
						href={link.getAttribute('href')}
						class="toc-link {link.classList.contains('is-active-link') ? 'is-active-link' : ''}"
						style="opacity: {1 - Math.abs(selectedItemIndex - index) / tocLinks.length}"
						on:mouseenter={(e) => (e.currentTarget.style.opacity = '1')}
						on:mouseleave={(e) =>
							(e.currentTarget.style.opacity = (
								1 -
								Math.abs(selectedItemIndex - index) / tocLinks.length
							).toString())}
						on:click|preventDefault={(e) => {
							handleClick(e, link.getAttribute('href'));
							const id = link.getAttribute('href')?.substring(1);
							if (id) toggleItem(id);
						}}
					>
						{link.textContent}
					</a>
					{#if isExpanded(link.getAttribute('href')) && link.parentElement?.tagName === 'H1'}
						<ul class="toc-list">
							{#each Array.from(link.parentElement?.querySelectorAll('.toc-list .toc-link') || []) as subLink}
								<li class="toc-list-item">
									<a
										href={subLink.getAttribute('href')}
										class="toc-link {subLink.classList.contains('is-active-link')
											? 'is-active-link'
											: ''}"
										on:click|preventDefault={(e) => handleClick(e, subLink.getAttribute('href'))}
									>
										{subLink.textContent}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>

<!-- Mobile TOC -->
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
					{tocLinks.find((l) => l.classList.contains('is-active-link'))?.textContent ||
						'Table of Contents'}
				</div>
			</div>
		{/if}
		{#if isOpen}
			<ul class="flex font-hubot flex-col gap-3 bg-secondary p-3 grow">
				{#each Array.from(document.querySelectorAll('.toc-link')) as link}
					<li>
						<a
							href={link.getAttribute('href')}
							class="text-sm block w-full transition-colors duration-200 {link.classList.contains(
								'is-active-link'
							)
								? 'font-medium'
								: 'font-normal'}"
							on:click|preventDefault={(e) => {
								handleClick(e, link.getAttribute('href'));
								const id = link.getAttribute('href')?.substring(1);
								if (id) toggleItem(id);
							}}
						>
							{link.textContent}
						</a>
						{#if isExpanded(link.getAttribute('href')) && link.parentElement?.tagName === 'H1'}
							<ul class="mt-2 space-y-2">
								{#each Array.from(link.parentElement?.querySelectorAll('.toc-list .toc-link') || []) as subLink}
									<li>
										<a
											href={subLink.getAttribute('href')}
											class="text-sm block w-full transition-colors duration-200 {subLink.classList.contains(
												'is-active-link'
											)
												? 'font-medium'
												: 'font-normal'}"
											on:click|preventDefault={(e) => handleClick(e, subLink.getAttribute('href'))}
										>
											{subLink.textContent}
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

<style>
	:global(.toc) {
		width: 100%;
		max-height: 80vh;
		overflow-y: auto;
		padding: 10px;
		scrollbar-width: thin;
		scrollbar-color: var(--neutral-80) transparent;
	}

	:global(.toc::-webkit-scrollbar) {
		width: 2px;
	}

	:global(.toc::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.toc::-webkit-scrollbar-thumb) {
		background-color: var(--neutral-80);
		border-radius: 2px;
	}

	:global(.toc::-webkit-scrollbar-thumb:hover) {
		background-color: var(--neutral-60);
	}

	:global(.toc-link) {
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s ease;
		color: inherit;
		padding: 0.25rem 0;
		display: block;
	}

	:global(.is-active-link) {
		font-weight: 600;
		color: var(--primary);
	}

	:global(.toc-list) {
		margin: 0;
	}

	:global(.toc-list-item) {
		margin: 0.5rem 0;
		padding-left: 1rem;
	}

	:global(.toc-list-item > a) {
		padding-left: 1rem;
	}

	:global(.toc-list-item > a.node-name--H2) {
		border-left: 2px solid var(--neutral-80);
	}
</style>
