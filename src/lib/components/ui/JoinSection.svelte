<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { cn } from '$lib/utils/ui-components';
	import type { CarouselAPI } from './carousel/context';
	import Discord from './icons/Discord.svelte';
	import Telegram from './icons/Telegram.svelte';
	import X from './icons/X.svelte';

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

	const TWEEN_FACTOR_BASE = 0.52;
	let tweenFactor = 0;
	let tweenNodes: HTMLElement[] = [];

	const numberWithinRange = (number: number, min: number, max: number): number =>
		Math.min(Math.max(number, min), max);

	const setTweenNodes = (emblaApi: CarouselAPI): void => {
		tweenNodes = emblaApi.slideNodes().map((slideNode) => {
			return slideNode.querySelector('.embla__slide__number') as HTMLElement;
		});
	};

	const setTweenFactor = (emblaApi: CarouselAPI): void => {
		tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
	};

	const tweenScale = (emblaApi: CarouselAPI, eventName?: any): void => {
		const engine = emblaApi.internalEngine();
		const scrollProgress = emblaApi.scrollProgress();
		const slidesInView = emblaApi.slidesInView();
		const isScrollEvent = eventName === 'scroll';

		emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
			let diffToTarget = scrollSnap - scrollProgress;
			const slidesInSnap = engine.slideRegistry[snapIndex];

			slidesInSnap.forEach((slideIndex) => {
				if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

				if (engine.options.loop) {
					engine.slideLooper.loopPoints.forEach((loopItem) => {
						const target = loopItem.target();

						if (slideIndex === loopItem.index && target !== 0) {
							const sign = Math.sign(target);

							if (sign === -1) {
								diffToTarget = scrollSnap - (1 + scrollProgress);
							}
							if (sign === 1) {
								diffToTarget = scrollSnap + (1 - scrollProgress);
							}
						}
					});
				}

				const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor);
				const scale = numberWithinRange(tweenValue, 0, 1).toString();
				const tweenNode = tweenNodes[slideIndex];
				tweenNode.style.transform = `scale(${scale})`;
			});
		});
	};

	export const setupTweenScale = (emblaApi: CarouselAPI): (() => void) => {
		setTweenNodes(emblaApi);
		setTweenFactor(emblaApi);
		tweenScale(emblaApi);

		emblaApi
			.on('reInit', setTweenNodes)
			.on('reInit', setTweenFactor)
			.on('reInit', tweenScale)
			.on('scroll', tweenScale)
			.on('slideFocus', tweenScale);

		return (): void => {
			tweenNodes.forEach((slide) => slide.removeAttribute('style'));
		};
	};

	const socials = [
		{
			name: 'Telegram',
			icon: Telegram,
			number: '20K+',
			subtitle: 'Members',
			ctaText: 'Join Telegram',
			href: '/'
		},
		{
			name: 'Twitter/X',
			icon: X,
			number: '23K+',
			subtitle: 'Followers',
			ctaText: 'Follow us',
			href: '/'
		},
		{
			name: 'Discord',
			icon: Discord,
			number: '12K+',
			subtitle: 'Members',
			ctaText: 'Follow us',
			href: '/'
		}
	];
</script>

<section class="bg-[#0C0C0D] w-full pt-16 md:pt-32 pb-40">
	<div class="container">
		<h2
			class="text-[24px] md:text-[32px] font-powerGroteskBold font-bold max-md:max-w-[257px] text-center mx-auto leading-8"
		>
			Join the movement shaping <br class="max-md:hidden" /> the decentralized future
		</h2>
	</div>

	<Carousel.Root
		bind:api
		class="max-w-[1163px] relative mt-10 md:mt-16 mx-auto"
		opts={{ loop: true, align: 'center' }}
	>
		<Carousel.Content>
			{#each [...socials, ...socials] as social, i}
				{@const isLeft = current === 1 ? 6 : current - 1}
				{@const isRight = current === 6 ? 1 : current + 1}

				<Carousel.Item
					class={cn('relative flex-none w-[300px] md:w-[370px] mr-2.5 md:mr-5 p-0')}
					style="perspective: 1000px; transform-style: preserve-3d;"
				>
					<div
						class={cn(
							'h-[295px] md:h-[379px] bg-[#19191A] p-4 rounded-[8px] flex flex-col gap-8 md:gap-12 transition duration-500 will-change-transform',
							current !== i + 1 && 'opacity-30 md:opacity-40 pointer-events-none select-none',
							i + 1 === isLeft && 'md:[transform:rotateY(38deg)_scale(0.75)]',
							i + 1 === isRight && 'md:[transform:rotateY(-38deg)_scale(0.75)]'
						)}
					>
						<div class="flex items-center justify-between px-2">
							<p class="font-mono max-md:text-sm">{social.name}</p>

							<span class={cn('transition', current === i + 1 && 'text-[#0CDEE9]')}>
								<social.icon size="24px" />
							</span>
						</div>

						<div class="flex-1 text-center">
							<div
								class="text-[100px] md:text-[125px] font-powerGroteskBold font-bold tracking-wide leading-none"
							>
								{social.number}
							</div>

							<p class="font-mono">{social.subtitle}</p>
						</div>

						<div>
							<a href={social.href}>
								<button
									class="h-10 md:h-14 flex items-center justify-center text-center w-full text-neutral-40 font-mono uppercase border border-neutral-80 hover:bg-neutral-80 rounded-[8px] transition max-md:text-sm"
									>{social.ctaText}</button
								>
							</a>
						</div>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		<div
			class="flex items-center absolute text-neutral-60 left-1/2 -translate-x-1/2 -bottom-14 md:-bottom-20"
		>
			<Carousel.Previous
				class="bg-white border-none [&_svg]:size-6 md:[&_svg]:size-6 text-black hover:bg-white size-12 hover:text-black hover:opacity-70 transition"
			/>

			<div class="w-5"></div>

			<!-- <div
				class="text-center text-sm !text-[24px] md:!text-[32px] font-powerGroteskBold font-bold w-16"
			>
				<span class="text-white">{current}</span>/{count}
			</div> -->

			<Carousel.Next
				class="bg-white border-none [&_svg]:size-6 md:[&_svg]:size-6 text-black hover:bg-white size-12 hover:text-black hover:opacity-70 transition"
			/>
		</div>
	</Carousel.Root>
</section>
