<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { cn } from '$lib/utils/ui-components';
	import { AnimateSharedLayout, Motion } from 'svelte-motion';
	import type { CarouselAPI } from './carousel/context';
	import Icon from './icons/Icon.svelte';

	import Cio from '$lib/components/ui/icons/partners/Cio.svelte';
	import EigenLayer from '$lib/components/ui/icons/partners/EigenLayer.svelte';
	import FastCompany from '$lib/components/ui/icons/partners/FastCompany.svelte';
	import Light from '$lib/components/ui/icons/partners/Light.svelte';
	import MegaEth from '$lib/components/ui/icons/partners/MegaEth.svelte';
	import Pymnts from '$lib/components/ui/icons/partners/Pymnts.svelte';
	import Spire from '$lib/components/ui/icons/partners/Spire.svelte';
	import Starknet from '$lib/components/ui/icons/partners/Starknet.svelte';

	const partners = [FastCompany, Pymnts, Cio, Spire, EigenLayer, Light, Starknet, MegaEth];

	let api: CarouselAPI | undefined;
	let current = 0;
	let count = 0;

	$: if (api) {
		count = api.scrollSnapList()?.length ?? 0;
		current = (api.selectedScrollSnap?.() ?? 0) + 1;

		api.on?.('select', () => {
			current = (api?.selectedScrollSnap?.() ?? 0) + 1;
		});
	}

	interface Testimonial {
		text: string;
		author: string;
		link: string;
		platform: 'x' | 'discord' | 'farcaster';
		avatar: string;
		company?: string;
	}

	const testimonials: Testimonial[] = [
		{
			text: '<p>Very well written explanation of the topic.</p>',
			author: 'Akaki Mamageishvili',
			link: 'https://x.com/kakia1989/status/1830642446885359937?t=hN9TWvlpkNKKUvcfwre0Aw&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/1_1_mxy40i.webp',
			company: 'Offchain Labs'
		},
		{
			text: '<p>Excellent, important thread!</p>',
			author: 'Eli Ben-Sasson',
			link: 'https://x.com/EliBenSasson/status/1842607212193259840?t=bwY9baCX4pR383YbFnQ35Q&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/2_1_yaz2uq.webp',
			company: 'StarkWare'
		},
		{
			text: `
            <p class="mb-2">Shoutout to the chads at 2077.</p>
            <p class="mb-2">One of the best reports that unpacks how Euler is built and how we aim to unlock lending to new highs.</p>
            `,
			author: 'Euler Labs🛢️🇬🇧',
			link: 'https://x.com/eulerfinance/status/1863653055566430695',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/3_v5larm.webp',
			company: 'Euler Finance'
		},
		{
			text: `
            <p class="mb-2">The <a class="text-blue-500 hover:underline" href="https://x.com/2077Collective" target="_blank" rel="noopener noreferrer nofollow">@2077Collective</a> gang were really in-depth about this - it's always great to see third parties write about what you've been working on</p>
            <p class="mb-2">Really solid non-agitprop writeup of our work over at Wildcat :)</p>
            `,
			author: 'laurence',
			link: 'https://x.com/functi0nzer0/status/1843704425568972901?s=46&t=Oa3-io-PodorudtH4BCkGg',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/4_jif4sf.webp',
			company: 'Wildcat Labs'
		},
		{
			text: `
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
            <p class="mb-1">Bonus points because it breaks down ZKPs by using Tornado Cash as a practical example.</p>
            <p>Shoutout to <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a> 🫡</p>
            `,
			author: 'Martin | Blocksense 🏴‍☠️',
			link: 'https://x.com/0bretenov/status/1868033218185695387?t=kYQqYpUR05zd0ZgVFyUFnA&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/4_jif4sf.webp',
			company: 'Blocksense'
		},
		{
			text: `
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
            <p class="mb-1">But where can you go to learn more?</p>
            <p>Luckily, our friends over <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a> have you covered...</p>
            `,
			author: '☉neBalance',
			link: 'https://x.com/OneBalance_io/status/1867306674908016811?t=xIosQaRU9w43b8lQuL0_YA&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/6_rlsvma.webp',
			company: '☉neBalance'
		},
		{
			text: `
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
            <p class="mb-2">Don't sleep on <a class="text-blue-500 hover:underline" href="https://x.com/EspressoSys" target="_blank" rel="noopener noreferrer nofollow">@EspressoSys</a><br/>Don't sleep on <a class="text-blue-500 hover:underline" href="https://x.com/arbitrum" target="_blank" rel="noopener noreferrer nofollow">@arbitrum</a><br/>Don't sleep on <a class="text-blue-500 hover:underline" href="https://x.com/therollupco" target="_blank" rel="noopener noreferrer nofollow">@therollupco</a></p>
            <p class="">And definitely don't sleep on <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a></p>
            `,
			author: 'jill gunter ☕',
			link: 'https://x.com/jillrgunter/status/1867041611605217359?t=49faH793BEin4k3yXpFHjA&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295105/7_lhuujk.webp',
			company: 'EspressoSys'
		},
		{
			text: `<p class="mb-2">👀 excellent roundup here that covers what we're building, the current capabilities of a fast confirmation layer and what it offers chains in</p>
			<p class="italic text-muted-foreground text-xs">[...]</p>`,
			author: 'Espresso Systems',
			link: 'https://x.com/EspressoSys/status/1867043045868441934?t=49faH793BEin4k3yXpFHjA&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295105/8_pmyaxg.webp',
			company: 'EspressoSys'
		},
		{
			text: `	
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
			<p>Read more about Aethir in this fantastic article by <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a>! 🚀👇🏻</p>
			`,
			author: 'Aethir Ecosystem',
			link: 'https://x.com/AethirEco/status/1864944630149566639?t=TXgm_Q73EelEctNr3mB1Ow&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295105/9_fmamuw.webp'
		},
		{
			text: '<p>Great read! Extensive research on the current DePIN landscape</p>',
			author: 'cookies 🍪',
			link: 'https://x.com/jinglingcookies/status/1865278297065844845?t=Td21JfR7C6sARUNFVfgS7Q&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/10_swh2xt.webp',
			company: 'Monad'
		},
		{
			text: `	
            <p class="mb-2">This is super solid work <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a>!</p>
			<p>I believe all the apps will be chain abstracted app next year.</p>
			`,
			author: 'Dhee.eth/nft 🦇🔊 CHAIN ABSTRACTION',
			link: 'https://x.com/DheerajShah_/status/1869106503501959555',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/11_tb47hv.webp',
			company: 'Socket Protocol'
		},
		{
			text: '<p>“2077 Research team is based” 🥷</p>',
			author: 'accountless',
			link: 'https://x.com/alexanderchopan/status/1870298456905978201',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295105/12_oats8e.webp',
			company: 'Intersend'
		},
		{
			text: `<p class="mb-2">9/ Huge shoutout to <a class="text-blue-500 hover:underline" href="https://x.com/fikunmi_ap" target="_blank" rel="noopener noreferrer nofollow">@fikunmi_ap</a> and <a class="text-blue-500 hover:underline" href="https://x.com/2077Collective" target="_blank" rel="noopener noreferrer nofollow">@2077Collective</a> for a comprehensive report. Was great working/jamming on this together.</p>
            <p>Here is the full tweet / report:</p>`,
			author: 'taetaehoho',
			link: 'https://x.com/0xtaetaehoho/status/1828440721075868089?t=ixll2icB1vuM76Qsi9zhmQ&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295105/13_gjagtj.webp',
			company: 'Eclipse'
		},
		{
			text: `
            <p class="mb-2">Great article on Chain Abstraction by the team at <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a>!</p>
            <p>Read about CAKE framework and OneBalance accounts</p>
			`,
			author: '☉neBalance',
			link: 'https://x.com/onebalance_io/status/1846220067610284490?s=46&t=3HX1wysJ915JPCYnZlMPfA',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295104/6_rlsvma.webp',
			company: '☉neBalance'
		},
		{
			text: `
            <p class="mb-1 italic text-muted-foreground text-xs">[...]</p>
            <p class="mb-2">🐡 Enter <a class="text-blue-500 hover:underline" href="https://x.com/puffer_unifi" target="_blank" rel="noopener noreferrer nofollow">@puffer_unifi</a>, aligning L1 + L2 with decentralized sequencing + shared MEV rewards.</p>
            <p class="mb-2">🌐 Read <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a>'s full analysis below👇</p>
            `,
			author: 'DeFi Dad',
			link: 'https://x.com/defi_dad/status/1849100399485067733?s=46&t=Oa3-io-PodorudtH4BCkGg',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295106/15_1_kvuazx.webp'
		},
		{
			text: `
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
            <p class="mb-1">One highlight I will give here is <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a></p>
            <p>They are crazy detail-oriented and analytical. They could even find details about your project that you haven't even thought about 😂</p>
            `,
			author: 'altan tutar',
			link: 'https://x.com/mraltantutar/status/1864989691365171446',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295106/16_uxotic.webp',
			company: 'nuffle'
		},
		{
			text: `
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
			<p>Very nice work breaking down ERC-7683 by the <a class="text-blue-500 hover:underline" href="https://x.com/2077Collective" target="_blank" rel="noopener noreferrer nofollow">@2077Collective</a>. S/o to the teams like <a class="text-blue-500 hover:underline" href="https://x.com/AcrossProtocol" target="_blank" rel="noopener noreferrer nofollow">@AcrossProtocol</a> & <a class="text-blue-500 hover:underline" href="https://x.com/Uniswap" target="_blank" rel="noopener noreferrer nofollow">@Uniswap</a> for collaborating on the standard.</p>
			`,
			author: 'apriori',
			link: 'https://x.com/apriori0x/status/1867300537172972019?t=2HjEDAqB61UGKHYlSRPeZg&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295106/17_rs7qhp.webp',
			company: 'Anoma'
		},
		{
			text: `
            <p class="mb-2">ERC-7683 will unify Ethereum</p>
            <p>2077 Research thread on how the standard works:</p>
            `,
			author: 'Across',
			link: 'https://x.com/AcrossProtocol/status/1867245588263121335?t=jppHsnzhix9f1UEwzPPTkA&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295106/18_euzm4s.webp',
			company: 'Across Protocol'
		},
		{
			text: `
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
            <p class="mb-2">Big thanks to <a class="text-blue-500 hover:underline" href="https://x.com/2077Collective" target="_blank" rel="noopener noreferrer nofollow">@2077Collective</a> & <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a> for their cutting-edge research driving Ethereum forward.</p>
            <p class="italic text-muted-foreground text-xs">[...]</p>
            `,
			author: 'Labyrinth',
			link: 'https://x.com/Labyrinth_HQ/status/1866929394159087945?t=e2TBZ4riMkZr5vkdnbheRA&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295106/19_w7uryo.webp'
		},
		{
			text: `
            <p class="mb-2 italic text-muted-foreground text-xs">[...]</p>
            <p class="mb-2">Great overview of <a class="text-blue-500 hover:underline" href="https://x.com/hashtag/DePIN?src=hashtag_click" target="_blank" rel="noopener noreferrer nofollow">#DePIN</a> on Ethereum from <a class="text-blue-500 hover:underline" href="https://x.com/0xyanshu" target="_blank" rel="noopener noreferrer nofollow">@0xyanshu</a> and <a class="text-blue-500 hover:underline" href="https://x.com/eawosikaa" target="_blank" rel="noopener noreferrer nofollow">@eawosikaa</a> writing in <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a> 👇 </p>
            <p><a class="text-blue-500 hover:underline" href="https://research.2077.xyz/depin-on-ethereum-redefining-coordination-systems#streamr-peer-to-peer-data-streaming" target="_blank" rel="noopener noreferrer nofollow">research.2077.xyz/depin-on-ether...</a></p>
            `,
			author: 'Streamr Network',
			link: 'https://x.com/streamr/status/1866120870823129311?t=kFyIZwb26cxgod9GfU7tNw&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295106/20_oyacnc.webp'
		},
		{
			text: `
            <p class="mb-2">Great primer on ERC-7683 by 2077 Research!</p>
            <p>If you care about intents, read this 👇</p>
            `,
			author: 'Arjun | LI.FI',
			link: 'https://x.com/arjunnchand/status/1868886295881351512?t=5p3iEbuHeedDXMb4moVLLQ&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295107/21_evw2eh.webp',
			company: 'Li.Fi'
		},
		{
			text: `
            <p class="mb-2">Focus is now on building the best apps</p>
            <p>This is a great read by <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a> team on how <a class="text-blue-500 hover:underline" href="https://x.com/SOCKETProtocol" target="_blank" rel="noopener noreferrer nofollow">@SOCKETProtocol</a> does it.</p>
            `,
			author: 'Vaibhav ⚡️',
			link: 'https://x.com/vaibhavchellani/status/1869099478340485517?s=46&t=3HX1wysJ915JPCYnZlMPfA',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295107/22_xif9zm.webp',
			company: 'Socket Protocol'
		},
		{
			text: `
            <p>Great research from 2077 Research team on <a class="text-blue-500 hover:underline" href="https://x.com/nufflelabs" target="_blank" rel="noopener noreferrer nofollow">@nufflelabs</a> ! Go <a class="text-blue-500 hover:underline" href="https://x.com/mraltantutar" target="_blank" rel="noopener noreferrer nofollow">@mraltantutar</a> and team!</p>
            `,
			author: 'swisshustler',
			link: 'https://x.com/swisshustler/status/1870462573486760117?t=KH6q1q7zdOBN_pauytSNig&s=19',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295107/23_pfizf2.webp',
			company: 'NEAR Protocol'
		},
		{
			text: `
            <p class="mb-2">Get ready to hear more on based rollups in 2025. From the great team at <a class="text-blue-500 hover:underline" href="https://x.com/2077Research" target="_blank" rel="noopener noreferrer nofollow">@2077Research</a></p>
            `,
			author: 'tkstanczak',
			link: 'https://x.com/tkstanczak/status/1880153593896128907',
			platform: 'x',
			avatar: 'https://res.cloudinary.com/dc2iz5j1c/image/upload/v1737295820/43_qwuneq.webp',
			company: 'Nethermind'
		}
	];
</script>

<div class="bg-[#0C0C0D] pt-32 pb-10">
	<div class="container">
		<div class="flex md:items-start max-md:flex-col max-md:gap-8 md:px-10">
			<div
				class="max-w-full w-[468px] flex-shrink-0 bg-[#0C0C0D] flex items-center justify-center pt-10"
			>
				<div>
					<h3 class="text-[44.852px] font-powerGroteskBold font-bold leading-[43.955px]">
						What the people <br /> are saying about us
					</h3>

					<div class="mt-6 flex items-center flex-wrap flex-shrink-0 max-w-[380px]">
						{#each partners as PartnerIcon}
							<div
								class="h-[47px] p-4 border-[0.807px] border-[#262626] bg-[#0B0B0C] flex items-center justify-center text-[#A6A6A6] hover:text-black hover:bg-[#0CDEE9] transition"
							>
								<PartnerIcon />
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="md:flex-1 max-md:w-full overflow-hidden">
				<div class="relative">
					<Carousel.Root
						bind:api
						class="max-w-[380px] w-full relative mx-auto"
						opts={{ loop: true, align: 'center' }}
					>
						<AnimateSharedLayout>
							<Carousel.Content>
								{#each testimonials as testimonial, i}
									<Carousel.Item class="p-8">
										{@render card(testimonial, i)}
									</Carousel.Item>
								{/each}
							</Carousel.Content>
						</AnimateSharedLayout>

						<div class="relative flex items-center justify-center gap-[18px] mt-2">
							<Carousel.Previous
								class="bg-white size-12 border-none [&_svg]:size-6 md:[&_svg]:size-8 !text-black hover:bg-neutral-10 hover:!text-neutral-80 relative left-0 translate-y-0"
							/>

							<Carousel.Next
								class="bg-white size-12 border-none [&_svg]:size-6 md:[&_svg]:size-8 !text-black hover:!text-neutral-80 hover:bg-neutral-10 relative left-0 translate-y-0"
							/>
						</div>
					</Carousel.Root>
				</div>
			</div>
		</div>
	</div>
</div>

{#snippet card(testimonial: Testimonial, i: number)}
	<div
		class={cn(
			'p-5 md:px-[30px] md:py-6 w-full bg-[#19191A] rounded-[4px] border border-[#383838] relative transition'
		)}
	>
		<a
			href={testimonial.link}
			target="_blank"
			rel="noopener noreferrer nofollow"
			class={cn('absolute inset-0 z-50')}
			aria-label="Tweet link"
		>
		</a>

		<div class="flex flex-col gap-4">
			<span class="text-sm md:text-base">{@html testimonial.text}</span>

			<div class="flex gap-2">
				<div class="flex gap-2 justify-between w-full">
					<div class="flex gap-2 items-center">
						<img
							src={testimonial.avatar}
							alt={testimonial.author}
							class="w-10 md:h-10 rounded-full"
						/>
						<div>
							<p class="font-medium">{testimonial.author}</p>
							{#if testimonial.company}
								<p class="text-gray-500">{testimonial.company}</p>
							{/if}
						</div>
					</div>
					<div class="flex gap-2">
						<Icon name={testimonial.platform} />
					</div>
				</div>
			</div>
		</div>

		{#if current === i + 1}
			<Motion let:motion layoutId="outline">
				<div class="absolute -inset-2 rounded-[4px] pointer-events-none" use:motion>
					<div class="size-full relative">
						<svg
							width="17"
							height="19"
							class="absolute top-0 left-0"
							viewBox="0 0 17 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M17 1H5C2.79086 1 1 2.79086 1 5V18.5" stroke="#0CDEE9" />
						</svg>

						<svg
							width="17"
							height="19"
							viewBox="0 0 17 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="absolute bottom-0 right-0"
						>
							<path d="M0 18H12C14.2091 18 16 16.2091 16 14V0.5" stroke="#0CDEE9" />
						</svg>

						<svg
							width="17"
							height="19"
							viewBox="0 0 17 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="absolute bottom-0 left-0"
						>
							<path d="M17 18H5C2.79086 18 1 16.2091 1 14V0.5" stroke="#0CDEE9" />
						</svg>

						<svg
							width="17"
							height="19"
							viewBox="0 0 17 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="absolute top-0 right-0"
						>
							<path d="M0 1H12C14.2091 1 16 2.79086 16 5V18.5" stroke="#0CDEE9" />
						</svg>
					</div>
				</div>
			</Motion>
		{/if}
	</div>
{/snippet}
