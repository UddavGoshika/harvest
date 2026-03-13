"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Plus, X, Upload, CheckCircle2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

interface IngredientInputProps {
  onGenerate: (data: { photos: string[], text: string }) => void;
  isLoading: boolean;
}

export function IngredientInput({ onGenerate, isLoading }: IngredientInputProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
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
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };
      getCameraPermission();
    } else {
      // Stop the stream when camera is inactive
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
        toast({
          title: "Photo Captured",
          description: "Ingredient added to the list.",
        });
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-primary/5 space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-2xl font-headline text-primary font-bold flex items-center gap-3">
            <Camera className="h-6 w-6 text-accent" />
            Visual Pantry
          </Label>
          <div className="flex gap-2">
            <Button 
              variant={isCameraActive ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsCameraActive(!isCameraActive)}
              className="rounded-full px-4"
              suppressHydrationWarning
            >
              {isCameraActive ? <X className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
              {isCameraActive ? "Close Camera" : "Use Camera"}
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full px-4"
              suppressHydrationWarning
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Camera Feed */}
        {isCameraActive && (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border-4 border-accent/20 group animate-in fade-in zoom-in duration-300">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              autoPlay 
              muted 
              playsInline
            />
            <div className="absolute bottom-6 inset-x-0 flex justify-center">
              <Button 
                onClick={capturePhoto}
                className="h-16 w-16 rounded-full bg-white text-primary hover:bg-white/90 shadow-2xl border-4 border-primary/10 transition-transform active:scale-95"
                suppressHydrationWarning
              >
                <div className="h-10 w-10 rounded-full border-2 border-primary/20" />
              </Button>
            </div>
            {hasCameraPermission === false && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 text-center">
                <Alert variant="destructive" className="max-w-xs">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>Please enable camera permissions in your settings.</AlertDescription>
                </Alert>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
        
        {/* Photo Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {photos.map((photo, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group hover:ring-2 ring-accent transition-all">
              <img src={photo} alt="Ingredient" className="object-cover w-full h-full" />
              <button 
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-destructive/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                suppressHydrationWarning
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {!isCameraActive && photos.length === 0 && (
            <div 
              onClick={() => setIsCameraActive(true)}
              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-xl bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <Camera className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-[10px] text-muted-foreground font-medium">Capture</span>
            </div>
          )}
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
        <Label className="text-xl font-headline text-primary font-bold flex items-center gap-3">
          <Plus className="h-6 w-6 text-accent" />
          Extra Items
        </Label>
        <Input 
          placeholder="What else is in your kitchen? (e.g. olive oil, sea salt, rosemary)" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border-primary/10 focus-visible:ring-accent h-14 text-lg px-6 rounded-2xl bg-muted/10"
          suppressHydrationWarning
        />
      </div>

      <Button 
        className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-white transition-all rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
        onClick={() => onGenerate({ photos, text })}
        disabled={isLoading || (photos.length === 0 && !text.trim())}
        suppressHydrationWarning
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-6 w-6 animate-spin mr-3" />
            Crafting Culinary Magic...
          </>
        ) : (
          <>
            Reveal My Recipes
            <CheckCircle2 className="ml-3 h-6 w-6 text-accent" />
          </>
        )}
      </Button>
    </div>
  );
}
