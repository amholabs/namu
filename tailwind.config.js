module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /(dark|light|)bg-(red|green|blue|orange|purple|indigo|yellow|gray)-(100|200|500|700)/,
      variants: ['lg', 'hover', 'focus', 'lg:hover', 'dark'],
    },
    {
      pattern: /(dark|light|)text-(red|green|blue|orange|purple|indigo|yellow|gray)-(100|200|500|700)/,
      variants: ['lg', 'hover', 'focus', 'lg:hover', 'dark'],
    },
  ],
  theme: {
    fontSize: {
      '2xs': '0.65rem',
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.7rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5.5rem',
      '8xl': '6.8rem',
      '9xl': '4rem',
    },
    extend: {
      colors: {
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        blue: {
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
          800: '#2c5282',
          900: '#2a4365',
        },
      },
    },
  },
  plugins: [],
}
