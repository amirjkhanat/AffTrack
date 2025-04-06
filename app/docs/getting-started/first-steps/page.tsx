"use client";

import { Heading } from "@/components/docs/heading";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPager } from "@/components/docs/docs-pager";

export default function FirstStepsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Heading level={1}>First Steps</Heading>
        <p className="text-muted-foreground">
          Learn how to create your first tracking link and start monitoring your affiliate traffic.
        </p>
      </div>

      <div className="space-y-4">
        <Heading level={2}>Creating a Tracking Link</Heading>
        <p>
          Tracking links are the foundation of your affiliate tracking system. They help you monitor
          where your traffic comes from and how it converts.
        </p>

        <CodeBlock language="typescript">
{`// Example tracking link structure
https://your-domain.com/c/abc123

// This will redirect to your landing page with tracking parameters
https://landing-page.com?click_id=xyz789&offer_id=123&placement_id=456`}
        </CodeBlock>

        <p>
          When a user clicks your tracking link, our system will:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Record the click with UTM parameters and user data</li>
          <li>Generate a unique click ID</li>
          <li>Redirect to your landing page with tracking parameters</li>
          <li>Monitor for conversions using the click ID</li>
        </ol>
      </div>

      <div className="space-y-4">
        <Heading level={2}>Implementing Conversion Tracking</Heading>
        <p>
          To track conversions, you'll need to pass the click_id parameter from your landing page
          to your thank you page or server-side conversion endpoint.
        </p>

        <CodeBlock language="typescript">
{`// Example conversion tracking code
const trackConversion = async (clickId: string) => {
  const response = await fetch('/api/conversions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clickId,
      // Additional conversion data
      value: 99.99,
      productId: 'xyz123',
    })
  });
  
  return response.json();
}`}
        </CodeBlock>
      </div>

      <DocsPager />
    </div>
  );
}