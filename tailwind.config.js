/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          primary: '#0A0A0A',
          charcoal: '#1A1A1A',
          dark: '#121212',
          muted: '#666666',
          border: '#E5E0DA',
          accent: '#D4AF37', // Elegant champagne/gold accent
          beige: '#EFECE6',
          beigeDark: '#D8CFC4',
          warmWhite: '#FAF9F6',
          cream: '#F4F1EA',
          meesho: '#F43397', // Meesho signature brand pink for the button
          meeshoHover: '#D81E7E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
