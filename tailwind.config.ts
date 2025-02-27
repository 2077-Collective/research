import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				backgroundLighter: 'hsl(var(--background-lighter) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				subtle: 'hsl(var(--subtle) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				'special-blue': '#07BEBF'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				inter: ['Inter Variable', 'sans-serif'],
				menlo: ['Menlo Regular', 'monospace'],
				soehne: ['Soehne', 'sans-serif'],
				'eb-garamond': ['"EB Garamond"', 'serif'],
				mono: ['Kode Mono Variable', 'monospace'],
				powerGroteskBold: 'var(--font-power)',
				hubot: ['HubotSans', 'sans-serif']
			},
			letterSpacing: {
				tightest: '-.075em',
				tighter: '-.05em',
				tight: '-.025em',
				normal: '0',
				wide: '.025em',
				wider: '.05em',
				widest: '.1em'
			},
			lineHeight: {
				'58': '58px'
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				}
			},
			animation: {
				float: 'float 5s ease-in-out infinite'
			},
			boxShadow: {
				hover: '0px 0px 28px 0px rgba(12, 222, 233, 0.50)'
			}
		}
	},
	plugins: [
		plugin(function ({ addBase, theme }) {
			addBase({
				body: {
					color: theme('colors.black'),
					backgroundColor: theme('colors.white')
				}
			});
		})
	]
};

export default config;
