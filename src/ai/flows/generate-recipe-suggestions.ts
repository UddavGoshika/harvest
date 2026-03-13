'use server';
/**
 * @fileOverview A Genkit flow for generating advanced recipe suggestions.
 * 
 * - Includes Leftover Rescue, Global Discovery, and Taste Preference learning.
 * - Explicit support for Indian Regional Cooking and Global Cuisines.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRecipeSuggestionsInputSchema = z.object({
  ingredientPhotos: z.array(z.string()).optional(),
  ingredientText: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  cookingTimePreference: z.string().optional(),
  difficultyPreference: z.string().optional(),
  mode: z.enum(['standard', 'rescue', 'global', 'challenge']).default('standard'),
  userHistory: z.string().optional().describe('Brief history of user preferences for personalization.'),
});
export type GenerateRecipeSuggestionsInput = z.infer<typeof GenerateRecipeSuggestionsInputSchema>;

const RecipeSuggestionSchema = z.object({
  recipeName: z.string().describe('Creative name.'),
  description: z.string().describe('Compelling description.'),
  estimatedPrepTime: z.string(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  culture: z.string().describe('Cultural origin of the dish.'),
  nutrition: z.object({
    calories: z.number(),
    protein: z.string(),
    carbs: z.string(),
    fat: z.string(),
    healthSummary: z.string(),
  }),
  isRescue: z.boolean().describe('True if this recipe specifically focuses on using up leftovers/expiring items.'),
  mysteryChallenge: z.string().optional().describe('A small challenge related to this recipe for the mystery ingredient.'),
  ingredientsUsed: z.array(z.string()),
  additionalIngredients: z.array(z.string()),
  previewInstructions: z.array(z.string()).describe('A few high-level steps for the making process.'),
});

const GenerateRecipeSuggestionsOutputSchema = z.object({
  recipeSuggestions: z.array(RecipeSuggestionSchema),
});
export type GenerateRecipeSuggestionsOutput = z.infer<typeof GenerateRecipeSuggestionsOutputSchema>;

export async function generateRecipeSuggestions(input: GenerateRecipeSuggestionsInput): Promise<GenerateRecipeSuggestionsOutput> {
  return generateRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeSuggestionsPrompt',
  input: { schema: GenerateRecipeSuggestionsInputSchema },
  output: { schema: GenerateRecipeSuggestionsOutputSchema },
  prompt: `You are Ingredia AI, the brain of a professional kitchen Operating System.

Current Mode: {{{mode}}}
(Rescue = focus on food waste/leftovers. Global = diverse cultures. Challenge = creative/bold.)

Preferences: {{{dietaryPreferences}}}
Cooking Time: {{{cookingTimePreference}}}
Difficulty: {{{difficultyPreference}}}
User Context: {{{userHistory}}}

AI Task:
Generate 3 unique recipes. 
IMPORTANT: You must strongly support Indian Regional Cooking styles (e.g., North Indian, South Indian, Street Food, etc.) as well as Global Cuisines (Italian, Mexican, Japanese, etc.).

Available Ingredients:
{{#if ingredientPhotos}}
  {{#each ingredientPhotos}}
Photo: {{media url=this}}
  {{/each}}
{{/if}}
{{#if ingredientText}}
Text: {{{ingredientText}}}
{{/if}}

For each recipe, ensure:
1. It aligns with the current Mode.
2. Nutrition is realistic and detailed.
3. Provide a 'previewInstructions' list of 3-4 short, clear steps.
4. If it's Global mode, explicitly mention the dish's culture.
5. Provide a mysteryChallenge if it's Challenge mode.

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
