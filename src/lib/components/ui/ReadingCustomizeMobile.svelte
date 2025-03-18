<script lang="ts">
	import { cn } from '$lib/utils/ui-components';
	import { AlignLeft, X } from 'lucide-svelte';

	const { open, onClose } = $props();

	let selectedSize = $state(16);
	let selectedFont = $state('hubot-sans');
	let selectedTheme = $state(1);

	const FONT_SIZES = [16, 17, 18, 19, 20];
	const FONT_FAMILIES = [
		{
			family_name: '',
			label: 'Hubot Sans',
			value: 'hubot-sans'
		},
		{
			family_name: '',
			label: 'Charter',
			value: 'charter'
		},
		{
			family_name: '',
			label: 'Open Sans',
			value: 'open-sans'
		}
	];
	const THEMES = [
		{
			id: 1,
			bg_color: '#19191A',
			text_color: 'white'
		},

		{
			id: 2,
			bg_color: 'white',
			text_color: '#010102'
		},

		{
			id: 3,
			bg_color: '#2B3031',
			text_color: 'white'
		},

		{
			id: 4,
			bg_color: '#1C2A3B',
			text_color: 'white'
		},

		{
			id: 5,
			bg_color: '#FEF5EB',
			text_color: '#171717'
		}
	];
</script>

{#if open}
	<div class="fixed w-full bottom-0 z-[999999999] bg-[#191919] pt-[29px] pb-10">
		<div class="container">
			<div class="flex items-center justify-between">
				<h4 class="text-2xl text-white font-powerGroteskBold">Customize</h4>

				<button onclick={onClose}><X class="size-5" /></button>
			</div>

			<div class="mt-6 space-y-4">
				<div class="space-y-2">
					<p class="text-neutral-40 font-mono">Font size</p>

					<div class="grid grid-cols-5 gap-1.5">
						{#each FONT_SIZES as size}
							<button
								class={cn(
									'bg-[#121212] p-2.5 rounded-[8px] border border-[#121212] text-sm text-neutral-40 transition',
									selectedSize === size && 'text-white border-[#07858C]'
								)}
								onclick={() => (selectedSize = size)}>{size}px</button
							>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<p class="text-neutral-40 font-mono">Font</p>

					<div class="grid grid-cols-3 gap-2">
						{#each FONT_FAMILIES as font}
							<button
								class={cn(
									'bg-[#0F0F0F] p-2.5 rounded-[8px] text-sm text-[#9F9F9F] transition opacity-50',
									selectedFont === font.value && 'bg-white text-[#121212] opacity-100'
								)}
								onclick={() => (selectedFont = font.value)}>{font.label}</button
							>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<p class="text-neutral-40 font-mono">Theme</p>

					<div class="grid grid-cols-5 gap-2">
						{#each THEMES as theme}
							<button
								class={cn(
									`pt-2 pb-3 px-[11px] rounded-[8px] transition flex flex-col items-center justify-center',
								selectedTheme === theme.id && 'bg-white text-[#121212] opacity-100`
								)}
								style={`background-color:${theme.bg_color}; border:1px solid ${selectedTheme === theme.id ? '#07858C' : theme.bg_color}; color:${theme.text_color}`}
								onclick={() => (selectedTheme = theme.id)}
							>
								<AlignLeft class="size-[35px] mb-2" />

								<span class="size-[30px] border rounded-full flex items-center justify-center">
									{#if selectedTheme === theme.id}
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.5805 9.97493C15.8428 9.65434 15.7955 9.18183 15.4749 8.91953C15.1543 8.65724 14.6818 8.70449 14.4195 9.02507L10.4443 13.8837L9.03033 12.4697C8.73744 12.1768 8.26256 12.1768 7.96967 12.4697C7.67678 12.7626 7.67678 13.2374 7.96967 13.5303L9.96967 15.5303C10.1195 15.6802 10.3257 15.7596 10.5374 15.7491C10.749 15.7385 10.9463 15.6389 11.0805 15.4749L15.5805 9.97493Z"
												fill="#0CDEE9"
											/>
										</svg>
									{/if}
								</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
