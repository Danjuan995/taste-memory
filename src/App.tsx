import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Camera,
  ChefHat,
  Clock3,
  Heart,
  House,
  MapPinned,
  MoonStar,
  Search,
  Sparkles,
  Soup,
  Sun,
  Sunrise,
  UtensilsCrossed,
} from 'lucide-react';
import { APP_NAME, APP_SUBTITLE } from './data/mockData';
import { aiService } from './services/aiService';
import { storageService } from './services/storageService';
import { AppTab, CuisineType, MealPeriod, OrderStatus } from './types/index';

const nav = [
  { id: 'home', label: '首页', icon: House },
  { id: 'meal', label: '点菜', icon: CalendarDays },
  { id: 'menu', label: '菜单', icon: BookOpen },
  { id: 'memory', label: '味蕾记忆', icon: Camera },
  { id: 'footprint', label: '美味足迹', icon: MapPinned },
] as const;
const periods: MealPeriod[] = ['早餐', '午餐', '晚餐', '夜宵'];
const periodIcon = { 早餐: Sunrise, 午餐: Sun, 晚餐: Soup, 夜宵: MoonStar };
const cuisines: ('全部' | CuisineType)[] = ['全部', '家常菜', '川湘菜', '江浙菜', '粤菜', '西餐', '面食', '甜品', '汤羹'];
const ideas = [
  { name: '番茄牛腩', tag: '暖胃', time: '60 分钟' },
  { name: '葱油拌面', tag: '快手', time: '18 分钟' },
  { name: '玉米排骨汤', tag: '慢炖', time: '75 分钟' },
  { name: '香煎鸡腿饭', tag: '人气', time: '35 分钟' },
];

export default function App() {
  const [tab, setTab] = useState<AppTab>('home');
  const [store, setStore] = useState(storageService.loadAll());
  const [identity, setIdentity] = useState<'小白' | '小鸡毛'>('小白');
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState<'全部' | CuisineType>('全部');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [overlay, setOverlay] = useState<'' | 'order' | 'dish' | 'memory' | 'restaurant'>('');
  const [editingDish, setEditingDish] = useState<string>('');
  const [mapPick, setMapPick] = useState<string>('');

  const persist = (next: typeof store) => { setStore(next); storageService.saveAll(next); };
  const todayOrders = store.orders.filter((o) => o.date === date);
  const dishes = useMemo(() => store.dishes.filter((d) => d.name.includes(search) && (cuisine === '全部' || d.cuisine === cuisine)), [store.dishes, search, cuisine]);
  const featuredDish = dishes[0] || store.dishes[0];

  return <div className='shell'><div className='app'><main className='main'>
    {tab === 'home' && <section className='stack'>
      <div className='brandPanel'>
        <div><h1>{APP_NAME}</h1><p className='sub'>今天也要认真吃饭</p></div>
        <button className='idSwitch' onClick={() => setIdentity(identity === '小白' ? '小鸡毛' : '小白')}><ChefHat size={14} />{identity}</button>
      </div>
      <section className='hero card'>
        <div className='heroContent'><span className='heroTag'>今日推荐</span><h2>今天想吃点什么？</h2><p>把每一餐都变成小白和小鸡毛的私房菜记忆。</p>
          <div className='heroActions'><button onClick={() => setTab('meal')}>预约点菜</button><button className='ghost' onClick={() => setTab('memory')}>记录下厨</button></div>
        </div>
      </section>

      <section><div className='secHead'><h3>今日灵感</h3></div><div className='hScroll'>{ideas.map((i, idx) => {
        const dish = store.dishes[idx % Math.max(store.dishes.length, 1)];
        return <article key={i.name} className='discoverCard'>
          <img src={dish?.imageUrl} alt={i.name} /><div><p>{i.name}</p><small>{i.tag} · {i.time}</small><button className='tinyBtn' onClick={() => { setTab('meal'); setOverlay('order'); }}>加入点菜</button></div>
        </article>;
      })}</div></section>

      <section className='card'><h3>今日点菜</h3><div className='mealGrid'>{periods.map((p) => { const o = todayOrders.find((x) => x.period === p); const Icon = periodIcon[p]; return <button key={p} className='mealCard' onClick={() => { setTab('meal'); setOverlay('order'); }}><div className='mealHead'><Icon size={16} /><span>{p}</span></div><em className={o ? 'tag ok' : 'tag'}>{o ? '已安排' : '还没安排'}</em><b>{o ? o.dishIds.map((id) => store.dishes.find((d) => d.id === id)?.name).filter(Boolean).join('、') : '点击预约这餐'}</b></button>; })}</div></section>

      <section><div className='secHead'><h3>最近味蕾记忆</h3></div>{store.memories.length ? <div className='hScroll'>{store.memories.slice(0, 5).map((m) => <article key={m.id} className='imageCard'><img src={m.imageUrl} alt={m.aiTitle}/><div><p>{m.aiTitle}</p><small>{m.createdAt.slice(0, 10)} · {m.aiTags.slice(0, 2).join(' / ')}</small></div></article>)}</div> : <div className='empty photoEmpty'><Sparkles size={20} />还没有留下味蕾记忆，记录今天做的第一道菜吧。</div>}</section>

      <section><div className='secHead'><h3>最近探店</h3></div><div className='hScroll'>{store.restaurants.map((r) => <article key={r.id} className='imageCard'><img src={r.imageUrl} alt={r.name}/><div><p>{r.name}</p><small>{r.city} · 推荐 {r.score} · {r.wantAgain ? '想再去' : '尝鲜过'}</small></div></article>)}</div></section>
    </section>}

    {tab === 'meal' && <section className='stack'><div className='titleCard'><h2>安排下一餐</h2><p>选一道想吃的菜，约好属于我们的时间。</p></div>
      <div className='hScroll'>{['今天', '明天', '周末', '自定义日期'].map((d) => <button key={d} className='dateCard'>{d}</button>)}</div>
      <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='niceInput'/>
      <div className='chips'>{periods.map((p) => <button key={p} className='activeChip'>{p}</button>)}</div>
      <div className='pickGrid'>{store.dishes.slice(0, 4).map((d) => <article key={d.id} className='pickCard'><img src={d.imageUrl} alt={d.name}/><p>{d.name}</p><small>{d.tags[0]} · {d.cookTime}分钟</small></article>)}</div>
      {periods.map((p) => <div key={p} className='card mealLine'><div className='lineHd'><b>{p}</b><button className='pillBtn small' onClick={() => setOverlay('order')}>预约这餐</button></div>{todayOrders.filter((o) => o.period === p).map((o) => <p key={o.id}>{o.dishIds.map((id) => store.dishes.find((d) => d.id === id)?.name).join('、') || '未选菜'} · {o.orderedBy} · <select value={o.status} onChange={(e) => persist(storageService.updateOrder(store, o.id, { status: e.target.value as OrderStatus }))}><option>待确认</option><option>已确认</option><option>已完成</option><option>已取消</option></select></p>)}</div>)}
      <button className='saveBar' onClick={() => setOverlay('order')}>保存这次安排</button>
    </section>}

    {tab === 'menu' && <section className='stack'><div className='titleCard'><h2>私房菜单</h2><p>这些是小白和小鸡毛常吃、想吃、值得再做的菜。</p></div><div className='searchBox'><Search size={16}/><input placeholder='搜索今天想吃的菜' value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className='chips'>{cuisines.map((c) => <button key={c} className={cuisine === c ? 'activeChip' : ''} onClick={() => setCuisine(c)}>{c}</button>)}</div>
      {featuredDish && <article className='featureRecipe'><img src={featuredDish.imageUrl} alt={featuredDish.name}/><div><span>今日推荐</span><h3>{featuredDish.name}</h3><p>{featuredDish.tags.slice(0, 2).join(' · ')} · {featuredDish.cookTime} 分钟</p><button className='pillBtn' onClick={() => { setTab('meal'); setOverlay('order'); }}>加入点菜</button></div></article>}
      <div className='grid2'>{dishes.map((d) => <article key={d.id} className='recipeCard'><img src={d.imageUrl} alt={d.name} /><div><p>{d.name}</p><small>{d.cuisine} · {d.cookTime}分钟 · {d.difficulty}</small><div className='tags'>{d.recommended && <span><BadgeCheck size={12}/>推荐</span>}{d.frequent && <span><Heart size={12}/>常吃</span>}</div></div></article>)}</div>
    </section>}

    {tab === 'memory' && <section className='stack'><div className='heroLite'><h3>记录今天的味道</h3><p>拍下这道菜，写下这一餐的感觉。</p><button className='pillBtn' onClick={() => setOverlay('memory')}>新增味蕾记忆</button></div><div className='grid1'>{store.memories.map((m) => <article key={m.id} className='albumCard'><img src={m.imageUrl} /><div><h4>{m.aiTitle}</h4><small>{m.createdAt.slice(0, 10)} · {m.chef} · ⭐{m.rating}</small><div className='tags'>{m.aiTags.slice(0, 3).map((t) => <span key={t}>{t}</span>)}</div><p className='aiSum'>{m.aiSummary}</p></div></article>)}</div></section>}

    {tab === 'footprint' && <section className='stack'><div className='titleCard'><h2>美味足迹</h2><p>探店记录与地图回忆，留住每一次好吃的相遇。</p></div><div className='grid2'>{store.restaurants.map((r) => <article key={r.id} className='recipeCard'><img src={r.imageUrl} /><div><p>{r.name}</p><small>{r.city} · {r.recommendedDishes} · 推荐 {r.score}</small><div className='tags'><span>{r.status}</span><span>{r.wantAgain ? '想再去' : '已打卡'}</span></div></div></article>)}</div><div className='card map'>{store.restaurants.filter((r) => r.status === '已去').map((r, i) => <button key={r.id} className='pin' style={{ left: `${18 + i * 26}%`, top: `${24 + (i % 3) * 20}%` }} onClick={() => setMapPick(r.id)}><img src={r.imageUrl} /><span>{r.city}</span></button>)}</div>{mapPick && <div className='sheetLike card'><img src={store.restaurants.find((r) => r.id === mapPick)?.imageUrl} /><h3>{store.restaurants.find((r) => r.id === mapPick)?.name}</h3><p>{store.restaurants.find((r) => r.id === mapPick)?.address}</p><small>{store.restaurants.find((r) => r.id === mapPick)?.review} · 推荐 {store.restaurants.find((r) => r.id === mapPick)?.score}</small></div>}</section>}
  </main>

  <footer className='nav'>{nav.map((n) => <button key={n.id} className={tab === n.id ? 'active' : ''} onClick={() => setTab(n.id as AppTab)}><n.icon size={16}/><span>{n.label}</span></button>)}</footer>
  {overlay === 'order' && <Sheet title='新增点菜预约' close={() => setOverlay('')}><QuickOrder onSave={(data: any) => { persist(storageService.addOrder(store, data)); setOverlay(''); }} dishes={store.dishes} date={date} /></Sheet>}
  {overlay === 'dish' && <Sheet title={editingDish ? '编辑菜品' : '新增菜品'} close={() => setOverlay('')}><DishForm dish={store.dishes.find((d) => d.id === editingDish)} onSave={(data: any) => { persist(editingDish ? storageService.updateDish(store, editingDish, data) : storageService.addDish(store, data)); setOverlay(''); }} /></Sheet>}
  {overlay === 'memory' && <Sheet title='新增味蕾记忆' close={() => setOverlay('')}><MemoryForm dishes={store.dishes} onSave={(v: any) => { const ai = aiService.summarizeTaste(v.review, v.dishName); persist(storageService.addMemory(store, { ...v, ...ai })); setOverlay(''); }} /></Sheet>}
  {overlay === 'restaurant' && <Sheet title='新增餐厅记录' close={() => setOverlay('')}><RestaurantForm onSave={(v: any) => { persist(storageService.addRestaurant(store, v)); setOverlay(''); }} /></Sheet>}
</div></div>;
}
function Sheet({ title, close, children }: any) { return <div className='sheetWrap' onClick={close}><div className='sheet card' onClick={(e) => e.stopPropagation()}><h3>{title}</h3>{children}</div></div>; }
const field = (p: any) => <input className='niceInput' {...p} required />;
function QuickOrder({ dishes, onSave, date }: any) { const [v, set] = useState({ date, period: '晚餐', dishIds: [], note: '', orderedBy: '小白', status: '待确认' }); return <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className='form'>{field({ type: 'date', value: v.date, onChange: (e: any) => set({ ...v, date: e.target.value }) })}<select className='niceInput' value={v.period} onChange={(e) => set({ ...v, period: e.target.value })}>{periods.map((p) => <option key={p}>{p}</option>)}</select><select className='niceInput' onChange={(e) => set({ ...v, dishIds: [e.target.value] })}>{dishes.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>{field({ placeholder: '备注', value: v.note, onChange: (e: any) => set({ ...v, note: e.target.value }) })}<select className='niceInput' value={v.orderedBy} onChange={(e) => set({ ...v, orderedBy: e.target.value })}><option>小白</option><option>小鸡毛</option></select><select className='niceInput' value={v.status} onChange={(e) => set({ ...v, status: e.target.value })}><option>待确认</option><option>已确认</option><option>已完成</option><option>已取消</option></select><button className='pillBtn'>保存</button></form>; }
function DishForm({ dish, onSave }: any) { const [v, set] = useState(dish || { name: '', imageUrl: '', cuisine: '家常菜', description: '', tags: [], difficulty: '简单', cookTime: 30, recommended: false, frequent: false }); return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave({ ...v, tags: String(v.tags).split(/[，,]/).filter(Boolean), cookTime: Number(v.cookTime) }); }}>{field({ placeholder: '菜名', value: v.name, onChange: (e: any) => set({ ...v, name: e.target.value }) })}{field({ placeholder: '图片 URL', value: v.imageUrl, onChange: (e: any) => set({ ...v, imageUrl: e.target.value }) })}<select className='niceInput' value={v.cuisine} onChange={(e) => set({ ...v, cuisine: e.target.value })}>{cuisines.slice(1).map((c) => <option key={c}>{c}</option>)}</select>{field({ placeholder: '简介', value: v.description, onChange: (e: any) => set({ ...v, description: e.target.value }) })}{field({ placeholder: '标签（逗号分隔）', value: v.tags, onChange: (e: any) => set({ ...v, tags: e.target.value }) })}{field({ type: 'number', placeholder: '制作时间(分钟)', value: v.cookTime, onChange: (e: any) => set({ ...v, cookTime: e.target.value }) })}<button className='pillBtn'>保存菜品</button></form>; }
function MemoryForm({ dishes, onSave }: any) { const [v, set] = useState({ dishId: '', dishName: '', imageUrl: '', review: '', chef: '小白', rating: 5, wantAgain: true }); return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave(v); }}><select className='niceInput' value={v.dishId} onChange={(e) => { const dish = dishes.find((d: any) => d.id === e.target.value); set({ ...v, dishId: e.target.value, dishName: dish?.name || '' }); }}><option value=''>关联菜品（可选）</option>{dishes.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>{field({ placeholder: '菜名', value: v.dishName, onChange: (e: any) => set({ ...v, dishName: e.target.value }) })}{field({ placeholder: '图片 URL', value: v.imageUrl, onChange: (e: any) => set({ ...v, imageUrl: e.target.value }) })}{field({ placeholder: '原始评价', value: v.review, onChange: (e: any) => set({ ...v, review: e.target.value }) })}<select className='niceInput' value={v.chef} onChange={(e) => set({ ...v, chef: e.target.value })}><option>小白</option><option>小鸡毛</option></select>{field({ type: 'number', min: 1, max: 5, value: v.rating, onChange: (e: any) => set({ ...v, rating: Number(e.target.value) }) })}<button className='pillBtn'>生成并保存</button></form>; }
function RestaurantForm({ onSave }: any) { const [v, set] = useState({ name: '', status: '想去', city: '', address: '', imageUrl: '', type: '', avgCost: 80, recommendedDishes: '', review: '', score: 4.5, wantAgain: true, sourcePlatform: '手动', lat: 31.2, lng: 121.4 }); return <form className='form' onSubmit={(e) => { e.preventDefault(); onSave({ ...v, avgCost: Number(v.avgCost), score: Number(v.score) }); }}>{field({ placeholder: '餐厅名称', value: v.name, onChange: (e:any)=>set({...v,name:e.target.value})})}<select className='niceInput' value={v.status} onChange={(e) => set({ ...v, status: e.target.value })}><option>想去</option><option>已去</option></select>{field({ placeholder: '城市', value: v.city, onChange: (e:any)=>set({...v,city:e.target.value}) })}{field({ placeholder: '地址', value: v.address, onChange: (e:any)=>set({...v,address:e.target.value}) })}{field({ placeholder: '图片 URL', value: v.imageUrl, onChange: (e:any)=>set({...v,imageUrl:e.target.value}) })}{field({ placeholder: '类型', value: v.type, onChange: (e:any)=>set({...v,type:e.target.value}) })}<button className='pillBtn'>保存餐厅</button></form>; }
