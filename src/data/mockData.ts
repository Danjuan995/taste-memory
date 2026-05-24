import { Dish, MealOrder, Restaurant, TasteMemory } from '../types/index';

export const APP_NAME = '小白和小鸡毛的私房菜';

export const mockDishes: Dish[] = [
  { id: 'd1', name: '番茄牛腩', cuisine: '家常菜', description: '酸甜开胃，周末慢炖。', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80' },
  { id: 'd2', name: '椒麻鸡丝面', cuisine: '川湘菜', description: '微麻微辣，夜宵刚刚好。', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80' },
  { id: 'd3', name: '奶油蘑菇意面', cuisine: '西餐', description: '奶香浓郁，适合约会晚餐。', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&auto=format&fit=crop&q=80' }
];

export const mockOrders: MealOrder[] = [];
export const mockTasteMemories: TasteMemory[] = [];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'r1', name: '暮色 Bistro', status: '已去', city: '上海', address: '徐汇区泰康路 210 号',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    avgCost: 220, recommendedDishes: '惠灵顿牛排、鹅肝', review: '氛围很浪漫，适合纪念日。', sourcePlatform: '大众点评', lat: 31.206, lng: 121.465
  }
];
