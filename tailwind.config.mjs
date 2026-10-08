/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        chalk: '#FBFAF7',
        paper: '#F2ECE1',
        sand: '#EFE7DA',
        linen: '#E8DFD3',
        ink: '#1C1917',
        graphite: '#16130F',
        aubergine: '#211A26',
        aubergine2: '#2E2434',
        smoke: '#57534E',
        stone: '#8A837B',
        wood: '#8C5E3C',
        brass: '#A67C52',
        bronze: '#B08D57',
        moss: '#4A5240',
        ember: '#E86A2C',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Fraunces', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
    },
  },
  plugins: [],
};
