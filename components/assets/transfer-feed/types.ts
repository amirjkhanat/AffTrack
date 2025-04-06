export interface FormDataPair {
  key: string;
  value: string;
}

export interface PrePingConfig {
  enabled: boolean;
  method: string;
  url: string;
  urlParams: FormDataPair[];
  headers: string;
  bodyType: "json" | "formData";
  jsonBody: string;
  formDataPairs: FormDataPair[];
  successSearch: string;
  responseMapping: {
    enabled: boolean;
    idPath: string;
    requestField: string;
  };
}

export interface DayPartingSchedule {
  enabled: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  startTime: string;
  endTime: string;
}

export interface TransferCondition {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains" | "matches" | "not_matches";
  value: string;
}

export interface TransferFeedFormData {
  id: string;
  partnerId: string;
  name: string;
  description: string;
  method: string;
  webhookUrl: string;
  headers: string;
  bodyType: "json" | "formData";
  jsonBody: string;
  formDataPairs: FormDataPair[];
  successSearch: string;
  payoutType: "static" | "dynamic";
  payoutAmount: string;
  payoutPath: string;
  testMode: boolean;
  startDate: string;
  endDate: string;
  dayParting: DayPartingSchedule;
  capConfig: {
    enabled: boolean;
    type: "daily" | "weekly" | "monthly" | "none";
    value: number;
  };
  transferTiming: {
    enabled: boolean;
    type: "realtime" | "aged30" | "aged60" | "aged90";
  };
  conditions: TransferCondition[];
  prePing: PrePingConfig;
  status: "ACTIVE" | "INACTIVE" | "TESTING";
}