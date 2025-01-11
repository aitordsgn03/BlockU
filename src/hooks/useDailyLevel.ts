// src/hooks/useDailyLevel.ts
import { useState, useEffect } from 'react';
import levelService from '../services/levelService';

interface UseDailyLevelResult {
  level: string | null;
  loading: boolean;
  error: string | null;
}

export function useDailyLevel(): UseDailyLevelResult {
  const [level, setLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true)
    const fetchLevel = async () => {
      try {
        const data = await levelService.getDailyLevel();
        if (mounted) {
          setLevel(data.level);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Error al cargar el nivel diario');
          setLoading(false);
        }
      }
    };

    fetchLevel();

    return () => {
      mounted = false;
    };
  }, []);

  return { level, loading, error };
}