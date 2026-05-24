import { mockDishes, mockOrders, mockRestaurants, mockTasteMemories } from '../data/mockData';
import { Dish, MealOrder, Restaurant, TasteMemory } from '../types/index';

const KEY = 'taste_memory_v1';

interface StoreData {
  dishes: Dish[];
  orders: MealOrder[];
  memories: TasteMemory[];
  restaurants: Restaurant[];
}

const fallback: StoreData = {
  dishes: mockDishes,
  orders: mockOrders,
  memories: mockTasteMemories,
  restaurants: mockRestaurants
};

export const storageService = {
  load(): StoreData {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    try {
      return { ...fallback, ...JSON.parse(raw) };
    } catch {
      return fallback;
    }
  },
  save(data: StoreData) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }
};

export type { StoreData };
