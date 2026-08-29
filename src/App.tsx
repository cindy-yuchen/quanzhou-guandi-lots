import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from './components/Intro';
import Pray from './components/Pray';
import Jiaobei from './components/Jiaobei';
import Qiantong from './components/Qiantong';
import Interpretation from './components/Interpretation';
import { Lot, getRandomLot } from './utils/lots';

type Step = 'INTRO' | 'PRAY' | 'ASK_PERMISSION' | 'DRAW_LOT' | 'VERIFY_LOT' | 'INTERPRETATION';

function App() {
  const [step, setStep] = useState<Step>('INTRO');
  const [question, setQuestion] = useState('');
  const [drawnLot, setDrawnLot] = useState<Lot | null>(null);

  const handleStart = () => setStep('PRAY');
  
  const handlePraySubmit = (q: string) => {
    setQuestion(q);
    setStep('ASK_PERMISSION');
  };

  const handlePermissionGranted = () => {
    setStep('DRAW_LOT');
  };

  const handleLotDrawn = () => {
    setDrawnLot(getRandomLot());
    setStep('VERIFY_LOT');
  };

  const handleLotVerified = () => {
    setStep('INTERPRETATION');
  };

  const handleRestart = () => {
    setStep('INTRO');
    setQuestion('');
    setDrawnLot(null);
  };

  const handleReturnToPray = () => {
    setStep('PRAY');
  };

  const handleReturnToHome = () => {
    setStep('INTRO');
    setQuestion('');
    setDrawnLot(null);
  };

  const handleReturnToDrawLot = () => {
    setDrawnLot(null);
    setStep('DRAW_LOT');
  };

  return (
    <div className="min-h-screen bg-[#1a0f0f] text-[#e8dcc5] font-serif overflow-hidden relative selection:bg-[#c29b62]/30">
      {/* Background texture/smoke effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#8b2b1a] via-[#1a0f0f] to-[#1a0f0f]"></div>
      
      <main className="relative z-10 max-w-md mx-auto h-full min-h-screen flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === 'INTRO' && <Intro key="intro" onStart={handleStart} />}
          {step === 'PRAY' && <Pray key="pray" onSubmit={handlePraySubmit} initialQuestion={question} />}
          {step === 'ASK_PERMISSION' && (
            <Jiaobei 
              key="ask" 
              purpose="ask" 
              onSuccess={handlePermissionGranted} 
              onReturnToPray={handleReturnToPray}
              onReturnToHome={handleReturnToHome}
              onReturnToDrawLot={handleReturnToDrawLot}
            />
          )}
          {step === 'DRAW_LOT' && <Qiantong key="draw" onDrawn={handleLotDrawn} />}
          {step === 'VERIFY_LOT' && (
            <Jiaobei 
              key="verify" 
              purpose="verify" 
              lotNumber={drawnLot?.number}
              onSuccess={handleLotVerified} 
              onReturnToPray={handleReturnToPray}
              onReturnToHome={handleReturnToHome}
              onReturnToDrawLot={handleReturnToDrawLot}
            />
          )}
          {step === 'INTERPRETATION' && drawnLot && (
            <Interpretation 
              key="interpret" 
              question={question} 
              lot={drawnLot} 
              onRestart={handleRestart} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
