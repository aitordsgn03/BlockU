import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';


export default defineConfig({
  plugins: [react()],
  publicDir: 'public',  // Asegura que los archivos en public sean servidos
  server: {
    // Evita problemas de CORS al cargar el archivo
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})