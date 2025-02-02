<!-- TODO: Add links to share buttons -->
<script lang="ts">
	import type { Article } from '$lib/types/article';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import FileDown from 'lucide-svelte/icons/file-down';
	import XIcon from 'lucide-svelte/icons/x';
	import BrainCog from 'lucide-svelte/icons/brain-cog';
	import ScrollText from 'lucide-svelte/icons/scroll-text';
	import Twitter from 'lucide-svelte/icons/twitter';
	import Link2 from 'lucide-svelte/icons/link-2';
	import Share from 'lucide-svelte/icons/share';
	import Linkedin from 'lucide-svelte/icons/linkedin';
	import Mail from 'lucide-svelte/icons/mail';
	import type { PageData } from './$types';
	import { onMount, tick, type Component } from 'svelte';
	import TableOfContents from '$lib/components/ui/TableOfContents.svelte';
	import Prism from 'prismjs';
	import RelatedArticles from '$lib/components/ui/RelatedArticles.svelte';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { downloadPDF } from '$lib/utils/pdf-generator';
	import Reddit from '$lib/components/ui/icons/Reddit.svelte';
	import Farcaster from '$lib/components/ui/icons/Farcaster.svelte';
	import Telegram from '$lib/components/ui/icons/Telegram.svelte';
	import Whatsapp from '$lib/components/ui/icons/Whatsapp.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import 'prismjs/components/prism-python';
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-rust';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-latex';
	import 'prismjs/components/prism-sql';
	import 'prismjs/components/prism-c';
	import 'prismjs/components/prism-markup';
	import 'prismjs/components/prism-solidity';
	import ArticleHead from '$lib/components/server/ArticleHead.svelte';
	import { error } from '@sveltejs/kit';
	import { browser } from '$app/environment';
	import DOMPurify from 'isomorphic-dompurify';
	import type { Icon } from 'lucide-svelte';

	type ContentState = 'initial' | 'updating' | 'ready' | 'error';
	let contentState: ContentState = 'initial';

	let currentURL = $state('');
	let lightboxImages = $state<string[]>([]);
	let lightboxIndex = $state(0);
	let showLightbox = $state(false);
	let summaryOpen = $state(false);
	let showFloatingButtons = $state(false);
	let copySuccess = $state(false);
	let showShareDropdown = $state(false);

	let closeTimeout: ReturnType<typeof setTimeout>;

	const encodedUrl = encodeURIComponent($page.url.href);
	const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodedUrl}`;
	const linkedinShareURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
	const redditShareURL = `https://www.reddit.com/submit?url=${encodedUrl}`;

	const { data }: { data: PageData } = $props();

	if (!data.article) {
		throw error(404, 'Article not found');
	}

	const farcasterShareURL = `https://warpcast.com/~/compose?text=${encodeURIComponent(data.article.title + ' ' + encodedUrl)}`;
	const telegramShareURL = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(data.article.title)}`;
	const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(data.article.title + ' ' + $page.url.href)}`;
	const mailShareURL = `mailto:?subject=${encodeURIComponent(data.article.title)}&body=${encodeURIComponent(encodedUrl)}`;

	interface ShareOption {
		name: string;
		url: string;
		icon: typeof Icon | Component<any>;
		isSvg?: boolean;
	}

	const shareOptions: ShareOption[] = [
		{ name: 'X/Twitter', url: twitterShareURL, icon: Twitter },
		{ name: 'Farcaster', url: farcasterShareURL, icon: Farcaster },
		{ name: 'Reddit', url: redditShareURL, icon: Reddit },
		{ name: 'LinkedIn', url: linkedinShareURL, icon: Linkedin },
		{ name: 'Telegram', url: telegramShareURL, icon: Telegram },
		{ name: 'Mail', url: mailShareURL, icon: Mail },
		{ name: 'Whatsapp', url: whatsappShareUrl, icon: Whatsapp }
	];

	let progress = $state(0);

	function updateReadingProgress() {
		const article = document.querySelector('article');
		if (!article) return;

		const windowHeight = window.innerHeight;
		const articleHeight = article.offsetHeight;
		const scrollTop = window.scrollY;

		const totalHeight = articleHeight - windowHeight;
		const currentProgress = (scrollTop / totalHeight) * 100;
		progress = Math.min(Math.max(currentProgress, 0), 100);
	}

	async function highlightCodeBlocks() {
		if (contentState !== 'ready') return;

		try {
			const codeElements = document.querySelectorAll('pre code');
			if (codeElements.length === 0) {
				return;
			}

			requestAnimationFrame(() => {
				Prism.highlightAll();
			});
		} catch (error) {
			contentState = 'error';
			console.error('Highlighting error:', error);
		}
	}

	async function updateContent() {
		contentState = 'updating';
		try {
			await tick();
			contentState = 'ready';
			highlightCodeBlocks();
		} catch (error) {
			console.error('Content update failed:', error);
			contentState = 'error';
		}
	}

	function extractImagesFromContent(content: string): string[] {
		if (!window) return [];

		try {
			const parser = new DOMParser();
			const doc = parser.parseFromString(content, 'text/html');
			const images = Array.from(doc.querySelectorAll('img')).map((img) => img.src);
			return images;
		} catch (error) {
			console.error('Failed to extract images:', error);
			return [];
		}
	}

	function updateImageEventListeners() {
		if (!window) return;

		const container = document.getElementById('content-container');
		if (container) {
			const images = container.querySelectorAll('img');
			images.forEach((img) => {
				img.addEventListener('click', () => {
					lightboxIndex = lightboxImages.indexOf(img.src);
					showLightbox = true;
				});
			});
		}
	}

	function addSmoothScrollingToInternalLinks() {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', function (e) {
				e.preventDefault();

				const targetId = anchor.getAttribute('href')?.substring(1);
				if (!targetId) return;

				const targetElement = document.getElementById(targetId);

				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}
			});
		});
	}

	function toggleSummary() {
		summaryOpen = !summaryOpen;
		updateURL();
	}

	function updateURL() {
		const url = new URL(window.location.href);
		if (summaryOpen) {
			url.searchParams.set('summary', 'true');
		} else {
			url.searchParams.delete('summary');
		}
		window.history.replaceState({}, '', url);
	}

	async function copyShareLink() {
		const url = new URL(window.location.href);
		await navigator.clipboard.writeText(url.toString());
		copySuccess = true;
		setTimeout(() => {
			copySuccess = false;
		}, 2000);
	}

	function handleScroll() {
		if (!window) return;
		const contentContainer = document.querySelector('#content-container');
		if (!contentContainer) return;

		const contentRect = contentContainer.getBoundingClientRect();
		// Always show in reading mode, otherwise show after scroll
		showFloatingButtons = isReadingMode || (window.scrollY > 100 && contentRect.bottom >= 0);
	}

	type ClickOutsideOptions = {
		isOpen: boolean;
		containerSelector: string;
		toggleSelector: string;
		onClose: () => void;
	};

	function handleClickOutside(event: MouseEvent | TouchEvent, options: ClickOutsideOptions): void {
		const { isOpen, containerSelector, toggleSelector, onClose } = options;
		const trigger = document.querySelector(toggleSelector) as HTMLElement;
		const panel = document.querySelector('.summary-panel');
		const target =
			(event.target as HTMLElement) || ((event as TouchEvent).touches[0].target as HTMLElement);

		if (!isOpen) return;

		if (panel && !panel.contains(target) && !target.closest('[data-summary-toggle]')) {
			toggleSummary();
		}

		const container = document.querySelector(containerSelector);

		if (container && !container.contains(target) && !target.closest(toggleSelector)) {
			onClose();
			trigger?.focus();
		}
	}

	function handleMouseLeave() {
		closeTimeout = setTimeout(() => {
			showShareDropdown = false;
		}, 300);
	}

	let readingTime = $state('');

	function calculateReadingTime() {
		if (!data || !data.article || !data.article.content) return '';

		const wordsPerMinute = 200;
		const textContent = data.article.content.replace(/<[^>]*>/g, '');
		const wordCount = textContent.split(/\s+/).length;
		const minutes = Math.ceil(wordCount / wordsPerMinute);

		return `${minutes} min read`;
	}

	function processHeaderIds() {
		if (!window) return;

		// Get container based on reading mode
		const container = isReadingMode
			? document.querySelector('.reading-content')
			: document.getElementById('content-container');

		if (!container) return;

		const headers = container.querySelectorAll('h1, h2');
		headers.forEach((header) => {
			if (!header.id) {
				const id = header.textContent
					?.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/(^-|-$)/g, '');

				if (id) header.id = id;
			}
			header.classList.add('group');

			// Remove existing indicator span if it exists
			const existingSpan = header.querySelector('span[data-header-indicator]');
			if (existingSpan) {
				existingSpan.remove();
			}
			// Create and add the new indicator span
			const headerIndicator = document.createElement('span');
			headerIndicator.innerText = '#';
			headerIndicator.className =
				'hidden sm:inline-block ml-2 text-primary/0 group-hover:text-primary/80 transition-colors italic absolute';
			headerIndicator.setAttribute('data-header-indicator', 'true');
			header.appendChild(headerIndicator);
		});
	}

	let copiedHeaderId = $state<string | null>(null);

	async function handleHeaderClick(header: HTMLElement) {
		if (!header.id) return;

		const url = new URL(window.location.href);
		url.hash = header.id;
		await navigator.clipboard.writeText(url.toString());

		copiedHeaderId = header.id;
		setTimeout(() => {
			copiedHeaderId = null;
		}, 2000);
	}

	function addHeaderClickListeners() {
		if (!window) return;

		const container = document.getElementById('content-container');
		if (!container) return;

		const headers = container.querySelectorAll('h1, h2, h3');
		const clickHandlers = new WeakMap();
		headers.forEach((header) => {
			let clickHandler = clickHandlers.get(header);
			if (!clickHandler) {
				clickHandler = () => handleHeaderClick(header as HTMLElement);
				clickHandlers.set(header, clickHandler);
			}
			header.removeEventListener('click', clickHandler);
			header.addEventListener('click', clickHandler);

			header.classList.add(
				'cursor-pointer',
				'transition-colors',
				'transition-opacity',
				'duration-200',
				'hover:opacity-80',
				'active:text-primary/60',
				'active:translate-y-[1px]'
			);
		});
	}

	let isDownloading = $state(false);

	async function handlePdfDownload(article: Article) {
		isDownloading = true;
		try {
			await downloadPDF(article);
		} finally {
			isDownloading = false;
		}
	}

	function getDropdownPosition(button: HTMLElement) {
		const buttonRect = button.getBoundingClientRect();
		const dropdownHeight = 280;
		const windowHeight = window.innerHeight;
		const spaceBelow = windowHeight - buttonRect.bottom;
		const spaceAbove = buttonRect.top;

		return spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';
	}

	let dropdownPosition = $state('bottom');

	function handleMouseEnter(event: MouseEvent) {
		clearTimeout(closeTimeout);
		const button = (event.currentTarget as HTMLElement)?.querySelector('button');
		if (button) {
			dropdownPosition = getDropdownPosition(button);
		}
		showShareDropdown = true;
	}

	function sanitizeContent(content: string) {
		// The following line causes a desync between server & client, resulting in
		// massive fuckery. Do not uncomment without a very good reason.
		//if (!browser) return content;
		return DOMPurify.sanitize(content, {
			ALLOWED_TAGS: [
				'h1',
				'h2',
				'h3',
				'h4',
				'p',
				'a',
				'strong',
				'em',
				'ul',
				'ol',
				'li',
				'img',
				'pre',
				'code',
				'blockquote',
				'table',
				'tr',
				'td',
				'th'
			],
			ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id', 'target', 'rel']
		});
	}

	// Update state management for reading mode
	let isReadingMode = $state(false);

	// Initialize reading mode from localStorage
	onMount(() => {
		const storedReadingMode = localStorage.getItem('readingMode');
		if (storedReadingMode !== null) {
			isReadingMode = storedReadingMode === 'true';
		}
		currentURL = window.location.href;
		contentState = 'ready';

		if (data.article.content) {
			lightboxImages = extractImagesFromContent(data.article.content);
		}

		highlightCodeBlocks();
		addSmoothScrollingToInternalLinks();
		updateImageEventListeners();

		const observer = new MutationObserver(() => {
			updateImageEventListeners();
		});

		const container = document.getElementById('content-container');
		if (container) {
			observer.observe(container, { childList: true, subtree: true });
		}

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial check

		const urlParams = new URLSearchParams(window.location.search);
		summaryOpen = urlParams.get('summary') === 'true';

		// Add click outside listener
		const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
			handleClickOutside(event, {
				isOpen: summaryOpen,
				containerSelector: '.summary-panel',
				toggleSelector: '[data-summary-toggle]',
				onClose: toggleSummary
			});
		};

		document.addEventListener('mousedown', handleOutsideClick);
		document.addEventListener('touchstart', handleOutsideClick);

		window.addEventListener('scroll', updateReadingProgress);

		readingTime = calculateReadingTime();

		processHeaderIds();

		addHeaderClickListeners();

		// Add keyboard shortcut listener
		window.addEventListener('keydown', handleKeyPress);

		// Handle browser's print event
		window.addEventListener('beforeprint', handleBeforePrint);

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mousedown', handleOutsideClick);
			document.removeEventListener('touchstart', handleOutsideClick);
			clearTimeout(closeTimeout);
			window.removeEventListener('scroll', updateReadingProgress);
			window.removeEventListener('keydown', handleKeyPress);
			window.removeEventListener('beforeprint', handleBeforePrint);
		};
	});

	$effect(() => {
		if (data.article.content && contentState === 'ready') {
			processHeaderIds();
			addHeaderClickListeners();
			highlightCodeBlocks();
		}
	});

	$effect(() => {
		if (window) {
			const newURL = window.location.href;
			if (currentURL && currentURL !== newURL) {
				currentURL = newURL;
				contentState = 'updating';
				updateContent();
			}
		}
	});

	$effect(() => {
		if (window) {
			document.body.style.overflow = summaryOpen ? 'hidden' : '';
		}
	});

	function toggleReadingMode() {
		isReadingMode = !isReadingMode;
		localStorage.setItem('readingMode', isReadingMode.toString());
	}

	$effect(() => {
		if (isReadingMode !== undefined) {
			// Wait for DOM update
			setTimeout(processHeaderIds, 0);
		}
	});

	function handleKeyPress(event: KeyboardEvent) {
		// Check for cmd+p (Mac) or ctrl+p (Windows)
		if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
			event.preventDefault(); // Prevent default print dialog
			if (data.article) {
				handlePdfDownload(data.article);
			}
		}
	}

	function handleBeforePrint(event: Event) {
		event.preventDefault();
		if (data.article) {
			handlePdfDownload(data.article);
		}
	}
</script>

<ArticleHead article={data.article} />

<div class="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50" aria-hidden="true">
	<div
		class="h-full bg-primary transition-all duration-150 ease-out"
		style="width: {progress}%"
	></div>
</div>

<div class="flex flex-col gap-y-6 md:gap-y-14">
	{#if !isReadingMode}
		{@render header(data.article)}
	{/if}
	{@render body(data.article)}
	{#if !isReadingMode}
		{@render floatingButtons()}
	{/if}
	<div class="px-3 md:px-12 {isReadingMode ? 'hidden' : ''}">
		<hr class="mb-6 md:mb-12" />
		<RelatedArticles categories={data.article.categories} currentArticleId={data.article.id} />
	</div>
</div>

{#snippet header(article: Article)}
	<div class="relative">
		<div class="absolute inset-0 w-full">
			<img src={article.thumb} alt={article.title} class="w-full h-full object-cover" />
			<div
				class="absolute inset-0 bg-gradient-to-b from-black/70 to-white dark:from-black/70 dark:to-background"
			></div>
		</div>

		<div class="relative px-3 md:px-12">
			<header class="flex justify-between flex-col p-10 max-md:px-5">
				<a
					href="/"
					aria-label="Back to Home"
					class="flex gap-2 justify-center items-center px-2 w-10 h-10 border border-solid rounded-full mb-32 md:mb-44 bg-background/80 hover:bg-background"
				>
					<ArrowLeft class="w-6 h-6" />
				</a>
				<div class="flex flex-col max-w-full tracking-tight w-[888px]">
					<section class="flex flex-col w-full">
						<div class="flex flex-wrap gap-2 font-mono">
							{#each article.categories as category}
								<a href={'/category/' + category.name.toLowerCase()}
									><Badge
										variant="rectangular"
										class="bg-black/50 text-white border-white/20 text-xs lg:text-sm"
									>
										{category.name}
									</Badge></a
								>
							{/each}
						</div>

						<h1
							class="font-soehne capitalize text-6xl font-medium leading-[70px] max-md:max-w-full max-md:text-4xl max-md:leading-[52px] break-words"
						>
							{article.title}
						</h1>

						<p class="text-xl max-md:max-w-full">
							{article.summary}
						</p>
					</section>
					<div class="self-start pb-6 mt-4 font-mono">
						<span>By</span>
						{#each article.authors as author, index}
							<a
								href={author.twitterUsername
									? `https://twitter.com/${author.twitterUsername}`
									: null}
								target="_blank"
								rel="noopener noreferrer"
								class={author.twitterUsername ? 'border-b' : ''}
							>
								{author.fullName}
							</a>
							{#if index < article.authors.length - 2}
								<span>, </span>
							{:else if index < article.authors.length - 1}
								<span>{' '}and{' '}</span>
							{/if}
						{/each}
					</div>
				</div>

				<div
					class="flex flex-wrap gap-2 md:gap-10 w-full justify-between items-start tracking-tight max-md:max-w-full"
				>
					<div class="flex items-center gap-2 text-gray-500 font-mono">
						<time datetime={article.scheduledPublishTime}>
							{new Date(article.scheduledPublishTime).toLocaleDateString('en-GB', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</time>
						<span class="inline">|</span>
						<span>{readingTime}</span>
					</div>
					<nav class="flex gap-1.5 items-center font-mono">
						<div
							class="relative"
							onmouseenter={handleMouseEnter}
							onmouseleave={handleMouseLeave}
							role="menu"
							tabindex="0"
						>
							<button
								onkeydown={(e) => e.key === 'Escape' && (showShareDropdown = false)}
								class="flex items-center gap-1 rounded-full hover:text-primary/50 cursor-pointer"
								aria-label="Share article"
								aria-expanded={showShareDropdown}
								aria-haspopup="true"
								data-share-toggle
							>
								<Share class="w-5 h-5" />
								<span class="border-b">Share</span>
							</button>

							{#if showShareDropdown}
								<div
									class="share-dropdown absolute {dropdownPosition === 'bottom'
										? 'mt-2 top-full'
										: 'bottom-full mb-2'} 
									left-0 w-40 bg-backgroundLighter shadow-lg z-50 transition-opacity duration-200 sm:left-auto sm:right-0"
								>
									{#each shareOptions as option}
										<a
											href={option.url}
											target="_blank"
											rel="noopener noreferrer"
											role="menuitem"
											class="block px-4 py-2 hover:bg-white hover:text-black flex items-center gap-2"
										>
											{#if option.isSvg}
												{@html option.icon}
											{:else}
												{@const IconComponent = option.icon}
												<IconComponent class="w-5 h-5" />
											{/if}
											<span class="text-sm">{option.name}</span>
										</a>
									{/each}
									<button
										onclick={copyShareLink}
										role="menuitem"
										class="block w-full px-4 py-2 hover:bg-white hover:text-black text-left flex items-center gap-2"
									>
										<Link2 class="w-5 h-5" />
										{#if copySuccess}
											<span class="text-special-blue text-sm">Link Copied</span>
										{:else}
											<span class="text-sm">Copy Link</span>
										{/if}
									</button>
								</div>
							{/if}
						</div>

						<!-- PDF Download Button -->
						<span class="self-stretch my-auto mx-1">|</span>
						<button
							onclick={() => handlePdfDownload(article)}
							class="flex items-center gap-1 hover:text-primary/50 cursor-pointer disabled:cursor-wait disabled:opacity-50"
							aria-label="Download as PDF"
							disabled={isDownloading}
						>
							{#if isDownloading}
								<div
									class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
								></div>
							{:else}
								<FileDown class="w-5 h-5" />
							{/if}
							<span class="border-b">PDF</span>
						</button>
					</nav>
				</div>
			</header>
		</div>
	</div>
{/snippet}

{#snippet body(article: Article)}
	<article
		class="lg:flex lg:gap-14 relative {isReadingMode ? 'reading-mode' : ''}"
		class:overflow-hidden={summaryOpen}
	>
		<!-- Hide TOC in reading mode -->
		{#if !isReadingMode}
			<TableOfContents tableOfContents={article.tableOfContents} />
			<div id="toc" class="block lg:hidden"></div>
		{/if}

		<!-- Update the back button in reading mode -->
		{#if isReadingMode}
			<a
				href="/"
				class="absolute left-[20px] top-0 p-2 hover:bg-secondary rounded-full transition-colors"
				aria-label="Back to home"
			>
				<ArrowLeft class="w-5 h-5" />
			</a>
		{/if}

		<div
			id="content-container"
			class="relative px-3 md:px-12 lg:px-0 pb-20 text-primary w-full lg:max-w-screen-md leading-8 flex flex-col
			{isReadingMode ? 'reading-content' : ''}
			[&>h1]:scroll-mt-32 [&>h2]:scroll-mt-32 [&>h3]:scroll-mt-32 [&>h4]:scroll-mt-32
			[&>h1]:text-5xl [&>h1]:font-medium [&>h1]:mb-6 [&>h1]:mt-16 [&_h1]:leading-58 [&_h1]:tracking-tighter
			[&>h2]:text-3xl [&>h2]:font-medium [&>h2]:mt-8 [&>h2]:mb-4 [&_h2]:leading-9 [&_h2]:tracking-tight
			[&>h3]:text-2xl [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-4 [&_h3]:leading-7 [&_h3]:tracking-tight
			[&>h4]:text-xl [&>h4]:font-medium [&>h4]:mb-3
			[&>p]:text-base md:[&>p]:text-lg [&_p]:leading-7 [&_p]:tracking-normal [&_p]:mb-4
			[&_p:has(img)]:mt-6 [&_p:has(img)]:mb-12 [&_p:has(img)]:text-xs [&_p:has(img)]:text-gray-400 [&_p:has(img)]:text-center
			[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/60 [&_a]:transition-colors [&_a]:decoration-cyan-400
			[&_strong]:font-semibold [&_strong]:leading-6 [&_strong]:tracking-normal [&_strong]:font-[inherit]
			[&_table]:mb-6 md:[&_table]:mb-8 [&_table]:w-full md:[&_table]:w-2/3
			[&_em]:leading-6 [&_em]:italic
			[&_ol]:flex [&_ol]:flex-col [&_ol]:gap-y-1 [&_ol]:mb-6 [&_ol]:ml-6 [&_ol]:text-base md:[&>ol]:text-lg [&_ol]:list-decimal [&_ol]:leading-7 [&_ol]:tracking-normal
			[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-1 [&_ul]:mb-6 [&_ul]:ml-6 [&_ul]:text-base md:[&>ul]:text-lg [&_ul]:list-disc [&_ul]:leading-7 [&_ul]:tracking-normal
			[&>ul>li]:leading-8 [&>ul>li>p]:mb-0 [&>ol>li>p]:mb-0
			[&_img]:mx-auto [&_img]:block
			[&>blockquote]:text-base md:[&>blockquote]:text-lg [&>blockquote]:leading-7 [&>blockquote]:tracking-normal
			[&_blockquote]:border-l-4 [&_blockquote]:border-h-auto [&_blockquote]:border-gray-300 [&_blockquote]:pl-7
			[&_blockquote]:mb-4 [&_blockquote]:italic [&_blockquote>p:last-of-type]:mb-0
			[&_pre]:overflow-x-auto [&_code]:overflow-x-auto [&_code:not(pre_>_code)]:text-[#0312BF]
			"
			class:copied={copiedHeaderId}
		>
			<!-- Update the metadata section -->
			{#if isReadingMode}
				<div class="mb-10 font-eb-garamond border-b border-gray-800 pb-8">
					<h1 class="text-4xl mb-6 tracking-tight">{article.title}</h1>
					<p class="text-xl mb-8 text-gray-500 dark:text-gray-300 leading-relaxed tracking-tight">
						{article.summary}
					</p>
					<div class="flex flex-col gap-3 text-base text-gray-400">
						<div class="">
							By
							{#each article.authors as author, index}
								{' '}
								<a
									href={author.twitterUsername
										? `https://twitter.com/${author.twitterUsername}`
										: null}
									target="_blank"
									rel="noopener noreferrer"
									class={author.twitterUsername ? 'reading-mode-link' : ''}
								>
									{author.fullName}
								</a>
								{#if index < article.authors.length - 2}
									<span>,</span>
								{:else if index < article.authors.length - 1}
									<span>and</span>
								{/if}
							{/each}
						</div>
						<div class="flex items-center gap-2">
							<time datetime={article.scheduledPublishTime}>
								{new Date(article.scheduledPublishTime).toLocaleDateString('en-GB', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</time>
							<span>·</span>
							<span>{readingTime}</span>
						</div>
					</div>
				</div>
			{/if}

			<div
				class="mb-8 bg-white h-24 sticky z-50 top-24 rounded-lg shadow-lg shadow-special-blue/20 overflow-clip"
			>
				<iframe
					id="AudioNativeElevenLabsPlayer"
					title="AudioNative ElevenLabs Player"
					width="100%"
					height="96"
					frameborder="no"
					scrolling="no"
					src="https://elevenlabs.io/player/index.html?publicUserId=8ad299f5577a1c569543dae730993de0382c7c4aefa1eb8fc88e8516d4affa89"
					class="h-24"
				></iframe>
			</div>

			{@html sanitizeContent(article.content)}
		</div>
		{@render floatingButtons()}
	</article>
{/snippet}

{#snippet floatingButtons()}
	{#if showFloatingButtons || isReadingMode}
		<div
			class="fixed bottom-10 right-10 flex gap-3 transition-all duration-300"
			in:fly={{ y: 20, duration: 300, opacity: 0 }}
			out:fly={{ y: 20, duration: 300, opacity: 0 }}
		>
			{#if !isReadingMode && data?.article?.gpt_summary}
				<button
					onclick={toggleSummary}
					class="bg-primary text-primary-foreground p-4 rounded-full hover:bg-primary/90 transition-all duration-300"
					aria-label="Show AI Summary"
					data-summary-toggle
				>
					<svelte:component this={BrainCog} class="w-6 h-6" />
				</button>
			{/if}
			<button
				onclick={toggleReadingMode}
				class="bg-primary text-primary-foreground p-4 rounded-full hover:bg-primary/90 transition-colors"
				aria-label="Toggle reading mode"
			>
				<svelte:component this={ScrollText} class="w-6 h-6" />
			</button>
		</div>
	{/if}
{/snippet}

{#snippet summaryPanel()}
	{#if data?.article?.gpt_summary}
		<div
			class="fixed inset-y-0 right-0 pointer-events-none z-50 flex items-center"
			class:overflow-hidden={summaryOpen}
		>
			<div
				class="fixed inset-0 bg-black/50 transition-opacity duration-500"
				style="opacity: {summaryOpen ? '1' : '0'}"
				role="presentation"
				aria-hidden="true"
			></div>
			<div
				class="summary-panel w-full lg:max-w-screen-md bg-background h-screen transform will-change-transform backface-visibility-hidden -webkit-backface-visibility-hidden transition-transform duration-500 ease-out pointer-events-auto flex flex-col relative z-10"
				class:overflow-hidden={summaryOpen}
				style="transform: translateX({summaryOpen ? '0%' : '100%'})"
			>
				<div
					class="sticky top-0 z-10 bg-background border-b px-8 py-4 flex justify-between items-center"
				>
					<h2 class="text-2xl font-medium">Summary</h2>
					<button
						onclick={toggleSummary}
						class="p-2 hover:bg-secondary rounded-full"
						aria-label="Close summary"
					>
						<XIcon class="w-6 h-6" />
					</button>
				</div>
				<div
					class="flex-1 overflow-y-auto px-12 py-6 text-primary w-full leading-8
					[&>h1]:text-5xl [&>h1]:font-medium [&>h1]:mb-6 [&>h1]:mt-16 [&_h1]:leading-58 [&_h1]:tracking-tighter
					[&>h2]:text-3xl [&>h2]:font-medium [&>h2]:mt-8 [&>h2]:mb-4 [&_h2]:leading-9 [&_h2]:tracking-tight
					[&>h3]:text-2xl [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-4 [&_h3]:leading-7 [&_h3]:tracking-tight
					[&>h4]:text-xl [&>h4]:font-medium [&>h4]:mb-3
					[&>p]:text-base md:[&>p]:text-lg [&_p]:leading-7 [&_p]:tracking-normal [&_p]:mb-4
					[&_p:has(img)]:mt-6 [&_p:has(img)]:mb-12 [&_p:has(img)]:text-xs [&_p:has(img)]:text-gray-400 [&_p:has(img)]:text-center
					[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/60 [&_a]:transition-colors [&_a]:decoration-cyan-400
					[&_strong]:font-semibold [&_strong]:leading-6 [&_strong]:tracking-normal [&_strong]:text-base
					[&_em]:leading-6 [&_em]:italic
					[&_ol]:flex [&_ol]:flex-col [&_ol]:gap-y-1 [&_ol]:mb-6 [&_ol]:ml-6 [&_ol]:text-lg [&_ol]:list-decimal [&_ol]:leading-7 [&_ol]:tracking-normal
					[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-1 [&_ul]:mb-6 [&_ul]:ml-6 [&_ul]:text-lg [&_ul]:list-disc [&_ul]:leading-7 [&_ul]:tracking-normal"
				>
					{@html sanitizeContent(data.article.gpt_summary)}
				</div>
			</div>
		</div>
	{/if}
{/snippet}

<!-- Add this right after the main content div -->
{@render summaryPanel()}

<style>
	/* Add Garamond font */
	@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');

	/* Update reading mode styles */
	:global(.reading-mode) {
		@apply max-w-[68ch] mx-auto relative px-8 pt-16;
	}

	:global(.reading-content) {
		@apply text-primary w-full leading-8
			[&>h1]:text-5xl [&>h1]:font-medium [&>h1]:mb-6 [&>h1]:mt-16 [&_h1]:leading-58 [&_h1]:tracking-tighter
			[&>h2]:text-3xl [&>h2]:font-medium [&>h2]:mt-8 [&>h2]:mb-4 [&_h2]:leading-9 [&_h2]:tracking-tight
			[&>h3]:text-2xl [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-4 [&_h3]:leading-7 [&_h3]:tracking-tight
			[&>h4]:text-xl [&>h4]:font-medium [&>h4]:mb-3
			[&>p]:text-lg [&_p]:leading-7 [&_p]:tracking-normal [&_p]:mb-4
			[&_p:has(img)]:mt-6 [&_p:has(img)]:mb-12 [&_p:has(img)]:text-xs [&_p:has(img)]:text-gray-400 [&_p:has(img)]:text-center
			[&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-cyan-400 [&_a:hover]:text-primary/60 [&_a]:transition-colors
			[&_strong]:font-semibold [&_strong]:leading-6 [&_strong]:tracking-normal [&_strong]:text-base
			[&_em]:leading-6 [&_em]:italic
			[&_ol]:flex [&_ol]:flex-col [&_ol]:gap-y-1 [&_ol]:mb-6 [&_ol]:ml-6 [&_ol]:text-lg [&_ol]:list-decimal [&_ol]:leading-7 [&_ol]:tracking-normal
			[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-1 [&_ul]:mb-6 [&_ul]:ml-6 [&_ul]:text-lg [&_ul]:list-disc [&_ul]:leading-7 [&_ul]:tracking-normal;
		@apply font-eb-garamond;
	}
</style>
