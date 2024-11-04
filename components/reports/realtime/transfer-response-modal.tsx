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
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRightLeft,
  Webhook
} from "lucide-react";
import type { RealtimeTransfer } from "@/lib/mock-data/realtime/transfers";

interface TransferResponseModalProps {
  transfer: RealtimeTransfer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferResponseModal({ 
  transfer, 
  open, 
  onOpenChange 
}: TransferResponseModalProps) {
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
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const prePingResponse = {
    success: transfer.prePing?.success,
    message: transfer.prePing?.message,
    validation_id: transfer.prePing?.validationId,
    timestamp: transfer.timestamp,
    request: {
      method: "POST",
      url: "https://api.partner.com/validate",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx"
      },
      body: {
        email: transfer.leadDetails.email,
        phone: transfer.leadDetails.phone,
        firstName: transfer.leadDetails.firstName,
        lastName: transfer.leadDetails.lastName,
        age: transfer.leadDetails.age,
        interests: transfer.leadDetails.interests
      }
    }
  };

  const transferResponse = {
    id: transfer.id,
    lead_id: transfer.leadId,
    status: transfer.status,
    message: transfer.responseData.message,
    timestamp: transfer.transferTime,
    network: transfer.network,
    offer: {
      name: transfer.offer,
      payout: transfer.payout
    },
    lead: {
      firstName: transfer.leadDetails.firstName,
      lastName: transfer.leadDetails.lastName,
      email: transfer.leadDetails.email,
      phone: transfer.leadDetails.phone,
      age: transfer.leadDetails.age,
      interests: transfer.leadDetails.interests
    },
    source: {
      name: transfer.source,
      utm_tags: transfer.utmTags
    },
    request: {
      method: "POST",
      url: "https://api.partner.com/transfer",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx",
        "X-Validation-ID": transfer.prePing?.validationId
      }
    },
    conditions: transfer.conditions
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transfer Response Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-6">
            {transfer.prePing && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Webhook className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Pre-ping Response</h3>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={transfer.prePing.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                    >
                      {transfer.prePing.success ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {transfer.prePing.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">
{JSON.stringify(prePingResponse, null, 2)}</pre>
                  </div>
                </div>

                <Separator />
              </>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Transfer Response</h3>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(transfer.status)}
                >
                  {getStatusIcon(transfer.status)}
                  <span className="ml-1">{transfer.status}</span>
                </Badge>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">
{JSON.stringify(transferResponse, null, 2)}</pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}