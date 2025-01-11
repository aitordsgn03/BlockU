import KlotskiGame from './components/KlotskiGame.tsx'
import Navbar from './components/Navbar.tsx'
import TutorialModal from './components/TutorialModal'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { useState } from 'react';


function App() {
  const [showTutorial, setShowTutorial] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden bg-purple-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <TutorialModal
          open={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
        <KlotskiGame />
      </main>
    </div>
  )
}

export default App