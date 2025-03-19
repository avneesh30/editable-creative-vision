/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        editor: {
          'toolbar': '#f9f9f9',
          'canvas': '#ffffff',
          'panel': '#fcfcfc',
          'border': '#e0e0e0',
          'select': 'rgba(66, 133, 244, 0.3)',
          'hover': 'rgba(66, 133, 244, 0.1)'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out'
      },
      fontFamily: {
        'sans': ['Roboto', 'ui-sans-serif', 'system-ui'],
        'serif': ['Merriweather', 'ui-serif', 'Georgia'],
        'mono': ['ui-monospace', 'SFMono-Regular'],
        'display': ['Playfair Display', 'serif'],
        'body': ['Source Sans 3', 'sans-serif'],
        'abril': ['Abril Fatface', 'cursive'],
        'dancing': ['Dancing Script', 'cursive'],
        'lato': ['Lato', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'alegreya': ['Alegreya', 'serif'],
        'alegreya-sans': ['Alegreya Sans', 'sans-serif'],
        'amatic': ['Amatic SC', 'cursive'],
        'arimo': ['Arimo', 'sans-serif'],
        'arvo': ['Arvo', 'serif'],
        'bitter': ['Bitter', 'serif'],
        'cabin': ['Cabin', 'sans-serif'],
        'comfortaa': ['Comfortaa', 'cursive'],
        'cormorant': ['Cormorant Garamond', 'serif'],
        'crimson': ['Crimson Text', 'serif'],
        'dosis': ['Dosis', 'sans-serif'],
        'encode': ['Encode Sans', 'sans-serif'],
        'exo': ['Exo 2', 'sans-serif'],
        'fira-sans': ['Fira Sans', 'sans-serif'],
        'inconsolata': ['Inconsolata', 'monospace'],
        'josefin-sans': ['Josefin Sans', 'sans-serif'],
        'josefin-slab': ['Josefin Slab', 'serif'],
        'libre-baskerville': ['Libre Baskerville', 'serif'],
        'libre-franklin': ['Libre Franklin', 'sans-serif'],
        'lobster': ['Lobster', 'cursive'],
        'lora': ['Lora', 'serif'],
        'mulish': ['Mulish', 'sans-serif'],
        'nanum': ['Nanum Gothic', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'overpass': ['Overpass', 'sans-serif'],
        'pt-sans': ['PT Sans', 'sans-serif'],
        'pt-sans-narrow': ['PT Sans Narrow', 'sans-serif'],
        'pt-serif': ['PT Serif', 'serif'],
        'pacifico': ['Pacifico', 'cursive'],
        'quicksand': ['Quicksand', 'sans-serif'],
        'roboto-condensed': ['Roboto Condensed', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'roboto-slab': ['Roboto Slab', 'serif'],
        'sacramento': ['Sacramento', 'cursive'],
        'source-code-pro': ['Source Code Pro', 'monospace'],
        'source-serif': ['Source Serif Pro', 'serif'],
        'space-mono': ['Space Mono', 'monospace'],
        'spectral': ['Spectral', 'serif'],
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'ubuntu-mono': ['Ubuntu Mono', 'monospace'],
        'work-sans': ['Work Sans', 'sans-serif'],
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
