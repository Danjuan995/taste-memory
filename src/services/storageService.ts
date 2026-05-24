import { mockDishes, mockOrders, mockRestaurants, mockTasteMemories } from '../data/mockData';
import { Dish, MealOrder, Restaurant, TasteMemory } from '../types/index';

const KEY = 'taste_memory_v3';

export interface StoreData {
  dishes: Dish[];
  orders: MealOrder[];
  memories: TasteMemory[];
  restaurants: Restaurant[];
}

const fallback: StoreData = { dishes: mockDishes, orders: mockOrders, memories: mockTasteMemories, restaurants: mockRestaurants };

const withId = <T extends object>(item: Omit<T, 'id'>): T => ({ ...item, id: crypto.randomUUID() } as T);

export const storageService = {
  loadAll(): StoreData {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    try { return { ...fallback, ...JSON.parse(raw) }; } catch { return fallback; }
  },
  saveAll(data: StoreData) { localStorage.setItem(KEY, JSON.stringify(data)); },
  addDish(data: StoreData, dish: Omit<Dish, 'id'>) { return { ...data, dishes: [withId<Dish>(dish), ...data.dishes] }; },
  updateDish(data: StoreData, id: string, patch: Partial<Dish>) { return { ...data, dishes: data.dishes.map((d) => d.id === id ? { ...d, ...patch } : d) }; },
  deleteDish(data: StoreData, id: string) { return { ...data, dishes: data.dishes.filter((d) => d.id !== id) }; },
  addOrder(data: StoreData, order: Omit<MealOrder, 'id'>) { return { ...data, orders: [withId<MealOrder>(order), ...data.orders] }; },
  updateOrder(data: StoreData, id: string, patch: Partial<MealOrder>) { return { ...data, orders: data.orders.map((o) => o.id === id ? { ...o, ...patch } : o) }; },
  addMemory(data: StoreData, memory: Omit<TasteMemory, 'id' | 'createdAt'>) { return { ...data, memories: [{ ...withId<TasteMemory>({ ...memory, createdAt: new Date().toISOString() } as Omit<TasteMemory, 'id'>) }, ...data.memories] }; },
  addRestaurant(data: StoreData, restaurant: Omit<Restaurant, 'id' | 'createdAt'>) { return { ...data, restaurants: [{ ...withId<Restaurant>({ ...restaurant, createdAt: new Date().toISOString() } as Omit<Restaurant, 'id'>) }, ...data.restaurants] }; },
  updateRestaurant(data: StoreData, id: string, patch: Partial<Restaurant>) { return { ...data, restaurants: data.restaurants.map((r) => r.id === id ? { ...r, ...patch } : r) }; }
};
