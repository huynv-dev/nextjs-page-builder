import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b97e3', // Màu xanh dương của floating toolbar
          light: 'rgba(59, 151, 227, 0.2)',
          medium: 'rgba(59, 151, 227, 0.4)',
        },
      },
    },
  },
  plugins: [],
}
export default config
