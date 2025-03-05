<script lang="ts">
	const { variant = 'home' }: { variant?: 'home' | 'article' } = $props();
	const variantStyles = {
		article: 'px-20 py-4 mt-6 -mb-8',
		home: 'px-40 py-32'
	};
</script>

<section class="bg-[#0C0C0D] overflow-hidden">
	<div id="subscribe" class="">
		<div class="w-full">
			{@render beehiivEmbed()}
		</div>
	</div>
</section>

{#snippet beehiivEmbed()}
	<iframe
		title="Ethereum Navigator Newsletter Signup"
		src="https://embeds.beehiiv.com/3fa93279-4c5c-46a8-9a05-53492983f1a4"
		data-test-id="beehiiv-embed"
		width="100%"
		frameborder="0"
		scrolling="no"
		sandbox="allow-scripts allow-same-origin allow-forms"
		loading="lazy"
		aria-label="Newsletter signup form"
		class="md:min-w-[700px] w-full min-h-[320px]"
	></iframe>
{/snippet}
