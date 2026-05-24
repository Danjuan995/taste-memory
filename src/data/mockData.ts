import { Dish, MealPlan, RestaurantRecord, TasteMemory } from '../types/index';

export const APP_NAME = '小白和小鸡毛的私房菜';

export const mockDishes: Dish[] = [
  { id: 'd1', name: '周末番茄牛腩', cuisine: '家常菜', description: '酸甜平衡，适合一起慢慢吃。', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80', createdBy: '小白' },
  { id: 'd2', name: '椒麻鸡丝拌面', cuisine: '川湘菜', description: '轻麻轻辣，夜宵幸福感。', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80', createdBy: '小鸡毛' },
  { id: 'd3', name: '奶油蘑菇意面', cuisine: '西餐', description: '奶香浓郁，约会感晚餐。', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&auto=format&fit=crop&q=80', createdBy: '小白' }
];

export const mockMealPlans: MealPlan[] = [
  { id: 'm1', date: '2026-05-25', period: '晚餐', dishIds: ['d1'], note: '下班后吃得暖一点', orderedBy: '小鸡毛', status: '待确认' }
];

export const mockTasteMemories: TasteMemory[] = [
  { id: 't1', dishId: 'd1', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80', review: '汤汁很浓，配饭太满足了。', cookedBy: '小白', aiTitle: '周日晚上的番茄牛腩，暖得刚刚好', aiSummary: '这次汤汁浓郁，酸甜平衡，很适合以后作为周末晚餐保留菜单。', aiTags: ['酸甜', '浓郁', '家常', '暖胃'], aiSuggestion: '下次可以减少一点炖煮时间，让口感更有层次。', createdAt: '2026-05-22T12:00:00.000Z' }
];

export const mockRestaurants: RestaurantRecord[] = [
  { id: 'r1', name: '暮色 Bistro', status: '已去', city: '上海', address: '徐汇区泰康路 210 号', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', avgCost: 220, recommendedDishes: '惠灵顿牛排、鹅肝', review: '烛光氛围很好，适合纪念日。', sourcePlatform: '大众点评', createdBy: '小鸡毛', recommendation: 5, lat: 31.206, lng: 121.465, visitedAt: '2026-05-12' },
  { id: 'r2', name: '巷口小馆', status: '想去', city: '上海', address: '静安区胶州路 318 号', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80', avgCost: 108, recommendedDishes: '葱油鸡、海鲜豆腐', review: '朋友推荐说很有家常味。', sourcePlatform: '朋友推荐', createdBy: '小白', recommendation: 4, lat: 31.232, lng: 121.448 }
];
