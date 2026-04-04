import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:    'rgb(var(--color-primary-rgb) / <alpha-value>)',
          yellow: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
          dark:   'rgb(var(--color-secondary-rgb) / <alpha-value>)',
          darker: 'rgb(var(--color-darker-rgb) / <alpha-value>)',
          mid:    'rgb(var(--color-mid-rgb) / <alpha-value>)',
          light:  'rgb(var(--color-light-rgb) / <alpha-value>)',
        }
      },
    },
  },
  plugins: [],
} satisfies Config
