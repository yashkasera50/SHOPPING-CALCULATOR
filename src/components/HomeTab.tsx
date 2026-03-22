import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Copy, Share2, Info, Scale, ArrowRightLeft } from 'lucide-react';
import Decimal from 'decimal.js';
import { toDecimal, formatCurrency, formatNumber } from '../utils/calculations';
import { translations, Language } from '../utils/i18n';

export default function HomeTab({ lang, currency, weightUnit }: { lang: Language, currency: string, weightUnit: 'g' | 'kg' }) {
  const t = translations[lang];
  const [refWeight, setRefWeight] = useState('1');
  const [refPrice, setRefPrice] = useState('60');

  // New state for integrated calculators
  const [targetWeight, setTargetWeight] = useState('');
  const [targetWeightUnit, setTargetWeightUnit] = useState<'g' | 'kg'>(weightUnit);
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    setTargetWeightUnit(weightUnit);
  }, [weightUnit]);

  const reset = () => {
    setRefWeight('');
    setRefPrice('');
    setTargetWeight('');
    setTargetWeightUnit(weightUnit);
    setTargetPrice('');
  };

  const calculatePriceFromWeight = (weightVal: string, unit: 'g' | 'kg') => {
    const rw = toDecimal(refWeight);
    const rp = toDecimal(refPrice);
    const tw = toDecimal(weightVal);
    if (rw.isZero() || rp.isZero() || tw.isZero()) return toDecimal(0);
    
    const refGrams = weightUnit === 'kg' ? rw.mul(1000) : rw;
    const targetGrams = unit === 'kg' ? tw.mul(1000) : tw;
    const pricePerGram = rp.div(refGrams);
    return pricePerGram.mul(targetGrams);
  };

  const calculateWeightFromPrice = (priceVal: string) => {
    const rw = toDecimal(refWeight);
    const rp = toDecimal(refPrice);
    const tp = toDecimal(priceVal);
    if (rw.isZero() || rp.isZero() || tp.isZero()) return toDecimal(0);

    const refGrams = weightUnit === 'kg' ? rw.mul(1000) : rw;
    const pricePerGram = rp.div(refGrams);
    return tp.div(pricePerGram); // returns grams
  };

  const quickPrices = [
    { label: '250 g', grams: 250 },
    { label: '500 g', grams: 500 },
    { label: '750 g', grams: 750 },
    { label: '1 kg', grams: 1000 },
  ];

  const weightToPriceResult = calculatePriceFromWeight(targetWeight, targetWeightUnit);
  const priceToWeightResultGrams = calculateWeightFromPrice(targetPrice);

  return (
    <div className="space-y-6">
      {/* Reference Input Section */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-[#FFD700]" />
            {t.refWeight}
          </h2>
          <button 
            onClick={reset}
            className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
          >
            <RotateCcw className="w-4 h-4" />
            {t.reset}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest opacity-60">{t.refWeight}</label>
            <div className="relative">
              <input
                type="number"
                value={refWeight}
                onChange={(e) => setRefWeight(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] transition-all text-xl font-mono"
              />
              <div className="absolute right-2 top-2 bottom-2 px-3 flex items-center bg-[#FFD700] text-black rounded-lg font-bold text-xs uppercase">
                {weightUnit}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest opacity-60">{t.refPrice}</label>
            <div className="relative">
              <input
                type="number"
                value={refPrice}
                onChange={(e) => setRefPrice(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] transition-all text-xl font-mono"
              />
              <div className="absolute right-2 top-2 bottom-2 px-3 flex items-center bg-white/10 rounded-lg font-bold text-lg">
                {currency}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Calculators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weight to Price */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 opacity-80">
            <Scale className="w-4 h-4 text-[#FFD700]" />
            Weight → Price
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                placeholder="Enter Weight"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] text-lg font-mono"
              />
              <button 
                onClick={() => setTargetWeightUnit(u => u === 'g' ? 'kg' : 'g')}
                className="absolute right-2 top-2 bottom-2 px-2 bg-white/10 rounded-lg text-[10px] font-bold uppercase"
              >
                {targetWeightUnit}
              </button>
            </div>
            <div className="p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20 text-center">
              <span className="text-[10px] uppercase tracking-widest opacity-60 block mb-1">Result Price</span>
              <span className="text-2xl font-bold text-[#FFD700]">
                {formatCurrency(weightToPriceResult, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Price to Weight */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 opacity-80">
            <ArrowRightLeft className="w-4 h-4 text-[#FFD700]" />
            Price → Weight
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                placeholder="Enter Price"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] text-lg font-mono"
              />
              <div className="absolute right-2 top-2 bottom-2 px-2 flex items-center bg-white/10 rounded-lg font-bold text-sm">
                {currency}
              </div>
            </div>
            <div className="p-4 bg-[#8A2BE2]/10 rounded-xl border border-[#8A2BE2]/20 text-center">
              <span className="text-[10px] uppercase tracking-widest opacity-60 block mb-1">Result Weight</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-[#FFD700]">
                  {priceToWeightResultGrams.gt(1000) 
                    ? `${priceToWeightResultGrams.div(1000).toFixed(2)} kg` 
                    : `${priceToWeightResultGrams.toFixed(2)} g`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Results Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickPrices.map((item, idx) => {
          const price = calculatePriceFromWeight(item.grams.toString(), 'g');
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5 backdrop-blur-md rounded-2xl p-4 border border-[#FFD700]/20 flex flex-col items-center justify-center text-center group hover:border-[#FFD700]/50 transition-all cursor-pointer"
            >
              <span className="text-xs uppercase tracking-widest opacity-60 mb-1">{item.label}</span>
              <span className="text-2xl font-bold text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                {formatCurrency(price, currency)}
              </span>
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20"><Copy className="w-3 h-3" /></button>
                <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20"><Share2 className="w-3 h-3" /></button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rate Display */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
        <p className="text-sm opacity-60 uppercase tracking-widest">
          Rate: {formatCurrency(calculatePriceFromWeight('1000', 'g'), currency)} / kg
        </p>
      </div>
    </div>
  );
}
