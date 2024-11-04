import { NextRequest } from 'next/server';
import { parse } from 'accept-language-parser';
import { getGeoData } from './geo';
import { UAParser } from 'ua-parser-js';

interface ClientInfo {
  ip: string;
  userAgent: string;
  referer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  language: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
}

export async function getClientInfo(request: NextRequest): Promise<ClientInfo> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || 
             '0.0.0.0';

  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer');
  const url = new URL(request.url);
  const utmSource = url.searchParams.get('utm_source');
  const utmMedium = url.searchParams.get('utm_medium');
  const utmCampaign = url.searchParams.get('utm_campaign');
  const utmContent = url.searchParams.get('utm_content');
  const utmTerm = url.searchParams.get('utm_term');

  // Use await to get geolocation data
  const geoData = await getGeoData(ip);

  const acceptLanguage = request.headers.get('accept-language');
  const language = acceptLanguage ? parse(acceptLanguage)[0]?.code || null : null;
  const ua = new UAParser(userAgent);
  const device = ua.getDevice().type || null;
  const browser = ua.getBrowser().name || null;
  const os = ua.getOS().name || null;

  // Log headers for debugging
  console.log('IP Headers:', {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'remoteAddress': request.connection?.remoteAddress,
  });

  return {
    ip,
    userAgent,
    referer,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    country: geoData?.country || null,
    region: geoData?.region || null,
    city: geoData?.city || null,
    language,
    device,
    browser,
    os,
  };
}