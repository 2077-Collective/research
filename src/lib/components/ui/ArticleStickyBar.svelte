<script lang="ts">
	import HomeDoor from './icons/HomeDoor.svelte';
	import PeopleCircle from './icons/PeopleCircle.svelte';
	import ShareArrow from './icons/ShareArrow.svelte';
	import TextSize from './icons/TextSize.svelte';

	import * as Popover from '$lib/components/ui/popover';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils/ui-components';
	import AudioListen from './AudioListen.svelte';
	import HeadPhones from './icons/HeadPhones.svelte';

	import ReadingCustomize from './ReadingCustomize.svelte';

	let {
		isLoggedIn,
		onNotSignedInListenClick,
		onNotSignedInReadCustomizeClick,
		onAccountClick,
		articleAudioUrl,
		shareOptions
	} = $props();

	let isOpenCustomizeOpen = $state(false);
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
		<Tooltip.Trigger
			class={cn('transition', (articleAudioUrl || !isLoggedIn) && 'hover:text-white')}
			onclick={() => !isLoggedIn && onNotSignedInListenClick()}
		>
			{#if !isLoggedIn}
				<span>
					<HeadPhones />
				</span>
			{:else}
				<AudioListen
					{articleAudioUrl}
					isLoading={false}
					hideLabel
					className={'[&_svg]:size-6'}
					align={'start'}
					side="left"
					sideOffset={2}
					alignOffset={-10}
				/>
			{/if}
		</Tooltip.Trigger>

		<Tooltip.Content
			side="left"
			sideOffset={16}
			class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
		>
			<p>Listen to this article</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root openDelay={5}>
		<Tooltip.Trigger
			class="hover:text-white transition"
			onclick={() => !isLoggedIn && onNotSignedInReadCustomizeClick()}
		>
			{#if !isLoggedIn}
				<span>
					<TextSize />
				</span>
			{:else}
				<span
					role="button"
					tabindex="0"
					class="relative block"
					onmouseover={() => (isOpenCustomizeOpen = true)}
					onfocus={() => (isOpenCustomizeOpen = true)}
					onmouseleave={() => (isOpenCustomizeOpen = false)}
					onblur={() => (isOpenCustomizeOpen = false)}
				>
					<TextSize />

					<div
						class={cn(
							'absolute top-full right-0 w-[400px] p-4 bg-[#19191A] shadow-lg rounded-[8px] border border-neutral-80 opacity-0 -z-[9999] pointer-events-none transition',
							isOpenCustomizeOpen && 'z-[9999] opacity-100 pointer-events-auto'
						)}
					>
						<ReadingCustomize
							open
							onClose={() => (isOpenCustomizeOpen = false)}
							className="relative p-0 w-full text-left"
							hideContainer
						/>
					</div>
				</span>
			{/if}
		</Tooltip.Trigger>

		{#if !isLoggedIn}
			<Tooltip.Content
				side="left"
				sideOffset={28}
				class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
			>
				<p>Customize text size, font, and theme</p>
			</Tooltip.Content>
		{/if}
	</Tooltip.Root>

	<Tooltip.Root openDelay={5}>
		<Tooltip.Trigger class="hover:text-white transition">
			<Popover.Root>
				<Popover.Trigger>
					<span>
						<ShareArrow />
					</span>
				</Popover.Trigger>
				<Popover.Content
					class="p-0 rounded-none border-none w-40 bg-backgroundLighter shadow-lg font-mono"
					align="start">{@render shareOptions()}</Popover.Content
				>
			</Popover.Root>
		</Tooltip.Trigger>

		<Tooltip.Content
			side="left"
			sideOffset={28}
			class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
		>
			<p>Share this article</p>
		</Tooltip.Content>
	</Tooltip.Root>

	{#if !isLoggedIn}
		<Tooltip.Root openDelay={5}>
			<Tooltip.Trigger class="hover:text-white transition" onclick={onAccountClick}>
				{#if !isLoggedIn}
					<a href="/signin">
						<span>
							<PeopleCircle />
						</span></a
					>
				{:else}
					<div class="size-5 bg-[#0CDEE9] rounded-full"></div>
				{/if}
			</Tooltip.Trigger>

			{#if !isLoggedIn}
				<Tooltip.Content
					side="left"
					sideOffset={28}
					class="bg-[#19191b] border-0 text-sm text-neutral-20 font-mono max-w-[160px] px-2.5 py-1.5"
				>
					<p>Sign in to save and personalize</p>
				</Tooltip.Content>
			{/if}
		</Tooltip.Root>
	{/if}
</div>
