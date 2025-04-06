"use client";

import { Zap } from "lucide-react";
import { getRandomAuthGif } from "@/lib/auth-gifs";
import { useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export function AuthLayout({ children, testimonial }: AuthLayoutProps) {
  const [backgroundGif, setBackgroundGif] = useState("");

  useEffect(() => {
    setBackgroundGif(getRandomAuthGif());
  }, []);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary/50" />
        {/* Randomly selected GIF background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-500"
          style={{ 
            backgroundImage: `url("${backgroundGif}")`,
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <Zap className="h-6 w-6" />
          AffTrack
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {testimonial.quote}
            </p>
            <footer className="text-sm">
              {testimonial.author}, {testimonial.role}
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        {children}
      </div>
    </div>
  );
}