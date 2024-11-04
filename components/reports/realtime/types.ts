export interface UtmTags {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Source {
  name: string;
  referralUrl: string | null;
}

export interface LandingPage {
  name: string;
  path: string;
}

export interface BaseItem {
  id: string;
  visitId: string;
  ipAddress: string;
  location: string;
  source: Source;
  status: string;
  utmTags: UtmTags;
  pageViews: number;
  timeOnSite: string;
  currentPage: string;
  landingPage: LandingPage;
  lastActivity: string;
}

export interface LeadItem extends Omit<BaseItem, 'source' | 'landingPage'> {
  leadDetails: LeadDetails;
  value: number;
  source: string;
  landingPage: string;
}

export interface Metrics {
  lastMinute: number;
  lastFiveMinutes: number;
  lastFifteenMinutes: number;
}

export interface FeedData {
  metrics: Metrics;
  items: BaseItem[] | LeadItem[];
}

export type FeedType = "visitors" | "leads" | "clicks" | "transfers" | "conversions";