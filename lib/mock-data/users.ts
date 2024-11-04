import { faker } from "@faker-js/faker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  active: boolean;
  lastLogin: string;
  createdAt: string;
}

export const generateMockUsers = (count: number = 10): User[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(["admin", "manager", "user"]),
    active: faker.datatype.boolean({ probability: 0.8 }),
    lastLogin: faker.date.recent().toLocaleDateString(),
    createdAt: faker.date.past().toISOString(),
  }));
};