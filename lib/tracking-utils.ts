import { trackingConfig } from './tracking-config';

export function generateTrackingUrl(params: {
  offerId: string;
  campaignId?: string;
  sourceId?: string;
  customParams?: Record<string, string>;
}) {
  const url = new URL(`${trackingConfig.domain}/${params.sourceId ? 'v' : 'c'}/${params.offerId}`);
  
  // Add standard tracking parameters
  if (params.campaignId) {
    url.searchParams.set(trackingConfig.params.campaign, params.campaignId);
  }
  if (params.sourceId) {
    url.searchParams.set(trackingConfig.params.source, params.sourceId);
  }
  
  // Add any custom parameters
  if (params.customParams) {
    Object.entries(params.customParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  
  return url.toString();
} 