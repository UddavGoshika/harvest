"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { IngredientInput } from "@/components/ingredient-input";
import { generateRecipeSuggestions, GenerateRecipeSuggestionsOutput } from "@/ai/flows/generate-recipe-suggestions";
import { generatePantrySuggestions, GeneratePantrySuggestionsOutput } from "@/ai/flows/generate-pantry-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, ChevronRight, Apple, ChefHat, ShoppingBasket, Plus, Flame, Info, RotateCcw, Globe, Trophy, PlayCircle } from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";
import Link from "next/link";

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
      }, 100);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-24">
          
          <section className="text-center space-y-8 animate-fade-in pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs tracking-widest uppercase">
              <Sparkles className="h-4 w-4" />
              Intelligence in every bite
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-black text-primary tracking-tighter leading-[0.9]">
              Elevate Your <span className="text-primary italic">Kitchen.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Multimodal AI to rescue leftovers, discover global flavors, and cook smarter.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
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

          <section className="animate-slide-up max-w-4xl mx-auto">
            <IngredientInput onGenerate={handleGenerate} isLoading={isLoading} />
          </section>

          <div className="flex justify-center">
            <Link href="/reels">
              <Button variant="outline" className="rounded-full border-primary/20 text-primary font-bold px-8 h-12">
                <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                Browse Social Reels
              </Button>
            </Link>
          </div>

          {(suggestions || isLoading) && (
            <section id="results" className="space-y-16 py-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-primary/5">
                <div className="space-y-2">
                  <h2 className="text-5xl font-headline font-bold text-primary flex items-center gap-3">
                    Curated For You
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">
                    {activeMode === 'rescue' ? 'Transforming leftovers into gourmet meals.' : 'Smart suggestions based on your pantry.'}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-10 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-6">
                      <div className="aspect-[16/10] bg-muted rounded-3xl" />
                      <div className="space-y-4 px-4">
                        <div className="h-8 w-3/4 bg-muted rounded-full" />
                        <div className="h-4 w-full bg-muted rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-12 md:grid-cols-3">
                  {suggestions?.recipeSuggestions.map((recipe, idx) => (
                    <Card key={idx} className="group relative flex flex-col border-none bg-transparent overflow-visible">
                      <div className="aspect-[16/10] overflow-hidden rounded-[2rem] bg-muted relative shadow-xl transition-all group-hover:-translate-y-2">
                        <img 
                          src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s+/g, '')}/800/500`} 
                          alt={recipe.recipeName}
                          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                           <Badge className="bg-white/95 text-primary border-none shadow-md backdrop-blur-md px-4 py-1.5 font-bold uppercase text-[10px]">
                             {recipe.difficultyLevel}
                           </Badge>
                           {recipe.culture && (
                             <Badge className="bg-primary text-white border-none shadow-md px-4 py-1.5 font-bold uppercase text-[10px]">
                               {recipe.culture}
                             </Badge>
                           )}
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                           <Badge className="bg-primary/90 text-white border-none font-bold text-[10px] shadow-lg">
                             {recipe.nutrition.calories} kcal
                           </Badge>
                        </div>
                      </div>
                      <CardHeader className="px-2 pt-6 pb-4">
                        <CardTitle className="font-headline text-3xl text-primary mb-2">
                          {recipe.recipeName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-muted-foreground italic">
                          {recipe.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-2 flex-1">
                        <div className="flex items-center gap-4 pt-4 border-t border-primary/5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                            <Clock className="h-3 w-3 text-primary" />
                            {recipe.estimatedPrepTime}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                            <Apple className="h-3 w-3 text-primary" />
                            {recipe.nutrition.protein} Protein
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-2 pt-6">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 transition-all rounded-2xl h-12 text-sm font-bold uppercase shadow-lg"
                          onClick={() => setSelectedRecipe(recipe)}
                          suppressHydrationWarning
                        >
                          View Recipe
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {!suggestions && !isLoading && (
            <section className="grid md:grid-cols-3 gap-16 py-24 border-t border-primary/5">
              <div className="space-y-6">
                <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <ChefHat className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Interactive Assistant</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Cook hands-free with voice commands. Just say "Next Step" to keep moving.</p>
              </div>
              <div className="space-y-6">
                <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <RotateCcw className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Waste Reduction</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Our rescue engine identifies items nearing expiry and suggests delicious ways to use them.</p>
              </div>
              <div className="space-y-6">
                <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <PlayCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Social Cooking</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Join a community of food lovers. Share your creations and discover trending reels.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="bg-primary py-24 mt-20 text-white rounded-t-[3rem]">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <ChefHat className="h-12 w-12 text-secondary" />
            <span className="text-4xl font-headline font-black tracking-tighter">HARVEST AI</span>
          </div>
          <p className="text-xl text-white/60 max-w-xl mx-auto font-medium">Sustainable cooking powered by intelligent culinary insights.</p>
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
      className={`rounded-full px-6 h-10 font-bold transition-all ${active ? 'bg-primary text-white shadow-lg' : 'border-primary/20 text-primary hover:bg-primary/5'}`}
      suppressHydrationWarning
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
}