export type UserName = '小白' | '小鸡毛';

export type CuisineType = '家常菜' | '川湘菜' | '粤菜' | '日料' | '西餐' | '甜品' | '轻食';

export type MealPeriod = '早餐' | '午餐' | '晚餐' | '夜宵';

export type OrderStatus = '待确认' | '已确认' | '已完成' | '已取消';

export interface Dish {
  id: string;
  name: string;
  cuisine: CuisineType;
  description: string;
  imageUrl: string;
}

export interface MealOrder {
  id: string;
  date: string;
  period: MealPeriod;
  dishIds: string[];
  note: string;
  orderedBy: UserName;
  status: OrderStatus;
}

export interface TasteMemory {
  id: string;
  imageUrl: string;
  review: string;
  dishId: string;
  chef: UserName;
  aiTitle: string;
  aiSummary: string;
  aiTags: string[];
  aiSuggestion: string;
  createdAt: string;
}

export type RestaurantStatus = '想去' | '已去';

export interface Restaurant {
  id: string;
  name: string;
  status: RestaurantStatus;
  city: string;
  address: string;
  imageUrl: string;
  avgCost: number;
  recommendedDishes: string;
  review: string;
  sourcePlatform: '美团' | '大众点评' | '小红书' | '朋友推荐';
  lat: number;
  lng: number;
}
