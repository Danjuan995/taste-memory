import { Dish, MealOrder, Restaurant, TasteMemory } from '../types/index';

export const APP_NAME = '小白和小鸡毛的私房菜';
export const APP_SUBTITLE = '小白和小鸡毛的私房菜日常，把每一餐都认真留下来。';

export const mockDishes: Dish[] = [
  { id: 'd1', name: '番茄牛腩', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80', cuisine: '家常菜', description: '酸甜开胃，周末慢炖。', tags: ['暖胃', '周末'], difficulty: '中等', cookTime: 60, recommended: true, frequent: true },
  { id: 'd2', name: '椒麻鸡丝面', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80', cuisine: '面食', description: '麻香清爽，夜宵友好。', tags: ['微辣', '夜宵'], difficulty: '简单', cookTime: 25, recommended: true, frequent: false },
  { id: 'd3', name: '奶油蘑菇意面', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&auto=format&fit=crop&q=80', cuisine: '西餐', description: '奶香浓郁，适合纪念日。', tags: ['约会', '奶香'], difficulty: '简单', cookTime: 30, recommended: false, frequent: false }
];

export const mockOrders: MealOrder[] = [];
export const mockTasteMemories: TasteMemory[] = [];

export const mockRestaurants: Restaurant[] = [
  { id: 'r1', name: '暮色 Bistro', status: '已去', city: '上海', address: '徐汇区泰康路 210 号', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', type: '西餐', avgCost: 220, recommendedDishes: '惠灵顿牛排、鹅肝', review: '氛围很浪漫，适合纪念日。', score: 4.6, wantAgain: true, sourcePlatform: '大众点评', lat: 31.206, lng: 121.465, createdAt: new Date().toISOString() }
];
