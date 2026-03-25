/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        sand: '#d6c7b2',
        mist: '#f5f3ef',
        stone: '#6b6b6b',
        line: '#e8e2d8',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(17, 17, 17, 0.08)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top, rgba(214, 199, 178, 0.35), transparent 42%)',
      },
    },
  },
  plugins: [],
}
