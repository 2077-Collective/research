<script lang="ts">
	import { cn, flyAndScale } from '$lib/utils/ui-components.js';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import * as Dialog from './index.js';

	type $$Props = DialogPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 200
	};
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			'bg-background fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg sm:rounded-lg md:w-full',
			className
		)}
		role="dialog"
		aria-modal="true"
		{...$$restProps}
	>
		<slot />
	</DialogPrimitive.Content>
</Dialog.Portal>
