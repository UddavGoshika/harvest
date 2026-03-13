"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Play, Pause, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const REELS = [
  { id: 1, author: "@chef_sophie", title: "Midnight Pasta Hack", likes: "12.4k", color: "bg-primary/20" },
  { id: 2, author: "@healthy_bites", title: "Expiring Spinach? Do this!", likes: "8.1k", color: "bg-primary/30" },
  { id: 3, author: "@global_eats", title: "Real Thai Green Curry", likes: "25k", color: "bg-primary/40" },
];

export default function ReelsPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[450px] aspect-[9/16] bg-neutral-900 rounded-[3rem] relative overflow-hidden shadow-2xl border border-white/10">
          
          {/* Reel Content Placeholder */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${REELS[activeIdx].color} transition-colors duration-500`}>
            <Play className="h-20 w-20 text-white/20 animate-pulse" />
            <h2 className="text-white text-3xl font-headline font-black text-center px-10 mt-6 leading-tight">
              {REELS[activeIdx].title}
            </h2>
          </div>

          {/* Social Overlays */}
          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarFallback className="bg-primary text-white font-bold">
                  {REELS[activeIdx].author[1].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-white font-black">{REELS[activeIdx].author}</p>
                <p className="text-white/60 text-xs">Recommended for you</p>
              </div>
              <Button size="sm" className="ml-auto rounded-full bg-primary font-bold px-6 h-8 text-[10px]">
                Follow
              </Button>
            </div>
            
            <div className="flex gap-6">
              <SocialIcon icon={<Heart className="h-6 w-6" />} label={REELS[activeIdx].likes} />
              <SocialIcon icon={<MessageCircle className="h-6 w-6" />} label="244" />
              <SocialIcon icon={<Share2 className="h-6 w-6" />} label="Share" />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx(prev => prev - 1)}
              className="text-white/50 hover:text-white"
              suppressHydrationWarning
            >
              <ChevronUp className="h-10 w-10" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={activeIdx === REELS.length - 1}
              onClick={() => setActiveIdx(prev => prev + 1)}
              className="text-white/50 hover:text-white"
              suppressHydrationWarning
            >
              <ChevronDown className="h-10 w-10" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SocialIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-white uppercase tracking-widest">{label}</span>
    </div>
  );
}