"use client";

import { faker } from "@faker-js/faker";

export interface TransferAsset {
  id: string;
  name: string;
  status: "active" | "paused" | "expired";
  method: "POST" | "PUT" | "PATCH";
  endpoint: string;
  network: string;
  prePing: {
    enabled: boolean;
    endpoint: string;
    successPattern: string;
    idMapping: {
      enabled: boolean;
      responsePath: string;
      requestField: string;
    }
  };
  conditions: {
    field: string;
    operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains" | "matches" | "not_matches";
    value: string;
  }[];
  timing: {
    type: "realtime" | "aged30" | "aged60" | "aged90";
    dayParting: {
      enabled: boolean;
      days: string[];
      startTime: string;
      endTime: string;
    };
    caps: {
      enabled: boolean;
      type: "daily" | "weekly" | "monthly";
      limit: number;
    }
  };
  payout: {
    type: "static" | "dynamic";
    value: number | string;
  };
  stats: {
    totalTransfers: number;
    successRate: number;
    avgResponseTime: number;
    lastTransfer: string;
    recentErrors: {
      message: string;
      timestamp: string;
      count: number;
    }[];
  };
}

export const generateTransferAsset = (): TransferAsset => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement([
    "ClickBank Direct API",
    "MaxBounty Lead Feed",
    "JVZoo Integration",
    "WarriorPlus Webhook",
    "DigiStore24 Transfer",
    "Affiliate Network API"
  ]),
  status: faker.helpers.arrayElement(["active", "paused", "expired"]),
  method: faker.helpers.arrayElement(["POST", "PUT", "PATCH"]),
  endpoint: faker.internet.url() + "/webhook",
  network: faker.helpers.arrayElement([
    "ClickBank",
    "MaxBounty",
    "JVZoo",
    "WarriorPlus",
    "DigiStore24"
  ]),
  prePing: {
    enabled: faker.datatype.boolean(),
    endpoint: faker.internet.url() + "/validate",
    successPattern: faker.helpers.arrayElement([
      "status: success",
      "valid: true",
      "qualified: true",
      "response.data.valid === true"
    ]),
    idMapping: {
      enabled: faker.datatype.boolean(),
      responsePath: "data.validation_id",
      requestField: "pre_ping_id"
    }
  },
  conditions: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
    field: faker.helpers.arrayElement([
      "age",
      "email_domain",
      "phone_type",
      "state",
      "optin_status",
      "ip_country"
    ]),
    operator: faker.helpers.arrayElement([
      "equals",
      "not_equals",
      "greater_than",
      "less_than",
      "contains",
      "not_contains"
    ]) as any,
    value: faker.helpers.arrayElement([
      "18",
      "gmail.com",
      "mobile",
      "CA",
      "true",
      "US"
    ])
  })),
  timing: {
    type: faker.helpers.arrayElement(["realtime", "aged30", "aged60", "aged90"]),
    dayParting: {
      enabled: faker.datatype.boolean(),
      days: faker.helpers.arrayElements(
        ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        { min: 3, max: 7 }
      ),
      startTime: "09:00",
      endTime: "17:00"
    },
    caps: {
      enabled: faker.datatype.boolean(),
      type: faker.helpers.arrayElement(["daily", "weekly", "monthly"]),
      limit: faker.number.int({ min: 100, max: 10000 })
    }
  },
  payout: {
    type: faker.helpers.arrayElement(["static", "dynamic"]),
    value: faker.helpers.arrayElement([
      faker.number.float({ min: 20, max: 200, precision: 0.01 }),
      "response.data.payout",
      "data.commission"
    ])
  },
  stats: {
    totalTransfers: faker.number.int({ min: 1000, max: 100000 }),
    successRate: faker.number.float({ min: 75, max: 99, precision: 0.1 }),
    avgResponseTime: faker.number.int({ min: 100, max: 2000 }),
    lastTransfer: faker.date.recent().toISOString(),
    recentErrors: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      message: faker.helpers.arrayElement([
        "Invalid email domain",
        "Duplicate lead",
        "Age requirement not met",
        "Geographic restriction",
        "Missing required field",
        "API timeout"
      ]),
      timestamp: faker.date.recent().toISOString(),
      count: faker.number.int({ min: 1, max: 100 })
    }))
  }
});

export const generateTransferAssets = (count: number = 5): TransferAsset[] => {
  return Array.from({ length: count }, generateTransferAsset);
};