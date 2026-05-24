import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Lucide from "lucide-react";
import { RestaurantFootprint } from "../types";
import { SAMPLE_FOOD_IMAGES } from "../data";

interface FootprintMapViewProps {
  key?: string;
  footprints: RestaurantFootprint[];
  onAddFootprint: (footprint: Omit<RestaurantFootprint, "id">) => void;
  onDeleteFootprint: (id: string) => void;
  isFormInitiallyOpen?: boolean;
}

export default function FootprintMapView({
  footprints,
  onAddFootprint,
  onDeleteFootprint,
  isFormInitiallyOpen = false
}: FootprintMapViewProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>(footprints[0]?.id || null);
  const [isAddOpen, setIsAddOpen] = useState(isFormInitiallyOpen);

  // Click Map coordinate placement state
  const mapRef = useRef<HTMLDivElement>(null);
  const [clickCoords, setClickCoords] = useState({ x: 50, y: 50 });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    district: "静安区",
    address: "",
    visitDate: "",
    costPerCapita: 68,
    ratingTaste: 5,
    ratingVibe: 4,
    ratingService: 5,
    favoriteDishes: ["招牌美食"] as string[],
    newDishInput: "",
    remarks: "",
    image: SAMPLE_FOOD_IMAGES[0].url
  });

  // Get active selected pin details
  const activePin = footprints.find(f => f.id === selectedPinId) || null;

  // Handle map clicks to place new coordinate pins
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Update form coordinate click reference
    setClickCoords({ x, y });
    setIsAddOpen(true);
  };

  const handleAddDishTag = () => {
    if (formData.newDishInput.trim() && !formData.favoriteDishes.includes(formData.newDishInput.trim())) {
      setFormData(prev => ({
        ...prev,
        favoriteDishes: [...prev.favoriteDishes, prev.newDishInput.trim()],
        newDishInput: ""
      }));
    }
  };

  const handleRemoveDishTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteDishes: prev.favoriteDishes.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let finalDate = formData.visitDate;
    if (!finalDate) {
      finalDate = new Date().toISOString().split("T")[0];
    }

    onAddFootprint({
      name: formData.name,
      posX: clickCoords.x,
      posY: clickCoords.y,
      image: formData.image || SAMPLE_FOOD_IMAGES[0].url,
      visitDate: finalDate,
      costPerCapita: Number(formData.costPerCapita) || 68,
      ratingTaste: formData.ratingTaste,
      ratingVibe: formData.ratingVibe,
      ratingService: formData.ratingService,
      favoriteDishes: formData.favoriteDishes,
      remarks: formData.remarks,
      district: formData.district,
      address: formData.address
    });

    // Reset Form
    setFormData({
      name: "",
      district: "静安区",
      address: "",
      visitDate: "",
      costPerCapita: 68,
      ratingTaste: 5,
      ratingVibe: 4,
      ratingService: 5,
      favoriteDishes: ["招牌美食"],
      newDishInput: "",
      remarks: "",
      image: SAMPLE_FOOD_IMAGES[0].url
    });
    setIsAddOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      id="footprints-map-container"
    >
      {/* Top Banner Pane */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="footprints-heading-pane">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-medium text-brand-dark flex items-center gap-2">
            美味足迹
          </h1>
          <p className="text-xs text-brand-brown/75 font-sans leading-relaxed">
            点击地图位置 或 直接新增记录，在地图上绘制你的专属温暖美食探索足迹。
          </p>
        </div>
        <button
          onClick={() => {
            setClickCoords({ x: 30 + Math.floor(Math.random() * 40), y: 30 + Math.floor(Math.random() * 40) });
            setIsAddOpen(true);
          }}
          className="bg-brand-brown hover:bg-brand-dark text-white px-5 py-2.5 rounded-full font-medium shadow-custom-sm text-sm inline-flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
          id="btn-add-footprint-manual"
        >
          <Lucide.PlusCircle className="w-4 h-4" />
          记录新探店
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parchment Interactive Map (Colspan 2) */}
        <div className="lg:col-span-2 space-y-2">
          {/* Instructions info popover */}
          <div className="bg-amber-50/50 border border-amber-100 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs text-brand-brown leading-relaxed shrink-0">
            <Lucide.Compass className="w-4 h-4 text-brand-orange animate-spin-slow" />
            <span>
              <strong>互动指南</strong>：点击下方浅黄色手绘地图的任意一点，即可直接在对应地理坐标 <strong>精准建立新店足迹</strong>。
            </span>
          </div>

          <div
            ref={mapRef}
            onClick={handleMapClick}
            className="aspect-[4/3] w-full rounded-3xl border border-cozy-beige relative overflow-hidden bg-[#FAF6F0] cursor-crosshair shadow-inner"
            id="parchment-art-map"
          >
            {/* Soft decorative grid backdrop coordinates */}
            <div className="absolute inset-0 bg-[radial-gradient(#EAD9C9_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Hand-drawn look SVG Roads and Rivers inside map */}
            <svg className="absolute inset-0 w-full h-full text-[#E8DDCF]" pointerEvents="none">
              <path d="M-50,200 Q200,100 500,450 T1000,300" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="opacity-60" />
              <path d="M200,-50 Q400,350 150,600 T800,900" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-40" />
              <path d="M-100,500 L1200,600" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" className="opacity-50" />
            </svg>

            {/* Render dynamic footprints pinned as delicious bubble avatars on coordinates */}
            {footprints.map((foot) => {
              const isActive = selectedPinId === foot.id;
              return (
                <button
                  key={foot.id}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop parent map coordinate placement trigger
                    setSelectedPinId(foot.id);
                  }}
                  style={{ left: `${foot.posX}%`, top: `${foot.posY}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none cursor-pointer"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      y: isActive ? -5 : 0
                    }}
                    className="flex flex-col items-center"
                  >
                    {/* Circle Image Preview bubble with white outer border and nice shadow */}
                    <div className={`w-14 h-14 rounded-full border-3 overflow-hidden shadow-custom-md flex items-center justify-center transition-all ${
                      isActive ? "border-brand-brown scale-105" : "border-white group-hover:border-brand-orange"
                    }`}>
                      <img
                        src={foot.image}
                        alt="Resto"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Diamond pinpoint cursor marker beneath */}
                    <div className={`w-3.5 h-3.5 rotate-45 border-r border-b -mt-1 shadow-xs ${
                      isActive ? "bg-brand-brown border-brand-brown" : "bg-white border-cozy-beige group-hover:bg-brand-orange group-hover:border-brand-orange"
                    }`} />
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pin Details Sidebar Pane */}
        <div className="lg:col-span-1" id="selected-footprint-sidebar">
          <AnimatePresence mode="wait">
            {activePin ? (
              <motion.div
                key={activePin.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-cozy-beige rounded-3xl p-5 shadow-custom-sm space-y-4"
              >
                {/* Cover representation */}
                <div className="aspect-video rounded-2xl overflow-hidden relative">
                  <img
                    src={activePin.image}
                    alt={activePin.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-brand-dark/50 backdrop-blur-xs text-xs text-white px-2.5 py-0.5 rounded-full font-sans">
                    {activePin.visitDate}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-medium px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {activePin.district || "探店记录"}
                  </span>
                  <div className="flex justify-between items-start gap-1">
                    <h2 className="text-lg font-bold text-brand-dark leading-tight pr-1.5">
                      {activePin.name}
                    </h2>
                    <button
                      onClick={() => {
                        onDeleteFootprint(activePin.id);
                        setSelectedPinId(footprints.filter(f => f.id !== activePin.id)[0]?.id || null);
                      }}
                      className="text-xs text-red-500 font-medium hover:underline inline-flex items-center gap-0.5 shrink-0 cursor-pointer"
                      title="删除此足迹"
                    >
                      <Lucide.Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activePin.address && (
                    <p className="text-xs text-brand-brown/60 flex items-center gap-0.5 font-sans">
                      <Lucide.MapPin className="w-3 h-3 text-brand-orange shrink-0 animate-pulse" />
                      {activePin.address}
                    </p>
                  )}
                </div>

                {/* Rating Stars Sliders List */}
                <div className="bg-cream/15 border border-cozy-beige rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between items-center text-xs text-brand-dark">
                    <span className="font-medium text-brand-brown/85">口味风味</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Lucide.Star key={i} className={`w-3.5 h-3.5 ${i < activePin.ratingTaste ? "fill-amber-500" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-brand-dark">
                    <span className="font-medium text-brand-brown/85">就餐环境</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Lucide.Star key={i} className={`w-3.5 h-3.5 ${i < activePin.ratingVibe ? "fill-amber-500" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-brand-dark">
                    <span className="font-medium text-brand-brown/85">贴心服务</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Lucide.Star key={i} className={`w-3.5 h-3.5 ${i < activePin.ratingService ? "fill-amber-500" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] bg-cozy-beige my-2" />

                  <div className="flex justify-between items-center text-xs text-brand-dark font-sans">
                    <span className="font-semibold text-brand-brown/85">人均消费估计</span>
                    <span className="font-mono font-bold text-brand-orange">¥{activePin.costPerCapita} / 人</span>
                  </div>
                </div>

                {/* Recommended delicious food tags */}
                {activePin.favoriteDishes.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                      <Lucide.Flame className="w-3.5 h-3.5 text-brand-orange" />
                      必点招牌推荐：
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {activePin.favoriteDishes.map((dish, dIdx) => (
                        <span key={dIdx} className="bg-brand-orange/10 text-brand-brown text-[10px] px-2 py-0.5 rounded-full font-medium">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comment diary block */}
                {activePin.remarks && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                      <Lucide.PenSquare className="w-3.5 h-3.5 text-brand-orange" />
                      美味探店心得：
                    </p>
                    <p className="text-xs font-sans text-brand-brown/85 leading-relaxed bg-cozy-beige/20 p-3 rounded-xl italic border border-cozy-beige/65">
                      “ {activePin.remarks} ”
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white border border-cozy-beige border-dashed rounded-3xl p-8 text-center text-xs text-brand-brown/40 font-sans h-full flex flex-col items-center justify-center">
                <Lucide.Compass className="w-8 h-8 text-brand-brown/20 mb-2 animate-bounce" />
                请选择或在地图上直接新增一个探店足迹标记。
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Footprint Dialog Overlay */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-cozy-beige rounded-3xl p-6 shadow-custom-lg w-full max-w-xl relative my-8"
              id="footprint-creator-modal"
            >
              {/* Reset button */}
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="absolute top-4 right-4 text-brand-brown/60 hover:text-brand-dark hover:bg-cozy-beige/45 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Lucide.X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-display font-medium text-brand-dark flex items-center gap-2 mb-4">
                <Lucide.Compass className="text-brand-orange" />
                记录美美的一家餐厅吧
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Cover Image Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-brand-brown/85">
                    添加大快朵颐的美食图景
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {SAMPLE_FOOD_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: img.url }))}
                        className={`aspect-square rounded-xl overflow-hidden relative border-2 ${
                          formData.image === img.url ? "border-brand-orange scale-102" : "border-transparent opacity-85"
                        }`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="或者粘贴自定义美食摄影实地图集 URL 链接..."
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full border border-cozy-beige border-dashed rounded-xl px-3.5 py-1.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/15 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Restaurant name */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      餐厅名称 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="餐厅名称，如: 慢食光·日式甜点屋"
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 font-sans"
                    />
                  </div>

                  {/* District / Address */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                        所在行政区
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                        placeholder="如: 静安区"
                        className="w-full border border-cozy-beige rounded-xl px-2 py-2 text-sm text-brand-dark focus:outline-none bg-cream/20 font-sans"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                        详细地址
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="如: 巨鹿路 758 号"
                        className="w-full border border-cozy-beige rounded-xl px-3 py-2 text-sm text-brand-dark focus:outline-none bg-cream/20 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Pick */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      探店就餐日期
                    </label>
                    <input
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none bg-cream/20 font-mono text-center"
                    />
                  </div>

                  {/* Cost per capita */}
                  <div>
                    <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                      人均消费（¥ 元）
                    </label>
                    <input
                      type="number"
                      value={formData.costPerCapita}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPerCapita: Number(e.target.value) }))}
                      className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none bg-cream/20 font-mono text-center"
                    />
                  </div>
                </div>

                {/* Star Sliders Selector Row */}
                <div className="bg-cream/15 p-4 rounded-2xl border border-cozy-beige space-y-3">
                  <p className="text-xs font-semibold text-brand-brown">美食探店主观评分</p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Taste */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-brown/70 block">口味</span>
                      <div className="flex gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, ratingTaste: i + 1 }))}
                          >
                            <Lucide.Star className={`w-4 h-4 ${i < formData.ratingTaste ? "fill-amber-500" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vibe */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-brown/70 block">环境</span>
                      <div className="flex gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, ratingVibe: i + 1 }))}
                          >
                            <Lucide.Star className={`w-4 h-4 ${i < formData.ratingVibe ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Service */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-brown/70 block">服务</span>
                      <div className="flex gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, ratingService: i + 1 }))}
                          >
                            <Lucide.Star className={`w-4 h-4 ${i < formData.ratingService ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favorite Dishes badges builder */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    必点招牌美食（输入拼音或美食回车添加）
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 border border-cozy-beige rounded-xl bg-cream/15 mb-2">
                    {formData.favoriteDishes.map((dish) => (
                      <span
                        key={dish}
                        className="bg-brand-orange/15 text-brand-brown text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
                      >
                        {dish}
                        <button type="button" onClick={() => handleRemoveDishTag(dish)}>
                          <Lucide.X className="w-3 h-3 text-brand-brown hover:text-black" />
                        </button>
                      </span>
                    ))}
                    {formData.favoriteDishes.length === 0 && (
                      <span className="text-[11px] text-brand-brown/40 italic">暂无招牌美食</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.newDishInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, newDishInput: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDishTag();
                        }
                      }}
                      placeholder="例如: 宇治抹茶大福, 手冲咖啡..."
                      className="flex-1 border border-cozy-beige rounded-xl px-3.5 py-1.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleAddDishTag}
                      className="bg-brand-brown hover:bg-brand-dark text-white px-3 py-1.5 rounded-xl text-xs flex items-center justify-center cursor-pointer"
                    >
                      <Lucide.Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Remarks review notes */}
                <div>
                  <label className="block text-xs font-medium text-brand-brown/85 mb-1">
                    探店心得日记
                  </label>
                  <textarea
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder="环境陈设有哪些亮点特色？或是菜色的口味口感、心动瞬间？"
                    className="w-full border border-cozy-beige rounded-xl px-3.5 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-orange bg-cream/20 font-sans"
                  />
                </div>

                {/* Submit Cancel row */}
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
