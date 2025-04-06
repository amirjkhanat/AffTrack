import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const metaData: Record<string, any> = {};

    for (const key in body) {
      if (key.startsWith('metaData.')) {
        const nestedKey = key.split('.')[1];
        metaData[nestedKey] = body[key]; 
      }
    }

    const data = {
      transferFeedId: body.transferFeedId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone.replace(/\D/g, ''),
      address: body.address,
      address2: body.address2,
      city: body.city,
      state: body.state,
      zipcode: body.zip,
      dob_mm: body.dob_mm,
      dob_dd: body.dob_dd,
      dob_yyyy: body.dob_yyyy,
      prePingId: null,
      metaData: metaData,
    };

    await prisma.activity.create({
      data: {
        type: "TRANSFER_FEED",
        action: "CONFIGURE",
        userId: user.id,
        targetType: "TRANSFER_FEED",
        targetId: body.transferFeedId,
        details: `User tested transfer feed with ID: ${body.transferFeedId}`,
      },
    });

    const transferFeed = await fetchTransferFeedDetails(body.transferFeedId);

    if (transferFeed.status !== 'TESTING') {
      return new NextResponse('Transfer feed is not in test mode', { status: 400 });
    }

    const timingMessage = `PROCESSED IN REALTIME SET TO ${transferFeed.transferTiming?.type || 'REALTIME'}`;
    
    const schedulingError = checkSchedulingRules(transferFeed);
    if (schedulingError) {
      console.error('Scheduling error:', schedulingError);
      return NextResponse.json({ error: schedulingError }, { status: 400 });
    }
    const schedulingMessage = 'SCHEDULING PASSED';

    const conditionMessages = checkConditionalRules(transferFeed, data);
    if (conditionMessages.includes('FAILED')) {
      console.error('Condition check failed:', conditionMessages);
      return NextResponse.json({ error: 'Condition check failed' }, { status: 400 });
    }

    const prePingMessage = transferFeed.prePingEnabled ? 'PRE PING ENABLED' : 'PRE PING DISABLED';
    let prePingSuccess = false;
    let prePingRequestDetails = {};
    let prePingIdFound = false;
    let prePingResult = { success: false, prePingRequestDetails: {}, prePingIdFound: false, successPatternMatched: false, errorMessage: '', responseBody: '' };

    if (transferFeed.prePingEnabled) {
      prePingResult = await handlePrePing(transferFeed, data);
      prePingSuccess = prePingResult.success;
      prePingRequestDetails = prePingResult.prePingRequestDetails;
      prePingIdFound = prePingResult.prePingIdFound;
      if (prePingResult.prePingId) {
        data.prePingId = prePingResult.prePingId;
      }
    }

    const response = await handleMainRequest(transferFeed, data);

    let payoutMessage;
    if (transferFeed.payoutType === 'STATIC') {
      payoutMessage = `STATIC PAYOUT: ${transferFeed.payoutValue}`;
    } else if (transferFeed.payoutType === 'DYNAMIC') {
      payoutMessage = response.payoutFound ? `DYNAMIC PAYOUT: ${response.payoutValue}` : 'DYNAMIC PAYOUT NOT FOUND';
    }

    return NextResponse.json({
      steps: [
        { 
          step: "Timing", 
          message: timingMessage 
        },
        { 
          step: "Scheduling", 
          message: schedulingMessage 
        },
        { 
          step: "Condition Check", 
          message: conditionMessages 
        },
        { 
          step: "Pre-Ping", 
          message: prePingMessage, 
          request: prePingRequestDetails, 
          response: prePingResult.responseBody,
          successPatternMatched: prePingResult.successPatternMatched, 
          prePingIdFound: prePingIdFound ? 'Pre-Ping ID found' : 'Pre-Ping ID not found',
          errorMessage: prePingResult.errorMessage 
        },
        { 
          step: "Main Request", 
          message: "Main request processed", 
          request: response.mainRequestDetails, 
          response: response.responseBody, 
          successPatternMatched: response.successPatternMatched, 
          payoutFound: response.payoutFound ? 'Payout found' : 'Payout not found',
          payoutValue: response.payoutValue, 
          errorMessage: response.errorMessage 
        },
      ],
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    return new NextResponse('Failed to test webhook', { status: 500 });
  }
}

// Helper functions
async function fetchTransferFeedDetails(transferFeedId: string) {
  try {
    const transferFeed = await prisma.transferFeed.findUnique({
      where: { id: transferFeedId },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!transferFeed) {
      throw new Error("Transfer feed not found");
    }

    return transferFeed;
  } catch (error) {
    console.error("Error fetching transfer feed details:", error);
    throw new Error("Failed to fetch transfer feed details");
  }
}

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function checkSchedulingRules(transferFeed: any): string | null {
  const { scheduleConfig } = transferFeed;

  if (!scheduleConfig) {
    return null; // No scheduling config means no restrictions
  }

  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes since midnight

  // Check if the schedule is enabled
  if (scheduleConfig.enabled) {
    // Check if the current day is within the allowed days
    if (!scheduleConfig.days.includes(currentDay)) {
      return 'Current day is not within the allowed days';
    }

    // Check if the current time is within the allowed time range
    const startTime = parseTime(scheduleConfig.timeStart);
    const endTime = parseTime(scheduleConfig.timeEnd);

    if (currentTime < startTime || currentTime > endTime) {
      return 'Current time is not within the allowed time range';
    }
  }

  // Check start and end dates if they are set
  if (scheduleConfig.startDate && now < new Date(scheduleConfig.startDate)) {
    return 'Current date is before the start date';
  }

  if (scheduleConfig.endDate && now > new Date(scheduleConfig.endDate)) {
    return 'Current date is after the end date';
  }

  return null; // All rules met
}

function checkConditionalRules(transferFeed: any, data: any): string {
  const rules = Array.isArray(transferFeed.conditions?.rules) ? transferFeed.conditions.rules : [];
  let conditionsMessage = '';

  for (const condition of rules) {
    const { field, operator, value, customKey } = condition;
    let fieldValue;
    let fieldName;

    if (field === 'custom' && customKey) {
      // Use customKey to access the value in data
      fieldValue = customKey.split('.').reduce((obj, key) => obj && obj[key], data);
      fieldName = customKey.split('.').pop(); // Get the last part of the customKey for display
    } else if (field.startsWith('metaData.')) {
      fieldValue = data.metaData[field.split('.')[1]];
      fieldName = field.split('.')[1];
    } else {
      fieldValue = data[field];
      fieldName = field;
    }

    const conditionPassed = evaluateCondition(fieldValue, operator, value);
    conditionsMessage += `${fieldName} ${operator} ${value} - CONDITION ${conditionPassed ? 'PASSED' : 'FAILED'}\n`;
  }
  return conditionsMessage;
}

function evaluateCondition(fieldValue: any, operator: string, value: any): boolean {
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'greater_than':
      return fieldValue > value;
    case 'less_than':
      return fieldValue < value;
    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(value);
    case 'not_contains':
      return typeof fieldValue === 'string' && !fieldValue.includes(value);
    case 'matches':
      return new RegExp(value).test(fieldValue);
    case 'not_matches':
      return !new RegExp(value).test(fieldValue);
    default:
      return false;
  }
}

async function handlePrePing(transferFeed: any, data: any) {
  const { url, method, headers, bodyTemplate, bodyType, successPattern, responseMapping } = transferFeed.prePingConfig;

  console.log('Pre-ping configuration:', transferFeed.prePingConfig);

  let body: Record<string, any> | URLSearchParams | undefined;
  let prePingRequestDetails = {};
  let errorMessage = '';
  let successPatternMatched = false;
  let prePingIdFound = false;
  let responseBody = '';

  if (bodyTemplate) {
    try {
      if (bodyType === 'json') {
        const parsedTemplate = JSON.parse(bodyTemplate);
        body = {};

        for (const { key, value } of parsedTemplate) {
          body[key] = value.replace(/{(\w+)}/g, (_, placeholder) => data[placeholder] || '');
        }

        console.log('Parsed pre-ping JSON body:', body);
      } else if (bodyType === 'formData') {
        body = new URLSearchParams();
        const formDataPairs = JSON.parse(bodyTemplate);

        formDataPairs.forEach(({ key, value }: { key: string, value: string }) => {
          body.append(key, value.replace(/{(\w+)}/g, (_, placeholder) => data[placeholder] || ''));
        });

        console.log('Parsed pre-ping form-data body:', body.toString());
      }
    } catch (error) {
      errorMessage = 'Error parsing pre-ping body template';
      console.error(errorMessage, error);
      return { success: false, prePingId: null, prePingRequestDetails, errorMessage, responseBody };
    }
  }

  let requestUrl = url;
  if (method === 'GET' && bodyType === 'formData') {
    requestUrl = `${url}?${body.toString()}`;
  }

  prePingRequestDetails = {
    method,
    url: requestUrl,
    headers: JSON.parse(headers),
    body: method !== 'GET' ? (bodyType === 'json' ? JSON.stringify(body) : body.toString()) : undefined,
  };

  console.log(`Sending pre-ping ${method} request to ${requestUrl} with headers:`, headers);
  if (method !== 'GET') {
    console.log('Pre-ping request body:', body);
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: JSON.parse(headers),
      body: method !== 'GET' ? (bodyType === 'json' ? JSON.stringify(body) : body) : undefined,
    });

    responseBody = await response.text();
    console.log('Pre-ping response text:', responseBody);

    successPatternMatched = new RegExp(successPattern).test(responseBody);
    if (successPatternMatched) {
      console.log('Pre-ping success pattern matched.');
      const responseJson = JSON.parse(responseBody);
      const prePingId = responseMapping ? responseJson.response?.data?.uuid : null;
      prePingIdFound = !!prePingId;
      if (!prePingIdFound) {
        errorMessage = 'Pre-ping ID not found';
      }
      return { success: true, prePingId, prePingRequestDetails, successPatternMatched, prePingIdFound, errorMessage, responseBody };
    } else {
      errorMessage = 'Pre-ping failed, success pattern not matched';
      console.error(errorMessage, responseBody);
      return { success: false, prePingId: null, prePingRequestDetails, successPatternMatched, errorMessage, responseBody };
    }
  } catch (error) {
    errorMessage = 'Error during pre-ping';
    console.error(errorMessage, error);
    return { success: false, prePingId: null, prePingRequestDetails, successPatternMatched, errorMessage, responseBody };
  }
}

async function handleMainRequest(transferFeed: any, data: any) {
  const { endpoint, method, headers, bodyTemplate, successPattern, payoutType, payoutPath } = transferFeed;

  let body;
  let errorMessage = '';
  let payoutValue = null;
  let payoutFound = false;
  let responseBody = '';

  if (bodyTemplate) {
    try {
      body = JSON.parse(bodyTemplate.replace(/{(\w+)}/g, (_, key) => data[key] || ''));
      console.log('Parsed main request body:', body);
    } catch (error) {
      errorMessage = 'Error parsing main request body template';
      console.error(errorMessage, error);
      return { success: false, error: errorMessage, payoutFound, payoutValue, responseBody };
    }
  }

  let requestUrl = endpoint;
  if (method === 'GET' && body && typeof body === 'object') {
    const queryParams = new URLSearchParams(Object.entries(body)).toString();
    requestUrl = `${endpoint}?${queryParams}`;
  }

  const mainRequestDetails = {
    method,
    url: requestUrl,
    headers,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  };

  console.log(`Sending main request ${method} to ${requestUrl} with headers:`, headers);
  if (method !== 'GET') {
    console.log('Main request body:', body);
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    responseBody = await response.text();
    console.log('Main request response text:', responseBody);

    let responseJson;
    try {
      responseJson = JSON.parse(responseBody);
      console.log('Parsed main request response JSON:', responseJson);
    } catch (jsonError) {
      errorMessage = 'Invalid JSON response from main request';
      console.error(errorMessage, responseBody);
      return { success: false, error: errorMessage, payoutFound, payoutValue, responseBody, mainRequestDetails };
    }

    const successPatternMatched = new RegExp(successPattern).test(responseBody);
    if (successPatternMatched) {
      console.log('Main request success pattern matched.');

      // Check for dynamic payout
      if (payoutType === 'DYNAMIC' && payoutPath) {
        payoutValue = payoutPath.split('.').reduce((obj, key) => obj && obj[key], responseJson);
        payoutFound = payoutValue !== undefined;
        if (!payoutFound) {
          errorMessage = 'Dynamic payout not found';
        }
      }

      return { success: true, responseJson, payoutFound, payoutValue, errorMessage, responseBody, successPatternMatched, mainRequestDetails };
    } else {
      errorMessage = 'Main request failed, success pattern not matched';
      console.error(errorMessage, responseBody);
      return { success: false, responseJson, payoutFound, payoutValue, errorMessage, responseBody, successPatternMatched, mainRequestDetails };
    }
  } catch (error) {
    errorMessage = 'Error during main request';
    console.error(errorMessage, error);
    return { success: false, error: errorMessage, payoutFound, payoutValue, responseBody, mainRequestDetails };
  }
}


