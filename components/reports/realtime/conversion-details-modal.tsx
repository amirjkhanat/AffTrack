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
  CreditCard,
  ShoppingCart,
  DollarSign
} from "lucide-react";
import type { RealtimeConversion } from "@/lib/mock-data/realtime/conversions";

interface ConversionDetailsModalProps {
  conversion: RealtimeConversion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConversionDetailsModal({ 
  conversion, 
  open, 
  onOpenChange 
}: ConversionDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "refunded":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "refunded":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const conversionResponse = {
    id: conversion.id,
    click_id: conversion.clickId,
    transfer_id: conversion.transferId,
    status: conversion.conversionDetails.status,
    timestamp: conversion.timestamp,
    offer: conversion.offer,
    transaction: {
      id: conversion.conversionDetails.transactionId,
      value: conversion.conversionDetails.value,
      payment_method: conversion.conversionDetails.paymentMethod,
      products: conversion.conversionDetails.products,
      upsell: conversion.conversionDetails.upsell
    },
    lead: conversion.leadDetails,
    source: conversion.source,
    utm_tags: conversion.utmTags,
    response: conversion.response
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Conversion Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Order Summary</h3>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(conversion.conversionDetails.status)}
                >
                  {getStatusIcon(conversion.conversionDetails.status)}
                  <span className="ml-1">{conversion.conversionDetails.status}</span>
                </Badge>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono">{conversion.conversionDetails.transactionId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize">
                      {conversion.conversionDetails.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Value:</span>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-bold">
                      {formatCurrency(conversion.conversionDetails.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Response Data</h3>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">
{JSON.stringify(conversionResponse, null, 2)}</pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}