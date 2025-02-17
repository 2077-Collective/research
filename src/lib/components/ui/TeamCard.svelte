<script lang="ts">
	import type { TeamMember } from '$lib/types/team';
	import { cn } from '$lib/utils/ui-components';
	import { Plus } from 'lucide-svelte';
	const { full_name, picture_url, summary, role, twitter_username }: TeamMember = $props();

	let showDetails = $state(false);

	function clickOutside(node: HTMLElement, callback: () => void) {
		function handleClick(event: MouseEvent) {
			if (!node.contains(event.target as Node)) {
				callback();
			}
		}

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	function handleClose() {
		showDetails = false;
	}

	const handleToggleDetailsVisibility = () => {
		if (showDetails) {
			showDetails = false;
		} else {
			showDetails = true;
		}
	};
</script>

<div
	class="flex flex-col bg-[#19191A] rounded-[8px] w-full h-[400px] relative overflow-hidden group"
>
	<div class="absolute inset-0">
		<div class="size-full relative">
			<img
				src={picture_url || '/philosopher.png'}
				class="size-full object-cover object-top"
				alt={full_name}
			/>
			<div
				class="absolute inset-0 bg-[#0CDEE9] mix-blend-multiply opacity-0 group-hover:opacity-100 transition"
			></div>
		</div>
	</div>
	<div class="absolute inset-0 p-5 flex items-end justify-center" use:clickOutside={handleClose}>
		<div class="w-full flex flex-col h-full">
			<div class="flex-1 h-full w-full relative overflow-hidden">
				<div
					class={cn(
						'bg-white w-full h-full translate-y-[120%] transition rounded-t-[8px] px-4 pt-4',
						showDetails && 'translate-y-0'
					)}
				>
					<p class="text-[#19191A] text-sm">{summary}</p>
				</div>
			</div>

			<div
				class={cn(
					'w-full bg-neutral-80 group-hover:bg-white p-4 rounded-[8px] scale-x-[0.93] group-hover:scale-x-100 transition will-change-transform flex items-center justify-between',
					showDetails && 'bg-white scale-x-100 rounded-t-none group-hover:rounded-t-none'
				)}
			>
				<div class="flex flex-col gap-1">
					<p
						class={cn(
							'font-powerGroteskBold text-xl md:text-2xl font-medium leading-9 tracking-tight group-hover:text-[#19191A]',
							showDetails && 'text-[#19191A]'
						)}
					>
						{full_name}
					</p>

					<div
						class="h-[22px] bg-[#19191A] rounded-[2px] px-1.5 py-1 w-fit flex items-center justify-center text-xs text-neutral-10"
					>
						{role}
					</div>
				</div>

				<button
					class={cn(
						'size-[35px] bg-white group-hover:bg-[#19191A] group-hover:text-white rounded-full flex items-center justify-center text-black',
						showDetails && 'bg-[#19191A] text-white'
					)}
					onclick={handleToggleDetailsVisibility}
				>
					<Plus
						class={cn(
							'group-hover:rotate-180 transition',
							showDetails && 'rotate-45 group-hover:rotate-45'
						)}
					/>
				</button>
			</div>
		</div>
	</div>

	<!-- {@render body(picture_url, full_name, role, summary)} -->
</div>
