"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Github,
  CircleDollarSign,
  Users,
  LineChart,
  Rocket,
  Star,
  Quote,
  Workflow,
  Globe,
  Gauge
} from "lucide-react"; 

export default function Home() {
  useEffect(() => {
    console.log('Home component mounted');
    return () => console.log('Home component unmounted');
  }, []);

  console.log('Home component rendering');

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-primary/5 px-4">
        <div className="container mx-auto max-w-6xl py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                <Github className="h-3 w-3 mr-1" />
                Open Source
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Open Source <span className="text-primary">Affiliate</span> Tracking
              </h1>
              <p className="text-lg text-muted-foreground">
                A powerful, self-hosted platform for tracking affiliate campaigns, managing leads, and optimizing your revenue. Free and open source forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="https://github.com/yourusername/afftrack">
                    <Github className="mr-2 h-5 w-5" />
                    Star on GitHub
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs">Documentation</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
              <div className="relative bg-card border rounded-lg shadow-lg p-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
                    <CircleDollarSign className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-medium">Total Earnings</p>
                      <p className="text-2xl font-bold">$12,345.67</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                      <Users className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Referrals</p>
                        <p className="text-xl font-bold">142</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                      <LineChart className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Conversion</p>
                        <p className="text-xl font-bold">24.8%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Rocket className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl font-bold">Why Choose AffTrack?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and scale your affiliate business, completely free and open source
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
              <CardContent className="pt-6">
                <Gauge className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
                <p className="text-muted-foreground">
                  Monitor performance metrics instantly with our powerful dashboard. Make data-driven decisions faster.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
              <CardContent className="pt-6">
                <Workflow className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Automated Workflows</h3>
                <p className="text-muted-foreground">
                  Streamline your operations with automated lead distribution and tracking systems.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Self Hosted</h3>
                <p className="text-muted-foreground">
                  Host on your own infrastructure. Full control over your data and customizations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Star className="h-3 w-3 mr-1" />
              Community
            </Badge>
            <h2 className="text-3xl font-bold">Loved by Developers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our growing community of developers and marketers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Quote className="h-4 w-4 text-primary" />
              </div>
              <CardContent className="pt-8 pb-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    &quot;AffTrack has revolutionized how we manage our affiliate campaigns. The real-time analytics and automated transfers have saved us countless hours.&quot;
                  </p>
                  <div className="pt-4">
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Developer at TechGrowth</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Quote className="h-4 w-4 text-primary" />
              </div>
              <CardContent className="pt-8 pb-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    &quot;Being able to self-host and customize the platform to our needs has been a game-changer. The community is incredibly helpful.&quot;
                  </p>
                  <div className="pt-4">
                    <p className="font-semibold">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Quote className="h-4 w-4 text-primary" />
              </div>
              <CardContent className="pt-8 pb-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    &quot;The automated workflows and detailed analytics have helped us optimize our campaigns effectively. Great open source solution!&quot;
                  </p>
                  <div className="pt-4">
                    <p className="font-semibold">Alex Thompson</p>
                    <p className="text-sm text-muted-foreground">Marketing Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about AffTrack
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does real-time tracking work?</AccordionTrigger>
              <AccordionContent>
                Our real-time tracking system uses browser fingerprinting and server-side validation to track visitors, clicks, and conversions as they happen. The data is instantly processed and available in your dashboard, allowing you to make quick decisions based on current performance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is it really free and open source?</AccordionTrigger>
              <AccordionContent>
                Yes! AffTrack is completely free and open source under the MIT license. You can use it for personal or commercial projects, modify the code, and host it on your own servers. We believe in the power of open source software and community-driven development.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I integrate with multiple affiliate networks?</AccordionTrigger>
              <AccordionContent>
                Yes, AffTrack supports integration with all major affiliate networks including ClickBank, MaxBounty, JVZoo, and more. Our flexible API system allows for custom integrations with any network that provides API access.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How does the automated lead distribution work?</AccordionTrigger>
              <AccordionContent>
                Our automated lead distribution system uses customizable rules and conditions to route leads to the appropriate networks or buyers. You can set up routing rules based on various parameters including geography, time of day, and more.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What kind of reporting and analytics are available?</AccordionTrigger>
              <AccordionContent>
                AffTrack provides comprehensive analytics including real-time metrics, conversion tracking, revenue analysis, and performance optimization insights. You can track EPV, EPC, EPL, and other key metrics, create custom reports, and export data in various formats.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How can I contribute to the project?</AccordionTrigger>
              <AccordionContent>
                We welcome contributions from the community! You can contribute by submitting pull requests, reporting bugs, suggesting features, improving documentation, or helping other users in our community forums. Check our GitHub repository for contribution guidelines.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our open source community and start tracking your affiliate campaigns today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="https://github.com/yourusername/afftrack">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">Read the Docs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}