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
              Support the <span className="text-accent italic">Harvest.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a simple, affordable plan to unlock advanced AI features and help us maintain high-quality API calls.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <Card className="border-2 border-primary/5 bg-white/50 relative overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-headline font-bold text-primary">Harvest Free</CardTitle>
                <CardDescription>Perfect for casual home cooks.</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-black text-primary">$0</span>
                  <span className="text-muted-foreground ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <FeatureItem text="3 AI Recipes per day" />
                <FeatureItem text="Basic visual pantry search" />
                <FeatureItem text="Save up to 10 recipes" />
                <FeatureItem text="Standard nutritional data" />
              </CardContent>
              <CardFooter className="p-8">
                <Button variant="outline" className="w-full rounded-2xl h-12">Current Plan</Button>
              </CardFooter>
            </Card>

            <Card className="border-4 border-accent bg-white shadow-2xl relative">
              <div className="absolute top-0 right-0 bg-accent text-white px-6 py-1 font-bold text-[10px] uppercase tracking-widest rounded-bl-2xl">
                Most Popular
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
                  Harvest Seedling
                  <Sparkles className="h-5 w-5 text-accent" />
                </CardTitle>
                <CardDescription>Professional-grade culinary intelligence.</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-black text-primary">$1.99</span>
                  <span className="text-muted-foreground ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <FeatureItem text="Unlimited AI Recipes" premium />
                <FeatureItem text="Advanced Multimodal analysis" premium />
                <FeatureItem text="Full Meal Planning Suite" premium />
                <FeatureItem text="Offline recipe storage" premium />
                <FeatureItem text="Priority API access" premium />
              </CardContent>
              <CardFooter className="p-8">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl h-12 shadow-lg font-bold">
                  Upgrade Now
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-primary/5 p-12 rounded-[3rem] space-y-8 max-w-2xl mx-auto border border-primary/5">
            <div className="flex items-center justify-center gap-4">
              <Zap className="h-8 w-8 text-accent" />
              <h3 className="text-2xl font-headline font-bold text-primary">Why a paid plan?</h3>
            </div>
            <p className="text-muted-foreground font-medium italic">
              "We use high-performance multimodal LLMs to analyze your ingredient photos and generate gourmet recipes. Your small contribution helps us keep these advanced AI models running for everyone."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ text, premium }: { text: string; premium?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-5 w-5 rounded-full flex items-center justify-center ${premium ? 'bg-accent/10 text-accent' : 'bg-primary/5 text-primary/40'}`}>
        <Check className="h-3.5 w-3.5" />
      </div>
      <span className={`text-sm font-medium ${premium ? 'text-primary' : 'text-muted-foreground'}`}>{text}</span>
    </div>
  );
}