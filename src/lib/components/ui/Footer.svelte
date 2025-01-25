<script lang="ts">
	import {
		ArrowUpRightIcon,
		Briefcase,
		InboxIcon,
		MailIcon,
		type Icon as IconType
	} from 'lucide-svelte';
	import X from '$lib/components/ui/icons/X.svelte';
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

<footer class="border-t py-6 flex flex-col md:flex-row gap-6 w-full">
	<p class="self-stretch my-auto md:hidden text-center tracking-normal">©2077 Research</p>
	<div class="flex flex-wrap gap-6 justify-center md:justify-between items-center text-base w-full">
		<p class="self-stretch my-auto hidden md:block tracking-normal">©2077 Research</p>
		{#each links as link}
			{@render linkComp(link)}
		{/each}
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
