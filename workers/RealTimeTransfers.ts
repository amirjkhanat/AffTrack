// File: workers/RealTimeTransfers.ts

import Bull from 'bull';
import { prisma } from "@/lib/prisma";

// Create a new queue
const transferQueue = new Bull('lead-transfers', {
  redis: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  defaultJobOptions: {
    removeOnComplete: true, // Remove jobs from queue after completion
    attempts: 3, // Retry failed jobs 3 times
  }
});

// Convert the main function to be a processor
async function processTransferLeads(job: Bull.Job) {
  try {
    const newLeads = await prisma.lead.findMany({
      where: { status: 'NEW' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipcode: true,
        ipAddress: true,
        userAgent: true,
        country: true,
        region: true,
        status: true,
        metaData: true,
        visitorId: true,
      }
    });

    const transferFeeds = await prisma.transferFeed.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        conditions: true,
        scheduleConfig: true,
        prePingConfig: true,
        prePingEnabled: true,
        endpoint: true,
        method: true,
        headers: true,
        bodyTemplate: true,
        successPattern: true,
        payoutType: true,
        payoutPath: true,
        payoutValue: true,
      }
    });

    // Check if we have any active transfer feeds
    if (!transferFeeds.length) {
      console.log('No active transfer feeds found');
      return;
    }

    // Check if we have any new leads
    if (!newLeads.length) {
      console.log('No new leads to process');
      return;
    }

    await Promise.all(newLeads.map(async (lead) => {
      let transferSuccess = false;
      let responseDetails = {
        responseJson: null,
        responseCode: null,
        errorMessage: null,
        payoutValue: null,
      };
      let retryCount = 0;
      let prePingResult = { success: false, prePingId: null };
      let successfulFeed = null;

      for (const feed of transferFeeds) {
        const schedulingError = checkSchedulingRules(feed);
        if (schedulingError) continue;

        const conditionMessages = checkConditionalRules(feed, lead);
        if (conditionMessages.includes('FAILED')) continue;

        if (feed.prePingEnabled) {
          prePingResult = await handlePrePing(feed, lead);
          if (!prePingResult.success) continue;
          if (prePingResult.prePingId) lead.prePingId = prePingResult.prePingId;
        }

        while (retryCount < 5 && !transferSuccess) {
          try {
            const response = await handleMainRequest(feed, lead);
            if (response.success) {
              transferSuccess = true;
              successfulFeed = feed;
              responseDetails = {
                responseJson: response.responseJson,
                responseCode: response.responseCode,
                errorMessage: response.errorMessage,
                payoutValue: response.payoutValue,
              };
              break;
            }
          } catch (error) {
            responseDetails.errorMessage = error.message;
          }
          retryCount++;
        }

        if (transferSuccess) break;
      }

      const status = transferSuccess
        ? 'ACCEPTED'
        : prePingResult && !prePingResult.success
        ? 'FAILED_PING'
        : 'FAILED_MAIN';

      await prisma.lead.update({
        where: { id: lead.id },
        data: { 
          status: 'TRANSFERRED',
        },
      });

      if (successfulFeed) {
        await prisma.transfer.create({
          data: {
            feedId: successfulFeed.id,
            leadId: lead.id,
            status: status,
            response: responseDetails.responseJson,
            responseCode: responseDetails.responseCode,
            errorMessage: responseDetails.errorMessage,
            prePingId: lead.prePingId,
            payout: responseDetails.payoutValue,
            retryCount: retryCount,
          },
        });
      } else {
        // Handle case where no feed was successful
        await prisma.transfer.create({
          data: {
            feedId: transferFeeds[0].id, // Use first feed as fallback
            leadId: lead.id,
            status: 'FAILED_ALL_FEEDS',
            errorMessage: 'No transfer feed succeeded',
            retryCount: retryCount,
          },
        });
      }
    }));

  } catch (error) {
    console.error('Transfer processing error:', error);
    throw error;
  }
}

// Register the processor
transferQueue.process(processTransferLeads);

// Add recurring job (runs every minute)
transferQueue.add(
  {},
  { 
    repeat: { 
      cron: '* * * * *' // Every minute
    } 
  }
);

// Error handling
transferQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

transferQueue.on('failed', (job, error) => {
  console.error('Job failed:', job.id, error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await transferQueue.close();
  await prisma.$disconnect();
  process.exit(0);
});

// Function to check scheduling rules
function checkSchedulingRules(transferFeed: any): string | null {
  const { scheduleConfig } = transferFeed;

  if (!scheduleConfig) {
    return null; // No scheduling config means no restrictions
  }

  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes since midnight

  if (scheduleConfig.enabled) {
    if (!scheduleConfig.days.includes(currentDay)) {
      return 'Current day is not within the allowed days';
    }

    const startTime = parseTime(scheduleConfig.timeStart);
    const endTime = parseTime(scheduleConfig.timeEnd);

    if (currentTime < startTime || currentTime > endTime) {
      return 'Current time is not within the allowed time range';
    }
  }

  if (scheduleConfig.startDate && now < new Date(scheduleConfig.startDate)) {
    return 'Current date is before the start date';
  }

  if (scheduleConfig.endDate && now > new Date(scheduleConfig.endDate)) {
    return 'Current date is after the end date';
  }

  return null; // All rules met
}

// Function to parse time strings into minutes
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// Function to check conditional rules
function checkConditionalRules(transferFeed: any, data: any): string {
  const rules = Array.isArray(transferFeed.conditions?.rules) ? transferFeed.conditions.rules : [];
  let conditionsMessage = '';

  for (const condition of rules) {
    const { field, operator, value, customKey } = condition;
    let fieldValue;

    if (field === 'custom' && customKey) {
      fieldValue = customKey.split('.').reduce((obj, key) => obj && obj[key], data);
    } else if (field.startsWith('metaData.')) {
      fieldValue = data.metaData[field.split('.')[1]];
    } else {
      fieldValue = data[field];
    }

    const conditionPassed = evaluateCondition(fieldValue, operator, value);
    conditionsMessage += `${field} ${operator} ${value} - CONDITION ${conditionPassed ? 'PASSED' : 'FAILED'}\n`;
  }
  return conditionsMessage;
}

// Function to evaluate a single condition
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

// Function to handle pre-ping logic
async function handlePrePing(transferFeed: any, data: any) {
  const { url, method, headers, bodyTemplate, bodyType, successPattern, responseMapping } = transferFeed.prePingConfig;

  let body: Record<string, any> | URLSearchParams | undefined;
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
      } else if (bodyType === 'formData') {
        body = new URLSearchParams();
        const formDataPairs = JSON.parse(bodyTemplate);

        formDataPairs.forEach(({ key, value }: { key: string, value: string }) => {
          body.append(key, value.replace(/{(\w+)}/g, (_, placeholder) => data[placeholder] || ''));
        });
      }
    } catch (error) {
      return { success: false, prePingId: null };
    }
  }

  let requestUrl = url;
  if (method === 'GET' && bodyType === 'formData') {
    requestUrl = `${url}?${body.toString()}`;
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: JSON.parse(headers),
      body: method !== 'GET' ? (bodyType === 'json' ? JSON.stringify(body) : body) : undefined,
    });

    responseBody = await response.text();

    successPatternMatched = new RegExp(successPattern).test(responseBody);
    if (successPatternMatched) {
      const responseJson = JSON.parse(responseBody);
      const prePingId = responseMapping ? responseJson.response?.data?.uuid : null;
      prePingIdFound = !!prePingId;
      return { success: true, prePingId };
    } else {
      return { success: false, prePingId: null };
    }
  } catch (error) {
    return { success: false, prePingId: null };
  }
}

// Function to handle the main request logic
async function handleMainRequest(transferFeed: any, data: any) {
  const { endpoint, method, headers, bodyTemplate, successPattern, payoutType, payoutPath } = transferFeed;

  let body;
  let payoutValue = null;
  let payoutFound = false;

  if (bodyTemplate) {
    try {
      body = JSON.parse(bodyTemplate.replace(/{(\w+)}/g, (_, key) => data[key] || ''));
    } catch (error) {
      return { success: false, payoutFound, payoutValue };
    }
  }

  let requestUrl = endpoint;
  if (method === 'GET' && body && typeof body === 'object') {
    const queryParams = new URLSearchParams(Object.entries(body)).toString();
    requestUrl = `${endpoint}?${queryParams}`;
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    const responseBody = await response.text();

    let responseJson;
    try {
      responseJson = JSON.parse(responseBody);
    } catch (jsonError) {
      return { success: false, payoutFound, payoutValue };
    }

    const successPatternMatched = new RegExp(successPattern).test(responseBody);
    if (successPatternMatched) {
      if (payoutType === 'DYNAMIC' && payoutPath) {
        payoutValue = payoutPath.split('.').reduce((obj, key) => obj && obj[key], responseJson);
        payoutFound = payoutValue !== undefined;
      } else if (payoutType === 'STATIC') {
        payoutValue = transferFeed.payoutValue;
        payoutFound = true;
      }

      return { success: true, responseJson, payoutFound, payoutValue, responseCode: response.status };
    } else {
      return { success: false, responseJson, payoutFound, payoutValue, responseCode: response.status };
    }
  } catch (error) {
    return { success: false, payoutFound, payoutValue, responseCode: null };
  }
}
