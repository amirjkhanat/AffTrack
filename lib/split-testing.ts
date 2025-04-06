import { SplitTest } from '@prisma/client';

interface SplitTestWithVariants extends SplitTest {
  variants: {
    id: string;
    weight: number;
    offer: {
      id: string;
      url: string;
    };
  }[];
}

export async function getWeightedSplitTestOffer(splitTest: SplitTestWithVariants) {
  // Calculate total weight
  const totalWeight = splitTest.variants.reduce((sum, variant) => sum + variant.weight, 0);
  
  // Generate random number between 0 and total weight
  const random = Math.random() * totalWeight;
  
  // Find the selected variant based on weights
  let currentWeight = 0;
  for (const variant of splitTest.variants) {
    currentWeight += variant.weight;
    if (random <= currentWeight) {
      return variant.offer;
    }
  }
  
  // Fallback to first variant if something goes wrong
  return splitTest.variants[0]?.offer;
}