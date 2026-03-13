"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Plus, X, Upload, CheckCircle2, RefreshCw, Trash2, Search, Smartphone, ListChecks, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COMMON_INGREDIENTS = [
  "Garlic", "Onion", "Olive Oil", "Salt", "Black Pepper", "Butter", "Eggs", "Milk", 
  "Flour", "Chicken Breast", "Tomato", "Pasta", "Rice", "Lemon", "Parmesan", 
  "Cilantro", "Parsley", "Rosemary", "Thyme", "Ginger", "Soy Sauce", "Honey", 
  "Balsamic Vinegar", "Cumin", "Paprika", "Cinnamon", "Basil", "Spinach", 
  "Carrot", "Potato", "Bell Pepper", "Beef", "Pork", "Shrimp", "Salmon"
];

interface IngredientInputProps {
  onGenerate: (data: { photos: string[], text: string }) => void;
  isLoading: boolean;
}

export function IngredientInput({ onGenerate, isLoading }: IngredientInputProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCameraActive) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          setIsCameraActive(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your settings.',
          });
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraActive]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPhotos(prev => [...prev, dataUri]);
        toast({ title: "Captured!", description: "Added to your visual pantry." });
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    
    const parts = val.split(',');
    const lastPart = parts[parts.length - 1].trim().toLowerCase();
    
    if (lastPart.length > 1) {
      const filtered = COMMON_INGREDIENTS.filter(item => 
        item.toLowerCase().includes(lastPart) && !val.toLowerCase().includes(item.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addSuggestion = (item: string) => {
    const parts = text.split(',');
    parts[parts.length - 1] = ` ${item}`;
    setText(parts.join(',').trim() + ", ");
    setSuggestions([]);
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-[3rem] shadow-2xl border border-primary/5 space-y-12">
      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12 bg-primary/5 rounded-full p-1 h-14">
          <TabsTrigger value="visual" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all flex items-center gap-2">
            <Camera className="h-4 w-4" /> Visual Scan
          </TabsTrigger>
          <TabsTrigger value="manual" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <Label className="text-xl font-headline text-primary font-bold flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-secondary" />
                Fridge Scan
              </Label>
              <div className="flex gap-2">
                <Button 
                  variant={isCameraActive ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className="rounded-full px-5 border-primary/20"
                >
                  {isCameraActive ? <X className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                  {isCameraActive ? "Stop" : "Open Camera"}
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full px-5 border-primary/20"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {isCameraActive && (
              <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-video border-8 border-primary/5 animate-in fade-in zoom-in duration-500 shadow-2xl">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                  <button 
                    onClick={capturePhoto}
                    className="h-20 w-20 rounded-full bg-white text-primary hover:scale-105 shadow-2xl border-4 border-white/20 transition-all active:scale-95 flex items-center justify-center group"
                  >
                    <div className="h-14 w-14 rounded-full border-2 border-primary/10 group-hover:border-primary/20" />
                  </button>
                </div>
                {hasCameraPermission === false && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 text-center">
                    <Alert variant="destructive" className="max-w-xs rounded-2xl">
                      <AlertTitle className="font-bold">Camera Required</AlertTitle>
                      <AlertDescription>Enable camera access to scan your fridge automatically.</AlertDescription>
                    </Alert>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 px-2">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/5 group shadow-sm hover:shadow-md transition-all">
                  <img src={photo} alt="Ingredient" className="object-cover w-full h-full" />
                  <button 
                    onClick={() => removePhoto(i)}
                    className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {!isCameraActive && photos.length === 0 && (
                <div 
                  onClick={() => setIsCameraActive(true)}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/10 rounded-2xl bg-primary/[0.02] cursor-pointer hover:bg-primary/[0.04] transition-all group"
                >
                  <Camera className="h-6 w-6 text-primary/30 group-hover:text-primary/50 mb-2 transition-colors" />
                  <span className="text-[10px] text-primary/40 group-hover:text-primary/60 font-black uppercase tracking-widest">Start Scan</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-4 px-2">
            <Label className="text-xl font-headline text-primary font-bold flex items-center gap-3">
              <Plus className="h-6 w-6 text-secondary" />
              Pantry Details
            </Label>
            <div className="relative group">
              <input 
                placeholder="Type ingredients separated by commas (e.g. eggs, flour, spinach)..." 
                value={text}
                onChange={handleTextChange}
                className="flex h-16 w-full rounded-[1.5rem] border border-primary/10 bg-primary/[0.02] px-8 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all group-hover:bg-primary/[0.04] shadow-sm pr-14"
              />
              <Search className="absolute right-6 top-5 h-6 w-6 text-primary/20" />
            </div>
            
            {suggestions.length > 0 && (
              <div className="bg-white border border-primary/5 shadow-xl rounded-3xl p-4 flex flex-wrap gap-2 animate-in fade-in zoom-in duration-200">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => addSuggestion(item)}
                    className="px-5 py-2.5 rounded-full bg-secondary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="px-2 pt-4 border-t border-primary/5">
        <Button 
          className="w-full h-18 text-lg md:text-xl font-black bg-primary hover:bg-primary/90 text-white transition-all rounded-full shadow-2xl hover:-translate-y-1 active:translate-y-0 group tracking-tight uppercase"
          onClick={() => onGenerate({ photos, text })}
          disabled={isLoading || (photos.length === 0 && !text.trim())}
          suppressHydrationWarning
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-6 w-6 animate-spin mr-3" />
              Drafting Culinary Blueprint...
            </>
          ) : (
            <>
              Find Recipes From My Ingredients
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
        <p className="text-center text-[10px] font-bold text-muted-foreground/50 mt-6 uppercase tracking-[0.2em]">
          AI-Powered Smart Ingredient Detection
        </p>
      </div>
    </div>
  );
}
