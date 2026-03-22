import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Plus, Trash2, BarChart2, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Decimal from 'decimal.js';
import { toDecimal, formatCurrency } from '../utils/calculations';
import { cn } from '../utils/utils';
import { translations, Language } from '../utils/i18n';

interface Product {
  id: number;
  name: string;
  weight: string;
  unit: 'g' | 'kg';
  price: string;
}

export default function CompareTab({ lang, currency, weightUnit }: { lang: Language, currency: string, weightUnit: 'g' | 'kg' }) {
  const t = translations[lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg'>(weightUnit === 'kg' ? 'kg' : 'kg'); // CompareTab seems to only support kg for now
  const [price, setPrice] = useState('');

  const reset = () => {
    setProducts([]);
    setName('');
    setWeight('');
    setPrice('');
  };

  const addProduct = () => {
    const p = toDecimal(price);
    const w = toDecimal(weight);
    if (p.isZero() || w.isZero() || products.length >= 5) return;
    const newProduct: Product = {
      id: Date.now(),
      name: name.trim() || `Product ${products.length + 1}`,
      weight: w.toString(),
      unit: 'kg',
      price: p.toString(),
    };
    setProducts([...products, newProduct]);
    setName('');
    setWeight('');
    setPrice('');
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getPricePerKg = (p: Product) => {
    const price = toDecimal(p.price);
    const weight = toDecimal(p.weight);
    if (weight.isZero()) return toDecimal(0);
    return price.div(weight);
  };

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = getPricePerKg(a);
    const priceB = getPricePerKg(b);
    return priceA.minus(priceB).toNumber();
  });

  const chartData = products.map(p => ({
    name: p.name,
    pricePerKg: getPricePerKg(p).toNumber(),
  }));

  const cheapest = sortedProducts[0];

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#FFD700]" />
            {t.compare}
          </h2>
          <button onClick={reset} className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> {t.reset}
          </button>
        </div>

        {products.length < 5 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FFD700]"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FFD700]"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Total Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FFD700]"
              />
              <button 
                onClick={addProduct}
                className="bg-[#FFD700] text-black font-bold rounded-xl px-4 py-2 hover:bg-[#FFA500] transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest opacity-60">
                    <th className="py-3 px-2">Product</th>
                    <th className="py-3 px-2">Price/kg</th>
                    <th className="py-3 px-2">Rank</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((p, idx) => (
                    <tr key={p.id} className={cn(
                      "border-b border-white/5 text-sm transition-colors",
                      idx === 0 ? "bg-[#FFD700]/10" : "hover:bg-white/5"
                    )}>
                      <td className="py-3 px-2 font-medium flex items-center gap-2">
                        {idx === 0 && <Trophy className="w-4 h-4 text-[#FFD700]" />}
                        {p.name}
                      </td>
                      <td className="py-3 px-2 font-bold text-[#FFD700]">
                        {formatCurrency(getPricePerKg(p), currency)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          idx === 0 ? "bg-[#FFD700] text-black" : "bg-white/10"
                        )}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button onClick={() => removeProduct(p.id)} className="text-red-400/50 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart */}
            <div className="h-64 w-full bg-white/5 rounded-2xl p-4 border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#ffffff60" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  />
                  <Bar dataKey="pricePerKg" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === cheapest?.name ? '#FFD700' : '#8A2BE2'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {products.length > 1 && (
              <div className="p-4 bg-[#FFD700]/20 rounded-xl border border-[#FFD700]/30 text-center">
                <p className="text-sm font-bold text-[#FFD700]">
                  {cheapest.name} is the best value!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
