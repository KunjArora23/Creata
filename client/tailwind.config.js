export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0D1117',
        surface: '#161B22',
        elevated: '#1F2937',
        border: '#30363D',
        primary: '#F2F3F5',
        secondary: '#AAB1B8',
        muted: '#6B7280',
        accent: '#6366F1',
        'accent-hover': '#4F46E5',
        success: '#22C55E',
        error: '#EF4444',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        elevated: '0 4px 24px 0 rgba(99,102,241,0.08)',
      }
    }
  },
  plugins: [],
} 