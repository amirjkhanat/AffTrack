import { Metadata } from "next";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsPager } from "@/components/docs/docs-pager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Installation - AffTrack Documentation",
  description: "Learn how to install and set up AffTrack.",
};

export default function InstallationPage() {
  return (
    <main className="relative max-w-3xl">
      <DocsHeader
        heading="Installation"
        text="Step-by-step guide to install and configure AffTrack."
      />

      <div className="space-y-8">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            Choose your preferred installation method below. We recommend using Docker for production environments.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="docker" className="space-y-6">
          <TabsList>
            <TabsTrigger value="docker">Docker</TabsTrigger>
            <TabsTrigger value="source">From Source</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Deploy</TabsTrigger>
          </TabsList>

          <TabsContent value="docker" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Docker Installation</h2>
              <div className="rounded-md bg-muted p-4">
                <pre className="text-sm"><code>{`# Pull the latest image
docker pull afftrack/afftrack:latest

# Create and edit your environment file
cp .env.example .env
nano .env

# Start the containers
docker-compose up -d`}</code></pre>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>Required configuration for Docker setup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="font-mono text-sm">DATABASE_URL</span>
                      <span className="col-span-2 text-sm text-muted-foreground">PostgreSQL connection string</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="font-mono text-sm">REDIS_URL</span>
                      <span className="col-span-2 text-sm text-muted-foreground">Redis connection string</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="font-mono text-sm">JWT_SECRET</span>
                      <span className="col-span-2 text-sm text-muted-foreground">Secret key for JWT tokens</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="source" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Installation from Source</h2>
              <div className="rounded-md bg-muted p-4">
                <pre className="text-sm"><code>{`# Clone the repository
git clone https://github.com/yourusername/AffTrack-2.0.git
cd AffTrack-2.0

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
nano .env

# Install Redis (Ubuntu)
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server

# Generate Prisma Client
npx prisma generate

# Start the development server
npm run dev

# Start the worker process (in a separate terminal)
npm run worker`}</code></pre>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Development Setup Checklist</CardTitle>
                  <CardDescription>Complete these steps for local development</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Configure DATABASE_URL in .env for Prisma Accelerate</li>
                    <li>Set up PULSE_API_KEY for real-time updates</li>
                    <li>Configure NEXTAUTH settings</li>
                    <li>Ensure Redis is running for the worker process</li>
                    <li>Set up OPENAI_API_KEY if using AI features</li>
                  </ul>
                </CardContent>
              </Card>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Source installation is recommended for development only. Use Docker for production deployments.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="cloud" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Cloud Deployment</h2>
              
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <CardTitle>Deploy to Railway</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      One-click deployment to Railway with automatic database provisioning.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <pre className="text-sm"><code>{`railway up --template afftrack/afftrack`}</code></pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <CardTitle>Deploy to Render</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automatic deployment with Render's container service.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <pre className="text-sm"><code>{`render deploy --template afftrack/afftrack`}</code></pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Next Steps</h2>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set up your environment and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Configure your database connection</li>
                  <li>Set up authentication providers</li>
                  <li>Configure tracking endpoints</li>
                  <li>Set up your first transfer partner</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <DocsPager />
      </div>
    </main>
  );
}