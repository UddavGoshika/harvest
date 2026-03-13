"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, ChefHat, Trash2, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { RecipeDetail } from "@/components/recipe-detail";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage() {
  const [planner, setPlanner] = useState<Record<string, any[]>>({});
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  useEffect(() => {
    const savedPlanner = JSON.parse(localStorage.getItem("harvest_meal_planner") || "{}");
    setPlanner(savedPlanner);
  }, []);

  const removeFromPlanner = (day: string, idx: number) => {
    const updated = { ...planner };
    updated[day] = updated[day].filter((_, i) => i !== idx);
    setPlanner(updated);
    localStorage.setItem("harvest_meal_planner", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-headline font-black text-primary">Weekly Planner</h1>
            <p className="text-muted-foreground text-lg">Organize your culinary journey day by day.</p>
          </div>

          <div className="grid gap-8">
            {DAYS.map((day) => (
              <section key={day} className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-headline font-bold text-primary w-32">{day}</h2>
                  <div className="h-px flex-1 bg-primary/10" />
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="rounded-full text-accent hover:text-accent hover:bg-accent/10">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Recipe
                    </Button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {planner[day]?.length > 0 ? (
                    planner[day].map((recipe, idx) => (
                      <Card key={idx} className="bg-white border-primary/5 shadow-sm group hover:shadow-md transition-all">
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                             <Badge variant="outline" className="text-[10px] font-bold border-accent/20 text-accent uppercase">
                               {recipe.difficultyLevel}
                             </Badge>
                             <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromPlanner(day, idx)}
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </div>
                          <CardTitle className="text-xl font-headline font-bold text-primary mt-2">{recipe.recipeName}</CardTitle>
                          <CardDescription className="line-clamp-2 text-sm italic">{recipe.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            variant="outline" 
                            className="w-full text-[10px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary/5 transition-all h-8"
                            onClick={() => setSelectedRecipe(recipe)}
                          >
                             View Details
                             <ChevronRight className="ml-2 h-3 w-3" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="md:col-span-3 border-2 border-dashed border-primary/5 bg-white/50 rounded-[2rem] py-12 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary/40">
                         <Plus className="h-6 w-6" />
                      </div>
                      <p className="text-muted-foreground font-medium italic">Empty for {day}. Add a recipe from your collection!</p>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          availableIngredients={[]} 
        />
      )}

    </div>
  );
}