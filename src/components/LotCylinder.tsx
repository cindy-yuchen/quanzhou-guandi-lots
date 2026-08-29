import { motion } from 'motion/react';
import { useState } from 'react';

export default function LotCylinder({ onDraw }: { onDraw: () => void }) {
  const [shaking, setShaking] = useState(false);
  const [drawn, setDrawn] = useState(false);

  const shake = () => {
    if (shaking || drawn) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setDrawn(true);
      setTimeout(() => {
        onDraw();
      }, 1000); // Wait for the stick to fall out before proceeding
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-16">
      <div className="relative w-32 h-56 flex justify-center perspective-1000">
        {/* The Sticks inside */}
        <div className="absolute top-[-40px] w-full flex justify-around px-4 z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div 
              key={i} 
              className="w-1.5 h-32 bg-[#D4A373] rounded-t-sm shadow-sm"
              style={{
                background: 'linear-gradient(to right, #C98B5A, #E8DDC8, #C98B5A)',
                transformOrigin: 'bottom center',
                rotateZ: (i - 7) * 2 // Spread them out slightly
              }}
              animate={shaking ? { 
                y: [0, -15 - Math.random()*30, 0],
                rotateZ: [(i - 7) * 2, (i - 7) * 2 + (Math.random() * 10 - 5), (i - 7) * 2]
              } : {}}
              transition={{ duration: 0.2 + Math.random() * 0.1, repeat: 10, repeatType: "reverse" }}
            />
          ))}
        </div>

        {/* The Drawn Stick falling out */}
        {drawn && (
          <motion.div 
            className="absolute top-[-40px] w-2 h-40 bg-[#D4A373] rounded-sm shadow-lg z-20"
            style={{
              background: 'linear-gradient(to right, #C98B5A, #E8DDC8, #C98B5A)',
            }}
            initial={{ y: 0, rotateZ: 0, opacity: 1 }}
            animate={{ 
              y: -100, 
              rotateZ: 720,
              x: 100,
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-full h-4 bg-red-800 mt-2" />
          </motion.div>
        )}

        {/* The Cylinder */}
        <motion.div
          className="absolute bottom-0 w-28 h-48 bg-[#4B3527] rounded-b-2xl border-t-8 border-[#C9A35A] shadow-2xl flex justify-center overflow-hidden z-10"
          style={{
            background: 'linear-gradient(to right, #2A1A10, #5C4033, #2A1A10)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)'
          }}
          animate={shaking ? {
            rotateZ: [-15, 15, -15, 15, -15, 15, -10, 10, -5, 5, 0],
            y: [0, -30, 0, -30, 0, -20, 0, -10, 0]
          } : {}}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          {/* Bamboo texture lines */}
          <div className="absolute inset-0 opacity-20 flex flex-col justify-evenly">
            <div className="w-full h-px bg-black" />
            <div className="w-full h-px bg-black" />
            <div className="w-full h-px bg-black" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-900/80 px-2 py-8 rounded-sm border border-[#C9A35A]/50">
              <span className="text-[#C9A35A] font-bold writing-vertical tracking-widest text-lg" style={{ textShadow: '1px 1px 2px black' }}>关帝灵签</span>
            </div>
          </div>
        </motion.div>
      </div>

      {!shaking && !drawn && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-10 py-4 bg-[#7A1F1F] text-[#E8DDC8] border border-[#C9A35A]/50 rounded-full text-xl tracking-widest hover:bg-[#7A1F1F]/80 transition-all duration-500 shadow-[0_0_20px_rgba(122,31,31,0.5)] cursor-pointer"
          onClick={shake}
        >
          诚心摇签
        </motion.button>
      )}
    </div>
  );
}
