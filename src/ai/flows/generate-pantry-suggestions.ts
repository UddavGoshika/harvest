'use server';
/**
 * @fileOverview A Genkit flow for suggesting complementary ingredients based on what the user already has.
 *
 * - generatePantrySuggestions - Suggests ingredients to buy or add.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePantrySuggestionsInputSchema = z.object({
  currentIngredients: z.string().describe('Comma separated list of ingredients.'),
});
export type GeneratePantrySuggestionsInput = z.infer<typeof GeneratePantrySuggestionsInputSchema>;

const PantrySuggestionSchema = z.object({
  ingredient: z.string().describe('The name of the suggested ingredient.'),
  reason: z.string().describe('Why this pairs well with the current pantry.'),
  category: z.string().describe('Category like "Spice", "Produce", "Dairy".'),
});

const GeneratePantrySuggestionsOutputSchema = z.object({
  suggestions: z.array(PantrySuggestionSchema).describe('A list of suggested ingredients.'),
});
export type GeneratePantrySuggestionsOutput = z.infer<typeof GeneratePantrySuggestionsOutputSchema>;

export async function generatePantrySuggestions(input: GeneratePantrySuggestionsInput): Promise<GeneratePantrySuggestionsOutput> {
  return generatePantrySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePantrySuggestionsPrompt',
  input: { schema: GeneratePantrySuggestionsInputSchema },
  output: { schema: GeneratePantrySuggestionsOutputSchema },
  prompt: `You are a professional chef and pantry consultant. 
The user has these ingredients: {{{currentIngredients}}}.

Suggest 4 additional ingredients that would dramatically expand their cooking possibilities or pair perfectly with what they have. 
Focus on versatile staples or "flavor boosters".

Generate the response in JSON format according to the output schema.`,
});

const generatePantrySuggestionsFlow = ai.defineFlow(
  {
    name: 'generatePantrySuggestionsFlow',
    inputSchema: GeneratePantrySuggestionsInputSchema,
    outputSchema: GeneratePantrySuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
