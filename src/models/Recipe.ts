import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe extends Document {
  recipeName: string;
  description: string;
  estimatedPrepTime: string;
  difficultyLevel: string;
  culture?: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    healthSummary?: string;
  };
  ingredientsUsed: string[];
  additionalIngredients?: string[];
  previewInstructions: string[];
  imageUrl: string;
  isPublished: boolean;
  createdAt: Date;
}

const RecipeSchema: Schema = new Schema({
  recipeName: { type: String, required: true },
  description: { type: String, required: true },
  estimatedPrepTime: { type: String, required: true },
  difficultyLevel: { type: String, required: true },
  culture: { type: String },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: String, required: true },
    carbs: { type: String, required: true },
    fat: { type: String, required: true },
    healthSummary: { type: String },
  },
  ingredientsUsed: [{ type: String }],
  additionalIngredients: [{ type: String }],
  previewInstructions: [{ type: String }],
  imageUrl: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Full-text search index for ingredients
RecipeSchema.index({ ingredientsUsed: 'text' });

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
