import { Recipe, JournalEntry, PreOrder, RestaurantFootprint } from "./types";

export const PRESEEDED_RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "森林能量沙拉",
    description: "选用当日鲜采嫩叶蔬菜、罗马生菜，搭配水煮土鸡蛋、番茄与牛油果、淋上清新油醋汁。轻盈无负担，注入元气。",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    prepTime: 15,
    difficulty: "简单",
    category: "家常菜",
    flavorTags: ["健康素食", "轻食低碳", "香草清新"]
  },
  {
    id: "r2",
    name: "安格斯肉眼牛排",
    description: "选用高等级安格斯熟成肉眼，厚切大火锁油，佐以海盐与迷迭香炙烧，肉质饱满多汁，充满馥郁脂香。",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    prepTime: 30,
    difficulty: "困难",
    category: "西餐",
    flavorTags: ["西式大餐", "浓郁肉香", "迷迭香提鲜"]
  },
  {
    id: "r3",
    name: "红油担担面",
    description: "地道川风担担面。手擀碱面筋道，淋一勺自制红油，佐以香酥芽菜肉末、碎花生和芝麻酱，麻辣顺滑极具张力。",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    prepTime: 10,
    difficulty: "简单",
    category: "川湘菜",
    flavorTags: ["地道川味", "香辣爽劲", "芽菜底蕴"]
  },
  {
    id: "r4",
    name: "那不勒斯经典披萨",
    description: "经典意式拿坡里风格。手工揉制发酵12小时面团，配莫扎里拉芝士、圣马扎诺番茄酱和新鲜罗勒烤制，麦香有嚼劲。",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    prepTime: 20,
    difficulty: "适中",
    category: "西餐",
    flavorTags: ["人气爆款", "纯正意风", "经典奶香"]
  },
  {
    id: "r5",
    name: "静谧宇治抹茶慕斯",
    description: "甄选京都宇治抹茶，微苦甘醇，慕斯体细腻幼滑，配香酥饼干底座，尽享下午茶的禅意惬意时刻。",
    image: "https://images.unsplash.com/photo-1536184071535-78906f7172c2?w=800&auto=format&fit=crop&q=80",
    prepTime: 25,
    difficulty: "适中",
    category: "甜品",
    flavorTags: ["下午茶", "微苦甘醇", "绵密如丝"]
  }
];

export const PRESEEDED_JOURNALS: JournalEntry[] = [
  {
    id: "j1",
    title: "周日晚上的番茄牛腩",
    date: "10月22日",
    mealPeriod: "晚餐",
    stars: 4,
    notes: "秋风渐起，炖了一锅热腾腾的番茄牛腩犒劳自己。买的牛腩肥瘦相间，搭配四个大番茄慢熬了两个钟头，香气溢满了整个屋子。",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80",
    aiAppreciation: "牛腩炖煮得非常软烂，番茄的酸甜度恰到好处地中和了油脂感。汤汁浓郁顺滑，这道菜充满了深秋的暖意，是一种关于“家”的温柔叙事。",
    aiSuggestions: "下一次可以尝试加入一小块陈皮，增加香气的层次感，后调会呈现更迷人的陈年果酸回甘。"
  },
  {
    id: "j2",
    title: "深夜的巧克力熔岩",
    date: "10月15日",
    mealPeriod: "下午茶",
    stars: 5,
    notes: "那是忙碌一周后，给自己的奖励。当勺子切开温热蛋糕体的那一瞬，浓郁温暖的浆液缓缓流泻出来，搭配冰凉的香草冰淇淋，冰火交融，所有的疲累都消隐无痕。",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    aiAppreciation: "巧克力火候掌控得妙到毫巅，内芯保持完美的液流熔岩状态。香草冰淇淋的冰爽衬出黑巧克力的可可醇香，冷与热在口中交融，是深夜极其奢侈而隆重的自我抚慰。",
    aiSuggestions: "下次制作时，可在面糊中轻轻撒入一小撮海盐，海盐的咸度能瞬间点化可可的深度风味，使其甜而不腻。"
  }
];

export const PRESEEDED_PREORDERS: PreOrder[] = [
  {
    id: "p1",
    date: "2026-05-25", // Next Monday
    mealPeriod: "早餐",
    name: "全麦欧包拼盘",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    note: "多加一点希腊酸奶，面包帮我微微烤脆一点，谢谢！",
    status: "已确认"
  },
  {
    id: "p2",
    date: "2026-05-25",
    mealPeriod: "午餐",
    name: "三文鱼能量碗",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    note: "三文鱼要全熟，不要加生洋葱碎，谢谢啦！",
    status: "待确认"
  },
  {
    id: "p3",
    date: "2026-05-25",
    mealPeriod: "晚餐",
    name: "地中海油醋沙拉",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    note: "多一份芝麻菜和罗勒叶哈，不加大蒜。",
    status: "已下单"
  }
];

export const PRESEEDED_FOOTPRINTS: RestaurantFootprint[] = [
  {
    id: "f1",
    name: "慢食光 · 日式甜品屋",
    posX: 38,
    posY: 32,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    visitDate: "2024-11-20",
    costPerCapita: 68,
    ratingTaste: 5,
    ratingVibe: 4,
    ratingService: 5,
    favoriteDishes: ["手冲精品咖啡", "宇治抹茶拿铁", "京都白玉大福"],
    remarks: "静安区巨鹿路拐角深处的一家温馨和风甜品屋，环境非常和雅，纯木装潢，阳光透过竹帘洒进来特别美。红豆大福极其细腻弹牙。",
    district: "静安区",
    address: "巨鹿路 758 号"
  },
  {
    id: "f2",
    name: "小町割烹 · 精致食堂",
    posX: 66,
    posY: 24,
    image: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=600&auto=format&fit=crop&q=80",
    visitDate: "2024-11-12",
    costPerCapita: 180,
    ratingTaste: 4,
    ratingVibe: 5,
    ratingService: 4,
    favoriteDishes: ["刺身拼盘", "明太子烤土豆", "极上和牛烧"],
    remarks: "极具氛围感的昭和复古小酒馆，深夜放着悠扬的老黑胶。师傅手艺顶尖，明太子土豆泥外酥里糯，是下班后解压的绝美居所。",
    district: "黄浦区",
    address: "茂名南路 120 号"
  },
  {
    id: "f3",
    name: "暮色 Bistro · 法式西餐",
    posX: 44,
    posY: 52,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    visitDate: "2024-11-05",
    costPerCapita: 260,
    ratingTaste: 5,
    ratingVibe: 5,
    ratingService: 4,
    favoriteDishes: ["黑松露惠灵顿牛排", "法式鹅肝佐红酒无花果", "黑巧克力熔岩杯"],
    remarks: "藏匿在日本街古洋房深楼的烛光浪漫小馆。火候锁得近乎完美，配上一杯西西里干红，极富惬意的复古法式老派腔调。",
    district: "徐汇区",
    address: "泰康路 210 号"
  }
];

export const CATEGORIES = ["全部", "家常菜", "川湘菜", "粤菜", "西餐", "日料", "甜品"] as const;

export const SAMPLE_FOOD_IMAGES = [
  { name: "精致牛排大餐", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" },
  { name: "有机健康色拉", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80" },
  { name: "地道川香拉面", url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80" },
  { name: "那不勒斯烤比萨", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" },
  { name: "美式烤鸡胸拼盘", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80" },
  { name: "地中海海鲜拼盘", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80" },
  { name: "和风精致甜点", url: "https://images.unsplash.com/photo-1536184071535-78906f7172c2?w=800&auto=format&fit=crop&q=80" }
];
