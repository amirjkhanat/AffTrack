import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data in the correct order
  await prisma.conversion.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.click.deleteMany()
  await prisma.view.deleteMany()
  await prisma.visitor.deleteMany()
  await prisma.trackingLink.deleteMany()
  await prisma.adPlacement.deleteMany()
  await prisma.splitTestVariant.deleteMany()
  await prisma.splitTest.deleteMany()
  await prisma.affiliateOffer.deleteMany()
  await prisma.affiliateNetwork.deleteMany()
  await prisma.trafficSource.deleteMany()
  await prisma.landingPage.deleteMany()

  // Get or create a default user ID
  const defaultUser = await prisma.user.findFirst()
  if (!defaultUser) {
    throw new Error('No user found in the database. Please create a user first.')
  }
  const defaultUserId = defaultUser.id

  // Create sample traffic sources
  const facebook = await prisma.trafficSource.create({
    data: {
      name: 'Facebook Ads',
      type: 'SOCIAL_MEDIA',
      description: faker.company.catchPhrase(),
      userId: defaultUserId,
    },
  })

  const google = await prisma.trafficSource.create({
    data: {
      name: 'Google Ads',
      type: 'SEARCH_ENGINE',
      description: faker.company.catchPhrase(),
      userId: defaultUserId,
    },
  })

  // Create sample landing pages
  const salesPage = await prisma.landingPage.create({
    data: {
      name: faker.commerce.productName(),
      baseUrl: faker.internet.url(),
      parameters: {
        utm_source: true,
        utm_medium: true,
        utm_campaign: true
      },
      description: faker.commerce.productDescription(),
      userId: defaultUserId,
    },
  })

  const leadgenPage = await prisma.landingPage.create({
    data: {
      name: 'Lead Generation Page',
      baseUrl: 'https://example.com/leadgen',
      parameters: {
        utm_source: true,
        utm_medium: true,
        utm_campaign: true
      },
      description: 'Email capture landing page',
      userId: defaultUserId,
    },
  })

  // Create sample affiliate networks
  const network1 = await prisma.affiliateNetwork.create({
    data: {
      name: 'MaxBounty',
      website: 'https://maxbounty.com',
      loginUrl: 'https://login.maxbounty.com',
      username: 'affiliate_username',
      password: 'encrypted_password',
      userId: defaultUserId,
    },
  })

  const network2 = await prisma.affiliateNetwork.create({
    data: {
      name: 'ClickBank',
      website: 'https://clickbank.com',
      loginUrl: 'https://accounts.clickbank.com/login',
      username: 'affiliate_username',
      password: 'encrypted_password',
      userId: defaultUserId,
    },
  })

  // Create sample affiliate offers
  const offer1 = await prisma.affiliateOffer.create({
    data: {
      name: 'Weight Loss Program',
      network: 'MaxBounty',
      type: 'CPA',
      payout: 80.00,
      description: 'High converting weight loss offer',
      url: 'https://maxbounty.com/offer/12345',
      userId: defaultUserId,
      affiliateNetworkId: network1.id,
    },
  })

  const offer2 = await prisma.affiliateOffer.create({
    data: {
      name: 'Crypto Trading Course',
      network: 'ClickBank',
      type: 'REVSHARE',
      payout: 75.00,
      description: '75% commission on crypto education product',
      url: 'https://clickbank.com/offer/67890',
      userId: defaultUserId,
      affiliateNetworkId: network2.id,
    },
  })

  // Create sample tracking links
  await prisma.trackingLink.create({
    data: {
      name: 'FB Weight Loss Campaign',
      url: 'https://track.example.com/fb-weight-loss',
      trafficSourceId: facebook.id,
      landingPageId: salesPage.id,
      userId: defaultUserId,
    },
  })

  await prisma.trackingLink.create({
    data: {
      name: 'Google Crypto Campaign',
      url: 'https://track.example.com/google-crypto',
      trafficSourceId: google.id,
      landingPageId: leadgenPage.id,
      userId: defaultUserId,
    },
  })

  // Create sample visitors and their funnel data
  for (let i = 0; i < 50; i++) {
    const visitor = await prisma.visitor.create({
      data: {
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        referer: "https://facebook.com",
        landingPageId: salesPage.id,
        trafficSourceId: facebook.id,
        utmSource: "facebook",
        utmMedium: "cpc",
        utmCampaign: "weight-loss-campaign",
        country: "US",
        region: "CA",
        city: "Los Angeles",
        browser: "Chrome",
        os: "MacOS",
        device: "Desktop",
        timeOnSite: Math.floor(Math.random() * 300), // 0-300 seconds
        pageViews: Math.floor(Math.random() * 5) + 1, // 1-5 pages
        bounced: Math.random() > 0.7, // 30% bounce rate
        convertedToLead: Math.random() > 0.5, // 50% lead conversion
      }
    })

    // Create page views for this visitor
    for (let j = 0; j < visitor.pageViews; j++) {
      await prisma.view.create({
        data: {
          visitorId: visitor.id,
          url: faker.internet.url(),
          title: faker.company.catchPhrase(),
          referrer: j === 0 ? faker.internet.url() : null,
        }
      })
    }

    // Create click if visitor didn't bounce
    if (!visitor.bounced) {
      const click = await prisma.click.create({
        data: {
          visitorId: visitor.id,
          ipAddress: visitor.ipAddress,
          userAgent: visitor.userAgent,
          referer: faker.internet.url(),
          utmSource: visitor.utmSource,
          utmMedium: visitor.utmMedium,
          utmCampaign: visitor.utmCampaign,
        }
      })

      // Create lead if visitor converted
      if (visitor.convertedToLead) {
        const lead = await prisma.lead.create({
          data: {
            visitorId: visitor.id,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipcode: faker.location.zipCode(),
            ipAddress: visitor.ipAddress,
            userAgent: visitor.userAgent,
            country: visitor.country,
            region: visitor.region,
            status: 'NEW',
            clicks: {
              connect: { id: click.id }
            },
            metaData: {
              occupation: faker.person.jobTitle(),
              company: faker.company.name(),
              interests: faker.helpers.multiple(() => faker.commerce.department(), { count: 3 })
            }
          }
        })

        // Create conversion for some leads (70% conversion rate)
        if (faker.datatype.boolean({ probability: 0.7 })) {
          await prisma.conversion.create({
            data: {
              visitorId: visitor.id,
              clickId: click.id,
              leadId: lead.id,
              offerId: faker.helpers.arrayElement([offer1.id, offer2.id]),
              value: parseFloat(faker.commerce.price({ min: 50, max: 200 })),
              status: faker.helpers.arrayElement(['COMPLETED', 'PENDING']),
              transactionId: faker.string.alphanumeric(10).toUpperCase(),
              metadata: {
                conversionTime: faker.date.recent(),
                product: faker.commerce.productName(),
                plan: faker.helpers.arrayElement(['Basic', 'Premium', 'Pro']),
                paymentMethod: faker.helpers.arrayElement(['credit_card', 'paypal', 'crypto'])
              }
            }
          })
        }
      }
    }
  }

  console.log('Seed data created successfully with Faker')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 