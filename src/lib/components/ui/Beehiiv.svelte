<script lang="ts">
	import { onMount } from 'svelte';
  
	const { variant = 'home' }: { variant?: 'home' | 'article' } = $props();
  
	let isLoading = true;
	let hasError = false;
  
	const handleIframeLoad = () => {
	  isLoading = false;
	};
  
	const handleIframeError = () => {
	  isLoading = false;
	  hasError = true;
	};
  
	onMount(() => {
	  const iframe = document.querySelector('iframe[data-test-id="beehiiv-embed"]');
	  if (iframe) {
		iframe.addEventListener('load', handleIframeLoad);
		iframe.addEventListener('error', handleIframeError);
	  }
  
	  return () => {
		if (iframe) {
		  iframe.removeEventListener('load', handleIframeLoad);
		  iframe.removeEventListener('error', handleIframeError);
		}
	  };
	});
  </script>
  
  {#if variant === 'article'}
	{@render article()}
  {:else}
	{@render home()}
  {/if}
  
  {#snippet article()}
	<div
	  id="subscribe"
	  class="flex gap-6 justify-center items-center px-20 py-4 max-md:px-5 max-md:py-4 bg-gradient-to-b from-gray-100 to-transparent dark:from-secondary dark:to-transparent w-full mt-6 -mb-8"
	>
	  <div
		class="flex flex-col justify-center items-center flex-1 shrink self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full"
	  >
		{@render beehiivEmbed()}
	  </div>
	</div>
  {/snippet}
  
  {#snippet home()}
	<div
	  id="subscribe"
	  class="flex gap-6 justify-center items-center px-40 py-32 max-md:px-5 max-md:py-24 bg-gradient-to-b from-gray-100 to-transparent dark:from-secondary dark:to-transparent w-full"
	>
	  <div
		class="flex flex-col justify-center items-center flex-1 shrink self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full"
	  >
		{@render beehiivEmbed()}
	  </div>
	</div>
  {/snippet}
  
  {#snippet beehiivEmbed()}
	{#if isLoading}
	  <div class="flex justify-center items-center h-80">
		<span class="text-gray-500 dark:text-gray-400">Loading newsletter form...</span>
	  </div>
	{:else if hasError}
	  <div class="flex justify-center items-center h-80">
		<span class="text-red-500 dark:text-red-400">Failed to load newsletter form. Please try again later.</span>
	  </div>
	{:else}
	  <iframe
		title="Ethereum Navigator Newsletter Signup"
		src="https://embeds.beehiiv.com/3fa93279-4c5c-46a8-9a05-53492983f1a4"
		data-test-id="beehiiv-embed"
		width="100%"
		height="320"
		frameborder="0"
		scrolling="no"
		sandbox="allow-scripts allow-same-origin allow-forms"
		loading="lazy"
		aria-label="Newsletter signup form"
	  ></iframe>
	{/if}
  {/snippet}