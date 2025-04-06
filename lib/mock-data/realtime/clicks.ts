import { faker } from "@faker-js/faker";
import { generateUtmTags } from "./shared";

export interface RealtimeClick {
  id: string;
  visitId: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  visitDetails: {
    landingPage: string;
    currentPage: string;
    referrer: string | null;
  };
  placement: {
    id: string;
    name: string;
    type: "banner" | "native" | "popup" | "widget";
    url: string;
    location: string;
  };
  offer: {
    id: string;
    name: string;
    network: string;
    payout: number;
  };
  source: {
    name: string;
    referrer: string | null;
  };
  utmTags: Record<string, string | null>;
  transferId: string | null;
  conversionId: string | null;
  leadDetails: {
    firstName: string;
    lastName: string;
  } | null;
}

const PLACEMENTS = [
  { 
    name: "Homepage Hero Banner", 
    type: "banner", 
    location: "/"
  },
  { 
    name: "Sidebar Featured Offer", 
    type: "widget", 
    location: "/blog"
  },
  { 
    name: "In-Content Native Ad", 
    type: "native", 
    location: "/blog/weight-loss-tips"
  },
  { 
    name: "Exit Intent Popup", 
    type: "popup", 
    location: "/products"
  },
  { 
    name: "Footer CTA Banner", 
    type: "banner", 
    location: "/about"
  },
  { 
    name: "Recommended Products", 
    type: "native", 
    location: "/products"
  },
  { 
    name: "Welcome Overlay", 
    type: "popup", 
    location: "/"
  },
  { 
    name: "Featured Deal Widget", 
    type: "widget", 
    location: "/deals"
  }
];

const OFFERS = [
  { name: "Weight Loss Program", network: "ClickBank", payoutRange: [45, 97] },
  { name: "Crypto Trading Course", network: "MaxBounty", payoutRange: [35, 85] },
  { name: "Fitness Program", network: "JVZoo", payoutRange: [40, 90] },
  { name: "Investment Guide", network: "WarriorPlus", payoutRange: [30, 75] },
  { name: "Health Supplements", network: "ClickBank", payoutRange: [25, 65] },
  { name: "Meditation Course", network: "JVZoo", payoutRange: [20, 55] },
  { name: "Forex Trading System", network: "MaxBounty", payoutRange: [50, 120] },
  { name: "Personal Development", network: "WarriorPlus", payoutRange: [30, 80] }
];

const TRAFFIC_SOURCES = [
  { name: "Facebook Ads", referrer: "facebook.com" },
  { name: "Google Ads", referrer: "google.com" },
  { name: "Native Ads", referrer: "outbrain.com" },
  { name: "Email Campaign", referrer: null },
  { name: "Push Notifications", referrer: null },
  { name: "Direct Traffic", referrer: null },
  { name: "Organic Search", referrer: "google.com" },
  { name: "Social Media", referrer: "instagram.com" }
];

const LANDING_PAGES = [
  "Weight Loss Landing Page",
  "Crypto Trading Landing Page",
  "Fitness Program Landing Page",
  "Investment Guide Landing Page"
];

export const generateClick = (): RealtimeClick => {
  const placement = faker.helpers.arrayElement(PLACEMENTS);
  const offer = faker.helpers.arrayElement(OFFERS);
  const source = faker.helpers.arrayElement(TRAFFIC_SOURCES);
  const hasTransfer = faker.datatype.boolean({ probability: 0.3 });
  const hasConversion = hasTransfer && faker.datatype.boolean({ probability: 0.2 });
  const hasLead = faker.datatype.boolean({ probability: 0.4 });
  
  return {
    id: faker.string.uuid(),
    visitId: faker.string.uuid(),
    timestamp: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
    ipAddress: faker.internet.ip(),
    location: `${faker.location.city()}, ${faker.location.countryCode()}`,
    visitDetails: {
      landingPage: faker.helpers.arrayElement(LANDING_PAGES),
      currentPage: placement.location,
      referrer: source.referrer
    },
    placement: {
      id: faker.string.uuid(),
      name: placement.name,
      type: placement.type as any,
      url: faker.internet.url(),
      location: placement.location
    },
    offer: {
      id: faker.string.uuid(),
      name: offer.name,
      network: offer.network,
      payout: faker.number.float({ 
        min: offer.payoutRange[0], 
        max: offer.payoutRange[1], 
        precision: 0.01 
      })
    },
    source: {
      name: source.name,
      referrer: source.referrer
    },
    utmTags: generateUtmTags(),
    transferId: hasTransfer ? faker.string.uuid() : null,
    conversionId: hasConversion ? faker.string.uuid() : null,
    leadDetails: hasLead ? {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName()
    } : null
  };
};