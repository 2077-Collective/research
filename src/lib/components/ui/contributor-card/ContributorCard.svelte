<script lang="ts">
	import type { CardAuthor } from '$lib/types/article';
	const { full_name, twitter_username }: CardAuthor = $props();
</script>

<a
	href={`https://x.com/${twitter_username}`}
	class="flex flex-col bg-zinc-900 rounded-xl w-full relative"
>
	<!-- this is the gradient -->
	<div
		class="w-full h-full hover:opacity-50 transition opacity-0 bg-gradient-to-t from-[#07BEBF]/20 absolute rounded-xl"
	></div>
	<div class="flex md:flex-col gap-4 p-4">
		<div class="flex flex-col">
			<p class="font-soehne text-xl md:text-2xl font-medium leading-9 tracking-tight">
				{full_name}
			</p>
		</div>
	</div>
</a>
