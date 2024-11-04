export const USER_PARAMETERS = [
  { label: "First Name", value: "{firstName}" },
  { label: "Last Name", value: "{lastName}" },
  { label: "Email", value: "{email}" },
  { label: "Phone", value: "{phone}" },
  { label: "Address", value: "{address}" },
  { label: "City", value: "{city}" },
  { label: "State", value: "{state}" },
  { label: "Zip Code", value: "{zipcode}" },
  { label: "Birth Month", value: "{dob_mm}" },
  { label: "Birth Day", value: "{dob_dd}" },
  { label: "Birth Year", value: "{dob_yyyy}" },
];

export const UTM_PARAMETERS = [
  { label: "UTM Source", value: "{utm_source}" },
  { label: "UTM Medium", value: "{utm_medium}" },
  { label: "UTM Campaign", value: "{utm_campaign}" },
  { label: "UTM Content", value: "{utm_content}" },
  { label: "UTM Term", value: "{utm_term}" },
];

export const TRACKING_PARAMETERS = [
  { label: "Click ID", value: "{click_id}" },
  { label: "Offer ID", value: "{offer_id}" },
  { label: "Network ID", value: "{network_id}" },
  { label: "Source ID", value: "{source_id}" },
  { label: "Campaign ID", value: "{campaign_id}" },
  { label: "Affiliate ID", value: "{affiliate_id}" },
  { label: "Pre-ping ID", value: "{prePingId}" },
];

// Combined parameters for backward compatibility
export const AVAILABLE_PARAMETERS = [
  ...USER_PARAMETERS,
  ...UTM_PARAMETERS,
  ...TRACKING_PARAMETERS
];