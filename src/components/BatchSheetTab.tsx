import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Plus, Trash2, Download, FileText } from 'lucide-react';
import Decimal from 'decimal.js';
import { toDecimal, formatCurrency } from '../utils/calculations';
import { translations, Language } from '../utils/i18n';

interface Item {
  id: number;
  name: string;
  weight: string;
  unit: 'g' | 'kg';
  qty: string;
  price: string;
}

export default function BatchSheetTab({ lang, currency, weightUnit }: { lang: Language, currency: string, weightUnit: 'g' | 'kg' }) {
  const t = translations[lang];
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'g' | 'kg'>(weightUnit);
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    setUnit(weightUnit);
  }, [weightUnit]);

  const reset = () => {
    setItems([]);
    setName('');
    setWeight('');
    setPrice('');
    setQty('');
    setUnit(weightUnit);
  };

  const addItem = () => {
    const p = toDecimal(price);
    const w = toDecimal(weight);
    const q = toDecimal(qty || '1');
    
    if (p.isZero() || w.isZero()) return;

    const newItem: Item = {
      id: Date.now(),
      name: name.trim() || `Item ${items.length + 1}`,
      weight: w.toString(),
      unit,
      qty: q.toString(),
      price: p.toString(),
    };
    setItems([...items, newItem]);
    setName('');
    setWeight('');
    setPrice('');
    setQty('');
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const p = toDecimal(item.price);
      const q = toDecimal(item.qty);
      return acc.add(p.mul(q));
    }, toDecimal(0));
  };

  const calculateTotalWeight = () => {
    const totalGrams = items.reduce((acc, item) => {
      const w = toDecimal(item.weight);
      const q = toDecimal(item.qty);
      const grams = item.unit === 'kg' ? w.mul(1000) : w;
      return acc.add(grams.mul(q));
    }, toDecimal(0));
    return totalGrams.div(1000); // Return in kg
  };

  const exportToCSV = () => {
    const headers = ["Name", "Weight", "Unit", "Qty", "Price", "Total"];
    const rows = items.map(i => [
      i.name,
      i.weight,
      i.unit,
      i.qty,
      i.price,
      toDecimal(i.price).mul(toDecimal(i.qty)).toFixed(2)
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "batch_sheet.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FFD700]" />
            {t.batchSheet}
          </h2>
          <button onClick={reset} className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> {t.reset}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder={t.itemName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FFD700]"
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder={t.refWeight}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FFD700]"
              />
              <button onClick={() => setUnit(u => u === 'g' ? 'kg' : 'g')} className="absolute right-1 top-1 bottom-1 px-2 bg-white/10 rounded-lg text-[10px] font-bold uppercase">{unit}</button>
            </div>
            <input
              type="number"
              placeholder={t.qty}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-20 bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FFD700]"
            />
          </div>
          <input
            type="number"
            placeholder={t.totalPrice}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FFD700]"
          />
          <button 
            onClick={addItem}
            className="bg-[#FFD700] text-black font-bold rounded-xl px-4 py-2 flex items-center justify-center gap-2 hover:bg-[#FFA500] transition-all"
          >
            <Plus className="w-5 h-5" /> {t.add}
          </button>
        </div>

        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest opacity-60">
                  <th className="py-3 px-2">{t.itemName}</th>
                  <th className="py-3 px-2">{t.refWeight}</th>
                  <th className="py-3 px-2">{t.qty}</th>
                  <th className="py-3 px-2">{t.total}</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 text-sm hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-medium">{item.name}</td>
                    <td className="py-3 px-2 opacity-80">{item.weight}{item.unit}</td>
                    <td className="py-3 px-2 opacity-80">x{item.qty}</td>
                    <td className="py-3 px-2 font-bold text-[#FFD700]">
                      {formatCurrency(toDecimal(item.price).mul(toDecimal(item.qty)), currency)}
                    </td>
                    <td className="py-3 px-2">
                      <button onClick={() => removeItem(item.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <span className="text-xs uppercase tracking-widest opacity-60 block mb-1">Grand Total</span>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#FFD700]">{formatCurrency(calculateTotal(), currency)}</span>
                <span className="text-sm opacity-60">{calculateTotalWeight().toFixed(2)} kg total weight</span>
              </div>
            </div>
            <button 
              onClick={exportToCSV}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all"
            >
              <Download className="w-4 h-4" /> {t.export}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
