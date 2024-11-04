"use client";

import { faker } from "@faker-js/faker";
import { generateUtmTags } from "./shared";

export interface RealtimeVisitor {
  id: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  referrer: string | null;
  sourceName: string;
  landingPage: {
    name: string;
    path: string;
  };
  utmTags: Record<string, string | null>;
  pageViews: number;
  timeOnSite: string;
  currentPage: string;
  lastActivity: string;
  leadDetails: {
    firstName: string;
    lastName: string;
  } | null;
}

const LANDING_PAGES = [
  { name: "Weight Loss LP", path: "/weight-loss" },
  { name: "Crypto Trading LP", path: "/crypto" },
  { name: "Fitness Program LP", path: "/fitness" },
  { name: "Investment Guide LP", path: "/invest" },
  { name: "Health Products LP", path: "/health" },
  { name: "Meditation Course LP", path: "/meditation" },
  { name: "Forex System LP", path: "/forex" },
  { name: "Personal Dev LP", path: "/personal-dev" }
];

const TRAFFIC_SOURCES = [
  "Facebook Ads",
  "Google Ads",
  "Native Ads",
  "Email Campaign",
  "Push Notifications",
  "Direct Traffic",
  "Organic Search",
  "Social Media"
];

const REFERRERS = [
  "facebook.com",
  "google.com",
  "instagram.com",
  "twitter.com",
  "youtube.com",
  "pinterest.com",
  "linkedin.com",
  null // Direct traffic
];

export const generateVisitor = (): RealtimeVisitor => {
  const landingPage = faker.helpers.arrayElement(LANDING_PAGES);
  const pageViews = faker.number.int({ min: 1, max: 10 });
  const minutes = faker.number.int({ min: 0, max: 10 });
  const seconds = faker.number.int({ min: 0, max: 59 });
  const hasLead = faker.datatype.boolean({ probability: 0.3 });
  
  return {
    id: faker.string.uuid(),
    ipAddress: faker.internet.ip(),
    location: `${faker.location.city()}, ${faker.location.countryCode()}`,
    timestamp: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
    referrer: faker.helpers.arrayElement(REFERRERS),
    sourceName: faker.helpers.arrayElement(TRAFFIC_SOURCES),
    landingPage,
    utmTags: generateUtmTags(),
    pageViews,
    timeOnSite: `${minutes}m ${seconds}s`,
    currentPage: landingPage.path,
    lastActivity: `${faker.number.int({ min: 1, max: 30 })} seconds ago`,
    leadDetails: hasLead ? {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName()
    } : null
  };
};