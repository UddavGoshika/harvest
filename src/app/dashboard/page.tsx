
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBasket, Calendar, AlertTriangle, TrendingUp, Sparkles, 
  ChevronRight, ArrowUpRight, ChefHat, Clock, Flame, Apple, Droplets, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { RecipeDetail } from "@/components/recipe-detail";

export default function DashboardPage() {
  const [pantryItems, setPantryItems] = useState<any[]>([]);
  const [planner, setPlanner] = useState<any>({});
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("harvest_pantry") || "[]");
    const pl = JSON.parse(localStorage.getItem("harvest_meal_planner") || "{}");
    const s = JSON.parse(localStorage.getItem("harvest_saved_recipes") || "[]");
    setPantryItems(p);
    setPlanner(pl);
    setSavedRecipes(s);
  }, []);

  const expiringSoon = pantryItems.filter(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return daysLeft >= 0 && daysLeft <= 3;
  });

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayMeals = planner[today] || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">

          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-headline font-black text-primary">Kitchen Dashboard</h1>
              <p className="text-muted-foreground font-medium text-lg">Daily overview of your AI-managed kitchen.</p>
            </div>
            <div className="flex gap-3">
               <Link href="/">
                 <Button className="rounded-full bg-gradient-primary border-none text-white font-black shadow-xl h-12 px-8 uppercase text-xs tracking-widest">
                   Find Recipes <Sparkles className="ml-2 h-4 w-4" />
                 </Button>
               </Link>
            </div>
          </header>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Pantry Pulse */}
            <Card className="md:col-span-2 rounded-[3rem] border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="p-10 border-b border-primary/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-headline font-bold text-primary">Pantry Health</CardTitle>
                  <CardDescription className="text-sm font-medium">Inventory overview and expiry alerts.</CardDescription>
                </div>
                <Link href="/pantry">
                  <Button variant="ghost" className="text-secondary font-bold group">
                    View All <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                {expiringSoon.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-black uppercase text-[10px] tracking-widest">Expiring Soon (Next 72 Hours)</span>
                    </div>
                    <div className="grid gap-4">
                      {expiringSoon.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-destructive/5 rounded-2xl border border-destructive/10">
                          <div className="flex items-center gap-4">
                            <ShoppingBasket className="h-5 w-5 text-destructive" />
                            <div className="flex flex-col">
                              <span className="font-bold text-primary">{item.name}</span>
                              <span className="text-[10px] text-muted-foreground uppercase font-black">Quantity: {item.quantity}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-destructive border-destructive/20 font-black text-[10px] uppercase">
                            Rescue Now
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-primary/5 rounded-[2.5rem] border border-dashed border-primary/20">
                     <p className="text-primary/60 font-bold italic">All ingredients are fresh!</p>
                  </div>
                )}

                <div className="pt-6 border-t border-primary/5">
                   <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-6">Inventory Utilization</h4>
                   <div className="grid grid-cols-2 gap-8">
                      <DashboardProgress label="Produce" value={65} />
                      <DashboardProgress label="Proteins" value={40} />
                      <DashboardProgress label="Dairy" value={80} />
                      <DashboardProgress label="Grains" value={25} />
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Plan */}
            <Card className="rounded-[3rem] border-none shadow-xl bg-primary text-white overflow-hidden flex flex-col">
               <CardHeader className="p-10 space-y-2">
                  <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-headline font-bold">Today&apos;s Menu</CardTitle>
                  <CardDescription className="text-white/60 font-medium">Your planned meals for {today}.</CardDescription>
               </CardHeader>
               <CardContent className="px-10 pb-10 flex-1 flex flex-col">
                  {todayMeals.length > 0 ? (
                    <div className="space-y-6">
                       {todayMeals.map((meal: any, i: number) => (
                         <div
                           key={i}
                           className="bg-white/10 p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group"
                           onClick={() => setSelectedRecipe(meal)}
                         >
                           <div className="flex justify-between items-start mb-2">
                             <h5 className="font-bold text-lg leading-tight">{meal.recipeName}</h5>
                             <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-black text-white/60 uppercase tracking-widest">
                             <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {meal.estimatedPrepTime}</span>
                             <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {meal.nutrition?.calories || 450} kcal</span>
                           </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 rounded-[2.5rem] p-8 border border-white/10">
                       <ChefHat className="h-12 w-12 text-white/30" />
                       <p className="text-white/60 font-bold leading-relaxed italic">No meals planned for today. Why not scan your fridge?</p>
                       <Link href="/planner">
                         <Button className="rounded-full bg-white text-primary font-bold hover:bg-white/90">
                           Go to Planner
                         </Button>
                       </Link>
                    </div>
                  )}
               </CardContent>
            </Card>

          </div>

          {/* Quick Insights Bar */}
          <div className="grid md:grid-cols-4 gap-6">
             <InsightStat icon={<TrendingUp className="h-5 w-5" />} label="Weekly Goal" value="4/7 Meals" />
             <InsightStat icon={<Sparkles className="h-5 w-5" />} label="AI Precision" value="98%" />
             <InsightStat icon={<ShoppingBasket className="h-5 w-5" />} label="Rescue Score" value="A+" />
             <InsightStat icon={<ChefHat className="h-5 w-5" />} label="Level" value="Master Chef" />
          </div>
        </div>
      </main>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          availableIngredients={[]} 
        />
      )}
    </div>
  );
}

function DashboardProgress({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-black text-primary uppercase tracking-widest">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-2 rounded-full" />
    </div>
  );
}

function InsightStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-md flex items-center gap-4 border border-primary/5">
      <div className="h-12 w-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-lg font-black text-primary leading-none">{value}</p>
      </div>
    </div>
  );
}
