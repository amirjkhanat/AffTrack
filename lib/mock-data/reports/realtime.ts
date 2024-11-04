export const realtimeData = {
  metrics: {
    lastMinute: 247,
    lastFiveMinutes: 1482,
    lastFifteenMinutes: 3891
  },
  generateVisitor: () => ({
    id: `visit-${Math.random().toString(36).substr(2, 9)}`,
    ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    location: ["New York, USA", "London, UK", "Paris, FR", "Tokyo, JP"][Math.floor(Math.random() * 4)],
    timestamp: `${Math.floor(Math.random() * 60)} seconds ago`,
    timeOnSite: `${Math.floor(Math.random() * 5)}m ${Math.floor(Math.random() * 60)}s`,
    source: ["Facebook Ads", "Google Ads", "Email", "Direct"][Math.floor(Math.random() * 4)],
    utmTags: {
      source: ["facebook", "google", "email", null][Math.floor(Math.random() * 4)],
      medium: ["cpc", "email", "social", null][Math.floor(Math.random() * 4)],
      campaign: ["summer_sale", "black_friday", null][Math.floor(Math.random() * 3)],
      term: ["weight_loss", "crypto", null][Math.floor(Math.random() * 3)],
      content: ["banner_1", "sidebar_2", null][Math.floor(Math.random() * 3)],
    },
    landingPage: ["Weight Loss LP", "Crypto LP", "Fitness LP"][Math.floor(Math.random() * 3)],
    currentPage: ["/", "/products", "/about", "/contact"][Math.floor(Math.random() * 4)],
    status: ["active", "inactive", "bounced"][Math.floor(Math.random() * 3)],
    pageViews: Math.floor(Math.random() * 5) + 1,
    clicks: Math.floor(Math.random() * 3),
    conversions: Math.random() > 0.8 ? 1 : 0,
    leads: Math.random() > 0.7 ? 1 : 0,
    lastActivity: `${Math.floor(Math.random() * 5)} seconds ago`,
  }),
  generateLead: () => ({
    id: `lead-${Math.random().toString(36).substr(2, 9)}`,
    ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    location: ["New York, USA", "London, UK", "Paris, FR", "Tokyo, JP"][Math.floor(Math.random() * 4)],
    timestamp: `${Math.floor(Math.random() * 60)} seconds ago`,
    source: ["Facebook Ads", "Google Ads", "Email", "Direct"][Math.floor(Math.random() * 4)],
    utmTags: {
      source: ["facebook", "google", "email", null][Math.floor(Math.random() * 4)],
      medium: ["cpc", "email", "social", null][Math.floor(Math.random() * 4)],
      campaign: ["summer_sale", "black_friday", null][Math.floor(Math.random() * 3)],
      term: ["weight_loss", "crypto", null][Math.floor(Math.random() * 3)],
      content: ["banner_1", "sidebar_2", null][Math.floor(Math.random() * 3)],
    },
    landingPage: ["Weight Loss LP", "Crypto LP", "Fitness LP"][Math.floor(Math.random() * 3)],
    leadDetails: {
      firstName: ["John", "Jane", "Mike", "Sarah"][Math.floor(Math.random() * 4)],
      lastName: ["Smith", "Johnson", "Williams", "Brown"][Math.floor(Math.random() * 4)],
      email: `${["john", "jane", "mike", "sarah"][Math.floor(Math.random() * 4)]}@${["gmail.com", "yahoo.com", "hotmail.com"][Math.floor(Math.random() * 3)]}`,
      phone: `+1${Math.floor(Math.random() * 1000000000)}`,
      age: Math.floor(Math.random() * 40) + 20,
      interests: ["Weight Loss", "Fitness", "Investing", "Crypto"][Math.floor(Math.random() * 4)],
    },
    status: ["new", "qualified", "duplicate"][Math.floor(Math.random() * 3)],
    transferred: Math.random() > 0.7,
    transferredTo: ["ClickBank", "MaxBounty", "JVZoo"][Math.floor(Math.random() * 3)],
    value: (Math.random() * 100).toFixed(2),
    clicks: Math.floor(Math.random() * 3),
    conversions: Math.random() > 0.8 ? 1 : 0,
    transfers: Math.random() > 0.7 ? 1 : 0,
  }),
  generateFeed: (type: "visitors" | "leads" = "visitors", count: number = 20) => {
    return Array.from({ length: count }, () => 
      type === "visitors" ? realtimeData.generateVisitor() : realtimeData.generateLead()
    );
  }
};