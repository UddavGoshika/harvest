"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight, Clock, ChefHat } from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";
import { Badge } from "@/components/ui/badge";

export default function CollectionPage() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("harvest_saved_recipes") || "[]");
    setSavedRecipes(saved);
  }, []);

  const removeRecipe = (name: string) => {
    const updated = savedRecipes.filter(r => r.recipeName !== name);
    setSavedRecipes(updated);
    localStorage.setItem("harvest_saved_recipes", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-headline font-bold text-primary">Your Collection</h1>
            <p className="text-muted-foreground">Your personalized vault of culinary discoveries.</p>
          </div>

          {savedRecipes.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-white/50">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No recipes saved yet</h3>
              <p className="text-muted-foreground mb-6">Start generating recipes and save your favorites here.</p>
              <Button asChild>
                <a href="/">Go to Generator</a>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {savedRecipes.map((recipe, idx) => (
                <Card key={idx} className="group relative overflow-hidden transition-all hover:shadow-lg border-primary/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-primary border-primary/20">
                        {recipe.difficultyLevel}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                        onClick={() => removeRecipe(recipe.recipeName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="font-headline text-2xl mt-2">{recipe.recipeName}</CardTitle>
                    <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.estimatedPrepTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="h-4 w-4" />
                        {recipe.difficultyLevel}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-primary hover:text-white transition-all border-primary/20"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          availableIngredients={selectedRecipe.ingredientsUsed || []}
        />
      )}
    </div>
  );
}

function BookOpen(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}