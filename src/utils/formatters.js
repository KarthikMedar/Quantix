/**
 * Formatting helpers for EstimateAI
 */

export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'EA';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EA';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatCurrencyINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹--';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
