<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Headphones, Loader2, PauseCircle, PlayCircle } from 'lucide-svelte';

	let { articleAudioUrl, isLoading } = $props();

	let audio: HTMLAudioElement | null = null;

	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isSeeking = $state(false);

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

		audio.addEventListener('loadedmetadata', () => {
			console.log('LOADED ===>', audio?.duration);
			duration = audio?.duration || 0;
		});

		audio.addEventListener('', () => {
			console.log('LOADING...');
		});

		audio.addEventListener('timeupdate', updateTime);

		audio.addEventListener('ended', () => {
			isPlaying = false;
		});
	});
</script>

{#if isLoading}
	<div>Hello</div>
{:else}
	<Popover.Root>
		<Popover.Trigger
			><button
				class="flex max-md:flex-col-reverse items-center gap-2 md:px-4 hover:text-neutral-20 transition disabled:pointer-events-none disabled:opacity-40"
			>
				<span>{isPlaying ? 'Listening' : 'Listen'}</span>
				<Headphones class="size-4" />
			</button>
		</Popover.Trigger>

		<Popover.Content
			class="p-4 rounded-[8px] border-none bg-[#19191A]"
			side="bottom"
			align="start"
			sideOffset={8}
		>
			<div class="text-[15px] font-medium font-mono text-neutral-20 mb-2">
				{isPlaying ? 'Listening' : 'Listen'} to audio
			</div>

			<div
				class="flex items-center justify-between gap-3 text-sm text-neutral-40 font-mono font-medium"
			>
				{#if !isSeeking}
					<button onclick={togglePlay} class="text-neutral-60">
						{#if isPlaying}
							<PauseCircle class="size-8" />
						{:else}
							<PlayCircle class="size-8" />
						{/if}
					</button>
				{:else}
					<div class="size-8 flex items-center">
						<Loader2 class="size-6 animate-spin" />
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

				<div class="w-11 flex-shrink-0 flex justify-end">
					<p>{formatTime(duration - currentTime)}</p>
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>
{/if}

<audio
	bind:this={audio}
	class="absolute -z-50"
	onseeking={() => (isSeeking = true)}
	onseeked={() => (isSeeking = false)}
>
	<source
		src={'https://beyondwords-cdn-b7fyckdeejejb6dj.a03.azurefd.net/audio/projects/48883/podcasts/42bd258a-05ed-4663-99d5-aa58e4fc1786/versions/1741689730/media/7a460bee93d1c0e2a0da0fa2a917fa81_compiled.mp3'}
		type="audio/mpeg"
	/>
</audio>

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
