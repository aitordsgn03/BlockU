# Klotski Game

Este proyecto es una implementación de un juego tipo Klotski desarrollado con React y TypeScript. El objetivo del juego es mover los bloques dentro de un tablero hasta liberar el bloque principal.

## Características

- **Diseño interactivo:** Permite mover los bloques arrastrándolos o utilizando el teclado.
- **Tableros predefinidos:** Se cargan puzzles de dificultad variable desde una API o datos locales.
- **Interfaz personalizable:** Colores y estilos pueden modificarse fácilmente desde variables.
- **Contador de movimientos:** Rastrea los movimientos realizados por el jugador.

## Tecnologías utilizadas

- React
- TypeScript
- pnpm
- Tailwind CSS
- Fontsource (para las fuentes tipográficas)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone [https://github.com/tu_usuario/klotski-game.git](https://github.com/aitordsgn03/BlockU.git)
   cd BlockU
   ```

2. Instala las dependencias usando pnpm:

   ```bash
   pnpm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

4. Abre tu navegador y accede a `http://localhost:5173` para jugar.

## Personalización

### Cambiar colores de los bloques
Los colores de los bloques se definen en las siguientes variables dentro del código:

```tsx
const blockColors = {
  primary: '#EBAEBC', // Bloque principal
  vertical: '#CBBFCF',
  horizontal: '#C3DEEB',
  single: '#FFE5BA',
  default: '#FFFFFF',
};
```

Modifica estas variables para cambiar la apariencia del juego.

### Fuentes
El proyecto utiliza la fuente "Inter Variable" proporcionada por Fontsource. Para cambiar o personalizar la tipografía:

1. Edita el archivo principal de estilos (generalmente `src/index.css` o `App.tsx`) para cargar la fuente.

   ```tsx
   import '@fontsource-variable/inter';
   ```

2. Configura el estilo global o utiliza clases de Tailwind CSS.

## Problemas conocidos

- **CORS:** Si utilizas una API remota, asegúrate de habilitar el acceso desde el navegador.
- **Movimientos:** Actualmente, los movimientos pueden contar aunque no se haya realizado un desplazamiento.

## Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).

