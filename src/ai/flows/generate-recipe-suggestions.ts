'use server';
/**
 * @fileOverview A Genkit flow for generating advanced recipe suggestions.
 * 
 * - Includes Leftover Rescue, Global Discovery, and Taste Preference learning.
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
  prompt: `You are Harvest Recipes AI, a Michelin-star chef and nutrition expert.

Current Mode: {{{mode}}}
(Rescue = focus on food waste/leftovers. Global = diverse cultures. Challenge = creative/bold.)

Preferences: {{{dietaryPreferences}}}
Cooking Time: {{{cookingTimePreference}}}
Difficulty: {{{difficultyPreference}}}
User Context: {{{userHistory}}}

Available Ingredients:
{{#if ingredientPhotos}}
  {{#each ingredientPhotos}}
Photo: {{media url=this}}
  {{/each}}
{{/if}}
{{#if ingredientText}}
Text: {{{ingredientText}}}
{{/if}}

Generate 3 unique recipes. For each, ensure:
1. It aligns with the current Mode.
2. Nutrition is realistic.
3. Instructions should be creative but achievable.
4. If it's Global mode, explicitly mention the dish's culture.

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