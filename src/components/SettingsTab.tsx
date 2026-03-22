import React from 'react';
import { Settings, Coins, Scale } from 'lucide-react';
import { translations, Language } from '../utils/i18n';

interface SettingsTabProps {
  lang: Language;
  currency: string;
  setCurrency: (c: string) => void;
  weightUnit: 'g' | 'kg';
  setWeightUnit: (u: 'g' | 'kg') => void;
}

export default function SettingsTab({ lang, currency, setCurrency, weightUnit, setWeightUnit }: SettingsTabProps) {
  const t = translations[lang];

  const currencies = ['₹', '$', '€', '£', '¥', 'د.إ'];
  const units: ('g' | 'kg')[] = ['g', 'kg'];

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-[#FFD700]" />
          {t.settings}
        </h2>

        <div className="space-y-8">
          {/* Currency Selection */}
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
              <Coins className="w-4 h-4" />
              {t.currency}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`py-3 rounded-xl border transition-all font-bold text-lg ${
                    currency === c
                      ? 'bg-[#FFD700] text-black border-[#FFD700]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Unit Selection */}
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              {t.defaultUnit}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => setWeightUnit(u)}
                  className={`py-3 rounded-xl border transition-all font-bold text-lg ${
                    weightUnit === u
                      ? 'bg-[#FFD700] text-black border-[#FFD700]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {u === 'g' ? t.grams : t.kg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
