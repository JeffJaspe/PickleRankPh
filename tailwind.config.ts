import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { red:'#FF4655', yellow:'#ECE8D9', dark:'#0F1923', darker:'#0A1016', mid:'#1F2731', light:'#2A3441' }
      },
    },
  },
  plugins: [],
} satisfies Config
