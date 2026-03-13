"use client";

import { useState, useRef } from "react";
import { Camera, Plus, X, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface IngredientInputProps {
  onGenerate: (data: { photos: string[], text: string }) => void;
  isLoading: boolean;
}

export function IngredientInput({ onGenerate, isLoading }: IngredientInputProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-headline text-primary font-semibold flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Capture Ingredients
        </Label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
              <img src={photo} alt="Ingredient" className="object-cover w-full h-full" />
              <button 
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-all group"
            suppressHydrationWarning
          >
            <Plus className="h-8 w-8 text-primary/40 group-hover:text-primary/60" />
            <span className="text-xs text-muted-foreground mt-2">Add Photo</span>
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
          accept="image/*" 
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-headline text-primary font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Additional Ingredients (Text)
        </Label>
        <Input 
          placeholder="e.g. Garlic, onions, paprika, honey..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border-primary/20 focus-visible:ring-primary h-12"
          suppressHydrationWarning
        />
      </div>

      <Button 
        className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 transition-all rounded-xl shadow-md"
        onClick={() => onGenerate({ photos, text })}
        disabled={isLoading || (photos.length === 0 && !text.trim())}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full mr-2" />
            Analyzing Flavors...
          </>
        ) : (
          <>
            Generate Recipes
            <CheckCircle2 className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </div>
  );
}
