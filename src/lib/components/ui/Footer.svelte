<script lang="ts">
	import { ArrowUp, ArrowUpRightIcon } from 'lucide-svelte';

	function goTop() {
		document.body.scrollIntoView();
	}

	type Link = {
		href: string;
		text: string;
		isExternal: boolean;
	};

	const linkGroups = {
		Navigation: [
			{ href: '/', text: 'Home', isExternal: false },
			{ href: '/about', text: 'About Us', isExternal: false }
		],

		Read: [
			{ href: 'https://x.com/2077research', text: 'Research', isExternal: true },
			{ href: 'https://x.com/2077research', text: 'The Bazaar', isExternal: true }
		],

		Socials: [
			{ href: 'https://x.com/2077research', text: 'Twitter', isExternal: true },
			{ href: 'https://x.com/2077research', text: 'Discord', isExternal: true },
			{ href: 'https://x.com/2077research', text: 'Telegram', isExternal: true }
		]
	};

	const links: Link[] = [
		{ href: '/reports', text: 'Latest research', isExternal: false },
		{ href: '/about', text: 'About', isExternal: false },
		//{ href: '/article-review', text: 'Publish your research', isExternal: false },
		{ href: 'https://2077.xyz', text: '2077.xyz', isExternal: true },
		{
			href: 'mailto:research@2077.xyz',
			text: 'Contact',
			isExternal: false
		},
		{ href: '/work-with-us', text: 'Work with us', isExternal: false },
		{ href: 'https://x.com/2077research', text: 'Twitter', isExternal: true }
	];
</script>

<footer class="bg-[#040405] w-full relative">
	<button
		class="flex items-center gap-3 px-3 py-2 text-2xl transition-colors duration-300 group text-[12.667px] h-10 bg-[#19191A] rounded-[3.167px] text-[#B4B4B4] group absolute left-1/2 -translate-x-1/2 -translate-y-5"
		aria-label="View all research articles"
		on:click={goTop}
	>
		Back to the Top

		<ArrowUp
			class="size-5 rounded-full group-hover:-translate-y-[2px] transition"
			style="stroke-width: 1.4"
		/>
	</button>

	<div class="py-16 flex flex-col md:flex-row gap-6 justify-between w-full container">
		<svg
			width="53"
			height="105"
			viewBox="0 0 53 105"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
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

		<div class="flex gap-16">
			{#each Object.keys(linkGroups) as group}
				<div>
					<div>
						<p class="uppercase text-sm text-neutral-40">{group}</p>
					</div>

					<div class="mt-4 space-y-3 text-sm font-inter">
						{#each linkGroups[group] as link}
							{@render linkComp(link)}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</footer>

{#snippet linkComp(link: Link)}
	<a
		href={link.href}
		class="flex gap-1 items-center self-stretch my-auto whitespace-nowrap hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-offset-2 text-neutral-10 font-light"
		target={link.isExternal ? '_blank' : '_self'}
		rel="noopener noreferrer"
	>
		<span class="self-stretch my-auto -tracking-[0.28px]">{link.text}</span>
		{#if link.isExternal}
			<ArrowUpRightIcon class="size-4" />
		{/if}
	</a>
{/snippet}
