import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  ArrowRightLeft, 
  Scale, 
  FileText, 
  BarChart2, 
  Calculator, 
  RotateCcw, 
  Languages, 
  Moon, 
  Sun,
  Settings
} from 'lucide-react';
import { cn } from './utils/utils';
import { translations, Language } from './utils/i18n';

// Components for Tabs
import HomeTab from './components/HomeTab';
import BatchSheetTab from './components/BatchSheetTab';
import CompareTab from './components/CompareTab';
import SimpleCalcTab from './components/SimpleCalcTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState('₹');
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('kg');
  const t = translations[lang];

  const tabs = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'batch', icon: FileText, label: t.batchSheet },
    { id: 'compare', icon: BarChart2, label: t.compare },
    { id: 'calc', icon: Calculator, label: t.calc },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 font-sans overflow-hidden flex flex-col",
      darkMode ? "bg-[#0a0510] text-white" : "bg-[#f5f2ed] text-[#1a1a1a]"
    )}>
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8A2BE2] opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFD700] opacity-10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <Scale className="text-black w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            PriceWeight Ultra
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
          >
            <option value="en" className="bg-[#1a1a1a]">English</option>
            <option value="hi" className="bg-[#1a1a1a]">हिन्दी</option>
            <option value="raj" className="bg-[#1a1a1a]">राजस्थानी</option>
            <option value="gu" className="bg-[#1a1a1a]">ગુજરાતી</option>
            <option value="mr" className="bg-[#1a1a1a]">मराठी</option>
          </select>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {activeTab === 'home' && <HomeTab lang={lang} currency={currency} weightUnit={weightUnit} />}
            {activeTab === 'batch' && <BatchSheetTab lang={lang} currency={currency} weightUnit={weightUnit} />}
            {activeTab === 'compare' && <CompareTab lang={lang} currency={currency} weightUnit={weightUnit} />}
            {activeTab === 'calc' && <SimpleCalcTab lang={lang} />}
            {activeTab === 'settings' && (
              <SettingsTab 
                lang={lang} 
                currency={currency} 
                setCurrency={setCurrency} 
                weightUnit={weightUnit} 
                setWeightUnit={setWeightUnit} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/5 backdrop-blur-xl border-t border-white/10 px-2 py-3 flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              activeTab === tab.id ? "text-[#FFD700] scale-110" : "text-gray-400 hover:text-gray-200"
            )}
          >
            <tab.icon className={cn("w-6 h-6", activeTab === tab.id && "drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]")} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute -top-1 w-1 h-1 rounded-full bg-[#FFD700]"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
