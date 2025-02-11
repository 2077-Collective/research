<script lang="ts">
	import X from '$lib/components/ui/icons/X.svelte';
	import { ArrowUpRightIcon, Briefcase, MailIcon, type Icon as IconType } from 'lucide-svelte';
	import type { Component } from 'svelte';

	type Link = {
		href: string;
		text: string;
		isExternal: boolean;
		icon?: typeof IconType | Component<{ size: '16px' | '20px' | '24px' }>;
	};
	const links: Link[] = [
		{ href: '/reports', text: 'Latest research', isExternal: false },
		{ href: '/about', text: 'About', isExternal: false },
		//{ href: '/article-review', text: 'Publish your research', isExternal: false },
		{
			href: 'https://2077.xyz',
			text: `<p>2<span class="!font-inter">0</span>77.xyz<p>`,
			isExternal: true
		},
		{
			href: 'mailto:research@2077.xyz',
			text: 'Contact',
			isExternal: false,
			icon: MailIcon
		},
		{ href: '/work-with-us', text: 'Work with us', isExternal: false, icon: Briefcase },
		{ href: 'https://x.com/2077research', text: 'Twitter', isExternal: true, icon: X }
	];
</script>

<footer class="w-full bg-[#040405] py-16">
	<div class="flex flex-col md:flex-row gap-6 justify-between container">
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

		<div class="flex justify-between md:gap-16 max-md:mt-14">
			{#each Object.keys(linkGroups) as groupTitle}
				<div>
					<p class="text-sm uppercase text-neutral-40">{groupTitle}</p>

					<div class="mt-[18px] space-y-[14px]">
						{#each linkGroups[groupTitle] as link}
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
		class="flex gap-1 items-center self-stretch my-auto whitespace-nowrap hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-offset-2 text-neutral-20 font-inter text-sm"
		target={link.isExternal ? '_blank' : '_self'}
		rel="noopener noreferrer"
	>
		<span class="self-stretch my-auto">{@html @html link.text}</span>
		{#if link.isExternal}
			<ArrowUpRightIcon class="w-4 h-4" />
		{/if}
	</a>
{/snippet}
