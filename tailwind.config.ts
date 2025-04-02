
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
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.7', transform: 'scale(1.05)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				},
				'glow': {
					'0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' },
					'50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'breathe': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.03)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '0.7' },
					'100%': { transform: 'scale(1)', opacity: '0' }
				},
				'touch-response': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.97)' },
					'100%': { transform: 'scale(1)' }
				},
				'button-ripple': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
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
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'glow': 'glow 2.5s ease-in-out infinite',
				'shimmer': 'shimmer 3s ease-in-out infinite',
				'breathe': 'breathe 4s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'ripple': 'ripple 0.6s linear',
				'touch-response': 'touch-response 0.3s ease-out',
				'button-ripple': 'button-ripple 0.7s ease-out forwards'
			},
			backgroundImage: {
				'gradient-canvas': 'linear-gradient(to right bottom, hsl(210, 100%, 98%), hsl(220, 100%, 97%))',
				'gradient-toolbar': 'linear-gradient(to right, hsl(210, 100%, 97%), hsl(220, 100%, 95%))',
				'gradient-ai-panel': 'linear-gradient(to bottom, hsl(210, 60%, 98%), hsl(220, 60%, 95%))',
				'gradient-block': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
				'gradient-block-hover': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
				'gradient-game': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
				'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
				'glow-gradient': 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
