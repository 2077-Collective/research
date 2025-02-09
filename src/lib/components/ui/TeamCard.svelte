<script lang="ts">
	import type { TeamMember } from '$lib/types/team';
	const { full_name, picture_url, summary, role, twitter_username }: TeamMember = $props();
</script>

{#if twitter_username}
	<a
		href={`https://x.com/${twitter_username}`}
		class="flex flex-col bg-[#19191A] rounded-[8px] w-full relative group"
	>
		<div class="absolute -inset-1 rounded-[8px] opacity-0 group-hover:opacity-100 transition">
			<div class="size-full relative">
				<svg
					width="17"
					height="19"
					viewBox="0 0 17 19"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="absolute top-0 left-0"
				>
					<path d="M17 1H9C4.58172 1 1 4.58172 1 9V18.5" stroke="#0CDEE9" />
				</svg>

				<svg
					width="17"
					height="19"
					viewBox="0 0 17 19"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="absolute top-0 right-0"
				>
					<path d="M0 1H8C12.4183 1 16 4.58172 16 9V18.5" stroke="#0CDEE9" />
				</svg>

				<svg
					width="17"
					height="19"
					viewBox="0 0 17 19"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="absolute bottom-0 left-0"
				>
					<path d="M17 18H9C4.58172 18 1 14.4183 1 10V0.5" stroke="#0CDEE9" />
				</svg>

				<svg
					width="17"
					height="19"
					viewBox="0 0 17 19"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="absolute bottom-0 right-0"
				>
					<path d="M0 18H8C12.4183 18 16 14.4183 16 10V0.5" stroke="#0CDEE9" />
				</svg>
			</div>
		</div>

		<div class="px-6 py-4 flex flex-col justify-center h-full">
			{@render body(picture_url, full_name, role, summary)}
		</div>
	</a>
{:else}
	<div class="flex flex-col bg-[#19191A] rounded-[8px] w-full">
		{@render body(picture_url, full_name, role, summary)}
	</div>
{/if}

{#snippet body(picture_url: string | undefined, full_name: string, role: string, summary: string)}
	<div class="flex md:flex-col">
		{#if picture_url}
			<img
				class="w-16 h-16 aspect-square rounded-full bg-gradient-to-br from-blue-500 to-purple-400"
				src={picture_url}
				alt=""
			/>
			<!--
			{:else}
			<div
				class="w-16 h-16 aspect-square rounded-full bg-gradient-to-br from-blue-500 to-purple-400"
			></div>
			-->
		{/if}
		<div class="flex flex-col">
			<p class="font-powerGroteskBold text-xl md:text-2xl font-medium leading-9 tracking-tight">
				{full_name}
			</p>
			<div class="mb-2 md:mt-1 flex gap-2">
				<div
					class="h-[22px] bg-neutral-80 rounded-[2px] px-1.5 py-1 flex items-center justify-center text-xs text-neutral-10"
				>
					{role}
				</div>
			</div>
		</div>
	</div>
	<p class="leading-6 tracking-normal font-hubot text-neutral-10 mt-px">{summary}</p>
{/snippet}
