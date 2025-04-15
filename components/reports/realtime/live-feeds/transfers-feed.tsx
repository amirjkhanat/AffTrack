"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Network, 
  Globe, 
  Link2, 
  ArrowRight, 
  User,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { UtmTagsDisplay } from "../utm-tags";
import { TransferResponseModal } from "../transfer-response-modal";
import type { RealtimeTransfer } from "@/lib/mock-data/realtime/transfers";

interface TransfersFeedProps {
  items: RealtimeTransfer[];
}

export function TransfersFeed({ items }: TransfersFeedProps) {
  const [selectedTransfer, setSelectedTransfer] = useState<RealtimeTransfer | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "rejected":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <>
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
                    Lead ID: {item.leadId ? item.leadId.slice(0, 8) : 'Unknown'}
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
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {item.leadDetails ? `${item.leadDetails.firstName} ${item.leadDetails.lastName}` : 'Unknown'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {item.leadDetails?.email || 'Unknown'}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {typeof item.network === 'string'
                        ? item.network
                        : (typeof item.network === 'object' && item.network?.name)
                          ? item.network.name
                          : 'Unknown Network'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {typeof item.offer === 'string'
                        ? item.offer
                        : (typeof item.offer === 'object' && item.offer?.name)
                          ? item.offer.name
                          : 'Unknown Offer'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {typeof item.payout === 'number'
                        ? `$${item.payout.toFixed(2)}`
                        : typeof item.payout === 'string'
                          ? item.payout
                          : (typeof item.payout === 'object' && item.payout?.value)
                            ? `$${item.payout.value}`
                            : '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <UtmTagsDisplay utmTags={item.utmTags} />
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={`cursor-pointer ${getStatusColor(item.status || '')}`}
                    onClick={() => setSelectedTransfer(item)}
                  >
                    {getStatusIcon(item.status || '')}
                    {item.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {selectedTransfer && (
        <TransferResponseModal
          transfer={selectedTransfer}
          open={!!selectedTransfer}
          onOpenChange={(open) => !open && setSelectedTransfer(null)}
        />
      )}
    </>
  );
}