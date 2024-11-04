export const optimizationData = {
  landingPages: {
    performance: [
      { name: 'Mon', visitors: 1500, conversions: 75 },
      { name: 'Tue', visitors: 1200, conversions: 48 },
      { name: 'Wed', visitors: 1800, conversions: 90 },
      { name: 'Thu', visitors: 1600, conversions: 80 },
      { name: 'Fri', visitors: 1400, conversions: 70 },
      { name: 'Sat', visitors: 1100, conversions: 55 },
      { name: 'Sun', visitors: 1300, conversions: 65 }
    ],
    overview: [
      { name: 'Weight Loss LP 1', visitors: 12500, conversions: 625, rate: '5.0%', revenue: 15625, trend: '+12.5%' },
      { name: 'Crypto Trading LP', visitors: 8900, conversions: 356, rate: '4.0%', revenue: 8900, trend: '-3.2%' },
      { name: 'Fitness Program LP', visitors: 7500, conversions: 300, rate: '4.0%', revenue: 7500, trend: '+8.7%' },
      { name: 'Investment Course LP', visitors: 6200, conversions: 248, rate: '4.0%', revenue: 6200, trend: '+1.5%' }
    ]
  },
  paths: {
    overview: [
      { path: '/weight-loss/keto', visitors: 8500, bounceRate: '35%', avgTime: '2:45', conversions: 425, trend: '+12.5%' },
      { path: '/crypto/bitcoin', visitors: 6200, bounceRate: '42%', avgTime: '1:55', conversions: 248, trend: '-3.2%' },
      { path: '/fitness/hiit', visitors: 5100, bounceRate: '38%', avgTime: '2:15', conversions: 204, trend: '+8.7%' },
      { path: '/invest/stocks', visitors: 4200, bounceRate: '40%', avgTime: '2:05', conversions: 168, trend: '+1.5%' }
    ],
    trends: [
      { date: 'Mon', visitors: 850, conversions: 42 },
      { date: 'Tue', visitors: 740, conversions: 37 },
      { date: 'Wed', visitors: 920, conversions: 46 },
      { date: 'Thu', visitors: 880, conversions: 44 },
      { date: 'Fri', visitors: 810, conversions: 40 },
      { date: 'Sat', visitors: 750, conversions: 37 },
      { date: 'Sun', visitors: 790, conversions: 39 }
    ]
  },
  placements: {
    overview: [
      { name: 'Homepage Banner', clicks: 15000, ctr: '2.5%', conversions: 750, revenue: 18750, trend: '+12.5%' },
      { name: 'Sidebar Ad', clicks: 8900, ctr: '1.8%', conversions: 356, revenue: 8900, trend: '-3.2%' },
      { name: 'In-Content', clicks: 7500, ctr: '2.0%', conversions: 300, revenue: 7500, trend: '+8.7%' },
      { name: 'Footer Banner', clicks: 6200, ctr: '1.5%', conversions: 248, revenue: 6200, trend: '+1.5%' }
    ],
    performance: [
      { name: 'Mon', impressions: 15000, clicks: 750 },
      { name: 'Tue', impressions: 12000, clicks: 480 },
      { name: 'Wed', impressions: 18000, clicks: 900 },
      { name: 'Thu', impressions: 16000, clicks: 800 },
      { name: 'Fri', impressions: 14000, clicks: 700 },
      { name: 'Sat', impressions: 11000, clicks: 550 },
      { name: 'Sun', impressions: 13000, clicks: 650 }
    ]
  },
  splitTests: {
    active: [
      { 
        name: 'Landing Page A/B Test',
        variants: [
          { name: 'A', traffic: 5000, conversions: 250, rate: '5.0%', confidence: '95%' },
          { name: 'B', traffic: 5000, conversions: 300, rate: '6.0%', confidence: '95%' }
        ],
        duration: '7 days',
        status: 'active'
      },
      { 
        name: 'CTA Button Test',
        variants: [
          { name: 'Original', traffic: 3000, conversions: 120, rate: '4.0%', confidence: '90%' },
          { name: 'Variant', traffic: 3000, conversions: 150, rate: '5.0%', confidence: '90%' }
        ],
        duration: '5 days',
        status: 'active'
      }
    ],
    completed: [
      {
        name: 'Header Image Test',
        variants: [
          { name: 'Image A', traffic: 8000, conversions: 320, rate: '4.0%', winner: false },
          { name: 'Image B', traffic: 8000, conversions: 400, rate: '5.0%', winner: true }
        ],
        improvement: '+25%',
        confidence: '98%'
      },
      {
        name: 'Price Point Test',
        variants: [
          { name: '$47', traffic: 6000, conversions: 240, rate: '4.0%', winner: false },
          { name: '$97', traffic: 6000, conversions: 180, rate: '3.0%', winner: false },
          { name: '$67', traffic: 6000, conversions: 360, rate: '6.0%', winner: true }
        ],
        improvement: '+50%',
        confidence: '99%'
      }
    ]
  }
};