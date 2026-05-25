import { InputHTMLAttributes, ReactNode, useMemo, useState } from 'react';
import { BadgeCheck, BookOpen, CalendarDays, Camera, House, MapPinned, Plus, Search, SoupIcon, UtensilsCrossed } from 'lucide-react';
import { APP_NAME } from './data/mockData';
import { aiService } from './services/aiService';
import { storageService } from './services/storageService';
import { AppTab, CuisineType, Dish, MealPeriod, OrderStatus, Recipe, RecipeDifficulty, UserName } from './types/index';

const nav = [
  { id: 'home', label: '首页', icon: House },
  { id: 'meal', label: '点菜', icon: CalendarDays },
  { id: 'menu', label: '菜单', icon: BookOpen },
  { id: 'recipes', label: '菜谱', icon: BookOpen },
  { id: 'memory', label: '味蕾记忆', icon: Camera },
  { id: 'footprint', label: '美味足迹', icon: MapPinned },
] as const;

const periods: MealPeriod[] = ['早餐', '午餐', '晚餐', '夜宵'];
const cuisines: ('全部' | CuisineType)[] = ['全部', '家常菜', '川湘菜', '江浙菜', '粤菜', '西餐', '面食', '甜品', '汤羹'];

export default function App() {
  const [tab, setTab] = useState<AppTab>('home');
  const [store, setStore] = useState(storageService.loadAll());
  const [identity, setIdentity] = useState<UserName>('小白');
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState<'全部' | CuisineType>('全部');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [overlay, setOverlay] = useState<'' | 'order' | 'dish' | 'memory' | 'restaurant' | 'recipe' | 'recipeDetail'>('');
  const [editingDish, setEditingDish] = useState('');
  const [editingRecipeId, setEditingRecipeId] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [prefillRecipeDishId, setPrefillRecipeDishId] = useState<string | undefined>(undefined);
  
  const persist = (next: typeof store) => {
    setStore(next);
    storageService.saveAll(next);
  };

  const dishes = useMemo(
    () => store.dishes.filter((d) => d.name.includes(search) && (cuisine === '全部' || d.cuisine === cuisine)),
    [store.dishes, search, cuisine],
  );

  const selectedRecipe = store.recipes.find((r) => r.id === selectedRecipeId);

  const jumpToMenu = (action?: 'dish') => {
    setTab('menu');
    if (action === 'dish') {
      setEditingDish('');
      setOverlay('dish');
    }
  };

  const jumpToRecipes = (dishId?: string, recipeId?: string) => {
    setTab('recipes');
    if (recipeId) {
      setSelectedRecipeId(recipeId);
      setOverlay('recipeDetail');
      return;
    }
    setEditingRecipeId('');
    setSelectedRecipeId('');
    setPrefillRecipeDishId(dishId);
    setOverlay('recipe');
  };

  return <div className='shell app-shell'><div className='app'><main className='main page-content'>
    {tab === 'home' && <section className='stack page'>
      <div className='brandPanel'>
        <div className='brandMark'><div className='brandDot'><SoupIcon size={16} /></div><div><h1>{APP_NAME}</h1><p className='sub'>今天也要认真吃饭</p></div></div>
        <div className='idGroup'>
          <button className={identity === '小白' ? 'idSwitch active' : 'idSwitch'} onClick={() => setIdentity('小白')}>小白</button>
          <button className={identity === '小鸡毛' ? 'idSwitch active' : 'idSwitch'} onClick={() => setIdentity('小鸡毛')}>小鸡毛</button>
        </div>
      </div>
      <section className='hero card'><div className='heroContent'><h2>今日点菜与灵感</h2><p>今天吃什么、怎么做、做完感受，都在这里顺手记录。</p></div></section>

      <section><div className='secHead'><h3>快捷入口</h3></div><div className='quickGrid'>
        <button className='quickCard' onClick={() => { setTab('meal'); setOverlay('order'); }}><CalendarDays size={18} /><p>预约点菜</p><small>安排某天某一餐</small></button>
        <button className='quickCard' onClick={() => jumpToMenu('dish')}><UtensilsCrossed size={18} /><p>新增菜品</p><small>收录可点菜品</small></button>
        <button className='quickCard' onClick={() => jumpToRecipes()}><BookOpen size={18} /><p>新增菜谱</p><small>记录详细做法</small></button>
        <button className='quickCard' onClick={() => { setTab('memory'); setOverlay('memory'); }}><Camera size={18} /><p>记录下厨</p><small>写下体验和改进</small></button>
      </div></section>
    </section>}

    {tab === 'meal' && <section className='stack page'><div className='titleCard'><h2>安排下一餐</h2><p>这里只负责预约某天某一餐吃什么。</p></div>
      <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='niceInput form-control'/>
      {periods.map((p) => <div key={p} className='card mealLine'><div className='lineHd'><b>{p}</b><button className='pillBtn small' onClick={() => setOverlay('order')}>预约这餐</button></div>
      {store.orders.filter((o) => o.date === date && o.period === p).map((o) => <p key={o.id}>{o.dishIds.map((id) => store.dishes.find((d) => d.id === id)?.name).filter(Boolean).join('、')} · {o.orderedBy} · <select value={o.status} onChange={(e) => persist(storageService.updateOrder(store, o.id, { status: e.target.value as OrderStatus }))}><option>待确认</option><option>已确认</option><option>已完成</option><option>已取消</option></select></p>)}
      </div>)}
    </section>}

    {tab === 'menu' && <section className='stack page'>
      <div className='titleCard'>
        <h2>私房菜单</h2>
        <p>管理小白和小鸡毛常吃、想吃、值得再做的菜。</p>
      </div>

      <>
        <div className='menuGuide'>菜品库：管理“可以点的菜”；菜谱记录：管理“这道菜怎么做”。</div>
        <div className='searchBox'><Search size={16}/><input placeholder='搜索今天想吃的菜' value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className='chips'>{cuisines.map((c) => <button key={c} className={cuisine === c ? 'activeChip' : ''} onClick={() => setCuisine(c)}>{c}</button>)}</div>
        <button className='pillBtn' onClick={() => { setEditingDish(''); setOverlay('dish'); }}><Plus size={16}/> 新增菜品</button>
        <div className='grid2'>{dishes.map((d) => {
          const linkedRecipe = storageService.findRecipeByDishId(store, d.id);
          return <article key={d.id} className='recipeCard'><img src={d.imageUrl} alt={d.name} /><div><p>{d.name}</p><small>{d.cuisine} · {d.cookTime}分钟 · {d.difficulty}</small><div className='tags'>{d.recommended && <span><BadgeCheck size={12}/>推荐</span>}</div>
            <div className='cardActions'>
              <button className='tinyBtn' onClick={() => { setTab('meal'); setOverlay('order'); }}>加入点菜</button>
              <button className='tinyBtn secondaryBtn' onClick={() => {
                if (linkedRecipe) { jumpToRecipes(d.id, linkedRecipe.id); }
                else { jumpToRecipes(d.id); }
              }}>{linkedRecipe ? '查看菜谱' : '去建菜谱'}</button>
            </div>
          </div></article>;
        })}</div>
      </>
    </section>}

    {tab === 'recipes' && <section className='stack page'>
      <div className='titleCard'><h2>私房菜谱</h2><p>把每一道菜的食材、步骤和小技巧都认真记下来。</p></div>
      <div className='searchBox'><Search size={16}/><input placeholder='搜索菜谱名称' value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className='chips'>{cuisines.map((c) => <button key={c} className={cuisine === c ? 'activeChip' : ''} onClick={() => setCuisine(c)}>{c}</button>)}</div>
      <button className='pillBtn' onClick={() => { setEditingRecipeId(''); setPrefillRecipeDishId(undefined); setOverlay('recipe'); }}><Plus size={16}/> 新增菜谱</button>
      {store.recipes.filter((r) => r.name.includes(search) && (cuisine === '全部' || r.cuisine === cuisine)).length === 0 ? <div className='empty'>还没有菜谱记录，把第一道私房菜的做法记下来吧。<button className='tinyBtn' onClick={() => setOverlay('recipe')}>新增菜谱</button></div> :
      <div className='grid1'>{store.recipes.filter((r) => r.name.includes(search) && (cuisine === '全部' || r.cuisine === cuisine)).map((r) => <article key={r.id} className='albumCard recipeRecordCard'><img src={r.coverImageUrl || ''} alt={r.name} /><div><h4>{r.name}</h4><small>关联菜品：{store.dishes.find((d) => d.id === r.dishId)?.name || '未关联'} · {r.cuisine}</small><small>{difficultyLabel(r.difficulty)} · {r.cookingTime}分钟 · 食材{r.ingredients.length} · 步骤{r.steps.length}</small><small>创建人：{r.createdBy === 'xiaobai' ? '小白' : '小鸡毛'} · 最近更新：{r.updatedAt.slice(0, 10)}</small><div className='tags'>{r.tags.map((t) => <span key={t}>{t}</span>)}</div><div className='cardActions'><button className='tinyBtn' onClick={() => { setSelectedRecipeId(r.id); setOverlay('recipeDetail'); }}>查看</button><button className='tinyBtn secondaryBtn' onClick={() => { setEditingRecipeId(r.id); setOverlay('recipe'); }}>编辑</button><button className='tinyBtn' onClick={() => { setTab('meal'); setOverlay('order'); }}>加入点菜</button><button className='tinyBtn dangerBtn' onClick={() => persist(storageService.deleteRecipe(store, r.id))}>删除</button></div></div></article>)}</div>}
    </section>}

    {tab === 'memory' && <section className='stack page'><div className='heroLite'><h3>味蕾记忆</h3><p>这里只记录做完后的体验、图片、总结和下次改进。</p><button className='pillBtn' onClick={() => setOverlay('memory')}>新增味蕾记忆</button></div></section>}
    {tab === 'footprint' && <section className='stack page'><div className='titleCard'><h2>美味足迹</h2><p>这里只记录探店和地图足迹。</p></div></section>}
  </main>

  <footer className='nav floating-tabbar safe-bottom'>{nav.map((n) => <button key={n.id} className={tab === n.id ? 'active tap-target' : 'tap-target'} onClick={() => setTab(n.id as AppTab)}><n.icon size={17}/><span>{n.label}</span></button>)}</footer>
  {overlay === 'order' && <Sheet title='新增点菜预约' close={() => setOverlay('')}><QuickOrder onSave={(data: Omit<typeof store.orders[number], 'id'>) => { persist(storageService.addOrder(store, data)); setOverlay(''); }} dishes={store.dishes} date={date} identity={identity} /></Sheet>}
  {overlay === 'dish' && <Sheet title={editingDish ? '编辑菜品' : '新增菜品'} close={() => setOverlay('')}><DishForm dish={store.dishes.find((d) => d.id === editingDish)} onSave={(data: Omit<Dish, 'id'>) => { persist(editingDish ? storageService.updateDish(store, editingDish, data) : storageService.addDish(store, data)); setOverlay(''); }} /></Sheet>}
  {overlay === 'recipe' && <Sheet title={editingRecipeId ? '编辑菜谱' : '新增菜谱'} close={() => setOverlay('')}><RecipeForm recipe={store.recipes.find((r) => r.id === editingRecipeId)} dishes={store.dishes} identity={identity} prefillDishId={prefillRecipeDishId} onSave={(v: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => { persist(editingRecipeId ? storageService.updateRecipe(store, editingRecipeId, v) : storageService.addRecipe(store, v)); setOverlay(''); }} /></Sheet>}
  {overlay === 'recipeDetail' && selectedRecipe && <Sheet title='菜谱详情' close={() => setOverlay('')}><RecipeDetail recipe={selectedRecipe} dish={store.dishes.find((d) => d.id === selectedRecipe.dishId)} onEdit={() => { setEditingRecipeId(selectedRecipe.id); setOverlay('recipe'); }} onAddMeal={() => { setTab('meal'); setOverlay('order'); }} /></Sheet>}
  {overlay === 'memory' && <Sheet title='新增味蕾记忆' close={() => setOverlay('')}><MemoryForm dishes={store.dishes} onSave={(v: { dishId?: string; dishName: string; imageUrl: string; review: string; chef: UserName; rating: number; wantAgain: boolean }) => { const ai = aiService.summarizeTaste(v.review, v.dishName); persist(storageService.addMemory(store, { ...v, aiTitle: ai.title, aiSummary: ai.summary, aiTags: ai.tags, aiSuggestion: ai.suggestion })); setOverlay(''); }} /></Sheet>}
</div></div>;
}

function difficultyLabel(d: RecipeDifficulty) { return d === 'easy' ? '简单' : d === 'normal' ? '中等' : '进阶'; }
function Sheet({ title, close, children }: { title: string; close: () => void; children: ReactNode }) { return <div className='sheetWrap' onClick={close}><div className='sheet card' onClick={(e) => e.stopPropagation()}><h3>{title}</h3>{children}</div></div>; }
const field = (p: InputHTMLAttributes<HTMLInputElement>) => <input className='niceInput' {...p} required={p.required ?? true} />;

function QuickOrder({ dishes, onSave, date, identity }: { dishes: Dish[]; onSave: (v: { date: string; period: MealPeriod; dishIds: string[]; note: string; orderedBy: UserName; status: OrderStatus }) => void; date: string; identity: UserName }) {
  const [v, set] = useState<{ date: string; period: MealPeriod; dishIds: string[]; note: string; orderedBy: UserName; status: OrderStatus }>({ date, period: '晚餐', dishIds: [], note: '', orderedBy: identity, status: '待确认' });
  return <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className='form'>{field({ type: 'date', value: v.date, onChange: (e) => set({ ...v, date: e.currentTarget.value }) })}<select className='niceInput' value={v.period} onChange={(e) => set({ ...v, period: e.currentTarget.value as MealPeriod })}>{periods.map((p) => <option key={p}>{p}</option>)}</select><select className='niceInput' onChange={(e) => set({ ...v, dishIds: [e.currentTarget.value] })}><option value=''>选择菜品</option>{dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>{field({ placeholder: '备注', value: v.note, onChange: (e) => set({ ...v, note: e.currentTarget.value }), required: false })}<select className='niceInput' value={v.orderedBy} onChange={(e) => set({ ...v, orderedBy: e.currentTarget.value as UserName })}><option>小白</option><option>小鸡毛</option></select><button className='pillBtn'>保存</button></form>;
}

function DishForm({ dish, onSave }: { dish?: Dish; onSave: (v: Omit<Dish, 'id'>) => void }) { const [v, set] = useState<Omit<Dish, 'id'>>(dish || { name: '', imageUrl: '', cuisine: '家常菜', description: '', tags: [], difficulty: '简单', cookTime: 30, recommended: false, frequent: false }); return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave({ ...v, tags: String(v.tags).split(/[，,]/).filter(Boolean), cookTime: Number(v.cookTime) }); }}>{field({ placeholder: '菜名', value: v.name, onChange: (e) => set({ ...v, name: e.currentTarget.value }) })}{field({ placeholder: '图片 URL', value: v.imageUrl, onChange: (e) => set({ ...v, imageUrl: e.currentTarget.value }) })}<select className='niceInput' value={v.cuisine} onChange={(e) => set({ ...v, cuisine: e.currentTarget.value as CuisineType })}>{cuisines.slice(1).map((c) => <option key={c}>{c}</option>)}</select>{field({ placeholder: '简介', value: v.description, onChange: (e) => set({ ...v, description: e.currentTarget.value }) })}{field({ placeholder: '标签（逗号分隔）', value: String(v.tags), onChange: (e) => set({ ...v, tags: e.currentTarget.value.split(/[，,]/).filter(Boolean) }) })}{field({ type: 'number', placeholder: '制作时间(分钟)', value: v.cookTime, onChange: (e) => set({ ...v, cookTime: Number(e.currentTarget.value) }) })}<button className='pillBtn'>保存菜品</button></form>; }

function RecipeForm({ recipe, dishes, identity, prefillDishId, onSave }: { recipe?: Recipe; dishes: Dish[]; identity: UserName; prefillDishId?: string; onSave: (v: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void }) {
  const [v, setV] = useState<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>(recipe ? { ...recipe } : { name: '', coverImageUrl: '', dishId: '', cuisine: '家常菜', description: '', ingredients: [{ id: crypto.randomUUID(), name: '', amount: '', note: '' }], steps: [{ id: crypto.randomUUID(), order: 1, title: '', description: '', imageUrl: '', duration: undefined }], tips: '', difficulty: 'normal', cookingTime: 30, servings: 2, createdBy: identity === '小白' ? 'xiaobai' : 'xiaojimao', tags: [] });
  return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave({ ...v, dishId: v.dishId || undefined, tags: String(v.tags).split(/[，,]/).filter(Boolean), ingredients: v.ingredients.filter((i) => i.name), steps: v.steps.filter((s) => s.description).map((s, idx) => ({ ...s, order: idx + 1 })) }); }}>
    <h4>基础信息</h4>{field({ placeholder: '菜谱名称', value: v.name, onChange: (e) => setV({ ...v, name: e.currentTarget.value }) })}
    {field({ placeholder: '封面图片 URL', value: v.coverImageUrl || '', onChange: (e) => setV({ ...v, coverImageUrl: e.currentTarget.value }), required: false })}
    <select className='niceInput' value={v.dishId || ''} onChange={(e) => setV({ ...v, dishId: e.currentTarget.value || undefined })}><option value=''>关联菜品（可选）</option>{dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
    <select className='niceInput' value={v.cuisine} onChange={(e) => setV({ ...v, cuisine: e.currentTarget.value as CuisineType })}>{cuisines.slice(1).map((c) => <option key={c}>{c}</option>)}</select>
    <textarea className='niceInput' placeholder='简介' value={v.description || ''} onChange={(e) => setV({ ...v, description: e.currentTarget.value })} />
    {field({ type: 'number', placeholder: '制作时间（分钟）', value: v.cookingTime, onChange: (e) => setV({ ...v, cookingTime: Number(e.currentTarget.value) }) })}
    <select className='niceInput' value={v.difficulty} onChange={(e) => setV({ ...v, difficulty: e.currentTarget.value as RecipeDifficulty })}><option value='easy'>简单</option><option value='normal'>中等</option><option value='hard'>进阶</option></select>
    {field({ type: 'number', placeholder: '份量（人）', value: v.servings || '', required: false, onChange: (e) => setV({ ...v, servings: Number(e.currentTarget.value) }) })}
    <select className='niceInput' value={v.createdBy} onChange={(e) => setV({ ...v, createdBy: e.currentTarget.value as 'xiaobai' | 'xiaojimao' })}><option value='xiaobai'>小白</option><option value='xiaojimao'>小鸡毛</option></select>
    {field({ placeholder: '标签（逗号分隔）', value: String(v.tags), required: false, onChange: (e) => setV({ ...v, tags: e.currentTarget.value.split(/[，,]/).filter(Boolean) }) })}
    <h4>食材清单</h4>
    {v.ingredients.map((ing, idx) => <div key={ing.id} className='groupCard'>{field({ placeholder: `食材 ${idx + 1}`, value: ing.name, onChange: (e) => setV({ ...v, ingredients: v.ingredients.map((x) => x.id === ing.id ? { ...x, name: e.currentTarget.value } : x) }) })}{field({ placeholder: '用量', value: ing.amount || '', required: false, onChange: (e) => setV({ ...v, ingredients: v.ingredients.map((x) => x.id === ing.id ? { ...x, amount: e.currentTarget.value } : x) }) })}{field({ placeholder: '备注', value: ing.note || '', required: false, onChange: (e) => setV({ ...v, ingredients: v.ingredients.map((x) => x.id === ing.id ? { ...x, note: e.currentTarget.value } : x) }) })}<button type='button' className='tinyBtn dangerBtn' onClick={() => setV({ ...v, ingredients: v.ingredients.filter((x) => x.id !== ing.id) })}>删除食材</button></div>)}
    <button type='button' className='tinyBtn' onClick={() => setV({ ...v, ingredients: [...v.ingredients, { id: crypto.randomUUID(), name: '', amount: '', note: '' }] })}>新增食材</button>
    <h4>做法步骤</h4>
    {v.steps.map((s, idx) => <div key={s.id} className='groupCard'>{field({ placeholder: `步骤标题 ${idx + 1}（可选）`, required: false, value: s.title || '', onChange: (e) => setV({ ...v, steps: v.steps.map((x) => x.id === s.id ? { ...x, title: e.currentTarget.value } : x) }) })}<textarea className='niceInput' placeholder='步骤说明' value={s.description} onChange={(e) => setV({ ...v, steps: v.steps.map((x) => x.id === s.id ? { ...x, description: e.currentTarget.value } : x) })} />{field({ placeholder: '步骤图片 URL', required: false, value: s.imageUrl || '', onChange: (e) => setV({ ...v, steps: v.steps.map((x) => x.id === s.id ? { ...x, imageUrl: e.currentTarget.value } : x) }) })}{field({ type: 'number', placeholder: '预计时长（分钟）', required: false, value: s.duration || '', onChange: (e) => setV({ ...v, steps: v.steps.map((x) => x.id === s.id ? { ...x, duration: Number(e.currentTarget.value) } : x) }) })}<button type='button' className='tinyBtn dangerBtn' onClick={() => setV({ ...v, steps: v.steps.filter((x) => x.id !== s.id).map((x, i) => ({ ...x, order: i + 1 })) })}>删除步骤</button></div>)}
    <button type='button' className='tinyBtn' onClick={() => setV({ ...v, steps: [...v.steps, { id: crypto.randomUUID(), order: v.steps.length + 1, description: '' }] })}>新增步骤</button>
    <h4>小贴士</h4>
    <textarea className='niceInput' placeholder='注意事项、火候、替代食材等' value={v.tips || ''} onChange={(e) => setV({ ...v, tips: e.currentTarget.value })} />
    <div className='formBtns'><button className='pillBtn'>保存菜谱</button></div>
  </form>;
}

function RecipeDetail({ recipe, dish, onEdit, onAddMeal }: { recipe: Recipe; dish?: Dish; onEdit: () => void; onAddMeal: () => void }) {
  return <article className='recipeDetail'><img className='detailCover' src={recipe.coverImageUrl || ''} alt={recipe.name} /><h3>{recipe.name}</h3><p>{recipe.description}</p><div className='tags'><span>{recipe.cuisine}</span><span>{difficultyLabel(recipe.difficulty)}</span><span>{recipe.cookingTime} 分钟</span>{recipe.servings ? <span>{recipe.servings} 人份</span> : null}</div><p>关联菜品：{dish?.name || '未关联'}</p><h4>食材清单</h4><div className='ingredients'>{recipe.ingredients.map((i) => <div key={i.id} className='ingredientItem'><b>{i.name}</b><small>{i.amount || '适量'} {i.note ? `· ${i.note}` : ''}</small></div>)}</div><h4>做法步骤</h4><div className='steps'>{recipe.steps.sort((a, b) => a.order - b.order).map((s) => <div key={s.id} className='stepItem'><div className='stepNo'>{s.order}</div><div><p>{s.title || `步骤 ${s.order}`}</p><small>{s.description}</small>{s.duration ? <em>{s.duration} 分钟</em> : null}</div></div>)}</div>{recipe.tips ? <><h4>小贴士</h4><p className='aiSum'>{recipe.tips}</p></> : null}<small>创建人：{recipe.createdBy === 'xiaobai' ? '小白' : '小鸡毛'} · 更新于 {recipe.updatedAt.slice(0, 10)}</small><div className='cardActions'><button className='tinyBtn secondaryBtn' onClick={onEdit}>编辑菜谱</button><button className='tinyBtn' onClick={onAddMeal}>加入点菜</button></div></article>;
}

function MemoryForm({ dishes, onSave }: { dishes: Dish[]; onSave: (v: { dishId?: string; dishName: string; imageUrl: string; review: string; chef: UserName; rating: number; wantAgain: boolean }) => void }) { const [v, set] = useState({ dishId: '', dishName: '', imageUrl: '', review: '', chef: '小白' as UserName, rating: 5, wantAgain: true }); return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave(v); }}><select className='niceInput' value={v.dishId} onChange={(e) => { const dish = dishes.find((d) => d.id === e.currentTarget.value); set({ ...v, dishId: e.currentTarget.value, dishName: dish?.name || '' }); }}><option value=''>关联菜品（可选）</option>{dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>{field({ placeholder: '菜名', value: v.dishName, onChange: (e) => set({ ...v, dishName: e.currentTarget.value }) })}{field({ placeholder: '图片 URL', value: v.imageUrl, onChange: (e) => set({ ...v, imageUrl: e.currentTarget.value }) })}<textarea className='niceInput' placeholder='原始评价' value={v.review} onChange={(e) => set({ ...v, review: e.currentTarget.value })} /><button className='pillBtn'>生成并保存</button></form>; }
