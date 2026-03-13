"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { IngredientInput } from "@/components/ingredient-input";
import { generateRecipeSuggestions, GenerateRecipeSuggestionsOutput } from "@/ai/flows/generate-recipe-suggestions";
import { generatePantrySuggestions, GeneratePantrySuggestionsOutput } from "@/ai/flows/generate-pantry-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, ChevronRight, Apple, ChefHat, ShoppingBasket, Plus, Flame, Info } from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GenerateRecipeSuggestionsOutput | null>(null);
  const [pantrySuggestions, setPantrySuggestions] = useState<GeneratePantrySuggestionsOutput | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [currentInput, setCurrentInput] = useState<{ photos: string[], text: string }>({ photos: [], text: "" });

  const handleGenerate = async (data: { photos: string[], text: string }) => {
    setIsLoading(true);
    setCurrentInput(data);
    try {
      const [recipeResult, pantryResult] = await Promise.all([
        generateRecipeSuggestions({
          ingredientPhotos: data.photos,
          ingredientText: data.text,
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
          
          {/* Hero Section */}
          <section className="text-center space-y-8 animate-fade-in pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs tracking-widest uppercase">
              <Sparkles className="h-4 w-4" />
              Next-Gen Culinary AI
            </div>
            <h1 className="text-6xl md:text-9xl font-headline font-black text-primary tracking-tighter leading-[0.9]">
              Eat <span className="text-accent italic">Intelligently.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Transform your kitchen scraps into gourmet masterpieces with precision nutrition and artisanal flavor profiles.
            </p>
          </section>

          {/* Input Section */}
          <section className="animate-slide-up max-w-4xl mx-auto">
            <IngredientInput onGenerate={handleGenerate} isLoading={isLoading} />
          </section>

          {/* Results Section */}
          {(suggestions || isLoading) && (
            <section id="results" className="space-y-16 py-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-primary/5">
                <div className="space-y-2">
                  <h2 className="text-5xl font-headline font-bold text-primary flex items-center gap-3">
                    Your Daily Specials
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">Tailored to your current inventory and nutritional needs.</p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-10 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-6">
                      <div className="aspect-[16/10] bg-muted rounded-[2.5rem]" />
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
                      <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-muted relative shadow-2xl transition-all group-hover:-translate-y-3 group-hover:shadow-primary/20">
                        <img 
                          src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s+/g, '')}/800/500`} 
                          alt={recipe.recipeName}
                          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                          data-ai-hint="gourmet dish"
                        />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <Badge className="bg-white/95 text-primary border-none shadow-xl backdrop-blur-md px-4 py-1.5 font-black text-[10px] tracking-widest uppercase">
                             {recipe.difficultyLevel}
                           </Badge>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex gap-2">
                             <Badge className="bg-accent/90 text-accent-foreground border-none font-black text-[10px] tracking-widest shadow-lg">
                               {recipe.nutrition.calories} KCAL
                             </Badge>
                             <Badge className="bg-primary/80 text-white backdrop-blur-md border-none font-black text-[10px] tracking-widest shadow-lg">
                               {recipe.nutrition.protein} PRO
                             </Badge>
                          </div>
                        </div>
                      </div>
                      <CardHeader className="px-2 pt-8 pb-4">
                        <CardTitle className="font-headline text-3xl leading-tight text-primary transition-colors mb-2">
                          {recipe.recipeName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base text-muted-foreground/80 font-medium italic">
                          "{recipe.description}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-2 flex-1">
                        <div className="flex items-center gap-6 pt-4 border-t border-primary/5">
                          <div className="flex items-center gap-2 text-[11px] font-black text-primary/40 uppercase tracking-widest">
                            <Clock className="h-3 w-3 text-accent" />
                            {recipe.estimatedPrepTime}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-black text-primary/40 uppercase tracking-widest">
                            <Info className="h-3 w-3 text-accent" />
                            {recipe.nutrition.healthSummary.slice(0, 30)}...
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-2 pt-6">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 transition-all rounded-2xl h-14 text-sm font-black tracking-widest uppercase shadow-xl hover:shadow-primary/20"
                          onClick={() => setSelectedRecipe(recipe)}
                          suppressHydrationWarning
                        >
                          View Full Method
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pantry Suggestions Section */}
              {pantrySuggestions && (
                <div className="pt-20 space-y-10 animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      <ShoppingBasket className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-headline font-bold text-primary">Smart Pantry Pairings</h3>
                      <p className="text-muted-foreground font-medium">Add these to your next list to unlock even more recipes.</p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-4">
                    {pantrySuggestions.suggestions.map((item, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline" className="text-[10px] font-black border-primary/10 text-primary/60 uppercase tracking-widest">
                            {item.category}
                          </Badge>
                          <Plus className="h-4 w-4 text-accent group-hover:scale-125 transition-transform" />
                        </div>
                        <h4 className="text-xl font-headline font-bold text-primary mb-2">{item.ingredient}</h4>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Value Props */}
          {!suggestions && !isLoading && (
            <section className="grid md:grid-cols-3 gap-16 py-24 border-t border-primary/5">
              <div className="space-y-6 text-center md:text-left">
                <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0">
                  <ChefHat className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Professional Logic</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Our AI uses culinary chemical principles to suggest pairings that truly work.</p>
              </div>
              <div className="space-y-6 text-center md:text-left">
                <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0">
                  <Apple className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Nutrient Focused</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Every recipe is a health investment, calculated to the gram.</p>
              </div>
              <div className="space-y-6 text-center md:text-left">
                <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0">
                  <Flame className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Android & iOS Ready</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Designed for touch, speed, and mobility. Take Harvest AI to the grocery store.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="bg-primary py-24 mt-20 text-white rounded-t-[4rem]">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
               <ChefHat className="h-10 w-10" />
            </div>
            <span className="text-4xl font-headline font-black tracking-tighter">HARVEST AI</span>
          </div>
          <p className="text-xl text-white/60 max-w-xl mx-auto font-medium leading-relaxed">Redefining the relationship between your pantry and your plate.</p>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40 font-black tracking-widest uppercase">
            <p>© 2024 HARVEST CULINARY SYSTEMS.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Mobile App</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
            </div>
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
