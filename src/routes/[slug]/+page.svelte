<!-- TODO: Add links to share buttons -->
<script lang="ts">
	import { page } from '$app/stores';
	import ArticleHead from '$lib/components/server/ArticleHead.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Farcaster from '$lib/components/ui/icons/Farcaster.svelte';
	import Reddit from '$lib/components/ui/icons/Reddit.svelte';
	import Research from '$lib/components/ui/icons/Research.svelte';
	import Telegram from '$lib/components/ui/icons/Telegram.svelte';
	import Whatsapp from '$lib/components/ui/icons/Whatsapp.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import RelatedArticles from '$lib/components/ui/RelatedArticles.svelte';
	import TableOfContents from '$lib/components/ui/TableOfContents.svelte';
	import type { Article } from '$lib/types/article';
	import { downloadPDF } from '$lib/utils/pdf-generator';
	import { supabase } from '$lib/utils/supabase';
	import { cn } from '$lib/utils/ui-components';
	import { error } from '@sveltejs/kit';
	import DOMPurify from 'isomorphic-dompurify';
	import {
		ArrowUp,
		Bookmark,
		FileDown,
		Headphones,
		Home,
		Link2,
		Loader2,
		Printer,
		Share,
		Share2,
		User,
		X,
		type Icon
	} from 'lucide-svelte';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import BrainCog from 'lucide-svelte/icons/brain-cog';
	import Linkedin from 'lucide-svelte/icons/linkedin';
	import Mail from 'lucide-svelte/icons/mail';
	import Twitter from 'lucide-svelte/icons/twitter';
	import XIcon from 'lucide-svelte/icons/x';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-c';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-latex';
	import 'prismjs/components/prism-markup';
	import 'prismjs/components/prism-python';
	import 'prismjs/components/prism-rust';
	import 'prismjs/components/prism-solidity';
	import 'prismjs/components/prism-sql';
	import 'prismjs/components/prism-typescript';
	import { onMount, tick, type Component } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { derived } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';

	type ContentState = 'initial' | 'updating' | 'ready' | 'error';
	let contentState: ContentState = 'initial';

	let currentURL = $state('');
	let lightboxImages = $state<string[]>([]);
	let lightboxIndex = $state(0);
	let showLightbox = $state(false);
	let summaryOpen = $state(false);
	let showFloatingButtons = $state(false);
	let showTopbar = $state(false);
	let copySuccess = $state(false);
	let showShareDropdown = $state(false);

	let closeTimeout: ReturnType<typeof setTimeout>;

	const encodedUrl = encodeURIComponent($page.url.href);
	const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodedUrl}`;
	const linkedinShareURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
	const redditShareURL = `https://www.reddit.com/submit?url=${encodedUrl}`;

	const { data } = $props<{ data: PageData }>();

	if (!data.article) {
		throw error(404, 'Article not found');
	}

	const farcasterShareURL = `https://warpcast.com/~/compose?text=${encodeURIComponent(data.article.title + ' ' + encodedUrl)}`;
	const telegramShareURL = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(data.article.title)}`;
	const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(data.article.title + ' ' + $page.url.href)}`;
	const mailShareURL = `mailto:?subject=${encodeURIComponent(data.article.title)}&body=${encodeURIComponent(encodedUrl)}`;
	// const discordShareURL = `https://discordapp.com/share?url=${encodeURIComponent(encodedUrl)}`;

	interface ShareOption {
		name: string;
		url: string;
		icon: typeof Icon | Component<any>;
		isSvg?: boolean;
	}

	const shareOptions: ShareOption[] = [
		{ name: 'Email', url: mailShareURL, icon: Mail },
		{ name: 'X/Twitter', url: twitterShareURL, icon: Twitter },
		{ name: 'Telegram', url: telegramShareURL, icon: Telegram },
		{ name: 'LinkedIn', url: linkedinShareURL, icon: Linkedin },
		{ name: 'Farcaster', url: farcasterShareURL, icon: Farcaster },
		{ name: 'Reddit', url: redditShareURL, icon: Reddit },
		{ name: 'Whatsapp', url: whatsappShareUrl, icon: Whatsapp }
		// { name: 'Discord', url: discordShareURL, icon: Discord }
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
		// showTopbar = isReadingMode || (window.scrollY > 550 && contentRect.bottom >= 0);
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

	async function handlePdfDownload(article: Article, print = false) {
		isDownloading = true;
		try {
			await downloadPDF(article, print);
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

	// Function to refresh TOC when content is updated
	function refreshToc() {
		if (contentState === 'ready') {
		}
	}

	onMount(() => {
		// const storedReadingMode = localStorage.getItem('readingMode');
		// if (storedReadingMode !== null) {
		// 	isReadingMode = storedReadingMode === 'true';
		// }
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
		handleScroll();

		const urlParams = new URLSearchParams(window.location.search);
		summaryOpen = urlParams.get('summary') === 'true';

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

		window.addEventListener('keydown', handleKeyPress);

		window.addEventListener('beforeprint', handleBeforePrint);

		$effect(() => {
			if (contentState === 'ready') {
				refreshToc();
			}
		});

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
			setTimeout(processHeaderIds, 0);
		}
	});

	function handleKeyPress(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
			event.preventDefault();
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

	let isLoggedIn = $state(false);
	let showAuthBanner = $state(false);
	let isCheckingAuth = $state(true);
	let bookmarks = $state<string[]>([]);
	let userId = $state<string | null>(null);
	let userEmail = $state<string | null>(null);
	let showShareModal = $state(false);

	let loadingBookmarks = $state(true);

	const handleFetchBookmarks = async () => {
		loadingBookmarks = true;

		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user) {
				const { data, error } = await supabase
					.from('UserBookmarks')
					.select('*')
					.eq('userId', user.id)
					.limit(1)
					.single();

				if (data) {
					const savedBookmarks = data.articleIds || [];

					bookmarks = savedBookmarks;
				}

				if (error) {
					if (error.code === 'PGRST116') {
						const { error: createError } = await supabase
							.from('UserBookmarks')
							.insert({ userId: user.id, articleIds: [] });

						if (createError) {
							toast.error('An error occured. Please try again.');
						}
					} else {
						toast.error('Error fetching bookmarks');
					}
				}
			}
		} catch (error) {
			console.error(error);
			toast.error('Error loading bookmarks. Please try again.');
		} finally {
			loadingBookmarks = false;
		}
	};

	const handleFetchUser = async () => {
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user && user.user_metadata.email_verified) {
				isLoggedIn = true;
				userId = user.id;
				userEmail = user.email || null;
			} else {
				isLoggedIn = false;
				userId = null;
				userEmail = null;
			}
		} catch (error) {
			isLoggedIn = false;
			userId = null;
			userEmail = null;
		} finally {
			isCheckingAuth = false;
		}
	};

	$effect(() => {
		handleFetchUser();
		handleFetchBookmarks();
	});

	let openShareMobile = $state(false);
	let isBookmarking = $state(false);

	const slug = derived(page, ($page) => $page.url.pathname.split('/').pop());
	let isBookmarked = $state(false);

	$effect(() => {
		isBookmarked = bookmarks.includes($slug || '');
	});

	const handleToogleAddToBookmarks = async () => {
		if (isBookmarking) return;

		isBookmarking = false;

		if (!$slug) return;

		if (!isLoggedIn && !userId) {
			showAuthBanner = true;
			bannerText = 'Bookmarking articles';

			return;
		}

		const currentBookmarks = bookmarks;

		const newBookmarks: any[] = isBookmarked
			? bookmarks.filter((id) => id !== $slug)
			: [...bookmarks, $slug];

		bookmarks = newBookmarks;

		if (isBookmarked) {
			toast.success('Article removed from your bookmarks');
		} else {
			toast.success('Article added to your bookmarks');
		}

		isBookmarking = true;

		try {
			const { data, error } = await supabase
				.from('UserBookmarks')
				.update({ articleIds: newBookmarks })
				.eq('userId', userId)
				.select();

			if (error) {
				bookmarks = currentBookmarks;

				toast.error(`Couldn't add article to bookmarks`);
			}
		} catch (error) {
			bookmarks = currentBookmarks;

			toast.error('An error occured. Please try again.');
		} finally {
			isBookmarking = false;
		}
	};

	function handleScrollToTop() {
		document.body.scrollIntoView({ behavior: 'smooth' });
	}

	let bannerText = $state('');
</script>

<ArticleHead article={data.article} />

{#if loadingBookmarks}
	<div class="h-dvh w-dvw bg-background z-[99] flex items-center justify-center fixed top-0 left-0">
		<Loader2 class="animate-spin" />
	</div>
{/if}

<div
	class={cn(
		'fixed top-0 left-0 w-full h-[2.5px] bg-neutral-80 z-[99999]',
		loadingBookmarks && 'hidden'
	)}
	aria-hidden="true"
>
	<div
		class="h-full bg-neutral-20 transition-all duration-150 ease-out"
		style="width: {progress}%"
		aria-label={`Progress ${progress}%`}
	></div>
</div>

{#if showAuthBanner}
	<div
		class="fixed h-screen w-screen bg-black/30 backdrop-blur-[3px] top-0 left-0 z-[9999999999] flex items-center justify-center"
	>
		<div
			class="p-8 md:p-11 bg-[#131314] rounded-[8px] w-[1095px] max-w-[95%] md:max-w-full relative"
		>
			<div class="max-w-[595px]">
				<div>
					<h2 class="text-3xl md:text-[40px] md:leading-[38.8px] font-powerGroteskBold font-bold">
						{bannerText} requires an account.
					</h2>

					<p class="mt-[13px] text-neutral-20 font-medium">
						Sign in to listen to articles, download as PDFs, and save research for later.
						<br />It’s free—just create an account to explore the future of Ethereum without limits.
					</p>
				</div>

				<div class="mt-[30px] flex items-center flex-wrap gap-[10.564px]">
					<a href={`/signup?callback_url=/${$slug}`}>
						<button
							class="h-[35px] border-[1.174px] border-neutral-80 rounded-[9.39px] text-[16.432px] text-neutral-10 px-3 py-2.5 font-mono flex items-center justify-center hover:bg-neutral-80 transition"
						>
							Create an Account
						</button>
					</a>

					<a href={`/signin?callback_url=/${$slug}`}>
						<button
							class="h-[35px] border-[1.174px] border-neutral-80 rounded-[9.39px] text-[16.432px] text-neutral-10 px-3 py-2.5 font-mono flex items-center justify-center hover:bg-neutral-80 transition"
						>
							Sign In
						</button>
					</a>
				</div>
			</div>

			<button
				class="absolute top-3 right-3 md:top-11 md:right-11 group"
				onclick={() => {
					bannerText = '';
					showAuthBanner = false;
				}}
			>
				<X class="size-6 md:size-8 text-white group-hover:text-neutral-40 transition" />
			</button>
		</div>
	</div>
{/if}

{#if !isLoggedIn && !isCheckingAuth && !loadingBookmarks}
	<button
		class="fixed bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-[#19191A] h-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[43.17px] text-[12.667px] text-[#B4B4B4] group hover:bg-white hover:text-black hover:shadow-hover transition font-ibm"
		onclick={() => (showAuthBanner = true)}
	>
		<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M7.19997 1.93549C6.08933 1.2587 4.66602 2.05812 4.66602 3.35873V16.6414C4.66602 17.942 6.08933 18.7414 7.19997 18.0646L18.0985 11.4233C19.1644 10.7738 19.1644 9.22631 18.0985 8.57681L7.19997 1.93549Z"
				class="fill-[#666666] group-hover:fill-neutral-80 transition"
			/>
		</svg>

		Sign in to Listen</button
	>
{/if}

<!-- Share Modal -->
{#if showShareModal}
	<div
		class="fixed w-dvw h-dvh bg-black/50 top-0 left-0 z-[9999999] flex items-center justify-center md:hidden"
	>
		<div class="container flex items-center justify-center">
			<div class="p-6 md:p-8 bg-[#131314] rounded-[8px] max-w-full w-[500px] relative space-y-6">
				<h5 class="font-powerGroteskBold text-2xl">Share article</h5>

				<div class="flex gap-4 items-start flex-wrap">
					<div class="size-14 md:size-20 flex-shrink-0 overflow-hidden">
						<img
							src={data.article.thumb_url}
							alt={data.article.title}
							class="w-full h-full object-cover pointer-events-none select-none object-top"
						/>
					</div>

					<div class="space-y-2">
						<h6 class="font-medium">{data.article.title}</h6>

						<p class="text-xs text-neutral-20">{data.article.summary}</p>

						{#if data.article.authors}
							<div class="font-mono text-xs">
								<span class="text-neutral-40">By</span>
								{#each data.article.authors as author, index}
									<a
										class="underline underline-offset-[3px] hover:text-neutral-20 transition"
										href={author.username ? `/contributors/${author.username}` : null}
										data-sveltekit-preload-data
									>
										{(author.full_name || author.username || '').trim()}
									</a>
									{#if index < data.article.authors.length - 2}
										<span>,</span>
									{:else if index < data.article.authors.length - 1}
										<span>{' '}and{' '}</span>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div
					class="py-4 border-y border-neutral-80 flex items-center justify-between gap-4 flex-wrap [&_svg]:!size-5 md:[&_svg]:!size-7"
				>
					{#each shareOptions as option}
						<a
							href={option.url}
							target="_blank"
							rel="noopener noreferrer"
							role="menuitem"
							data-sveltekit-preload-data
							class="hover:text-neutral-40 transition"
						>
							{#if option.isSvg}
								{@html option.icon}
							{:else}
								{@const IconComponent = option.icon}
								<IconComponent />
							{/if}
						</a>
					{/each}
				</div>

				<ul class="text-neutral-20 !font-mono space-y-4 max-md:text-sm">
					<li>
						<button
							onclick={copyShareLink}
							role="menuitem"
							class={cn(
								'w-full text-left flex items-center gap-2 transition',
								!copySuccess && 'hover:text-neutral-40',
								copySuccess && 'pointer-events-none'
							)}
						>
							{#if copySuccess}
								<span class="text-special-blue">Link copied</span>
							{:else}
								<span>Copy link</span>
							{/if}
						</button>
					</li>

					<li>
						<button
							class="hover:text-neutral-40 transition"
							onclick={() => handlePdfDownload(data.article)}
							>{isDownloading ? 'Downloading...' : 'Download PDF'}</button
						>
					</li>
				</ul>

				<button
					class="absolute -top-2 md:top-0 right-4 md:right-8 group"
					onclick={() => {
						showShareModal = false;
					}}
				>
					<X class="size-6 md:size-8 text-white group-hover:text-neutral-40 transition" />
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Fixed bottom bar for mobile -->
<div
	class={cn(
		'hidden max-md:grid grid-cols-4 gap-1 fixed bottom-0 w-full z-[9999999] bg-[#010102] border-t border-[#202020] py-4 text-neutral-40',
		loadingBookmarks && 'max-md:hidden'
	)}
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
		onclick={() => {
			if (isLoggedIn) {
				toggleSummary();
			} else {
				showAuthBanner = true;
				bannerText = 'Reading article summaries';
			}
		}}
		disabled={!data?.article?.gpt_summary}
	>
		<BrainCog class="size-5" />
		<span class="text-xs font-medium font-ibm">AI Summary</span>
	</button>

	<button
		class="min-h-10 flex flex-col items-center justify-center gap-2"
		onclick={() => (showShareModal = true)}
	>
		<Share2 class="size-5" />
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

<!-- Share Mobile -->
<div
	class={cn(
		'h-screen w-screen fixed bg-black top-0 left-0 z-[99999999] -translate-x-full transition will-change-transform flex flex-col',
		openShareMobile && 'translate-x-0'
	)}
>
	<div class="flex items-center justify-between flex-shrink-0 p-4">
		<h2 class="text-2xl font-medium font-powerGroteskBold">Share</h2>

		<button
			class="size-10 flex items-center justify-center"
			onclick={() => (openShareMobile = false)}
		>
			<X />
		</button>
	</div>

	<div class="flex-1 px-4 pb-8 overflow-y-auto space-y-3">
		{#each shareOptions as option}
			<a
				href={option.url}
				target="_blank"
				rel="noopener noreferrer"
				role="menuitem"
				class="hover:bg-white hover:text-black flex items-center gap-2 h-10"
				data-sveltekit-preload-data
			>
				{#if option.isSvg}
					{@html option.icon}
				{:else}
					{@const IconComponent = option.icon}
					<IconComponent class="size-5" />
				{/if}
				<span class="text-sm">{option.name}</span>
			</a>
		{/each}

		<button
			onclick={copyShareLink}
			role="menuitem"
			class="w-full hover:bg-white hover:text-black text-left flex items-center gap-2 h-10"
		>
			<Link2 class="size-5" />
			{#if copySuccess}
				<span class="text-special-blue text-sm">Link copied</span>
			{:else}
				<span class="text-sm">Copy link</span>
			{/if}
		</button>
	</div>
</div>

<!-- Back to top button -->
{#if showFloatingButtons && !loadingBookmarks}
	<button
		class="flex items-center justify-center gap-1 md:px-4 md:py-2 text-2xl transition group text-[12.667px] size-9 bg-[#19191A] rounded-[43px] text-[#B4B4B4] group fixed top-40 right-3 md:right-14 font-semibold border border-[#333] z-[9999] hover:bg-white hover:text-black hover:border-white hover:shadow-hover md:hidden"
		aria-label="Scroll back to the top of the page"
		onclick={handleScrollToTop}
	>
		<ArrowUp
			class="size-4 rounded-full group-hover:-translate-y-[2px] will-change-transform transition group-hover:text-black flex-shrink-0"
			style="stroke-width: 1.4"
		/>
	</button>
{/if}

<div class="md:flex gap-8 container">
	<div class="flex flex-col gap-y-6 md:gap-y-14 flex-1">
		{#if !isReadingMode}
			{@render header(data.article)}
		{/if}

		{@render body(data.article)}

		<div class={isReadingMode ? 'hidden' : 'mb-12'}>
			<RelatedArticles categories={data.article.categories} currentArticleId={data.article.id} />
		</div>
	</div>

	<!-- Desktop vertical toolbar -->
	<!-- <div class="w-12 flex-shrink-0 relative max-md:hidden">
		<div
			class="w-full p-2 sticky top-28 border text-neutral-20 bg-[#19191A] border-[#333] rounded-[16px] flex flex-col items-center space-y-4"
		>
			<Tooltip.Root openDelay={5}>
				<Tooltip.Trigger class="w-full aspect-square"
					><button
						class="w-full aspect-square flex items-center justify-center gap-2 hover:text-neutral-40 transition disabled:opacity-50"
						aria-label="Show AI Summary"
						data-summary-toggle
						disabled={!data?.article?.gpt_summary}
						onclick={() => {
							if (data?.article?.gpt_summary) {
								if (isLoggedIn) {
									toggleSummary();
								} else {
									showAuthBanner = true;
									bannerText = 'Reading article summaries';
								}
							}
						}}
					>
						<BrainCog class="size-5" />
					</button></Tooltip.Trigger
				>
				<Tooltip.Content
					class="bg-[#19191A] border-[#333] font-mono text-xs"
					side="left"
					sideOffset={10}
				>
					<p>AI Summary</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<div
				class="relative"
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
				role="menu"
				tabindex="0"
			>
				<button
					onkeydown={(e) => e.key === 'Escape' && (showShareDropdown = false)}
					class="w-full aspect-square flex items-center justify-center gap-2 hover:text-neutral-40 transition"
					aria-label="Share article"
					aria-expanded={showShareDropdown}
					aria-haspopup="true"
					data-share-toggle
				>
					<Share class="size-5" />
				</button>

				{#if showShareDropdown}
					<div
						class="share-dropdown absolute {dropdownPosition === 'bottom'
							? 'mt-2 top-full'
							: 'bottom-full mb-2'} 
						left-0 w-40 bg-backgroundLighter shadow-lg z-50 transition-opacity duration-200 sm:left-auto sm:right-0 font-mono"
					>
						{#each shareOptions as option}
							<a
								href={option.url}
								target="_blank"
								rel="noopener noreferrer"
								role="menuitem"
								class="px-4 py-2 hover:bg-white hover:text-black flex items-center gap-2"
								data-sveltekit-preload-data
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
							class="w-full px-4 py-2 hover:bg-white hover:text-black text-left flex items-center gap-2"
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

			<Tooltip.Root openDelay={5}>
				<Tooltip.Trigger class="w-full aspect-square"
					><button
						onclick={() => {
							if (isLoggedIn) {
								handlePdfDownload(data.article);
							} else {
								showAuthBanner = true;
								bannerText = 'Downloading articles';
							}
						}}
						class="disabled:cursor-wait w-full aspect-square flex items-center justify-center gap-2 hover:text-neutral-40 transition"
						aria-label="Download as PDF"
						disabled={isDownloading}
					>
						{#if isDownloading}
							<div
								class="size-5 border-2 border-current border-t-transparent rounded-full animate-spin"
								aria-busy="true"
							></div>
						{:else}
							<FileDown class="size-5" />
						{/if}
					</button></Tooltip.Trigger
				>
				<Tooltip.Content
					class="bg-[#19191A] border-[#333] font-mono text-xs"
					side="left"
					sideOffset={10}
				>
					<p>Download PDF</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root openDelay={5}>
				<Tooltip.Trigger class="w-full aspect-square"
					><button
						class="w-full aspect-square flex flex-col items-center justify-center gap-2"
						onclick={handleToogleAddToBookmarks}
					>
						<Bookmark
							class={cn('size-5 transition', isBookmarked && 'text-[#0CDEE9] fill-[#0CDEE9]')}
						/>
					</button></Tooltip.Trigger
				>
				<Tooltip.Content
					class="bg-[#19191A] border-[#333] font-mono text-xs"
					side="left"
					sideOffset={10}
				>
					<p>{isBookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</div> -->
</div>

<!-- Top bar when scrolled: Desktop -->
<div
	class={cn(
		'fixed z-[9999] bg-background w-full py-4 top-0 left-0 hidden -translate-y-full will-change-transform transition duration-500',
		showTopbar && !loadingBookmarks && 'translate-y-0'
	)}
>
	<div class="container flex items-center justify-between">
		<div class="flex items-center gap-6">
			<a href="/" class="ml-1"><Research /></a>

			<h4 class="font-powerGroteskBold font-bold">{data.article.title}</h4>
		</div>

		{@render topBar('', !showTopbar)}
	</div>
</div>

{#snippet topBar(className?: string, hideShare = false)}
	<div
		class={cn(
			'text-[13px] text-neutral-40 md:divide-x-[1px] divide-[#262626] border-[#262626] flex flex-wrap items-center max-md:justify-between',
			className
		)}
	>
		{#if isLoggedIn}
			<Popover.Root>
				<Popover.Trigger>
					<span
						class="flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition"
					>
						<span>Listen</span>
						<Headphones class="size-4" />
					</span>
				</Popover.Trigger>
				<Popover.Content
					sideOffset={8}
					side="bottom"
					align="start"
					class="rounded-[4px] border-[#262626] p-3 bg-background text-sm"
					>Audio player here</Popover.Content
				>
			</Popover.Root>
		{:else}
			<button
				class="flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition"
				onclick={() => {
					bannerText = 'Listening to articles';
					showAuthBanner = true;
				}}
			>
				<span>Listen</span>
				<Headphones class="size-4" />
			</button>
		{/if}

		<button
			class={cn(
				'flex max-md:flex-col-reverse items-center gap-2 md:px-4 transition',
				isBookmarked && 'text-[#0CDEE9] fill-[#0CDEE9]',
				!isBookmarked && 'hover:text-neutral-20'
			)}
			onclick={handleToogleAddToBookmarks}
		>
			<span>{isBookmarked ? 'Saved' : 'Save'}</span>
			<Bookmark class={cn('size-4 transition', isBookmarked && 'fill-[#0CDEE9]')} />
		</button>

		<div
			class="relative"
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			role="menu"
			tabindex="0"
		>
			<button
				onkeydown={(e) => e.key === 'Escape' && (showShareDropdown = false)}
				class="flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition"
				aria-label="Share article"
				aria-expanded={showShareDropdown}
				aria-haspopup="true"
				data-share-toggle
			>
				<span>Share</span>
				<Share2 class="size-4" />
			</button>

			{#if showShareDropdown}
				<div
					class="share-dropdown absolute {dropdownPosition === 'bottom'
						? 'mt-2 top-full'
						: 'bottom-full mb-2'} 
						left-0 w-40 bg-backgroundLighter shadow-lg z-50 transition-opacity duration-200 sm:left-auto sm:right-0 font-mono"
				>
					{#each shareOptions as option}
						<a
							href={option.url}
							target="_blank"
							rel="noopener noreferrer"
							role="menuitem"
							class="px-4 py-2 hover:bg-white hover:text-black flex items-center gap-2"
							data-sveltekit-preload-data
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
						class="w-full px-4 py-2 hover:bg-white hover:text-black text-left flex items-center gap-2 !font-mono"
					>
						<Link2 class="w-5 h-5" />
						{#if copySuccess}
							<span class="text-special-blue text-sm">Link copied</span>
						{:else}
							<span class="text-sm">Copy link</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>

		<button
			class="flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition"
			onclick={() => {
				if (isLoggedIn) {
					handlePdfDownload(data.article, true);
				} else {
					showAuthBanner = true;
					bannerText = 'Downloading articles';
				}
			}}
		>
			<span>Print</span>
			<Printer class="size-4" />
		</button>

		<button
			class="flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition disabled:opacity-50"
			disabled={!data?.article?.gpt_summary}
			onclick={() => {
				if (data?.article?.gpt_summary) {
					if (isLoggedIn) {
						toggleSummary();
					} else {
						showAuthBanner = true;
						bannerText = 'Reading article summaries';
					}
				}
			}}
		>
			<span>AI Summary</span>
			<BrainCog class="size-4" />
		</button>
	</div>
{/snippet}

{#snippet header(article: Article)}
	<div class="relative pt-32">
		<div class="relative">
			<header class="flex justify-between flex-col">
				<button
					aria-label="Back to Home"
					class="flex gap-2 justify-center items-center px-2 size-[42px] rounded-full mb-[38.5px] bg-[#19191A] group"
					data-sveltekit-preload-data
					onclick={() => history.back()}
				>
					<ArrowLeft class="size-6 group-hover:-translate-x-px transition will-change-transform" />
				</button>

				<div class="flex flex-col max-w-full w-[794px]">
					<section class="flex flex-col w-full">
						<div class="flex items-center flex-wrap gap-2 font-mono">
							{#each article.categories as category}
								<a href={'/category/' + category.name.toLowerCase()} data-sveltekit-preload-data
									><Badge
										class="h-[30px] py-2 px-2.5 uppercase text-sm bg-transparent text-neutral-10 border !border-neutral-80 hover:!bg-white hover:border-white hover:!text-black"
									>
										{category.name}
									</Badge></a
								>
							{/each}
						</div>

						<h1
							class="font-powerGroteskBold text-5xl font-bold leading-[50px] max-md:max-w-full max-md:text-4xl max-md:leading-[40px] break-words mt-[22px]"
						>
							{article.title}
						</h1>

						<p class="text-base max-md:max-w-full mt-4 text-neutral-40">
							{article.summary}
						</p>

						{#if article.authors}
							<div class="font-mono mt-4">
								<span class="text-neutral-40">By</span>
								{#each article.authors as author, index}
									<a
										class="underline underline-offset-[3px] hover:text-neutral-20 transition"
										href={author.username ? `/contributors/${author.username}` : null}
										data-sveltekit-preload-data
									>
										{(author.full_name || author.username || '').trim()}
									</a>
									{#if index < article.authors.length - 2}
										<span>,</span>
									{:else if index < article.authors.length - 1}
										<span>{' '}and{' '}</span>
									{/if}
								{/each}
							</div>
						{/if}
					</section>
				</div>

				<div class="flex max-md:flex-col max-md:gap-y-4 md:items-center justify-between mt-5">
					<div class="flex items-center gap-2 text-neutral-40 font-mono text-sm">
						<time datetime={article.created_at}>
							{new Date(article.created_at).toLocaleDateString('en-GB', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</time>
						<span class="inline">|</span>
						<span>{readingTime}</span>
					</div>
				</div>

				{@render topBar('mt-5 py-5 border-y', showTopbar)}
			</header>
		</div>

		<div class="mt-8 rounded-[8px] overflow-hidden relative">
			<img
				src={article.thumb_url}
				alt={article.title}
				class="w-full h-full object-cover pointer-events-none select-none"
			/>

			{#if isLoggedIn && !isCheckingAuth && !loadingBookmarks}
				<iframe
					id="AudioNativeElevenLabsPlayer"
					title="AudioNative ElevenLabs Player"
					width="377"
					height="98"
					frameborder="no"
					scrolling="no"
					src="https://elevenlabs.io/player/index.html?publicUserId=8ad299f5577a1c569543dae730993de0382c7c4aefa1eb8fc88e8516d4affa89"
					style="max-height: 90px;"
					class="fixed left-1/2 -translate-x-1/2 bottom-32 md:bottom-8 z-[99999]"
				></iframe>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet body(article: Article)}
	<article
		class={cn('lg:flex lg:gap-14 relative', isReadingMode && 'reading-mode mt-32')}
		class:overflow-hidden={summaryOpen}
	>
		<!-- Hide TOC in reading mode -->
		{#if !isReadingMode}
			<TableOfContents tableOfContents={article.table_of_contents} />
			<div id="toc" class="block lg:hidden w-full mx-0"></div>
		{/if}

		<!-- Update the back button in reading mode -->
		{#if isReadingMode}
			<a
				href="/"
				class="absolute left-8 top-0 size-[42px] hover:bg-secondary rounded-full transition-colors flex items-center justify-center bg-[#19191A] group"
				aria-label="Back to home"
				data-sveltekit-preload-data
			>
				<ArrowLeft class="group-hover:-translate-x-px transition will-change-transform" />
			</a>
		{/if}

		<div
			id="content-container"
			class="lg:px-0 pb-20 text-primary w-full lg:max-w-[632px] mx-auto font-hubot leading-8 flex flex-col
			{isReadingMode ? 'reading-content' : ''}
			[&>h1]:scroll-mt-32 [&>h2]:scroll-mt-32 [&>h3]:scroll-mt-32 [&>h4]:scroll-mt-32
			[&>h1]:text-[40px] [&>h1]:font-bold [&>h1]:font-powerGroteskBold [&>h1]:mb-6 [&>h1]:mt-16 [&_h1]:leading-10
			[&>h2]:text-3xl max-md:[&>h2]:!leading-[34px] [&>h2]:font-powerGroteskBold [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&_h2]:leading-10
			[&>h3]:text-2xl max-md:[&>h3]:!leading-[30px] [&>h3]:font-powerGroteskBold [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-4 [&_h3]:leading-10
			[&>h4]:text-xl [&>h4]:font-powerGroteskBold [&>h4]:font-bold [&>h4]:mb-3
			[&>p]:text-base [&>p]:break-words [&>p]:text-neutral-5 [&_p]:leading-7 [&_p]:tracking-normal [&_p]:mb-4
			[&_p:has(img)]:mt-6 [&_p:has(img)]:mb-12 [&_p:has(img)]:text-xs [&_p:has(img)]:text-gray-400 [&_p:has(img)]:text-center
			[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/60 [&_a]:transition-colors [&_a]:decoration-[#0CDEE9]
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
			{#if isReadingMode}
				<div class="mb-16 font-eb-garamond border-b border-gray-800 pb-8">
					<h1 class="text-[40px] mb-6 font-powerGroteskBold !leading-10 font-bold">
						{article.title}
					</h1>

					<p class="text-base mb-8 text-neutral-5 font-hubot">
						{article.summary}
					</p>
					<div class="flex flex-col gap-3 text-base text-neutral-40 font-mono">
						{#if article.authors}
							<div class="">
								By
								{#each article.authors as author, index}
									{' '}
									<a
										href={author.twitter_username
											? `https://twitter.com/${author.twitter_username}`
											: null}
										target="_blank"
										rel="noopener noreferrer"
										class={author.twitter_username ? 'reading-mode-link' : ''}
									>
										{author.full_name}
									</a>
									{#if index < article.authors.length - 2}
										<span>,</span>
									{:else if index < article.authors.length - 1}
										<span>and</span>
									{/if}
								{/each}
							</div>
						{/if}
						<div class="flex items-center gap-2">
							<time datetime={article.created_at}>
								{new Date(article.created_at).toLocaleDateString('en-GB', {
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

			{@html sanitizeContent(article.content)}
		</div>

		{#if !isReadingMode}
			<div class="max-lg:hidden">
				<div class="font-mono sticky top-24 space-y-5 text-sm flex-1 pr-10 hidden">
					<div class="flex items-center gap-4 justify-end">
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
								<Share class="size-5" />
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
											class="px-4 py-2 hover:bg-white hover:text-black flex items-center gap-2"
											data-sveltekit-preload-data
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
										class="w-full px-4 py-2 hover:bg-white hover:text-black text-left flex items-center gap-2"
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

						{#if isLoggedIn && !isCheckingAuth && !loadingBookmarks}
							<button
								onclick={() => handlePdfDownload(article)}
								class="flex items-center gap-1 hover:text-primary/50 cursor-pointer disabled:cursor-wait disabled:opacity-50"
								aria-label="Download as PDF"
								disabled={isDownloading}
							>
								{#if isDownloading}
									<div
										class="size-5 border-2 border-current border-t-transparent rounded-full animate-spin"
										aria-busy="true"
									></div>
								{:else}
									<FileDown class="size-5" />
								{/if}
								<span class="border-b">PDF</span>
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- {#if isLoggedIn && !isCheckingAuth && !loadingBookmarks}
			{@render floatingButtons()}
		{/if} -->
	</article>
{/snippet}

{#snippet floatingButtons()}
	{#if showFloatingButtons || isReadingMode}
		<div
			class="max-md:hidden fixed bottom-24 right-3 md:right-10 flex gap-3 transition-all duration-300 z-[9999]"
			in:fly={{ y: 20, duration: 300, opacity: 0 }}
			out:fly={{ y: 20, duration: 300, opacity: 0 }}
		>
			<!-- {#if !isReadingMode && data?.article?.gpt_summary}
				<button
					onclick={toggleSummary}
					class="bg-white text-primary-foreground size-11 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
					aria-label="Show AI Summary"
					data-summary-toggle
				>
					<svelte:component this={BrainCog} class="size-5" />
				</button>
			{/if} -->

			<!-- <button
				onclick={toggleReadingMode}
				class="bg-white text-primary-foreground size-11 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
				aria-label="Toggle reading mode"
			>
				<svelte:component this={ScrollText} class="size-5" />
			</button> -->
		</div>
	{/if}
{/snippet}

{#snippet summaryPanel()}
	{#if data?.article?.gpt_summary}
		<div
			class="fixed inset-y-0 right-0 pointer-events-none flex items-center z-[999999999]"
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
					class="z-10 bg-background border-b border-[#202020] px-4 md:px-8 py-4 flex justify-between items-center flex-shrink-0"
				>
					<h2 class="text-2xl font-medium font-powerGroteskBold">Summary</h2>
					<button
						onclick={toggleSummary}
						class="p-2 hover:bg-secondary rounded-full"
						aria-label="Close summary"
					>
						<XIcon class="w-6 h-6" />
					</button>
				</div>

				<div
					class="flex-1 overflow-y-auto px-4 md:px-12 py-4 md:py-6 text-primary w-full leading-8
					[&>h1]:text-5xl [&>h1]:font-medium [&>h1]:mb-6 [&>h1]:mt-16 [&_h1]:leading-58
					[&>h2]:text-3xl [&>h2]:font-medium [&>h2]:mt-8 [&>h2]:mb-4 [&_h2]:leading-9
					[&>h3]:text-2xl [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-4 [&_h3]:leading-7
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

{#if isLoggedIn && !isCheckingAuth && !loadingBookmarks}
	<!-- Add this right after the main content div -->
	{@render summaryPanel()}
{/if}

<style>
	/* Add Garamond font */
	@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');

	/* Update reading mode styles */
	:global(.reading-mode) {
		@apply max-w-[68ch] mx-auto relative px-8 pt-16;
	}

	:global(.reading-content) {
		@apply text-primary w-full leading-8
			[&>h1]:text-5xl [&>h1]:font-medium [&>h1]:mb-6 [&>h1]:mt-16 [&_h1]:leading-58
			[&>h2]:text-3xl [&>h2]:font-medium [&>h2]:mt-8 [&>h2]:mb-4 [&_h2]:leading-9
			[&>h3]:text-2xl [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-4 [&_h3]:leading-7
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
