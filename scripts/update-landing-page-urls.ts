import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateLandingPageUrls() {
  try {
    const landingPages = await prisma.landingPage.findMany();
    
    for (const page of landingPages) {
      const newUrl = `http://localhost:3001/landing-pages/${page.id}`;
      
      if (page.baseUrl !== newUrl) {
        await prisma.landingPage.update({
          where: { id: page.id },
          data: { baseUrl: newUrl }
        });
        console.log(`Updated URL for landing page ${page.id}`);
      }
    }
    
    console.log('All landing page URLs have been updated');
  } catch (error) {
    console.error('Error updating landing page URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLandingPageUrls(); 