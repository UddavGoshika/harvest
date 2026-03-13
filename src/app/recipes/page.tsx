"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, ChevronRight, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "Indian Regional", "Global Fusion", "Quick & Easy", "Leftover Rescue", "Healthy Bites", "Vegetarian"
];

const ALL_RECIPES = [
  { name: "North Indian Paneer Tikka", category: "Indian Regional", time: "25 min", cal: 350, difficulty: "Medium", seed: "201", hint: "paneer tikka" },
  { name: "South Indian Sambar", category: "Indian Regional", time: "30 min", cal: 180, difficulty: "Easy", seed: "202", hint: "indian sambar" },
  { name: "Thai Basil Chicken", category: "Global Fusion", time: "15 min", cal: 420, difficulty: "Easy", seed: "203", hint: "thai chicken" },
  { name: "Quinoa Veggie Bowl", category: "Healthy Bites", time: "10 min", cal: 290, difficulty: "Easy", seed: "204", hint: "quinoa bowl" },
  { name: "Spinach & Cheese Pasta", category: "Quick & Easy", time: "15 min", cal: 450, difficulty: "Easy", seed: "205", hint: "spinach pasta" },
  { name: "Rescue Veggie Stir-fry", category: "Leftover Rescue", time: "12 min", cal: 210, difficulty: "Easy", seed: "206", hint: "vegetable stirfry" },
];

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredRecipes = activeCategory === "All" 
    ? ALL_RECIPES 
    : ALL_RECIPES.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F5F7F4]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <header className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-headline font-black text-primary leading-tight">
              Culinary <span className="text-secondary italic">Blueprint</span> Gallery
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl">
              Explore our vast library of AI-optimized recipes from across the globe and regional heartlands.
            </p>
          </header>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeCategory === "All" ? "default" : "outline"}
                onClick={() => setActiveCategory("All")}
                className="rounded-full px-6 h-10 font-bold"
                suppressHydrationWarning
              >
                All
              </Button>
              {CATEGORIES.map(cat => (
                <Button 
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full px-6 h-10 font-bold"
                  suppressHydrationWarning
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 rounded-full border-primary/10 h-10" placeholder="Search blueprints..." suppressHydrationWarning />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, idx) => (
              <Card key={idx} className="rounded-[2.5rem] overflow-hidden border-none shadow-lg group hover:shadow-2xl transition-all cursor-pointer bg-white">
                <div className="aspect-[16/10] overflow-hidden relative">
                   <img 
                     src={`https://picsum.photos/seed/${recipe.seed}/800/500`} 
                     alt={recipe.name} 
                     className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                     data-ai-hint={recipe.hint}
                   />
                   <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-white/95 text-primary border-none text-[10px] font-black px-3 py-1 rounded-full">
                        {recipe.category}
                      </Badge>
                   </div>
                </div>
                <CardHeader className="p-6">
                   <CardTitle className="text-2xl font-headline font-bold text-primary group-hover:text-secondary transition-colors">{recipe.name}</CardTitle>
                   <div className="flex items-center gap-4 text-[11px] font-black uppercase text-muted-foreground mt-3 tracking-widest">
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-secondary" /> {recipe.time}</span>
                      <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-secondary" /> {recipe.cal} Cal</span>
                      <span className="ml-auto flex items-center gap-1 text-primary"><Filter className="h-3 w-3" /> {recipe.difficulty}</span>
                   </div>
                </CardHeader>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button variant="ghost" className="w-full rounded-full border border-primary/10 hover:bg-primary/5 text-xs font-black uppercase tracking-widest" suppressHydrationWarning>
                    View Blueprint <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </main>
      
      <footer className="bg-primary py-12 mt-20 text-white rounded-t-[5rem]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest">Ingredia AI Kitchen OS &copy; 2024</p>
        </div>
      </footer>
    </div>
  );
}