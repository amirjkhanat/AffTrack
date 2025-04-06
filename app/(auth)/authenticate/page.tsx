"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function AuthenticatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add authentication code verification logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <AuthLayout
      testimonial={{
        quote: "AffTrack's security features give us peace of mind while managing our affiliate campaigns. The two-factor authentication is seamless.",
        author: "Emily Rodriguez",
        role: "Security Engineer"
      }}
    >
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Enter Authentication Code</h1>
          <p className="text-sm text-muted-foreground">
            We've sent a verification code to your email address. Please enter it below.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                setCode(value);
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              disabled={isLoading}
            />
          </div>
          <Button className="w-full" disabled={isLoading || code.length !== 6}>
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
            )}
            Verify Code
          </Button>
        </form>
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Didn't receive a code?{" "}
            <Button variant="link" className="p-0 h-auto" disabled={isLoading}>
              Resend Code
            </Button>
          </p>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <Link 
            href="/login" 
            className="hover:text-primary underline underline-offset-4"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}