/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vault: {
          bg: '#080C14',
          card: '#0F172A',
          panel: '#162032',
          border: '#1E293B',
          muted: '#64748B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          indigo: '#6366F1',
          violet: '#8B5CF6',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.3)'
      }
    },
  },
  plugins: [],
}
