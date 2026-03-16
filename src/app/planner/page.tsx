"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, ChefHat, Trash2, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { RecipeDetail } from "@/components/recipe-detail";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { suggestRecipes, generateWeeklySchedule } from "@/app/actions/ai";
import { checkUsage, incrementUsage } from "@/lib/plans";
import { PencilLine, Sparkles, Utensils, MoveUp, MoveDown, ArrowRightLeft, LayoutGrid } from "lucide-react";
import { BulkScheduleDialog } from "@/components/bulk-schedule-dialog";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage() {
  const [planner, setPlanner] = useState<Record<string, any[]>>({});
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("");
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [isBulkScheduleOpen, setIsBulkScheduleOpen] = useState(false);
  const [currentIngredients, setCurrentIngredients] = useState<string>("");
  const [manualData, setManualData] = useState({
    name: "",
    time: "20 min",
    difficulty: "Easy",
    ingredients: "",
    instructions: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedPlanner = JSON.parse(localStorage.getItem("harvest_meal_planner") || "{}");
    const savedColl = JSON.parse(localStorage.getItem("harvest_saved_recipes") || "[]");
    const savedIngs = localStorage.getItem("harvest_tracked_ingredients") || "";
    setPlanner(savedPlanner);
    setSavedRecipes(savedColl);
    setCurrentIngredients(savedIngs);
  }, []);

  const savePlanner = (updated: Record<string, any[]>) => {
    setPlanner(updated);
    localStorage.setItem("harvest_meal_planner", JSON.stringify(updated));
  };

  const openAddModal = (day: string) => {
    setActiveDay(day);
    setIsAddingModalOpen(true);
    setSearchQuery("");
  };

  const addToPlanner = (day: string, recipe: any) => {
    const updated = { ...planner };
    if (!updated[day]) updated[day] = [];
    updated[day].push(recipe);
    savePlanner(updated);
    setIsAddingModalOpen(false);
    toast({ title: `Added to ${day}`, description: `${recipe.recipeName} is now on the menu.` });
  };

  const moveRecipe = (day: string, index: number, direction: 'up' | 'down' | 'nextDay') => {
    const updated = { ...planner };
    const currentDayRecipes = [...(updated[day] || [])];
    const item = currentDayRecipes[index];

    if (direction === 'up' && index > 0) {
      currentDayRecipes.splice(index, 1);
      currentDayRecipes.splice(index - 1, 0, item);
      updated[day] = currentDayRecipes;
    } else if (direction === 'down' && index < currentDayRecipes.length - 1) {
      currentDayRecipes.splice(index, 1);
      currentDayRecipes.splice(index + 1, 0, item);
      updated[day] = currentDayRecipes;
    } else if (direction === 'nextDay') {
      const dayIdx = DAYS.indexOf(day);
      const nextDay = DAYS[(dayIdx + 1) % DAYS.length];
      currentDayRecipes.splice(index, 1);
      updated[day] = currentDayRecipes;
      if (!updated[nextDay]) updated[nextDay] = [];
      updated[nextDay].push(item);
      toast({ title: "Moved", description: `Recipe moved to ${nextDay}` });
    }
    savePlanner(updated);
  };

  const handleBulkScheduleConfirm = async (ingredients: string[], context: any) => {
    setIsBulkGenerating(true);
    try {
      toast({ title: "AI Planner Active", description: "Designing your 7-day culinary roadmap..." });
      const result = await generateWeeklySchedule(ingredients, context);
      if (result.success && result.data) {
        savePlanner(result.data);
        toast({ title: "Schedule Ready!", description: "Your week has been fully optimized." });
        setIsBulkScheduleOpen(false);
      }
    } catch (e) {
      toast({ title: "Scheduling failed", variant: "destructive" });
    } finally {
      setIsBulkGenerating(false);
    }
  };

  const generateAndAdd = async () => {
    if (!searchQuery.trim()) return;

    // Check usage limits
    if (!checkUsage('recipesPerDay')) {
      toast({
        title: "Daily Limit Reached",
        description: "Upgrade your plan on the pricing page for more daily recipes!",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await suggestRecipes({
        ingredientText: searchQuery,
        mode: 'standard'
      });
      if (result.success && result.data?.recipeSuggestions?.[0]) {
        addToPlanner(activeDay, result.data.recipeSuggestions[0]);
        incrementUsage();
      }
    } catch (e) {
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualAdd = () => {
    if (!manualData.name || !manualData.ingredients) {
      toast({ title: "Quick Tip", description: "At least a name and ingredients are needed!", variant: "destructive" });
      return;
    }

    const newRecipe = {
      recipeName: manualData.name,
      description: "Hand-crafted secret recipe.",
      estimatedPrepTime: manualData.time,
      difficultyLevel: manualData.difficulty,
      nutrition: { calories: 300 },
      details: {
        ingredients: manualData.ingredients.split('\n').filter(i => i.trim()).map(i => ({ name: i, quantity: "", isAvailable: true })),
        instructions: manualData.instructions.split('\n').filter(i => i.trim()),
        estimatedPrepTime: manualData.time,
        difficultyLevel: manualData.difficulty
      }
    };

    addToPlanner(activeDay, newRecipe);
    setManualData({ name: "", time: "20 min", difficulty: "Easy", ingredients: "", instructions: "" });
  };

  const removeFromPlanner = (day: string, idx: number) => {
    const updated = { ...planner };
    updated[day] = updated[day].filter((_, i) => i !== idx);
    setPlanner(updated);
    localStorage.setItem("harvest_meal_planner", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs tracking-wider uppercase">
                <ChefHat className="h-4 w-4" /> Meal Management
              </div>
              <h1 className="text-4xl md:text-7xl font-headline font-black text-primary tracking-tighter">Weekly Recipe Planner</h1>
              <p className="text-muted-foreground text-lg font-medium italic">Transform your fridge contents into a 7-day gourmet schedule.</p>
            </div>

            <Button
              onClick={() => setIsBulkScheduleOpen(true)}
              disabled={isBulkGenerating}
              className="h-16 px-10 rounded-[2rem] bg-primary text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all gap-4 ring-8 ring-primary/5"
            >
              <LayoutGrid className="h-5 w-5" />
              {isBulkGenerating ? "Designing Week..." : "AI Schedule Complete Week"}
            </Button>
          </div>

          {currentIngredients && (
            <div className="bg-white p-6 rounded-[2.5rem] border border-primary/5 shadow-sm flex items-center gap-6 overflow-x-auto no-scrollbar">
              <div className="flex-shrink-0 bg-primary/5 rounded-2xl px-4 py-2 border border-primary/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 leading-none">Your Fridge Stack</span>
              </div>
              <div className="flex gap-2">
                {currentIngredients.split(',').map((ing, i) => (
                  <Badge key={i} variant="secondary" className="rounded-full px-4 py-1 bg-[#F5F7F4] text-primary whitespace-nowrap border-none">
                    {ing.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-12">
            {DAYS.map((day) => (
              <section key={day} className="space-y-6 relative">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-headline font-bold text-primary">{day}</h2>
                  <div className="h-px flex-1 bg-primary/10" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-secondary hover:text-secondary hover:bg-secondary/10 font-bold px-6 h-10 border border-secondary/10"
                    onClick={() => openAddModal(day)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {planner[day]?.length > 0 ? (
                    planner[day].map((recipe, idx) => (
                      <Card key={idx} className="bg-white border-primary/5 shadow-xl group hover:shadow-2xl transition-all rounded-[2.5rem] overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000"}
                            alt={recipe.recipeName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                          <Badge variant="outline" className="absolute top-4 left-4 text-[10px] font-bold bg-white/90 backdrop-blur-md border-none text-primary px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                            {recipe.difficultyLevel}
                          </Badge>
                        </div>
                        <CardHeader className="p-8 pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <CardTitle className="text-2xl font-headline font-bold text-primary leading-tight">{recipe.recipeName}</CardTitle>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5" onClick={() => moveRecipe(day, idx, 'up')}>
                                <MoveUp className="h-4 w-4 text-primary/40" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5" onClick={() => moveRecipe(day, idx, 'down')}>
                                <MoveDown className="h-4 w-4 text-primary/40" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary/10" onClick={() => moveRecipe(day, idx, 'nextDay')}>
                                <ArrowRightLeft className="h-4 w-4 text-secondary/60" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                onClick={() => removeFromPlanner(day, idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="line-clamp-2 text-sm italic font-medium">{recipe.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-8 pt-0">
                          <Button
                            variant="outline"
                            className="w-full text-[10px] font-black uppercase tracking-widest border-primary/10 rounded-full hover:bg-primary text-primary hover:text-white transition-all h-12 shadow-sm"
                            onClick={() => setSelectedRecipe(recipe)}
                          >
                            Step-by-Step Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="md:col-span-3 border-4 border-dashed border-primary/5 bg-white/40 rounded-[3rem] py-20 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-primary/10 shadow-inner">
                        <Plus className="h-10 w-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-primary font-headline font-bold text-xl">Quiet Day for {day}</p>
                        <p className="text-muted-foreground text-sm font-medium italic">No meals scheduled yet.</p>
                      </div>
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

      {/* Add Recipe Modal */}
      <Dialog open={isAddingModalOpen} onOpenChange={setIsAddingModalOpen}>
        <DialogContent className="max-w-2xl bg-background rounded-[3.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <Tabs defaultValue="ai" className="w-full">
            <div className="p-10 pb-6 bg-white border-b flex items-center justify-between">
              <div>
                <DialogTitle className="text-3xl font-headline text-primary mb-1">Plan for {activeDay}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground font-medium italic">Curate your daily menu.</DialogDescription>
              </div>
              <TabsList className="bg-primary/5 rounded-full p-1.5 h-12">
                <TabsTrigger value="ai" className="rounded-full px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Smart Engine</TabsTrigger>
                <TabsTrigger value="manual" className="rounded-full px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Hand Entry</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="ai" className="m-0 focus-visible:ring-0">
              <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="flex gap-4">
                  <Input
                    placeholder="Search context or AI prompt..."
                    className="h-14 rounded-full border-primary/10 px-8 bg-primary/5 focus:bg-white text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateAndAdd()}
                  />
                  <Button
                    onClick={generateAndAdd}
                    disabled={isGenerating || !searchQuery.trim()}
                    className="h-14 px-10 rounded-full bg-secondary text-white font-black uppercase text-[10px] tracking-widest shadow-xl flex-shrink-0"
                  >
                    {isGenerating ? "Analyzing..." : <Sparkles className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-4">Saved in Your Vault</h3>
                  {savedRecipes.length > 0 ? (
                    <div className="grid gap-4">
                      {savedRecipes.slice(0, 6).map((recipe, i) => (
                        <div
                          key={i}
                          className="group bg-white border border-primary/5 p-6 rounded-[2rem] hover:border-secondary/30 hover:bg-secondary/5 transition-all cursor-pointer flex items-center justify-between shadow-sm"
                          onClick={() => addToPlanner(activeDay, recipe)}
                        >
                          <div>
                            <p className="font-bold text-primary text-lg group-hover:text-secondary transition-colors truncate">{recipe.recipeName}</p>
                            <p className="text-xs text-muted-foreground font-medium">{recipe.estimatedPrepTime} • {recipe.difficultyLevel}</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-primary/5 rounded-[2.5rem] border border-dashed border-primary/10">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Vault Empty</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="m-0 focus-visible:ring-0">
              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Dish Name</label>
                    <Input
                      placeholder="e.g. Pasta Al Limone"
                      className="rounded-2xl h-14 border-primary/10 bg-primary/5 px-6"
                      value={manualData.name}
                      onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Prep Time</label>
                    <Input
                      placeholder="e.g. 15 min"
                      className="rounded-2xl h-14 border-primary/10 bg-primary/5 px-6"
                      value={manualData.time}
                      onChange={(e) => setManualData({ ...manualData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Ingredients (One per line)</label>
                  <Textarea
                    placeholder="Lemon&#10;Pasta&#10;Cream..."
                    className="rounded-2xl min-h-[120px] border-primary/10 bg-primary/5 p-6"
                    value={manualData.ingredients}
                    onChange={(e) => setManualData({ ...manualData, ingredients: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Steps</label>
                  <Textarea
                    placeholder="Step 1: Boil water...&#10;Step 2: Squeeze lemon..."
                    className="rounded-2xl min-h-[120px] border-primary/10 bg-primary/5 p-6"
                    value={manualData.instructions}
                    onChange={(e) => setManualData({ ...manualData, instructions: e.target.value })}
                  />
                </div>

                <Button onClick={handleManualAdd} className="w-full h-16 rounded-full bg-primary text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
                  Add to Menu
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <BulkScheduleDialog
        isOpen={isBulkScheduleOpen}
        onOpenChange={setIsBulkScheduleOpen}
        onConfirm={handleBulkScheduleConfirm}
        isGenerating={isBulkGenerating}
      />
    </div>
  );
}