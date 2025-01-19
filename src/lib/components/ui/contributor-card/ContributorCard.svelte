<script lang="ts">
	import type { Author } from '$lib/types/article';
	const { full_name, twitter_username, username }: Author = $props();
</script>

{#snippet card(full_name: string | null, username: string)}
	<div class="flex flex-col bg-zinc-900 rounded-xl w-full">
		<div class="flex md:flex-col gap-4 p-4">
			<div class="flex flex-col">
				<p class="font-soehne text-xl md:text-2xl font-medium leading-9 tracking-tight">
					{#if full_name}
						{full_name}
					{:else}
						{username}
					{/if}
				</p>
			</div>
		</div>
	</div>
{/snippet}

{#if twitter_username}
	<a href={`https://x.com/${twitter_username}`} class="relative">
		<div
			class="w-full h-full hover:opacity-50 transition opacity-0 bg-gradient-to-t from-[#07BEBF]/20 absolute rounded-xl"
		></div>
		{@render card(full_name, username)}
	</a>
{:else}
	{@render card(full_name, username)}
{/if}
