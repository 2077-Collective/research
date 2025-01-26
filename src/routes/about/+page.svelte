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
				2077 Research is dedicated to helping people navigate the frontier of Ethereum's research
				and development (R&D). We explore cutting-edge topics across scaling, interoperability,
				Ethereum standards, DeFi, staking, MEV, UX, privacy, and more. By simplifying complex ideas
				and providing actionable insights, we empower our audience to make informed decisions in the
				evolving Ethereum ecosystem.
			</p>
			<p class="text-base text-white/50">
				Are you looking to work with us? <a
					href="mailto://research@2077.xyz"
					class="text-blue-500 hover:underline">Get in touch</a
				>
				or check out our
				<a href="/work-with-us" class="text-blue-500 hover:underline">service page</a> for more info
				on our approach to working with partner projects.
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
				twitter_username="losndu"
				full_name="Chijindu Julian"
				role="Engineering Lead"
				summary="Software Engineer | Technical Writer"
			/>
			<TeamCard
				twitter_username="lynettdoteth"
				full_name="lynett.eth"
				role="Developer"
				summary="Crypto-anarchist developer and Ethereum maxi. In her free time, she buys more ETH."
			/>
			<TeamCard
				twitter_username="lilfatfrank"
				full_name="Karan"
				role="Developer"
				summary="frontend specialist, backend aware. part-time degen."
			/>
			<TeamCard
				twitter_username="korayakpinarr"
				full_name="Koray Akpınar"
				role="Research Lead"
				summary="'Arise, you have nothing to lose but your barbed wire fences!'"
			/>
			<TeamCard
				twitter_username="alexhooketh"
				full_name="Alex Hook"
				role="Researcher"
				summary="Founder @ Untron. Change the world. Start with the money."
			/>
			<TeamCard
				twitter_username="0x_zhev"
				full_name="Zhev"
				role="Researcher"
				summary="pursuing perpetually orthogonal interests. resident lemur @ west ham gc"
			/>
		</div>
	</section>
	<section>
		<h2
			id="contributors"
			class="text-2xl md:text-4xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			Contributors
		</h2>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<ContributorCard full_name="Fikunmi" twitter_username="fikunmi_ap" />
			<ContributorCard full_name="sm-stack" twitter_username="stackdigest" />
			<ContributorCard full_name="Seongwan Park" twitter_username="seongwan_eth" />
			<ContributorCard full_name="Sankritsan" twitter_username="sankritsan" />
			<ContributorCard full_name="Arbnom" twitter_username="arbnom" />
			<ContributorCard full_name="BTC Penguin" twitter_username="btc_penguin" />
			<ContributorCard full_name="Pavel Paramonov" twitter_username="paramonoww" />
			<ContributorCard full_name="Yayya" twitter_username="yayya_ahd" />
			<ContributorCard full_name="Yiğit Yektin" twitter_username="yigityektin" />
			<ContributorCard full_name="Nikhil" />
			<ContributorCard full_name="Annie" />
		</div>
	</section>
</div>
