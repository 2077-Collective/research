<script lang="ts">
	import type { TeamMember } from '$lib/types/team';
	import { fade } from 'svelte/transition';
	import TeamCardBody from './TeamCardBody.svelte';
	const p: TeamMember = $props();
</script>

{#if p.twitter_username}
	<a
		href={`https://x.com/${p.twitter_username}`}
		class="flex flex-col bg-zinc-900 rounded-xl w-full relative"
	>
		<!-- this is the gradient -->
		<div
			class="w-full h-full hover:opacity-50 transition opacity-0 bg-gradient-to-t from-[#07BEBF]/20 absolute rounded-xl"
		></div>
		<div class="p-4"><TeamCardBody {...p} /></div>
	</a>
{:else}
	<div class="flex flex-col bg-zinc-900 rounded-xl p-4 w-full">
		<TeamCardBody {...p} />
	</div>
{/if}
