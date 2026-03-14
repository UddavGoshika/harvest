
export const SEED_RECIPES = [
  {
    id: "r1",
    recipeName: "Truffle Mushroom Risotto",
    description: "Creamy Arborio rice slow-cooked with wild mushrooms and finished with truffle oil.",
    estimatedPrepTime: "35 min",
    difficultyLevel: "Medium",
    culture: "Italian",
    nutrition: { calories: 420, protein: "12g", carbs: "58g", fat: "16g" },
    ingredientsUsed: ["Arborio Rice", "Mushrooms", "Truffle Oil", "Parmesan"],
    author: "@chef_marco",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop",
    details: {
      ingredients: [
        { name: "Arborio Rice", quantity: "1.5 cups", isAvailable: true },
        { name: "Wild Mushrooms", quantity: "200g", isAvailable: true },
        { name: "Truffle Oil", quantity: "2 tbsp", isAvailable: false },
        { name: "Parmesan Cheese", quantity: "50g", isAvailable: true },
        { name: "Vegetable Broth", quantity: "4 cups", isAvailable: true }
      ],
      instructions: [
        "Sauté mushrooms in a large pan until golden brown and set aside.",
        "In the same pan, toast Arborio rice for 2 minutes.",
        "Slowly add warm broth one ladle at a time, stirring constantly until absorbed.",
        "Stir in mushrooms and parmesan once rice is al dente.",
        "Drizzle with truffle oil right before serving."
      ],
      difficultyLevel: "Medium",
      estimatedPrepTime: "35 min"
    }
  },
  {
    id: "r2",
    recipeName: "Golden Turmeric Bowl",
    description: "A restorative vegan bowl featuring chickpeas, roasted sweet potatoes, and tahini dressing.",
    estimatedPrepTime: "20 min",
    difficultyLevel: "Easy",
    culture: "Modern Indian",
    nutrition: { calories: 310, protein: "10g", carbs: "45g", fat: "8g" },
    ingredientsUsed: ["Chickpeas", "Sweet Potato", "Turmeric", "Kale"],
    author: "@health_junction",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    details: {
      ingredients: [
        { name: "Chickpeas", quantity: "1 can", isAvailable: true },
        { name: "Sweet Potato", quantity: "1 large", isAvailable: true },
        { name: "Ground Turmeric", quantity: "1 tsp", isAvailable: true },
        { name: "Kale", quantity: "2 cups", isAvailable: false },
        { name: "Tahini", quantity: "3 tbsp", isAvailable: true }
      ],
      instructions: [
        "Cubes sweet potatoes and toss with olive oil and turmeric.",
        "Roast at 200°C for 15-20 minutes.",
        "Massage kale with a bit of lemon juice.",
        "Assemble bowl with sweet potatoes, chickpeas, and kale.",
        "Drizzle generously with tahini dressing."
      ],
      difficultyLevel: "Easy",
      estimatedPrepTime: "20 min"
    }
  },
  {
    id: "r3",
    recipeName: "Seared Scallops with Pea Puree",
    description: "Perfectly caramelized scallops on a bed of vibrant, buttery pea mint puree.",
    estimatedPrepTime: "25 min",
    difficultyLevel: "Hard",
    culture: "French Fusion",
    nutrition: { calories: 280, protein: "22g", carbs: "12g", fat: "14g" },
    ingredientsUsed: ["Scallops", "Peas", "Mint", "Butter"],
    author: "@culinary_master",
    imageUrl: "https://images.unsplash.com/photo-1515467827433-6aed7f198421?q=80&w=800&auto=format&fit=crop",
    details: {
      ingredients: [
        { name: "Large Scallops", quantity: "6 pcs", isAvailable: true },
        { name: "Frozen Peas", quantity: "200g", isAvailable: true },
        { name: "Fresh Mint", quantity: "1 sprig", isAvailable: true },
        { name: "Unsalted Butter", quantity: "30g", isAvailable: true },
        { name: "Heavy Cream", quantity: "2 tbsp", isAvailable: false }
      ],
      instructions: [
        "Boil peas for 3 minutes, then blend with mint and butter until smooth.",
        "Pat scallops completely dry with paper towels.",
        "Heat a skillet with oil until smoking hot.",
        "Sear scallops for 90 seconds per side without moving them.",
        "Serve immediately on top of the warm pea puree."
      ],
      difficultyLevel: "Hard",
      estimatedPrepTime: "25 min"
    }
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
