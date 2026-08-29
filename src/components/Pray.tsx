import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Pray({ onSubmit, initialQuestion = '' }: { onSubmit: (q: string) => void, initialQuestion?: string }) {
  const [question, setQuestion] = useState(initialQuestion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl text-[#c29b62] tracking-widest">禀明神明</h3>
          <p className="text-sm opacity-60">在心中默念您的姓名、生辰与所求之事</p>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="信士/信女 所求何事..."
          className="w-full h-40 bg-transparent border-b border-[#c29b62]/30 focus:border-[#c29b62] outline-none resize-none text-center text-lg placeholder:text-[#e8dcc5]/20 p-4 transition-colors duration-500"
          autoFocus
        />

        <button 
          type="submit"
          disabled={!question.trim()}
          className="mx-auto px-8 py-3 border border-[#c29b62]/50 rounded-sm text-[#c29b62] tracking-widest hover:bg-[#c29b62]/10 transition-colors duration-500 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          敬香请示
        </button>
      </form>
    </motion.div>
  );
}
