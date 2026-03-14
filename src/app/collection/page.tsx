"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight, Clock, ChefHat } from "lucide-react";
import { RecipeDetail } from "@/components/recipe-detail";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, BookOpen } from "lucide-react";

export default function CollectionPage() {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const { toast } = useToast();
  
  const [manualRecipe, setManualRecipe] = useState({
    recipeName: "",
    description: "",
    time: "30 min",
    difficulty: "Medium",
    ingredients: "",
    instructions: "",
    calories: "400"
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("harvest_saved_recipes") || "[]");
    setSavedRecipes(saved);
  }, []);

  const removeRecipe = (name: string) => {
    const updated = savedRecipes.filter(r => r.recipeName !== name);
    setSavedRecipes(updated);
    localStorage.setItem("harvest_saved_recipes", JSON.stringify(updated));
  };

  const saveManualRecipe = () => {
    if (!manualRecipe.recipeName || !manualRecipe.ingredients || !manualRecipe.instructions) {
       toast({ title: "Please fill all required fields" });
       return;
    }

    const newRecipe = {
      id: "m" + Date.now(),
      recipeName: manualRecipe.recipeName,
      description: manualRecipe.description,
      estimatedPrepTime: manualRecipe.time,
      difficultyLevel: manualRecipe.difficulty,
      nutrition: { calories: parseInt(manualRecipe.calories) },
      details: {
        ingredients: manualRecipe.ingredients.split('\n').map(i => ({ name: i.trim(), quantity: "As needed", isAvailable: true })),
        instructions: manualRecipe.instructions.split('\n').filter(i => i.trim()),
        difficultyLevel: manualRecipe.difficulty,
        estimatedPrepTime: manualRecipe.time
      }
    };

    const updated = [newRecipe, ...savedRecipes];
    setSavedRecipes(updated);
    localStorage.setItem("harvest_saved_recipes", JSON.stringify(updated));
    setIsAddingManual(false);
    setManualRecipe({
      recipeName: "",
      description: "",
      time: "30 min",
      difficulty: "Medium",
      ingredients: "",
      instructions: "",
      calories: "400"
    });
    toast({ title: "Manual Recipe Saved", description: "This recipe is now immortalized in your collection." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-headline font-bold text-primary">Your Collection</h1>
              <p className="text-muted-foreground">Your personalized vault of culinary discoveries.</p>
            </div>
            <Button onClick={() => setIsAddingManual(true)} className="rounded-full bg-gradient-primary border-none text-white font-black shadow-xl h-12 px-8 uppercase text-xs tracking-widest">
               <Plus className="mr-2 h-4 w-4" /> Create Manual Recipe
            </Button>
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

      <Dialog open={isAddingManual} onOpenChange={setIsAddingManual}>
        <DialogContent className="max-w-2xl bg-[#F5F7F4] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
           <div className="p-8 md:p-12 bg-white">
              <DialogTitle className="text-3xl font-headline text-primary mb-2">Create Manual Recipe</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">Draft your own hardcoded recipe details.</DialogDescription>
           </div>
           <div className="p-8 md:p-12 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Recipe Name*</label>
                  <Input 
                    placeholder="Grandma's Secret Pasta..." 
                    className="rounded-xl border-primary/10"
                    value={manualRecipe.recipeName}
                    onChange={(e) => setManualRecipe({...manualRecipe, recipeName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Prep Time</label>
                  <Input 
                    placeholder="e.g. 45 min" 
                    className="rounded-xl border-primary/10"
                    value={manualRecipe.time}
                    onChange={(e) => setManualRecipe({...manualRecipe, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Ingredients (One per line)*</label>
                <Textarea 
                  placeholder="2 Carrots&#10;1 Onion&#10;..." 
                  className="rounded-xl border-primary/10 min-h-[100px]"
                  value={manualRecipe.ingredients}
                  onChange={(e) => setManualRecipe({...manualRecipe, ingredients: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Instructions (One per line)*</label>
                <Textarea 
                  placeholder="1. Wash vegetables&#10;2. Chop finely&#10;..." 
                  className="rounded-xl border-primary/10 min-h-[150px]"
                  value={manualRecipe.instructions}
                  onChange={(e) => setManualRecipe({...manualRecipe, instructions: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Difficulty</label>
                    <select 
                      className="w-full h-10 px-3 rounded-xl border border-primary/10 bg-white"
                      value={manualRecipe.difficulty}
                      onChange={(e) => setManualRecipe({...manualRecipe, difficulty: e.target.value})}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Approx. Calories</label>
                    <Input 
                      type="number"
                      className="rounded-xl border-primary/10"
                      value={manualRecipe.calories}
                      onChange={(e) => setManualRecipe({...manualRecipe, calories: e.target.value})}
                    />
                 </div>
              </div>
           </div>
           <div className="p-8 border-t bg-white flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsAddingManual(false)} className="rounded-full font-bold">Cancel</Button>
              <Button onClick={saveManualRecipe} className="rounded-full bg-primary text-white font-bold px-8">Save Hardcoded Recipe</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}