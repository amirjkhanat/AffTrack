import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Basic query first to ensure it works
    const leads = await db.lead.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match your frontend expectations
    const transformedLeads = leads.map(lead => ({
      id: lead.id,
      ipAddress: lead.ipAddress || 'Unknown',
      visitor: {
        id: lead.visitorId || null
      },
      location: lead.location || 'Unknown',
      timestamp: lead.createdAt.toISOString(),
      leadDetails: {
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        email: lead.email || '',
        phone: lead.phone || '',
        optIns: []  // We'll add this back once basic query works
      },
      source: lead.source || 'Direct',
      landingPage: lead.landingPage || '/',
      utmTags: {},  // We'll add this back once basic query works
      value: lead.value || 0
    }));

    return NextResponse.json(transformedLeads);
    
  } catch (error) {
    console.error("[LEADS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 