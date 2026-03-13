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
  Clock, Sparkles, ChevronRight, Apple, ChefHat, ShoppingBasket, Plus, 
  Flame, Info, RotateCcw, Globe, Trophy, PlayCircle, Camera, CheckCircle2, 
  ArrowRight, ShieldCheck, Heart, Star
} from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const REELS_MOCK = [
  { id: 1, author: "@chef_sophie", title: "Midnight Pasta Hack", likes: "12.4k", tag: "Pasta" },
  { id: 2, author: "@healthy_bites", title: "Expiring Spinach? Do this!", likes: "8.1k", tag: "Waste Reduction" },
  { id: 3, author: "@global_eats", title: "Real Thai Green Curry", likes: "25k", tag: "Thai" },
  { id: 4, author: "@veggie_vibe", title: "The Best Roasted Carrots", likes: "5k", tag: "Healthy" },
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
    // Shuffle or select based on mode
    return REELS_MOCK.sort(() => 0.5 - Math.random()).slice(0, 3);
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
              AI-Powered Cooking Assistant
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tight leading-[1.1]">
              Turn Ingredients Into <br />
              <span className="text-secondary italic">Recipes Instantly.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Scan your fridge or upload ingredients and get personalized AI recipes in seconds. Reduce waste and discover new flavors.
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

          {/* Core Input Section */}
          <section className="animate-slide-up max-w-4xl mx-auto">
            <IngredientInput onGenerate={handleGenerate} isLoading={isLoading} />
            <div className="flex flex-wrap justify-center items-center gap-8 mt-10 text-muted-foreground/60">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                Smart detection
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                Personalized AI
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <RotateCcw className="h-5 w-5 text-secondary" />
                Reduce food waste
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          {!suggestions && !isLoading && (
            <section className="space-y-16 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-headline font-bold">How It Works</h2>
                <p className="text-muted-foreground font-medium">Simple steps to culinary perfection.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                <StepCard 
                  num="01" 
                  title="Scan or Upload" 
                  desc="Take a photo of your fridge or manually enter what you have in stock."
                  icon={<Camera className="h-6 w-6" />}
                />
                <StepCard 
                  num="02" 
                  title="AI Analysis" 
                  desc="Our AI identifies ingredients and considers your taste preferences instantly."
                  icon={<Sparkles className="h-6 w-6" />}
                />
                <StepCard 
                  num="03" 
                  title="Cook & Enjoy" 
                  desc="Get step-by-step instructions and nutritional insights for every meal."
                  icon={<ChefHat className="h-6 w-6" />}
                />
              </div>
            </section>
          )}

          {/* Results Section */}
          {(suggestions || isLoading) && (
            <section id="results" className="space-y-16 py-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-primary/10">
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
                    Your Curated Recipes
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">
                    {activeMode === 'rescue' ? 'Gourmet meals created from your leftovers.' : 'Discover what you can make today.'}
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
                  <div className="grid gap-8 md:grid-cols-3">
                    {suggestions?.recipeSuggestions.map((recipe, idx) => (
                      <Card key={idx} className="group flex flex-col border-none bg-white/50 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-xl rounded-[2.5rem] overflow-hidden">
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <img 
                            src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s+/g, '')}/800/500`} 
                            alt={recipe.recipeName}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                             <Badge className="bg-white/90 text-primary border-none shadow-sm backdrop-blur-md px-3 py-1 font-bold uppercase text-[9px] rounded-full">
                               {recipe.difficultyLevel}
                             </Badge>
                             {recipe.culture && (
                               <Badge className="bg-primary/90 text-white border-none shadow-sm px-3 py-1 font-bold uppercase text-[9px] rounded-full">
                                 {recipe.culture}
                               </Badge>
                             )}
                          </div>
                        </div>
                        <CardHeader className="px-6 pt-6 pb-2">
                          <CardTitle className="font-headline text-2xl text-primary line-clamp-1">
                            {recipe.recipeName}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-muted-foreground italic text-sm">
                            {recipe.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 flex-1 pt-2">
                          <div className="flex items-center gap-4 pt-4 border-t border-primary/5">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <Clock className="h-3 w-3 text-secondary" />
                              {recipe.estimatedPrepTime}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <Flame className="h-3 w-3 text-secondary" />
                              {recipe.nutrition.calories} Cal
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-8 pt-4">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 transition-all rounded-full h-11 text-xs font-bold uppercase tracking-wider"
                            onClick={() => setSelectedRecipe(recipe)}
                          >
                            Get Full Recipe
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {/* Related Reels Contextual Section */}
                  <div className="space-y-8 pt-12 border-t border-primary/10">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-headline font-bold">Related Discovery</h3>
                       <Link href="/reels">
                         <Button variant="link" className="text-secondary font-bold">View all reels <ChevronRight className="h-4 w-4" /></Button>
                       </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {relatedReels.map((reel) => (
                        <div key={reel.id} className="group relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                          <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/40 animate-pulse`} />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/80 text-primary border-none text-[8px] rounded-full uppercase font-black">
                              {reel.tag}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                             <p className="font-bold text-xs truncate">{reel.title}</p>
                             <p className="text-[10px] opacity-80">{reel.author}</p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                              <PlayCircle className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Social / Feature Highlights */}
          {!suggestions && !isLoading && (
            <section className="space-y-24">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-headline font-black leading-tight">
                      Gourmet Cooking, <br />
                      <span className="text-secondary italic">Zero Waste.</span>
                    </h2>
                    <div className="space-y-6">
                       <FeatureLine 
                        icon={<RotateCcw className="h-6 w-6 text-secondary" />} 
                        title="Leftover Rescue" 
                        text="Special algorithms to prioritize items that need using up today." 
                       />
                       <FeatureLine 
                        icon={<ShoppingBasket className="h-6 w-6 text-secondary" />} 
                        title="Fridge Scan detection" 
                        text="Point your camera and let AI build your inventory automatically." 
                       />
                       <FeatureLine 
                        icon={<PlayCircle className="h-6 w-6 text-secondary" />} 
                        title="Social Discovery" 
                        text="Watch 30-second reels of others cooking these exact AI recipes." 
                       />
                    </div>
                 </div>
                 <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[3rem] p-8 overflow-hidden">
                       <div className="bg-white rounded-[2rem] p-6 shadow-2xl space-y-4 animate-slide-up">
                          <div className="flex items-center gap-3">
                             <Badge className="bg-secondary/20 text-primary border-none font-bold text-[10px]">PREVIEW</Badge>
                             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mystery Challenge</span>
                          </div>
                          <h4 className="text-2xl font-headline font-bold">The Zucchini Mystery</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">Can you create a dessert using only zucchini, honey, and oats?</p>
                          <div className="flex gap-2">
                             <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="bg-primary text-[10px] text-white">JD</AvatarFallback>
                             </Avatar>
                             <Avatar className="h-8 w-8 border-2 border-white -ml-4">
                                <AvatarFallback className="bg-secondary text-[10px] text-white">MK</AvatarFallback>
                             </Avatar>
                             <div className="flex items-center text-[10px] font-bold text-muted-foreground ml-2">
                                +142 cooking now
                             </div>
                          </div>
                       </div>
                    </div>
                    {/* Decorative bits */}
                    <div className="absolute -top-6 -right-6 h-24 w-24 bg-secondary/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-primary/20 rounded-full blur-3xl" />
                 </div>
              </div>
            </section>
          )}

          {/* Recipe Preview Sample Section */}
          {!suggestions && !isLoading && (
            <section className="bg-white/50 border border-primary/5 rounded-[3rem] p-12 md:p-20 space-y-12">
               <div className="max-w-3xl mx-auto text-center space-y-4">
                 <h2 className="text-3xl md:text-4xl font-headline font-bold">Sample Culinary Draft</h2>
                 <p className="text-muted-foreground font-medium">This is what you get in seconds after scanning your pantry.</p>
               </div>
               <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 flex items-center gap-6">
                       <div className="h-16 w-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                          <Camera className="h-8 w-8 text-secondary" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pantry Detected</p>
                          <p className="font-headline font-bold text-primary">Salmon, Asparagus, Garlic</p>
                       </div>
                    </div>
                    <div className="flex justify-center">
                       <ArrowRight className="h-10 w-10 text-secondary animate-bounce" />
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 space-y-4">
                       <Badge className="bg-primary text-white border-none font-bold uppercase text-[9px] rounded-full px-3">AI Recipe Drafted</Badge>
                       <h4 className="text-2xl font-headline font-bold text-primary">Garlic-Herb Cedar Salmon</h4>
                       <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 20 min</span>
                          <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> 420 Cal</span>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-6 bg-primary/[0.03] p-8 rounded-[2rem] border border-primary/5">
                     <h5 className="font-headline font-bold text-xl mb-4">Cooking Blueprint</h5>
                     {[
                       "Sear salmon for 4 minutes skin-side up.",
                       "Sauté asparagus with minced garlic and olive oil.",
                       "Drizzle with lemon zest and serve warm."
                     ].map((step, i) => (
                       <div key={i} className="flex gap-4">
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center text-[10px] font-black">{i+1}</div>
                          <p className="text-sm font-medium text-muted-foreground">{step}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </section>
          )}

          {/* Community Section */}
          <section className="text-center space-y-12 py-12">
             <div className="space-y-2">
               <h2 className="text-4xl font-headline font-bold">Community Creations</h2>
               <p className="text-muted-foreground font-medium">Join 50k+ home cooks sharing their Harvest AI discoveries.</p>
             </div>
             <div className="flex flex-wrap justify-center gap-12">
                <Stat icon={<Heart className="h-5 w-5 text-secondary" />} label="Recipes Saved" value="1.2M+" />
                <Stat icon={<PlayCircle className="h-5 w-5 text-secondary" />} label="Monthly Reels" value="45k" />
                <Stat icon={<Star className="h-5 w-5 text-secondary" />} label="Average Rating" value="4.9/5" />
             </div>
          </section>
        </div>
      </main>

      <footer className="bg-primary py-24 mt-20 text-white rounded-t-[4rem]">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <ChefHat className="h-12 w-12 text-secondary" />
            <span className="text-4xl font-headline font-black tracking-tight">HARVEST AI</span>
          </div>
          <p className="text-xl text-white/60 max-w-xl mx-auto font-medium">Sustainable cooking powered by intelligent culinary insights.</p>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center gap-8 text-sm font-bold text-white/40 uppercase tracking-widest">
             <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
             <Link href="/pantry" className="hover:text-white transition-colors">Fridge Tracker</Link>
             <Link href="/planner" className="hover:text-white transition-colors">Weekly Planner</Link>
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
      className={`rounded-full px-6 h-11 font-bold transition-all border-primary/20 ${active ? 'bg-primary text-white shadow-xl' : 'text-primary hover:bg-primary/5 bg-white/50'}`}
      suppressHydrationWarning
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
}

function StepCard({ num, title, desc, icon }: { num: string, title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5 space-y-6 group hover:shadow-xl transition-all hover:-translate-y-2">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
          {icon}
        </div>
        <span className="text-5xl font-black text-primary/10 group-hover:text-secondary/20 transition-colors">{num}</span>
      </div>
      <h3 className="text-2xl font-headline font-bold text-primary">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureLine({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-4">
      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-primary/5 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-primary">{title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1">
       <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          {icon}
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <p className="text-4xl font-headline font-black text-primary">{value}</p>
    </div>
  );
}
