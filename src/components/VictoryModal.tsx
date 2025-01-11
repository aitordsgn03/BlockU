import React from "react";

interface VictoryModalProps {
    time: string; // Tiempo en formato "mm:ss" o similar
    moves: number; // Número de movimientos realizados
    onShare: () => void; // Función opcional para realizar alguna acción al compartir (puedes dejarla vacía si no es necesaria)
    onRestart: () => void; // Función para reiniciar el juego
}

const VictoryModal: React.FC<VictoryModalProps> = ({ time, moves, onShare, onRestart }) => {
    const shareResults = () => {
        const shareText = `¡He completado el puzzle en ${time} con ${moves} movimientos! ¿Puedes superarme? 🎮`;
        navigator.clipboard
            .writeText(shareText)
            .then(() => {
                alert("¡Resultados copiados al portapapeles!");
            })
            .catch(() => {
                alert("No se pudo copiar al portapapeles. Inténtalo de nuevo.");
            });
        if (onShare) {
            onShare();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-20 ">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center relative animate-fade-in-up">
                <h2 className="text-3xl font-bold text-bloqueC mb-6">
                    ¡Has ganado! 🎉
                </h2>
                <div className="text-lg mb-6 flex items-center justify-center space-x-2 flex-col">
                    <p className="flex items-center space-x-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="m18 9 3 3-3 3M15 12h6M6 9l-3 3 3 3M3 12h6M9 18l3 3 3-3M12 15v6M15 6l-3-3-3 3M12 3v6" />
                        </svg>
                        <span className="font-bold text-foreground">{moves}</span>
                    </p>
                    <p className="flex items-center space-x-2 mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="text-foreground"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
                            <path d="M6 4v2a6 6 0 1 0 12 0V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
                        </svg>
                        <span className="font-bold text-foreground">{time}</span>
                    </p>

                </div>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={shareResults}
                        className="flex items-center justify-center bg-primary text-foreground font-medium py-3 px-6 rounded-lg hover:bg-primaryHover transition-all shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="mr-2"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M3 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0M15 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0M15 18a3 3 0 1 0 6 0 3 3 0 1 0-6 0M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4" />
                        </svg>
                        Compartir
                    </button>
                    <button
                        onClick={onRestart}
                        className="bg-secondary text-foreground font-medium py-3 px-6 rounded-lg hover:bg-secondaryHover transition-all shadow-md"
                    >
                        Reiniciar
                    </button>
                </div>
            </div>
        </div>

    );
};

export default VictoryModal;
