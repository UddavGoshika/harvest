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
  ArrowRight, ShieldCheck, Heart, Star, BookOpen, Utensils, Zap
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
              Ingredia AI - Culinary Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
               Turn Your Ingredients <br/>In To <br/>Delicious Recipes Instantly.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Upload ingredients → Get AI recipes. Scan your fridge or upload photos and get personalized culinary inspiration in seconds.
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
                Fridge Scan detection
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                Personalized AI
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <RotateCcw className="h-5 w-5 text-secondary" />
                Zero food waste
              </div>
            </div>
          </section>

          {/* Food Waste Feature Highlight */}
          <section className="bg-primary/5 rounded-[4rem] p-12 md:p-20 overflow-hidden relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 relative z-10">
                <Badge className="bg-secondary text-primary font-black px-6 py-2 rounded-full uppercase tracking-widest text-[10px]">
                  Sustainability First
                </Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-black text-primary leading-tight">
                  Stop Wasting, <br />
                  <span className="text-secondary italic">Start Creating.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Our Leftover Rescue mode uses advanced multimodal AI to identify ingredients nearing their expiry and crafts Michelin-star recipes to ensure nothing goes to waste.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-primary">30%</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Less Food Waste</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-primary">500+</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rescue Recipes</p>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <img 
                  src="https://picsum.photos/seed/waste-reduction/800/600" 
                  alt="Food waste reduction" 
                  className="rounded-[3rem] shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint="fresh vegetables kitchen"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 flex items-center gap-4 animate-bounce">
                  <RotateCcw className="h-8 w-8 text-secondary" />
                  <p className="text-xs font-black text-primary uppercase leading-tight">Saved 2kg of <br/>produce today</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-24 -left-24 h-64 w-64 bg-secondary/10 rounded-full blur-3xl" />
          </section>

          {/* How It Works Section */}
          {!suggestions && !isLoading && (
            <section className="space-y-16 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-headline font-bold">How It Works</h2>
                <p className="text-muted-foreground font-medium">Upload ingredients → Get AI recipes in 3 simple steps.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                <StepCard 
                  num="01" 
                  title="Upload or Scan" 
                  desc="Take a photo of your fridge or upload photos of your ingredients."
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
                  title="Get Recipes" 
                  desc="Receive personalized, delicious recipes with full nutritional insights."
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
                  <div className="grid gap-8 lg:grid-cols-3">
                    {suggestions?.recipeSuggestions.map((recipe, idx) => (
                      <Card key={idx} className="group flex flex-col border-none bg-white/70 backdrop-blur-md hover:bg-white transition-all shadow-xl hover:shadow-2xl rounded-[3rem] overflow-hidden border-2 border-transparent hover:border-primary/5">
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <img 
                            src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s+/g, '')}-gourmet/800/500`} 
                            alt={recipe.recipeName}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint="delicious food"
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
                              <ShoppingBasket className="h-3 w-3" /> Required Ingredients
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {recipe.ingredientsUsed.slice(0, 4).map((ing, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] font-bold border-primary/10 text-primary/60 rounded-full px-3 py-0.5">
                                  {ing}
                                </Badge>
                              ))}
                              {recipe.ingredientsUsed.length > 4 && (
                                <span className="text-[10px] font-bold text-muted-foreground">+{recipe.ingredientsUsed.length - 4} more</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4 pt-2">
                            <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Utensils className="h-3 w-3" /> Cooking Blueprint
                            </h4>
                            <div className="space-y-2">
                              {recipe.previewInstructions?.map((step, i) => (
                                <p key={i} className="text-[11px] text-muted-foreground font-medium flex gap-2">
                                  <span className="text-secondary font-black">{i+1}.</span> {step}
                                </p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="px-8 pb-8 pt-6">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 transition-all rounded-full h-14 text-sm font-black uppercase tracking-[0.15em] shadow-lg group"
                            onClick={() => setSelectedRecipe(recipe)}
                          >
                            Get Full Recipe
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {/* Related Reels Contextual Section */}
                  <div className="space-y-12 pt-16 border-t border-primary/10">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-3xl font-headline font-bold">Related Discovery</h3>
                       <Link href="/reels">
                         <Button variant="link" className="text-secondary font-bold text-lg">View all reels <ChevronRight className="ml-2 h-5 w-5" /></Button>
                       </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {relatedReels.map((reel) => (
                        <div key={reel.id} className="group relative aspect-[9/16] rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all cursor-pointer">
                          <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/40 animate-pulse`} />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
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
                            <div className="h-16 w-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                              <PlayCircle className="h-8 w-8 text-white" />
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

          {/* Feature Highlights Section */}
          {!suggestions && !isLoading && (
            <section className="space-y-24">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-headline font-black leading-tight">
                      Sustainable Cooking, <br />
                      <span className="text-secondary italic">Powered by AI.</span>
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
                        icon={<Zap className="h-6 w-6 text-secondary" />} 
                        title="Expiring Food Alerts" 
                        text="Get notified when items in your fridge are about to go bad." 
                       />
                       <FeatureLine 
                        icon={<Trophy className="h-6 w-6 text-secondary" />} 
                        title="Daily Cooking Challenges" 
                        text="Participate in community mystery ingredient challenges." 
                       />
                    </div>
                 </div>
                 <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[3rem] p-8 overflow-hidden">
                       <div className="bg-white rounded-[2rem] p-6 shadow-2xl space-y-4 animate-slide-up">
                          <div className="flex items-center gap-3">
                             <Badge className="bg-secondary/20 text-primary border-none font-bold text-[10px]">MYSTERY</Badge>
                             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Daily Challenge</span>
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
        </div>
      </main>

      <footer className="bg-primary py-24 mt-20 text-white rounded-t-[5rem]">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <ChefHat className="h-16 w-16 text-secondary" />
            <span className="text-5xl font-headline font-black tracking-tighter uppercase">INGREDIA</span>
          </div>
          <p className="text-xl text-white/60 max-w-xl mx-auto font-medium">Sustainable culinary intelligence for the modern home cook.</p>
          <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-white/40">
             <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
             <Link href="/pantry" className="hover:text-white transition-colors">Fridge Tracker</Link>
             <Link href="/planner" className="hover:text-white transition-colors">Weekly Planner</Link>
             <Link href="/collection" className="hover:text-white transition-colors">My Collection</Link>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-widest">© {new Date().getFullYear()} Ingredia AI Inc. All rights reserved.</p>
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

function StepCard({ num, title, desc, icon }: { num: string, title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-primary/5 space-y-6 group hover:shadow-2xl transition-all hover:-translate-y-3">
      <div className="flex items-center justify-between">
        <div className="h-16 w-16 bg-secondary/10 rounded-[1.5rem] flex items-center justify-center text-secondary">
          {icon}
        </div>
        <span className="text-6xl font-black text-primary/5 group-hover:text-secondary/15 transition-colors tracking-tighter">{num}</span>
      </div>
      <h3 className="text-3xl font-headline font-bold text-primary">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed text-lg">{desc}</p>
    </div>
  );
}

function FeatureLine({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-primary/5 flex-shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-black text-primary uppercase text-sm tracking-widest">{title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
