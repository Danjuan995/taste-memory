import { FormEvent, InputHTMLAttributes, ReactNode, useMemo, useState } from 'react';
import { BadgeCheck, BookOpen, CalendarDays, House, MapPinned, Plus, Search, SoupIcon, UtensilsCrossed } from 'lucide-react';
import { APP_NAME } from './data/mockData';
import { aiService } from './services/aiService';
import { storageService } from './services/storageService';
import { createId } from './utils/createId';
import { AppTab, CuisineType, Dish, MealPeriod, OrderStatus, Recipe, RecipeDifficulty, TasteMemory, UserName } from './types/index';

const nav = [
  { id: 'home', label: '首页', icon: House },
  { id: 'meal', label: '点菜', icon: CalendarDays },
  { id: 'menu', label: '菜单', icon: UtensilsCrossed },
  { id: 'recipes', label: '菜谱', icon: BookOpen },
  { id: 'footprint', label: '美味足迹', icon: MapPinned },
] as const;
const periods: MealPeriod[] = ['早餐', '午餐', '晚餐', '夜宵'];
const cuisines: ('全部' | CuisineType)[] = ['全部', '家常菜', '川湘菜', '江浙菜', '粤菜', '西餐', '面食', '甜品', '汤羹'];
const fallbackImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 540"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23f9dfc0"/><stop offset="1" stop-color="%23ecc19d"/></linearGradient></defs><rect width="800" height="540" fill="url(%23g)"/></svg>';

export default function App() {
  const [tab, setTab] = useState<AppTab>('home');
  const [store, setStore] = useState(storageService.loadAll());
  const [identity, setIdentity] = useState<UserName>('小白');
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState<'全部' | CuisineType>('全部');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [overlay, setOverlay] = useState<'' | 'order' | 'dish' | 'memory'>('');

  const persist = (next: typeof store) => { setStore(next); storageService.saveAll(next); };
  const dishes = useMemo(() => store.dishes.filter((d) => d.name.includes(search) && (cuisine === '全部' || d.cuisine === cuisine)), [store.dishes, search, cuisine]);
  const memories = useMemo(() => [...store.memories].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [store.memories]);

  return <div className='shell app-shell'><div className='app'><main className='main page-content'>
    {tab === 'home' && <section className='stack page'>
      <div className='brandPanel'>
        <div className='brandMark'><div className='brandDot'><SoupIcon size={16} /></div><div><h1>{APP_NAME}</h1><p className='sub'>把每一次下厨的味道都认真留下来。</p></div></div>
        <button className='identityCapsule' onClick={() => setIdentity(identity === '小白' ? '小鸡毛' : '小白')}><span className='identityAvatar'>{identity[0]}</span><b>{identity}</b></button>
      </div>
      <section className='card memoryEntry'><div><h3>味蕾记忆</h3><p>做过什么、吃起来怎么样、下次还想不想吃，都留在这里。</p></div><button className='pillBtn' onClick={() => setOverlay('memory')}><Plus size={16}/>记录今天的味道</button></section>
      {memories.length === 0 ? <section className='empty memoryEmpty'><h3>还没有留下味蕾记忆</h3><p>记录今天做的第一道菜，把味道、评价和小留言都留在这里。</p><button className='pillBtn' onClick={() => setOverlay('memory')}>记录今天的味道</button></section> :
      <section className='memoryGrid'>{memories.map((m) => <div key={m.id}><MemoryCard memory={m} /></div>)}</section>}
    </section>}

    {tab === 'meal' && <section className='stack page'><div className='titleCard'><h2>安排下一餐</h2></div><input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='niceInput form-control'/>{periods.map((p) => <div key={p} className='card mealLine'><div className='lineHd'><b>{p}</b><button className='pillBtn small' onClick={() => setOverlay('order')}>预约这餐</button></div>{store.orders.filter((o) => o.date === date && o.period === p).map((o) => <p key={o.id}>{o.dishIds.map((id) => store.dishes.find((d) => d.id === id)?.name).filter(Boolean).join('、')} · {o.orderedBy} · <select value={o.status} onChange={(e) => persist(storageService.updateOrder(store, o.id, { status: e.target.value as OrderStatus }))}><option>待确认</option><option>已确认</option><option>已完成</option><option>已取消</option></select></p>)}</div>)}</section>}
    {tab === 'menu' && <section className='stack page'><div className='titleCard'><h2>私房菜单</h2></div><div className='searchBox'><Search size={16}/><input placeholder='搜索今天想吃的菜' value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className='chips'>{cuisines.map((c) => <button key={c} className={cuisine === c ? 'activeChip' : ''} onClick={() => setCuisine(c)}>{c}</button>)}</div><button className='pillBtn' onClick={() => setOverlay('dish')}><Plus size={16}/> 新增菜品</button><div className='grid2'>{dishes.map((d) => <article key={d.id} className='recipeCard'><img src={d.imageUrl || fallbackImage} alt={d.name} /><div><p>{d.name}</p><small>{d.cuisine} · {d.cookTime}分钟 · {d.difficulty}</small><div className='tags'>{d.recommended && <span><BadgeCheck size={12}/>推荐</span>}</div></div></article>)}</div></section>}
    {tab === 'recipes' && <section className='stack page'><div className='titleCard'><h2>私房菜谱</h2></div></section>}
    {tab === 'footprint' && <section className='stack page'><div className='titleCard'><h2>美味足迹</h2></div></section>}
  </main>

  <footer className='nav floating-tabbar safe-bottom'>{nav.map((n) => <button key={n.id} className={tab === n.id ? 'active tap-target' : 'tap-target'} onClick={() => setTab(n.id as AppTab)}><n.icon size={17}/><span>{n.label}</span></button>)}</footer>
  {overlay === 'order' && <Sheet title='新增点菜预约' close={() => setOverlay('')}><QuickOrder onSave={(data) => { persist(storageService.addOrder(store, data)); setOverlay(''); }} dishes={store.dishes} date={date} identity={identity} /></Sheet>}
  {overlay === 'dish' && <Sheet title='新增菜品' close={() => setOverlay('')}><DishForm onSave={(data) => { persist(storageService.addDish(store, data)); setOverlay(''); }} /></Sheet>}
  {overlay === 'memory' && <Sheet title='新增味蕾记忆' close={() => setOverlay('')}><MemoryForm dishes={store.dishes} identity={identity} onSave={(v) => { const ai = aiService.summarizeTaste(v.experience || v.review || '', v.dishName); persist(storageService.addMemory(store, { ...v, aiTitle: ai.title, aiSummary: ai.summary, aiTags: ai.tags, aiSuggestion: ai.suggestion })); setOverlay(''); setTab('home'); }} /></Sheet>}
</div></div>;
}

function MemoryCard({ memory }: { memory: TasteMemory }) { const tags = memory.aiTags?.length ? memory.aiTags : memory.tags || []; const message = memory.message || memory.note || '今天也认真做饭啦。'; const exp = memory.experience || memory.review || memory.aiSummary || '这一餐值得记录。'; const title = memory.aiTitle || memory.dishName || memory.title || '今日味道记录';
  return <article className='memoryCard'><div className='memoryImageWrap'><img src={memory.imageUrl || fallbackImage} alt={title} /><div className='memoryBadge'>{memory.wantAgain ? '想再吃' : memory.rating ? `${memory.rating}分` : '未评分'}</div></div><div className='memoryBody'><h4>{title}</h4><small>{memory.createdAt.slice(0, 10)} · 做饭人：{memory.chef}</small><p className='memoryText'><b>体验：</b>{exp}</p><p className='memoryText'><b>评价：</b>{memory.review || memory.comment || '暂无评价'}</p><p className='memoryText'><b>留言：</b>{message}</p><div className='tags'>{tags.map((t) => <span key={t}>{t}</span>)}</div><div className='cardActions'><button className='tinyBtn secondaryBtn'>查看详情</button><button className='tinyBtn'>编辑</button></div></div></article>; }

function Sheet({ title, close, children }: { title: string; close: () => void; children: ReactNode }) { return <div className='sheetWrap' onClick={close}><div className='sheet card' onClick={(e) => e.stopPropagation()}><h3>{title}</h3>{children}</div></div>; }
const field = (p: InputHTMLAttributes<HTMLInputElement>) => <input className='niceInput' {...p} required={p.required ?? true} />;

function QuickOrder({ dishes, onSave, date, identity }: { dishes: Dish[]; onSave: (v: { date: string; period: MealPeriod; dishIds: string[]; note: string; orderedBy: UserName; status: OrderStatus }) => void; date: string; identity: UserName }) { const [v, set] = useState<{ date: string; period: MealPeriod; dishIds: string[]; note: string; orderedBy: UserName; status: OrderStatus }>({ date, period: '晚餐', dishIds: [], note: '', orderedBy: identity, status: '待确认' }); return <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className='form'>{field({ type: 'date', value: v.date, onChange: (e) => set({ ...v, date: e.currentTarget.value }) })}<select className='niceInput' value={v.period} onChange={(e) => set({ ...v, period: e.currentTarget.value as MealPeriod })}>{periods.map((p) => <option key={p}>{p}</option>)}</select><select className='niceInput' onChange={(e) => set({ ...v, dishIds: [e.currentTarget.value] })}><option value=''>选择菜品</option>{dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>{field({ placeholder: '备注', value: v.note, onChange: (e) => set({ ...v, note: e.currentTarget.value }), required: false })}<select className='niceInput' value={v.orderedBy} onChange={(e) => set({ ...v, orderedBy: e.currentTarget.value as UserName })}><option>小白</option><option>小鸡毛</option></select><button className='pillBtn'>保存</button></form>; }
function DishForm({ onSave }: { onSave: (v: Omit<Dish, 'id'>) => void }) { const [v, set] = useState<Omit<Dish, 'id'>>({ name: '', imageUrl: '', cuisine: '家常菜', description: '', tags: [], difficulty: '简单', cookTime: 30, recommended: false, frequent: false }); return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave({ ...v, tags: String(v.tags).split(/[，,]/).filter(Boolean), cookTime: Number(v.cookTime) }); }}>{field({ placeholder: '菜名', value: v.name, onChange: (e) => set({ ...v, name: e.currentTarget.value }) })}{field({ placeholder: '图片 URL', value: v.imageUrl, onChange: (e) => set({ ...v, imageUrl: e.currentTarget.value }) })}<select className='niceInput' value={v.cuisine} onChange={(e) => set({ ...v, cuisine: e.currentTarget.value as CuisineType })}>{cuisines.slice(1).map((c) => <option key={c}>{c}</option>)}</select>{field({ placeholder: '简介', value: v.description, onChange: (e) => set({ ...v, description: e.currentTarget.value }) })}<button className='pillBtn'>保存菜品</button></form>; }

function MemoryForm({ dishes, identity, onSave }: { dishes: Dish[]; identity: UserName; onSave: (v: { dishId?: string; dishName: string; imageUrl: string; chef: UserName; rating?: number; experience: string; review: string; message: string; note?: string; wantAgain: boolean; tags: string[] }) => void }) {
  const [v, set] = useState({ dishId: '', dishName: '', imageUrl: '', chef: identity, rating: 5, experience: '', review: '', message: '', wantAgain: true, tags: '' });
  return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave({ ...v, dishId: v.dishId || undefined, tags: v.tags.split(/[，,\s]+/).filter(Boolean), note: v.message }); }}><select className='niceInput' value={v.dishId} onChange={(e) => { const dish = dishes.find((d) => d.id === e.currentTarget.value); set({ ...v, dishId: e.currentTarget.value, dishName: dish?.name || '' }); }}><option value=''>关联菜品（可选）</option>{dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>{field({ placeholder: '菜名', value: v.dishName, onChange: (e) => set({ ...v, dishName: e.currentTarget.value }) })}{field({ placeholder: '图片 URL（可选）', required: false, value: v.imageUrl, onChange: (e) => set({ ...v, imageUrl: e.currentTarget.value }) })}<select className='niceInput' value={v.chef} onChange={(e) => set({ ...v, chef: e.currentTarget.value as UserName })}><option>小白</option><option>小鸡毛</option></select>{field({ type: 'number', placeholder: '评分 1-5', required: false, value: v.rating, onChange: (e) => set({ ...v, rating: Number(e.currentTarget.value) }) })}<textarea className='niceInput' placeholder='体验' value={v.experience} onChange={(e) => set({ ...v, experience: e.currentTarget.value })} /><textarea className='niceInput' placeholder='评价' value={v.review} onChange={(e) => set({ ...v, review: e.currentTarget.value })} /><textarea className='niceInput' placeholder='留言' value={v.message} onChange={(e) => set({ ...v, message: e.currentTarget.value })} /><select className='niceInput' value={String(v.wantAgain)} onChange={(e) => set({ ...v, wantAgain: e.currentTarget.value === 'true' })}><option value='true'>还想再吃</option><option value='false'>暂时不想再吃</option></select>{field({ placeholder: '标签（逗号分隔）', required: false, value: v.tags, onChange: (e) => set({ ...v, tags: e.currentTarget.value }) })}<button className='pillBtn'>保存味蕾记忆</button></form>;
}

function difficultyLabel(d: RecipeDifficulty) { return d === 'easy' ? '简单' : d === 'normal' ? '中等' : '进阶'; }
void difficultyLabel;
void FormEvent;
void createId;
