"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Github, Chrome, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

export function AuthModal() {
  const { isOpen, closeModal, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = {
      email: "chef@harvest.com",
      displayName: isLogin ? "Executive Chef" : "New Chef",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=chef",
      plan: "Free"
    };
    
    localStorage.setItem("harvest_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    closeModal();
    
    toast({
      title: isLogin ? "Welcome back!" : "Chef Profile Created!",
      description: "Ready to discover your next signature dish?",
    });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Transitioning to NextAuth for direct Client ID / Secret usage
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error: any) {
      console.error("Auth Error:", error);
      toast({
        title: "Auth Failed",
        description: "Could not initiate Google login.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-none shadow-[0_50px_100px_-20px_rgba(46,125,50,0.25)] rounded-[3.5rem] bg-white/95 backdrop-blur-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Side: Visual/Marketing */}
          <div className="hidden md:flex md:w-[40%] bg-primary relative p-12 flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-20">
                <div className="absolute h-full w-full bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_50%)] blur-[80px]" />
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_100%_100%,#66BB6A_0%,transparent_50%)] blur-[40px]" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="bg-white/10 w-fit p-3 rounded-2xl border border-white/20 backdrop-blur-md mb-8">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-4xl font-headline font-black text-white leading-[1.1] mb-6">
                Your Digital <br />
                <span className="text-secondary">Kitchen Brain</span> <br />
                Awaits.
              </h2>
              <p className="text-white/60 font-medium text-lg leading-relaxed max-w-[280px]">
                Save recipes, track pantry health, and generate AI blueprints for your market hauls.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="h-10 w-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-white font-bold text-sm">Synchronized Across Devices</p>
              </div>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                Ingredia Kitchen OS • v2.0
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-8 md:p-14 flex flex-col justify-center bg-white">
            <div className="max-w-[420px] mx-auto w-full space-y-8">
              <div className="text-center md:text-left space-y-3">
                <DialogTitle className="text-3xl md:text-4xl font-headline font-black text-primary leading-tight">
                  {isLogin ? "Welcome Back, Chef" : "Join the Elite Kitchen"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium text-lg">
                  {isLogin ? "Access your gourmet collection." : "Start your sustainable kitchen journey."}
                </DialogDescription>
              </div>

              <div className="space-y-6">
                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-full border-primary/10 bg-primary/5 hover:bg-primary/10 text-primary font-bold shadow-sm transition-all group overflow-hidden relative"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Chrome className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Continue with Google
                </Button>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-primary/5" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-primary/30">
                    <span className="bg-white px-4">Or Use Email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-4">Chef Name</Label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                        <Input 
                          placeholder="Your Name" 
                          className="h-14 pl-14 rounded-[1.25rem] border-primary/10 bg-primary/5 focus:bg-white text-base shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-4">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                      <Input 
                        type="email" 
                        placeholder="chef@harvest.com" 
                        className="h-14 pl-14 rounded-[1.25rem] border-primary/10 bg-primary/5 focus:bg-white text-base shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-4">Security Key</Label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 pl-14 rounded-[1.25rem] border-primary/10 bg-primary/5 focus:bg-white text-base shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white font-black uppercase tracking-widest text-xs group mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {isLogin ? "Authenticate Profile" : "Create My Account"}
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              <div className="text-center pt-4 border-t border-primary/5">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="group flex flex-col items-center gap-1 mx-auto"
                >
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    {isLogin ? "No account yet?" : "Already a member?"}
                  </span>
                  <span className="text-primary font-black uppercase text-xs tracking-widest border-b-2 border-primary/20 group-hover:border-primary transition-all pb-0.5">
                    {isLogin ? "Apply for access" : "Login to identity"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
