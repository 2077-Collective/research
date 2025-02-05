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

	const linkGroups = {
		Navigation: [
			{ href: '/', text: 'Home', isExternal: false },
			{ href: '/about', text: 'About us', isExternal: false }
		],

		Read: [{ href: 'https://x.com/2077research', text: 'Researxh', isExternal: true, icon: X }]
	};

	const links: Link[] = [
		{ href: '/reports', text: 'Latest research', isExternal: false },
		{ href: '/about', text: 'About', isExternal: false },
		//{ href: '/article-review', text: 'Publish your research', isExternal: false },
		{ href: 'https://2077.xyz', text: '2077.xyz', isExternal: true },
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

<footer class="bg-[#040405] w-full">
	<div class="py-6 flex flex-col md:flex-row gap-6 justify-between w-full container">
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

		<div>
			<p class="self-stretch my-auto md:hidden text-center tracking-normal">©2077 Research</p>
			<div
				class="flex flex-wrap gap-6 justify-center md:justify-between items-center text-base w-full"
			>
				<p class="self-stretch my-auto hidden md:block tracking-normal">©2077 Research</p>
				{#each links as link}
					{@render linkComp(link)}
				{/each}
			</div>
		</div>
	</div>
</footer>

{#snippet linkComp(link: Link)}
	<a
		href={link.href}
		class="flex gap-1 items-center self-stretch my-auto whitespace-nowrap hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-offset-2"
		target={link.isExternal ? '_blank' : '_self'}
		rel="noopener noreferrer"
	>
		{#if link.icon}
			<link.icon size="16px" />
		{/if}
		<span class="self-stretch my-auto">{link.text}</span>
		{#if link.isExternal}
			<ArrowUpRightIcon class="w-4 h-4" />
		{/if}
	</a>
{/snippet}
