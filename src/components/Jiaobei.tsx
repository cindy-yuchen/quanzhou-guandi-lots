import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import MoonBlock from './MoonBlock';

type Result = '圣杯' | '笑杯' | '阴杯' | null;

export default function Jiaobei({ 
  purpose, 
  lotNumber,
  onSuccess, 
  onReturnToPray,
  onReturnToHome,
  onReturnToDrawLot
}: { 
  purpose: 'ask' | 'verify', 
  lotNumber?: number,
  onSuccess: () => void,
  onReturnToPray: () => void,
  onReturnToHome: () => void,
  onReturnToDrawLot: () => void
}) {
  const [result, setResult] = useState<Result>(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [message, setMessage] = useState('');
  const [b1Flat, setB1Flat] = useState(false);
  const [b2Flat, setB2Flat] = useState(false);
  
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  useEffect(() => {
    if (purpose === 'ask') {
      setMessage('请掷筊，叩问关帝是否允准赐签。');
    } else {
      setMessage(`抽得第 ${lotNumber} 签，请掷筊请示是否为该签。`);
    }
    setResult(null);
  }, [purpose, lotNumber]);

  const throwBlocks = async () => {
    if (isThrowing) return;
    setIsThrowing(true);
    setResult(null);
    setMessage('掷筊中...');

    // Determine result
    // Using physical probabilities: 50% 圣杯, 25% 笑杯, 25% 阴杯
    const rand = Math.random();
    let newResult: Result;
    let newB1Flat = false;
    let newB2Flat = false;

    if (rand < 0.5) {
      newResult = '圣杯'; // 1 flat, 1 round
      newB1Flat = true;
      newB2Flat = false;
    } else if (rand < 0.75) {
      newResult = '笑杯'; // 2 flat
      newB1Flat = true;
      newB2Flat = true;
    } else {
      newResult = '阴杯'; // 2 round
      newB1Flat = false;
      newB2Flat = false;
    }

    setB1Flat(newB1Flat);
    setB2Flat(newB2Flat);

    const targetRotateX1 = newB1Flat ? 1440 : 1620; // 1440 is 0 mod 360 (flat), 1620 is 180 mod 360 (round)
    const targetRotateX2 = newB2Flat ? 1440 : 1620;

    controls1.start({
      y: [0, -200, 0],
      rotateX: [0, 720, targetRotateX1],
      rotateZ: [0, 180, 360],
      transition: { duration: 1.5, ease: "easeInOut" }
    });
    
    await controls2.start({
      y: [0, -200, 0],
      rotateX: [0, 720, targetRotateX2],
      rotateZ: [0, 180, 360],
      transition: { duration: 1.5, ease: "easeInOut" }
    });

    // Set final rotation to normalized values to prevent infinite spinning buildup on next throw
    controls1.set({ rotateX: newB1Flat ? 0 : 180, rotateZ: 0 });
    controls2.set({ rotateX: newB2Flat ? 0 : 180, rotateZ: 0 });

    setResult(newResult);
    setIsThrowing(false);

    if (newResult === '圣杯') {
      setMessage('圣杯 (一平一凸)。关帝允准。');
      setTimeout(onSuccess, 2000);
    } else if (newResult === '笑杯') {
      if (purpose === 'ask') {
        setMessage('笑杯 (两平)。神明微笑不语，所问未明。请静心后再请示。');
      } else {
        setMessage('笑杯 (两平)。此签未定，请重新请签。');
      }
    } else {
      if (purpose === 'ask') {
        setMessage('阴杯 (两凸)。此刻或非问签之时。请稍候静心，再行请示。');
      } else {
        setMessage('阴杯 (两凸)。此签不允，请重新请签。');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-16 w-full"
    >
      <div className="text-center h-12 px-4">
        <p className="text-lg text-[#c29b62] tracking-widest leading-relaxed">{message}</p>
      </div>

      <div className="flex space-x-8 relative h-40 items-center justify-center [perspective:1000px]">
        {/* Block 1 */}
        <motion.div 
          animate={controls1}
          className="w-20 h-32 relative cursor-pointer [transform-style:preserve-3d]"
          onClick={throwBlocks}
        >
          {/* Flat side (Yang) */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <MoonBlock isFlat={true} className="w-full h-full" />
          </div>
          {/* Round side (Yin) */}
          <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: 'rotateX(180deg)' }}>
            <MoonBlock isFlat={false} className="w-full h-full" />
          </div>
        </motion.div>

        {/* Block 2 */}
        <motion.div 
          animate={controls2}
          className="w-20 h-32 relative cursor-pointer [transform-style:preserve-3d]"
          onClick={throwBlocks}
        >
          {/* Flat side (Yang) */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <MoonBlock isFlat={true} flip={true} className="w-full h-full" />
          </div>
          {/* Round side (Yin) */}
          <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: 'rotateX(180deg)' }}>
            <MoonBlock isFlat={false} flip={true} className="w-full h-full" />
          </div>
        </motion.div>
      </div>

      {!isThrowing && result === null && (
        <button 
          onClick={throwBlocks}
          className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500"
        >
          掷筊
        </button>
      )}

      {!isThrowing && result === '笑杯' && purpose === 'ask' && (
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button onClick={throwBlocks} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            再掷一次圣杯
          </button>
          <button onClick={onReturnToPray} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            返回修改问题
          </button>
        </div>
      )}

      {!isThrowing && result === '阴杯' && purpose === 'ask' && (
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button onClick={onReturnToPray} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            重新问签
          </button>
          <button onClick={onReturnToHome} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            返回首页
          </button>
        </div>
      )}

      {!isThrowing && result === '笑杯' && purpose === 'verify' && (
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button onClick={onReturnToDrawLot} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            重新摇签
          </button>
          <button onClick={onReturnToPray} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            返回问事
          </button>
        </div>
      )}

      {!isThrowing && result === '阴杯' && purpose === 'verify' && (
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button onClick={onReturnToDrawLot} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            重新摇签
          </button>
          <button onClick={onReturnToPray} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            重新问签
          </button>
          <button onClick={onReturnToHome} className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500">
            返回首页
          </button>
        </div>
      )}
    </motion.div>
  );
}
