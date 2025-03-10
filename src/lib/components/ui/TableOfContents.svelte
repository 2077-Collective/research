<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowDown, ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { destroy, init } from 'tocbot';

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
	let expandedItems = $state<Set<string>>(new Set());

	onMount(() => {
		if (!browser) return;

		init({
			tocSelector: '#toc',
			contentSelector: '#content-container',
			headingSelector: 'h1, h2',
			hasInnerContainers: true,
			collapseDepth: 1,
			linkClass: 'toc-link',
			activeLinkClass: 'is-active-link',
			listClass: 'toc-list',
			listItemClass: 'toc-list-item',
			extraLinkClasses: 'hover:underline hover:text-primary transition-colors duration-200',
			scrollSmooth: true,
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

		tocLinks = Array.from(document.querySelectorAll('.toc-link'));

		return () => {
			headingObserver.disconnect();
			destroy();
		};
	});

	function updateSelectedIndex(id: string) {
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
{#if browser}
	<div
		class="hidden lg:block w-1/5 sticky top-24 space-y-4 text-sm max-h-[calc(100vh-6rem)] overflow-y-auto font-hubot"
	>
		<div class="text-sm font-mono flex items-center gap-2 pl-7 text-neutral-40">
			<p>Table of contents</p>
			<ArrowDown class="size-4" />
		</div>

		<div id={tocSelector.replace('#', '')} class="toc">
			<ul class="toc-list">
				{#each tocLinks as link, index}
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
{/if}

<!-- Mobile TOC -->
{#if browser && showMobileTOC}
	<button
		class="sticky top-[72px] md:top-[86px] py-4 lg:hidden text-left w-full bg-black bg-opacity-40 flex items-start text-sm overflow-y-auto"
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
			<ul
				class="flex px-2 font-hubot flex-col gap-3 bg-secondary p-0 w-full h-[calc(100vh-72px)] overflow-y-auto"
			>
				{#each tocLinks as link}
					<li class="w-full">
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
							<ul class="mt-2 space-y-2 pl-4">
								{#each Array.from(link.parentElement?.querySelectorAll('.toc-list .toc-link') || []) as subLink}
									<li class="w-full">
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
		font-size: 14px !important;
		transition: color 0.2s ease;
		color: inherit;
		padding: 0.25rem 0;
		display: block;
	}

	:global(.is-active-link) {
		/* font-weight: 600; */
		color: #0cdee9 !important;
	}

	:global(.toc-list) {
		margin: 0;
		padding: 0;
	}

	:global(.toc-list-item) {
		margin: 0;
		padding: 0;
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
		border-left: 2px solid #333;
		@apply text-neutral-20;
	}

	:global(.toc-list-item > a.node-name--H2.is-active-link) {
		border-left: 2px solid #0cdee9;
	}
</style>
