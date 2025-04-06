"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add password reset logic here
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <AuthLayout
      testimonial={{
        quote: "The automated workflows and detailed analytics have helped us optimize our campaigns effectively. Great open source solution!",
        author: "Alex Thompson",
        role: "Marketing Developer"
      }}
    >
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSubmitted ? "Password Reset Complete" : "Reset your password"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSubmitted 
              ? "Your password has been reset successfully. You can now login with your new password."
              : "Enter your new password below."
            }
          </p>
        </div>
        {!isSubmitted ? (
          <div className="grid gap-6">
            <form onSubmit={onSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                  )}
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        )}
        {!isSubmitted && (
          <div className="text-center text-sm text-muted-foreground">
            <Link 
              href="/login" 
              className="hover:text-primary underline underline-offset-4"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}