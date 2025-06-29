/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Linear-inspired color palette
        primary: '#0052CC',
        'primary-dark': '#0043A3',
        'bg-primary': '#FAFBFC',
        'bg-secondary': '#FFFFFF',
        'text-primary': '#172B4D',
        'text-secondary': '#5E6C84',
        'border-color': '#DFE1E6',
        'todo': '#DFE1E6',
        'inprogress': '#0052CC',
        'done': '#00875A',
        
        // Extended color system for Linear-like design
        gray: {
          50: '#FAFBFC',
          100: '#F4F5F7',
          200: '#E4E6EA',
          300: '#C1C7D0',
          400: '#97A0AF',
          500: '#6B778C',
          600: '#5E6C84',
          700: '#505F79',
          800: '#42526E',
          900: '#253858',
        },
        blue: {
          50: '#DEEBFF',
          100: '#B3D4FF',
          200: '#4C9AFF',
          300: '#2684FF',
          400: '#0065FF',
          500: '#0052CC',
          600: '#0043A3',
          700: '#003884',
          800: '#002E69',
          900: '#002654',
        },
        emerald: {
          50: '#E3FCEF',
          100: '#ABF5D1',
          200: '#79F2C0',
          300: '#57D9A3',
          400: '#36B37E',
          500: '#00875A',
          600: '#006644',
          700: '#005A32',
          800: '#004B27',
          900: '#003D1F',
        },
        red: {
          50: '#FFEBE6',
          100: '#FFBDAD',
          200: '#FF8F73',
          300: '#FF7452',
          400: '#FF5630',
          500: '#DE350B',
          600: '#BF2600',
          700: '#A32000',
          800: '#8B1A00',
          900: '#7A1712',
        },
        amber: {
          50: '#FFFAE6',
          100: '#FFF0B3',
          200: '#FFE380',
          300: '#FFC400',
          400: '#FFAB00',
          500: '#FF991F',
          600: '#FF8B00',
          700: '#FF7A00',
          800: '#FF6900',
          900: '#E65100',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'bounce-subtle': 'bounce 0.6s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'gradient': 'gradient 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        'dot-pattern': 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
        'dots': '20px 20px',
      }
    },
  },
  plugins: [],
}