import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Calculator, Delete } from 'lucide-react';
import { cn } from '../utils/utils';
import { translations, Language } from '../utils/i18n';

export default function SimpleCalcTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);

  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', 'DEL', '='],
  ];

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
    } else if (val === 'DEL') {
      setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
    } else if (val === '=') {
      try {
        // Simple eval for demo, in production use a math library
        // eslint-disable-next-line no-eval
        const result = eval(display).toString();
        setHistory([`${display} = ${result}`, ...history].slice(0, 10));
        setDisplay(result);
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay(d => d === '0' ? val : d + val);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#FFD700]" />
            {t.calc}
          </h2>
          <button onClick={() => { setDisplay('0'); setHistory([]); }} className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> {t.reset}
          </button>
        </div>

        {/* Display */}
        <div className="bg-black/40 rounded-2xl p-6 mb-6 text-right border border-white/5 shadow-inner">
          <div className="text-xs opacity-40 font-mono h-4 mb-1 overflow-hidden">
            {history[0] || ''}
          </div>
          <div className="text-4xl font-mono font-bold text-[#FFD700] overflow-x-auto whitespace-nowrap">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.flat().map((btn) => (
            <motion.button
              key={btn}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePress(btn)}
              className={cn(
                "h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all shadow-lg",
                btn === '=' ? "bg-[#FFD700] text-black col-span-1" :
                ['/', '*', '-', '+', 'C', 'DEL'].includes(btn) ? "bg-white/10 text-[#FFD700]" :
                "bg-white/5 text-white hover:bg-white/10"
              )}
            >
              {btn === 'DEL' ? <Delete className="w-6 h-6" /> : btn}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
