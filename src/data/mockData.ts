import { Dish, MealOrder, Recipe, Restaurant, TasteMemory } from '../types/index';

export const APP_NAME = '小白和小鸡毛的私房菜';
export const APP_SUBTITLE = '记录小白和小鸡毛的私房菜日常，把每一餐都认真留下来。';

export const mockDishes: Dish[] = [
  { id: 'd1', name: '番茄牛腩', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1000&auto=format&fit=crop&q=80', cuisine: '家常菜', description: '酸甜开胃，周末慢炖。', tags: ['暖胃', '周末'], difficulty: '中等', cookTime: 60, recommended: true, frequent: true },
  { id: 'd2', name: '葱油拌面', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1000&auto=format&fit=crop&q=80', cuisine: '面食', description: '麻香清爽，夜宵友好。', tags: ['微辣', '夜宵'], difficulty: '简单', cookTime: 25, recommended: true, frequent: false },
  { id: 'd3', name: '玉米排骨汤', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1000&auto=format&fit=crop&q=80', cuisine: '汤羹', description: '清甜暖胃，适合全家。', tags: ['清甜', '家常'], difficulty: '简单', cookTime: 70, recommended: true, frequent: true },
];

const now = new Date().toISOString();
export const mockRecipes: Recipe[] = [
  { id: 'rp1', dishId: 'd1', name: '番茄牛腩', coverImageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&auto=format&fit=crop&q=80', cuisine: '家常菜', description: '酸甜浓郁、汤汁拌饭很香。', ingredients: [{ id: 'i1', name: '牛腩', amount: '500g' }, { id: 'i2', name: '番茄', amount: '3个' }, { id: 'i3', name: '洋葱', amount: '半个' }, { id: 'i4', name: '土豆', amount: '1个' }, { id: 'i5', name: '番茄膏', amount: '1勺' }], steps: [{ id: 's1', order: 1, title: '焯水', description: '牛腩冷水下锅焯水去血沫。', duration: 8 }, { id: 's2', order: 2, title: '炒香', description: '洋葱和番茄炒软，加入番茄膏。', duration: 10 }, { id: 's3', order: 3, title: '炖煮', description: '加入牛腩和热水，小火慢炖。', duration: 60 }, { id: 's4', order: 4, title: '收汁', description: '放土豆再炖至软烂后收汁。', duration: 15 }], tips: '番茄要炒到出沙，汤会更浓。', difficulty: 'normal', cookingTime: 90, servings: 2, createdBy: 'xiaobai', tags: ['暖胃', '浓郁', '家常'], createdAt: now, updatedAt: now },
  { id: 'rp2', dishId: 'd2', name: '葱油拌面', coverImageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000&auto=format&fit=crop&q=80', cuisine: '面食', description: '十几分钟就能完成的快手满足。', ingredients: [{ id: 'i21', name: '面条', amount: '2人份' }, { id: 'i22', name: '小葱', amount: '1把' }, { id: 'i23', name: '生抽', amount: '2勺' }, { id: 'i24', name: '老抽', amount: '半勺' }, { id: 'i25', name: '糖', amount: '1小勺' }], steps: [{ id: 's21', order: 1, title: '熬葱油', description: '小火把葱段炸到焦黄。', duration: 8 }, { id: 's22', order: 2, title: '调酱汁', description: '生抽老抽糖加少量面汤调匀。', duration: 3 }, { id: 's23', order: 3, title: '煮面', description: '面条煮到弹牙后捞出。', duration: 6 }, { id: 's24', order: 4, title: '拌匀', description: '葱油和酱汁拌面，撒葱花。', duration: 2 }], tips: '葱油一定要小火慢熬，避免发苦。', difficulty: 'easy', cookingTime: 20, servings: 2, createdBy: 'xiaojimao', tags: ['快手', '夜宵', '香'], createdAt: now, updatedAt: now },
  { id: 'rp3', dishId: 'd3', name: '玉米排骨汤', coverImageUrl: 'https://images.unsplash.com/photo-1582450871972-ab5ca7973fda?w=1000&auto=format&fit=crop&q=80', cuisine: '汤羹', description: '清甜解腻，四季都适合。', ingredients: [{ id: 'i31', name: '排骨', amount: '500g' }, { id: 'i32', name: '玉米', amount: '1根' }, { id: 'i33', name: '胡萝卜', amount: '1根' }, { id: 'i34', name: '姜片', amount: '4片' }], steps: [{ id: 's31', order: 1, title: '焯水', description: '排骨焯水后冲净。', duration: 8 }, { id: 's32', order: 2, title: '炖汤', description: '排骨与玉米胡萝卜加足量水炖煮。', duration: 70 }, { id: 's33', order: 3, title: '调味', description: '出锅前加盐即可。', duration: 2 }], tips: '加一颗红枣会更甜润。', difficulty: 'easy', cookingTime: 80, servings: 3, createdBy: 'xiaobai', tags: ['清甜', '汤羹', '家常'], createdAt: now, updatedAt: now },
];

export const mockOrders: MealOrder[] = [];
export const mockTasteMemories: TasteMemory[] = [];
export const mockRestaurants: Restaurant[] = [];
