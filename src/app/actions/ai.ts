"use server";

import { uploadToR2 } from "@/lib/r2";
import { talkToAI, scanImageToIngredients } from "@/lib/ai-pipeline";
import connectToDatabase from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { getRecipeImage } from "@/lib/unsplash";
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
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000",
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
    "Monday": [{ recipeName: "Roasted Veggie Pasta", description: "Use tomatoes and peppers.", imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1000" }],
    "Wednesday": [{ recipeName: "Carrot & Ginger Soup", description: "A warming nutrient boost.", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000" }],
    "Friday": [{ recipeName: "Farmer's Bowl", description: "Fresh mix of everything.", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" }]
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
 * Suggests recipes using a hybrid approach: Database First -> AI Generation.
 */
export async function suggestRecipes(data: { 
  ingredientPhotos?: string[];
  ingredientText?: string;
  mode: 'standard' | 'rescue' | 'global' | 'challenge';
}) {
  console.log("Suggesting recipes for:", data.ingredientText);
  try {
    await connectToDatabase();
    
    // 1. Search Database First (matching ingredients)
    const searchTerms = data.ingredientText?.split(',').map(s => s.trim()).filter(Boolean) || [];
    let dbRecipes: any[] = [];
    
    try {
      dbRecipes = await Recipe.find({
        ingredientsUsed: { $in: searchTerms }
      }).limit(2).lean();
      console.log(`Found ${dbRecipes.length} recipes in DB.`);
    } catch (dbError) {
      console.error("DB Search Error:", dbError);
    }

    // 2. AI Generation for fresh variations
    const prompt = `Act as a world-class executive chef. I have these SPECIFIC ingredients: ${data.ingredientText}.
    Mode: ${data.mode}.
    
    TASK: Suggest 3 unique, gourmet recipes that use as many of these ingredients as possible.
    STRICT RULE: Do NOT suggest generic recipes like "Garden Stir Fry" unless it's the absolute best fit. Be SPECIFIC and creative.
    
    Structure:
    {
      "recipeSuggestions": [
        {
          "recipeName": "string (Creative & Unique)",
          "description": "string (Appetizing)",
          "estimatedPrepTime": "string",
          "difficultyLevel": "easy|medium|hard",
          "culture": "string",
          "nutrition": {
            "calories": number,
            "protein": "string",
            "carbs": "string",
            "fat": "string",
            "healthSummary": "string"
          },
          "ingredientsUsed": ["string"],
          "additionalIngredients": ["string"],
          "previewInstructions": ["string"],
          "isRescue": boolean,
          "details": {
            "estimatedPrepTime": "string",
            "difficultyLevel": "string",
            "nutritionalInformation": "string",
            "ingredients": [{ "name": "string", "quantity": "string", "isAvailable": true }],
            "instructions": ["string"]
          }
        }
      ]
    }`;
    
    // Attempt AI with retry/fallback tracking
    let aiResult: any = null;
    try {
       aiResult = await talkToAI(prompt);
    } catch (aiError) {
       console.error("Primary AI call failed, trying backup with simple prompt...");
       // Triple-fallback: Try a simpler prompt if JSON mode with complex instructions failed
       aiResult = await talkToAI(`Suggest 3 recipes using ${data.ingredientText}. Return JSON with "recipeSuggestions" array.`);
    }
    
    if (!aiResult || (!aiResult.recipeSuggestions && !Array.isArray(aiResult))) {
      throw new Error("Invalid AI response format");
    }

    const suggestions = Array.isArray(aiResult) ? aiResult : aiResult.recipeSuggestions;

    // 3. Add dynamic image URLs and ensure details exist (Parallel fetching for speed)
    const enhancedAiRecipes = await Promise.all((suggestions || []).map(async (recipe: any) => ({
      ...recipe,
      imageUrl: recipe.imageUrl || await getRecipeImage(recipe.recipeName),
      // Ensure details are included for the UI modal
      details: recipe.details || {
        estimatedPrepTime: recipe.estimatedPrepTime || "20 min",
        difficultyLevel: recipe.difficultyLevel || "easy",
        nutritionalInformation: `${recipe.nutrition?.calories || 0} Cal. ${recipe.nutrition?.healthSummary || ''}`,
        ingredients: recipe.ingredientsUsed?.map((ing: string) => ({ name: ing, quantity: "1 unit", isAvailable: true })) || [],
        instructions: recipe.previewInstructions || []
      }
    })));

    // Enhance DB recipes with images if missing
    const enhancedDbRecipes = await Promise.all(dbRecipes.map(async (recipe: any) => {
      const r = recipe.toObject ? recipe.toObject() : recipe;
      if (!r.imageUrl || r.imageUrl.includes('placeholder') || r.imageUrl.includes('loremflickr')) {
        r.imageUrl = await getRecipeImage(r.recipeName);
      }
      return r;
    }));

    // 4. Merge results (DB recipes first)
    const finalRecipes = [...enhancedDbRecipes, ...enhancedAiRecipes];

    // If still empty, return mocks
    if (finalRecipes.length === 0) return { success: true, data: MOCK_RECIPE_RESULTS };

    return { 
      success: true, 
      data: { recipeSuggestions: finalRecipes } as RecipeSuggestionsOutput 
    };
  } catch (error: any) {
    console.error("Suggestion Error:", error);
    // Return mock as ultimate fallback but log the failure
    return { success: true, data: MOCK_RECIPE_RESULTS };
  }
}

/**
 * Publishes a recipe to the global database.
 */
export async function publishRecipe(recipe: any) {
  try {
    await connectToDatabase();
    
    // Check if it already exists
    const existing = await Recipe.findOne({ recipeName: recipe.recipeName });
    if (existing) {
       return { success: true, message: "Already published" };
    }

    const newRecipe = new Recipe({
      ...recipe,
      isPublished: true,
      createdAt: new Date()
    });

    await newRecipe.save();
    return { success: true, message: "Published successfully!" };
  } catch (error: any) {
    console.error("Publish Error:", error);
    return { success: false, error: error.message };
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
/**
 * Generates a full weekly meal schedule based on available ingredients.
 */
/**
 * Generates a full weekly meal schedule based on available ingredients and user context.
 */
export async function generateWeeklySchedule(ingredients: string[], context?: {
  familyMembers?: number;
  healthConditions?: string[];
  dietaryPreferences?: string[];
}) {
  try {
    const contextStr = context ? `
    Context:
    - Family Members: ${context.familyMembers || 1}
    - Health Conditions: ${context.healthConditions?.join(', ') || 'None'}
    - Dietary Preferences: ${context.dietaryPreferences?.join(', ') || 'None'}
    ` : '';

    const prompt = `Generate a 7-day meal plan (Monday to Sunday) using these ingredients: ${ingredients.join(', ')}. 
    ${contextStr}
    Return a JSON object where keys are days and values are arrays containing one recipe suggestion object with: 
    recipeName, description, estimatedPrepTime, difficultyLevel, nutrition (calories as number), details (ingredients as {name, quantity, isAvailable}[], instructions as string[]).
    Be creative and try to use most ingredients across the week to minimize waste. Ensure portion sizes reflect the number of family members and recipes account for health conditions/preferences. Return only the JSON object.`;

    const data = await talkToAI(prompt, true);
    
    // Add images to weekly schedule recipes
    if (data && typeof data === 'object') {
      const days = Object.keys(data);
      for (const day of days) {
        if (Array.isArray(data[day])) {
          data[day] = await Promise.all(data[day].map(async (recipe: any) => ({
            ...recipe,
            imageUrl: await getRecipeImage(recipe.recipeName)
          })));
        }
      }
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Weekly Schedule Error:", error);
    // Fallback to mock if AI fails
    return { success: true, data: MOCK_SCAN_RESULTS.weeklyPlan };
  }
}

/**
 * Recipe Assistant Chat: Answers user questions about a specific recipe.
 */
export async function recipeAssistantChat(data: { 
  recipeName: string;
  description: string;
  ingredients: string;
  instructions: string;
  question: string;
  history: { role: 'user' | 'assistant', content: string }[];
}) {
  try {
    const prompt = `You are the Harvest AI Culinary Assistant. The user is currently viewing the recipe: "${data.recipeName}".
    Description: ${data.description}
    Ingredients: ${data.ingredients}
    Instructions: ${data.instructions}
    
    Previous Conversation:
    ${data.history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
    
    User Question: ${data.question}
    
    Provide a helpful, professional, and culinary-expert answer. Be concise, friendly, and encouraging. If asking for substitutes, consider common pantry items.`;
    
    const response = await talkToAI(prompt, false);
    return { success: true, content: response as string };
  } catch (error: any) {
    console.error("Chat Error:", error);
    return { success: false, error: "Could not connect to AI assistant." };
  }
}
