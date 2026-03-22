import Decimal from 'decimal.js';

// Configure Decimal for high precision
Decimal.set({ precision: 50, rounding: Decimal.ROUND_HALF_UP });

export const toDecimal = (val: string | number) => {
  try {
    return new Decimal(val || 0);
  } catch {
    return new Decimal(0);
  }
};

export const formatCurrency = (val: Decimal, currency: string = '₹', locale: string = 'en-IN') => {
  const num = val.toNumber();
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === '₹' ? 'INR' : currency === '$' ? 'USD' : currency === '€' ? 'EUR' : currency === '£' ? 'GBP' : 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num).replace('INR', '₹');
};

export const formatNumber = (val: Decimal, locale: string = 'en-IN') => {
  return val.toFixed(2);
};
