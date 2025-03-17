<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import ContributorCard from '$lib/components/ui/ContributorCard.svelte';
	import TeamCard from '$lib/components/ui/TeamCard.svelte';
	import { ArrowRight, ArrowUpRight } from 'lucide-svelte';

	const metrics = [
		{
			number: '120+',
			title: 'Articles Published'
		},
		{
			number: '12K+',
			title: 'Monthly Readers'
		},
		{
			number: '23',
			title: 'Contributors'
		}
	];
</script>

<BaseHead />

<div class="flex flex-col gap-8">
	<section class="bg-[#010102] pt-32 pb-14 md:pb-40 relative">
		<div class="container z-20 relative">
			<h1 class="text-[32px] font-powerGroteskBold !font-bold">About Us</h1>

			<div class="mt-4">
				<p class="font-light text-neutral-10 leading-[20.8px]">
					2077 Research is dedicated to helping people navigate the frontier of Ethereum's research
					and development (R&D). We explore cutting-edge topics across scaling, interoperability,
					Ethereum standards, DeFi, staking, MEV, UX, privacy, and more. By simplifying complex
					ideas and providing actionable insights, we empower our audience to make informed
					decisions in the evolving Ethereum ecosystem.
				</p>

				<div class="flex items-center flex-wrap gap-2 mt-7">
					{#each metrics as metric}
						<div
							class="h-[37px] bg-[#19191A] px-3.5 py-2.5 flex items-center justify-center gap-2 rounded-[4px] text-sm font-mono text-neutral-40"
						>
							<span class="text-white font-bold">{metric.number}</span>
							<span class="capitalize">{metric.title}</span>
						</div>
					{/each}
				</div>

				<div
					class="rounded-[100px] bg-[#0F0F10] pl-[50px] py-[18px] pr-5 mt-[56px] h-[102px] flex items-center relative group overflow-hidden max-md:hidden"
				>
					<p
						class="text-2xl font-powerGroteskBold text-neutral-20 group-hover:opacity-0 transition duration-300"
					>
						Looking to work with us?
					</p>

					<div
						class="size-[66px] bg-white rounded-full flex items-center justify-center text-black absolute right-5 group-hover:right-[92%] z-50"
					>
						<ArrowRight class="group-hover:rotate-180 transition duration-300" />
					</div>

					<div
						class="absolute inset-0 white items-center pl-[131px] py-[18px] pr-5 grid grid-cols-2 gap-5 group-hover:opacity-100 opacity-0 transition duration-300 translate-y-full group-hover:translate-y-0"
					>
						<a
							class="bg-[#252526] h-full rounded-[50px] text-[#979797] text-xl font-powerGroteskBold !font-normal hover:bg-white hover:text-black transition duration-300"
							href="mailto:research@2077.xyz"
						>
							<button class="size-full">Contact us</button>
						</a>

						<div
							class="bg-[#252526] h-full rounded-[50px] text-[#979797] text-xl font-powerGroteskBold !font-normal hover:bg-white hover:text-black transition duration-300"
						>
							<a href="/work-with-us" class="size-full flex items-center justify-center"
								>View our Services Page</a
							>
						</div>
					</div>
				</div>

				<div class="md:hidden mt-8">
					<p class="text-neutral-40 text-sm font-mono">Looking to work with us?</p>

					<div class="mt-[15px] border-y border-[#222] divide-y divide-[#222]">
						<a
							href="mailto:research@2077.xyz"
							class="flex items-center gap-2 py-3 w-full text-neutral-20 text-sm font-light font-ibm"
						>
							Get in Touch
							<ArrowUpRight class="size-4" />
						</a>

						<a
							href="/work-with-us"
							class="flex items-center gap-2 py-3 w-full text-neutral-20 text-sm font-light font-ibm"
						>
							View our Services Page
							<ArrowUpRight class="size-4" />
						</a>
					</div>
				</div>
			</div>
		</div>

		<enhanced:img
			class="w-[1144.5px] absolute bottom-0 right-0 pointer-events-none max-md:hidden"
			src="/static/about-us-hero.png"
			alt="Half sun"
			loading="lazy"
			decoding="async"
		/>
	</section>

	<section class="bg-[#0C0C0D] pb-20">
		<div class="container">
			<h2
				id="team"
				class="text-2xl md:text-[32px] leading-9 mb-4 md:mb-7 font-powerGroteskBold font-bold"
			>
				Core Team
			</h2>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-6">
				<TeamCard
					twitter_username="eawosikaa"
					full_name="Emmanuel Awosika"
					role="CEO"
					summary="Chaos agent. Learning machine. Crazy genius. Ethernaut making Ethereum cool again."
				/>
				<TeamCard
					twitter_username="korayakpinarr"
					full_name="Koray Akpınar"
					role="Research Lead"
					summary="'Arise, you have nothing to lose but your barbed wire fences!'"
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
		</div>
	</section>

	<section class="relative overflow-hidden py-16 bg-[#020203] hidden">
		<div class="relative z-20 container">
			<h2
				id="contributors"
				class="text-2xl md:text-4xl font-medium leading-9 mb-4 md:mb-8 font-powerGroteskBold"
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
		</div>

		<enhanced:img
			class="w-[1198.5px] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none select-none"
			src="/static/contributors-bg.png"
			alt="contributors bg"
			loading="lazy"
			decoding="async"
		/>
	</section>
</div>
