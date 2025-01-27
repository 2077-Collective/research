import { type VariantProps, tv } from 'tailwind-variants';
export { default as Badge } from './badge.svelte';

export const badgeVariants = tv({
	base: 'hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black focus:ring-ring inline-flex select-none items-center rounded-full dark:border-white border px-2 py-0.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
			destructive:
				'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
			outline: 'text-foreground',
			rectangular: 'rounded-none border-t-0 border-r-0 ',
			rectangularFull: 'rounded-none border-2 hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black',
			rectangularFilled: 'rounded-none border-2 bg-white text-black hover:bg-black hover:text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white',
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof badgeVariants>['variant'];
