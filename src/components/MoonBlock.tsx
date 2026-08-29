import React from 'react';

export default function MoonBlock({ isFlat, flip = false, className = "" }: { isFlat: boolean, flip?: boolean, className?: string }) {
  return (
    <svg viewBox="0 0 100 200" className={`drop-shadow-2xl ${className}`} style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      <defs>
        <radialGradient id="roundGradient" cx="60%" cy="50%" r="50%" fx="70%" fy="50%">
          <stop offset="0%" stopColor="#e55a4f" />
          <stop offset="50%" stopColor="#b83b2e" />
          <stop offset="100%" stopColor="#5a1b10" />
        </radialGradient>
        <linearGradient id="flatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b2b1a" />
          <stop offset="100%" stopColor="#7a2516" />
        </linearGradient>
      </defs>
      <path 
        d="M 20,20 C 100,50 100,150 20,180 C 50,150 50,50 20,20 Z" 
        fill={isFlat ? "url(#flatGradient)" : "url(#roundGradient)"} 
        stroke="#4a150c" 
        strokeWidth="2"
      />
      {isFlat && (
        <path 
          d="M 25,30 C 90,55 90,145 25,170 C 50,145 50,55 25,30 Z" 
          fill="none" 
          stroke="#5a1b10" 
          strokeWidth="1"
          opacity="0.5"
        />
      )}
    </svg>
  );
}
