import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Qiantong({ onDrawn }: { onDrawn: () => void }) {
  const [isShaking, setIsShaking] = useState(false);
  const controls = useAnimation();
  const stickControls = useAnimation();

  const handleShake = async () => {
    if (isShaking) return;
    setIsShaking(true);

    // Shake animation for cylinder
    await controls.start({
      rotateZ: [0, -10, 10, -10, 10, -5, 5, 0],
      y: [0, -5, 5, -5, 5, 0],
      transition: { duration: 1.5, ease: "easeInOut", repeat: 2 }
    });

    // Stick rising and falling out
    await stickControls.start({
      y: [0, -150],
      rotateZ: [0, 15],
      opacity: [1, 1, 0],
      transition: { duration: 1, ease: "easeOut" }
    });

    setTimeout(onDrawn, 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center justify-center space-y-12"
    >
      <div className="text-center h-8">
        <p className="text-lg text-[#c29b62] tracking-widest">
          {isShaking ? '诚心摇签...' : '点击签筒摇签'}
        </p>
      </div>

      <div className="relative w-32 h-64 cursor-pointer" onClick={handleShake}>
        {/* The stick that falls out */}
        <motion.div 
          animate={stickControls}
          className="absolute left-1/2 top-10 w-3 h-40 bg-[#d4af37] -translate-x-1/2 origin-bottom rounded-t-sm z-0 shadow-md"
          style={{ backgroundImage: 'linear-gradient(to bottom, #d4af37, #8b6508)' }}
        >
          <div className="w-full h-4 bg-red-800 mt-2"></div>
        </motion.div>

        {/* The cylinder */}
        <motion.div 
          animate={controls}
          className="absolute bottom-0 w-full h-48 bg-[#3E2723] rounded-b-xl rounded-t-sm border-t-4 border-[#2a1a17] shadow-2xl z-10 flex justify-center overflow-hidden origin-bottom"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' 
          }}
        >
          {/* Decorative band */}
          <div className="absolute top-8 w-full h-4 bg-[#8b2b1a] border-y border-[#5a1b10]"></div>
          <div className="absolute bottom-8 w-full h-4 bg-[#8b2b1a] border-y border-[#5a1b10]"></div>
          
          {/* Sticks inside */}
          <div className="absolute -top-10 w-24 h-20 flex justify-around items-end">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-24 bg-[#c29b62] rounded-t-sm" style={{ transform: `rotate(${i * 4 - 14}deg)`, transformOrigin: 'bottom' }}>
                <div className="w-full h-2 bg-red-800 mt-1"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
