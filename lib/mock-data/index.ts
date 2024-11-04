import { faker } from "@faker-js/faker";

const generateUtmTags = () => ({
  utm_source: faker.helpers.arrayElement(["facebook", "google", "email", ""]),
  utm_medium: faker.helpers.arrayElement(["cpc", "email", "social", ""]),
  utm_campaign: faker.helpers.arrayElement(["summer_sale", "black_friday", "new_year", ""]),
  utm_content: faker.helpers.arrayElement(["banner_1", "popup_2", "sidebar_3", ""]),
  utm_term: faker.helpers.arrayElement(["weight_loss", "fitness", "health", ""]),
});

const generateVisitor = () => ({
  id: faker.string.uuid(),
  ipAddress: faker.internet.ip(),
  location: `${faker.location.city()}, ${faker.location.countryCode()}`,
  source: faker.helpers.arrayElement(["Facebook Ads", "Google Ads", "Email", "Direct"]),
  currentPage: faker.helpers.arrayElement([
    "/landing/weight-loss",
    "/landing/fitness",
    "/landing/health",
    "/checkout",
    "/thank-you"
  ]),
  status: faker.helpers.arrayElement(["active", "inactive"]),
  timeOnSite: `${faker.number.int({ min: 1, max: 59 })}m ${faker.number.int({ min: 1, max: 59 })}s`,
  pageViews: faker.number.int({ min: 1, max: 20 }),
  utmTags: generateUtmTags(),
});

const generateLead = () => ({
  id: faker.string.uuid(),
  ipAddress: faker.internet.ip(),
  location: `${faker.location.city()}, ${faker.location.countryCode()}`,
  source: faker.helpers.arrayElement(["Facebook Ads", "Google Ads", "Email", "Direct"]),
  landingPage: faker.helpers.arrayElement([
    "Weight Loss LP",
    "Fitness LP",
    "Health LP"
  ]),
  status: faker.helpers.arrayElement(["active", "duplicate"]),
  value: faker.number.float({ min: 10, max: 200, precision: 0.01 }),
  leadDetails: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  },
  pageViews: faker.number.int({ min: 1, max: 20 }),
  transfers: faker.number.int({ min: 0, max: 5 }),
  clicks: faker.number.int({ min: 0, max: 10 }),
  conversions: faker.number.int({ min: 0, max: 3 }),
  utmTags: generateUtmTags(),
});

export const realtimeData = {
  generateFeed: (type: string) => {
    const count = faker.number.int({ min: 10, max: 30 });
    return Array.from({ length: count }, () => 
      type === "leads" ? generateLead() : generateVisitor()
    );
  }
};