<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import ContributorCard from '$lib/components/ui/ContributorCard.svelte';
	import TeamCard from '$lib/components/ui/TeamCard.svelte';

	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Accordion from '$lib/components/ui/accordion/accordion.svelte';

	const { data }: { data: PageData } = $props();
	const authors = $derived(data.authors);
</script>

<BaseHead />

<div class="px-3 md:px-12 flex flex-col gap-8">
	<section>
		<h1
			id="about-us"
			class="text-3xl md:text-5xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			About us
		</h1>
		<div class="md:text-lg leading-relaxed max-w-screen-lg space-y-4 text-pretty">
			<p>
				2077 Research is a research group dedicated to producing in-depth analysis and insights on
				decentralized tech and cryptocurrency. We help people understand and make sense of Ethereum
				by crafting insightful, technically accurate, and accessible content on topics related to
				Ethereum protocol development.
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
					title: 'Accordion Item 1',
					content:
						"The way your dad looked at it, this watch was your birthright. He'd be damned if any slopes gonna put their greasy yellow hands on his boy's birthright, so he hid it, in the one place he knew he could hide something: his ass. Five long years, he wore this watch up his ass. Then when he died of dysentery, he gave me the watch. I hid this uncomfortable piece of metal up my ass for two years. Then, after seven years, I was sent home to my family. And now, little man, I give the watch to you."
				},
				{
					title: 'Accordion Item 2',
					content: 'English, motherfucker, do you speak it?'
				},
				{
					title: 'Accordion Item 3',
					content:
						"That's a pretty fucking good milkshake. I dont know if it's worth five dollars, but it's pretty fucking good."
				}
			]}
		/>
	</section>
	<section>
		<h2
			id="team"
			class="text-2xl md:text-4xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			Core
		</h2>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<TeamCard
				twitter_username="eawosikaa"
				full_name="Emmanuel Awosika"
				role="CEO"
				summary="Chaos agent. Learning machine. Crazy genius. Ethernaut making Ethereum cool again."
			/>
			<TeamCard
				twitter_username="lynettdoteth"
				full_name="Lynett Simons"
				role="Developer"
				summary="i chase pigeons for fun"
			/>
		</div>
	</section>
	<section>
		<h2
			id="team"
			class="text-2xl md:text-4xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			Contributors
		</h2>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each authors as author}
				<ContributorCard {...author} />
			{/each}
		</div>
	</section>
</div>
