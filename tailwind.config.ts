import type { Config } from 'tailwindcss'

/**
 * Modern SaaS Design System for 2025
 * 
 * Color Palette:
 * - Primary: Vibrant purple (#8B5CF6) - main brand color
 * - Accent: Bright blue (#0EA5E9) - call-to-action and highlights
 * - Success: Green (#16A34A) - positive actions
 * - Warning: Amber (#F59E0B) - warnings and alerts
 * - Info: Cyan (#0891B2) - informational messages
 * 
 * Features:
 * - Gradient backgrounds for modern visual appeal
 * - Glass morphism effects (backdrop-blur)
 * - Smooth animations and transitions
 * - Rounded corners (0.75rem) for modern look
 * - Shadow system for depth
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(220 13% 91%)',
        input: 'hsl(220 13% 91%)',
        ring: 'hsl(262 83% 58%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 47% 11%)',

        primary: {
          DEFAULT: 'hsl(262 83% 58%)',
          foreground: 'hsl(0 0% 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(220 14% 96%)',
          foreground: 'hsl(222 47% 11%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: 'hsl(0 0% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(220 14% 96%)',
          foreground: 'hsl(220 9% 46%)',
        },
        accent: {
          DEFAULT: 'hsl(210 100% 50%)',
          foreground: 'hsl(0 0% 100%)',
        },
        success: {
          DEFAULT: 'hsl(142 76% 36%)',
          foreground: 'hsl(0 0% 100%)',
        },
        warning: {
          DEFAULT: 'hsl(38 92% 50%)',
          foreground: 'hsl(0 0% 100%)',
        },
        info: {
          DEFAULT: 'hsl(199 89% 48%)',
          foreground: 'hsl(0 0% 100%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222 47% 11%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222 47% 11%)',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(217 91% 60%) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, hsl(210 100% 50%) 0%, hsl(262 83% 58%) 100%)',
        'gradient-success': 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(158 64% 52%) 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config


