import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Nunito', 'system-ui', 'sans-serif'],
				display: ['Quicksand', 'system-ui', 'sans-serif'],
				heading: ['Quicksand', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				canvas: {
					block: 'hsl(var(--canvas-block))',
					'block-hover': 'hsl(var(--canvas-block-hover))',
					grid: 'hsl(var(--canvas-grid))',
					'toolbar-bg': 'hsl(var(--canvas-toolbar-bg))',
					'selection': 'hsl(var(--canvas-selection))',
					'ai-suggestion': 'hsl(var(--canvas-ai-suggestion))',
				},
				sea: {
					DEFAULT: '#0EA5E9',  // Ocean Blue
					light: '#33C3F0',   // Sky Blue
					bright: '#1EAEDB',  // Bright Blue
					dark: '#0C87BD',    // Darker Ocean Blue
					pale: '#D3E4FD',    // Soft Blue
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float-in': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
				'float-in': 'float-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
				'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
				'slide-out-right': 'slide-out-right 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-canvas': 'linear-gradient(to right bottom, hsl(195, 100%, 97%), hsl(200, 100%, 96%))',
				'gradient-toolbar': 'linear-gradient(to right, hsl(195, 100%, 97%), hsl(200, 100%, 95%))',
				'gradient-ai-panel': 'linear-gradient(to bottom, hsl(195, 70%, 98%), hsl(200, 70%, 95%))',
				'gradient-block': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
				'gradient-block-hover': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
				'sea-gradient': 'linear-gradient(135deg, #0EA5E9, #0C87BD)',
				'sea-light-gradient': 'linear-gradient(135deg, #33C3F0, #0EA5E9)',
			},
			boxShadow: {
				'soft': '0 5px 15px rgba(0, 0, 0, 0.05)',
				'glow': '0 0 15px rgba(14, 165, 233, 0.3)',
				'button': '0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -1px rgba(14, 165, 233, 0.1)',
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '65ch',
						color: 'hsl(var(--foreground))',
						'[class~="lead"]': {
							color: 'hsl(var(--foreground))',
						},
						a: {
							color: 'hsl(var(--primary))',
							textDecoration: 'underline',
							fontWeight: '500',
						},
						strong: {
							color: 'hsl(var(--foreground))',
							fontWeight: '600',
						},
						h1: {
							color: 'hsl(var(--foreground))',
							fontWeight: '800',
							fontFamily: 'Quicksand, system-ui, sans-serif',
						},
						h2: {
							color: 'hsl(var(--foreground))',
							fontWeight: '700',
							fontFamily: 'Quicksand, system-ui, sans-serif',
						},
						h3: {
							color: 'hsl(var(--foreground))',
							fontWeight: '600',
							fontFamily: 'Quicksand, system-ui, sans-serif',
						},
						h4: {
							color: 'hsl(var(--foreground))',
							fontWeight: '600',
							fontFamily: 'Quicksand, system-ui, sans-serif',
						},
					},
				},
			},
			textShadow: {
				sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
				DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.05)',
				lg: '0 8px 16px rgba(0, 0, 0, 0.05)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
