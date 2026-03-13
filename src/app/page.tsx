
"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/ui/navbar";
import { IngredientInput } from "@/components/ingredient-input";
import { generateRecipeSuggestions, GenerateRecipeSuggestionsOutput } from "@/ai/flows/generate-recipe-suggestions";
import { generatePantrySuggestions, GeneratePantrySuggestionsOutput } from "@/ai/flows/generate-pantry-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, Sparkles, ChevronRight, ChefHat, ShoppingBasket, Plus, 
  Flame, Info, RotateCcw, Globe, Trophy, PlayCircle, Camera, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Utensils, Heart, TrendingUp, Users, Check
} from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const REELS_MOCK = [
  { id: 1, author: "@chef_sophie", title: "Midnight Pasta Hack", likes: "12.4k", tag: "Pasta", seed: "pasta-reel" },
  { id: 2, author: "@healthy_bites", title: "Expiring Spinach? Do this!", likes: "8.1k", tag: "Waste Reduction", seed: "spinach-rescue" },
  { id: 3, author: "@global_eats", title: "Real Thai Green Curry", likes: "25k", tag: "Thai", seed: "thai-curry" },
  { id: 4, author: "@veggie_vibe", title: "The Best Roasted Carrots", likes: "5k", tag: "Healthy", seed: "carrots-roasted" },
];

const TRENDING_RECIPES = [
  { name: "Creamy Pesto Pasta", time: "15 min", cal: 450, difficulty: "Easy", seed: "pesto-pasta" },
  { name: "Spicy Tofu Stir-fry", time: "20 min", cal: 320, difficulty: "Medium", seed: "tofu-stir-fry" },
  { name: "Mediterranean Salad", time: "10 min", cal: 280, difficulty: "Easy", seed: "greek-salad" },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GenerateRecipeSuggestionsOutput | null>(null);
  const [pantrySuggestions, setPantrySuggestions] = useState<GeneratePantrySuggestionsOutput | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [currentInput, setCurrentInput] = useState<{ photos: string[], text: string }>({ photos: [], text: "" });
  const [activeMode, setActiveMode] = useState<'standard' | 'rescue' | 'global' | 'challenge'>('standard');

  const handleGenerate = async (data: { photos: string[], text: string }) => {
    setIsLoading(true);
    setCurrentInput(data);
    try {
      const [recipeResult, pantryResult] = await Promise.all([
        generateRecipeSuggestions({
          ingredientPhotos: data.photos,
          ingredientText: data.text,
          mode: activeMode,
        }),
        generatePantrySuggestions({
          currentIngredients: data.text || "Fresh produce",
        })
      ]);
      
      setSuggestions(recipeResult);
      setPantrySuggestions(pantryResult);
      
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const relatedReels = useMemo(() => {
    if (!suggestions) return REELS_MOCK.slice(0, 2);
    return REELS_MOCK.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [suggestions]);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <section className="text-center space-y-8 animate-fade-in pt-8 md:pt-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-primary font-bold text-xs tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              Next-Gen AI Kitchen OS
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-[#2E7D32] via-[#66BB6A] to-[#2E7D32] bg-clip-text text-transparent">
               Delicious Recipes <br/>Instantly Generated.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Upload ingredients → Get AI recipes. The sustainable brain for your kitchen that tracks freshness and designs gourmet meals.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <ModeButton 
                active={activeMode === 'standard'} 
                onClick={() => setActiveMode('standard')}
                icon={<ChefHat className="h-4 w-4" />}
                label="Standard"
              />
              <ModeButton 
                active={activeMode === 'rescue'} 
                onClick={() => setActiveMode('rescue')}
                icon={<RotateCcw className="h-4 w-4" />}
                label="Leftover Rescue"
              />
              <ModeButton 
                active={activeMode === 'global'} 
                onClick={() => setActiveMode('global')}
                icon={<Globe className="h-4 w-4" />}
                label="Global Discovery"
              />
              <ModeButton 
                active={activeMode === 'challenge'} 
                onClick={() => setActiveMode('challenge')}
                icon={<Trophy className="h-4 w-4" />}
                label="Mystery Challenge"
              />
            </div>
          </section>

          {/* Stats Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-primary/5 text-center space-y-1">
              <p className="text-3xl font-black text-primary">100k+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recipes Created</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-primary/5 text-center space-y-1">
              <p className="text-3xl font-black text-primary">45k</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Cooks</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-primary/5 text-center space-y-1">
              <p className="text-3xl font-black text-primary">99%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Precision</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-primary/5 text-center space-y-1">
              <p className="text-3xl font-black text-primary">A++</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Eco Rating</p>
            </div>
          </section>

          {/* Core Input Section */}
          <section className="animate-slide-up max-w-4xl mx-auto">
            <IngredientInput onGenerate={handleGenerate} isLoading={isLoading} />
            <div className="flex flex-wrap justify-center items-center gap-8 mt-10 text-muted-foreground/60">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                Multimodal Recognition
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                Flavor Booster AI
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <RotateCcw className="h-5 w-5 text-secondary" />
                Zero Waste Engine
              </div>
            </div>
          </section>

          {/* Results Section */}
          {(suggestions || isLoading) && (
            <section id="results" className="space-y-16 py-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-primary/10">
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline font-bold text-primary">
                    Your Curated Recipes
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">
                    Gourmet blueprints designed for your available ingredients.
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-10 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-6">
                      <div className="aspect-[16/10] bg-muted rounded-[2rem]" />
                      <div className="space-y-4 px-4">
                        <div className="h-8 w-3/4 bg-muted rounded-full" />
                        <div className="h-4 w-full bg-muted rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-24">
                  <div className="grid gap-8 lg:grid-cols-3">
                    {suggestions?.recipeSuggestions.map((recipe, idx) => (
                      <Card key={idx} className="group flex flex-col border-none bg-white/70 backdrop-blur-md hover:bg-white transition-all shadow-xl hover:shadow-2xl rounded-[3rem] overflow-hidden border-2 border-transparent hover:border-primary/5">
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <img 
                            src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s+/g, '')}-culinary/800/500`} 
                            alt={recipe.recipeName}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint="gourmet dish"
                          />
                          <div className="absolute top-6 left-6 flex gap-2">
                             <Badge className="bg-white/95 text-primary border-none shadow-sm backdrop-blur-md px-4 py-1.5 font-black uppercase text-[10px] rounded-full">
                               {recipe.difficultyLevel}
                             </Badge>
                             {recipe.culture && (
                               <Badge className="bg-primary/95 text-white border-none shadow-sm px-4 py-1.5 font-black uppercase text-[10px] rounded-full">
                                 {recipe.culture}
                               </Badge>
                             )}
                          </div>
                        </div>
                        <CardHeader className="px-8 pt-8 pb-4">
                          <CardTitle className="font-headline text-3xl text-primary leading-tight">
                            {recipe.recipeName}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-muted-foreground italic text-base">
                            {recipe.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 flex-1 space-y-6">
                          <div className="flex items-center gap-6 py-4 border-y border-primary/5">
                            <div className="flex items-center gap-2 text-[11px] font-black text-primary/70 uppercase tracking-widest">
                              <Clock className="h-4 w-4 text-secondary" />
                              {recipe.estimatedPrepTime}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-black text-primary/70 uppercase tracking-widest">
                              <Flame className="h-4 w-4 text-secondary" />
                              {recipe.nutrition.calories} Cal
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                              <ShoppingBasket className="h-3 w-3" /> Ingredients
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {recipe.ingredientsUsed.slice(0, 4).map((ing, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] font-bold border-primary/10 text-primary/60 rounded-full px-3 py-0.5">
                                  {ing}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="px-8 pb-8 pt-6">
                          <Button 
                            className="w-full bg-gradient-primary hover:scale-[1.02] transition-all rounded-full h-14 text-sm font-black uppercase tracking-[0.15em] shadow-lg group border-none text-white"
                            onClick={() => setSelectedRecipe(recipe)}
                          >
                            Full Cooking Guide
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {/* Reels Discovery */}
                  <div className="space-y-12 pt-16 border-t border-primary/10">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-3xl font-headline font-bold">Discovery Feed</h3>
                       <Link href="/reels">
                         <Button variant="link" className="text-secondary font-bold text-lg">See all cooking reels <ChevronRight className="ml-2 h-5 w-5" /></Button>
                       </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {relatedReels.map((reel) => (
                        <div key={reel.id} className="group relative aspect-[9/16] rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all cursor-pointer">
                          <img 
                            src={`https://picsum.photos/seed/${reel.seed}/600/1000`} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt={reel.title}
                            data-ai-hint="chef cooking"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                          <div className="absolute top-6 left-6">
                            <Badge className="bg-white/90 text-primary border-none text-[9px] rounded-full uppercase font-black px-4 py-1">
                              {reel.tag}
                            </Badge>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                             <p className="font-black text-sm drop-shadow-md leading-tight">{reel.title}</p>
                             <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{reel.author}</p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="h-16 w-16 text-white/50" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Trending Section */}
          <section className="space-y-12 py-12">
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline font-bold">Trending Creations</h2>
                  <p className="text-muted-foreground font-medium">Most popular blueprints in the Ingredia community.</p>
                </div>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
               {TRENDING_RECIPES.map((recipe, idx) => (
                 <Card key={idx} className="rounded-[2.5rem] overflow-hidden border-none shadow-lg group hover:shadow-xl transition-all cursor-pointer">
                   <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={`https://picsum.photos/seed/${recipe.seed}/600/400`} 
                        alt={recipe.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        data-ai-hint="plated gourmet food"
                      />
                      <div className="absolute top-4 left-4">
                         <Badge className="bg-white/90 text-primary border-none text-[10px] font-black">{recipe.difficulty}</Badge>
                      </div>
                   </div>
                   <CardHeader className="p-6">
                      <CardTitle className="text-xl font-headline font-bold">{recipe.name}</CardTitle>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase text-muted-foreground mt-2">
                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.time}</span>
                         <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.cal} Cal</span>
                      </div>
                   </CardHeader>
                 </Card>
               ))}
             </div>
          </section>

          {/* SaaS Pricing Section */}
          <section className="py-24 space-y-16">
            <div className="text-center space-y-4">
               <h2 className="text-4xl md:text-5xl font-headline font-black">Choose Your Kitchen tier</h2>
               <p className="text-muted-foreground text-lg max-w-xl mx-auto">Upgrade for unlimited AI scanning and gourmet blueprints.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <Card className="rounded-[3rem] border-2 border-primary/5 p-8 bg-white/50">
                 <CardHeader className="text-center pb-8 border-b border-primary/5">
                   <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Basic</h4>
                   <h3 className="text-4xl font-black text-primary">$0</h3>
                   <p className="text-xs font-bold text-muted-foreground uppercase mt-2">Free Forever</p>
                 </CardHeader>
                 <CardContent className="py-8 space-y-4">
                   <PricingFeature text="3 Scans per day" />
                   <PricingFeature text="Standard recipes" />
                   <PricingFeature text="Basic nutrition" />
                 </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full rounded-full h-12 border-primary/20">Current Plan</Button>
                 </CardFooter>
              </Card>

              <Card className="rounded-[3rem] border-4 border-accent p-8 bg-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-accent text-white px-6 py-1.5 font-black text-[9px] uppercase tracking-widest rounded-bl-2xl">Recommended</div>
                 <CardHeader className="text-center pb-8 border-b border-primary/5">
                   <h4 className="text-xs font-black uppercase tracking-widest text-secondary mb-4">Seedling Pro</h4>
                   <h3 className="text-4xl font-black text-primary">$1.99<span className="text-xs text-muted-foreground font-bold">/mo</span></h3>
                   <p className="text-xs font-bold text-muted-foreground uppercase mt-2">Support Culinary AI</p>
                 </CardHeader>
                 <CardContent className="py-8 space-y-4">
                   <PricingFeature text="Unlimited Scans" active />
                   <PricingFeature text="Gourmet Blueprints" active />
                   <PricingFeature text="Full Kitchen OS" active />
                   <PricingFeature text="Ad-free Discovery" active />
                 </CardContent>
                 <CardFooter>
                    <Button className="w-full rounded-full h-12 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs">Upgrade Now</Button>
                 </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-primary py-24 mt-20 text-white rounded-t-[5rem]">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <ChefHat className="h-16 w-16 text-secondary" />
            <span className="text-5xl font-headline font-black tracking-tighter uppercase">INGREDIA</span>
          </div>
          <p className="text-xl text-white/60 max-w-xl mx-auto font-medium">Empowering homes with sustainable culinary intelligence.</p>
          <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-white/40">
             <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
             <Link href="/pantry" className="hover:text-white transition-colors">Pantry</Link>
             <Link href="/planner" className="hover:text-white transition-colors">Meal Planner</Link>
             <Link href="/collection" className="hover:text-white transition-colors">Vault</Link>
          </div>
        </div>
      </footer>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          availableIngredients={currentInput.text ? [...(currentInput.text.split(',').map(s => s.trim())), ...selectedRecipe.ingredientsUsed] : selectedRecipe.ingredientsUsed}
        />
      )}
    </div>
  );
}

function ModeButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <Button 
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className={`rounded-full px-8 h-12 font-black uppercase tracking-widest text-[10px] transition-all border-primary/20 ${active ? 'bg-primary text-white shadow-2xl scale-105' : 'text-primary hover:bg-primary/5 bg-white/50'}`}
      suppressHydrationWarning
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Button>
  );
}

function PricingFeature({ text, active }: { text: string, active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
       <div className={`h-5 w-5 rounded-full flex items-center justify-center ${active ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
         <Check className="h-3.5 w-3.5" />
       </div>
       <span className={`text-sm font-bold ${active ? 'text-primary' : 'text-muted-foreground'}`}>{text}</span>
    </div>
  );
}
