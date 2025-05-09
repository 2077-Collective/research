<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils/ui-components';
	import { Headphones, Loader2, Pause, Play, X } from 'lucide-svelte';

	let {
		articleAudioUrl,
		isLoading,
		mobileClassName = '',
		className = '',
		hideLabel = false,
		side = 'bottom',
		align = 'start',
		sideOffset = 8,
		alignOffset = 0
	}: {
		articleAudioUrl: string;
		isLoading: boolean;
		mobileClassName?: string;
		className?: string;
		hideLabel?: boolean;
		side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
		align?: 'start' | 'center' | 'end' | undefined;
		sideOffset?: number;
		alignOffset?: number;
	} = $props();

	// "bottom" | "top" | "right" | "left" | undefined'

	let audio: HTMLAudioElement | null = null;

	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isSeeking = $state(false);
	let playbackSpeed = $state(1);

	let isMobileOpen = $state(false);

	const togglePlay = () => {
		if (!audio) return;
		if (audio.paused) {
			audio.play();
			isPlaying = true;
		} else {
			audio.pause();
			isPlaying = false;
		}
	};

	// Update current time
	const updateTime = () => {
		if (!audio) return;
		currentTime = audio.currentTime;
	};

	// Seek to a position
	const seek = (event: Event) => {
		if (!audio) return;
		const target = event.target as HTMLInputElement;
		audio.currentTime = parseFloat(target.value);
		currentTime = parseFloat(target.value);
	};

	// Format time (mm:ss)
	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60)
			.toString()
			.padStart(2, '0');
		return `${minutes}:${seconds}`;
	};

	// Initialize audio
	$effect(() => {
		if (!audio) return;

		audio.load();
		audio.src = articleAudioUrl;

		audio.addEventListener('play', () => {
			isPlaying = true;
		});

		audio.addEventListener('pause', () => {
			isPlaying = false;
		});

		audio.addEventListener('loadedmetadata', () => {
			duration = audio?.duration || 0;
		});

		audio.addEventListener('timeupdate', updateTime);

		audio.addEventListener('ended', () => {
			isPlaying = false;
		});
	});

	const handleAudioSpeedChange = () => {
		if (!audio) return;

		if (playbackSpeed === 2) {
			playbackSpeed = 0.5;
			audio.playbackRate = 0.5;
		} else {
			playbackSpeed = playbackSpeed + 0.25;
			audio.playbackRate = playbackSpeed + 0.25;
		}
	};

	// console.log(process.env.NODE_ENV);
</script>

{#if isLoading}
	<div
		class="flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition disabled:pointer-events-none disabled:opacity-40"
	>
		<span>Loading audio</span>
		<Headphones class="size-4" />
	</div>
{:else}
	<Popover.Root>
		<Popover.Trigger disabled={articleAudioUrl.length === 0} class="max-md:hidden"
			><button
				class={cn(
					'flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition disabled:pointer-events-none disabled:opacity-40',
					className
				)}
				disabled={articleAudioUrl.length === 0}
			>
				{#if !hideLabel}
					<span>{isPlaying ? 'Listening' : 'Listen'}</span>
				{/if}

				<Headphones class="size-4" />
			</button>
		</Popover.Trigger>

		<Popover.Content
			class="max-md:hidden p-4 rounded-[8px] border-none bg-[#19191A] z-[99999]"
			{side}
			{align}
			{sideOffset}
			{alignOffset}
		>
			{@render audioPlayer()}
		</Popover.Content>
	</Popover.Root>

	<!-- Listen button Mobile -->
	<button
		class={cn(
			'flex md:hidden max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition disabled:pointer-events-none disabled:opacity-40',
			mobileClassName
		)}
		disabled={articleAudioUrl.length === 0}
		onclick={() => {
			if (articleAudioUrl.length > 0) {
				isMobileOpen = true;
			}
		}}
	>
		<span>{isPlaying ? 'Listening' : 'Listen'}</span>
		<Headphones class="size-4" />
	</button>

	<!-- Audio player mobile -->
	{#if isMobileOpen}
		<div
			class="fixed top-0 h-dvh w-dvw bg-black/60 backdrop-blur-sm left-0 z-[999999999999999] flex items-end md:hidden"
		>
			<div
				class={cn(
					'bg-[#191a19] w-full pt-4 pb-7 rounded-t-[8px] translate-y-full transition-all duration-300',
					isMobileOpen && 'translate-y-0 delay-150'
				)}
			>
				<div class="container">
					<div class="flex items-center justify-between">
						<p class="text-base text-neutral-20 font-medium font-mono">Listening to audio</p>

						<button
							class="size-7 flex items-center justify-center group"
							onclick={() => (isMobileOpen = false)}
						>
							<X class="size-5 group-hover:text-neutral-60 transition" />
						</button>
					</div>

					<div class="mt-5">
						{@render audioPlayer()}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<audio
		bind:this={audio}
		class="absolute -z-50"
		onseeking={() => (isSeeking = true)}
		onseeked={() => (isSeeking = false)}
	>
		<source src={articleAudioUrl} type="audio/mpeg" />
	</audio>
{/if}

{#snippet audioPlayer()}
	<div
		class="flex items-center justify-between gap-3 text-sm text-neutral-40 font-mono font-medium"
	>
		{#if !isSeeking}
			<button onclick={togglePlay} class="text-neutral-60 [&_svg]:fill-neutral-60">
				{#if isPlaying}
					<Pause />
				{:else}
					<Play />
				{/if}
			</button>
		{:else}
			<div class="size-6 flex items-center justify-center">
				<Loader2 class="size-5 animate-spin" />
			</div>
		{/if}

		<div class="flex-1">
			<input
				type="range"
				class="w-full"
				min="0"
				max={duration}
				value={currentTime}
				oninput={seek}
				style={`--progress: ${(currentTime / duration) * 100}%`}
			/>
		</div>

		<div class="flex items-center gap-3">
			<div class="w-11 flex-shrink-0 flex justify-end">
				<p>{formatTime(duration - currentTime)}</p>
			</div>

			<button
				class="w-10 h-6 flex items-center justify-center text-[10px] font-normal border rounded-[6px] border-neutral-80 hover:bg-neutral-80 transition"
				onclick={handleAudioSpeedChange}>{playbackSpeed}x</button
			>
		</div>
	</div>
{/snippet}

<!-- <audio
	bind:this={audio}
	onseeking={() => (isSeeking = true)}
	onseeked={() => (isSeeking = false)}
>
	<source
		src={'https://beyondwords-cdn-b7fyckdeejejb6dj.a03.azurefd.net/audio/projects/48883/podcasts/42bd258a-05ed-4663-99d5-aa58e4fc1786/versions/1741689730/media/7a460bee93d1c0e2a0da0fa2a917fa81_compiled.mp3'}
		type="audio/mpeg"
	/>
</audio> -->

<style>
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
		background: linear-gradient(to right, white var(--progress), var(--neutral-80) var(--progress));
		border-radius: 8px !important;
		transition: all 0.5s linear;
	}

	input[type='range']::-webkit-slider-runnable-track {
		@apply rounded-[30px];
		height: 5px;
	}

	input[type='range']::-moz-range-track {
		@apply rounded-[30px];
		height: 5px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		margin-top: -3px;
		background-color: white;
		height: 11px;
		width: 11px;
		border-radius: 100% !important;
		@apply border;
	}

	input[type='range']::-moz-range-thumb {
		border: none;
		background-color: white;
		height: 11px;
		width: 11px;
		border-radius: 100% !important;
	}
</style>
