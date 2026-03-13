'use server';
/**
 * @fileOverview A Genkit flow for generating detailed step-by-step cooking instructions and a comprehensive ingredient list for a selected recipe.
 *
 * - generateDetailedRecipeInstructions - A function that handles the generation of detailed recipe instructions.
 * - GenerateDetailedRecipeInstructionsInput - The input type for the generateDetailedRecipeInstructions function.
 * - GenerateDetailedRecipeInstructionsOutput - The return type for the generateDetailedRecipeInstructions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDetailedRecipeInstructionsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  recipeSummary: z.string().describe('A brief summary or description of the recipe.'),
  availableIngredients: z.array(z.string()).describe('A list of ingredients the user currently has. Example: ["flour", "eggs", "milk"].'),
});
export type GenerateDetailedRecipeInstructionsInput = z.infer<typeof GenerateDetailedRecipeInstructionsInputSchema>;

const GenerateDetailedRecipeInstructionsOutputSchema = z.object({
  estimatedPrepTime: z.string().describe('The estimated preparation time for the recipe (e.g., "30 minutes", "1 hour").'),
  difficultyLevel: z.string().describe('The difficulty level of the recipe (e.g., "Easy", "Medium", "Hard").'),
  nutritionalInformation: z.string().describe('Brief nutritional information for the recipe (e.g., "Approximately 450 calories per serving, rich in protein.").'),
  instructions: z.array(z.string()).describe('A step-by-step list of cooking instructions.'),
  ingredients: z.array(z.object({
    name: z.string().describe('The name of the ingredient.'),
    quantity: z.string().describe('The quantity of the ingredient (e.g., "1 cup", "2 cloves", "a pinch").'),
    isAvailable: z.boolean().describe('True if the user has this ingredient, false otherwise.'),
  })).describe('A list of all required ingredients with their quantities and whether the user has them.'),
});
export type GenerateDetailedRecipeInstructionsOutput = z.infer<typeof GenerateDetailedRecipeInstructionsOutputSchema>;

export async function generateDetailedRecipeInstructions(input: GenerateDetailedRecipeInstructionsInput): Promise<GenerateDetailedRecipeInstructionsOutput> {
  return generateDetailedRecipeInstructionsFlow(input);
}

const detailedRecipePrompt = ai.definePrompt({
  name: 'detailedRecipePrompt',
  input: { schema: GenerateDetailedRecipeInstructionsInputSchema },
  output: { schema: GenerateDetailedRecipeInstructionsOutputSchema },
  prompt: `You are a helpful culinary assistant named Harvest Recipes AI. Your task is to generate detailed, step-by-step cooking instructions and a complete list of all required ingredients for a given recipe.\nThe user will provide the recipe name, a summary of the recipe, and a comma-separated list of ingredients they currently have.\n\nFor each ingredient you list, you must clearly indicate whether the user has it or not by setting the 'isAvailable' field to 'true' if the ingredient's name (case-insensitive) is present in the user's 'availableIngredients' list, otherwise set it to 'false'. Ensure the 'quantity' field is precise and includes units.\n\nAlso, provide an 'estimatedPrepTime' (e.g., "30 minutes", "1 hour"), a 'difficultyLevel' (e.g., "Easy", "Medium", "Hard"), and brief 'nutritionalInformation' (e.g., "Approximately 450 calories per serving, rich in protein.") for the recipe.\n\nRecipe Name: {{{recipeName}}}\nRecipe Summary: {{{recipeSummary}}}\n\nUser's available ingredients: {{{availableIngredients}}}\n\nPlease structure your response strictly according to the provided JSON schema.`,
});

const generateDetailedRecipeInstructionsFlow = ai.defineFlow(
  {
    name: 'generateDetailedRecipeInstructionsFlow',
    inputSchema: GenerateDetailedRecipeInstructionsInputSchema,
    outputSchema: GenerateDetailedRecipeInstructionsOutputSchema,
  },
  async (input) => {
    // The prompt needs the availableIngredients as a stringified list for comparison by the LLM.
    const promptInput = {
      ...input,
      availableIngredients: input.availableIngredients.join(', '), // Ensure it's a comma-separated string for easier parsing by the LLM
    };

    const { output } = await detailedRecipePrompt(promptInput);
    return output!;
  }
);
