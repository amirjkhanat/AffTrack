export const trackingConfig = {
  domain: process.env.NEXT_PUBLIC_TRACKING_DOMAIN || 'https://track.yourdomain.com',
  params: {
    visit: process.env.NEXT_PUBLIC_VISIT_PARAM || 'visit_id',
    click: process.env.NEXT_PUBLIC_CLICK_PARAM || 'click_id',
    lead: process.env.NEXT_PUBLIC_LEAD_PARAM || 'lead_id',
    source: process.env.NEXT_PUBLIC_SOURCE_PARAM || 'source_id',    
  }
}; 