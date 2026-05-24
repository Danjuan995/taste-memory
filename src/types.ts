export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: number; // in minutes
  difficulty: "简单" | "适中" | "困难";
  category: "家常菜" | "川湘菜" | "粤菜" | "西餐" | "日料" | "甜品";
  flavorTags: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string; // "10月22日"
  mealPeriod: "早餐" | "午餐" | "下午茶" | "晚餐" | "家的味道";
  stars: number;
  notes: string;
  image: string;
  aiAppreciation?: string;
  aiSuggestions?: string;
}

export interface PreOrder {
  id: string;
  date: string; // YYYY-MM-DD
  mealPeriod: "早餐" | "午餐" | "晚餐";
  name: string;
  image?: string;
  note: string; // "多加一点希腊酸奶，谢谢"
  status: "已下单" | "待确认" | "已确认" | "准备中";
}

export interface RestaurantFootprint {
  id: string;
  name: string;
  posX: number; // percentage coordinate 0-100 on mock map
  posY: number; // percentage coordinate 0-100 on mock map
  image: string;
  visitDate: string; // "2024-11-12"
  costPerCapita: number;
  ratingTaste: number; // 1-5
  ratingVibe: number; // 1-5
  ratingService: number; // 1-5
  favoriteDishes: string[];
  remarks: string;
  district?: string; // "静安区"
  address?: string; // "巨鹿路 758 号"
}
