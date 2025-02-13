<script lang="ts">
	import { cn } from '$lib/utils/ui-components.js';
	import { Dialog as DialogPrimitive } from 'bits-ui';

	type $$Props = DialogPrimitive.TitleProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Title
	class={cn('text-lg font-semibold leading-none tracking-tight', className)}
	data-testid="dialog-title"
	{...$$restProps}
>
	<slot />
</DialogPrimitive.Title>
