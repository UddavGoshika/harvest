export interface IngredientDetails {
  name: string;
  quantity: string;
  isAvailable: boolean;
}

export interface DetailedRecipeOutput {
  estimatedPrepTime: string;
  difficultyLevel: string;
  nutritionalInformation: string;
  instructions: string[];
  ingredients: IngredientDetails[];
}

export interface RecipeSuggestion {
  recipeName: string;
  description: string;
  estimatedPrepTime: string;
  difficultyLevel: "easy" | "medium" | "hard";
  culture: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    healthSummary: string;
  };
  ingredientsUsed: string[];
  additionalIngredients: string[];
  previewInstructions: string[];
  isRescue: boolean;
  mysteryChallenge?: string;
  details?: DetailedRecipeOutput;
}

export interface RecipeSuggestionsOutput {
  recipeSuggestions: RecipeSuggestion[];
}

export interface PantrySuggestion {
  ingredient: string;
  reason: string;
  category: string;
}

export interface PantrySuggestionsOutput {
  suggestions: PantrySuggestion[];
}

export interface MarketScanOutput {
  ingredients: {
    name: string;
    quantity: string;
    calories: string;
    expiryDays: number;
  }[];
  weeklyPlan: Record<string, {
    recipeName: string;
    description: string;
  }[]>;
}
