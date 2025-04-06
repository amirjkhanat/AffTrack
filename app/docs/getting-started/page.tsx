import { Metadata } from "next";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsPager } from "@/components/docs/docs-pager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Getting Started - AffTrack Documentation",
  description: "Learn how to get started with AffTrack.",
};

export default function GettingStartedPage() {
  return (
    <main className="relative max-w-3xl">
      <DocsHeader
        heading="Getting Started"
        text="Learn how to get started with AffTrack in a few simple steps."
      />

      <div className="space-y-8">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            This guide will help you set up and configure AffTrack for your affiliate marketing needs.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Prerequisites
          </h2>
          <div className="grid gap-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">System Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Node.js 18 or higher</li>
                <li>PostgreSQL database</li>
                <li>Redis server</li>
                <li>Basic understanding of affiliate marketing</li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
            Core Components
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Real-Time Transfers</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Automated lead distribution</li>
                <li>Conditional routing</li>
                <li>Pre-ping validation</li>
                <li>Automatic retries</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-2">Transfer Rules</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Scheduling rules</li>
                <li>Conditional logic</li>
                <li>Response validation</li>
                <li>Payout tracking</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-2">Monitoring</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Real-time transfer logs</li>
                <li>Error tracking</li>
                <li>Performance metrics</li>
                <li>Status monitoring</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-2">Infrastructure</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Redis queue system</li>
                <li>Worker processes</li>
                <li>Database integration</li>
                <li>Health checks</li>
              </ul>
            </Card>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ensure Redis and worker processes are properly configured before deploying to production.
          </AlertDescription>
        </Alert>

        <DocsPager />
      </div>
    </main>
  );
}