import { Metadata } from "next";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsPager } from "@/components/docs/docs-pager";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation - AffTrack",
  description: "Learn how to use AffTrack to manage your affiliate campaigns.",
};

export default function DocsPage() {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsHeader
          heading="Documentation"
          text="Welcome to AffTrack documentation. Learn how to track, manage, and optimize your affiliate campaigns."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          <Link
            href="/docs/getting-started"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto p-6 text-left"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Getting Started</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                Learn how to install, configure, and start using AffTrack.
              </p>
            </div>
          </Link>

          <Link
            href="/docs/tracking"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto p-6 text-left"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Tracking Setup</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                Set up tracking for visitors, clicks, leads, and conversions.
              </p>
            </div>
          </Link>

          <Link
            href="/docs/transfers"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto p-6 text-left"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Transfer Management</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                Learn about transfer feeds, conditions, and automation.
              </p>
            </div>
          </Link>

          <Link
            href="/docs/analytics"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto p-6 text-left"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Analytics & Reports</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                Understand your data with real-time analytics and reports.
              </p>
            </div>
          </Link>
        </div>

        <DocsPager />
      </div>
    </main>
  );
}