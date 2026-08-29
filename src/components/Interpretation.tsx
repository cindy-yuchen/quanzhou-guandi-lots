import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lot } from '../utils/lots';
import { interpretLot } from '../utils/interpret';

import ReactMarkdown from 'react-markdown';

const numberToChinese = (num: number) => {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (num === 100) return '一百';
  if (num <= 10) return num === 10 ? '十' : digits[num];
  if (num < 20) return '十' + digits[num % 10];
  return digits[Math.floor(num / 10)] + '十' + (num % 10 === 0 ? '' : digits[num % 10]);
};

export default function Interpretation({ 
  question, 
  lot, 
  onRestart 
}: { 
  question: string, 
  lot: Lot,
  onRestart: () => void
}) {
  const [interpretation, setInterpretation] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [serialNumber] = useState(() => Math.floor(Math.random() * 9000000 + 1000000));

  useEffect(() => {
    if (!hasStarted) return;
    
    let mounted = true;
    setIsInterpreting(true);
    
    const fetchInterpretation = async () => {
      const result = await interpretLot(question, lot);
      if (mounted) {
        // Simulate streaming effect for the text
        let currentText = '';
        const chars = result.split('');
        
        const stream = setInterval(() => {
          if (chars.length > 0) {
            currentText += chars.shift();
            setInterpretation(currentText);
          } else {
            clearInterval(stream);
            setIsInterpreting(false);
          }
        }, 30); // 30ms per character
      }
    };

    fetchInterpretation();
    return () => { mounted = false; };
  }, [question, lot, hasStarted]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col pt-8 pb-6 overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto px-2 scrollbar-none flex flex-col items-center">
        
        {/* Lot Paper (签纸) */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-[220px] bg-[#f4e8c1] shadow-md flex flex-col items-center pt-6 pb-8 px-4 text-[#1a1a1a] mb-8 shrink-0 mx-auto"
          style={{ fontFamily: '"Kaiti SC", "STKaiti", "KaiTi", serif' }}
        >
          {/* Top Section */}
          <div className="flex flex-col items-center w-full mb-2">
            <div className="text-base tracking-widest mb-1 font-medium">第{numberToChinese(lot.number)}签</div>
            <div className="text-sm tracking-[0.5em] ml-2 mb-3">存根</div>
            <div className="w-full border-b border-dashed border-[#1a1a1a]/40 mb-3"></div>
            <div className="text-[#c62828] text-lg mb-3 font-sans tracking-widest">{serialNumber}</div>
            <div className="text-base tracking-widest mb-1 font-medium">泉州通淮關岳廟</div>
            <div className="text-base tracking-[1em] ml-4 mb-1 font-medium">簽詩</div>
          </div>

          {/* Main Box */}
          <div className="border border-[#1a1a1a] w-full p-2 flex flex-row-reverse justify-between h-[380px]">
            {/* Column 1: Lot number */}
            <div className="flex flex-col items-center h-full w-1/5">
              <div style={{ writingMode: 'vertical-rl' }} className="text-sm tracking-[0.3em] font-medium mt-2">{`第${numberToChinese(lot.number)}`}</div>
            </div>
            
            {/* Column 2: Story part 1 + Poem line 1 */}
            <div className="flex flex-col justify-between items-center h-full w-1/5">
               <div style={{ writingMode: 'vertical-rl' }} className="text-sm tracking-[0.3em] mt-2">{lot.story ? lot.story.split('：')[0].substring(0, Math.ceil(lot.story.split('：')[0].length / 2)) : ''}</div>
               <div style={{ writingMode: 'vertical-rl' }} className="text-base tracking-[0.3em] mb-2">{lot.poem[0]}</div>
            </div>

            {/* Column 3: Story part 2 + Poem line 2 */}
            <div className="flex flex-col justify-between items-center h-full w-1/5">
               <div style={{ writingMode: 'vertical-rl' }} className="text-sm tracking-[0.3em] mt-2">{lot.story ? lot.story.split('：')[0].substring(Math.ceil(lot.story.split('：')[0].length / 2)) : ''}</div>
               <div style={{ writingMode: 'vertical-rl' }} className="text-base tracking-[0.3em] mb-2">{lot.poem[1]}</div>
            </div>

            {/* Column 4: Grade + Poem line 3 */}
            <div className="flex flex-col justify-between items-center h-full w-1/5">
               <div style={{ writingMode: 'vertical-rl' }} className="text-sm tracking-[0.3em] mt-2">{lot.level}</div>
               <div style={{ writingMode: 'vertical-rl' }} className="text-base tracking-[0.3em] mb-2">{lot.poem[2]}</div>
            </div>

            {/* Column 5: Empty + Poem line 4 */}
            <div className="flex flex-col justify-end items-center h-full w-1/5">
               <div style={{ writingMode: 'vertical-rl' }} className="text-base tracking-[0.3em] mb-2">{lot.poem[3]}</div>
            </div>
          </div>
        </motion.div>

        {!hasStarted ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full flex justify-center mt-4 shrink-0"
          >
            <button 
              onClick={() => setHasStarted(true)}
              className="px-10 py-4 bg-[#8b2b1a] text-[#e8dcc5] rounded-sm tracking-widest text-lg shadow-lg hover:bg-[#a53320] transition-colors duration-300 border border-[#c29b62]/50"
            >
              AI 解签
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="w-full space-y-4 mt-4 bg-[#1a0f0f]/80 p-6 rounded-lg border border-[#c29b62]/30 shrink-0"
          >
            <h3 className="text-xl text-[#c29b62] tracking-widest text-center mb-6">师傅解签</h3>
            <div className="text-[#e8dcc5]/90 leading-relaxed text-justify whitespace-pre-wrap markdown-body text-base sm:text-lg">
              <ReactMarkdown>{interpretation}</ReactMarkdown>
              {isInterpreting && <span className="inline-block w-2 h-5 bg-[#c29b62] ml-1 animate-pulse align-middle"></span>}
            </div>
          </motion.div>
        )}
      </div>

      {hasStarted && !isInterpreting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-6 flex justify-center shrink-0"
        >
          <button 
            onClick={onRestart}
            className="px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500"
          >
            拜谢神明，再次求签
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
