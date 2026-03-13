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
import { Check, Clock, ChefHat, Info, Save, Heart } from "lucide-react";
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
      title: "Recipe Saved!",
      description: `${recipe.recipeName} added to your collection.`,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden flex flex-col bg-white border-primary/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-primary/20 border-t-primary animate-spin rounded-full" />
            <p className="text-primary font-medium animate-pulse">Drafting the perfect steps...</p>
          </div>
        ) : details ? (
          <>
            <div className="p-8 border-b bg-primary/5">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="bg-accent text-accent-foreground border-none">
                  {details.difficultyLevel}
                </Badge>
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10" onClick={saveToCollection}>
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
              <DialogTitle className="text-4xl font-headline text-primary mb-2">
                {recipe.recipeName}
              </DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground">
                {recipe.description}
              </DialogDescription>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold text-primary">Time</p>
                    <p>{details.estimatedPrepTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold text-primary">Level</p>
                    <p>{details.difficultyLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold text-primary">Nutrition</p>
                    <p className="truncate" title={details.nutritionalInformation}>{details.nutritionalInformation}</p>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-8">
              <div className="space-y-10">
                <section>
                  <h3 className="text-2xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="h-1 w-8 bg-accent" />
                    Ingredients
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-primary/5 bg-muted/20">
                        <span className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${ing.isAvailable ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={ing.isAvailable ? 'font-medium' : 'text-muted-foreground'}>{ing.name}</span>
                        </span>
                        <Badge variant="outline" className="text-xs font-normal border-primary/10">{ing.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="h-1 w-8 bg-accent" />
                    Cooking Steps
                  </h3>
                  <div className="space-y-6">
                    {details.instructions.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                        <p className="text-muted-foreground leading-relaxed pt-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Something went wrong. Please try again.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}