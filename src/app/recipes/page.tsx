"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, ChevronRight, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RecipeDetail } from "@/components/recipe-detail";

const CATEGORIES = [
  "Indian Regional", "Global Fusion", "Quick & Easy", "Leftover Rescue", "Healthy Bites", "Vegetarian", "Desserts"
];

const ALL_RECIPES = [
  { 
    recipeName: "North Indian Paneer Tikka", 
    category: "Indian Regional", 
    estimatedPrepTime: "25 min", 
    nutrition: { calories: 350, protein: "18g", carbs: "12g", fat: "22g" },
    difficultyLevel: "Medium", 
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800",
    description: "Classic marinated paneer cubes grilled to perfection with aromatic spices."
  },
  { 
    recipeName: "South Indian Sambar", 
    category: "Indian Regional", 
    estimatedPrepTime: "30 min", 
    nutrition: { calories: 180, protein: "8g", carbs: "32g", fat: "4g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=800",
    description: "Hearty lentil-based vegetable stew with tamarind and unique spices."
  },
  { 
    recipeName: "Thai Basil Chicken", 
    category: "Global Fusion", 
    estimatedPrepTime: "15 min", 
    nutrition: { calories: 420, protein: "35g", carbs: "12g", fat: "26g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800",
    description: "Spicy and fragrant stir-fry with holy basil and tender chicken."
  },
  { 
    recipeName: "Quinoa Veggie Bowl", 
    category: "Healthy Bites", 
    estimatedPrepTime: "10 min", 
    nutrition: { calories: 290, protein: "12g", carbs: "45g", fat: "8g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    description: "Nutritious power bowl with fluffy quinoa and seasonal vegetables."
  },
  { 
    recipeName: "Spinach & Cheese Pasta", 
    category: "Quick & Easy", 
    estimatedPrepTime: "15 min", 
    nutrition: { calories: 450, protein: "15g", carbs: "58g", fat: "18g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800",
    description: "Creamy fettuccine with fresh spinach and a blend of gourmet cheeses."
  },
  { 
    recipeName: "Rescue Veggie Stir-fry", 
    category: "Leftover Rescue", 
    estimatedPrepTime: "12 min", 
    nutrition: { calories: 210, protein: "6g", carbs: "28g", fat: "10g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?q=80&w=800",
    description: "A quick way to rescue any vegetables in your fridge into a tasty stir-fry."
  },
  { 
    recipeName: "Hyderabadi Chicken Biryani", 
    category: "Indian Regional", 
    estimatedPrepTime: "50 min", 
    nutrition: { calories: 650, protein: "42g", carbs: "75g", fat: "22g" },
    difficultyLevel: "Hard", 
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800",
    description: "Iconic slow-cooked rice dish with marinated chicken and saffron."
  },
  { 
    recipeName: "Classic Italian Margherita", 
    category: "Global Fusion", 
    estimatedPrepTime: "20 min", 
    nutrition: { calories: 550, protein: "22g", carbs: "68g", fat: "24g" },
    difficultyLevel: "Medium", 
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?q=80&w=800",
    description: "Simple yet perfect pizza with tomato, fresh mozzarella, and basil."
  },
  { 
    recipeName: "Japanese Miso Ramen", 
    category: "Global Fusion", 
    estimatedPrepTime: "35 min", 
    nutrition: { calories: 480, protein: "25g", carbs: "62g", fat: "16g" },
    difficultyLevel: "Medium", 
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800",
    description: "Comforting noodle soup with rich miso broth and traditional toppings."
  },
];

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

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
              Culinary <span className="text-secondary italic"> Recipes</span> 
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl">
              Explore our vast library of AI-optimized recipes from across the globe and regional heartlands. Launched over 4 months ago, our gallery features thousands of curated blueprints.
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
              <Card 
                key={idx} 
                className="rounded-[2.5rem] overflow-hidden border-none shadow-lg group hover:shadow-2xl transition-all cursor-pointer bg-white"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                   <img 
                     src={recipe.imageUrl} 
                     alt={recipe.recipeName} 
                     className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-white/95 text-primary border-none text-[10px] font-black px-3 py-1 rounded-full">
                        {recipe.category}
                      </Badge>
                   </div>
                </div>
                <CardHeader className="p-6">
                   <CardTitle className="text-2xl font-headline font-bold text-primary group-hover:text-secondary transition-colors">
                     {recipe.recipeName}
                   </CardTitle>
                   <div className="flex items-center gap-4 text-[11px] font-black uppercase text-muted-foreground mt-3 tracking-widest">
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-secondary" /> {recipe.estimatedPrepTime}</span>
                      <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-secondary" /> {recipe.nutrition.calories} Cal</span>
                      <span className="ml-auto flex items-center gap-1 text-primary"><Filter className="h-3 w-3" /> {recipe.difficultyLevel}</span>
                   </div>
                </CardHeader>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button 
                    variant="ghost" 
                    className="w-full rounded-full border border-primary/10 hover:bg-primary/5 text-xs font-black uppercase tracking-widest"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecipe(recipe);
                    }}
                    suppressHydrationWarning
                  >
                    View Blueprint <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {selectedRecipe && (
            <RecipeDetail 
              recipe={selectedRecipe} 
              onClose={() => setSelectedRecipe(null)} 
              availableIngredients={[]}
            />
          )}

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
