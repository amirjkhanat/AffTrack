import { Prisma } from '@prisma/client';

export function buildDateRangeFilter(startDate?: Date, endDate?: Date) {
  if (!startDate && !endDate) return {};

  return {
    createdAt: {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate })
    }
  };
}

export function buildStatusFilter(status?: string) {
  if (!status) return {};
  return { status };
}

export function buildSourceFilter(sourceId?: string) {
  if (!sourceId) return {};
  return { trafficSourceId: sourceId };
}

export function buildNetworkFilter(network?: string) {
  if (!network) return {};
  return { 
    offer: {
      network
    }
  };
}

export function buildUtmFilter(utm: {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}) {
  const filter: any = {};
  
  if (utm.source) filter.utmSource = utm.source;
  if (utm.medium) filter.utmMedium = utm.medium;
  if (utm.campaign) filter.utmCampaign = utm.campaign;
  if (utm.content) filter.utmContent = utm.content;
  if (utm.term) filter.utmTerm = utm.term;
  
  return Object.keys(filter).length > 0 ? filter : {};
}