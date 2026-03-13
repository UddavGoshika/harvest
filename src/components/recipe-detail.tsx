"use client";

import { useEffect, useState, useRef } from "react";
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
import { Check, Clock, ChefHat, Info, Save, Heart, Flame, Apple, Zap, Droplets, Calendar, Sparkles, X, Mic, MicOff, ChevronRight, ChevronLeft } from "lucide-react";
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
        console.log("Voice Command:", transcript);
        if (transcript.includes("next step") || transcript.includes("next")) {
          handleNextStep();
        } else if (transcript.includes("previous step") || transcript.includes("back")) {
          handlePrevStep();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
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
      toast({ title: "Voice Control Active", description: 'Try saying "Next step" or "Previous step"' });
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
      toast({ title: "Already saved", description: "This recipe is already in your collection." });
      return;
    }
    const updated = [...saved, { ...recipe, details }];
    localStorage.setItem("harvest_saved_recipes", JSON.stringify(updated));
    toast({ title: "Saved to Collection", description: `${recipe.recipeName} is now in your vault.` });
  };

  const addToPlanner = (day: string) => {
    const planner = JSON.parse(localStorage.getItem("harvest_meal_planner") || "{}");
    if (!planner[day]) planner[day] = [];
    planner[day].push({ ...recipe, details });
    localStorage.setItem("harvest_meal_planner", JSON.stringify(planner));
    toast({ title: "Added to Planner", description: `${recipe.recipeName} added to ${day}.` });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden flex flex-col bg-white border-none rounded-[2.5rem] shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 bg-primary/5">
            <div className="relative">
               <div className="h-16 w-16 border-4 border-primary/10 border-t-primary animate-spin rounded-full" />
               <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-primary text-xl font-headline font-bold">Refining your culinary blueprint...</p>
          </div>
        ) : details ? (
          <>
            {/* Header */}
            <div className="p-8 md:p-12 border-b bg-gradient-to-br from-primary/10 via-primary/5 to-white relative">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-2">
                  <Badge className="bg-primary text-white border-none font-bold px-4 py-1.5 rounded-full shadow-sm">
                    {details.difficultyLevel.toUpperCase()}
                  </Badge>
                  <Badge className="bg-white/80 backdrop-blur-sm text-primary border border-primary/10 font-bold px-4 py-1.5 rounded-full shadow-sm">
                    {details.estimatedPrepTime}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={isInteractive ? "default" : "outline"} 
                    className="rounded-full border-primary/20 font-bold"
                    onClick={() => setIsInteractive(!isInteractive)}
                    suppressHydrationWarning
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Interactive Mode
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full border-primary/20 bg-white/50 backdrop-blur-sm hover:bg-white text-primary font-bold shadow-sm" suppressHydrationWarning>
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Plan
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl p-2 border-primary/5 shadow-2xl bg-white">
                      {DAYS.map((day) => (
                        <DropdownMenuItem key={day} onClick={() => addToPlanner(day)} className="rounded-xl font-bold text-primary hover:bg-primary/5 cursor-pointer">
                          {day}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="rounded-full border-primary/20 bg-white/50 backdrop-blur-sm hover:bg-white text-primary font-bold shadow-sm" onClick={saveToCollection} suppressHydrationWarning>
                    <Heart className="h-5 w-5 mr-2 text-primary fill-primary/10" />
                    Save
                  </Button>
                </div>
              </div>
              
              <DialogTitle className="text-5xl font-headline text-primary mb-4 leading-tight">
                {recipe.recipeName}
              </DialogTitle>
              <DialogDescription className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                {recipe.description}
              </DialogDescription>
            </div>

            {/* Interactive Step-by-Step UI */}
            {isInteractive ? (
              <div className="flex-1 flex flex-col p-8 md:p-12 space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-headline font-bold text-primary">Hands-free Cooking Assistant</h3>
                  <Button 
                    variant={isListening ? "default" : "outline"} 
                    onClick={toggleListening}
                    className="rounded-full animate-pulse"
                    suppressHydrationWarning
                  >
                    {isListening ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                    {isListening ? "Listening..." : "Start Voice Control"}
                  </Button>
                </div>

                <div className="flex-1 bg-primary/5 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-6 relative border border-primary/10">
                  <div className="absolute top-8 left-8 text-primary/20 font-black text-6xl">
                    {currentStepIdx + 1}
                  </div>
                  <p className="text-3xl font-headline text-primary leading-tight max-w-xl">
                    {details.instructions[currentStepIdx]}
                  </p>
                  <div className="flex gap-4 pt-10">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={handlePrevStep} 
                      disabled={currentStepIdx === 0}
                      className="rounded-full w-16 h-16 p-0 border-primary/20"
                      suppressHydrationWarning
                    >
                      <ChevronLeft className="h-8 w-8 text-primary" />
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={handleNextStep} 
                      disabled={currentStepIdx === details.instructions.length - 1}
                      className="rounded-full w-16 h-16 p-0 bg-primary"
                      suppressHydrationWarning
                    >
                      <ChevronRight className="h-8 w-8 text-white" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground font-medium text-sm">
                    Say "Next Step" or click the arrow
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 p-8 md:p-12">
                <div className="space-y-16">
                  {/* Nutritional Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <NutrientCard icon={<Flame className="h-6 w-6" />} label="Calories" value={`${recipe.nutrition.calories} kcal`} />
                    <NutrientCard icon={<Apple className="h-6 w-6" />} label="Protein" value={recipe.nutrition.protein} />
                    <NutrientCard icon={<Zap className="h-6 w-6" />} label="Carbs" value={recipe.nutrition.carbs} />
                    <NutrientCard icon={<Droplets className="h-6 w-6" />} label="Fat" value={recipe.nutrition.fat} />
                  </div>

                  <section>
                    <h3 className="text-3xl font-headline font-bold text-primary mb-8 flex items-center gap-4">
                      <span className="h-1.5 w-12 bg-primary rounded-full" />
                      Ingredients
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
                      <span className="h-1.5 w-12 bg-primary rounded-full" />
                      Preparation Method
                    </h3>
                    <div className="space-y-10">
                      {details.instructions.map((step, i) => (
                        <div key={i} className="flex gap-8 group">
                          <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg">
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
                </div>
              </ScrollArea>
            )}
          </>
        ) : (
          <div className="p-20 text-center space-y-4">
             <div className="h-12 w-12 bg-destructive/10 text-destructive rounded-full mx-auto flex items-center justify-center">
                <X className="h-6 w-6" />
             </div>
             <p className="text-xl font-bold text-primary">Could not draft details</p>
             <Button variant="outline" onClick={onClose} className="rounded-full" suppressHydrationWarning>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function NutrientCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white/60 p-4 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}