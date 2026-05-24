import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: {
          DEFAULT: 'hsl(var(--background) / <alpha-value>)',
          subtle: 'hsl(var(--background-subtle) / <alpha-value>)',
          muted: 'hsl(var(--background-muted) / <alpha-value>)',
          elevated: 'hsl(var(--background-elevated) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground) / <alpha-value>)',
          muted: 'hsl(var(--foreground-muted) / <alpha-value>)',
          subtle: 'hsl(var(--foreground-subtle) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'hsl(var(--border) / <alpha-value>)',
          muted: 'hsl(var(--border-muted) / <alpha-value>)',
          focus: 'hsl(var(--border-focus) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
          muted: 'hsl(var(--accent-muted) / <alpha-value>)',
          subtle: 'hsl(var(--accent-subtle) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
          muted: 'hsl(var(--success-muted) / <alpha-value>)',
          subtle: 'hsl(var(--success-subtle) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'hsl(var(--error) / <alpha-value>)',
          foreground: 'hsl(var(--error-foreground) / <alpha-value>)',
          muted: 'hsl(var(--error-muted) / <alpha-value>)',
          subtle: 'hsl(var(--error-subtle) / <alpha-value>)',
        },
        purple: {
          DEFAULT: 'hsl(var(--purple) / <alpha-value>)',
          foreground: 'hsl(var(--purple-foreground) / <alpha-value>)',
          muted: 'hsl(var(--purple-muted) / <alpha-value>)',
          subtle: 'hsl(var(--purple-subtle) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
