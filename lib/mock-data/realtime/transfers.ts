"use client";

import { faker } from "@faker-js/faker";
import type { RealtimeLead } from "./leads";

export interface RealtimeTransfer extends Pick<RealtimeLead, 
  "id" | "ipAddress" | "location" | "timestamp" | "source" | "utmTags" | "leadDetails"
> {
  leadId: string;
  network: string;
  offer: string;
  payout: number;
  status: "pending" | "accepted" | "rejected";
  transferTime: string;
  responseData: {
    id: string;
    status: string;
    message: string;
  };
  prePingResult?: {
    success: boolean;
    message: string;
    validationId?: string;
  };
  conditions: {
    field: string;
    result: boolean;
    message: string;
  }[];
}

const NETWORKS = [
  "ClickBank",
  "MaxBounty",
  "JVZoo",
  "WarriorPlus",
  "DigiStore24"
];

const OFFERS = [
  { name: "Weight Loss Program", payoutRange: [45, 97] },
  { name: "Crypto Trading Course", payoutRange: [35, 85] },
  { name: "Fitness Program", payoutRange: [40, 90] },
  { name: "Investment Guide", payoutRange: [30, 75] },
  { name: "Health Supplements", payoutRange: [25, 65] }
];

const CONDITIONS = [
  { field: "Age", message: "Age requirement met" },
  { field: "Location", message: "Geographic targeting matched" },
  { field: "Email Domain", message: "Valid email domain" },
  { field: "Phone Type", message: "Mobile phone verified" },
  { field: "Opt-in Status", message: "All required opt-ins confirmed" }
];

const RESPONSE_MESSAGES = {
  accepted: [
    "Lead successfully transferred",
    "Buyer criteria matched",
    "Transfer completed successfully",
    "Lead accepted by network"
  ],
  rejected: [
    "Duplicate lead",
    "Invalid email domain",
    "Age requirement not met",
    "Geographic restriction"
  ],
  pending: [
    "Processing transfer",
    "Awaiting network response",
    "Validating lead data",
    "Transfer in progress"
  ]
};

export const generateTransfer = (): RealtimeTransfer => {
  const network = faker.helpers.arrayElement(NETWORKS);
  const offer = faker.helpers.arrayElement(OFFERS);
  const status = faker.helpers.arrayElement(["pending", "accepted", "rejected"]);
  const prePingEnabled = faker.datatype.boolean();

  return {
    id: faker.string.uuid(),
    leadId: faker.string.uuid(),
    ipAddress: faker.internet.ip(),
    location: `${faker.location.city()}, ${faker.location.countryCode()}`,
    timestamp: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
    source: faker.helpers.arrayElement(["Facebook Ads", "Google Ads", "Email", "Direct"]),
    network,
    offer: offer.name,
    payout: faker.number.float({ 
      min: offer.payoutRange[0], 
      max: offer.payoutRange[1], 
      precision: 0.01 
    }),
    status,
    transferTime: `${faker.number.int({ min: 1, max: 59 })} seconds ago`,
    utmTags: {
      utm_source: faker.helpers.arrayElement(["facebook", "google", "email", null]),
      utm_medium: faker.helpers.arrayElement(["cpc", "email", "social", null]),
      utm_campaign: faker.helpers.arrayElement(["summer_sale", "black_friday", null]),
      utm_content: faker.helpers.arrayElement(["banner_1", "popup_2", null]),
      utm_term: faker.helpers.arrayElement(["weight_loss", "crypto", null])
    },
    leadDetails: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      age: faker.number.int({ min: 18, max: 65 }),
      interests: faker.helpers.arrayElements(
        ["Weight Loss", "Fitness", "Investing", "Crypto", "Health", "Finance"],
        { min: 1, max: 3 }
      )
    },
    responseData: {
      id: faker.string.uuid(),
      status: status,
      message: faker.helpers.arrayElement(RESPONSE_MESSAGES[status])
    },
    ...(prePingEnabled && {
      prePingResult: {
        success: faker.datatype.boolean(),
        message: faker.helpers.arrayElement([
          "Pre-ping validation successful",
          "Invalid lead data",
          "Rate limit exceeded",
          "Network unavailable"
        ]),
        ...(faker.datatype.boolean() && {
          validationId: faker.string.uuid()
        })
      }
    }),
    conditions: faker.helpers.arrayElements(
      CONDITIONS,
      { min: 2, max: 4 }
    ).map(condition => ({
      field: condition.field,
      result: faker.datatype.boolean(),
      message: condition.message
    }))
  };
};