import { mockDishes, mockOrders, mockRecipes, mockRestaurants, mockTasteMemories } from '../data/mockData';
import { Dish, MealOrder, Recipe, Restaurant, TasteMemory } from '../types/index';
import { createId } from '../utils/createId';

const KEY = 'taste_memory_v3';

export interface StoreData {
  dishes: Dish[];
  orders: MealOrder[];
  memories: TasteMemory[];
  restaurants: Restaurant[];
  recipes: Recipe[];
}

const fallback: StoreData = { dishes: mockDishes, orders: mockOrders, memories: mockTasteMemories, restaurants: mockRestaurants, recipes: mockRecipes };

const withId = <T extends object>(item: Omit<T, 'id'>): T => ({ ...item, id: createId('entity') } as T);

export const storageService = {
  loadAll(): StoreData {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return { ...fallback, ...parsed, recipes: parsed.recipes ?? [] };
    } catch {
      return fallback;
    }
  },
  saveAll(data: StoreData) { localStorage.setItem(KEY, JSON.stringify(data)); },
  addDish(data: StoreData, dish: Omit<Dish, 'id'>) { return { ...data, dishes: [withId<Dish>(dish), ...data.dishes] }; },
  updateDish(data: StoreData, id: string, patch: Partial<Dish>) { return { ...data, dishes: data.dishes.map((d) => d.id === id ? { ...d, ...patch } : d) }; },
  deleteDish(data: StoreData, id: string) { return { ...data, dishes: data.dishes.filter((d) => d.id !== id) }; },
  addOrder(data: StoreData, order: Omit<MealOrder, 'id'>) { return { ...data, orders: [withId<MealOrder>(order), ...data.orders] }; },
  updateOrder(data: StoreData, id: string, patch: Partial<MealOrder>) { return { ...data, orders: data.orders.map((o) => o.id === id ? { ...o, ...patch } : o) }; },
  addMemory(data: StoreData, memory: Omit<TasteMemory, 'id' | 'createdAt'>) { return { ...data, memories: [{ ...withId<TasteMemory>({ ...memory, createdAt: new Date().toISOString() } as Omit<TasteMemory, 'id'>) }, ...data.memories] }; },
  addRestaurant(data: StoreData, restaurant: Omit<Restaurant, 'id' | 'createdAt'>) { return { ...data, restaurants: [{ ...withId<Restaurant>({ ...restaurant, createdAt: new Date().toISOString() } as Omit<Restaurant, 'id'>) }, ...data.restaurants] }; },
  updateRestaurant(data: StoreData, id: string, patch: Partial<Restaurant>) { return { ...data, restaurants: data.restaurants.map((r) => r.id === id ? { ...r, ...patch } : r) }; },
  addRecipe(data: StoreData, recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    return { ...data, recipes: [{ ...withId<Recipe>({ ...recipe, createdAt: now, updatedAt: now } as Omit<Recipe, 'id'>) }, ...data.recipes] };
  },
  updateRecipe(data: StoreData, id: string, patch: Partial<Recipe>) { return { ...data, recipes: data.recipes.map((r) => r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r) }; },
  deleteRecipe(data: StoreData, id: string) { return { ...data, recipes: data.recipes.filter((r) => r.id !== id) }; },
  findRecipeByDishId(data: StoreData, dishId: string) { return data.recipes.find((r) => r.dishId === dishId); },
};
