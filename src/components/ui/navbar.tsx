"use client";

import Link from "next/link";
import { UtensilsCrossed, Heart, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline font-bold text-primary tracking-tight">
            Harvest Recipes AI
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/collection" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
            <Heart className="h-4 w-4" />
            Collection
          </Link>
        </div>
      </div>
    </nav>
  );
}