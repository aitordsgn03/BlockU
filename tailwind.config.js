import animations from '@midudev/tailwind-animations'

export default {
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

        // Bloques
        bloqueA: "#FFA69E", // Bloque rojo para la ficha objetivo
        bloqueB: "#AECBFA", // Bloque azul claro para 2x1
        bloqueC: "#BDEDB8", // Bloque verde pastel para 1x2
        bloqueD: "#FFD9B3", // Bloque naranja pastel para 3x1
        bloqueE: "#333333", // Bloque gris oscuro para 1x1
        bloqueF: "#96DED1", // Bloque azul intenso para 1x3
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Fuente principal
      },
    },
  },
  plugins: [animations],
}