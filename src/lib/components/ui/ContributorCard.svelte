<script lang="ts">
	import type { Contributor } from '$lib/types/article';
	import X from './icons/X.svelte';
	const { full_name, twitter_username }: Contributor = $props();
</script>

{#snippet card(fullName: string | null, hasTwitter: boolean)}
	<div class="flex flex-col bg-zinc-900 rounded-xl w-full">
		<div class="flex md:flex-col gap-4 p-4">
			<div class="flex flex-row w-full justify-between items-center">
				<p class="font-powerGroteskBold text-xl md:text-2xl font-medium leading-9 tracking-tight">
					{fullName}
				</p>
				{#if hasTwitter}
					<div class=""><X size="24px" /></div>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

{#if twitter_username}
	<a href={`https://x.com/${twitter_username}`} class="relative">
		<div
			class="w-full h-full hover:opacity-50 transition opacity-0 bg-gradient-to-t from-[#07BEBF]/20 absolute rounded-xl"
		></div>
		{@render card(full_name, true)}
	</a>
{:else}
	{@render card(full_name, false)}
{/if}
