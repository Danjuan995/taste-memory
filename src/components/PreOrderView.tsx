import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Lucide from "lucide-react";
import { Recipe, PreOrder } from "../types";

interface PreOrderViewProps {
  key?: string;
  preOrders: PreOrder[];
  recipes: Recipe[];
  onAddPreOrder: (preOrder: Omit<PreOrder, "id">) => void;
  onUpdateStatus: (id: string, status: PreOrder["status"]) => void;
  onDeletePreOrder: (id: string) => void;
}

export default function PreOrderView({
  preOrders,
  recipes,
  onAddPreOrder,
  onUpdateStatus,
  onDeletePreOrder
}: PreOrderViewProps) {
  // We'll offer a slider of 5 dates starting from today
  const dates = useMemo(() => {
    const arr = [];
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const baseDate = new Date("2026-05-25"); // Anchor day to keep preseeded synced: May 25, 2026 Monday

    for (let i = 0; i < 5; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const isostring = d.toISOString().split("T")[0]; // YYYY-MM-DD
      arr.push({
        isoString: isostring,
        dayNum: d.getDate(),
        weekday: weekdays[d.getDay()],
        label: `${d.getMonth() + 1}月${d.getDate()}日`
      });
    }
    return arr;
  }, []);

  const [selectedDateIso, setSelectedDateIso] = useState<string>(dates[0].isoString);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    mealPeriod: "早餐" as PreOrder["mealPeriod"],
    note: "",
    recipeId: ""
  });

  // Filter orders active on selected date
  const filteredOrders = useMemo(() => {
    return preOrders.filter(order => order.date === selectedDateIso);
  }, [preOrders, selectedDateIso]);

  // Handle selected recipe changes to autofill name
  const handleRecipeSelect = (rid: string) => {
    const rec = recipes.find(r => r.id === rid);
    if (rec) {
      setFormData(prev => ({
        ...prev,
        recipeId: rid,
        name: rec.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recipeId: "",
        name: ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const matchedRecipe = recipes.find(r => r.id === formData.recipeId || r.name === formData.name);

    onAddPreOrder({
      date: selectedDateIso,
      mealPeriod: formData.mealPeriod,
      name: formData.name,
      note: formData.note,
      status: "待确认",
      image: matchedRecipe?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80"
    });

    // Reset Form
    setFormData({
      name: "",
      mealPeriod: "早餐",
      note: "",
      recipeId: ""
    });
    setIsAddOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
      id="preorder-view-container"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="preorder-header-pane">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-medium text-brand-dark flex items-center gap-2">
            预约点菜
          </h1>
          <p className="text-xs text-brand-brown/75 font-sans leading-relaxed">
            规划你的一日三餐，预约健康的家庭私房膳食。
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white px-5 py-2.5 rounded-full font-medium shadow-custom-sm text-sm inline-flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
          id="btn-preorder-add-float"
        >
          <Lucide.Plus className="w-4 h-4" />
          预约点菜
        </button>
      </div>

      {/* Date Slider Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" id="date-slider-row">
        {dates.map((d) => {
          const isActive = d.isoString === selectedDateIso;
          return (
            <button
              key={d.isoString}
              onClick={() => setSelectedDateIso(d.isoString)}
              className={`flex flex-col items-center justify-center p-3 w-16 h-20 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-brand-orange border-brand-orange text-white shadow-custom-md scale-102"
                  : "bg-white border-cozy-beige text-brand-dark/70 hover:border-brand-orange/30 hover:bg-cream/40"
              }`}
            >
              <span className="text-[11px] font-medium tracking-wide">
                {d.weekday}
              </span>
              <span className="text-xl font-bold font-mono tracking-tighter mt-1">
                {d.dayNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Meals Group Block */}
      <div className="space-y-5" id="scheduled-meals-list">
        {["早餐", "午餐", "晚餐"].map((period) => {
          const meals = filteredOrders.filter(o => o.mealPeriod === period);
          const icon = period === "早餐" ? "🌅" : period === "午餐" ? "☀️" : "🌙";

          return (
            <div key={period} className="space-y-3">
              <h2 className="text-base font-display font-medium text-brand-dark flex items-center gap-2 px-1">
                <span className="text-lg">{icon}</span>
                {period}
              </h2>

              {meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meals.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white border border-cozy-beige rounded-2xl p-4 shadow-custom-sm flex gap-4 relative overflow-hidden group"
                    >
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-cozy-beige"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 my-auto flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-semibold text-sm text-brand-dark truncate pr-14">
                            {order.name}
                          </h3>
                          {/* Toggle Status Tag Interaction */}
                          <button
                            onClick={() => {
                              const nextStatusMap: Record<PreOrder["status"], PreOrder["status"]> = {
                                "已下单": "待确认",
                                "待确认": "已确认",
                                "已确认": "准备中",
                                "准备中": "已下单"
                              };
                              onUpdateStatus(order.id, nextStatusMap[order.status]);
                            }}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                              order.status === "已确认" || order.status === "已下单"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 font-medium"
                                : order.status === "准备中"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-gray-50 text-gray-500 border-gray-200"
                            }`}
                          >
                            {order.status}
                          </button>
                        </div>
                        {order.note ? (
                          <p className="text-xs font-sans text-brand-brown/70 italic leading-relaxed truncate">
                            “{order.note}”
                          </p>
                        ) : (
                          <p className="text-xs font-sans text-brand-brown/40 italic leading-relaxed">
                            无备注要求
                          </p>
                        )}
                      </div>

                      {/* Delete action */}
                      <button
                        onClick={() => onDeletePreOrder(order.id)}
                        className="absolute bottom-3 right-3 text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="取消预约"
                      >
                        <Lucide.Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-cream/15 border border-dashed border-cozy-beige/70 rounded-2xl py-6 px-4 text-center text-xs text-brand-brown/40 font-sans">
                  空荡荡的，暂无预约该餐点。
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Order Dialog Overlay */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-cozy-beige rounded-3xl p-6 shadow-custom-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-4 right-4 text-brand-brown/60 hover:text-brand-dark hover:bg-cozy-beige/45 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Lucide.X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-display font-medium text-brand-dark mb-4">
                预订美味一餐
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Recipe Select */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    从私房菜单中快速点菜
                  </label>
                  <select
                    value={formData.recipeId}
                    onChange={(e) => handleRecipeSelect(e.target.value)}
                    className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20"
                  >
                    <option value="">-- 手工自定义菜品 --</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.category})</option>
                    ))}
                  </select>
                </div>

                {/* Hand-written name */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    菜品名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="输入菜品名称，如：番茄炒蛋"
                    className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20"
                  />
                </div>

                {/* Meal Period */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    就餐时段
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["早餐", "午餐", "晚餐"].map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mealPeriod: period as PreOrder["mealPeriod"] }))}
                        className={`py-1.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                          formData.mealPeriod === period
                            ? "bg-brand-orange border-brand-orange text-white"
                            : "border-cozy-beige text-brand-dark/70 hover:bg-cream/40"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customized note */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    就餐备注与喜好需求
                  </label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="如：少油、不加洋葱蒜、牛排七分熟等"
                    className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-cozy-beige text-sm text-brand-brown font-medium hover:bg-gray-50 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-orange text-sm text-white font-medium hover:bg-brand-orange-hover transition-all active:scale-97 cursor-pointer"
                  >
                    确认预约
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
