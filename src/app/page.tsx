"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { IngredientInput } from "@/components/ingredient-input";
import { generateRecipeSuggestions, GenerateRecipeSuggestionsOutput } from "@/ai/flows/generate-recipe-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat, Sparkles, ChevronRight, Apple } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 animate-fade-in">
            <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary bg-white/50 backdrop-blur">
              Harvest Recipes AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tight leading-tight">
              Create Magic From Your <span className="text-accent underline decoration-primary/20 underline-offset-8 italic">Kitchen Scraps</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Snap a photo of your fridge or pantry, and let our culinary AI craft artisanal recipes tailored to what you already have.
            </p>
          </section>

          {/* Input Section */}
          <section className="animate-slide-up">
            <IngredientInput onGenerate={handleGenerate} isLoading={isLoading} />
          </section>

          {/* Results Section */}
          {(suggestions || isLoading) && (
            <section id="results" className="space-y-8 py-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent" />
                    Chef's Recommendations
                  </h2>
                  <p className="text-muted-foreground">Crafted based on your unique ingredients.</p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse bg-white/50 border-primary/5">
                      <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                      <div className="p-6 space-y-4">
                        <div className="h-6 w-3/4 bg-muted rounded" />
                        <div className="h-10 w-full bg-muted rounded" />
                        <div className="h-8 w-1/2 bg-muted rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-3">
                  {suggestions?.recipeSuggestions.map((recipe, idx) => (
                    <Card key={idx} className="group relative overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl border-primary/10 bg-white">
                      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                        <img 
                          src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s+/g, '')}/600/400`} 
                          alt={recipe.recipeName}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                           <Badge className="bg-white text-primary border-none">{recipe.difficultyLevel}</Badge>
                        </div>
                      </div>
                      <CardHeader className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-widest">
                            {recipe.difficultyLevel}
                          </Badge>
                        </div>
                        <CardTitle className="font-headline text-2xl leading-tight group-hover:text-primary transition-colors">
                          {recipe.recipeName}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-muted-foreground pt-2">
                          {recipe.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {recipe.ingredientsUsed.slice(0, 3).map((ing, i) => (
                            <Badge key={i} variant="outline" className="bg-primary/5 text-[10px] border-primary/10">
                              {ing}
                            </Badge>
                          ))}
                          {recipe.ingredientsUsed.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">+{recipe.ingredientsUsed.length - 3} more</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-primary/60">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recipe.estimatedPrepTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Apple className="h-3 w-3" />
                            {recipe.nutritionalInformation}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 transition-all rounded-lg h-10 group"
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          View Recipe
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Featured Content / Benefits */}
          {!suggestions && !isLoading && (
            <section className="grid md:grid-cols-3 gap-12 text-center py-20 border-t border-primary/10">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary">Creative Cooking</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Discover unexpected combinations and turn basic staples into gourmet meals.</p>
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <Apple className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary">Reduce Waste</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Save money and help the planet by using everything in your pantry before it expires.</p>
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <ChefHat className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary">Tailored Taste</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">The AI learns your preferences to suggest meals you'll actually enjoy making.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary font-headline font-bold text-xl">
            Harvest Recipes AI
          </div>
          <p className="text-muted-foreground text-sm">Empowering every home cook with the intelligence of a Michelin-star chef.</p>
          <div className="pt-6 border-t border-primary/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2024 Harvest Recipes AI. All culinary rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
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