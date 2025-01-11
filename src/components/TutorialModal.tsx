import React, { useEffect } from 'react';

interface TutorialModalProps {
    open: boolean;
    onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ open, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay con efecto de desenfoque */}
            <div
                className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-background  rounded-lg p-6 max-w-md mx-4 shadow-xl">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Contenido */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-center text-foreground ">Cómo Jugar</h2>

                    <p className="text-foreground ">
                        Resuelve el puzzle diario moviendo las piezas para liberar la ficha objetivo.
                    </p>

                    <ul className="list-disc pl-6 space-y-1 text-foreground ">
                        <li>El objetivo es mover la <span className="text-bloqueA font-medium">ficha roja</span> hacia la salida del tablero.</li>
                        <li>Puedes mover las piezas en línea recta, siempre que haya espacio disponible.</li>
                    </ul>

                    <div>
                        <h3 className="font-semibold text-gray-900 ">Más Información</h3>
                        <ul className="list-disc pl-6 text-gray-700 ">
                            <li>Cada día hay un nuevo puzle disponible a la medianoche.</li>
                        </ul>
                    </div>

                    <p className="text-center font-medium italic text-gray-700 ">
                        ¿Estás lista para jugar? ¡El próximo movimiento puede ser el clave!
                    </p>

                    <div className="flex justify-center pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primaryHover transition-colors"
                        >
                            ¡Empezar a jugar!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;