"use client";

import Link from "next/link";
import { Heart, LayoutDashboard, Calendar, ShoppingCart, ShoppingBasket, PlayCircle, ChefHat, Globe, Home, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { useAuth } from "@/lib/auth-store";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { user: manualUser, setUser, logout: manualLogout, openModal } = useAuth();
  const { data: session } = useSession();

  // Unified user object
  const user = session?.user ? {
    email: session.user.email,
    displayName: session.user.name,
    photoURL: session.user.image,
    plan: 'Free' // Default to Free for new Google OAuth users
  } : manualUser;

  useEffect(() => {
    const savedUser = localStorage.getItem("harvest_user");
    if (savedUser && !manualUser && !session) {
      setUser(JSON.parse(savedUser));
    }
  }, [manualUser, setUser, session]);

  const handleLogout = () => {
    if (session) {
      signOut();
    } else {
      manualLogout();
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-primary/10">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform"> */}
          <img src="https://raw.githubusercontent.com/UddavGoshika/harvest/refs/heads/main/ingredialogo.jpg" alt="Logo" className="h-16 w-16 rounded-full" />
          {/* </div> */}
          <div className="flex flex-col">
            <span className="text-2xl font-headline font-black text-primary tracking-tighter leading-none uppercase">
              INGREDIA
            </span>
            <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase leading-none mt-1">
              AI KITCHEN OS
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <NavLink href="/" icon={<Home className="h-4 w-4" />} label="Home" />
          <NavLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <NavLink href="/recipes" icon={<ChefHat className="h-4 w-4" />} label="Recipes" />
          <NavLink href="/reels" icon={<PlayCircle className="h-4 w-4" />} label="Reels" />
          <NavLink href="/pantry" icon={<ShoppingBasket className="h-4 w-4" />} label="Pantry" />
          <NavLink href="/planner" icon={<Calendar className="h-4 w-4" />} label="Planner" />
          <NavLink href="/grocery" icon={<ShoppingCart className="h-4 w-4" />} label="Grocery" />
          <NavLink href="/collection" icon={<Heart className="h-4 w-4" />} label="Saved" />

          <div className="ml-2 border-l border-primary/10 pl-4 hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest text-primary/60">
                  <Globe className="h-3 w-3 mr-2" /> EN
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-primary/10">
                <DropdownMenuItem className="text-xs font-bold py-3">English</DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-bold py-3">हिंदी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-bold py-3">తెలుగు (Telugu)</DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-bold py-3">தமிழ் (Tamil)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 min-w-10 rounded-full border-primary/10 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Chef" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-[2rem] border-primary/10 w-64 p-6 shadow-2xl">
                  <div className="flex flex-col gap-1 mb-6">
                    <span className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Active Chef</span>
                    <span className="text-lg font-headline font-bold text-primary truncate leading-tight">{user.email}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{user.plan || 'Free'} Plan Account</span>
                  </div>
                  <div className="space-y-1">
                    <DropdownMenuItem asChild>
                      <Link href="/settings?tab=preferences" className="text-xs font-bold py-3 rounded-xl hover:bg-primary/5 cursor-pointer flex items-center">
                        Kitchen Preferences
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings?tab=security" className="text-xs font-bold py-3 rounded-xl hover:bg-primary/5 cursor-pointer flex items-center">
                        Security & Privacy
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings?tab=plan" className="text-xs font-bold py-3 rounded-xl hover:bg-primary/5 cursor-pointer flex items-center">
                        Upgrade Plan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs font-bold py-3 rounded-xl text-destructive hover:bg-destructive/5 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout Profile
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-10 px-6 rounded-full bg-primary font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all text-white"
                onClick={openModal}
              >
                Login Chef
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-xs font-bold text-primary/80 hover:text-primary transition-all bg-white/50 px-3 py-2.5 rounded-full border border-primary/5 shadow-sm hover:shadow-md flex-shrink-0">
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
