"use client";

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth-store";
import { User, Shield, CreditCard, Settings, Loader2, CheckCircle2, Globe, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { Suspense } from "react";

function SettingsContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "account";
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Local state for form fields
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    bio: "Passionate gourmet explorer.",
    notifications: true,
    newsletter: false,
    language: "English"
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        displayName: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleSave = async (section: string) => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (user && section === 'account') {
      const updatedUser = {
        ...user,
        displayName: profileData.displayName,
        email: profileData.email
      };
      setUser(updatedUser);
      localStorage.setItem("harvest_user", JSON.stringify(updatedUser));
    }
    
    setIsSaving(false);
    toast({
      title: "Settings Updated",
      description: `Your ${section} changes have been saved successfully.`
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Navbar />
        <Card className="max-w-md w-full border-primary/10 shadow-2xl rounded-[2.5rem] p-8 text-center space-y-6">
          <div className="h-16 w-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-headline font-black uppercase tracking-tighter">Chef Profile Required</h1>
          <p className="text-muted-foreground font-medium">Please login to access your kitchen laboratory settings.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-12">
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-1 w-12 bg-primary rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Kitchen Intelligence</span>
          </div>
          <h1 className="text-5xl font-headline font-black text-primary tracking-tighter leading-none">
            CENTRAL <span className="text-secondary">SETTINGS</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl">
            Configure your digital kitchen brain, manage subscription layers, and calibrate your gourmet security protocols.
          </p>
        </header>

        <Tabs defaultValue={defaultTab} className="space-y-12">
          <TabsList className="bg-white/50 backdrop-blur-xl border border-primary/5 p-1.5 rounded-[2rem] h-16 w-full lg:w-fit overflow-x-auto no-scrollbar">
            <TabsTrigger value="account" className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all gap-2">
              <Settings className="h-4 w-4" /> Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="plan" className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all gap-2">
              <CreditCard className="h-4 w-4" /> Plan
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-primary/5 bg-white/70 backdrop-blur-xl shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-2xl font-headline font-bold">Profile Identity</CardTitle>
                  <CardDescription className="text-base">This is how other chefs will see you in the community.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Full Name</Label>
                      <Input 
                        value={profileData.displayName} 
                        onChange={e => setProfileData({...profileData, displayName: e.target.value})}
                        className="h-14 px-6 rounded-2xl bg-primary/5 border-none focus:bg-white transition-all text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Email Address</Label>
                      <Input 
                        value={profileData.email} 
                        onChange={e => setProfileData({...profileData, email: e.target.value})}
                        className="h-14 px-6 rounded-2xl bg-primary/5 border-none focus:bg-white transition-all text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Chef Bio</Label>
                    <textarea 
                      value={profileData.bio}
                      onChange={e => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full h-32 p-6 rounded-[2rem] bg-primary/5 border-none focus:bg-white transition-all text-base outline-none resize-none"
                    />
                  </div>
                  <Button 
                    onClick={() => handleSave('account')} 
                    disabled={isSaving}
                    className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Store Profile Data"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/5 bg-primary relative overflow-hidden rounded-[3rem] p-10 flex flex-col justify-between group">
                <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] opacity-20 transition-transform group-hover:scale-110 duration-1000">
                  <div className="absolute h-full w-full bg-[radial-gradient(circle_at_100%_0%,#fff_0%,transparent_50%)] blur-[80px]" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="h-24 w-24 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Chef" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white text-2xl font-headline font-black leading-tight uppercase tracking-tighter">
                      {user.displayName || 'Chef'}
                    </h3>
                    <p className="text-white/60 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="bg-white/10 px-6 py-3 rounded-full border border-white/10 flex items-center justify-between">
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Active Plan</span>
                    <span className="text-white font-black text-xs uppercase tracking-tighter">{user.plan || 'Free'}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
            <Card className="border-primary/5 bg-white/70 backdrop-blur-xl shadow-2xl rounded-[3rem] max-w-4xl">
              <CardHeader className="p-10">
                <CardTitle className="text-2xl font-headline font-bold">Kitchen Preferences</CardTitle>
                <CardDescription>Customize your recipe intelligence and notification alerts.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/5">
                    <div className="space-y-1">
                      <p className="font-bold text-primary">Recipe Notifications</p>
                      <p className="text-sm text-muted-foreground">Get alerted when AI discovers a new recipe for your pantry.</p>
                    </div>
                    <Switch 
                      checked={profileData.notifications} 
                      onCheckedChange={v => setProfileData({...profileData, notifications: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/5">
                    <div className="space-y-1">
                      <p className="font-bold text-primary">Market Haul Newsletter</p>
                      <p className="text-sm text-muted-foreground">Weekly analytics of your ingredients and nutritional health.</p>
                    </div>
                    <Switch 
                      checked={profileData.newsletter} 
                      onCheckedChange={v => setProfileData({...profileData, newsletter: v})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">System Language</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["English", "Hindi", "Telugu", "Tamil"].map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setProfileData({...profileData, language: lang})}
                        className={`h-14 rounded-2xl font-bold transition-all border ${profileData.language === lang ? 'bg-primary text-white border-primary' : 'bg-primary/5 text-primary border-transparent hover:bg-primary/10'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleSave('preferences')} 
                  disabled={isSaving}
                  className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
              <Card className="border-primary/5 bg-white/70 backdrop-blur-xl shadow-2xl rounded-[3rem]">
                <CardHeader className="p-10">
                  <CardTitle className="text-2xl font-headline font-bold">Chef Access Key</CardTitle>
                  <CardDescription>Rotate your security key for account protection.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Current Key</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 px-6 rounded-2xl bg-primary/5 border-none focus:bg-white text-base" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">New Access Key</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 px-6 rounded-2xl bg-primary/5 border-none focus:bg-white text-base" />
                  </div>
                  <Button 
                    onClick={() => handleSave('security')} 
                    disabled={isSaving}
                    className="h-14 w-full rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    Update Key
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/5 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[3rem] border-dashed border-2 flex flex-col items-center justify-center p-10 text-center space-y-6">
                <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                  <Shield className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-headline font-black uppercase tracking-tighter">Two-Factor Authentication</h3>
                  <p className="text-muted-foreground text-sm font-medium">Add an extra layer of gourmet security to your kitchen OS.</p>
                </div>
                <Button variant="outline" className="h-12 px-8 rounded-full border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
                  Enable 2FA
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
            <div className="max-w-4xl space-y-8">
              <Card className="border-primary/5 bg-white/70 backdrop-blur-xl shadow-2xl rounded-[3rem] p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10">
                  <div className="bg-secondary/20 text-secondary font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-secondary/20">
                    Active Status
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-headline font-black text-primary tracking-tighter uppercase leading-none">
                      Current Plan: <span className="text-secondary">{user.plan || 'Free'}</span> Explorer
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Your subscription is currently in a manual management state.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/5 space-y-3">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Globe className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-primary">50 AI Blueprints</p>
                      <p className="text-xs text-muted-foreground">Monthly recipe generation quota.</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/5 space-y-3">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-primary">Standard Support</p>
                      <p className="text-xs text-muted-foreground">Email-based gourmet consulting.</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/5 space-y-3">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Bell className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-primary">Local Storage</p>
                      <p className="text-xs text-muted-foreground">Basic pantry health tracking.</p>
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <Button className="h-16 px-12 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                      Upgrade to Executive Chef
                    </Button>
                    <Button variant="outline" className="h-16 px-12 rounded-full border-primary/10 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary/5">
                      Cancel Manual Access
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="bg-primary/5 p-8 rounded-[3rem] border border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <CreditCard className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-headline font-black text-xl text-primary leading-none uppercase tracking-tighter mb-1">Payment Method</h4>
                    <p className="text-muted-foreground text-sm font-medium">VISA ending in 4242 • Expires 12/26</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary/5 rounded-full px-6">
                  Update
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <SettingsContent />
    </Suspense>
  )
}
