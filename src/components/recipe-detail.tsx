"use client";

import { useEffect, useState } from "react";
import { generateDetailedRecipeInstructions, GenerateDetailedRecipeInstructionsOutput } from "@/ai/flows/generate-detailed-recipe-instructions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Clock, ChefHat, Info, Save, Heart, Flame, Apple, Zap, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RecipeDetailProps {
  recipe: any;
  onClose: () => void;
  availableIngredients: string[];
}

export function RecipeDetail({ recipe, onClose, availableIngredients }: RecipeDetailProps) {
  const [details, setDetails] = useState<GenerateDetailedRecipeInstructionsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadDetails() {
      try {
        const result = await generateDetailedRecipeInstructions({
          recipeName: recipe.recipeName,
          recipeSummary: recipe.description,
          availableIngredients,
        });
        setDetails(result);
      } catch (error) {
        console.error("Failed to load recipe details", error);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [recipe, availableIngredients]);

  const saveToCollection = () => {
    const saved = JSON.parse(localStorage.getItem("harvest_saved_recipes") || "[]");
    if (saved.find((r: any) => r.recipeName === recipe.recipeName)) {
      toast({
        title: "Already saved",
        description: "This recipe is already in your collection.",
      });
      return;
    }
    const updated = [...saved, { ...recipe, details }];
    localStorage.setItem("harvest_saved_recipes", JSON.stringify(updated));
    toast({
      title: "Saved to Collection",
      description: `${recipe.recipeName} is now in your vault.`,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden flex flex-col bg-white border-none rounded-[2.5rem] shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 bg-primary/5">
            <div className="relative">
               <div className="h-16 w-16 border-4 border-primary/10 border-t-accent animate-spin rounded-full" />
               <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-accent animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-primary text-xl font-headline font-bold">Drafting your culinary blueprint...</p>
              <p className="text-muted-foreground font-medium">Calculating nutrients and refining steps.</p>
            </div>
          </div>
        ) : details ? (
          <>
            <div className="p-8 md:p-12 border-b bg-gradient-to-br from-primary/10 via-primary/5 to-white relative">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-2">
                  <Badge className="bg-accent text-accent-foreground border-none font-bold px-4 py-1.5 rounded-full shadow-sm">
                    {details.difficultyLevel.toUpperCase()}
                  </Badge>
                  <Badge className="bg-white/80 backdrop-blur-sm text-primary border border-primary/10 font-bold px-4 py-1.5 rounded-full shadow-sm">
                    {details.estimatedPrepTime}
                  </Badge>
                </div>
                <Button variant="outline" className="rounded-full border-primary/20 bg-white/50 backdrop-blur-sm hover:bg-white text-primary font-bold shadow-sm" onClick={saveToCollection} suppressHydrationWarning>
                  <Heart className="h-5 w-5 mr-2 text-destructive fill-destructive/10" />
                  Save Recipe
                </Button>
              </div>
              
              <DialogTitle className="text-5xl font-headline text-primary mb-4 leading-tight">
                {recipe.recipeName}
              </DialogTitle>
              <DialogDescription className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                {recipe.description}
              </DialogDescription>
              
              {/* Detailed Nutrition Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div className="bg-white/60 p-4 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <Flame className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Calories</p>
                    <p className="text-lg font-bold text-primary">{recipe.nutrition.calories} kcal</p>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Apple className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Protein</p>
                    <p className="text-lg font-bold text-primary">{recipe.nutrition.protein}</p>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Carbs</p>
                    <p className="text-lg font-bold text-primary">{recipe.nutrition.carbs}</p>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Droplets className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Fat</p>
                    <p className="text-lg font-bold text-primary">{recipe.nutrition.fat}</p>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-8 md:p-12">
              <div className="space-y-16">
                <section>
                  <h3 className="text-3xl font-headline font-bold text-primary mb-8 flex items-center gap-4">
                    <span className="h-1.5 w-12 bg-accent rounded-full" />
                    Ingredients List
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details.ingredients.map((ing, i) => (
                      <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${ing.isAvailable ? 'bg-primary/[0.02] border-primary/10' : 'bg-muted/30 border-muted-foreground/10 opacity-70'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${ing.isAvailable ? 'bg-primary text-white shadow-md' : 'bg-muted text-muted-foreground'}`}>
                            {ing.isAvailable ? <Check className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                          </div>
                          <span className={`text-lg ${ing.isAvailable ? 'font-bold text-primary' : 'font-medium text-muted-foreground'}`}>
                            {ing.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-sm font-bold border-primary/20 px-3 py-1 bg-white rounded-full text-primary/80">
                          {ing.quantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-3xl font-headline font-bold text-primary mb-10 flex items-center gap-4">
                    <span className="h-1.5 w-12 bg-accent rounded-full" />
                    Method of Preparation
                  </h3>
                  <div className="space-y-10">
                    {details.instructions.map((step, i) => (
                      <div key={i} className="flex gap-8 group">
                        <div className="flex-shrink-0 relative">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-accent transition-colors">
                            {i + 1}
                          </div>
                          {i < details.instructions.length - 1 && (
                            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary/10 rounded-full" />
                          )}
                        </div>
                        <div className="pt-2">
                          <p className="text-xl text-muted-foreground font-medium leading-relaxed group-hover:text-primary transition-colors">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                
                {/* Health Insight Footer */}
                <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-accent shadow-sm">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-headline font-bold text-primary mb-2">Chef's Nutritional Note</h4>
                      <p className="text-lg text-muted-foreground/90 font-medium italic">"{recipe.nutrition.healthSummary}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-20 text-center space-y-4">
             <div className="h-12 w-12 bg-destructive/10 text-destructive rounded-full mx-auto flex items-center justify-center">
                <X className="h-6 w-6" />
             </div>
             <p className="text-xl font-bold text-primary">Failed to retrieve details</p>
             <p className="text-muted-foreground">The kitchen is a bit busy. Please try again in a moment.</p>
             <Button variant="outline" onClick={onClose} className="rounded-full" suppressHydrationWarning>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
