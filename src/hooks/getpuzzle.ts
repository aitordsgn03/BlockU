import { useState, useEffect } from 'react';

interface PuzzleData {
    id: number;
    movimientos: number;
    puzzle: string;
    clustersize: number;
}

// Cache estático para almacenar los puzzles
const puzzleCache: Record<number, PuzzleData> = {};

export const usePuzzle = (puzzleId: number) => {
    const [level, setPuzzle] = useState<PuzzleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPuzzle = async () => {
            try {
                // Verificar si el puzzle ya está en caché
                if (puzzleCache[puzzleId]) {
                    setPuzzle(puzzleCache[puzzleId]);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const response = await fetch(`https://aitordsgnapi.onrender.com/puzzle/${puzzleId}`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener el puzzle');
                }
                const data = await response.json();
                
                // Guardar en caché antes de actualizar el estado
                puzzleCache[puzzleId] = data;
                
                setPuzzle(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchPuzzle();
    }, [puzzleId]);

    return { level, loading, error };
};