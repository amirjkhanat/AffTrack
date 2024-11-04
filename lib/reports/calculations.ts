import { Prisma } from '@prisma/client';

export function calculateConversionRate(conversions: number, total: number): number {
  if (total === 0) return 0;
  return (conversions / total) * 100;
}

export function calculateEPC(revenue: number, clicks: number): number {
  if (clicks === 0) return 0;
  return revenue / clicks;
}

export function calculateEPL(revenue: number, leads: number): number {
  if (leads === 0) return 0;
  return revenue / leads;
}

export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
}

export function calculateConfidenceLevel(
  variant1: { conversions: number; visitors: number },
  variant2: { conversions: number; visitors: number }
): number {
  const rate1 = variant1.conversions / variant1.visitors;
  const rate2 = variant2.conversions / variant2.visitors;
  
  const standardError = Math.sqrt(
    (rate1 * (1 - rate1)) / variant1.visitors +
    (rate2 * (1 - rate2)) / variant2.visitors
  );
  
  const zScore = Math.abs(rate1 - rate2) / standardError;
  
  // Convert z-score to confidence level
  return (1 - 0.5 * Math.erfc(zScore / Math.sqrt(2))) * 100;
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}