"use client";

import { faker } from "@faker-js/faker";

export interface LeadActivity {
  id: string;
  type: "click" | "transfer" | "conversion";
  timestamp: string;
  details: {
    [key: string]: any;
  };
}

const generateClick = (): LeadActivity => ({
  id: faker.string.uuid(),
  type: "click",
  timestamp: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
  details: {
    placement: faker.helpers.arrayElement([
      "Homepage Banner",
      "Sidebar Ad",
      "Exit Popup",
      "In-Content Banner",
      "Footer CTA"
    ]),
    offer: faker.helpers.arrayElement([
      "Weight Loss Program",
      "Crypto Trading Course",
      "Fitness Program",
      "Investment Guide",
      "Health Supplements"
    ])
  }
});

const generateTransfer = (): LeadActivity => ({
  id: faker.string.uuid(),
  type: "transfer",
  timestamp: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
  details: {
    network: faker.helpers.arrayElement([
      "ClickBank",
      "MaxBounty",
      "JVZoo",
      "WarriorPlus",
      "DigiStore24"
    ]),
    status: faker.helpers.arrayElement(["accepted", "pending", "duplicate"]),
    transferId: faker.string.uuid(),
    payout: faker.number.float({ min: 20, max: 200, precision: 0.01 }),
    reason: faker.helpers.arrayElement([
      "Qualified lead",
      "Matched buyer criteria",
      "High-value prospect",
      "Geographic match",
      "Age qualified"
    ])
  }
});

const generateConversion = (): LeadActivity => ({
  id: faker.string.uuid(),
  type: "conversion",
  timestamp: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
  details: {
    offer: faker.helpers.arrayElement([
      "Weight Loss Program",
      "Crypto Trading Course",
      "Fitness Program",
      "Investment Guide",
      "Health Supplements"
    ]),
    value: faker.number.float({ min: 47, max: 997, precision: 0.01 }),
    transactionId: faker.string.uuid(),
    paymentMethod: faker.helpers.arrayElement([
      "Credit Card",
      "PayPal",
      "Crypto",
      "Bank Transfer"
    ]),
    upsell: faker.datatype.boolean()
  }
});

export const generateLeadActivities = (leadId: string): LeadActivity[] => {
  // Generate 2-4 clicks
  const clicks = Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, generateClick);
  
  // Generate 3-6 transfers
  const transfers = Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, generateTransfer);
  
  // Generate 1-2 conversions
  const conversions = Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, generateConversion);

  // Combine all activities and sort by timestamp
  const allActivities = [...clicks, ...transfers, ...conversions];
  
  // Sort activities to make them appear in a realistic chronological order
  return allActivities.sort((a, b) => {
    const timeA = parseInt(a.timestamp.split(' ')[0]);
    const timeB = parseInt(b.timestamp.split(' ')[0]);
    return timeB - timeA;
  });
};