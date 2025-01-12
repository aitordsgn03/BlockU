import { useState, useEffect } from 'react';

interface PuzzleData {
    id: number;
    movimientos: number;
    puzzle: string;
    clustersize: number;
    valid_for: string; // Fecha para la que es válido el puzzle
}

interface CacheEntry {
    level: PuzzleData;
    timestamp: number;
}

// Cache estático para almacenar el puzzle del día
let dailyPuzzleCache: CacheEntry | null = null;

// Función para verificar si el caché es válido
const isCacheValid = (cache: CacheEntry): boolean => {
    if (!cache) return false;

    // Obtener la fecha actual y resetear la hora a medianoche
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verificar si el puzzle es válido para hoy
    console.log(today.toISOString().split('T')[0]);
    return cache.level.valid_for === today.toISOString().split('T')[0];
};

export const useDailyPuzzle = () => {
    const [level, setPuzzle] = useState<PuzzleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDailyPuzzle = async () => {
            try {
                // Verificar si tenemos un puzzle cacheado válido
                if (dailyPuzzleCache && isCacheValid(dailyPuzzleCache)) {
                    setPuzzle(dailyPuzzleCache.level);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const response = await fetch('https://aitordsgnapi.onrender.com/puzzle/daily');
                
                if (!response.ok) {
                    throw new Error('No se pudo obtener el puzzle del día');
                }
                
                const data = await response.json();

                // Guardar en caché antes de actualizar el estado
                dailyPuzzleCache = {
                    level: data,
                    timestamp: Date.now(),
                };
                
                setPuzzle(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                // Si hay un error y tenemos caché, podríamos usar el caché aunque esté expirado
                if (dailyPuzzleCache) {
                    setPuzzle(dailyPuzzleCache.level);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDailyPuzzle();
    }, []); // Sin dependencias porque solo necesitamos cargar el puzzle una vez por día


    return { 
        level, 
        loading, 
        error,
    };
};