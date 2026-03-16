"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Plus, X, Upload, CheckCircle2, RefreshCw, Trash2, Search, Smartphone, ListChecks, ArrowRight, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runMarketScan } from "@/app/actions/ai";

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
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPhotos(prev => [...prev, base64]);
        
        // Real AI Vision call
        setIsScanning(true);
        try {
          const result = await runMarketScan({ contentType: file.type, url: base64 });
          if (result.success && result.data?.ingredients) {
            const detected = result.data.ingredients.map(i => i.name);
            setDetectedItems(prev => [...new Set([...prev, ...detected])]);
            toast({ title: "Scan Complete", description: `Found ${detected.length} ingredients.` });
          }
        } catch (err) {
          console.error("Scan failed", err);
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = async () => {
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
        
        setIsScanning(true);
        try {
          toast({ title: "Analyzing...", description: "Identifying ingredients from camera." });
          const result = await runMarketScan({ contentType: "image/jpeg", url: dataUri });
          if (result.success && result.data?.ingredients) {
            const detected = result.data.ingredients.map(i => i.name);
            setDetectedItems(prev => [...new Set([...prev, ...detected])]);
          }
        } catch (err) {
          console.error("Capture scan failed", err);
        } finally {
          setIsScanning(false);
        }
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const addManualItem = (item: string) => {
    const current = text.split(',').map(s => s.trim()).filter(s => s !== "");
    if (!current.includes(item)) {
      setText(prev => prev ? `${prev}, ${item}` : item);
    }
  };

  const handleAddDetectedItem = (newItem: string) => {
    if (!newItem.trim()) return;
    const updated = [...new Set([...detectedItems, newItem.trim()])];
    setDetectedItems(updated);
    localStorage.setItem("harvest_tracked_ingredients", updated.join(', '));
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-primary/5 space-y-10">
      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-10 bg-primary/5 rounded-full p-1 h-14">
          <TabsTrigger value="visual" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all flex items-center gap-2" suppressHydrationWarning>
            <Camera className="h-4 w-4" /> Visual Scanner
          </TabsTrigger>
          <TabsTrigger value="manual" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all flex items-center gap-2" suppressHydrationWarning>
            <ListChecks className="h-4 w-4" /> Smart List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                   <ScanLine className="h-5 w-5 text-secondary" />
                   Fridge Scanner
                </h3>
                <p className="text-xs text-muted-foreground">AI detects ingredients automatically from your camera.</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={isCameraActive ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className="rounded-full px-5 border-primary/20"
                  suppressHydrationWarning
                >
                  {isCameraActive ? <X className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                  {isCameraActive ? "Stop" : "Live Scan"}
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full px-5 border-primary/20"
                  suppressHydrationWarning
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {isCameraActive && (
              <div className="relative rounded-[2.5rem] overflow-hidden bg-black aspect-video border-4 border-primary/10 shadow-2xl animate-in fade-in zoom-in duration-500">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <div className="absolute inset-0 border-2 border-white/20 border-dashed m-12 rounded-[2rem] pointer-events-none" />
                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                  <button 
                    onClick={capturePhoto}
                    className="h-20 w-20 rounded-full bg-white text-primary hover:scale-110 shadow-2xl border-4 border-white/30 transition-all active:scale-90 flex items-center justify-center group"
                  >
                    <div className="h-14 w-14 rounded-full border-2 border-primary/20 group-hover:bg-primary/5" />
                  </button>
                </div>
                {hasCameraPermission === false && (
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-8 text-center">
                    <Alert variant="destructive" className="max-w-xs rounded-2xl border-none">
                      <AlertTitle className="font-bold">Camera Required</AlertTitle>
                      <AlertDescription>Please enable camera access in your browser settings to scan your pantry.</AlertDescription>
                    </Alert>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
            
            <div className="space-y-4">
              {photos.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/5 group shadow-sm">
                      <img src={photo} alt="Pantry" className="object-cover w-full h-full" />
                      <button 
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h4 className="text-[10px] font-black text-primary/60 uppercase tracking-widest flex items-center gap-2">
                    {isScanning ? <RefreshCw className="h-3 w-3 animate-spin" /> : "AI Detected Ingredients"}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Add more..." 
                      className="h-8 w-40 text-xs rounded-full border-primary/10 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          handleAddDetectedItem(val);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-primary"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddDetectedItem(input.value);
                        input.value = "";
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {detectedItems.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {detectedItems.map((item, i) => (
                      <Badge key={i} className="bg-white text-primary border-primary/10 px-3 py-1.5 rounded-full flex gap-2 items-center group">
                        {item}
                        <button onClick={() => setDetectedItems(prev => prev.filter((_, idx) => idx !== i))}>
                          <X className="h-3 w-3 text-muted-foreground group-hover:text-destructive transition-colors" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No ingredients detected yet. Snap a photo or add manually above.</p>
                )}
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xl font-headline text-primary font-bold flex items-center gap-2">
                 <Plus className="h-5 w-5 text-secondary" />
                 Kitchen Details
              </Label>
              <Input 
                placeholder="Type ingredients (e.g. Eggs, Flour, Spinach, Paneer)..." 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-16 rounded-[1.5rem] border-primary/10 bg-primary/5 px-8 text-lg focus-visible:ring-primary shadow-inner"
                suppressHydrationWarning
              />
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-2">Common Staples (Tap to add)</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_INGREDIENTS.slice(0, 15).map((item) => (
                  <button
                    key={item}
                    onClick={() => addManualItem(item)}
                    className="px-4 py-2 rounded-full bg-white border border-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-6 border-t border-primary/5">
        <Button 
          className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl hover:-translate-y-1 transition-all group uppercase tracking-widest"
          onClick={() => onGenerate({ photos, text: `${text}${detectedItems.length > 0 ? (text ? ', ' : '') + detectedItems.join(', ') : ''}` })}
          disabled={isLoading || (photos.length === 0 && !text.trim() && detectedItems.length === 0)}
          suppressHydrationWarning
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin mr-3" />
              AI is drafting recipes...
            </>
          ) : (
            <>
              Find Recipes Instantly
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
