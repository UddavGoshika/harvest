import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDataStore = create((set, get) => ({
  pantry: [],
  planner: {},
  savedRecipes: [],
  
  loadAll: async () => {
    try {
      const p = await AsyncStorage.getItem('harvest_pantry');
      const pl = await AsyncStorage.getItem('harvest_meal_planner');
      const s = await AsyncStorage.getItem('harvest_saved_recipes');
      
      set({
        pantry: p ? JSON.parse(p) : [],
        planner: pl ? JSON.parse(pl) : {},
        savedRecipes: s ? JSON.parse(s) : []
      });
    } catch (e) {
      console.error('Failed to load data', e);
    }
  },
  
  setPantry: async (items) => {
    await AsyncStorage.setItem('harvest_pantry', JSON.stringify(items));
    set({ pantry: items });
  },
  
  addPantryItem: async (item) => {
    const updated = [item, ...get().pantry];
    await get().setPantry(updated);
  },
  
  removePantryItem: async (id) => {
    const updated = get().pantry.filter(i => i.id !== id);
    await get().setPantry(updated);
  },
  
  setPlanner: async (plan) => {
    await AsyncStorage.setItem('harvest_meal_planner', JSON.stringify(plan));
    set({ planner: plan });
  },
  
  saveRecipe: async (recipe) => {
    const updated = [recipe, ...get().savedRecipes];
    await AsyncStorage.setItem('harvest_saved_recipes', JSON.stringify(updated));
    set({ savedRecipes: updated });
  }
}));
