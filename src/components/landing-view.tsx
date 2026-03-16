"use client";

import { useState, useEffect } from "react";
import {
  Plus, ArrowRight, Sparkles, ChefHat,
  Clock, Flame, CheckCircle2, Search,
  Zap, Brain, Leaf, Monitor, Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-store";

export function LandingView({ onStart }: { onStart: () => void }) {
  const [demoStep, setDemoStep] = useState(1);
  const [showRecipe, setShowRecipe] = useState(false);
  const { openModal, user } = useAuth();

  // Animated flow for the demo section (Sequential Sequence)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const runSequence = () => {
      setDemoStep(1);
      setShowRecipe(false);

      // Step 2: Draw Arrow 1 (1s)
      timer = setTimeout(() => setDemoStep(2), 1000);

      // Step 3: AI Thinking (1s)
      timer = setTimeout(() => setDemoStep(3), 2500);

      // Step 4: Draw Arrow 2 (1s)
      timer = setTimeout(() => setDemoStep(4), 4000);

      // Step 5: Final Result - Arrows vanish, Recipe stays
      timer = setTimeout(() => {
        setDemoStep(5);
        setShowRecipe(true);
      }, 5500);
    };

    runSequence();
    const interval = setInterval(runSequence, 8000); // Repeat every 8 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const resetDemo = () => {
    setDemoStep(1);
    setShowRecipe(false);
  };

  return (
    <div className="space-y-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-10 md:pt-20">
        {/* Floating Ingredient Chips */}
        <FloatingChip emoji="🥚" name="Eggs" className="top-20 left-[10%] animate-float-slow delay-100" />
        <FloatingChip emoji="🍅" name="Tomato" className="top-40 right-[15%] animate-float-fast delay-300" />
        <FloatingChip emoji="🥑" name="Avocado" className="top-[60%] left-[2%] animate-float-slow delay-700" />
        <FloatingChip emoji="🥕" name="Carrot" className="top-[75%] right-[5%] animate-float-fast delay-100" />
        <FloatingChip emoji="🧀" name="Cheese" className="bottom-22 left-[15%] animate-float-fast delay-200" />
        <FloatingChip emoji="🌿" name="Basil" className="bottom-40 right-[10%] animate-float-slow delay-500" />
        <FloatingChip emoji="🧅" name="Onion" className="top-[10%] right-[30%] animate-float-slow delay-1000" />
        <FloatingChip emoji="🌶️" name="Chili" className="bottom-[2%] left-[30%] animate-float-fast delay-300" />
        <FloatingChip emoji="🥦" name="Broccoli" className="top-[17%] left-[25%] animate-float-slow delay-150" />
        <FloatingChip emoji="🍗" name="Chicken" className="top-[50%] right-[35%] animate-float-fast delay-500" />
        <FloatingChip emoji="🍄" name="Mushroom" className="bottom-[25%] right-[45%] animate-float-slow delay-700" />
        <FloatingChip emoji="🧄" name="Garlic" className="top-[15%] left-[40%] animate-float-fast delay-200" />
        <FloatingChip emoji="🥓" name="Bacon" className="bottom-[5%] left-[50%] animate-float-slow delay-1000" />
        <FloatingChip emoji="🍤" name="Shrimp" className="top-[80%] left-[35%] animate-float-fast delay-400" />
        <FloatingChip emoji="🍋" name="Lemon" className="top-[5%] right-[45%] animate-float-slow delay-600" />
        <FloatingChip emoji="🥔" name="Potato" className="bottom-[55%] left-[35%] animate-float-fast delay-800" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Content */}
          <div className="space-y-8 animate-slide-up text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-bold text-xs tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              AI-Powered Gastronomy
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight leading-[1.1] text-primary">
              Turn Your Ingredients <br />
              Into <span className="text-secondary">Delicious Recipes</span> Instantly
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              Upload ingredients from your fridge and let AI generate complete recipes with steps, nutrition, and cooking time.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Button
                onClick={onStart}
                className="h-16 px-10 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl hover:-translate-y-1 transition-all group uppercase tracking-widest"
              >
                Generate Recipe For free 🍜
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
              {!user && (
                <Button
                  variant="outline"
                  onClick={openModal}
                  className="h-16 px-10 text-lg font-black border-primary/10 text-primary rounded-full hover:bg-primary/5 transition-all uppercase tracking-widest"
                >
                  Join Community
                </Button>
              )}
            </div>
          </div>

          {/* Right Side: Interactive Product Demo Card */}
          <div className="relative animate-fade-in delay-300 px-4 md:px-0">
            <div className="relative glass-card rounded-[3rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(46,125,50,0.15)] border-primary/5 overflow-hidden group">
              {/* Fake UI: Ingredient Input */}
              <div className="space-y-6">
                {/* Animated Hand-Drawn Arrows */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 500" preserveAspectRatio="none">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orientation="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#2E7D32" fillOpacity="0.6" />
                    </marker>
                    <marker id="arrowhead-short" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <path d="M0,0 L8,3.5 L0,7" stroke="#2E7D32" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </marker>
                    <clipPath id="clip-arrow-1">
                      <rect x="0" y="0" width={demoStep >= 2 ? "250" : "0"} height="250" className="transition-all duration-1000" />
                    </clipPath>
                    <clipPath id="clip-arrow-2">
                      <rect x="250" y="0" width={demoStep >= 4 ? "250" : "0"} height="500" className="transition-all duration-1000" />
                    </clipPath>
                  </defs>

                  {/* Arrow 1: Eggs to AI Left Side */}
                  <path
                    d="M 60,120 C 60,160 100,180 170,180"
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="8 8"
                    markerEnd="url(#arrowhead)"
                    clipPath="url(#clip-arrow-1)"
                    className={`transition-opacity duration-500 ${demoStep >= 2 && demoStep < 5 ? 'opacity-60' : 'opacity-0'}`}
                  />

                  {/* Arrow 2: AI Right Side to Recipe Card Side */}
                  <path
                    d="M 330,180 C 450,180 460,250 460,260"
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="8 8"
                    markerEnd="url(#arrowhead-short)"
                    clipPath="url(#clip-arrow-2)"
                    className={`transition-opacity duration-500 ${demoStep >= 4 && demoStep < 5 ? 'opacity-60' : 'opacity-0'}`}
                  />
                </svg>

                <div className="flex items-center justify-between relative z-20">
                  <h3 className="text-lg font-headline font-bold">Your Ingredients</h3>
                  <Badge className="bg-primary/10 text-primary border-none">4 Items</Badge>
                </div>
                <div className="flex flex-wrap gap-3 relative z-20">
                  {['Eggs', 'Tomato', 'Cheese', 'Basil'].map((item, idx) => (
                    <Badge
                      key={item}
                      className={`bg-primary/5 text-primary border-primary/10 px-4 py-2 rounded-full transition-all duration-500 opacity-100`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      {item}
                    </Badge>
                  ))}
                  <div className="h-9 w-24 rounded-full border border-dashed border-primary/20 flex items-center justify-center text-xs text-primary/40">
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </div>
                </div>

                {/* AI Badge Animation */}
                <div className="py-8 flex justify-center relative z-20">
                  <div
                    className={`relative transition-all duration-1000 ${demoStep >= 2 ? "opacity-100 scale-110" : "opacity-0 scale-90"
                      }`}
                  >
                    {/* Glow Animation */}
                    <div className={`absolute inset-0 bg-primary/20 rounded-full blur-2xl ${demoStep === 3 ? 'animate-pulse' : 'opacity-0'}`} />

                    {/* AI Badge */}
                    <div className={`relative bg-white px-6 py-3 rounded-full shadow-xl border border-primary/5 flex items-center justify-center gap-2 ${demoStep === 3 ? 'ring-2 ring-primary/20' : ''}`}>
                      <Brain className={`h-8 w-8 text-primary ${demoStep === 3 ? 'animate-bounce' : ''}`} />
                      <span className="font-semibold text-sm">Ingredia AI</span>
                    </div>
                  </div>
                </div>

                {/* AI Generated Recipe Card Fake */}
                <div className={`transition-all duration-700 ${demoStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-primary/5 flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 aspect-square md:aspect-auto relative">
                      <img
                        src="/demo-recipe.png"
                        alt="Gourmet Caprese Eggs"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:p-8 space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-secondary/20 text-secondary border-none text-[10px] font-black uppercase">Low Carb</Badge>
                        <div className="flex gap-4 text-[10px] font-black text-muted-foreground uppercase">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 10m</span>
                          <span className="flex items-center gap-1"><Utensils className="h-3 w-3" /> Easy</span>
                        </div>
                      </div>
                      <h4 className="text-xl md:text-2xl font-headline font-bold">Gourmet Caprese Eggs</h4>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Steps Preview:</p>
                        <ul className="text-[11px] text-muted-foreground space-y-1">
                          <li className="flex items-center gap-2"><div className="h-1 w-1 bg-secondary rounded-full" /> Whisk eggs with fresh basil</li>
                          <li className="flex items-center gap-2"><div className="h-1 w-1 bg-secondary rounded-full" /> Sauté tomatoes until blistered</li>
                          <li className="flex items-center gap-2"><div className="h-1 w-1 bg-secondary rounded-full" /> Fold in mozzarella until melted</li>
                        </ul>
                      </div>
                      <div className="pt-4 flex items-center justify-between border-t border-primary/5">
                        <div className="flex items-center gap-1 text-primary">
                          <Flame className="h-4 w-4" />
                          <span className="text-xs font-black">320 CAL</span>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold text-primary">View Full Recipe <ArrowRight className="ml-2 h-3 w-3" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-secondary/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute -bottom-10 -left-10 h-60 w-60 bg-primary/20 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* AI Demo Section */}

      {/* Available Features Section */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 mb-20 animate-fade-in text-center">
          <Badge className="bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">Core Capabilities</Badge>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-primary">Available Features</h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto italic">Everything you need to master your kitchen with the power of intelligence.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Sparkles className="h-8 w-8" />}
            title="AI Recipe Engine"
            description="Generate unique, gourmet recipes tailored specifically to the ingredients you already have."
            color="bg-blue-500/10 text-blue-600"
          />
          <FeatureCard
            icon={<Search className="h-8 w-8" />}
            title="Visual Recognition"
            description="Simply snap a photo of your fridge and let our AI identify and catalog every ingredient."
            color="bg-purple-500/10 text-purple-600"
          />
          <FeatureCard
            icon={<Leaf className="h-8 w-8" />}
            title="Smart Pantry"
            description="Intelligent tracking of your inventory with shelf-life alerts and expiration warnings."
            color="bg-emerald-500/10 text-emerald-600"
          />
          <FeatureCard
            icon={<ChefHat className="h-8 w-8" />}
            title="Weekly Planner"
            description="Effortlessly plan your entire week's meals and generate schedules in seconds."
            color="bg-orange-500/10 text-orange-600"
          />
          <FeatureCard
            icon={<Flame className="h-8 w-8" />}
            title="Nutrition Insights"
            description="Deep analytics on calories, macronutrients, and health benefits for every generated dish."
            color="bg-rose-500/10 text-rose-600"
          />
          <FeatureCard
            icon={<Monitor className="h-8 w-8" />}
            title="Kitchen Analytics"
            description="Track your cooking habits, monitor waste reduction, and optimize your grocery spending."
            color="bg-indigo-500/10 text-indigo-600"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12">
          <HowItWorksCard
            icon={<Search className="h-10 w-10" />}
            title="Add Ingredients"
            description="Enter ingredients or upload a fridge photo."
            step="01"
          />
          <HowItWorksCard
            icon={<Brain className="h-10 w-10" />}
            title="AI Analyzes"
            description="AI finds the best flavor combinations."
            step="02"
          />
          <HowItWorksCard
            icon={<Zap className="h-10 w-10" />}
            title="Get Recipe Instantly"
            description="Complete recipe with steps, nutrition, and cooking time."
            step="03"
          />
        </div>
      </section>
    </div>
  );
}

function HowItWorksCard({ icon, title, description, step }: { icon: React.ReactNode, title: string, description: string, step: string }) {
  return (
    <Card className="group relative border-none bg-white/50 hover:bg-white transition-all duration-500 rounded-[3rem] p-4 pt-12 shadow-sm hover:shadow-2xl hover:-translate-y-2 min-h-[300px] flex flex-col justify-center text-center">
      <div className="absolute top-8 left-10 text-5xl font-black text-primary/50 group-hover:text-primary/100 transition-colors uppercase tracking-widest">{step}</div>
      <CardHeader className="space-y-4">
        <div className="mx-auto bg-primary/5 p-6 rounded-[2rem] text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 scale-110 group-hover:scale-100">
          {icon}
        </div>
        <CardTitle className="text-2xl font-headline font-bold">{title}</CardTitle>
        <CardDescription className="text-lg font-medium leading-relaxed px-4">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function FloatingChip({ emoji, name, className }: { emoji: string, name: string, className: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`absolute z-20 hidden lg:block transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Badge
        className="bg-white/90 backdrop-blur-md shadow-xl border-primary/5 px-4 py-2 rounded-full flex gap-2 items-center text-sm font-bold transition-all duration-300 whitespace-nowrap"
      >
        <span>{emoji}</span>
        <span className={`transition-all duration-300 overflow-hidden ${isHovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}`}>
          {name}
        </span>
      </Badge>
    </div>
  );
}
function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <Card className="group border-none bg-white/40 backdrop-blur-md hover:bg-white transition-all duration-500 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 border border-primary/5">
      <CardHeader className="space-y-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${color}`}>
          {icon}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-headline font-bold">{title}</CardTitle>
          <CardDescription className="text-base font-medium leading-relaxed text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-1.5 w-12 bg-primary/10 rounded-full group-hover:w-full group-hover:bg-primary/20 transition-all duration-500" />
      </CardContent>
    </Card>
  );
}
