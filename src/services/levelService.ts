// src/services/levelService.ts
interface LevelData {
  level: string;
  timestamp: number;
}

class LevelService {
  private cachedLevels: string[] | null = null;
  private cachedDailyLevel: LevelData | null = null;

  private getDailyIndex(totalLevels: number): number {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash) % totalLevels;
  }

  private async loadLevels(): Promise<string[]> {
    if (this.cachedLevels) {
      return this.cachedLevels;
    }

    try {
      const response = await fetch('/levels.txt');
      if (!response.ok) {
        throw new Error(`Error al cargar el archivo: ${response.statusText}`);
      }

      const text = await response.text();
      // Maneja tanto \n como \r\n para compatibilidad
      const levels = text.trim().split(/\r?\n/);
      
      if (levels.length === 0) {
        throw new Error('El archivo de niveles está vacío');
      }

      this.cachedLevels = levels;
      return levels;
    } catch (error) {
      console.error('Error cargando niveles:', error);
      throw error;
    }
  }

  async getDailyLevel(): Promise<LevelData> {
    // Verificar cache diario
    if (this.cachedDailyLevel) {
      const cachedDate = new Date(this.cachedDailyLevel.timestamp).toDateString();
      const today = new Date().toDateString();
      if (cachedDate === today) {
        return this.cachedDailyLevel;
      }
    }

    try {
      const levels = await this.loadLevels();
      const index = this.getDailyIndex(levels.length);
      const levelData: LevelData = {
        level: levels[index],
        timestamp: Date.now()
      };
      
      this.cachedDailyLevel = levelData;
      return levelData;
    } catch (error) {
      console.error('Error obteniendo nivel diario:', error);
      throw error;
    }
  }
}

export default new LevelService();