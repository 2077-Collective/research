<script lang="ts">
	import type { TeamMember } from '$lib/types/team';
	import { slide } from 'svelte/transition';
	import Badge from './badge/badge.svelte';

	const { full_name, picture_url, summary, role, twitter_username }: TeamMember = $props();
</script>

<div transition:slide={{ duration: 300 }} class={`flex flex-row justify-center h-fit`}>
	<div class="flex flex-col bg-zinc-900 rounded-xl p-4 w-full">
		<div class="flex flex-row gap-4 items-center">
			<div
				class="w-16 h-16 aspect-square rounded-full bg-gradient-to-br from-blue-500 to-purple-400"
			></div>

			<div class="flex flex-col">
				<p class="font-soehne text-xl md:text-3xl font-medium leading-9 tracking-tight">
					{full_name}
				</p>
				<div class="mt-1 flex">
					<Badge variant="outline">{role}</Badge>
				</div>
			</div>
		</div>
		<p class="mt-2 leading-6 tracking-normal">{summary}</p>
	</div>
</div>
