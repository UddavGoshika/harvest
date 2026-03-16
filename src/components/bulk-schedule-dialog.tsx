"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Plus, X, ListChecks, ScanLine, Users, HeartPulse, ChefHat, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { runMarketScan } from "@/app/actions/ai";
import { toast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from "@/app/actions/user";

interface BulkScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (ingredients: string[], context: any) => void;
  isGenerating: boolean;
}

export function BulkScheduleDialog({ isOpen, onOpenChange, onConfirm, isGenerating }: BulkScheduleDialogProps) {
  const [profile, setProfile] = useState({
    email: "demo@harvest.com", // Simulated logged-in user
    familyMembers: 2,
    healthConditions: [] as string[],
    dietaryPreferences: [] as string[]
  });

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
      // Load tracked ingredients from localStorage as default
      const saved = localStorage.getItem("harvest_tracked_ingredients");
      if (saved) {
        setIngredients(saved.split(",").map(i => i.trim()).filter(i => i));
      }
    }
  }, [isOpen]);

  const loadProfile = async () => {
    const res = await getUserProfile(profile.email);
    if (res.success && res.data && !res.isFallback) {
      setProfile(res.data);
    } else {
      // Fallback to localStorage if DB fails or is unavailable
      const localProfile = localStorage.getItem(`harvest_profile_${profile.email}`);
      if (localProfile) {
        setProfile(JSON.parse(localProfile));
      }
    }
  };

  const handleUpdateProfile = async (updates: any) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);

    // Always persist to localStorage as a reliable secondary layer
    localStorage.setItem(`harvest_profile_${profile.email}`, JSON.stringify(newProfile));

    // Attempt background sync with DB
    await updateUserProfile(newProfile);
  };

  useEffect(() => {
    if (isCameraActive && isOpen) {
      const getCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (e) {
          toast({ variant: "destructive", title: "Camera Error", description: "Access denied." });
          setIsCameraActive(false);
        }
      };
      getCamera();
    } else {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    }
  }, [isCameraActive, isOpen]);

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUri = canvas.toDataURL('image/jpeg');
      setPhotos(p => [...p, dataUri]);
      setIsScanning(true);
      try {
        const res = await runMarketScan({ contentType: "image/jpeg", url: dataUri });
        if (res.success && res.data?.ingredients) {
          const newIngs = res.data.ingredients.map((i: any) => i.name);
          setIngredients(prev => [...new Set([...prev, ...newIngs])]);
        }
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPhotos(p => [...p, base64]);
      setIsScanning(true);
      try {
        const res = await runMarketScan({ contentType: file.type, url: base64 });
        if (res.success && res.data?.ingredients) {
          const newIngs = res.data.ingredients.map((i: any) => i.name);
          setIngredients(prev => [...new Set([...prev, ...newIngs])]);
        }
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients(prev => [...new Set([...prev, newIngredient.trim()])]);
      setNewIngredient("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white rounded-[3.5rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="flex flex-col h-[90vh]">
          {/* Header */}
          <div className="p-10 bg-primary text-white space-y-2">
            <h2 className="text-4xl font-headline font-black text-white racking-tight">Weekly Menu Planner</h2>
            <p className="text-white/70 font-medium italic">Configure your week based on currently available stocks and family needs.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12">
            {/* Ingredients Phase */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Phase 1: Inventory Scan [Fridge, Pantry, Freezer]</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsCameraActive(!isCameraActive)} className="rounded-full">
                    <Camera className="h-4 w-4 mr-2" /> {isCameraActive ? "Stop" : "Live Scan"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-full">
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
                </div>
              </div>

              {isCameraActive && (
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-lg">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-white border-4 border-white/20 shadow-2xl active:scale-90 transition-all" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add manual ingredient..."
                    className="rounded-full border-primary/10 bg-white"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                  />
                  <Button onClick={addIngredient} variant="secondary" className="rounded-full px-6">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing, i) => (
                    <Badge key={i} className="bg-white text-primary px-4 py-2 rounded-full border border-primary/5 flex items-center gap-2 group">
                      {ing}
                      <X className="h-3 w-3 cursor-pointer group-hover:text-destructive" onClick={() => setIngredients(prev => prev.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                  {ingredients.length === 0 && <span className="text-xs text-muted-foreground italic">Add items or scan your fridge.</span>}
                </div>
              </div>
            </section>

            {/* User Profile Phase */}
            <section className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40">Phase 2: Household Profile</h3>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-bold text-primary px-2">
                    <Users className="h-4 w-4 text-secondary" /> Family Members
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    className="rounded-2xl h-14 bg-primary/5 border-primary/10 px-6 text-lg font-bold"
                    value={profile.familyMembers}
                    onChange={(e) => handleUpdateProfile({ familyMembers: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-bold text-primary px-2">
                    <HeartPulse className="h-4 w-4 text-secondary" /> Health Conditions
                  </Label>
                  <Input
                    placeholder="e.g. Diabetic, Hypertension, Allergies..."
                    className="rounded-2xl h-14 bg-primary/5 border-primary/10 px-6"
                    value={profile.healthConditions.join(", ")}
                    onChange={(e) => handleUpdateProfile({ healthConditions: e.target.value.split(",").map(i => i.trim()) })}
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <Label className="flex items-center gap-2 font-bold text-primary px-2">
                    <ChefHat className="h-4 w-4 text-secondary" /> Dietary Preferences
                  </Label>
                  <Textarea
                    placeholder="e.g. Vegetarian, High Protein, Low Carb, No Spicy food..."
                    className="rounded-3xl min-h-[100px] bg-primary/5 border-primary/10 p-6"
                    value={profile.dietaryPreferences.join(", ")}
                    onChange={(e) => handleUpdateProfile({ dietaryPreferences: e.target.value.split(",").map(i => i.trim()) })}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="p-10 bg-gray-50 border-t flex gap-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-16 flex-1 rounded-full text-primary font-black uppercase text-xs tracking-widest">
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(ingredients, profile)}
              disabled={isGenerating || ingredients.length === 0}
              className="h-16 flex-[2] rounded-full bg-primary text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-[1.02] transition-all gap-4 ring-8 ring-primary/5"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  Designing Menu...
                </>
              ) : (
                <>
                  <ListChecks className="h-5 w-5" />
                  Generate Weekly Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
