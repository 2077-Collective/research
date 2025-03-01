<script lang="ts">
	import { ArrowUpRightIcon } from 'lucide-svelte';

	type Link = {
		href: string;
		text: string;
		isExternal: boolean;
		icon?: typeof ArrowUpRightIcon; // Optional icon for the link
	};

	const linkGroups: Record<string, Link[]> = {
		navigation: [
			{ href: '/', text: 'Home', isExternal: false },
			{ href: '/reports', text: 'Research', isExternal: false },
			{ href: '/ethereum-navigator', text: 'Newsletter', isExternal: false },
			{ href: '/about', text: 'About', isExternal: false },
			{ href: '/work-with-us', text: 'Work with us', isExternal: false }
		],
		socials: [
			{ href: 'https://x.com/2077research', text: 'Twitter', isExternal: true },
			{ href: 'https://t.me/2077research', text: 'Telegram', isExternal: true },
			{ href: 'https://farcaster.xyz/2077research', text: 'Farcaster', isExternal: true }
		]
	};
</script>

<footer class="w-full bg-[#040405] py-16">
	<div class="flex flex-col md:flex-row gap-6 justify-between md:container max-md:pl-6">
		<!-- Logo Section -->
		<div class="flex items-center justify-between gap-12">
			<svg
				viewBox="0 0 53 105"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="w-[32.002px] h-[62.88px] md:w-[53px] md:h-[105px]"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M0.34082 96.1688L8.46301 104.14L52.9997 59.5552L44.8696 51.5923L0.34082 96.1688Z"
					fill="#333333"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M0.34082 70.2104L8.46301 78.1734L52.9997 33.5889L44.8696 25.626L0.34082 70.2104Z"
					fill="#333333"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M0 44.5845L8.12219 52.5474L52.6589 7.96293L44.5367 0L0 44.5845Z"
					fill="#333333"
				/>
			</svg>

			<svg
				width="321"
				height="29"
				viewBox="0 0 321 29"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="md:hidden"
			>
				<line y1="14.5" x2="321" y2="14.5" stroke="#333333" />
				<line x1="0.5" y1="2.18561e-08" x2="0.499999" y2="29" stroke="#333333" />
			</svg>
		</div>

		<!-- Link Groups -->
		<div class="flex md:justify-between gap-[50px] md:gap-16 max-md:mt-[35px]">
			{#each Object.entries(linkGroups) as [groupTitle, links]}
				<div>
					<p class="text-sm uppercase text-neutral-40">{groupTitle}</p>
					<div class="mt-[18px] space-y-3">
						{#each links as link}
							{@render linkComp(link)}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</footer>

<!-- Link Component Snippet -->
{#snippet linkComp(link: Link)}
	<a
		href={link.href}
		class="flex gap-1 items-center self-stretch my-auto whitespace-nowrap hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-offset-2 text-neutral-20 font-ibm text-sm group"
		target={link.isExternal ? '_blank' : '_self'}
		rel="noopener noreferrer"
		data-sveltekit-preload-data
	>
		<span class="self-stretch my-auto">{@html link.text}</span>
		{#if link.isExternal}
			<ArrowUpRightIcon
				class="w-4 h-4 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition will-change-transform"
			/>
		{/if}
	</a>
{/snippet}