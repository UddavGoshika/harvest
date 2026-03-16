"use client";

import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCurrentPlan, setPlan } from "@/lib/plans";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const [activePlan, setActivePlan] = useState("FREE");
  const { toast } = useToast();

  useEffect(() => {
    setActivePlan(getCurrentPlan());
  }, []);

  const handleUpgrade = (plan: string) => {
    setPlan(plan);
    setActivePlan(plan);
    toast({
      title: `${plan} Plan Activated`,
      description: `You have successfully switched to the ${plan} tier.`
    });
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-16 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-headline font-black text-primary leading-tight">
              Support the <span className="text-secondary italic">Ingredia.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Choose a simple, affordable plan to unlock advanced AI features and help us maintain high-quality AI models.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {/* Free Plan */}
            <Card className={`border-2 relative overflow-hidden rounded-[2.5rem] p-2 flex flex-col transition-all ${activePlan === 'FREE' ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/10' : 'border-primary/5 bg-white/50'}`}>
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-headline font-black text-primary uppercase tracking-tight">Free</CardTitle>
                <CardDescription className="text-xs">Casual home cooks.</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-black text-primary">$0</span>
                  <span className="text-muted-foreground ml-2 font-bold uppercase text-[8px] tracking-widest">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 flex-1">
                <FeatureItem text="3 Recipes / day" limit="3" />
                <FeatureItem text="Basic Pantry Scan" />
                <FeatureItem text="10 Saved Recipes" limit="10" />
                <FeatureItem text="Standard AI" />
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  variant={activePlan === 'FREE' ? "secondary" : "outline"}
                  disabled={activePlan === 'FREE'}
                  onClick={() => handleUpgrade('FREE')}
                  className="w-full rounded-full h-12 font-black uppercase text-[10px] tracking-widest border-primary/20"
                >
                  {activePlan === 'FREE' ? 'Current' : 'Select'}
                </Button>
              </CardFooter>
            </Card>

            {/* Sprout Plan */}
            <Card className={`border-2 relative overflow-hidden rounded-[2.5rem] p-2 flex flex-col transition-all ${activePlan === 'SPROUT' ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/10' : 'border-primary/5 bg-white/50'}`}>
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-headline font-black text-primary uppercase tracking-tight">Sprout</CardTitle>
                <CardDescription className="text-xs">The growing chef.</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-black text-primary">$2.99</span>
                  <span className="text-muted-foreground ml-2 font-bold uppercase text-[8px] tracking-widest">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 flex-1">
                <FeatureItem text="20 Recipes / day" limit="20" premium />
                <FeatureItem text="Advanced Vision AI" premium />
                <FeatureItem text="50 Saved Recipes" limit="50" premium />
                <FeatureItem text="Weekly Planner" premium />
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  disabled={activePlan === 'SPROUT'}
                  onClick={() => handleUpgrade('SPROUT')}
                  className="w-full bg-primary text-white hover:bg-primary/90 rounded-full h-12 font-black uppercase text-[10px] tracking-widest"
                >
                  {activePlan === 'SPROUT' ? 'Current' : 'Upgrade'}
                </Button>
              </CardFooter>
            </Card>

            {/* Seedling Plan */}
            <Card className={`border-4 bg-white shadow-xl relative rounded-[2.5rem] p-2 flex flex-col scale-105 z-10 transition-all ${activePlan === 'SEEDLING' ? 'border-accent ring-8 ring-accent/10' : 'border-accent/40'}`}>
              <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 font-black text-[8px] uppercase tracking-[0.2em] rounded-bl-[1.5rem]">
                POPULAR
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-headline font-black text-primary flex items-center gap-2 uppercase tracking-tight">
                  Seedling
                  <Sparkles className="h-4 w-4 text-accent" />
                </CardTitle>
                <CardDescription className="text-xs">Culinary Master.</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-black text-primary">$5.99</span>
                  <span className="text-muted-foreground ml-2 font-bold uppercase text-[8px] tracking-widest">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 flex-1">
                <FeatureItem text="Unlimited Recipes" limit="∞" premium />
                <FeatureItem text="Cloud Storage (R2)" premium />
                <FeatureItem text="Multimodal Search" premium />
                <FeatureItem text="Nutritional Deep-Dive" premium />
                <FeatureItem text="Priority AI Models" premium />
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  disabled={activePlan === 'SEEDLING'}
                  onClick={() => handleUpgrade('SEEDLING')}
                  className="w-full bg-accent hover:bg-accent/90 text-white rounded-full h-12 shadow-lg font-black uppercase text-[10px] tracking-widest"
                >
                  {activePlan === 'SEEDLING' ? 'Current Pro' : 'Choose Pro'}
                </Button>
              </CardFooter>
            </Card>

            {/* Harvest Plan */}
            <Card className={`border-2 relative overflow-hidden rounded-[2.5rem] p-2 flex flex-col transition-all ${activePlan === 'HARVEST' ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/10' : 'border-primary/5 bg-white/50'}`}>
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-headline font-black text-primary uppercase tracking-tight">Harvest</CardTitle>
                <CardDescription className="text-xs">The Professional Lab.</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-black text-primary">$12.99</span>
                  <span className="text-muted-foreground ml-2 font-bold uppercase text-[8px] tracking-widest">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 flex-1">
                <FeatureItem text="Team / Family Sharing" premium />
                <FeatureItem text="Custom Diet Profiles" premium />
                <FeatureItem text="API Data Export" premium />
                <FeatureItem text="White-glove Support" premium />
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  disabled={activePlan === 'HARVEST'}
                  onClick={() => handleUpgrade('HARVEST')}
                  className="w-full bg-primary text-white hover:bg-primary/90 rounded-full h-12 font-black uppercase text-[10px] tracking-widest"
                >
                  {activePlan === 'HARVEST' ? 'Current Lab' : 'Go Unlimited'}
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

function FeatureItem({ text, premium, limit }: { text: string; premium?: boolean; limit?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${premium ? 'bg-accent/20 text-accent' : 'bg-primary/5 text-primary/40'}`}>
          <Check className="h-4 w-4" />
        </div>
        <span className={`text-sm font-bold ${premium ? 'text-primary' : 'text-muted-foreground'}`}>{text}</span>
      </div>
      {limit && (
        <Badge variant="outline" className="text-[8px] font-black border-primary/10 px-2 py-0 h-5">
          {limit}
        </Badge>
      )}
    </div>
  );
}
