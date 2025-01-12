import React, { useState, useRef, useEffect } from 'react';
//import { useDailyLevel } from '../hooks/useDailyLevel';
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { Toaster, toast } from 'sonner';
import VictoryModal from './VictoryModal.tsx';
//import { usePuzzle } from '../hooks/getpuzzle.ts';
import { useDailyPuzzle } from '../hooks/getDailyPuzzle.ts';

interface Position {
    x: number;
    y: number;
}

interface Block {
    id: string;
    width: number;
    height: number;
    position: Position;
}
/*
const localPuzzles = [
    { moves: 1, board: "ooooooooooooAAoooooooooooooooooooooo" },
    { moves: 15, board: "oDBBGHoDoEGHAAoEoICCCFoIoooFoooooooo" },
    { moves: 12, board: "BBooIJooooIJAAooIJFGCCDDFGHoooFGHEEo" },
    { moves: 10, board: "oooIoooooICCxoAAJKooHoJKGoHDDKGEEEFF" },
    { moves: 10, board: "oBBIooooGICCAAGIoJoDDEEJooHFFoooHooo" },
    { moves: 14, board: "xooHCCoooHDDAAoHoIoEEEoIooGooIooGFFo" },
    { moves: 10, board: "ooooxoooGoJKAAGoJKoFHCCCEFHIooEDDIoo" },
    { moves: 18, board: "oJBBLxoJKoLMAAKooMDDooEEooxoGGoHHHII" },
    { moves: 13, board: "BBoooooHoooJoHAAoJCCCDDJoooIEEoxoIGG" },
    { moves: 11, board: "xoHCCKGoHDDKGAAIJKEEoIJooooIxooooooo" },
    { moves: 17, board: "xoCCDDoooooMAAooLMEEFFLMJKGGHHJKoIII" },
    { moves: 14, board: "BBCCoNIDDEENIJAAMNIJFFMoGGKLMoooKLHH" },
    { moves: 13, board: "oooIooBBoIooAAoIooGHCCDDGHEEJoGFFoJo" },
    { moves: 18, board: "BBoKoooJoKCCIJAAoLIDDDoLEEEooxGGGHHo" },
    { moves: 10, board: "oEFGBBDEFGHIDEAAHIoooxoJoooooJoooooo" },
    { moves: 11, board: "HoooooHBBCCoAAoIJoDDDIJoooooxoooxGGG" },
    { moves: 12, board: "GxCCoKGoHDDKAAHIoooooIEEooxJoooooJoo" },
    { moves: 14, board: "xCCCxoJEEELoJoAALoJooKFFGGGKoMHHIIoM" },
    { moves: 12, board: "oooooKooHIJKAAHIJKGBBBCCGooDDDGEEFFF" },
    { moves: 15, board: "BBBooLooJCCLAAJoKooIDDKooIoxFFGGHHHo" },
    { moves: 12, board: "HIoBBoHICCDDAAJoKLEEJoKLooooxooGGooo" },
    { moves: 16, board: "GooxooGooIoJGAAIoJooHCCKooHDDKEEEFFK" }
];*/
const localPuzzles = [
    { moves: 1, board: "ooooooooooooAAoooooooooooooooooooooo" },
]

interface ParsedLevel {
    moves: number;
    board: string;
}

function parseLevelString(levelString: string): ParsedLevel {
    const parts = levelString.trim().split(' ');
    console.log(parts[1]);
    if (parts.length !== 3) {
        throw new Error('Formato de nivel inválido');
    }

    return {
        moves: parseInt(parts[0]),
        board: parts[1],
    };


}

function parseRushHourBoard(boardString: string): { blocks: Block[], walls: Position[] } {
    const blocks: Block[] = [];
    const walls: Position[] = [];
    const seen = new Set<string>();

    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const char = boardString[y * 6 + x];
            const pos = `${x},${y}`;

            if (seen.has(pos)) continue;

            if (char === 'x') {
                walls.push({ x, y });
            } else if (char !== 'o') {
                let width = 1, height = 1;

                while (x + width < 6 && boardString[y * 6 + x + width] === char) {
                    seen.add(`${x + width},${y}`);
                    width++;
                }

                while (y + height < 6 && boardString[(y + height) * 6 + x] === char) {
                    for (let dx = 0; dx < width; dx++) {
                        seen.add(`${x + dx},${y + height}`);
                    }
                    height++;
                }

                blocks.push({
                    id: char,
                    width,
                    height,
                    position: { x, y }
                });
            }
        }
    }

    return { blocks, walls };
}

const KlotskiGame = () => {
    //const { level, loading, error } = useDailyLevel();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [initialBlocks, setInitialBlocks] = useState<Block[]>([]); // Nuevo estado para guardar la posición inicial
    const [walls, setWalls] = useState<Position[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const boardRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef<Position | null>(null);
    const [moveCount, setMoveCount] = useState(0);
    const [requiredMoves, setRequiredMoves] = useState<number | null>(null);
    const [moveInProgress, setMoveInProgress] = useState<boolean>(false);
    const [initialPosition, setInitialPosition] = useState<Position | null>(null);

    const { width, height } = useWindowSize()
    const touchStartPos = useRef<Position | null>(null);

    const [time, setTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { level, loading, error } = useDailyPuzzle();
    //const { level, loading, error } = usePuzzle(puzzleId);


    //#region Manejo de eventos
    //#region Manejo de eventos mouse
    const handleMouseDown = (e: React.MouseEvent, block: Block) => {
        if (hasWon) return; // Prevenir movimientos si ya se ganó

        if (selectedBlock !== block.id) {
            if (initialPosition && !isPositionEqual(initialPosition, block.position)) {
                setMoveCount(prev => prev + 1);
            }
            setInitialPosition(block.position);
            setMoveInProgress(true);
        }

        setSelectedBlock(block.id);
        setIsDragging(true);

        const board = boardRef.current?.getBoundingClientRect();
        if (!board) return;

        dragStartPos.current = {
            x: e.clientX,
            y: e.clientY
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !dragStartPos.current || !selectedBlock || hasWon) return;

        const board = boardRef.current?.getBoundingClientRect();
        if (!board) return;

        const cellSize = board.width / 6;
        const dx = Math.round((e.clientX - dragStartPos.current.x) / cellSize);
        const dy = Math.round((e.clientY - dragStartPos.current.y) / cellSize);

        if (dx !== 0 || dy !== 0) {
            moveBlock(selectedBlock, dx, dy);
            dragStartPos.current = {
                x: e.clientX,
                y: e.clientY
            };
        }
    };

    const handleMouseUp = () => {
        if (moveInProgress) {
            if (initialPosition && !isPositionEqual(initialPosition, blocks.find(b => b.id === selectedBlock)?.position)) {
                setMoveCount(prev => prev + 1);
            }
            setMoveInProgress(false);
        }
        setIsDragging(false);
        dragStartPos.current = null;
    };
    //#endregion
    //#region Manejo de eventos táctiles
    const handleTouchStart = (e: React.TouchEvent, block: Block) => {
        if (hasWon) return;

        if (selectedBlock !== block.id) {
            if (initialPosition && !isPositionEqual(initialPosition, block.position)) {
                setMoveCount(prev => prev + 1);
            }
            setInitialPosition(block.position);
            setMoveInProgress(true);
        }

        setSelectedBlock(block.id);
        setIsDragging(true);

        const touch = e.touches[0];
        touchStartPos.current = {
            x: touch.clientX,
            y: touch.clientY
        };

        // Prevenir el scroll mientras se arrastra
        e.preventDefault();
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !touchStartPos.current || !selectedBlock || hasWon) return;

        const board = boardRef.current?.getBoundingClientRect();
        if (!board) return;

        const touch = e.touches[0];
        const cellSize = board.width / 6;
        const dx = Math.round((touch.clientX - touchStartPos.current.x) / cellSize);
        const dy = Math.round((touch.clientY - touchStartPos.current.y) / cellSize);

        if (dx !== 0 || dy !== 0) {
            moveBlock(selectedBlock, dx, dy);
            touchStartPos.current = {
                x: touch.clientX,
                y: touch.clientY
            };
        }

        // Prevenir el scroll mientras se arrastra
        e.preventDefault();
    };

    const handleTouchEnd = () => {
        if (moveInProgress) {
            if (initialPosition && !isPositionEqual(initialPosition, blocks.find(b => b.id === selectedBlock)?.position)) {
                setMoveCount(prev => prev + 1);
            }
            setMoveInProgress(false);
        }
        setIsDragging(false);
        touchStartPos.current = null;
    };
    //#endregion
    //#endregion



    // Función para formatear el tiempo
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    useEffect(() => {
        if (level) {
            try {
                // Crear el string del nivel en el formato que espera tu parseLevel
                const levelString = `${level.movimientos} ${level.puzzle} ${level.clustersize}`;
                const parsedLevel = parseLevelString(levelString);
                const { blocks: newBlocks, walls: newWalls } = parseRushHourBoard(parsedLevel.board);
                setBlocks(newBlocks);
                setInitialBlocks(JSON.parse(JSON.stringify(newBlocks)));
                setWalls(newWalls);
                setRequiredMoves(parsedLevel.moves);
                setHasWon(false);
                setMoveCount(0);
            } catch (e) {
                console.error("Error parsing board:", e);
                // Tu lógica de fallback con puzzles locales
                const randomIndex = Math.floor(Math.random() * localPuzzles.length);
                const { blocks: fallbackBlocks, walls: fallbackWalls } = parseRushHourBoard(localPuzzles[randomIndex].board);
                setBlocks(fallbackBlocks);
                setInitialBlocks(JSON.parse(JSON.stringify(fallbackBlocks)));
                setWalls(fallbackWalls);
                setRequiredMoves(localPuzzles[randomIndex].moves);
            }
        }
    }, [level]);




    // Actualizar los event listeners
    React.useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);


    // Actualizar el puzzle cuando se cambia de nivel
    /*
    useEffect(() => {
        if (level) {
            try {
                const parsedLevel = parseLevelString(level);
                const { blocks: newBlocks, walls: newWalls } = parseRushHourBoard(parsedLevel.board);
                setBlocks(newBlocks);
                setInitialBlocks(JSON.parse(JSON.stringify(newBlocks))); // Guardar copia profunda del estado inicial
                setWalls(newWalls);
                setRequiredMoves(parsedLevel.moves);
                setHasWon(false);
                setMoveCount(0);
            } catch (e) {
                console.error("Error parsing board:", e);
                const randomIndex = Math.floor(Math.random() * localPuzzles.length);
                const { blocks: fallbackBlocks, walls: fallbackWalls } = parseRushHourBoard(localPuzzles[randomIndex].board);
                setBlocks(fallbackBlocks);
                setInitialBlocks(JSON.parse(JSON.stringify(fallbackBlocks)));
                setWalls(fallbackWalls);
                setRequiredMoves(localPuzzles[randomIndex].moves);
            }
        }
    }, [level]);
*/

    //#region Movimientos
    //Checkear si el movimiento es válido
    const isValidMove = (block: Block, newX: number, newY: number): boolean => {
        const deltaX = Math.abs(newX - block.position.x);
        const deltaY = Math.abs(newY - block.position.y);

        if (block.width > block.height && deltaY !== 0) return false;
        if (block.height > block.width && deltaX !== 0) return false;

        if (newX < 0 || newY < 0 || newX + block.width > 6 || newY + block.height > 6) {
            return false;
        }

        const hasWallCollision = walls.some(wall =>
            newX <= wall.x && newX + block.width > wall.x &&
            newY <= wall.y && newY + block.height > wall.y
        );
        if (hasWallCollision) return false;

        return !blocks.some(other => {
            if (other.id === block.id) return false;

            const overlap = !(
                newX + block.width <= other.position.x ||
                newX >= other.position.x + other.width ||
                newY + block.height <= other.position.y ||
                newY >= other.position.y + other.height
            );

            return overlap;
        });
    };

    const moveBlock = (blockId: string, dx: number, dy: number) => {
        setBlocks(prevBlocks => {
            const newBlocks = [...prevBlocks];
            const blockIndex = newBlocks.findIndex(b => b.id === blockId);
            const block = newBlocks[blockIndex];

            const moveX = block.width > block.height ? dx : 0;
            const moveY = block.height > block.width ? dy : 0;

            const newX = block.position.x + moveX;
            const newY = block.position.y + moveY;

            if (isValidMove(block, newX, newY)) {
                newBlocks[blockIndex] = {
                    ...block,
                    position: { x: newX, y: newY }
                };

                // Verificar victoria después de cada movimiento válido
                checkVictory(newBlocks);
            }
            return newBlocks;
        });

    };

    // Función para verificar la victoria
    const checkVictory = (blocks: Block[]) => {
        const targetBlock = blocks.find(block => block.id === 'A');
        if (targetBlock) {
            const isAtTarget = targetBlock.position.x === 4 && targetBlock.position.y === 2;
            if (isAtTarget && !hasWon) {
                setHasWon(true);
                toast.success('¡Has ganado! 🎉');
            }
        }
    };

    //#endregion

    // Resetear el puzzle
    const resetPuzzle = () => {
        setBlocks(JSON.parse(JSON.stringify(initialBlocks)));
        setMoveCount(0);
        setHasWon(false);
        setSelectedBlock(null);
        setIsDragging(false);
        setMoveInProgress(false);
        setInitialPosition(null);
        setTime(0);
        setIsTimerRunning(true);
    };





    const isPositionEqual = (pos1: Position | null, pos2: Position | undefined) => {
        return pos1?.x === pos2?.x && pos1?.y === pos2?.y;
    };

    const getBlockColor = (block: Block): string => {
        if (block.id === 'A') return 'bg-bloqueA';
        if (block.width === 1 && block.height === 2) return 'bg-bloqueC';
        if (block.width === 2 && block.height === 1) return 'bg-bloqueB';
        if (block.width === 1 && block.height === 1) return 'bg-bloqueE';
        if (block.width === 3 && block.height === 1) return 'bg-bloqueD';
        if (block.width === 1 && block.height === 3) return 'bg-bloqueF';
        return 'bg-background';
    };

    // Iniciar/Detener timer
    useEffect(() => {
        if (!hasWon && !isTimerRunning) {
            setIsTimerRunning(true);
        } else if (hasWon && isTimerRunning) {
            setIsTimerRunning(false);
        }
    }, [hasWon]);

    // Manejar el timer
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isTimerRunning]);



    if (loading) {
        toast.error('Cargando puzzle diario...');
        return (
            <div className="h-screen w-full flex items-center justify-center overflow-hidden bg-background">
                <p className="text-lg text-foreground">Cargando puzzle diario...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center overflow-hidden bg-background">
                <p className="text-lg text-foreground">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background touch-none">
            <Toaster position="top-center" />
            <div className="text-center p-4">
                <div className="flex justify-center items-center gap-8">
                    {/* Contador de movimientos */}
                    <div className="flex items-center gap-2 text-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="m18 9 3 3-3 3M15 12h6M6 9l-3 3 3 3M3 12h6M9 18l3 3 3-3M12 15v6M15 6l-3-3-3 3M12 3v6" />
                        </svg>
                        <span className="text-lg font-bold">{moveCount}/{requiredMoves !== null && requiredMoves}</span>
                    </div>

                    {/* Botón de reset */}
                    <button
                        onClick={resetPuzzle}
                        className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="hover:animate-impulse-rotation-right">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M19.95 11a8 8 0 1 0-.5 4m.5 5v-5h-5" />
                        </svg>
                    </button>

                    {/* Timer */}
                    <div className="flex items-center gap-2 text-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
                            <path d="M6 4v2a6 6 0 1 0 12 0V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
                        </svg>
                        <span className="text-lg font-bold w-16 text-center tabular-nums">
                            {formatTime(time)}
                        </span>
                    </div>
                </div>

                {hasWon && <Confetti width={width} height={height} />}
                {hasWon && (
                    <VictoryModal
                        time={formatTime(time)}
                        moves={moveCount}
                        onShare={() => console.log("Resultados compartidos")}
                        onRestart={resetPuzzle}
                    />
                )}
            </div>

            <div className="flex items-center justify-center p-4">
                <div className="p-4 rounded-xl shadow-lg relative bg-backgroundLowContrast">
                    <div
                        ref={boardRef}
                        className="relative w-[min(72vw,72vh)] h-[min(72vw,72vh)] max-w-[360px] max-h-[360px] rounded-lg bg-background"
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        {walls.map((wall, index) => (
                            <div
                                key={`wall-${index}`}
                                className="absolute rounded-lg bg-borderHighContrast"
                                style={{
                                    width: `${100 / 6}%`,
                                    height: `${100 / 6}%`,
                                    left: `${wall.x * (100 / 6)}%`,
                                    top: `${wall.y * (100 / 6)}%`,
                                }}
                            />
                        ))}
                        {blocks.map(block => (
                            <div
                                key={block.id}
                                onMouseDown={(e) => handleMouseDown(e, block)}
                                onTouchStart={(e) => handleTouchStart(e, block)}
                                className={`absolute flex items-center justify-center cursor-move select-none rounded-lg border-[1px] shadow-sm border-background
                                    ${getBlockColor(block)}
                                    ${selectedBlock === block.id ? 'ring-2 ring-primary ring-opacity-50 z-10' : 'z-0'}
                                    ${isDragging && selectedBlock === block.id ? 'opacity-90 scale-105' : ''}
                                    ${hasWon && block.id === 'A' ? 'animate-bounce' : ''}`}
                                style={{
                                    width: `${block.width * (100 / 6)}%`,
                                    height: `${block.height * (100 / 6)}%`,
                                    left: `${block.position.x * (100 / 6)}%`,
                                    top: `${block.position.y * (100 / 6)}%`,
                                    transition: isDragging ? 'none' : 'all 0.2s ease-out'
                                }}
                            />
                        ))}
                        <div
                            className="absolute right-0 top-[37%] w-8 h-8 -mr-14 pointer-events-none"
                            style={{
                                animation: 'slideLeftRight 1.5s ease-in-out infinite'
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary w-full h-full"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default KlotskiGame;