"use client";

import { faker } from "@faker-js/faker";

export const generateUtmTags = () => ({
  utm_source: faker.helpers.arrayElement(["facebook", "google", "email", null]),
  utm_medium: faker.helpers.arrayElement(["cpc", "email", "social", null]),
  utm_campaign: faker.helpers.arrayElement(["summer_sale", "black_friday", null]),
  utm_content: faker.helpers.arrayElement(["banner_1", "popup_2", null]),
  utm_term: faker.helpers.arrayElement(["weight_loss", "crypto", null])
});

export const generateMetrics = (type: string) => {
  const baseNumber = faker.number.int({ min: 100, max: 500 });
  
  return {
    lastMinute: Math.floor(baseNumber / 4),
    lastFiveMinutes: baseNumber,
    lastFifteenMinutes: baseNumber * 3
  };
};