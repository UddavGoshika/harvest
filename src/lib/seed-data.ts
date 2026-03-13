export const SEED_RECIPES = [
  {
    id: "r1",
    recipeName: "Truffle Mushroom Risotto",
    description: "Creamy Arborio rice slow-cooked with wild mushrooms and finished with truffle oil.",
    estimatedPrepTime: "35 min",
    difficultyLevel: "Medium",
    culture: "Italian",
    nutrition: { calories: 420 },
    ingredientsUsed: ["Arborio Rice", "Mushrooms", "Truffle Oil", "Parmesan"],
    author: "@chef_marco",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "r2",
    recipeName: "Golden Turmeric Bowl",
    description: "A restorative vegan bowl featuring chickpeas, roasted sweet potatoes, and tahini dressing.",
    estimatedPrepTime: "20 min",
    difficultyLevel: "Easy",
    culture: "Modern Indian",
    nutrition: { calories: 310 },
    ingredientsUsed: ["Chickpeas", "Sweet Potato", "Turmeric", "Kale"],
    author: "@health_junction",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "r3",
    recipeName: "Seared Scallops with Pea Puree",
    description: "Perfectly caramelized scallops on a bed of vibrant, buttery pea mint puree.",
    estimatedPrepTime: "25 min",
    difficultyLevel: "Hard",
    culture: "French Fusion",
    nutrition: { calories: 280 },
    ingredientsUsed: ["Scallops", "Peas", "Mint", "Butter"],
    author: "@culinary_master",
    imageUrl: "https://images.unsplash.com/photo-1515467827433-6aed7f198421?q=80&w=800&auto=format&fit=crop"
  }
];

export const SEED_REELS = [
  { id: 1, author: "@chef_sophie", title: "15-Minute Gourmet Pasta", likes: "124k", tag: "Fast Food", imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop" },
  { id: 2, author: "@sustain_eats", title: "Zero Waste Veggie Broth", likes: "89k", tag: "Sustainable", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop" },
  { id: 3, author: "@spice_king", title: "The Secret to Crispy Tofu", likes: "205k", tag: "Technique", imageUrl: "https://images.unsplash.com/photo-1546069901-e5161476b701?q=80&w=800&auto=format&fit=crop" }
];

export const initializeDatabase = () => {
  if (typeof window === 'undefined') return;
  
  const hasSeeded = localStorage.getItem("ingredia_seeded");
  if (!hasSeeded) {
    localStorage.setItem("harvest_saved_recipes", JSON.stringify(SEED_RECIPES));
    localStorage.setItem("ingredia_seeded", "true");
    console.log("Database initialized with seed data.");
  }
};
