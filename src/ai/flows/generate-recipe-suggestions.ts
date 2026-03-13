'use server';
/**
 * @fileOverview A Genkit flow for generating recipe suggestions based on user-provided ingredients and dietary preferences.
 *
 * - generateRecipeSuggestions - A function that handles the recipe suggestion process.
 * - GenerateRecipeSuggestionsInput - The input type for the generateRecipeSuggestions function.
 * - GenerateRecipeSuggestionsOutput - The return type for the generateRecipeSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateRecipeSuggestionsInputSchema = z.object({
  ingredientPhotos: z.array(
    z.string().describe(
      "An array of photos of ingredients, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
  ).optional(),
  ingredientText: z.string().optional().describe('Additional ingredients provided as text, separated by commas.'),
  dietaryPreferences: z.string().optional().describe('User\'s dietary preferences (e.g., "vegetarian", "gluten-free", "vegan").'),
  cookingTimePreference: z.string().optional().describe('Preferred cooking time (e.g., "quick", "medium", "long").'),
  difficultyPreference: z.string().optional().describe('Preferred difficulty level (e.g., "easy", "medium", "hard").'),
});
export type GenerateRecipeSuggestionsInput = z.infer<typeof GenerateRecipeSuggestionsInputSchema>;

// Output Schema for a single recipe
const RecipeSuggestionSchema = z.object({
  recipeName: z.string().describe('The name of the suggested recipe.'),
  description: z.string().describe('A brief description of the recipe.'),
  estimatedPrepTime: z.string().describe('Estimated preparation time for the recipe (e.g., "30 minutes", "1 hour").'),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).describe('Difficulty level of the recipe.'),
  nutrition: z.object({
    calories: z.number().describe('Estimated calories per serving.'),
    protein: z.string().describe('Protein content (e.g., "20g").'),
    carbs: z.string().describe('Carbs content (e.g., "30g").'),
    fat: z.string().describe('Fat content (e.g., "10g").'),
    healthSummary: z.string().describe('A one-sentence summary of the nutritional benefit.'),
  }).describe('Detailed nutritional breakdown.'),
  ingredientsUsed: z.array(z.string()).describe('List of ingredients from the user\'s input that are used in this recipe.'),
  additionalIngredients: z.array(z.string()).describe('List of ingredients required for the recipe that are NOT present in the user\'s input.'),
});

// Output Schema for the array of recipes
const GenerateRecipeSuggestionsOutputSchema = z.object({
  recipeSuggestions: z.array(RecipeSuggestionSchema).describe('An array of suggested recipes based on the provided ingredients and preferences.'),
});
export type GenerateRecipeSuggestionsOutput = z.infer<typeof GenerateRecipeSuggestionsOutputSchema>;

// Wrapper function to call the flow
export async function generateRecipeSuggestions(input: GenerateRecipeSuggestionsInput): Promise<GenerateRecipeSuggestionsOutput> {
  return generateRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeSuggestionsPrompt',
  input: { schema: GenerateRecipeSuggestionsInputSchema },
  output: { schema: GenerateRecipeSuggestionsOutputSchema },
  prompt: `You are an expert culinary AI and nutritionist. Your task is to generate 3 unique, gourmet recipe suggestions based on available ingredients and user preferences.

For each recipe, you MUST provide:
1. A creative recipe name.
2. A compelling description.
3. Realistic estimated prep time and difficulty.
4. Comprehensive nutritional data including approximate calories, protein, carbs, and fat per serving.
5. A list of user ingredients used and any extras needed.

Strictly adhere to dietary preferences: {{{dietaryPreferences}}}.
Cooking time: {{{cookingTimePreference}}}.
Difficulty: {{{difficultyPreference}}}.

Available Ingredients:
{{#if ingredientPhotos}}
  {{#each ingredientPhotos}}
Photo: {{media url=this}}
  {{/each}}
{{/if}}
{{#if ingredientText}}
Text: {{{ingredientText}}}
{{/if}}

Generate the response in JSON format according to the output schema.`,
});

const generateRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateRecipeSuggestionsFlow',
    inputSchema: GenerateRecipeSuggestionsInputSchema,
    outputSchema: GenerateRecipeSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
