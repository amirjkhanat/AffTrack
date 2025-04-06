"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block w-80 border-r bg-muted/10">
        <div className="sticky top-0 z-40">
          <div className="flex h-16 items-center border-b px-4 bg-background">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-muted/50"
              />
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
          <DocsSidebar searchTerm={searchTerm} />
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-[calc(100vh)] overflow-auto">
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 lg:px-8 lg:py-12">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}