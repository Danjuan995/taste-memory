import { Dish, MealOrder, Restaurant, TasteMemory } from '../types/index';

export const APP_NAME = '小白和小鸡毛的私房菜';
export const APP_SUBTITLE = '记录小白和小鸡毛的私房菜日常，把每一餐都认真留下来。';

export const mockDishes: Dish[] = [
  { id: 'd1', name: '番茄牛腩', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1000&auto=format&fit=crop&q=80', cuisine: '家常菜', description: '酸甜开胃，周末慢炖。', tags: ['暖胃', '周末'], difficulty: '中等', cookTime: 60, recommended: true, frequent: true },
  { id: 'd2', name: '椒麻鸡丝面', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1000&auto=format&fit=crop&q=80', cuisine: '面食', description: '麻香清爽，夜宵友好。', tags: ['微辣', '夜宵'], difficulty: '简单', cookTime: 25, recommended: true, frequent: false },
  { id: 'd3', name: '奶油蘑菇意面', imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1000&auto=format&fit=crop&q=80', cuisine: '西餐', description: '奶香浓郁，适合纪念日。', tags: ['约会', '奶香'], difficulty: '简单', cookTime: 30, recommended: false, frequent: false },
  { id: 'd4', name: '椰香芒果布丁', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1000&auto=format&fit=crop&q=80', cuisine: '甜品', description: '清甜柔滑，饭后幸福感拉满。', tags: ['甜品', '夏日'], difficulty: '简单', cookTime: 20, recommended: true, frequent: false },
  { id: 'd5', name: '菌菇豆腐汤', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1000&auto=format&fit=crop&q=80', cuisine: '汤羹', description: '清爽鲜香，晚上喝也没负担。', tags: ['轻食', '家常'], difficulty: '简单', cookTime: 18, recommended: false, frequent: true }
];

export const mockOrders: MealOrder[] = [];
export const mockTasteMemories: TasteMemory[] = [
  { id: 'm1', dishId: 'd1', dishName: '番茄牛腩', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1000&auto=format&fit=crop&q=80', review: '牛腩炖得很软，番茄味层次更好了。', aiTitle: '微酸浓香的一锅安心感', aiSummary: '今天这道番茄牛腩更偏家常温暖风，酸甜平衡、汤汁浓郁，适合拌饭。', aiTags: ['暖胃', '家常', '下饭'], aiSuggestion: '下次可以加一点胡萝卜块，口感会更丰富。', chef: '小白', rating: 5, wantAgain: true, createdAt: new Date().toISOString() }
];

export const mockRestaurants: Restaurant[] = [
  { id: 'r1', name: '暮色 Bistro', status: '已去', city: '上海', address: '徐汇区泰康路 210 号', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80', type: '西餐', avgCost: 220, recommendedDishes: '惠灵顿牛排、鹅肝', review: '氛围很浪漫，适合纪念日。', score: 4.6, wantAgain: true, sourcePlatform: '大众点评', lat: 31.206, lng: 121.465, createdAt: new Date().toISOString() },
  { id: 'r2', name: '半山汤屋', status: '想去', city: '杭州', address: '西湖区龙井路 98 号', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&auto=format&fit=crop&q=80', type: '汤锅', avgCost: 148, recommendedDishes: '菌菇汤、牛肉丸', review: '木质庭院很舒服，汤底清甜。', score: 4.4, wantAgain: true, sourcePlatform: '手动', lat: 30.25, lng: 120.13, createdAt: new Date().toISOString() }
];
