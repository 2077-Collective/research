<script lang="ts">
	import HeadPhones from './icons/HeadPhones.svelte';
	import HomeDoor from './icons/HomeDoor.svelte';
	import PeopleCircle from './icons/PeopleCircle.svelte';
	import ShareArrow from './icons/ShareArrow.svelte';
	import TextSize from './icons/TextSize.svelte';

	import * as Tooltip from '$lib/components/ui/tooltip';

	let { isLoggedIn, onNotSignedInListenClick, onReadCustomizeClick, onAccountClick } = $props();
</script>

<div
	class="w-12 p-3 rounded-2xl border border-[#333] bg-[#19191b] flex items-center flex-col gap-5 text-neutral-60"
>
	<Tooltip.Root openDelay={5}>
		<Tooltip.Trigger class="hover:text-white transition">
			<a href="/">
				<span>
					<HomeDoor />
				</span></a
			>
		</Tooltip.Trigger>

		<Tooltip.Content
			side="left"
			sideOffset={28}
			class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
		>
			<p>Back to homepage</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root openDelay={5}>
		<Tooltip.Trigger class="hover:text-white transition">
			<span>
				<HeadPhones />
			</span>
		</Tooltip.Trigger>

		<Tooltip.Content
			side="left"
			sideOffset={28}
			class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
		>
			<p>Listen to this article</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root openDelay={5}>
		<Tooltip.Trigger class="hover:text-white transition">
			<span>
				<TextSize />
			</span>
		</Tooltip.Trigger>

		<Tooltip.Content
			side="left"
			sideOffset={28}
			class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
		>
			<p>Customize text size, font, and theme</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root openDelay={5}>
		<Tooltip.Trigger class="hover:text-white transition">
			<span>
				<ShareArrow />
			</span>
		</Tooltip.Trigger>

		<Tooltip.Content
			side="left"
			sideOffset={28}
			class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
		>
			<p>Share this article</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root openDelay={5}>
		<Tooltip.Trigger class="hover:text-white transition">
			<span>
				<PeopleCircle />
			</span>
		</Tooltip.Trigger>

		<Tooltip.Content
			side="left"
			sideOffset={28}
			class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
		>
			<p>Sign in to save and personalize</p>
		</Tooltip.Content>
	</Tooltip.Root>
</div>
