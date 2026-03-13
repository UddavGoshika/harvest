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
          
          <section className="text-center space-y-8 animate-fade-in pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs tracking-widest uppercase">
              <Sparkles className="h-4 w-4" />
              Harvest Recipes AI
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-black text-primary tracking-tighter leading-[0.9]">
              Cook <span className="text-accent italic">Naturally.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Turn your ingredients into curated culinary experiences with intelligent nutritional insights.
            </p>
          </section>

          <section className="animate-slide-up max-w-4xl mx-auto">
            <IngredientInput onGenerate={handleGenerate} isLoading={isLoading} />
          </section>

          {(suggestions || isLoading) && (
            <section id="results" className="space-y-16 py-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-primary/5">
                <div className="space-y-2">
                  <h2 className="text-5xl font-headline font-bold text-primary flex items-center gap-3">
                    Your Curated Menu
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">Seasonal suggestions based on your available items.</p>
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
                        <div className="absolute top-4 left-4">
                           <Badge className="bg-white/95 text-primary border-none shadow-md backdrop-blur-md px-4 py-1.5 font-bold uppercase text-[10px]">
                             {recipe.difficultyLevel}
                           </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                           <Badge className="bg-accent/90 text-white border-none font-bold text-[10px] shadow-lg">
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
                            <Clock className="h-3 w-3 text-accent" />
                            {recipe.estimatedPrepTime}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                            <Apple className="h-3 w-3 text-accent" />
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

              {pantrySuggestions && (
                <div className="pt-20 space-y-8 animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-sm">
                      <ShoppingBasket className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-headline font-bold text-primary">Enhance Your Pantry</h3>
                      <p className="text-muted-foreground font-medium">Recommended pairings for your current kitchen stock.</p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-4">
                    {pantrySuggestions.suggestions.map((item, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/10 text-primary/60 uppercase">
                            {item.category}
                          </Badge>
                          <Plus className="h-4 w-4 text-accent group-hover:rotate-90 transition-transform" />
                        </div>
                        <h4 className="text-xl font-headline font-bold text-primary mb-2">{item.ingredient}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
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
                <h3 className="text-2xl font-headline font-bold text-primary">Chef Intelligence</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Our AI uses professional culinary logic to ensure every pairing is scientifically sound.</p>
              </div>
              <div className="space-y-6">
                <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <Apple className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Whole Nutrition</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Detailed caloric and macronutrient breakdowns to keep your health goals on track.</p>
              </div>
              <div className="space-y-6">
                <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <Flame className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary">Visual Search</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">Simply snap a photo of your fridge, and let Harvest AI handle the rest.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="bg-primary py-24 mt-20 text-white rounded-t-[3rem]">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <ChefHat className="h-12 w-12 text-accent" />
            <span className="text-4xl font-headline font-black tracking-tighter">HARVEST AI</span>
          </div>
          <p className="text-xl text-white/60 max-w-xl mx-auto font-medium">Elevating everyday home cooking with artificial culinary intelligence.</p>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-white/40 font-bold uppercase tracking-widest">
            <p>© 2024 HARVEST CULINARY SYSTEMS.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Mobile App</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
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