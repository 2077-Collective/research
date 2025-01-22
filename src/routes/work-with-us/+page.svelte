<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Accordion from '$lib/components/ui/accordion/accordion.svelte';
	import ContributorCard from '$lib/components/ui/ContributorCard.svelte';
	import TeamCard from '$lib/components/ui/TeamCard.svelte';
</script>

<BaseHead />

<div class="px-3 md:px-12 flex flex-col gap-8">
	<section>
		<h1
			id="about-us"
			class="text-3xl md:text-5xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			Work with us
		</h1>
		<div class="md:text-lg leading-relaxed max-w-screen-lg space-y-4 text-pretty">
			<p>
				2077 Research can work with your DeFi protocol or other crypto project to produce neutral,
				unbiased technical reports that thousands read.
			</p>
		</div>
	</section>
	<section>
		<h2
			id="faq"
			class="text-2xl md:text-4xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			FAQ
		</h2>

		<Accordion
			items={[
				{
					title: 'Who is your research for?',
					content: 'We target technical people.'
				},
				{
					title: 'Meow?',
					content: ''
				},
				{
					title: 'Accordion Item 3',
					content:
						"That's a pretty fucking good milkshake. I dont know if it's worth five dollars, but it's pretty fucking good."
				}
			]}
		/>
	</section>
</div>
