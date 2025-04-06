"use client";

import { faker } from "@faker-js/faker";
import { generateUtmTags } from "./shared";

export interface RealtimeConversion {
  id: string;
  clickId: string;
  transferId: string | null;
  timestamp: string;
  ipAddress: string;
  location: string;
  source: {
    name: string;
    referrer: string | null;
  };
  landingPage: string;
  placement: string;
  offer: {
    id: string;
    name: string;
    network: string;
    type: "CPA" | "CPC" | "CPL" | "REVSHARE";
    payout: number;
  };
  conversionDetails: {
    value: number;
    status: "completed" | "pending" | "refunded";
    paymentMethod: "credit_card" | "paypal" | "crypto" | "bank_transfer";
    transactionId: string;
    upsell: boolean;
    products: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  leadDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  utmTags: Record<string, string | null>;
  response: {
    status: string;
    message: string;
    raw: Record<string, any>;
    timestamp: string;
  };
}

const OFFERS = [
  { name: "Weight Loss Program", network: "ClickBank", type: "CPA", payoutRange: [47, 297] },
  { name: "Crypto Trading Course", network: "MaxBounty", type: "CPL", payoutRange: [67, 497] },
  { name: "Fitness Program", network: "JVZoo", type: "REVSHARE", payoutRange: [37, 197] },
  { name: "Investment Guide", network: "WarriorPlus", type: "CPC", payoutRange: [97, 997] }
];

const LANDING_PAGES = [
  "Weight Loss Landing Page",
  "Crypto Trading Landing Page",
  "Fitness Program Landing Page",
  "Investment Guide Landing Page"
];

const PLACEMENTS = [
  "Homepage Banner",
  "Sidebar Widget",
  "Exit Intent Popup",
  "In-Content Native Ad",
  "Footer CTA"
];

const PRODUCTS = [
  { name: "Core Program", priceRange: [47, 97] },
  { name: "Premium Package", priceRange: [197, 297] },
  { name: "VIP Coaching", priceRange: [497, 997] },
  { name: "Monthly Subscription", priceRange: [27, 47] }
];

const PAYMENT_METHODS = [
  "credit_card",
  "paypal",
  "crypto",
  "bank_transfer"
] as const;

const RESPONSE_MESSAGES = {
  completed: [
    "Payment processed successfully",
    "Order confirmed and processed",
    "Transaction completed successfully",
    "Payment verified and approved"
  ],
  pending: [
    "Payment verification in progress",
    "Awaiting payment confirmation",
    "Processing transaction",
    "Order pending approval"
  ],
  refunded: [
    "Refund processed successfully",
    "Payment reversed per customer request",
    "Chargeback processed",
    "Refund completed"
  ]
};

export const generateConversion = (): RealtimeConversion => {
  const offer = faker.helpers.arrayElement(OFFERS);
  const status = faker.helpers.arrayElement(["completed", "pending", "refunded"] as const);
  const hasLead = faker.datatype.boolean({ probability: 0.8 });
  const productCount = faker.number.int({ min: 1, max: 3 });
  const products = Array.from({ length: productCount }, () => {
    const product = faker.helpers.arrayElement(PRODUCTS);
    return {
      id: faker.string.uuid(),
      name: product.name,
      price: faker.number.float({ min: product.priceRange[0], max: product.priceRange[1], precision: 0.01 }),
      quantity: faker.number.int({ min: 1, max: 3 })
    };
  });

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const hasUpsell = products.length > 1;

  return {
    id: faker.string.uuid(),
    clickId: faker.string.uuid(),
    transferId: faker.datatype.boolean({ probability: 0.7 }) ? faker.string.uuid() : null,
    timestamp: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
    ipAddress: faker.internet.ip(),
    location: `${faker.location.city()}, ${faker.location.countryCode()}`,
    source: {
      name: faker.helpers.arrayElement([
        "Facebook Ads",
        "Google Ads",
        "Email Campaign",
        "Direct Traffic",
        "Affiliate Link"
      ]),
      referrer: faker.helpers.arrayElement([
        "facebook.com",
        "google.com",
        "email-link",
        null
      ])
    },
    landingPage: faker.helpers.arrayElement(LANDING_PAGES),
    placement: faker.helpers.arrayElement(PLACEMENTS),
    offer: {
      id: faker.string.uuid(),
      name: offer.name,
      network: offer.network,
      type: offer.type,
      payout: faker.number.float({ 
        min: offer.payoutRange[0], 
        max: offer.payoutRange[1], 
        precision: 0.01 
      })
    },
    conversionDetails: {
      value: totalValue,
      status,
      paymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
      transactionId: faker.string.uuid(),
      upsell: hasUpsell,
      products
    },
    leadDetails: hasLead ? {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number()
    } : null,
    utmTags: generateUtmTags(),
    response: {
      status,
      message: faker.helpers.arrayElement(RESPONSE_MESSAGES[status]),
      raw: {
        transaction_id: faker.string.uuid(),
        processor_id: faker.string.alphanumeric(10).toUpperCase(),
        timestamp: faker.date.recent().toISOString(),
        payment_details: {
          method: faker.helpers.arrayElement(PAYMENT_METHODS),
          last4: status !== "refunded" ? faker.finance.creditCardNumber('####') : null,
          processor_response: faker.number.int({ min: 1000, max: 9999 }).toString()
        }
      },
      timestamp: faker.date.recent().toISOString()
    }
  };
};