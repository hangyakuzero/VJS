/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        sand: '#EFE7DA',
        linen: '#E8DFD3',
        ink: '#1C1917',
        smoke: '#57534E',
        wood: '#8C5E3C',
        brass: '#A67C52',
        moss: '#4A5240',
        ember: '#E86A2C',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
    },
  },
  plugins: [],
};
