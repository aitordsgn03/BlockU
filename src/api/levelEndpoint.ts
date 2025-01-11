import { Plugin } from 'vite';
import levelService from '../services/levelService';

export default function levelEndpointPlugin(): Plugin {
  return {
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use('/api/daily-level', async (_req, res) => {
        try {
          const levelData = await levelService.getDailyLevel();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(levelData));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Error al obtener el nivel diario' }));
        }
      });
    }
  };
}