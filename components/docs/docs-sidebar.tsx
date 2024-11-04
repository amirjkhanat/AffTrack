"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface DocsSidebarProps {
  searchTerm: string;
}

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/getting-started" },
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "Configuration", href: "/docs/getting-started/configuration" },
      { title: "First Steps", href: "/docs/getting-started/first-steps" },
    ],
  },
  {
    title: "Tracking",
    items: [
      { title: "Overview", href: "/docs/tracking" },
      { title: "Visitor Tracking", href: "/docs/tracking/visitors" },
      { title: "Click Tracking", href: "/docs/tracking/clicks" },
      { title: "Lead Tracking", href: "/docs/tracking/leads" },
      { title: "Conversion Tracking", href: "/docs/tracking/conversions" },
    ],
  },
  {
    title: "Transfer Management",
    items: [
      { title: "Overview", href: "/docs/transfers" },
      { title: "Setting Up Partners", href: "/docs/transfers/partners" },
      { title: "Transfer Feeds", href: "/docs/transfers/feeds" },
      { title: "Conditions", href: "/docs/transfers/conditions" },
      { title: "Scheduling", href: "/docs/transfers/scheduling" },
      { title: "Response Handling", href: "/docs/transfers/responses" },
    ],
  },
  {
    title: "Analytics & Reports",
    items: [
      { title: "Overview", href: "/docs/analytics" },
      { title: "Real-time Analytics", href: "/docs/analytics/realtime" },
      { title: "Revenue Analysis", href: "/docs/analytics/revenue" },
      { title: "Optimization", href: "/docs/analytics/optimization" },
      { title: "Custom Reports", href: "/docs/analytics/custom-reports" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "API Reference", href: "/docs/api" },
      { title: "Webhooks", href: "/docs/webhooks" },
      { title: "Security", href: "/docs/security" },
      { title: "Performance", href: "/docs/performance" },
      { title: "Troubleshooting", href: "/docs/troubleshooting" },
    ],
  },
];

export function DocsSidebar({ searchTerm }: DocsSidebarProps) {
  const pathname = usePathname();

  const filteredItems = sidebarItems.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="w-full">
      {filteredItems.map((section, i) => (
        <div key={i} className="px-4 py-3">
          <h4 className="mb-3 text-sm font-semibold tracking-tight text-foreground/90">
            {section.title}
          </h4>
          <div className="grid grid-flow-row auto-rows-max text-sm">
            {section.items.map((item, j) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={j}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <ChevronRight 
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isActive && "rotate-90"
                    )} 
                  />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}