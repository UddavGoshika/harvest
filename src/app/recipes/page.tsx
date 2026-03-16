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
    description: "Classic marinated paneer cubes grilled to perfection with aromatic spices.",
    details: {
      estimatedPrepTime: "25 min",
      difficultyLevel: "Medium",
      nutritionalInformation: "350 kcal. High protein and calcium from fresh paneer.",
      ingredients: [
        { name: "Paneer cubes", quantity: "250g", isAvailable: true },
        { name: "Hung curd", quantity: "1/2 cup", isAvailable: true },
        { name: "Ginger-garlic paste", quantity: "1 tbsp", isAvailable: true },
        { name: "Kashmiri red chili powder", quantity: "1 tsp", isAvailable: true },
        { name: "Garam masala", quantity: "1/2 tsp", isAvailable: true },
        { name: "Kasuri methi", quantity: "1 tsp", isAvailable: true }
      ],
      instructions: [
        "Whisk the hung curd with all spices and ginger-garlic paste to make a smooth marinade.",
        "Add paneer cubes to the marinade and coat them gently. Let it rest for 30 minutes.",
        "Thread the paneer onto skewers, alternating with bell peppers and onions if desired.",
        "Grill in a preheated oven or over a tawa until charred and golden on all sides.",
        "Squeeze fresh lemon juice and sprinkle chaat masala before serving."
      ]
    }
  },
  { 
    recipeName: "South Indian Sambar", 
    category: "Indian Regional", 
    estimatedPrepTime: "30 min", 
    nutrition: { calories: 180, protein: "8g", carbs: "32g", fat: "4g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=800",
    description: "Hearty lentil-based vegetable stew with tamarind and unique spices.",
    details: {
      estimatedPrepTime: "30 min",
      difficultyLevel: "Easy",
      nutritionalInformation: "180 kcal. Rich in iron and dietary fiber from lentils.",
      ingredients: [
        { name: "Toor dal", quantity: "1/2 cup", isAvailable: true },
        { name: "Sambar powder", quantity: "2 tbsp", isAvailable: true },
        { name: "Tamarind paste", quantity: "1 tsp", isAvailable: true },
        { name: "Mixed vegetables", quantity: "1 cup", isAvailable: true },
        { name: "Mustard seeds", quantity: "1/2 tsp", isAvailable: true },
        { name: "Curry leaves", quantity: "1 sprig", isAvailable: true }
      ],
      instructions: [
        "Pressure cook toor dal with a pinch of turmeric until soft.",
        "In a pot, boil vegetables with sambar powder, tamarind, and salt until tender.",
        "Add the cooked dal and simmer for 5-7 minutes.",
        "For tempering: Heat oil, add mustard seeds, red chilies, and curry leaves.",
        "Pour the tempering over the sambar and garnish with fresh cilantro."
      ]
    }
  },
  { 
    recipeName: "Thai Basil Chicken", 
    category: "Global Fusion", 
    estimatedPrepTime: "15 min", 
    nutrition: { calories: 420, protein: "35g", carbs: "12g", fat: "26g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800",
    description: "Spicy and fragrant stir-fry with holy basil and tender chicken.",
    details: {
      estimatedPrepTime: "15 min",
      difficultyLevel: "Easy",
      nutritionalInformation: "420 kcal. High in lean protein from chicken breast.",
      ingredients: [
        { name: "Minced chicken", quantity: "300g", isAvailable: true },
        { name: "Holy basil leaves", quantity: "1 cup", isAvailable: true },
        { name: "Bird's eye chilies", quantity: "3-4", isAvailable: true },
        { name: "Soy sauce", quantity: "1 tbsp", isAvailable: true },
        { name: "Oyster sauce", quantity: "1 tbsp", isAvailable: true },
        { name: "Garlic", quantity: "4 cloves", isAvailable: true }
      ],
      instructions: [
        "Pound garlic and chilies together in a mortar and pestle.",
        "Heat oil in a wok and stir-fry the garlic-chili paste until fragrant.",
        "Add chicken and stir-fry until mostly cooked.",
        "Add soy sauce, oyster sauce, and a pinch of sugar. Toss well.",
        "Add basil leaves and stir-fry for 30 seconds until wilted. Serve with jasmine rice."
      ]
    }
  },
  { 
    recipeName: "Quinoa Veggie Bowl", 
    category: "Healthy Bites", 
    estimatedPrepTime: "10 min", 
    nutrition: { calories: 290, protein: "12g", carbs: "45g", fat: "8g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    description: "Nutritious power bowl with fluffy quinoa and seasonal vegetables.",
    details: {
      estimatedPrepTime: "10 min",
      difficultyLevel: "Easy",
      nutritionalInformation: "290 kcal. Complete protein and magnesium from quinoa.",
      ingredients: [
        { name: "Cooked quinoa", quantity: "1 cup", isAvailable: true },
        { name: "Cherry tomatoes", quantity: "1/2 cup", isAvailable: true },
        { name: "Cucumber", quantity: "1/2", isAvailable: true },
        { name: "Chickpeas", quantity: "1/4 cup", isAvailable: true },
        { name: "Lemon vinaigrette", quantity: "2 tbsp", isAvailable: true }
      ],
      instructions: [
        "Mix cooked quinoa with chickpeas in a large bowl.",
        "Add halved cherry tomatoes and diced cucumber.",
        "Drizzle with lemon vinaigrette and toss gently.",
        "Top with fresh parsley or mint for extra freshness.",
        "Serve chilled or at room temperature for a quick healthy meal."
      ]
    }
  },
  { 
    recipeName: "Spinach & Cheese Pasta", 
    category: "Quick & Easy", 
    estimatedPrepTime: "15 min", 
    nutrition: { calories: 450, protein: "15g", carbs: "58g", fat: "18g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800",
    description: "Creamy fettuccine with fresh spinach and a blend of gourmet cheeses.",
    details: {
      estimatedPrepTime: "15 min",
      difficultyLevel: "Easy",
      nutritionalInformation: "450 kcal. Source of calcium and iron from spinach.",
      ingredients: [
        { name: "Pasta (Fettuccine)", quantity: "200g", isAvailable: true },
        { name: "Fresh spinach", quantity: "2 cups", isAvailable: true },
        { name: "Heavy cream", quantity: "1/2 cup", isAvailable: true },
        { name: "Parmesan cheese", quantity: "1/4 cup", isAvailable: true },
        { name: "Garlic", quantity: "2 cloves", isAvailable: true }
      ],
      instructions: [
        "Boil pasta in salted water until al dente.",
        "Sauté minced garlic in butter, add fresh spinach until wilted.",
        "Pour in cream and cheese, simmering until slightly thickened.",
        "Toss the cooked pasta into the sauce until well coated.",
        "Serve hot with a sprinkle of red chili flakes."
      ]
    }
  },
  { 
    recipeName: "Rescue Veggie Stir-fry", 
    category: "Leftover Rescue", 
    estimatedPrepTime: "12 min", 
    nutrition: { calories: 210, protein: "6g", carbs: "28g", fat: "10g" },
    difficultyLevel: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?q=80&w=800",
    description: "A quick way to rescue any vegetables in your fridge into a tasty stir-fry.",
    details: {
      estimatedPrepTime: "12 min",
      difficultyLevel: "Easy",
      nutritionalInformation: "210 kcal. Low calorie and high in vitamins.",
      ingredients: [
        { name: "Assorted leftover veggies", quantity: "2 cups", isAvailable: true },
        { name: "Soy sauce", quantity: "1 tbsp", isAvailable: true },
        { name: "Ginger paste", quantity: "1 tsp", isAvailable: true },
        { name: "Sesame seeds", quantity: "for garnish", isAvailable: true }
      ],
      instructions: [
        "Slice all your leftover vegetables into thin, uniform strips.",
        "Heat a wok on high heat and add a dash of oil.",
        "Quickly sauté all veggies with ginger for 3-4 minutes.",
        "Add soy sauce and toss until all vegetables are glazed.",
        "Serve immediately over rice or as is, topped with sesame seeds."
      ]
    }
  },
  { 
    recipeName: "Hyderabadi Chicken Biryani", 
    category: "Indian Regional", 
    estimatedPrepTime: "50 min", 
    nutrition: { calories: 650, protein: "42g", carbs: "75g", fat: "22g" },
    difficultyLevel: "Hard", 
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800",
    description: "Iconic slow-cooked rice dish with marinated chicken and saffron.",
    details: {
      estimatedPrepTime: "50 min",
      difficultyLevel: "Hard",
      nutritionalInformation: "650 kcal. A rich, high-protein celebratory meal.",
      ingredients: [
        { name: "Basmati rice", quantity: "2 cups", isAvailable: true },
        { name: "Chicken pieces", quantity: "500g", isAvailable: true },
        { name: "Fried onions (Birista)", quantity: "1/2 cup", isAvailable: true },
        { name: "Saffron milk", quantity: "2 tbsp", isAvailable: true },
        { name: "Biryani masala", quantity: "2 tbsp", isAvailable: true }
      ],
      instructions: [
        "Marinate chicken with curd, biryani masala, and ginger-garlic paste for 2 hours.",
        "Parboil the soaked rice with whole spices until 70% cooked.",
        "In a heavy bottomed pot, layer marinated chicken, fried onions, and rice.",
        "Pour saffron milk over the top and seal the pot with dough or foil.",
        "Cook on low heat (Dum) for 45 minutes until chicken is tender."
      ]
    }
  },
  { 
    recipeName: "Classic Italian Margherita", 
    category: "Global Fusion", 
    estimatedPrepTime: "20 min", 
    nutrition: { calories: 550, protein: "22g", carbs: "68g", fat: "24g" },
    difficultyLevel: "Medium", 
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?q=80&w=800",
    description: "Simple yet perfect pizza with tomato, fresh mozzarella, and basil.",
    details: {
      estimatedPrepTime: "20 min",
      difficultyLevel: "Medium",
      nutritionalInformation: "550 kcal. Balanced carbs and healthy fats.",
      ingredients: [
        { name: "Pizza dough", quantity: "1 ball", isAvailable: true },
        { name: "San Marzano tomatoes", quantity: "1/2 cup", isAvailable: true },
        { name: "Fresh mozzarella", quantity: "100g", isAvailable: true },
        { name: "Fresh basil", quantity: "1 sprig", isAvailable: true },
        { name: "Extra virgin olive oil", quantity: "1 tbsp", isAvailable: true }
      ],
      instructions: [
        "Stretch the pizza dough into a 12-inch circle on a floured surface.",
        "Spread a thin layer of crushed tomatoes over the dough.",
        "Tear mozzarella into pieces and scatter over the tomato base.",
        "Bake at high heat until crust is blistered and cheese is melted.",
        "Finish with fresh basil leaves and a drizzle of olive oil."
      ]
    }
  },
  { 
    recipeName: "Japanese Miso Ramen", 
    category: "Global Fusion", 
    estimatedPrepTime: "35 min", 
    nutrition: { calories: 480, protein: "25g", carbs: "62g", fat: "16g" },
    difficultyLevel: "Medium", 
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800",
    description: "Comforting noodle soup with rich miso broth and traditional toppings.",
    details: {
      estimatedPrepTime: "35 min",
      difficultyLevel: "Medium",
      nutritionalInformation: "480 kcal. Rich in probiotics and comforting warmth.",
      ingredients: [
        { name: "Ramen noodles", quantity: "1 pack", isAvailable: true },
        { name: "Miso paste", quantity: "2 tbsp", isAvailable: true },
        { name: "Chicken/Veg broth", quantity: "2 cups", isAvailable: true },
        { name: "Soft boiled egg", quantity: "1", isAvailable: true },
        { name: "Nori sheet", quantity: "1 small piece", isAvailable: true }
      ],
      instructions: [
        "Whisk miso paste into hot (not boiling) broth until fully dissolved.",
        "Boil ramen noodles according to package instructions and drain.",
        "Place noodles in a bowl and pour the rich miso broth over them.",
        "Top with halved soft-boiled egg, nori, and green onions.",
        "Serve immediately for the best texture and depth of flavor."
      ]
    }
  },
];

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeTime, setActiveTime] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  const filteredRecipes = ALL_RECIPES.filter(recipe => {
    const matchesCategory = activeCategory === "All" || recipe.category === activeCategory;
    const matchesDifficulty = activeDifficulty === "All" || recipe.difficultyLevel === activeDifficulty;
    const recipeMinutes = parseInt(recipe.estimatedPrepTime);
    const matchesTime = activeTime === "All" || 
      (activeTime === "Quick (< 15m)" && recipeMinutes <= 15) ||
      (activeTime === "Medium (15-30m)" && recipeMinutes > 15 && recipeMinutes <= 30) ||
      (activeTime === "Long (> 30m)" && recipeMinutes > 30);
    const matchesSearch = recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesTime && matchesSearch;
  });

  return (
    <div className="min-h-screen">
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

          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeCategory === "All" ? "default" : "outline"}
                  onClick={() => setActiveCategory("All")}
                  className="rounded-full px-6 h-10 font-bold"
                  suppressHydrationWarning
                >
                  All Cuisine
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
                <Input 
                  className="pl-10 rounded-full border-primary/10 h-10" 
                  placeholder="Search blueprints..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  suppressHydrationWarning 
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-[2rem] border border-primary/5">
              <div className="flex items-center gap-3 pr-4 border-r border-primary/5">
                <span className="text-[10px] font-black uppercase text-primary/30 tracking-widest">Difficulty:</span>
                {["All", "Easy", "Medium", "Hard"].map(d => (
                  <Button 
                    key={d} 
                    variant={activeDifficulty === d ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveDifficulty(d)}
                    className="rounded-full h-8 px-4 text-xs font-bold"
                  >
                    {d}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase text-primary/30 tracking-widest">Time:</span>
                {["All", "Quick (< 15m)", "Medium (15-30m)", "Long (> 30m)"].map(t => (
                  <Button 
                    key={t} 
                    variant={activeTime === t ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTime(t)}
                    className="rounded-full h-8 px-4 text-xs font-bold"
                  >
                    {t}
                  </Button>
                ))}
              </div>
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
