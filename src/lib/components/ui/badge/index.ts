import { type VariantProps, tv } from 'tailwind-variants';
export { default as Badge } from './badge.svelte';

export const badgeVariants = tv({
	base: 'hover:bg-input focus:ring-ring inline-flex select-none items-center rounded-full dark:border-white border px-4 py-0.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
			destructive:
				'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
			outline: 'text-foreground'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof badgeVariants>['variant'];
