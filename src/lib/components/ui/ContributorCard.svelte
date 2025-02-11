<script lang="ts">
	import type { Contributor } from '$lib/types/article';

	const { full_name, twitter_username }: Contributor = $props();
</script>

{#snippet card(fullName: string | null, hasTwitter: boolean)}
	<div class="flex flex-col bg-[#0E0E0E] rounded-[8px] w-full relative group">
		{#if hasTwitter}
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
		{/if}

		<div class="flex md:flex-col gap-4 p-4">
			<div class="flex flex-row w-full justify-between items-center">
				<p
					class="font-powerGroteskBold text-xl md:text-xl font-medium leading-9 tracking-tight text-neutral-40"
				>
					{fullName}
				</p>

				{#if hasTwitter}
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="23"
							height="23"
							viewBox="0 0 23 23"
							fill="none"
						>
							<path
								d="M13.553 9.74082L21.9329 0H19.9471L12.671 8.45806L6.85948 0H0.15625L8.9442 12.7899L0.15625 23.0051H2.14205L9.82576 14.0727L15.9635 23.0051H22.6667L13.5521 9.74082H13.553ZM10.8329 12.9026L9.94262 11.6291L2.85751 1.49487H5.90799L11.6257 9.67319L12.516 10.9467L19.948 21.5779H16.8975L10.8329 12.9026Z"
								fill="#333333"
							/>
						</svg>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

{#if twitter_username}
	<a href={`https://x.com/${twitter_username}`} class="relative">
		{@render card(full_name, true)}
	</a>
{:else}
	{@render card(full_name, false)}
{/if}
