"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const routes = [
  "/docs/getting-started/installation",
  "/docs/getting-started/configuration",
  "/docs/getting-started/first-steps",
];

export function DocsPager() {
  const pathname = usePathname();
  const currentIndex = routes.indexOf(pathname);
  
  const prev = routes[currentIndex - 1];
  const next = routes[currentIndex + 1];

  return (
    <div className="flex items-center justify-between">
      {prev ? (
        <Button variant="ghost" asChild>
          <Link href={prev}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button variant="ghost" asChild>
          <Link href={next}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}