import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Lucide from "lucide-react";
import { JournalEntry, Recipe } from "../types";
import { SAMPLE_FOOD_IMAGES } from "../data";

interface JournalViewProps {
  key?: string;
  journals: JournalEntry[];
  recipes: Recipe[];
  onAddJournal: (journal: Omit<JournalEntry, "id">) => void;
  isFormInitiallyOpen?: boolean;
}

export default function JournalView({
  journals,
  recipes,
  onAddJournal,
  isFormInitiallyOpen = false
}: JournalViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("全部");
  const [isAddOpen, setIsAddOpen] = useState(isFormInitiallyOpen);

  // Form inputs
  const [formData, setFormData] = useState({
    title: "",
    mealPeriod: "晚餐" as JournalEntry["mealPeriod"],
    stars: 5,
    notes: "",
    image: SAMPLE_FOOD_IMAGES[0].url,
    date: "",
    aiAppreciation: "",
    aiSuggestions: ""
  });

  // AI loading status
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Handler to request AI critique from server API
  const handleAIGeneration = async () => {
    if (!formData.title.trim()) {
      setAiError("请先输入菜品名称，以便 Chef Gemini 进行鉴赏哦。");
      return;
    }
    setIsAiLoading(true);
    setAiError("");

    try {
      const response = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: formData.title,
          mealType: formData.mealPeriod,
          notes: formData.notes
        })
      });

      if (!response.ok) {
        throw new Error("杰作赏析暂未就绪，请稍后重试");
      }

      const data = await response.json();
      if (data.appreciation && data.suggestions) {
        setFormData(prev => ({
          ...prev,
          aiAppreciation: data.appreciation,
          aiSuggestions: data.suggestions
        }));
      } else {
        throw new Error("AI 返回数据格式异常");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "请求 AI 发生故障，请检查连接或稍后重试。");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Group journals by month (e.g. October, September, etc.)
  // For preseeded items: "10月22日" is October, "9月28日" is September
  const groupedJournals = useMemo(() => {
    const filters = journals.filter(j => activeFilter === "全部" || j.mealPeriod === activeFilter);
    const groups: Record<string, JournalEntry[]> = {};

    filters.forEach((entry) => {
      let month = "其他月";
      if (entry.date.includes("10月")) month = "十月";
      else if (entry.date.includes("9月")) month = "九月";
      else if (entry.date.includes("11月")) month = "十一月";
      else month = "近期回味";

      if (!groups[month]) groups[month] = [];
      groups[month].push(entry);
    });

    return groups;
  }, [journals, activeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Default current date if empty YYYY-MM-DD to custom month string
    let finalDate = formData.date;
    if (!finalDate) {
      const today = new Date();
      finalDate = `${today.getMonth() + 1}月${today.getDate()}日`;
    } else {
      // transform standard date YYYY-MM-DD input to Chinese month format
      const parts = finalDate.split("-");
      if (parts.length === 3) {
        finalDate = `${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日`;
      }
    }

    onAddJournal({
      title: formData.title,
      mealPeriod: formData.mealPeriod,
      stars: formData.stars,
      notes: formData.notes,
      image: formData.image || SAMPLE_FOOD_IMAGES[0].url,
      date: finalDate,
      aiAppreciation: formData.aiAppreciation || undefined,
      aiSuggestions: formData.aiSuggestions || undefined
    });

    // Reset Form
    setFormData({
      title: "",
      mealPeriod: "晚餐",
      stars: 5,
      notes: "",
      image: SAMPLE_FOOD_IMAGES[0].url,
      date: "",
      aiAppreciation: "",
      aiSuggestions: ""
    });
    setIsAddOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
      id="journals-feed-container"
    >
      {/* Upper Title and Floating Form Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="journal-heading-pane">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-medium text-brand-dark flex items-center gap-2">
            味蕾记忆册
          </h1>
          <p className="text-xs text-brand-brown/75 font-sans leading-relaxed">
            记下每天手制暖心菜肴的故事，让大厨 AI 为你点评和进阶。
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white px-5 py-2.5 rounded-full font-medium shadow-custom-sm text-sm inline-flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
          id="btn-open-journal-form"
        >
          <Lucide.Camera className="w-4 h-4" />
          记录今天的味道
        </button>
      </div>

      {/* Inline Section Filter */}
      <div className="flex gap-2 border-b border-cozy-beige pb-3 overflow-x-auto scrollbar-none" id="journals-filters">
        {["全部", "早餐", "午餐", "下午茶", "晚餐", "家的味道"].map((period) => {
          const isActive = activeFilter === period;
          return (
            <button
              key={period}
              onClick={() => setActiveFilter(period)}
              className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-orange text-white font-medium"
                  : "bg-white text-brand-dark border border-cozy-beige/80 hover:bg-cream/40"
              }`}
            >
              #{period}
            </button>
          );
        })}
      </div>

      {/* Display feeds of journals styled beautiful */}
      <div className="space-y-8" id="grouped-journals-feed">
        {(Object.entries(groupedJournals) as [string, JournalEntry[]][]).map(([monthGroup, list]) => (
          <div key={monthGroup} className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-display text-xl font-bold text-brand-brown tracking-wide shrink-0">
                {monthGroup}
              </span>
              <div className="h-[1px] bg-cozy-beige w-full rounded-full" />
              <span className="text-xs font-mono text-brand-brown/40 shrink-0">2026年</span>
            </div>

            <div className="space-y-6">
              {list.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white border border-cozy-beige rounded-3xl overflow-hidden shadow-custom-sm ring-1 ring-cozy-beige/25"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Visual Photo on Left/Top */}
                    <div className="aspect-video md:aspect-auto md:h-full relative overflow-hidden bg-cozy-beige">
                      <img
                        src={entry.image}
                        alt={entry.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-brand-dark/50 backdrop-blur-xs text-xs text-white px-3 py-1 rounded-full font-sans shadow-sm">
                        {entry.date} · {entry.mealPeriod}
                      </div>
                    </div>

                    {/* Description Notes on Right */}
                    <div className="p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Rating block */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-brand-dark leading-tight pr-2">
                            {entry.title}
                          </h3>
                          <div className="flex text-amber-500 shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Lucide.Star
                                key={i}
                                className={`w-4 h-4 ${i < entry.stars ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm text-brand-dark/85 font-sans leading-relaxed whitespace-pre-line">
                          {entry.notes}
                        </p>
                      </div>

                      {/* AI Expert Critique Sections */}
                      {(entry.aiAppreciation || entry.aiSuggestions) && (
                        <div className="pt-4 border-t border-cozy-beige space-y-3">
                          {/* AI Chef Critique Apprec */}
                          {entry.aiAppreciation && (
                            <div className="bg-amber-50/50 hover:bg-amber-50/70 border border-amber-100/50 rounded-2xl p-4 space-y-1.5 transition-colors">
                              <p className="text-xs font-semibold text-brand-brown/90 flex items-center gap-1.5">
                                <Lucide.Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                                AI 大厨赏析
                              </p>
                              <p className="text-xs font-sans text-brand-dark/90 leading-relaxed italic">
                                “{entry.aiAppreciation}”
                              </p>
                            </div>
                          )}

                          {/* AI Suggestions */}
                          {entry.aiSuggestions && (
                            <div className="bg-emerald-50/20 hover:bg-emerald-50/45 border border-emerald-100/30 rounded-2xl p-4 space-y-1">
                              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                                <Lucide.Sparkle className="w-3.5 h-3.5 text-emerald-600" />
                                改进建议：
                              </p>
                              <p className="text-xs font-sans text-brand-dark text-emerald-900/80 leading-relaxed font-sans pl-1">
                                {entry.aiSuggestions}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedJournals).length === 0 && (
          <div className="py-20 text-center text-brand-brown/40 text-xs font-sans">
            暂无匹配该分类的美味日志。点击右上角“记录今天的味道”写下第一篇！
          </div>
        )}
      </div>

      {/* Add Journal Dialog Overlay */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-cozy-beige rounded-3xl p-6 shadow-custom-lg w-full max-w-xl relative my-8"
              id="cooking-journal-creator-modal"
            >
              {/* Reset trigger */}
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="absolute top-4 right-4 text-brand-brown/60 hover:text-brand-dark hover:bg-cozy-beige/45 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Lucide.X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-display font-medium text-brand-dark flex items-center gap-2 mb-4">
                <Lucide.Camera className="text-brand-orange" />
                记录今天的美味味道
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Visual Cover preview selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-brand-brown/85">
                    添加餐品实拍封面
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {SAMPLE_FOOD_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: img.url }))}
                        className={`aspect-square rounded-xl overflow-hidden relative border-2 ${
                          formData.image === img.url ? "border-brand-orange scale-102 shadow-xs" : "border-transparent opacity-80"
                        }`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="或者粘贴自定义图片实拍 URL 地址..."
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full border border-cozy-beige border-dashed rounded-xl px-3.5 py-1.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/15 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title / Dish select */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      菜品名称 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="例如: 周日的番茄炖牛腩"
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 font-sans"
                    />
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      烹饪/品尝日期 (选填，默认今天)
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none bg-cream/20 font-mono text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Period selection */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      品尝时段
                    </label>
                    <div className="flex gap-1.5 bg-cozy-beige/40 p-1 rounded-xl overflow-x-auto scrollbar-none">
                      {["早餐", "午餐", "下午茶", "晚餐", "家的味道"].map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, mealPeriod: period as JournalEntry["mealPeriod"] }))}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-medium grow text-center shrink-0 transition-all cursor-pointer ${
                            formData.mealPeriod === period
                              ? "bg-brand-orange text-white"
                              : "text-brand-dark/70 hover:bg-cream/40"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Stars selection */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-2">
                      本次手艺美食评分
                    </label>
                    <div className="flex gap-2 text-amber-500 py-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const starVal = idx + 1;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, stars: starVal }))}
                            className="hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Lucide.Star
                              className={`w-6 h-6 ${starVal <= formData.stars ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Diary story notes */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    记下这次相遇的故事或烹饪日记 *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="今天买的食材怎么样？慢熬发生了什么趣事？还是街角的惊喜？"
                    className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 font-sans"
                  />
                </div>

                {/* Gemini AI smart assist generator block */}
                <div className="border border-amber-200 bg-amber-50/20 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-brand-brown flex items-center gap-1">
                        <Lucide.Sparkles className="w-4 h-4 text-brand-orange" />
                        Gemini 智能大厨鉴赏助攻
                      </p>
                      <p className="text-[10px] text-brand-brown/50">
                        智能根据菜名和烹饪日志生成美轮美奂的专业品评与实用技艺精进秘诀。
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isAiLoading}
                      onClick={handleAIGeneration}
                      className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                    >
                      {isAiLoading ? (
                        <>
                          <Lucide.Loader2 className="w-3.5 h-3.5 animate-spin" />
                          品尝中...
                        </>
                      ) : (
                        <>
                          <Lucide.Wand2 className="w-3.5 h-3.5" />
                          AI 一键鉴赏
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Loader feedback message inside */}
                  {isAiLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 py-3 px-2 bg-amber-50/60 rounded-xl"
                    >
                      <Lucide.ChefHat className="w-5 h-5 text-brand-orange animate-bounce shrink-0" />
                      <span className="text-xs text-brand-brown font-medium animate-pulse">
                        主厨 Gemini 正在认真品鉴您的杰作，构思赏析妙文与改进计策...
                      </span>
                    </motion.div>
                  )}

                  {aiError && (
                    <p className="text-xs text-red-500 font-medium">⚠️ {aiError}</p>
                  )}

                  {/* Display fields to save edit preview */}
                  {(formData.aiAppreciation || formData.aiSuggestions) && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-brand-brown mb-1">
                          [生成预览] 大厨赏析
                        </label>
                        <textarea
                          rows={2}
                          value={formData.aiAppreciation}
                          onChange={(e) => setFormData(prev => ({ ...prev, aiAppreciation: e.target.value }))}
                          className="w-full border border-amber-200 rounded-xl p-2 text-xs text-brand-dark bg-white font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-brand-brown mb-1">
                          [生成预览] 改进建议
                        </label>
                        <textarea
                          rows={2}
                          value={formData.aiSuggestions}
                          onChange={(e) => setFormData(prev => ({ ...prev, aiSuggestions: e.target.value }))}
                          className="w-full border border-amber-200 rounded-xl p-2 text-xs text-brand-dark bg-white font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cancel Save Submission Triggers */}
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
                    className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-sm text-white font-medium shadow-custom-sm transition-all active:scale-97 cursor-pointer"
                  >
                    保存这份记忆
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
