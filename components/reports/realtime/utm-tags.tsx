"use client";

import { Badge } from "@/components/ui/badge";

interface UtmTagsDisplayProps {
  utmTags: Record<string, string | null>;
}

export function UtmTagsDisplay({ utmTags }: UtmTagsDisplayProps) {
  if (!utmTags) return null;

  const validTags = Object.entries(utmTags)
    .filter(([_, value]) => value !== null && value !== "")
    .map(([key, value]) => ({
      key: key.replace("utm_", ""),
      value
    }));

  if (!validTags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {validTags.map(({ key, value }) => (
        <Badge 
          key={key} 
          variant="outline" 
          className="text-xs bg-muted"
        >
          {key}: {value}
        </Badge>
      ))}
    </div>
  );
}