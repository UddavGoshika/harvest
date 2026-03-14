"use client";

import { useEffect, useState, useRef } from "react";
import { generateRecipeBlueprint } from "@/app/actions/ai";
import type { DetailedRecipeOutput as GenerateDetailedRecipeInstructionsOutput } from "@/types/ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Clock, ChefHat, Info, Save, Heart, Flame, Apple, Zap, Droplets, Calendar, Sparkles, X, Mic, MicOff, ChevronRight, ChevronLeft, Share2, ShoppingCart, Wand2, CookingPot, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface RecipeDetailProps {
  recipe: any;
  onClose: () => void;
  availableIngredients: string[];
}

export function RecipeDetail({ recipe, onClose, availableIngredients }: RecipeDetailProps) {
  const [details, setDetails] = useState<GenerateDetailedRecipeInstructionsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInteractive, setIsInteractive] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    async function loadDetails() {
      if (recipe.details) {
        setDetails(recipe.details);
        setLoading(false);
        return;
      }
      try {
        // AI blueprint call removed as per user request to use hardcoded data
        // Generating a high-quality hardcoded fallback based on recipe name
        const fallbackDetails: GenerateDetailedRecipeInstructionsOutput = {
          estimatedPrepTime: recipe.estimatedPrepTime || "25 min",
          difficultyLevel: recipe.difficultyLevel || "Medium",
          nutritionalInformation: `Approx ${recipe.nutrition?.calories || 450} calories. Balanced macros for a healthy meal.`,
          instructions: [
            `Prepare all fresh ingredients: ${recipe.ingredientsUsed?.join(', ') || 'available produce'}.`,
            "Sauté aromatics in a pan with a dash of oil until fragrant.",
            `Incorporate the primary ingredients into the pan and season to taste.`,
            "Simmer for 10-15 minutes until textures are perfect.",
            "Garnish with fresh herbs and serve immediately."
          ],
          ingredients: (recipe.ingredientsUsed || ["Fresh basic ingredients"]).map((name: string) => ({
            name: name,
            quantity: "1 unit",
            isAvailable: true
          }))
        };
        
        setDetails(fallbackDetails);
      } catch (error) {
        console.error("Failed to load recipe details", error);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [recipe, availableIngredients]);

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (transcript.includes("next step") || transcript.includes("next")) {
          handleNextStep();
        } else if (transcript.includes("previous step") || transcript.includes("back")) {
          handlePrevStep();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      toast({ title: "Voice Control Active", description: 'Say "Next step" or "Previous step"' });
    }
  };

  const handleNextStep = () => {
    if (details && currentStepIdx < details.instructions.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const saveToCollection = () => {
    const saved = JSON.parse(localStorage.getItem("harvest_saved_recipes") || "[]");
    if (saved.find((r: any) => r.recipeName === recipe.recipeName)) {
      toast({ title: "Already saved" });
      return;
    }
    const updated = [...saved, { ...recipe, details }];
    localStorage.setItem("harvest_saved_recipes", JSON.stringify(updated));
    toast({ title: "Saved to Collection" });
  };

  const addToPlanner = (day: string) => {
    const planner = JSON.parse(localStorage.getItem("harvest_meal_planner") || "{}");
    if (!planner[day]) planner[day] = [];
    planner[day].push({ ...recipe, details });
    localStorage.setItem("harvest_meal_planner", JSON.stringify(planner));
    toast({ title: "Added to Planner", description: `Added to ${day}` });
  };

  const handleShare = () => {
    const text = `🍽️ Check out this amazing recipe: ${recipe.recipeName}\n\n📝 Description: ${recipe.description}\n\n🛒 Ingredients:\n${details?.ingredients.map((i: any) => `- ${i.name} (${i.quantity})`).join('\n')}\n\n🔥 Shared via Harvest AI App`;
    
    if (navigator.share) {
      navigator.share({
        title: recipe.recipeName,
        text: text,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast({ title: "Link Copied", description: "Ready to share with friends!" });
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Details Copied", description: "Paste them in any app to share." });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOrder = (app: string) => {
    toast({ title: `Opening ${app}`, description: `Getting missing ingredients for you.` });
    window.open(`https://www.${app.toLowerCase()}.com`, '_blank');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col bg-[#F5F7F4] border-none rounded-[3rem] shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 bg-primary/5">
            <div className="sr-only">
              <DialogTitle>{recipe.recipeName}</DialogTitle>
              <DialogDescription>{recipe.description}</DialogDescription>
            </div>
            <div className="relative">
               <div className="h-16 w-16 border-4 border-primary/10 border-t-primary animate-spin rounded-full" />
               <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-primary text-xl font-headline font-bold">Drafting your Kitchen Blueprint...</p>
          </div>
        ) : details ? (
          <>
            <div className="p-8 md:p-12 border-b bg-white relative">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <Badge className="bg-primary text-white border-none font-bold px-4 py-1.5 rounded-full">
                    {details.difficultyLevel.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 text-primary font-bold px-4 py-1.5 rounded-full">
                    {details.estimatedPrepTime}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full border-primary/20" onClick={toggleListening} suppressHydrationWarning>
                    {isListening ? <Mic className="h-4 w-4 text-primary animate-pulse" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20" onClick={handleShare} suppressHydrationWarning>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20" onClick={handlePrint} suppressHydrationWarning>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="default" className="rounded-full bg-primary font-bold" onClick={saveToCollection} suppressHydrationWarning>
                    <Heart className="h-4 w-4 mr-2" /> Save
                  </Button>
                </div>
              </div>
              
              <DialogTitle className="text-4xl md:text-5xl font-headline text-primary mb-4">
                {recipe.recipeName}
              </DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
                {recipe.description}
              </DialogDescription>
            </div>

            {isInteractive ? (
              <div className="flex-1 flex flex-col p-8 md:p-12 space-y-8 animate-fade-in">
                <div className="flex-1 bg-white rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-8 relative border border-primary/5 shadow-xl">
                  <div className="absolute top-10 left-10 text-primary/10 font-black text-8xl">
                    {currentStepIdx + 1}
                  </div>
                  <p className="text-3xl font-headline text-primary leading-tight max-w-xl">
                    {details.instructions[currentStepIdx]}
                  </p>
                  <div className="flex gap-6 pt-10">
                    <Button variant="outline" size="lg" onClick={handlePrevStep} disabled={currentStepIdx === 0} className="rounded-full w-16 h-16 p-0" suppressHydrationWarning>
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button size="lg" onClick={handleNextStep} disabled={currentStepIdx === details.instructions.length - 1} className="rounded-full w-16 h-16 p-0 bg-primary" suppressHydrationWarning>
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">
                    {isListening ? "Listening: 'Next Step' or 'Previous Step'" : "Voice Control Offline"}
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 p-8 md:p-12">
                <div className="space-y-16">
                  {/* Nutrition Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBox icon={<Flame className="h-5 w-5" />} label="Calories" value={`${recipe.nutrition.calories}`} />
                    <StatBox icon={<Apple className="h-5 w-5" />} label="Protein" value={recipe.nutrition.protein} />
                    <StatBox icon={<Zap className="h-5 w-5" />} label="Carbs" value={recipe.nutrition.carbs} />
                    <StatBox icon={<Droplets className="h-5 w-5" />} label="Fat" value={recipe.nutrition.fat} />
                  </div>

                  {/* Flavor Improvements - AI Feature */}
                  <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-4">
                     <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-3">
                        <Wand2 className="h-6 w-6 text-secondary" />
                        AI Flavor Boosters
                     </h3>
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        To elevate this dish, try adding a pinch of <b>Smoked Paprika</b> for depth, or a splash of <b>Lime juice</b> right before serving to brighten the regional flavors.
                     </p>
                  </div>

                  {/* Ingredients Section */}
                  <section className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-headline font-bold text-primary">Ingredients</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-[0.2em]" onClick={() => handleOrder('Swiggy')}>Swiggy</Button>
                        <Button variant="outline" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-[0.2em]" onClick={() => handleOrder('Zomato')}>Zomato</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {details.ingredients.map((ing: any, i: number) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${ing.isAvailable ? 'bg-primary/5 border-primary/20' : 'bg-white border-primary/5 opacity-60'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${ing.isAvailable ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                              {ing.isAvailable ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                            </div>
                            <span className="font-bold text-primary">{ing.name}</span>
                          </div>
                          <span className="text-xs font-black text-muted-foreground uppercase">{ing.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Instructions Section */}
                  <section className="space-y-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-headline font-bold text-primary">Method</h3>
                      <Button variant="ghost" className="text-secondary font-black uppercase tracking-widest text-[10px]" onClick={() => setIsInteractive(true)}>
                        <CookingPot className="h-4 w-4 mr-2" /> Start Hands-Free
                      </Button>
                    </div>
                    <div className="space-y-12">
                      {details.instructions.map((step: any, i: number) => (
                        <div key={i} className="flex gap-8 group">
                          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            {i + 1}
                          </div>
                          <div className="pt-1">
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed group-hover:text-primary transition-colors">
                              {step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </ScrollArea>
            )}
            
            <div className="p-6 bg-white border-t flex justify-center">
               <Button variant="ghost" onClick={onClose} className="rounded-full font-bold text-muted-foreground">Close Recipe</Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-3">
      <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
        <p className="text-sm font-black text-primary">{value}</p>
      </div>
    </div>
  );
}