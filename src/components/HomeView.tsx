import { motion } from "motion/react";
import * as Lucide from "lucide-react";
import { Star, MapPin } from "lucide-react";
import { Recipe, JournalEntry, PreOrder, RestaurantFootprint } from "../types";

interface HomeViewProps {
  key?: string;
  kitchenName: string;
  preOrders: PreOrder[];
  recipes: Recipe[];
  journals: JournalEntry[];
  footprints: RestaurantFootprint[];
  onNavigate: (tab: "home" | "order" | "menu" | "journal" | "footprints") => void;
  onOpenAddRecipe: () => void;
  onOpenAddJournal: () => void;
  onOpenAddFootprint: () => void;
}

export default function HomeView({
  kitchenName,
  preOrders,
  recipes,
  journals,
  footprints,
  onNavigate,
  onOpenAddRecipe,
  onOpenAddJournal,
  onOpenAddFootprint
}: HomeViewProps) {
  // Get today's bookings (we map YYYY-MM-DD to preseeded/state)
  const todayStr = "2026-05-25"; // Matches next date in reservation
  const todayOrders = preOrders.filter(o => o.date === todayStr);

  const breakfastMeal = todayOrders.find(o => o.mealPeriod === "早餐");
  const lunchMeal = todayOrders.find(o => o.mealPeriod === "午餐");
  const dinnerMeal = todayOrders.find(o => o.mealPeriod === "晚餐");

  // Get latest cook journal
  const latestJournal = journals[0] || null;

  // Get latest footprint
  const latestFootprint = footprints[0] || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
      id="home-view-container"
    >
      {/* Greeting Banner */}
      <div className="space-y-2 mt-2">
        <h1 className="text-4xl font-display font-medium text-brand-dark tracking-tight">
          今天想吃点什么？
        </h1>
        <p className="text-sm font-sans text-brand-brown/75 leading-relaxed tracking-wide">
          让每一餐都成为值得回味的记忆。
        </p>
      </div>

      {/* Bento Grid Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="home-actions-grid">
        <button
          onClick={() => onNavigate("order")}
          className="flex flex-col items-center justify-center p-6 bg-white border border-cozy-beige rounded-3xl hover:border-brand-orange/40 hover:bg-cream/50 transition-all shadow-custom-sm text-center group cursor-pointer"
          id="btn-nav-preorder"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform mb-3">
            <Lucide.CalendarDays className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-brand-dark">预约点菜</span>
        </button>

        <button
          onClick={onOpenAddRecipe}
          className="flex flex-col items-center justify-center p-6 bg-white border border-cozy-beige rounded-3xl hover:border-brand-orange/40 hover:bg-cream/50 transition-all shadow-custom-sm text-center group cursor-pointer"
          id="btn-open-recipe"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-3">
            <Lucide.PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-brand-dark">新增菜品</span>
        </button>

        <button
          onClick={onOpenAddJournal}
          className="flex flex-col items-center justify-center p-6 bg-white border border-cozy-beige rounded-3xl hover:border-brand-orange/40 hover:bg-cream/50 transition-all shadow-custom-sm text-center group cursor-pointer"
          id="btn-open-journal"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform mb-3">
            <Lucide.BookOpen className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-brand-dark">记录下厨</span>
        </button>

        <button
          onClick={onOpenAddFootprint}
          className="flex flex-col items-center justify-center p-6 bg-white border border-cozy-beige rounded-3xl hover:border-brand-orange/40 hover:bg-cream/50 transition-all shadow-custom-sm text-center group cursor-pointer"
          id="btn-open-footprints"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform mb-3">
            <Lucide.Compass className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-brand-dark">记录探店</span>
        </button>
      </div>

      {/* Today's Preorders Container */}
      <div className="bg-white border border-cozy-beige rounded-3xl p-6 shadow-custom-sm space-y-4" id="home-today-preorders">
        <div className="flex justify-between items-center pb-2 border-b border-cozy-beige">
          <h2 className="text-lg font-display font-medium text-brand-dark flex items-center gap-2">
            <Lucide.Flame className="w-5 h-5 text-brand-orange" />
            今日点菜
          </h2>
          <span className="text-xs font-mono text-brand-brown/60 bg-cozy-beige/40 px-2.5 py-1 rounded-full">
            5月25日 星期一
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Breakfast */}
          <div className="flex items-center justify-between p-3.5 bg-cream/30 border border-cream/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌅</span>
              <div>
                <p className="text-xs text-brand-brown/50">早餐</p>
                <p className="text-sm font-medium text-brand-dark">
                  {breakfastMeal ? breakfastMeal.name : "待预订..."}
                </p>
              </div>
            </div>
            {breakfastMeal ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                {breakfastMeal.status}
              </span>
            ) : (
              <button
                onClick={() => onNavigate("order")}
                className="text-xs font-medium text-brand-orange hover:text-brand-orange-hover"
              >
                去点菜
              </button>
            )}
          </div>

          {/* Lunch */}
          <div className="flex items-center justify-between p-3.5 bg-cream/30 border border-cream/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-lg">☀️</span>
              <div>
                <p className="text-xs text-brand-brown/50">午餐</p>
                <p className="text-sm font-medium text-brand-dark">
                  {lunchMeal ? lunchMeal.name : "待预订..."}
                </p>
              </div>
            </div>
            {lunchMeal ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                {lunchMeal.status}
              </span>
            ) : (
              <button
                onClick={() => onNavigate("order")}
                className="text-xs font-medium text-brand-orange hover:text-brand-orange-hover"
              >
                去点菜
              </button>
            )}
          </div>

          {/* Dinner */}
          <div className="flex items-center justify-between p-3.5 bg-cream/30 border border-cream/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌙</span>
              <div>
                <p className="text-xs text-brand-brown/50">晚餐</p>
                <p className="text-sm font-medium text-brand-dark">
                  {dinnerMeal ? dinnerMeal.name : "待预订..."}
                </p>
              </div>
            </div>
            {dinnerMeal ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                {dinnerMeal.status}
              </span>
            ) : (
              <button
                onClick={() => onNavigate("order")}
                className="text-xs font-medium text-brand-orange hover:text-brand-orange-hover"
              >
                去点菜
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Cook Journal Preview */}
        <div className="bg-white border border-cozy-beige rounded-3xl p-6 shadow-custom-sm space-y-4" id="home-latest-journal">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-display font-medium text-brand-dark flex items-center gap-2">
              <Lucide.Sparkles className="w-5 h-5 text-brand-orange" />
              最近下厨记忆
            </h2>
            <button
              onClick={() => onNavigate("journal")}
              className="text-xs text-brand-orange font-medium flex items-center gap-0.5 hover:underline"
            >
              往期日志 <Lucide.ArrowRight className="w-3" />
            </button>
          </div>

          {latestJournal ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={latestJournal.image}
                  alt={latestJournal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-brand-dark/60 backdrop-blur-xs text-[11px] text-white px-2.5 py-1 rounded-full font-sans">
                  {latestJournal.date} · {latestJournal.mealPeriod}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-brand-dark leading-snug">
                    {latestJournal.title}
                  </h3>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < latestJournal.stars ? "fill-amber-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-sans text-brand-brown/70 line-clamp-2">
                  {latestJournal.notes}
                </p>

                {/* AI Snippet */}
                {latestJournal.aiAppreciation && (
                  <div className="bg-amber-50/50 hover:bg-amber-50/80 transition-colors border border-amber-100/50 rounded-2xl p-3.5 space-y-1.5 mt-2">
                    <p className="text-[11px] font-medium text-brand-brown flex items-center gap-1">
                      <Lucide.Sparkle className="w-3 h-3 text-brand-orange animate-pulse" />
                      AI 赏析片段
                    </p>
                    <p className="text-xs text-brand-dark/85 font-sans leading-relaxed line-clamp-2">
                      “{latestJournal.aiAppreciation}”
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-brand-brown/40 text-xs">
              暂无下厨日志，立即点击上方“记录下厨”创建首个记忆！
            </div>
          )}
        </div>

        {/* Latest Restaurant footprint Preview */}
        <div className="bg-white border border-cozy-beige rounded-3xl p-6 shadow-custom-sm space-y-4" id="home-latest-footprint">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-display font-medium text-brand-dark flex items-center gap-2">
              <Lucide.MapPin className="w-5 h-5 text-brand-orange" />
              最近探店记录
            </h2>
            <button
              onClick={() => onNavigate("footprints")}
              className="text-xs text-brand-orange font-medium flex items-center gap-0.5 hover:underline text-right"
              id="link-explore-map"
            >
              查看地图
            </button>
          </div>

          {latestFootprint ? (
            <div className="flex items-center gap-4 p-3 border border-cozy-beige rounded-2xl hover:bg-cream/20 transition-all">
              <img
                src={latestFootprint.image}
                alt={latestFootprint.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1 overflow-hidden">
                <span className="inline-block text-[10px] bg-emerald-50 text-emerald-600 font-medium px-2 py-0.5 rounded-full">
                  极力推荐
                </span>
                <h3 className="font-semibold text-sm text-brand-dark truncate">
                  {latestFootprint.name}
                </h3>
                <p className="text-xs text-brand-brown/60 flex items-center gap-0.5 font-sans truncate">
                  <MapPin className="w-3 h-3 text-brand-orange shrink-0" />
                  {latestFootprint.district} {latestFootprint.address}
                </p>
                <div className="flex items-center gap-3 pt-0.5 text-[11px] text-brand-brown/70">
                  <span className="font-mono bg-cozy-beige/40 px-1.5 py-0.5 rounded-sm">
                    人均 ¥{latestFootprint.costPerCapita}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{latestFootprint.ratingTaste}.0</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-brand-brown/40 text-xs">
              暂无探店记录，赶紧点击上方“记录探店”分享精彩好店！
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
