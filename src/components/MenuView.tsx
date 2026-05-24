import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Lucide from "lucide-react";
import { Recipe } from "../types";
import { CATEGORIES, SAMPLE_FOOD_IMAGES } from "../data";

interface MenuViewProps {
  key?: string;
  recipes: Recipe[];
  onAddRecipe: (recipe: Omit<Recipe, "id">) => void;
  onQuickPreOrder: (recipe: Recipe) => void;
  isFormInitiallyOpen?: boolean;
}

export default function MenuView({
  recipes,
  onAddRecipe,
  onQuickPreOrder,
  isFormInitiallyOpen = false
}: MenuViewProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [isAddOpen, setIsAddOpen] = useState(isFormInitiallyOpen);

  // Form states to add new recipe
  const [recipeForm, setRecipeForm] = useState({
    name: "",
    category: "家常菜" as Recipe["category"],
    description: "",
    prepTime: 45,
    difficulty: "适中" as Recipe["difficulty"],
    newTagInput: "",
    flavorTags: ["酸甜", "香辣"] as string[],
    image: ""
  });

  const handleAddFlavorTag = () => {
    if (recipeForm.newTagInput.trim() && !recipeForm.flavorTags.includes(recipeForm.newTagInput.trim())) {
      setRecipeForm(prev => ({
        ...prev,
        flavorTags: [...prev.flavorTags, prev.newTagInput.trim()],
        newTagInput: ""
      }));
    }
  };

  const handleRemoveFlavorTag = (tag: string) => {
    setRecipeForm(prev => ({
      ...prev,
      flavorTags: prev.flavorTags.filter(t => t !== tag)
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm.name.trim()) return;

    // Default to a gorgeous preset Unsplash image if none is provided
    let finalImg = recipeForm.image;
    if (!finalImg) {
      const matchPresetsByCat = {
        "家常菜": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        "川湘菜": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
        "粤菜": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
        "西餐": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
        "日料": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        "甜品": "https://images.unsplash.com/photo-1536184071535-78906f7172c2?w=800"
      };
      finalImg = matchPresetsByCat[recipeForm.category] || SAMPLE_FOOD_IMAGES[0].url;
    }

    onAddRecipe({
      name: recipeForm.name,
      category: recipeForm.category,
      description: recipeForm.description,
      prepTime: Number(recipeForm.prepTime) || 45,
      difficulty: recipeForm.difficulty,
      flavorTags: recipeForm.flavorTags,
      image: finalImg
    });

    // Reset Form
    setRecipeForm({
      name: "",
      category: "家常菜",
      description: "",
      prepTime: 45,
      difficulty: "适中",
      newTagInput: "",
      flavorTags: ["酸甜", "香辣"],
      image: ""
    });
    setIsAddOpen(false);
  };

  // Filter recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.description.toLowerCase().includes(search.toLowerCase()) ||
                          r.flavorTags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "全部" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
      id="menu-recipes-container"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="menu-header-pane">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-medium text-brand-dark flex items-center gap-2">
            私房菜单
          </h1>
          <p className="text-xs text-brand-brown/75 font-sans leading-relaxed">
            探索与编纂你心仪的招牌家常菜系、下午茶及烘焙点心。
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white px-5 py-2.5 rounded-full font-medium shadow-custom-sm text-sm inline-flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
          id="btn-open-add-recipe-modal"
        >
          <Lucide.PlusCircle className="w-4 h-4" />
          新增菜品
        </button>
      </div>

      {/* Search Input */}
      <div className="relative" id="menu-search-wrapper">
        <Lucide.Search className="w-4 h-4 text-brand-brown/40 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索你心仪的美味..."
          className="w-full bg-cozy-beige/20 border border-cozy-beige/70 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-orange text-brand-dark font-sans placeholder-brand-brown/45 shadow-inner"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-3.5 text-brand-brown/40 hover:text-brand-dark"
          >
            <Lucide.X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories Row */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" id="menu-categories">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-brown text-white shadow-custom-sm"
                  : "bg-cozy-beige/45 text-brand-dark hover:bg-cozy-beige/85"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid List */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="recipes-list-grid">
          {filteredRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-cozy-beige rounded-3xl p-3 shadow-custom-sm group flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Visual Image container with nice overlay */}
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-cozy-beige">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-brand-dark/50 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded-md font-sans">
                    {recipe.category}
                  </div>
                </div>

                <div className="space-y-1.5 px-1">
                  <h3 className="font-semibold text-brand-dark text-sm leading-tight line-clamp-1">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-brand-brown/60">
                    <span className="flex items-center gap-0.5">
                      <Lucide.Gauge className="w-3 h-3" />
                      {recipe.difficulty}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Lucide.Clock className="w-3 h-3" />
                      {recipe.prepTime}min
                    </span>
                  </div>
                  {/* Recipe tags list */}
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {recipe.flavorTags.slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] px-1.5 py-0.5 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Meal action button */}
              <button
                onClick={() => onQuickPreOrder(recipe)}
                className="w-full mt-3 bg-brand-orange/15 hover:bg-brand-orange text-brand-brown hover:text-white border border-brand-orange/10 font-medium py-2 rounded-2xl text-[11px] inline-flex items-center justify-center gap-1 transition-all active:scale-97 cursor-pointer"
              >
                <Lucide.Utensils className="w-3 h-3" /> 快速加购
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-brand-brown/40 text-xs font-sans">
          没有找到匹配“{search}”的美味菜肴，赶紧来创建一个吧！
        </div>
      )}

      {/* Modals / Creator Layer */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-cozy-beige rounded-3xl p-6 shadow-custom-lg w-full max-w-xl relative my-8"
              id="recipe-form-modal"
            >
              {/* Back Title Header */}
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-4 right-4 text-brand-brown/60 hover:text-brand-dark hover:bg-cozy-beige/45 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Lucide.X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-display font-medium text-brand-dark flex items-center gap-2 mb-4">
                <Lucide.ChefHat className="text-brand-orange" />
                新增菜品
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Cover Image Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-brand-brown/85">
                    添加餐品封面图
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {SAMPLE_FOOD_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRecipeForm(prev => ({ ...prev, image: img.url }))}
                        className={`aspect-square rounded-xl overflow-hidden relative border-2 ${
                          recipeForm.image === img.url ? "border-brand-orange scale-102 shadow-xs" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        title={img.name}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="或者在次输入自定义海报/摄影 URL 地址..."
                      value={recipeForm.image}
                      onChange={(e) => setRecipeForm(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full border border-cozy-beige border-dashed rounded-xl px-3.5 py-1.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      菜品名称
                    </label>
                    <input
                      type="text"
                      required
                      value={recipeForm.name}
                      onChange={(e) => setRecipeForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="输入菜品名称，如：番茄牛腩"
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 font-sans"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      菜系分类
                    </label>
                    <select
                      value={recipeForm.category}
                      onChange={(e) => setRecipeForm(prev => ({ ...prev, category: e.target.value as Recipe["category"] }))}
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 cursor-pointer"
                    >
                      {CATEGORIES.filter(c => c !== "全部").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    菜品描述
                  </label>
                  <textarea
                    rows={3}
                    value={recipeForm.description}
                    onChange={(e) => setRecipeForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="简单写写这道菜的特色、口感、步骤或背后的温情回忆吧..."
                    className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 font-sans"
                  />
                </div>

                {/* Tag inputs */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    口味标签 （可增添、删除多个）
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 border border-cozy-beige rounded-xl bg-cream/15 mb-2">
                    {recipeForm.flavorTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1"
                      >
                        {tag}
                        <button type="button" onClick={() => handleRemoveFlavorTag(tag)}>
                          <Lucide.X className="w-3 h-3 hover:text-emerald-800" />
                        </button>
                      </span>
                    ))}
                    {recipeForm.flavorTags.length === 0 && (
                      <span className="text-[11px] text-brand-brown/40 italic">暂无添加标签</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={recipeForm.newTagInput}
                      onChange={(e) => setRecipeForm(prev => ({ ...prev, newTagInput: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFlavorTag();
                        }
                      }}
                      placeholder="输入回车或点 '+' 新增，如: 咸鲜, 养胃..."
                      className="flex-1 border border-cozy-beige rounded-xl px-3 px-1.5 text-xs text-brand-dark focus:outline-none bg-cream/20 font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleAddFlavorTag}
                      className="bg-brand-brown hover:bg-brand-dark text-white px-3 py-1.5 rounded-xl text-xs flex items-center justify-center cursor-pointer"
                    >
                      <Lucide.Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cooking time */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      预计调理烹制时间（分钟）
                    </label>
                    <input
                      type="number"
                      value={recipeForm.prepTime}
                      onChange={(e) => setRecipeForm(prev => ({ ...prev, prepTime: Number(e.target.value) }))}
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none bg-cream/20 font-mono text-center"
                    />
                  </div>

                  {/* Difficulty selector tabs */}
                  <div>
                    <label className="block text-[11px] font-medium text-brand-brown/85 mb-1.5">
                      烹饪难度
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-cozy-beige/40 p-1 rounded-xl">
                      {(["简单", "适中", "困难"] as const).map((dif) => (
                        <button
                          key={dif}
                          type="button"
                          onClick={() => setRecipeForm(prev => ({ ...prev, difficulty: dif }))}
                          className={`py-1.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                            recipeForm.difficulty === dif
                              ? "bg-brand-orange text-white shadow-xs"
                              : "text-brand-dark/70 hover:bg-cream/40"
                          }`}
                        >
                          {dif}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cancel Submit Trigger buttons */}
                <div className="flex gap-3 pt-3">
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
                    保存菜品
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
