"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { IngredientInput } from "@/components/ingredient-input";
import { generateRecipeSuggestions, GenerateRecipeSuggestionsOutput } from "@/ai/flows/generate-recipe-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat, Sparkles, ChevronRight, Apple, Flame, Info } from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GenerateRecipeSuggestionsOutput | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [currentInput, setCurrentInput] = useState<{ photos: string[], text: string }>({ photos: [], text: "" });

  const handleGenerate = async (data: { photos: string[], text: string }) => {
    setIsLoading(true);
    setCurrentInput(data);
    try {
      const result = await generateRecipeSuggestions({
        ingredientPhotos: data.photos,
        ingredientText: data.text,
      });
      setSuggestions(result);
      // Scroll to results
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <section className="text-center space-y-8 animate-fade-in">
            <Badge variant="outline" className="px-6 py-1.5 border-primary/20 text-primary bg-white/50 backdrop-blur-sm text-sm font-semibold tracking-wide">
              AI-Powered Culinary Assistant
            </Badge>
            <h1 className="text-6xl md:text-8xl font-headline font-black text-primary tracking-tight leading-[1.1]">
              Flavor From <span className="text-accent italic">Fragments</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Turn your random ingredients into artisanal masterpieces. No more food waste, just intelligent cooking.
            </p>
          </section>

          {/* Input Section */}
          <section className="animate-slide-up max-w-4xl mx-auto">
            <IngredientInput onGenerate={handleGenerate} isLoading={isLoading} />
          </section>

          {/* Results Section */}
          {(suggestions || isLoading) && (
            <section id="results" className="space-y-12 py-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-accent fill-accent/20" />
                    Curated Suggestions
                  </h2>
                  <p className="text-lg text-muted-foreground">High-protein, gourmet options designed specifically for your pantry.</p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-8 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse bg-white/50 border-primary/5 rounded-3xl overflow-hidden shadow-sm">
                      <div className="aspect-[16/10] bg-muted" />
                      <div className="p-8 space-y-6">
                        <div className="h-8 w-3/4 bg-muted rounded-full" />
                        <div className="space-y-3">
                          <div className="h-4 w-full bg-muted rounded-full" />
                          <div className="h-4 w-5/6 bg-muted rounded-full" />
                        </div>
                        <div className="flex gap-4">
                          <div className="h-10 flex-1 bg-muted rounded-xl" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-10 md:grid-cols-3">
                  {suggestions?.recipeSuggestions.map((recipe, idx) => (
                    <Card key={idx} className="group relative flex flex-col transition-all hover:-translate-y-2 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border-none rounded-[2rem] bg-white overflow-hidden">
                      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                        <img 
                          src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s+/g, '')}/800/500`} 
                          alt={recipe.recipeName}
                          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                          data-ai-hint="food gourmet"
                        />
                        <div className="absolute top-4 left-4">
                           <Badge className="bg-white/95 text-primary border-none shadow-sm backdrop-blur-md px-3 py-1 font-bold">
                             {recipe.difficultyLevel.toUpperCase()}
                           </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex gap-2">
                             <Badge className="bg-accent text-accent-foreground border-none font-bold">
                               {recipe.nutrition.calories} kcal
                             </Badge>
                             <Badge className="bg-primary/80 text-white backdrop-blur-md border-none font-bold">
                               {recipe.nutrition.protein} Protein
                             </Badge>
                          </div>
                        </div>
                      </div>
                      <CardHeader className="p-8 pb-4">
                        <CardTitle className="font-headline text-3xl leading-tight group-hover:text-primary transition-colors mb-3">
                          {recipe.recipeName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base text-muted-foreground/80 font-medium italic">
                          "{recipe.description}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-8 flex-1">
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                          <div className="flex items-center gap-3 text-sm font-bold text-primary/70">
                            <Clock className="h-4 w-4 text-accent" />
                            {recipe.estimatedPrepTime}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-bold text-primary/70">
                            <Info className="h-4 w-4 text-accent" />
                            {recipe.nutrition.healthSummary}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-8 pt-4">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 transition-all rounded-2xl h-14 text-lg font-bold group shadow-lg"
                          onClick={() => setSelectedRecipe(recipe)}
                          suppressHydrationWarning
                        >
                          Unlock Full Recipe
                          <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Benefits Grid */}
          {!suggestions && !isLoading && (
            <section className="grid md:grid-cols-3 gap-16 py-24 border-t border-primary/5">
              <div className="space-y-6 group">
                <div className="h-20 w-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent transition-transform group-hover:rotate-12">
                  <Sparkles className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Intelligent Pairing</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Our AI uses molecular gastronomy principles to suggest flavor profiles that truly complement your ingredients.</p>
              </div>
              <div className="space-y-6 group">
                <div className="h-20 w-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent transition-transform group-hover:rotate-12">
                  <Apple className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Zero Waste Living</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Stop letting fresh produce expire. Turn those "scraps" into high-nutrient meals that save money and the planet.</p>
              </div>
              <div className="space-y-6 group">
                <div className="h-20 w-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent transition-transform group-hover:rotate-12">
                  <ChefHat className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Data-Driven Nutrition</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Every recipe comes with a complete caloric and macronutrient breakdown for precise health tracking.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t bg-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex items-center justify-center gap-3 text-primary font-headline font-black text-3xl">
            Harvest Recipes AI
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">The future of home cooking is here. No more wondering "what's for dinner?".</p>
          <div className="pt-12 border-t border-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-medium">
            <p>© 2024 Harvest Recipes AI. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
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
