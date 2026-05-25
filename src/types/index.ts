export type UserName = '小白' | '小鸡毛';

export type CuisineType =
  | '家常菜'
  | '川湘菜'
  | '江浙菜'
  | '粤菜'
  | '西餐'
  | '面食'
  | '甜品'
  | '汤羹'
  | '早餐'
  | '夜宵';

export type MealPeriod = '早餐' | '午餐' | '晚餐' | '夜宵';
export type OrderStatus = '待确认' | '已确认' | '已完成' | '已取消';

export interface Dish {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: CuisineType;
  description: string;
  tags: string[];
  difficulty: '简单' | '中等' | '进阶';
  cookTime: number;
  recommended: boolean;
  frequent: boolean;
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
  dishId?: string;
  dishName: string;
  imageUrl: string;
  review?: string;
  experience?: string;
  comment?: string;
  message?: string;
  note?: string;
  tags?: string[];
  title?: string;
  chef: UserName;
  rating?: number;
  wantAgain: boolean;
  aiTitle: string;
  aiSummary: string;
  aiTags: string[];
  aiSuggestion: string;
  createdAt: string;
}

export type RecipeDifficulty = 'easy' | 'normal' | 'hard';

export type RecipeIngredient = {
  id: string;
  name: string;
  amount?: string;
  note?: string;
};

export type RecipeStep = {
  id: string;
  order: number;
  title?: string;
  description: string;
  imageUrl?: string;
  duration?: number;
};

export type Recipe = {
  id: string;
  dishId?: string;
  name: string;
  coverImageUrl?: string;
  cuisine: CuisineType;
  description?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tips?: string;
  difficulty: RecipeDifficulty;
  cookingTime: number;
  servings?: number;
  createdBy: 'xiaobai' | 'xiaojimao';
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type RestaurantStatus = '想去' | '已去';
export type SourcePlatform = '手动' | '美团' | '大众点评' | '高德';

export interface Restaurant {
  id: string;
  name: string;
  status: RestaurantStatus;
  city: string;
  address: string;
  imageUrl: string;
  type: string;
  avgCost: number;
  recommendedDishes: string;
  review: string;
  score: number;
  wantAgain: boolean;
  sourcePlatform: SourcePlatform;
  lat: number;
  lng: number;
  createdAt: string;
}

export type AppTab = 'home' | 'meal' | 'menu' | 'recipes' | 'footprint';
