import { motion } from 'motion/react';

export default function SmokeEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0 mix-blend-screen">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[-10%] left-1/2 w-32 h-64 rounded-full blur-[60px]"
          style={{
            background: 'radial-gradient(circle, rgba(200,210,220,0.4) 0%, rgba(200,210,220,0) 70%)'
          }}
          initial={{ 
            x: -100 + Math.random() * 200, 
            y: 100, 
            opacity: 0,
            scale: 0.5,
            rotate: Math.random() * 360
          }}
          animate={{ 
            x: -200 + Math.random() * 400, 
            y: -1000, 
            opacity: [0, 0.4, 0.6, 0],
            scale: [0.5, 1.5, 3],
            rotate: Math.random() * 360 + 180
          }}
          transition={{ 
            duration: 20 + Math.random() * 15, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "linear" 
          }}
        />
      ))}
    </div>
  );
}
