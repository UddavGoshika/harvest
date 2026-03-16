export const PLAN_LIMITS = {
  FREE: {
    recipesPerDay: 3,
    savedRecipes: 10,
    hasAdvancedVision: false,
    hasMealPlanner: false
  },
  SPROUT: {
    recipesPerDay: 20,
    savedRecipes: 50,
    hasAdvancedVision: true,
    hasMealPlanner: true
  },
  SEEDLING: {
    recipesPerDay: Infinity,
    savedRecipes: Infinity,
    hasAdvancedVision: true,
    hasMealPlanner: true
  },
  HARVEST: {
    recipesPerDay: Infinity,
    savedRecipes: Infinity,
    hasAdvancedVision: true,
    hasMealPlanner: true
  }
};

export function getCurrentPlan() {
  if (typeof window === 'undefined') return 'FREE';
  return localStorage.getItem("harvest_user_plan") || 'FREE';
}

export function setPlan(plan: string) {
  localStorage.setItem("harvest_user_plan", plan);
}

export function checkUsage(type: 'recipesPerDay' | 'savedRecipes') {
  if (typeof window === 'undefined') return true;
  
  const plan = getCurrentPlan() as keyof typeof PLAN_LIMITS;
  const limit = PLAN_LIMITS[plan][type];
  
  if (type === 'recipesPerDay') {
    const today = new Date().toDateString();
    const usage = JSON.parse(localStorage.getItem("harvest_usage_stats") || "{}");
    if (usage.date !== today) {
       usage.date = today;
       usage.count = 0;
    }
    return usage.count < limit;
  }
  
  if (type === 'savedRecipes') {
    const saved = JSON.parse(localStorage.getItem("harvest_saved_recipes") || "[]");
    return saved.length < limit;
  }
  
  return true;
}

export function incrementUsage() {
  if (typeof window === 'undefined') return;
  const today = new Date().toDateString();
  const usage = JSON.parse(localStorage.getItem("harvest_usage_stats") || "{}");
  if (usage.date !== today) {
     usage.date = today;
     usage.count = 0;
  }
  usage.count++;
  localStorage.setItem("harvest_usage_stats", JSON.stringify(usage));
}
