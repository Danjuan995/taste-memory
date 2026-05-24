import { mockDishes, mockMealPlans, mockRestaurants, mockTasteMemories } from '../data/mockData';
import { Dish, MealPlan, RestaurantRecord, TasteMemory } from '../types/index';

const STORAGE_KEY = 'xb-xjm-private-kitchen-v1';

export interface StoreData {
  dishes: Dish[];
  mealPlans: MealPlan[];
  tasteMemories: TasteMemory[];
  restaurants: RestaurantRecord[];
}

const initialData: StoreData = {
  dishes: mockDishes,
  mealPlans: mockMealPlans,
  tasteMemories: mockTasteMemories,
  restaurants: mockRestaurants
};

export const storageService = {
  load(): StoreData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    try {
      return { ...initialData, ...JSON.parse(raw) };
    } catch {
      return initialData;
    }
  },
  save(data: StoreData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};
