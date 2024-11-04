"use client";

import { Zap, LayoutDashboard, LogOut, Moon, Settings, Sun, Users, Link2, LineChart, Activity, LogIn, UserPlus, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { SettingsModal } from "./settings/settings-modal";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();

  // List of public routes where navbar should be hidden
  const publicRoutes = ['/login', '/register'];

  // Hide navbar on public routes
  if (publicRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 container mx-auto">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 mr-6">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AffTrack</span>
          </Link>
          
          {session ? (
            // Authenticated navigation items
            <div className="hidden md:flex items-center space-x-4 flex-1">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/landing-pages">
                  <Layout className="h-4 w-4 mr-2" />
                  Builder
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/assets">
                  <Link2 className="h-4 w-4 mr-2" />
                  Assets
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/reports">
                  <LineChart className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/users">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/activity">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity
                </Link>
              </Button>
            </div>
          ) : (
            // Public navigation items (if any)
            <div className="flex-1" />
          )}

          <div className="flex items-center space-x-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session ? (
              // Authenticated buttons
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              // Show login/register only on home page
              pathname === "/" && (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/register">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {session && (
        <SettingsModal 
          open={showSettings} 
          onOpenChange={setShowSettings}
        />
      )}
    </>
  );
}