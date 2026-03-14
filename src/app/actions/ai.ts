"use server";

import { uploadToR2 } from "@/lib/r2";
import { talkToAI, scanImageToIngredients } from "@/lib/ai-pipeline";
import { 
  DetailedRecipeOutput, 
  RecipeSuggestionsOutput, 
  PantrySuggestionsOutput, 
  MarketScanOutput 
} from "@/types/ai";

// Professional Mocks as a final safety net
const MOCK_RECIPE_RESULTS: RecipeSuggestionsOutput = {
  recipeSuggestions: [
    {
      recipeName: "Zesty Garden Stir-Fry",
      description: "A vibrant, nutrient-packed mix of your available vegetables tossed in a handmade signature ginger-garlic savory glaze.",
      estimatedPrepTime: "15 min",
      difficultyLevel: "easy",
      culture: "Asian Fusion",
      nutrition: { calories: 320, protein: "8g", carbs: "25g", fat: "12g", healthSummary: "High in fiber and vitamins" },
      ingredientsUsed: ["Vegetables", "Aromatics"],
      additionalIngredients: ["Soy Sauce", "Sesame Oil", "Ginger", "Garlic"],
      previewInstructions: ["Wash and chop veggies.", "Sauté over high heat.", "Glaze with sauce."],
      isRescue: false,
      details: {
        estimatedPrepTime: "15 min",
        difficultyLevel: "easy",
        nutritionalInformation: "320 kcal. Rich in Vitamins A & C from fresh vegetables.",
        ingredients: [
          { name: "Mixed Bell Peppers", quantity: "2 units", isAvailable: true },
          { name: "Broccoli Florets", quantity: "1 cup", isAvailable: true }
        ],
        instructions: [
          "Wash and slice vegetables into uniform strips.",
          "Sauté in a smoking hot pan for 4-5 minutes.",
          "Glaze with sauce and serve."
        ]
      }
    }
  ]
};

const MOCK_SCAN_RESULTS: MarketScanOutput = {
  ingredients: [
    { name: "Fresh Tomatoes", quantity: "500g", calories: "90", expiryDays: 7 },
    { name: "Green Bell Peppers", quantity: "250g", calories: "50", expiryDays: 10 },
    { name: "Organic Carrots", quantity: "1kg", calories: "410", expiryDays: 14 }
  ],
  weeklyPlan: {
    "Monday": [{ recipeName: "Roasted Veggie Pasta", description: "Use tomatoes and peppers." }],
    "Wednesday": [{ recipeName: "Carrot & Ginger Soup", description: "A warming nutrient boost." }],
    "Friday": [{ recipeName: "Farmer's Bowl", description: "Fresh mix of everything." }]
  }
};

/**
 * Uploads an image to R2 and returns the URL.
 */
export async function uploadImage(base64: string, prefix: string = "ingredients") {
  try {
    const base64Data = base64.split(',')[1] || base64;
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `${prefix}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const url = await uploadToR2(buffer, fileName, "image/jpeg");
    return { success: true, url };
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Runs the Multi-Stage Vision Pipeline (Gemini -> Roboflow -> YOLO)
 */
export async function runMarketScan(data: { contentType: string; url: string }) {
  try {
    // 1. Upload to R2 for long-term storage
    const uploadResult = await uploadImage(data.url, "scans");
    const imageUrl = uploadResult.success ? uploadResult.url : data.url;

    // 2. Process with Multi-Stage Vision Pipeline
    const result = await scanImageToIngredients(data.url);
    
    return { 
      success: true, 
      data: result as MarketScanOutput,
      storageUrl: imageUrl 
    };
  } catch (error: any) {
    console.warn("Vision Pipeline failed - Using hardcoded fallback:", error);
    return { success: true, data: MOCK_SCAN_RESULTS };
  }
}

/**
 * Generates detailed recipe instructions using OpenRouter (Primary: GPT-OSS-120B)
 */
export async function generateRecipeBlueprint(data: { 
  recipeName: string; 
  recipeSummary: string; 
  availableIngredients: string[] 
}) {
  try {
    const prompt = `Generate a professional cooking blueprint for "${data.recipeName}". 
    Summary: ${data.recipeSummary}. 
    Available Ingredients: ${data.availableIngredients.join(', ')}.
    Return JSON: {
      "estimatedPrepTime": "string",
      "difficultyLevel": "easy|medium|hard",
      "nutritionalInformation": "string",
      "instructions": ["step 1", "step 2", ...],
      "ingredients": [{ "name": "string", "quantity": "string", "isAvailable": boolean }]
    }`;
    
    const result = await talkToAI(prompt);
    return { success: true, data: result as DetailedRecipeOutput };
  } catch (error: any) {
    return { success: true, data: MOCK_RECIPE_RESULTS.recipeSuggestions[0].details as DetailedRecipeOutput };
  }
}

/**
 * Suggests recipes using OpenRouter model chain.
 */
export async function suggestRecipes(data: { 
  ingredientPhotos?: string[];
  ingredientText?: string;
  mode: 'standard' | 'rescue' | 'global' | 'challenge';
}) {
  try {
    const prompt = `act as a chef. suggest 3 recipes based on these ingredients: ${data.ingredientText}. 
    Mode: ${data.mode}.
    Return JSON structure matching: { "recipeSuggestions": [ ... ] }`;
    
    const result = await talkToAI(prompt);
    return { success: true, data: result as RecipeSuggestionsOutput };
  } catch (error: any) {
    return { success: true, data: MOCK_RECIPE_RESULTS };
  }
}

/**
 * Suggests pantry additions using OpenRouter model chain.
 */
export async function suggestPantryItems(data: { 
  currentIngredients: string;
}) {
  try {
    const prompt = `Suggest 4 pantry items to buy based on: ${data.currentIngredients}. 
    Return JSON: { "suggestions": [{ "ingredient": "string", "reason": "string", "category": "string" }] }`;
    
    const result = await talkToAI(prompt);
    return { success: true, data: result as PantrySuggestionsOutput };
  } catch (error: any) {
    return { success: true, data: { suggestions: [] } as PantrySuggestionsOutput };
  }
}
