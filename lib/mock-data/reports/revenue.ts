export const revenueData = {
  metrics: [
    {
      name: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: "DollarSign"
    },
    {
      name: "Total Clicks",
      value: "12,345",
      change: "+15.2%",
      icon: "MousePointerClick"
    },
    {
      name: "Total Leads",
      value: "2,345",
      change: "-2.3%",
      icon: "Users"
    },
    {
      name: "Conversion Rate",
      value: "19.2%",
      change: "+4.1%",
      icon: "Target"
    }
  ],
  chartData: [
    { name: 'Mon', revenue: 4000, profit: 2400 },
    { name: 'Tue', revenue: 3000, profit: 1398 },
    { name: 'Wed', revenue: 2000, profit: 9800 },
    { name: 'Thu', revenue: 2780, profit: 3908 },
    { name: 'Fri', revenue: 1890, profit: 4800 },
    { name: 'Sat', revenue: 2390, profit: 3800 },
    { name: 'Sun', revenue: 3490, profit: 4300 }
  ],
  sourceData: [
    { name: 'Facebook Ads', value: 400000, change: '+12.5%' },
    { name: 'Google Ads', value: 300000, change: '-3.2%' },
    { name: 'Email', value: 300000, change: '+8.7%' },
    { name: 'Direct', value: 200000, change: '+1.5%' }
  ],
  utmData: [
    { campaign: 'Summer_Sale', medium: 'cpc', source: 'facebook', revenue: 12000, conversions: 240 },
    { campaign: 'Black_Friday', medium: 'email', source: 'mailchimp', revenue: 8500, conversions: 170 },
    { campaign: 'Winter_Promo', medium: 'cpc', source: 'google', revenue: 15000, conversions: 300 },
    { campaign: 'Spring_Deal', medium: 'social', source: 'instagram', revenue: 6500, conversions: 130 }
  ],
  networksData: [
    { name: "ClickBank", offers: 12, clicks: 1200, conversions: 450, revenue: 45000, change: "+15.2%" },
    { name: "MaxBounty", offers: 8, clicks: 800, conversions: 320, revenue: 32000, change: "-3.4%" },
    { name: "JVZoo", offers: 5, clicks: 600, conversions: 240, revenue: 24000, change: "+8.7%" },
    { name: "WarriorPlus", offers: 4, clicks: 400, conversions: 160, revenue: 16000, change: "+2.1%" }
  ],
  offersData: {
    data: [
      { name: "Weight Loss Program", network: "ClickBank", clicks: 500, conversions: 85, revenue: 25000, type: "CPA", change: "+12.5%" },
      { name: "Crypto Trading Course", network: "MaxBounty", clicks: 300, conversions: 78, revenue: 15000, type: "CPL", change: "-3.2%" },
      { name: "Fitness Program", network: "JVZoo", clicks: 200, conversions: 82, revenue: 10000, type: "CPA", change: "+8.7%" },
      { name: "Investment Course", network: "WarriorPlus", clicks: 150, conversions: 75, revenue: 7500, type: "REVSHARE", change: "-1.5%" }
    ],
    trendData: [
      { date: "Mon", revenue: 4000, transfers: 200 },
      { date: "Tue", revenue: 3000, transfers: 150 },
      { date: "Wed", revenue: 2000, transfers: 100 },
      { date: "Thu", revenue: 2780, transfers: 140 },
      { date: "Fri", revenue: 1890, transfers: 95 },
      { date: "Sat", revenue: 2390, transfers: 120 },
      { date: "Sun", revenue: 3490, transfers: 175 }
    ]
  }
};