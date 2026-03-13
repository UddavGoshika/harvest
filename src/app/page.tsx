"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/ui/navbar";
import { IngredientInput } from "@/components/ingredient-input";
import { generateRecipeSuggestions, GenerateRecipeSuggestionsOutput } from "@/ai/flows/generate-recipe-suggestions";
import { generatePantrySuggestions, GeneratePantrySuggestionsOutput } from "@/ai/flows/generate-pantry-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, Sparkles, ChevronRight, ChefHat, ShoppingBasket, 
  Flame, RotateCcw, Globe, Trophy, PlayCircle, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Heart
} from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";
import Link from "next/link";

import { initializeDatabase, SEED_REELS } from "@/lib/seed-data";
import { useEffect } from "react";

const REELS_MOCK = [
  { id: 1, author: "@chef_sophie", title: "Midnight Pasta Hack", likes: "12.4k", tag: "Pasta", imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800" },
  { id: 2, author: "@healthy_bites", title: "Expiring Spinach? Do this!", likes: "8.1k", tag: "Waste Reduction", imageUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800" },
  { id: 3, author: "@global_eats", title: "Real Thai Green Curry", likes: "25k", tag: "Thai", imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=800" },
  { id: 4, author: "@veggie_vibe", title: "The Best Roasted Carrots", likes: "5k", tag: "Healthy", imageUrl: "https://images.unsplash.com/photo-1598170845058-32b996a7aca0?q=80&w=800" },
  { id: 5, author: "@mumbai_street", title: "Pav Bhaji Masterclass", likes: "42k", tag: "Indian", imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800" },
  { id: 6, author: "@sushi_guru", title: "Perfect Sushi Roll at Home", likes: "15k", tag: "Japanese", imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800" },
];

const TRENDING_RECIPES = [
  { name: "Creamy Pesto Pasta", time: "15 min", cal: 450, difficulty: "Easy", imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600", hint: "pesto pasta" },
  { name: "Spicy Tofu Stir-fry", time: "20 min", cal: 320, difficulty: "Medium", imageUrl: "https://images.unsplash.com/photo-1546069901-e5161476b701?q=80&w=600", hint: "tofu stirfry" },
  { name: "Mediterranean Salad", time: "10 min", cal: 280, difficulty: "Easy", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600", hint: "mediterranean salad" },
  { name: "Butter Chicken Masala", time: "45 min", cal: 580, difficulty: "Medium", imageUrl: "https://images.unsplash.com/photo-1603894584202-933259aba79e?q=80&w=600", hint: "butter chicken" },
  { name: "Avocado Toast Bliss", time: "5 min", cal: 210, difficulty: "Easy", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600", hint: "avocado toast" },
  { name: "Classic French Onion Soup", time: "60 min", cal: 340, difficulty: "Hard", imageUrl: "https://images.unsplash.com/photo-1510627498534-cf7c9002facc?q=80&w=600", hint: "onion soup" },
];

export default function Home() {
  useEffect(() => {
    initializeDatabase();
  }, []);

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
    if (!suggestions) return REELS_MOCK.slice(0, 4);
    return REELS_MOCK.sort(() => 0.5 - Math.random()).slice(0, 6);
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
              Delicious Recipes Instantly              </span>
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

            <div className="h-6 flex items-center justify-center">
              <p className="text-sm font-bold text-secondary text-center animate-fade-in" key={activeMode}>
                {activeMode === 'standard' && "AI designs balanced gourmet recipes from your available ingredients."}
                {activeMode === 'rescue' && "Saves ingredients about to expire by turning them into delicious, low-waste meals."}
                {activeMode === 'global' && "Fuses your local ingredients with exotic world cuisines for unique flavor profiles."}
                {activeMode === 'challenge' && "A gamified experience where the AI gives you a secret ingredient to master."}
              </p>
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
                            src={(recipe as any).imageUrl || `https://images.unsplash.com/photo-1546069901-ba95996fef17?q=80&w=800`} 
                            alt={recipe.recipeName}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint="plated gourmet dish"
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
                            suppressHydrationWarning
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
                         <Button variant="link" className="text-secondary font-bold text-lg" suppressHydrationWarning>See all cooking reels <ChevronRight className="ml-2 h-5 w-5" /></Button>
                       </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {relatedReels.map((reel) => (
                        <div 
                          key={reel.id} 
                          className="group relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer"
                          onClick={() => setSelectedRecipe({
                            recipeName: reel.title,
                            description: `A trending creation by ${reel.author}`,
                            estimatedPrepTime: "15 min",
                            nutrition: { calories: 450, protein: "12g", carbs: "45g", fat: "15g" },
                            difficultyLevel: "Easy",
                            imageUrl: reel.imageUrl,
                            ingredientsUsed: []
                          })}
                        >
                          <img 
                            src={reel.imageUrl} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt={reel.title}
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-primary border-none text-[8px] rounded-full uppercase font-black px-3 py-1">
                              {reel.tag}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                             <p className="font-black text-xs drop-shadow-md leading-tight">{reel.title}</p>
                             <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">{reel.author}</p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="h-12 w-12 text-white/70" />
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
                <Link href="/recipes">
                  <Button variant="outline" className="rounded-full border-primary/20 text-primary font-bold">Explore Gallery</Button>
                </Link>
             </div>
             <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
               {TRENDING_RECIPES.map((recipe, idx) => (
                 <Card 
                  key={idx} 
                  className="rounded-[2rem] overflow-hidden border-none shadow-lg group hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedRecipe({
                    recipeName: recipe.name,
                    description: `A popular choice in our community.`,
                    estimatedPrepTime: recipe.time,
                    nutrition: { calories: recipe.cal, protein: "15g", carbs: "50g", fat: "12g" },
                    difficultyLevel: recipe.difficulty,
                    imageUrl: recipe.imageUrl,
                    ingredientsUsed: []
                  })}
                 >
                   <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2">
                         <Badge className="bg-white/90 text-primary border-none text-[8px] font-black">{recipe.difficulty}</Badge>
                      </div>
                   </div>
                   <CardHeader className="p-4">
                      <CardTitle className="text-sm font-headline font-bold leading-tight group-hover:text-primary transition-colors">{recipe.name}</CardTitle>
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-muted-foreground mt-2">
                         <span className="flex items-center gap-1"><Clock className="h-2 w-2" /> {recipe.time}</span>
                         <span className="flex items-center gap-1 text-secondary"><Flame className="h-2 w-2" /> {recipe.cal} Cal</span>
                      </div>
                   </CardHeader>
                 </Card>
               ))}
             </div>
          </section>

          {/* SaaS Trust Section */}
          <section className="bg-primary/5 rounded-[4rem] p-12 md:p-20 text-center space-y-12">
             <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-headline font-black text-primary">Trusted by 200,000+ Kitchens</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">Providing intelligent kitchen management and sustainable recipe generation since early 2024.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                   <p className="text-4xl font-black text-primary">12M+</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recipes Generated</p>
                </div>
                <div className="space-y-2">
                   <p className="text-4xl font-black text-primary">500k</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kgs Food Rescued</p>
                </div>
                <div className="space-y-2">
                   <p className="text-4xl font-black text-primary">4.9/5</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chef Rating</p>
                </div>
                <div className="space-y-2">
                   <p className="text-4xl font-black text-primary">150+</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Cuisines</p>
                </div>
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
             <Link href="/" className="hover:text-white transition-colors">Home</Link>
             <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
             <Link href="/recipes" className="hover:text-white transition-colors">Recipes</Link>
             <Link href="/reels" className="hover:text-white transition-colors">Reels</Link>
             <Link href="/pantry" className="hover:text-white transition-colors">Pantry</Link>
             <Link href="/planner" className="hover:text-white transition-colors">Meal Planner</Link>
             <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
             <Link href="/collection" className="hover:text-white transition-colors">Vault</Link>
          </div>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">© 2024 Ingredia Kitchen OS. All rights reserved.</p>
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
