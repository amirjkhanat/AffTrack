"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointerClick, 
  ArrowRightLeft, 
  DollarSign,
  Clock,
  Activity,
  CreditCard,
  ArrowUpRight
} from "lucide-react";
import type { LeadActivity } from "@/lib/mock-data/realtime/activities";

interface LeadActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadDetails: any;
  activities: LeadActivity[];
}

export function LeadActivityModal({ 
  open, 
  onOpenChange, 
  leadDetails,
  activities 
}: LeadActivityModalProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "click":
        return <MousePointerClick className="h-4 w-4" />;
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4" />;
      case "conversion":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityDetails = (type: string, details: any) => {
    switch (type) {
      case "click":
        return (
          <>
            <p className="text-sm">
              Clicked on <span className="font-medium">{details.placement}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Offer: {details.offer}
            </p>
          </>
        );
      case "transfer":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                Transferred to <span className="font-medium">{details.network}</span>
              </p>
              <Badge variant="outline" className={
                details.status === "accepted" 
                  ? "bg-green-500/10 text-green-500" 
                  : details.status === "duplicate"
                  ? "bg-orange-500/10 text-orange-500"
                  : "bg-yellow-500/10 text-yellow-500"
              }>{details.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Payout: ${details.payout.toFixed(2)}</span>
              <span className="font-mono">ID: {details.transferId.slice(0, 8)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Reason: {details.reason}
            </p>
          </div>
        );
      case "conversion":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              Converted on <span className="font-medium">{details.offer}</span>
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{details.paymentMethod}</span>
              </div>
              <span className="font-mono">ID: {details.transactionId.slice(0, 8)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Value: ${details.value.toFixed(2)}
              </span>
              {details.upsell && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Upsell
                </Badge>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lead Activity</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Lead Summary */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {leadDetails.firstName} {leadDetails.lastName}
              </h3>
              <Badge variant="outline">
                {leadDetails.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{leadDetails.email}</p>
            <p className="text-sm text-muted-foreground">{leadDetails.phone}</p>
          </div>

          {/* Activity Timeline */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="bg-muted p-2 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 bg-card border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">
                        {activity.type}
                      </span>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.timestamp}
                      </div>
                    </div>
                    {getActivityDetails(activity.type, activity.details)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Activity Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <MousePointerClick className="h-4 w-4" />
                <span className="text-sm">Clicks</span>
              </div>
              <p className="text-2xl font-bold">{activities.filter(a => a.type === "click").length}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <ArrowRightLeft className="h-4 w-4" />
                <span className="text-sm">Transfers</span>
              </div>
              <p className="text-2xl font-bold">{activities.filter(a => a.type === "transfer").length}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Conversions</span>
              </div>
              <p className="text-2xl font-bold">{activities.filter(a => a.type === "conversion").length}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}