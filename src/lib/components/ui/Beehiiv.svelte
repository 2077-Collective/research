<script lang="ts">
	const { variant = 'home' }: { variant?: 'home' | 'article' } = $props();
	const variantStyles = {
		article: 'px-20 py-4 mt-6 -mb-8',
		home: 'px-40 py-32'
	};
</script>

<div
	id="subscribe"
	class="flex gap-6 justify-center items-center max-md:px-5 max-md:py-4 bg-gradient-to-b from-gray-100 to-transparent dark:from-secondary dark:to-transparent w-full {variantStyles[variant]}"
>
	<div
		class="flex flex-col justify-center items-center flex-1 shrink self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full"
	>
		{@render beehiivEmbed()}
	</div>
</div>

{#snippet beehiivEmbed()}
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
{/snippet}