"use client";

import Link from "next/link";
import { Heart, LayoutDashboard, Calendar, ShoppingCart, ShoppingBasket, PlayCircle, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
             <LogoIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-headline font-black text-primary tracking-tighter leading-none uppercase">
              INGREDIA
            </span>
            <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase leading-none mt-1">
              AI KITCHEN OS
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <NavLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <NavLink href="/reels" icon={<PlayCircle className="h-4 w-4" />} label="Discovery" />
          <NavLink href="/pantry" icon={<ShoppingBasket className="h-4 w-4" />} label="Fridge" />
          <NavLink href="/planner" icon={<Calendar className="h-4 w-4" />} label="Planner" />
          <NavLink href="/grocery" icon={<ShoppingCart className="h-4 w-4" />} label="Grocery" />
          <NavLink href="/collection" icon={<Heart className="h-4 w-4" />} label="Vault" />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-xs font-bold text-primary/80 hover:text-primary transition-all bg-white/50 px-3 py-2.5 rounded-full border border-primary/5 shadow-sm hover:shadow-md">
      <span className="text-secondary">{icon}</span>
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}

function LogoIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 4 13V5a2 2 0 0 1 2-2h5" />
      <path d="M13 20a7 7 0 0 0 7-7V5a2 2 0 0 0-2-2h-5" />
      <path d="M12 20v2" />
      <path d="M12 3v2" />
      <path d="M12 11v4" />
    </svg>
  );
}