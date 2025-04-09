/**
 * Константы для типов активности в системе
 * Использование констант вместо строковых литералов помогает избежать опечаток
 * и обеспечивает согласованность в коде
 */

export const ACTIVITY_TYPES = {
  USER: 'USER',
  TRAFFIC_SOURCE: 'TRAFFIC_SOURCE',
  LANDING_PAGE: 'LANDING_PAGE',
  AD_PLACEMENT: 'AD_PLACEMENT',
  OFFER: 'OFFER',
  TRACKING_LINK: 'TRACKING_LINK',
  SPLIT_TEST: 'SPLIT_TEST',
  TRANSFER_FEED: 'TRANSFER_FEED',
  TRANSFER_PARTNER: 'TRANSFER_PARTNER',
  SYSTEM: 'SYSTEM',
  AFFILIATE_NETWORK: 'AFFILIATE_NETWORK'
} as const;

export const ACTIVITY_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
  CONFIGURE: 'CONFIGURE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  TRANSFER: 'TRANSFER',
  CONVERSION: 'CONVERSION'
} as const;
