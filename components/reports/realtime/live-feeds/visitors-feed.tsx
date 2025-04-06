"use client";

import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Network, Globe, Link2, ArrowRight, Clock, User } from "lucide-react";
import { UtmTagsDisplay } from "../utm-tags";
import { MetricsDisplay } from "../metrics-display";

interface Metrics {
  lastMinute: number;
  lastFiveMinutes: number;
  lastFifteenMinutes: number;
}

interface Visitor {
  id: string;
  ipAddress: string;
  referer?: string;
  landingPage: {
    name: string;
    path: string;
  };
  trafficSource?: {
    name: string;
  };
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  country?: string;
  region?: string;
  city?: string;
  createdAt: string;
  leadDetails?: {
    firstName: string;
    lastName: string;
  };
}

function formatTimeSinceVisitor(createdAt: string): string {
  const visitDate = new Date(createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - visitDate.getTime()) / 1000);

  const seconds = diffInSeconds % 60;
  const minutes = Math.floor(diffInSeconds / 60) % 60;
  const hours = Math.floor(diffInSeconds / 3600) % 24;
  const days = Math.floor(diffInSeconds / 86400);

  if (days > 0) return `${days}d ${hours}h ago`;
  if (hours > 0) return `${hours}h ${minutes}m ago`;
  if (minutes > 0) return `${minutes}m ${seconds}s ago`;
  return `${seconds}s ago`;
}

export function VisitorsFeed() {
  const [items, setItems] = useState<Visitor[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/reports/realtime/visitors');
        const data = await response.json();
        console.log('API Response:', data);
        if (data && data.data) {
          setItems(data.data.items || []);
          setMetrics(data.data.metrics || null);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching visitors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!items.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No visitors to display
      </div>
    );
  }

  return (
    <div>
      {metrics && <MetricsDisplay metrics={metrics} />}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4 p-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{item.ipAddress}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    Visitor ID: {item.id.slice(0, 8)}
                  </Badge>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.city || 'Unknown'}, {item.region || 'Unknown'}, {item.country || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeSinceVisitor(item.createdAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {item.referer || 'Direct Visitor'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.landingPage?.name || 'Unknown'}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Path: {new URL(item.landingPage?.baseUrl || '').pathname || 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{item.trafficSource?.name || 'Unknown'}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{item.landingPage?.name || 'Unknown'}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <UtmTagsDisplay utmTags={{
                  source: item.utmSource,
                  medium: item.utmMedium,
                  campaign: item.utmCampaign,
                  content: item.utmContent,
                  term: item.utmTerm
                }} />
                {item.leadDetails && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item.leadDetails.firstName} {item.leadDetails.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}