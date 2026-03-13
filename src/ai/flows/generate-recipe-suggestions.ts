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
  nutritionalInformation: z.string().describe('A brief summary of the nutritional information (e.g., "High protein, low carb").'),
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
  prompt: `You are an expert culinary AI, skilled at creating novel and suitable recipes from available ingredients and user preferences.\n\nAnalyze the provided ingredients (from photos and text) and generate 3 unique recipe suggestions. For each recipe, include the following details: recipe name, a brief description, estimated preparation time, difficulty level (easy, medium, hard), a brief nutritional summary, a list of ingredients from the user's input that are used, and a list of any additional ingredients needed.\n\nStrictly adhere to the user's dietary preferences, cooking time preference, and difficulty preference. If preferences are not provided, use your best culinary judgment to create balanced and appealing options.\n\nAvailable Ingredients:\n{{#if ingredientPhotos}}\n  {{#each ingredientPhotos}}\nPhoto: {{media url=this}}\n  {{/each}}\n{{/if}}\n{{#if ingredientText}}\nText: {{{ingredientText}}}\n{{/if}}\n\nDietary Preferences: {{{dietaryPreferences}}}\nCooking Time Preference: {{{cookingTimePreference}}}\nDifficulty Preference: {{{difficultyPreference}}}\n\nGenerate the response in JSON format according to the output schema.`,
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
