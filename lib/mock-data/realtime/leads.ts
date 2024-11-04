import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { LeadItem } from '@/components/reports/realtime/types';

export const generateLead = (): LeadItem => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const visitId = uuidv4();
  
  return {
    id: uuidv4(),
    visitId,
    ipAddress: faker.internet.ip(),
    location: `${faker.location.city()}, ${faker.location.countryCode()}`,
    timestamp: faker.date.recent({ days: 1 }).toISOString(),
    source: faker.helpers.arrayElement(['Facebook Ads', 'Google Ads', 'Email Campaign', 'Direct']),
    landingPage: faker.helpers.arrayElement([
      'Weight Loss Landing Page',
      'Health Insurance LP',
      'Medicare Advantage LP',
      'ACA Special Enrollment LP'
    ]),
    utmTags: {
      utm_source: faker.helpers.arrayElement(['facebook', 'google', 'email', '']),
      utm_medium: faker.helpers.arrayElement(['cpc', 'email', 'social', '']),
      utm_campaign: faker.helpers.arrayElement(['weight_loss_q1', 'health_insurance_2024', 'medicare_aep', '']),
      utm_content: faker.helpers.arrayElement(['ad1', 'ad2', 'banner1', '']),
      utm_term: faker.helpers.arrayElement(['weight loss', 'health insurance', 'medicare', '']),
    },
    leadDetails: {
      firstName,
      lastName,
      email,
      phone: faker.phone.number(),
      age: faker.number.int({ min: 18, max: 65 }),
      interests: faker.helpers.arrayElements(
        ['Weight Loss', 'Fitness', 'Investing', 'Crypto', 'Health', 'Finance'],
        { min: 1, max: 3 }
      ),
      optIns: {
        aca_optin: faker.datatype.boolean(),
        mva_optin: faker.datatype.boolean(),
        health_ins_optin: faker.datatype.boolean(),
        newsletter_optin: faker.datatype.boolean(),
        sms_optin: faker.datatype.boolean()
      }
    },
    value: faker.number.float({ min: 10, max: 200, precision: 0.01 }),
    referralUrl: faker.internet.url(),
    sourceName: faker.helpers.arrayElement(['Facebook', 'Google', 'Email Service', 'Direct Traffic']),
  };
};

export const generateLeads = (count: number = 20): LeadItem[] => {
  return Array.from({ length: count }, generateLead).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};