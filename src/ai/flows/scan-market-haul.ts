
import { ai } from '../genkit';
import { z } from 'zod';

export const scanMarketHaul = ai.defineFlow(
  {
    name: 'scanMarketHaul',
    inputSchema: z.object({
      imagePart: z.object({
        contentType: z.string(),
        url: z.string(),
      }),
    }),
    outputSchema: z.object({
      ingredients: z.array(z.object({
        name: z.string(),
        quantity: z.string(),
        calories: z.string(),
        expiryDays: z.number(),
      })),
      weeklyPlan: z.record(z.string(), z.array(z.object({
        meal: z.string(),
        recipeName: z.string(),
        description: z.string(),
        calories: z.number(),
        prepTime: z.string(),
        difficulty: z.string(),
      }))),
    }),
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: [
        {
          media: {
            contentType: input.imagePart.contentType,
            url: input.imagePart.url,
          },
        },
        {
          text: `Analyze this image of vegetables and market goods. 
          1. Identify every vegetable and item visible.
          2. Estimate the quantity (e.g., "500g", "3 units").
          3. Estimate typical calories for that quantity.
          4. Suggest expiry days (how long it stays fresh).
          5. Create a balanced one-week meal plan (Monday-Sunday) using primarily these ingredients.
          
          Return the response as JSON matching the schema precisely.`,
        },
      ],
      output: {
        format: 'json',
        schema: z.object({
          ingredients: z.array(z.object({
            name: z.string(),
            quantity: z.string(),
            calories: z.string(),
            expiryDays: z.number(),
          })),
          weeklyPlan: z.record(z.string(), z.array(z.object({
            meal: z.string(),
            recipeName: z.string(),
            description: z.string(),
            calories: z.number(),
            prepTime: z.string(),
            difficulty: z.string(),
          }))),
        }),
      },
    });

    if (!output) throw new Error('AI failed to identify items');
    return output;
  }
);
