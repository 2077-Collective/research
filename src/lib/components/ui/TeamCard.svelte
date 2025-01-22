<script lang="ts">
	import type { TeamMember } from '$lib/types/team';
	import { Badge } from './badge';
	const { full_name, picture_url, summary, role, twitter_username }: TeamMember = $props();
</script>

{#if twitter_username}
	<a
		href={`https://x.com/${twitter_username}`}
		class="flex flex-col bg-zinc-900 rounded-xl w-full relative"
	>
		<!-- this is the gradient -->
		<div
			class="w-full h-full hover:opacity-50 transition opacity-0 bg-gradient-to-t from-[#07BEBF]/20 absolute rounded-xl"
		></div>
		<div class="p-4">{@render body(picture_url, full_name, role, summary)}</div>
	</a>
{:else}
	<div class="flex flex-col bg-zinc-900 rounded-xl p-4 w-full">
		{@render body(picture_url, full_name, role, summary)}
	</div>
{/if}

{#snippet body(picture_url: string | undefined, full_name: string, role: string, summary: string)}
	<div class="flex md:flex-col gap-4">
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
			<p class="font-soehne text-xl md:text-2xl font-medium leading-9 tracking-tight">
				{full_name}
			</p>
			<div class="mb-2 md:mt-2 flex gap-2">
				<Badge variant="outline">{role}</Badge>
			</div>
		</div>
	</div>
	<p class="leading-6 tracking-normal">{summary}</p>
{/snippet}
