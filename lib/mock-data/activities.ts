import { faker } from "@faker-js/faker";

export interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  action: "created" | "updated" | "deleted" | "configured" | "reactivated";
  targetType: "user" | "offer" | "transfer" | "tracking" | "permission";
  target: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const ACTIONS = ["created", "updated", "deleted", "configured", "reactivated"];
const TARGET_TYPES = ["user", "offer", "transfer", "tracking", "permission"];

const generateActivityDetails = (action: string, targetType: string, target: string) => {
  switch (action) {
    case "created":
      return `Created new ${targetType} "${target}"`;
    case "updated":
      return `Modified ${targetType} settings for "${target}"`;
    case "deleted":
      return `Removed ${targetType} "${target}"`;
    case "configured":
      return `Adjusted configuration for ${targetType} "${target}"`;
    case "reactivated":
      return `Reactivated ${targetType} "${target}"`;
    default:
      return `Performed action on ${targetType} "${target}"`;
  }
};

const generateTarget = (targetType: string) => {
  switch (targetType) {
    case "user":
      return faker.person.fullName();
    case "offer":
      return faker.helpers.arrayElement([
        "Weight Loss Program",
        "Crypto Trading Course",
        "Fitness Program",
        "Investment Guide"
      ]);
    case "transfer":
      return faker.helpers.arrayElement([
        "MaxBounty Feed",
        "ClickBank Integration",
        "JVZoo Transfer",
        "Direct API"
      ]);
    case "tracking":
      return faker.helpers.arrayElement([
        "Facebook Campaign",
        "Google Ads Link",
        "Email Tracking",
        "Native Ads"
      ]);
    case "permission":
      return faker.helpers.arrayElement([
        "Admin Access",
        "Manager Role",
        "User Permissions",
        "API Keys"
      ]);
    default:
      return "Unknown Target";
  }
};

export const generateMockActivities = (count: number = 50): Activity[] => {
  return Array.from({ length: count }, () => {
    const action = faker.helpers.arrayElement(ACTIONS);
    const targetType = faker.helpers.arrayElement(TARGET_TYPES);
    const target = generateTarget(targetType);

    return {
      id: faker.string.uuid(),
      user: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        role: faker.helpers.arrayElement(["admin", "manager", "user"]),
      },
      action: action as Activity["action"],
      targetType: targetType as Activity["targetType"],
      target,
      details: generateActivityDetails(action, targetType, target),
      timestamp: faker.date.recent().toLocaleString(),
      metadata: {
        ip: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        location: `${faker.location.city()}, ${faker.location.countryCode()}`,
      },
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};