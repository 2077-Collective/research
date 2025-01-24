<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import ContributorCard from '$lib/components/ui/ContributorCard.svelte';
	import TeamCard from '$lib/components/ui/TeamCard.svelte';

	import type { PageData } from './$types';

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
				by crafting insightful, technically accurate, and accessible content on DeFi and other
				topics.
			</p>
			<p class="text-base text-white/50">
				Are you seeking a report about your project? {' '}
				<a href="/work-with-us" class="text-blue-500 hover:underline">Get in touch.</a>
			</p>
		</div>
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
			<TeamCard
				twitter_username="lilfatfrank"
				full_name="Karan"
				role="Developer"
				summary="frontend specialist, backend aware. part-time degen."
			/>
			<TeamCard
				twitter_username="https://x.com/korayakpinarr"
				full_name="Koray Akpınar"
				role="Research Lead"
				summary="Arise, you have nothing to lose but your barbed wire fences!"
			/>
			<TeamCard
				twitter_username="https://x.com/losndu"
				full_name="ndu"
				role="Engineering Lead"
				summary="Software Engineer | Technical Writer"
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
