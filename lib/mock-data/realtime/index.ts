"use client";

import { generateVisitor } from './visitors';
import { generateLead } from './leads';
import { generateTransfer } from './transfers';
import { generateClick } from './clicks';
import { generateConversion } from './conversions';
import { generateMetrics } from './shared';

export const realtimeData = {
  generateFeed: (type: "visitors" | "leads" | "transfers" | "clicks" | "conversions", count: number = 20) => {
    const generators = {
      visitors: generateVisitor,
      leads: generateLead,
      transfers: generateTransfer,
      clicks: generateClick,
      conversions: generateConversion
    };

    return {
      metrics: generateMetrics(type),
      items: Array.from({ length: count }, generators[type])
    };
  }
};