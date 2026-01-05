import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0b1118',
          darker: '#070a0f',
          blue: '#3ecbff',
          purple: '#7c6cff',
          pink: '#ff4f7a',
          green: '#39ffb0',
          yellow: '#f5c542',
        },
        neon: {
          cyan: '#00e5ff',
          purple: '#7c6cff',
          pink: '#ff4f7a',
          blue: '#3ecbff',
          green: '#39ffb0',
        },
      },
      fontFamily: {
        cyber: ['Oxanium', 'Share Tech Mono', 'sans-serif'],
        mono: ['Share Tech Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 16px rgba(0, 229, 255, 0.35)',
        'neon-purple': '0 0 16px rgba(124, 108, 255, 0.35)',
        'neon-pink': '0 0 16px rgba(255, 79, 122, 0.35)',
        'glass': '0 12px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px currentColor)' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 20px currentColor)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}
export default config
