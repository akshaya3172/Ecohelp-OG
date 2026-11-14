/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepTeal: {
          DEFAULT: '#174B4A',
          hover: '#133D3C',
          light: '#236564',
          subtle: '#E8F1F0'
        },
        sageMint: {
          DEFAULT: '#B9D9C8',
          hover: '#A6CFBC',
          light: '#DCEEE4',
          dark: '#588870'
        },
        warmSand: {
          DEFAULT: '#F3EBDD',
          hover: '#EAE1CE',
          light: '#FAF6EF',
          dark: '#E0D2BD'
        },
        softTurquoise: {
          DEFAULT: '#65C6C0',
          hover: '#52B4AE',
          light: '#C3ECE9',
          dark: '#2A8782'
        },
        lightOceanBlue: {
          DEFAULT: '#A9DCEB',
          hover: '#95D1E3',
          light: '#E2F4F9',
          dark: '#3A8DA5'
        },
        charcoal: {
          DEFAULT: '#26383B',
          muted: '#526569',
          light: '#7F9397',
          border: '#D3DDD9'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 75, 74, 0.08)',
        'card': '0 2px 12px -1px rgba(23, 75, 74, 0.06), 0 1px 4px 0 rgba(23, 75, 74, 0.04)',
        'elevated': '0 12px 32px -4px rgba(23, 75, 74, 0.12)',
      }
    },
  },
  plugins: [],
}
