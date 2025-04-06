"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface OptInDisplayProps {
  optIns: Record<string, boolean>;
}

export function OptInDisplay({ optIns }: OptInDisplayProps) {
  if (!optIns || Object.keys(optIns).length === 0) return null;

  const getOptInLabel = (key: string): string => {
    return key.replace('_optin', '').toUpperCase();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(optIns).map(([key, value]) => (
        <Badge 
          key={key}
          variant="outline" 
          className={value ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
        >
          {value ? (
            <CheckCircle2 className="h-3 w-3 mr-1" />
          ) : (
            <XCircle className="h-3 w-3 mr-1" />
          )}
          {getOptInLabel(key)}
        </Badge>
      ))}
    </div>
  );
}