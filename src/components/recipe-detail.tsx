"use client";

import { useEffect, useState, useRef } from "react";
import { publishRecipe, recipeAssistantChat } from "@/app/actions/ai";
import { Input } from "@/components/ui/input";
import type { DetailedRecipeOutput as GenerateDetailedRecipeInstructionsOutput } from "@/types/ai";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, Flame, Apple, Zap, Droplets, Sparkles, X, Mic, MicOff, ChevronRight, ChevronLeft, Share2, CookingPot, Plus, Info, Activity, Wind, MessageSquare, Send, Bot, User } from "lucide-react";
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
  const [isInteractive, setIsInteractive] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const { toast } = useToast();

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    async function loadDetails() {
      // If recipe already has details (like from the database/pre-generated), use them!
      if (recipe.details) {
        setDetails(recipe.details);
        setLoading(false);
        return;
      }
      
      // Fallback for demo recipes without details - manually defined, NEVER call AI per user request
      const manualDetails: GenerateDetailedRecipeInstructionsOutput = {
        estimatedPrepTime: recipe.estimatedPrepTime || "25 min",
        difficultyLevel: recipe.difficultyLevel || "Medium",
        nutritionalInformation: `Approx ${recipe.nutrition?.calories || 450} calories. Balanced macros.`,
        instructions: recipe.previewInstructions || [
          "Mise en place: Prepare all ingredients and workspace.",
          "Aromatic Base: Sauté aromatics in oil until fragrant.",
          "Main Build: Incorporate primary components and seasonings.",
          "Simmer: Reduce heat and cook until textures are perfect.",
          "Finish: Adjust seasoning and garnish before serving."
        ],
        ingredients: (recipe.ingredientsUsed || ["Fresh ingredients"]).map((name: string) => ({
          name: name,
          quantity: "to taste",
          isAvailable: true
        }))
      };
      setDetails(manualDetails);
      setLoading(false);
    }
    loadDetails();
  }, [recipe]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const result = await recipeAssistantChat({
        recipeName: recipe.recipeName,
        description: recipe.description,
        ingredients: details?.ingredients.map(i => i.name).join(', ') || '',
        instructions: details?.instructions.join('\n') || '',
        question: userMessage,
        history: chatMessages
      });

      if (result.success && result.content) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: result.content! }]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({ title: "Assistant Offline", description: "Chat is currently limited. Please try again soon.", variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

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

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

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

  const speakStep = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
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

  const handlePublish = async () => {
    try {
      const result = await publishRecipe({
        ...recipe,
        details: details
      });
      if (result.success) {
        toast({ title: "Recipe Published!", description: result.message || "Now visible to the community." });
      } else {
        toast({ title: "Publish failed", description: result.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: "Could not connect to database.", variant: "destructive" });
    }
  };

  const handleOrder = (app: string) => {
    toast({ title: `Opening ${app}`, description: `Getting missing ingredients for you.` });
    window.open(`https://www.${app.toLowerCase()}.com`, '_blank');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden flex flex-col bg-white border-none rounded-[3rem] shadow-2xl">
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
          <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Left Side: Fixed Image (35%) */}
            <div className="lg:w-[35%] h-64 lg:h-full relative overflow-hidden flex-shrink-0">
              <img
                src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000"}
                alt={recipe.recipeName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-6 left-6 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 z-50 lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Side: Content Area (65% - Much Wider) */}
            <div className="lg:w-[65%] flex flex-col min-w-0 bg-white">
              {/* Ultra-Tight Fixed Header Section */}
              <div className="p-5 pb-3 border-b space-y-3 flex-shrink-0 bg-white z-10">
                {/* Row 1: Title & Actions */}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2">
                      <Badge className="bg-primary/5 text-primary border-none font-black px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest">
                        {details.difficultyLevel}
                      </Badge>
                      <Badge className="bg-primary/5 text-primary border-none font-black px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest">
                        {details.estimatedPrepTime}
                      </Badge>
                    </div>
                    <DialogTitle className="text-xl md:text-2xl font-headline text-primary font-black leading-tight italic truncate mt-1">
                      {recipe.recipeName}
                    </DialogTitle>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="icon" className="rounded-full border-primary/10 h-8 w-8 hover:bg-primary/5" onClick={handleShare}>
                      <Share2 className="h-3.5 w-3.5 text-primary" />
                    </Button>
                    <Button variant="default" className="rounded-full bg-secondary text-white font-black text-[9px] uppercase tracking-widest h-8 px-4 shadow-md shadow-secondary/10 hover:bg-secondary/90 transition-all" onClick={handlePublish}>
                      Publish
                    </Button>
                    <Button variant="default" className="rounded-full bg-primary text-white font-black text-[9px] uppercase tracking-widest h-8 px-4 shadow-md shadow-primary/10 hover:bg-primary/90 transition-all" onClick={saveToCollection}>
                      Save
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hidden lg:flex hover:bg-red-50 hover:text-red-500 transition-colors h-8 w-8 ml-1">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Row 2: Short Description / Quote about the dish */}
                <div className="py-1">
                   <p className="text-[12px] text-primary/50 font-medium italic border-l-2 border-secondary/20 pl-4 truncate">
                    {recipe.description || "A masterfully crafted dish focusing on fresh, seasonal ingredients and balanced textures."}
                  </p>
                </div>

                {/* Row 3: Stats Area */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex gap-1.5 flex-shrink-0 overflow-x-auto no-scrollbar pb-1">
                    <HeaderStat icon={<Flame className="h-3 w-3" />} value={`${recipe.nutrition?.calories || 0}`} label="Cal" />
                    <HeaderStat icon={<Apple className="h-3 w-3" />} value={recipe.nutrition?.protein || "0g"} label="Pro" />
                    <HeaderStat icon={<Zap className="h-3 w-3" />} value={recipe.nutrition?.carbs || "0g"} label="Carb" />
                    <HeaderStat icon={<Droplets className="h-3 w-3" />} value={recipe.nutrition?.fat || "0g"} label="Fat" />
                    <HeaderStat icon={<Info className="h-3 w-3" />} value="8g" label="Fiber" />
                    <HeaderStat icon={<Wind className="h-3 w-3" />} value="VIT" label="A/C" />
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-6 md:p-8 space-y-10">
                  {isInteractive ? (
                    <div className="animate-fade-in py-2">
                      <div className="bg-primary/5 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-8 relative border border-primary/5 min-h-[450px]">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setIsInteractive(false); window.speechSynthesis.cancel(); }}
                          className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center"
                        >
                          <ChevronLeft className="h-3 w-3 mr-1" /> Return to Steps
                        </Button>
                        <div className="absolute top-6 left-8 text-primary/10 font-black text-6xl">
                          {currentStepIdx + 1}
                        </div>
                        <p className="text-2xl md:text-3xl font-headline text-primary leading-tight max-w-3xl italic px-4">
                          {details.instructions[currentStepIdx]}
                        </p>
                        <div className="flex items-center gap-6 pt-6">
                          <Button variant="outline" size="lg" onClick={handlePrevStep} disabled={currentStepIdx === 0} className="rounded-full w-14 h-14 p-0 bg-white border-primary/10 hover:bg-primary/5 shadow-sm">
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <Button size="lg" onClick={() => speakStep(details.instructions[currentStepIdx])} className="rounded-full w-16 h-16 bg-secondary text-white shadow-xl shadow-secondary/10 hover:scale-110 transition-transform">
                            <Mic className="h-7 w-7" />
                          </Button>
                          <Button size="lg" onClick={handleNextStep} disabled={currentStepIdx === details.instructions.length - 1} className="rounded-full w-14 h-14 p-0 bg-primary shadow-lg shadow-primary/10 hover:scale-110 transition-transform text-white">
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                          {isListening ? <Mic className="h-3 w-3 animate-pulse text-secondary" /> : <MicOff className="h-3 w-3" />}
                          <span>Voice Control {isListening ? "Listening" : "Ready"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Left Column: Ingredients */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between border-b border-primary/5 pb-2 pr-2">
                          <h3 className="text-lg font-headline font-black text-primary uppercase tracking-tight italic flex-shrink-0">Ingredients</h3>
                          <Button variant="outline" size="sm" className="h-6 text-[7px] font-black text-secondary uppercase tracking-widest px-2 border-secondary/20 hover:bg-secondary/5 rounded-full ml-4" onClick={() => handleOrder('Zomato')}>
                            Market <ChevronRight className="h-2 w-2 ml-1" />
                          </Button>
                        </div>
                        <div className="space-y-2 lg:max-h-[350px] overflow-y-auto no-scrollbar pr-1">
                          {details.ingredients.map((ing: any, i: number) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${ing.isAvailable ? 'bg-primary/5 border-primary/10' : 'bg-white border-primary/10 opacity-60'}`}>
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${ing.isAvailable ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground'}`}>
                                  {ing.isAvailable ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                </div>
                                <span className="text-sm font-bold text-primary truncate">{ing.name}</span>
                              </div>
                              <span className="text-[10px] font-black text-muted-foreground uppercase flex-shrink-0 ml-2">{ing.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Cooking Method */}
                      <div className="lg:col-span-8 space-y-6 pb-6">
                        <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                          <h3 className="text-lg font-headline font-black text-primary uppercase tracking-tight italic">Cooking Method</h3>
                          <Button variant="ghost" size="sm" className="text-secondary font-black uppercase tracking-widest text-[9px] bg-secondary/5 hover:bg-secondary/10 border border-secondary/10 rounded-full px-4 py-1 h-7" onClick={() => setIsInteractive(true)}>
                            <CookingPot className="h-3 w-3 mr-2" /> Voice Guide
                          </Button>
                        </div>
                        <div className="space-y-6">
                          {details.instructions.map((step: any, i: number) => (
                            <div key={i} className="flex gap-6 group">
                              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-lg font-black flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                                {i + 1}
                              </div>
                              <div className="pt-1.5 flex-1 min-w-0">
                                <p className="text-[15px] text-primary/80 font-medium leading-relaxed group-hover:text-primary transition-colors border-l-2 border-primary/5 pl-6 group-hover:border-secondary transition-all">
                                  {step}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Controls */}
              <div className="px-10 py-6 border-t bg-white flex justify-between items-center flex-shrink-0 relative">
                <p className="text-[11px] font-black text-primary/30 uppercase tracking-[0.4em]">Harvest AI • Recipe Engine v2.0</p>
                
                <div className="flex gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setChatOpen(!chatOpen)}
                    className="rounded-full font-black text-secondary hover:bg-secondary/5 uppercase tracking-[0.3em] text-[11px] flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" /> Recipe Assistant
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full font-black text-primary hover:text-secondary uppercase tracking-[0.3em] text-[11px]">
                    Exit Kitchen Dashboard
                  </Button>
                </div>

                {/* AI Chat Overlay */}
                {chatOpen && (
                  <div className="absolute bottom-full right-10 mb-4 w-[400px] h-[500px] bg-white border border-primary/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100]">
                    <div className="p-6 bg-primary text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        <span className="font-headline font-black text-lg italic capitalize">Masterchef AI</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white rounded-full">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50">
                      {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-8">
                          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-primary/60">
                            "Ask me about substitutes, cooking times, or flavor pairings for this recipe!"
                          </p>
                        </div>
                      )}
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm font-medium shadow-sm flex gap-3 ${
                            msg.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white text-primary border border-primary/5 rounded-tl-none'
                          }`}>
                            {msg.role === 'assistant' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                            <div>{msg.content}</div>
                            {msg.role === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-primary/5 flex gap-2">
                            <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-bounce" />
                            <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-bounce delay-100" />
                            <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t bg-white">
                      <div className="relative">
                        <Input 
                          placeholder="Ask a question..." 
                          className="pr-12 rounded-full border-primary/10 focus-visible:ring-secondary h-12 text-sm"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                          size="icon" 
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim() || chatLoading}
                          className="absolute right-1 top-1 h-10 w-10 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function HeaderStat({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/[0.03] border border-primary/5 shadow-sm">
      <div className="text-primary flex-shrink-0">{icon}</div>
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="text-base font-black text-primary leading-none">{value}</span>
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}