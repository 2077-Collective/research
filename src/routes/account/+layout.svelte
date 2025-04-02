<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils/ui-components';
	import { Home, UserCheck } from 'lucide-svelte';

	const { children } = $props();

	const LINKS = [
		{
			label: 'Home',
			icon: Home,
			href: '/account'
		},
		{
			label: 'Following',
			icon: UserCheck,
			href: '/account/following'
		}
	];
</script>

{@render children()}

<div
	class="bg-[#1A1A1B] border border-[#262626] fixed bottom-8 left-1/2 -translate-x-1/2 p-1.5 rounded-[100px] z-[9999999] flex items-center gap-4 text-sm"
>
	{#each LINKS as link}
		{@const isActive = $page.url.pathname === link.href}
		<a href={link.href}>
			<button
				class={cn(
					'pl-4 pr-5 py-2.5 flex items-center gap-2 rounded-[50px] overflow-hidden text-[#858585] hover:text-neutral-40 transition',
					isActive && 'bg-white text-neutral-80 hover:text-neutral-80 font-bold'
				)}
			>
				<link.icon class="size-5" />
				{link.label}
			</button>
		</a>
	{/each}
</div>
