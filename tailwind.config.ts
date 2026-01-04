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
          dark: '#0a0e27',
          darker: '#050816',
          blue: '#00d4ff',
          purple: '#9d4edd',
          pink: '#ff006e',
          green: '#00ff9f',
          yellow: '#ffbe0b',
        },
        neon: {
          cyan: '#00f0ff',
          purple: '#9d00ff',
          pink: '#ff00ff',
          blue: '#0066ff',
          green: '#00ff88',
        },
      },
      fontFamily: {
        cyber: ['Orbitron', 'monospace', 'sans-serif'],
        mono: ['Share Tech Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
        'neon-purple': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 30px #9d00ff',
        'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'glass': '0 8px 32px 0 rgba(0, 240, 255, 0.1)',
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
