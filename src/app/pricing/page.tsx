"use client";

import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-16 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-headline font-black text-primary leading-tight">
              Support the <span className="text-accent italic">Ingredia.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Choose a simple, affordable plan to unlock advanced AI features and help us maintain high-quality API calls.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 text-left">
            <Card className="border-2 border-primary/5 bg-white/50 relative overflow-hidden rounded-[3rem] p-4">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-headline font-black text-primary uppercase tracking-tight">Ingredia Free</CardTitle>
                <CardDescription className="text-base">Perfect for casual home cooks.</CardDescription>
                <div className="mt-8">
                  <span className="text-5xl font-black text-primary">$0</span>
                  <span className="text-muted-foreground ml-3 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-5">
                <FeatureItem text="3 AI Recipes per day" />
                <FeatureItem text="Basic visual pantry search" />
                <FeatureItem text="Save up to 10 recipes" />
                <FeatureItem text="Standard nutritional data" />
              </CardContent>
              <CardFooter className="p-8">
                <Button variant="outline" className="w-full rounded-full h-14 font-black uppercase text-xs tracking-widest border-primary/20">Current Plan</Button>
              </CardFooter>
            </Card>

            <Card className="border-4 border-accent bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] relative rounded-[3rem] p-4">
              <div className="absolute top-0 right-0 bg-accent text-white px-8 py-2 font-black text-[10px] uppercase tracking-[0.2em] rounded-bl-[2rem] shadow-sm">
                Recommended
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-headline font-black text-primary flex items-center gap-3 uppercase tracking-tight">
                  Ingredia Seedling
                  <Sparkles className="h-6 w-6 text-accent" />
                </CardTitle>
                <CardDescription className="text-base">Professional-grade culinary intelligence.</CardDescription>
                <div className="mt-8">
                  <span className="text-5xl font-black text-primary">$1.99</span>
                  <span className="text-muted-foreground ml-3 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-5">
                <FeatureItem text="Unlimited AI Recipes" premium />
                <FeatureItem text="Advanced Multimodal analysis" premium />
                <FeatureItem text="Full Meal Planning Suite" premium />
                <FeatureItem text="Offline recipe storage" premium />
                <FeatureItem text="Priority API access" premium />
              </CardContent>
              <CardFooter className="p-8">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-full h-14 shadow-2xl font-black uppercase text-xs tracking-[0.2em]">
                  Upgrade Now
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-primary/5 p-12 rounded-[4rem] space-y-8 max-w-2xl mx-auto border border-primary/5 shadow-inner">
            <div className="flex items-center justify-center gap-4">
              <Zap className="h-8 w-8 text-accent" />
              <h3 className="text-3xl font-headline font-bold text-primary">Why pay?</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
              "We use high-performance multimodal LLMs to analyze your ingredient photos and generate Michelin-star recipes. Your small contribution helps us keep these advanced AI models running sustainably."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ text, premium }: { text: string; premium?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${premium ? 'bg-accent/20 text-accent' : 'bg-primary/5 text-primary/40'}`}>
        <Check className="h-4 w-4" />
      </div>
      <span className={`text-sm font-bold ${premium ? 'text-primary' : 'text-muted-foreground'}`}>{text}</span>
    </div>
  );
}
