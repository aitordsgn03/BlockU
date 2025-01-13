import animations from '@midudev/tailwind-animations'

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
			background: "#FAF9F6", // Fondo principal de la página
			backgroundLowContrast: "#E0E0E0", // Fondo bajo contraste (Tablero)
			foreground: "#333333", // Texto principal
			foregroundLowContrast: "#666666", // Texto secundario
			foregroundHighContrast: "#161616", // Texto alto contraste
			primary: "#FFA69E", // Botón principal o resaltado
			primaryHover: "#FFBDB5", // Botón principal en hover
			primaryDark: "#FF8B81", // Botón principal oscuro
			secondary: "#AECBFA", // Botón secundario o fondo destacado
			secondaryHover: "#C6E0FF", // Botón secundario en hover
			border: "#E0E0E0", // Bordes y divisores
			borderLowContrast: "#F7F7F7", // Bordes bajos contraste
			borderHighContrast: "#ACACAC", // Bordes altos contraste
  			backgroundLowContrast: '#E0E0E0',
  			foregroundLowContrast: '#666666',
  			foregroundHighContrast: '#161616',
  			primaryHover: '#FFBDB5',
  			primaryDark: '#FF8B81',
  			secondaryHover: '#C6E0FF',
  			borderLowContrast: '#F7F7F7',
  			borderHighContrast: '#ACACAC',
  			bloqueA: '#FFA69E',
  			bloqueB: '#AECBFA',
  			bloqueC: '#BDEDB8',
  			bloqueD: '#FFD9B3',
  			bloqueE: '#333333',
  			bloqueF: '#96DED1',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [animations, require("tailwindcss-animate")],
}