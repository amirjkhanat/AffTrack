"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Network, 
  Globe, 
  Link2, 
  MousePointerClick,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowRight,
  User
} from "lucide-react";
import { UtmTagsDisplay } from "../utm-tags";
import type { RealtimeClick } from "@/lib/mock-data/realtime/clicks";

interface ClicksFeedProps {
  items: RealtimeClick[];
}

export function ClicksFeed({ items }: ClicksFeedProps) {
  const getPlacementColor = (type: string) => {
    switch (type) {
      case "banner":
        return "bg-blue-500/10 text-blue-500";
      case "native":
        return "bg-green-500/10 text-green-500";
      case "popup":
        return "bg-purple-500/10 text-purple-500";
      case "widget":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
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
                  Visitor ID: {item.visitId.slice(0, 8)}
                </Badge>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.timestamp}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.placement.name}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={getPlacementColor(item.placement.type)}
                >
                  {item.placement.type}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.offer.name}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{item.offer.payout.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{item.source.name}</span>
              <ArrowRight className="h-4 w-4" />
              <span>{item.visitDetails.landingPage}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <UtmTagsDisplay utmTags={item.utmTags} />
              <div className="flex items-center gap-4">
                {item.conversionId && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Converted
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {item.leadDetails ? `${item.leadDetails.firstName} ${item.leadDetails.lastName}` : 'No lead'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}