import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: {'min': '350px', 'max': '767px'},
      md: {'min': '768px', 'max': '991px'},
      lg: {'min': '992px', 'max': '1199px'},
      xl: {'min': '1200px'},
    },
    extend: {
      keyframes: {
        playing: {
            '0%': { height: '4px' },
            '50%': { height: '16px' },
            '100%': { height: '4px' },
        },
    },
    }
  },
  plugins: [],
}
export default config