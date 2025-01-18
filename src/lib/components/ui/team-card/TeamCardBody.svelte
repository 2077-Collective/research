<script lang="ts">
	import type { TeamMember } from '$lib/types/team';
	import Badge from '../badge/badge.svelte';
	const { full_name, picture_url, summary, role, twitter_username }: TeamMember = $props();
</script>

<div class="flex md:flex-col gap-4">
	{#if picture_url}
		<img
			class="w-16 h-16 aspect-square rounded-full bg-gradient-to-br from-blue-500 to-purple-400"
			src={picture_url}
			alt=""
		/>
	{:else}
		<div
			class="w-16 h-16 aspect-square rounded-full bg-gradient-to-br from-blue-500 to-purple-400"
		></div>
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
