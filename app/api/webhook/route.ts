import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const metaData: Record<string, any> = {};

    for (const key in body) {
      if (key.startsWith('metaData.')) {
        const nestedKey = key.split('.')[1];
        metaData[nestedKey] = body[key]; 
      }
    }

    // Extract lead data from the request body
    const leadData = {
      visitId: body.visitId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      address2: body.address2,
      city: body.city,
      state: body.state,
      zipcode: body.zipcode,
      dob_dd: body.dob_dd,
      dob_mm: body.dob_mm,
      dob_yyyy: body.dob_yyyy,
      ipAddress: body.ipAddress,
      userAgent: body.userAgent,
      country: body.country,
      region: body.region,
      status: 'NEW',
      duplicateOf: null,
      metaData: metaData,
    };

    // Set State Abbreviation
    leadData.metaData.stateAbv = getStateAbbreviation(leadData.state);

    // Check for duplicate Lead
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: leadData.email,
      },
    });

    if (existingLead) {
      leadData.duplicateOf = existingLead.id;
      leadData.status = 'DUPLICATE';
    }

    // Save the lead data to the database, including metaData
    const newLead = await prisma.lead.create({
      data: {
        ...leadData,
        metaData: metaData,
      },
    });

    // Respond with a success message
    return NextResponse.json({ message: 'Lead saved successfully', leadId: newLead.id }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

//Helper function to map state abbreviations
const stateAbbreviations = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
};

function getStateAbbreviation(state: string) {
  return stateAbbreviations[state] || state;
}
