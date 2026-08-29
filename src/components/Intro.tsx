import React from 'react';
import { motion } from 'framer-motion';

export default function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center text-center space-y-12"
    >
      <div className="space-y-4">
        <h2 className="text-xl tracking-[0.3em] text-[#c29b62] opacity-80">泉州通淮</h2>
        <h1 className="text-5xl font-bold tracking-widest text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          关岳庙
        </h1>
        <p className="text-sm tracking-widest opacity-60 mt-4">线上求签祈福</p>
      </div>

      <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#c29b62] to-transparent opacity-50"></div>

      <button 
        onClick={onStart}
        className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500"
      >
        诚心求问
      </button>
    </motion.div>
  );
}
