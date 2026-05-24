import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Lucide from "lucide-react";
import { Recipe, JournalEntry, PreOrder, RestaurantFootprint } from "./types";
import {
  PRESEEDED_RECIPES,
  PRESEEDED_JOURNALS,
  PRESEEDED_PREORDERS,
  PRESEEDED_FOOTPRINTS
} from "./data";

// Subviews
import HomeView from "./components/HomeView";
import PreOrderView from "./components/PreOrderView";
import MenuView from "./components/MenuView";
import JournalView from "./components/JournalView";
import FootprintMapView from "./components/FootprintMapView";

export default function App() {
  // Initialize States with Safe LocalStorage Hydration
  const [kitchenName, setKitchenName] = useState(() => {
    return localStorage.getItem("tastebucks_kitchen_name") || "味蕾记忆";
  });
  const [isEditingKitchen, setIsEditingKitchen] = useState(false);

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const local = localStorage.getItem("tastebucks_recipes");
    return local ? JSON.parse(local) : PRESEEDED_RECIPES;
  });

  const [preOrders, setPreOrders] = useState<PreOrder[]>(() => {
    const local = localStorage.getItem("tastebucks_preorders");
    return local ? JSON.parse(local) : PRESEEDED_PREORDERS;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const local = localStorage.getItem("tastebucks_journals");
    return local ? JSON.parse(local) : PRESEEDED_JOURNALS;
  });

  const [footprints, setFootprints] = useState<RestaurantFootprint[]>(() => {
    const local = localStorage.getItem("tastebucks_footprints");
    return local ? JSON.parse(local) : PRESEEDED_FOOTPRINTS;
  });

  const [activeTab, setActiveTab] = useState<"home" | "order" | "menu" | "journal" | "footprints">("home");

  // Secondary states to trigger form modal openers from other views
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [isJournalFormOpen, setIsJournalFormOpen] = useState(false);
  const [isFootprintFormOpen, setIsFootprintFormOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("tastebucks_kitchen_name", kitchenName);
  }, [kitchenName]);

  useEffect(() => {
    localStorage.setItem("tastebucks_recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("tastebucks_preorders", JSON.stringify(preOrders));
  }, [preOrders]);

  useEffect(() => {
    localStorage.setItem("tastebucks_journals", JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem("tastebucks_footprints", JSON.stringify(footprints));
  }, [footprints]);

  // Handle addition callbacks
  const handleAddRecipe = (newRecipe: Omit<Recipe, "id">) => {
    const created: Recipe = {
      ...newRecipe,
      id: `recipe_${Date.now()}`
    };
    setRecipes(prev => [created, ...prev]);
  };

  const handleQuickPreOrder = (recipe: Recipe) => {
    const created: PreOrder = {
      id: `order_${Date.now()}`,
      date: "2026-05-25", // Default scheduled Monday
      mealPeriod: "午餐",
      name: recipe.name,
      image: recipe.image,
      note: "快速加购，期待品尝！",
      status: "已下单"
    };
    setPreOrders(prev => [created, ...prev]);
    setActiveTab("order"); // Navigate to Reservation planner
  };

  const handleAddPreOrder = (newOrder: Omit<PreOrder, "id">) => {
    const created: PreOrder = {
      ...newOrder,
      id: `order_${Date.now()}`
    };
    setPreOrders(prev => [created, ...prev]);
  };

  const handleUpdatePreOrderStatus = (id: string, s: PreOrder["status"]) => {
    setPreOrders(prev => prev.map(o => o.id === id ? { ...o, status: s } : o));
  };

  const handleDeletePreOrder = (id: string) => {
    setPreOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleAddJournal = (newJ: Omit<JournalEntry, "id">) => {
    const created: JournalEntry = {
      ...newJ,
      id: `journal_${Date.now()}`
    };
    setJournals(prev => [created, ...prev]);
    setActiveTab("journal");
  };

  const handleAddFootprint = (newFoot: Omit<RestaurantFootprint, "id">) => {
    const created: RestaurantFootprint = {
      ...newFoot,
      id: `footprint_${Date.now()}`
    };
    setFootprints(prev => [created, ...prev]);
    setActiveTab("footprints");
  };

  const handleDeleteFootprint = (id: string) => {
    setFootprints(prev => prev.filter(f => f.id !== id));
  };

  // Nav configuration
  const navigationItems = [
    { id: "home", label: "首页", icon: Lucide.Home },
    { id: "order", label: "今日点菜", icon: Lucide.CalendarDays },
    { id: "menu", label: "私房菜单", icon: Lucide.BookOpen },
    { id: "journal", label: "味蕾日志", icon: Lucide.Sparkles },
    { id: "footprints", label: "美味足迹", icon: Lucide.Compass }
  ] as const;

  return (
    <div className="min-h-screen bg-cream text-brand-dark flex flex-col font-sans" id="tastebuds-app-root">
      {/* Dynamic Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-cozy-beige sticky top-0 z-40 px-4 py-3 shadow-custom-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Elegant glowing chef stamp badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-500 flex items-center justify-center text-white shadow-custom-sm font-bold font-display" id="header-brand-logo">
              <Lucide.UtensilsCrossed className="w-5 h-5" />
            </div>

            {/* Editable Kitchen Title Section to match custom requirements */}
            <div className="flex items-center gap-2">
              {isEditingKitchen ? (
                <input
                  type="text"
                  maxLength={18}
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  onBlur={() => setIsEditingKitchen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingKitchen(false);
                  }}
                  autoFocus
                  className="text-lg font-display font-bold text-brand-dark bg-cream px-2.5 py-0.5 rounded-lg border border-brand-orange/40 focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-1.5 group">
                  <h1 className="text-xl font-display font-medium text-brand-dark tracking-tight">
                    {kitchenName}
                  </h1>
                  <button
                    onClick={() => setIsEditingKitchen(true)}
                    className="opacity-0 group-hover:opacity-100 text-brand-brown hover:text-brand-orange p-1 transition-opacity"
                    title="重命名主页"
                  >
                    <Lucide.PencilLine className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User profile view */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-[11px] font-mono text-brand-brown/60 uppercase tracking-wide bg-cozy-beige/40 px-2 py-0.5 rounded-md">
              私房主厨
            </span>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Avatar Profile"
              className="w-8 h-8 rounded-full object-cover border border-cozy-beige shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Main layout container support side bar and main page */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 pb-24 md:pb-6">
        
        {/* Desktop Sidebar menu */}
        <aside className="hidden md:block w-52 shrink-0 space-y-2">
          <div className="bg-white/50 border border-cozy-beige rounded-2xl p-3 shadow-custom-sm">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/40 px-3.5 py-2 mb-1.5">
              手账目录
            </div>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsRecipeFormOpen(false);
                      setIsJournalFormOpen(false);
                      setIsFootprintFormOpen(false);
                    }}
                    className={`nav-button-tab w-full font-sans flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-brand-brown text-white shadow-custom-sm"
                        : "text-brand-dark/75 hover:bg-cozy-beige/40 hover:text-brand-dark"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Dynamic Screens routing content container */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <HomeView
                key="home"
                kitchenName={kitchenName}
                preOrders={preOrders}
                recipes={recipes}
                journals={journals}
                footprints={footprints}
                onNavigate={setActiveTab}
                onOpenAddRecipe={() => {
                  setActiveTab("menu");
                  setIsRecipeFormOpen(true);
                }}
                onOpenAddJournal={() => {
                  setActiveTab("journal");
                  setIsJournalFormOpen(true);
                }}
                onOpenAddFootprint={() => {
                  setActiveTab("footprints");
                  setIsFootprintFormOpen(true);
                }}
              />
            )}

            {activeTab === "order" && (
              <PreOrderView
                key="order"
                preOrders={preOrders}
                recipes={recipes}
                onAddPreOrder={handleAddPreOrder}
                onUpdateStatus={handleUpdatePreOrderStatus}
                onDeletePreOrder={handleDeletePreOrder}
              />
            )}

            {activeTab === "menu" && (
              <MenuView
                key="menu"
                recipes={recipes}
                onAddRecipe={handleAddRecipe}
                onQuickPreOrder={handleQuickPreOrder}
                isFormInitiallyOpen={isRecipeFormOpen}
              />
            )}

            {activeTab === "journal" && (
              <JournalView
                key="journal"
                journals={journals}
                recipes={recipes}
                onAddJournal={handleAddJournal}
                isFormInitiallyOpen={isJournalFormOpen}
              />
            )}

            {activeTab === "footprints" && (
              <FootprintMapView
                key="footprints"
                footprints={footprints}
                onAddFootprint={handleAddFootprint}
                onDeleteFootprint={handleDeleteFootprint}
                isFormInitiallyOpen={isFootprintFormOpen}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile layout screen viewports */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 bg-white/90 backdrop-blur-md border border-cozy-beige rounded-2xl p-2.5 shadow-custom-lg z-40 flex justify-between items-center px-4" id="mobile-nav-bar">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsRecipeFormOpen(false);
                setIsJournalFormOpen(false);
                setIsFootprintFormOpen(false);
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
                isActive ? "text-brand-orange scale-102" : "text-brand-dark/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-1 font-semibold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
