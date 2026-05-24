import { useMemo, useState } from 'react';
import { APP_NAME } from './data/mockData';
import { aiService } from './services/aiService';
import { storageService } from './services/storageService';
import { CuisineType, Dish, MealPeriod, MealPlan, OrderStatus, RestaurantRecord, TasteMemory, UserName } from './types/index';

type Tab = 'home' | 'plan' | 'menu' | 'memory' | 'footprint';
const users: UserName[] = ['小白', '小鸡毛'];
const periods: MealPeriod[] = ['早餐', '午餐', '晚餐', '夜宵'];
const statuses: OrderStatus[] = ['待确认', '已确认', '已完成', '已取消'];
const cuisines: ('全部' | CuisineType)[] = ['全部', '家常菜', '川湘菜', '粤菜', '日料', '西餐', '甜品', '轻食'];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [store, setStore] = useState(storageService.load());
  const [selectedMapId, setSelectedMapId] = useState<string | null>(store.restaurants.find(r => r.status === '已去')?.id ?? null);
  const persist = (next: typeof store) => { setStore(next); storageService.save(next); };

  const [keyword, setKeyword] = useState('');
  const [filterCuisine, setFilterCuisine] = useState<'全部' | CuisineType>('全部');
  const [dishForm, setDishForm] = useState<Omit<Dish, 'id'>>({ name: '', cuisine: '家常菜', description: '', imageUrl: '', createdBy: '小白' });
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  const [planForm, setPlanForm] = useState<Omit<MealPlan, 'id'>>({ date: new Date().toISOString().slice(0, 10), period: '晚餐', dishIds: [], note: '', orderedBy: '小白', status: '待确认' });
  const [memoryForm, setMemoryForm] = useState({ dishId: '', imageUrl: '', review: '', cookedBy: '小白' as UserName });
  const [restaurantForm, setRestaurantForm] = useState<Omit<RestaurantRecord, 'id'>>({ name: '', status: '想去', city: '上海', address: '', imageUrl: '', avgCost: 100, recommendedDishes: '', review: '', sourcePlatform: '大众点评', createdBy: '小白', recommendation: 4, lat: 31.23, lng: 121.47, visitedAt: '' });

  const filteredDishes = useMemo(() => store.dishes.filter(d => d.name.includes(keyword) && (filterCuisine === '全部' || d.cuisine === filterCuisine)), [store.dishes, keyword, filterCuisine]);
  const latestMemory = store.tasteMemories[0];
  const latestVisited = store.restaurants.find(r => r.status === '已去');
  const selectedSpot = store.restaurants.find(r => r.id === selectedMapId);

  const saveDish = () => {
    if (!dishForm.name.trim()) return;
    if (editingDishId) {
      persist({ ...store, dishes: store.dishes.map(d => d.id === editingDishId ? { ...d, ...dishForm } : d) });
      setEditingDishId(null);
    } else {
      persist({ ...store, dishes: [{ ...dishForm, id: crypto.randomUUID() }, ...store.dishes] });
    }
    setDishForm({ name: '', cuisine: '家常菜', description: '', imageUrl: '', createdBy: '小白' });
  };

  const addPlan = () => {
    if (!planForm.dishIds.length) return;
    persist({ ...store, mealPlans: [{ ...planForm, id: crypto.randomUUID() }, ...store.mealPlans] });
  };

  const addMemory = () => {
    const dish = store.dishes.find(d => d.id === memoryForm.dishId);
    if (!dish) return;
    const ai = aiService.generateTasteMemorySummary(dish.name, memoryForm.review);
    persist({ ...store, tasteMemories: [{ id: crypto.randomUUID(), dishId: dish.id, imageUrl: memoryForm.imageUrl || dish.imageUrl, review: memoryForm.review, cookedBy: memoryForm.cookedBy, aiTitle: ai.title, aiSummary: ai.summary, aiTags: ai.tags, aiSuggestion: ai.suggestion, createdAt: new Date().toISOString() }, ...store.tasteMemories] });
  };

  const addRestaurant = () => {
    if (!restaurantForm.name.trim()) return;
    const ai = aiService.generateRestaurantVisitSummary(restaurantForm.name, restaurantForm.review);
    persist({ ...store, restaurants: [{ ...restaurantForm, review: `${restaurantForm.review}｜${ai.summary}`, id: crypto.randomUUID() }, ...store.restaurants] });
  };

  return <div className='app-shell'>
    <header className='app-header'>
      <div className='brand'>{APP_NAME}</div>
      <p>每一餐，都是我们的小日子</p>
    </header>
    <main className='app-main'>
      {tab === 'home' && <section className='card'><h2>今天想吃点什么？</h2><p>记录小白和小鸡毛的私房菜日常，把每一餐都留下来。</p><div className='grid2'><div><h4>今日点菜</h4>{store.mealPlans[0] ? <p>{store.mealPlans[0].date} · {store.mealPlans[0].period} · {store.mealPlans[0].orderedBy}</p> : <p>这一餐还没有安排，看看想吃什么？</p>}</div><div><h4>最近味蕾记忆</h4>{latestMemory ? <p>{latestMemory.aiTitle}</p> : <p>记录今天的味道</p>}</div><div><h4>最近探店</h4>{latestVisited ? <p>{latestVisited.name} · {latestVisited.city}</p> : <p>把好吃的地方，留在地图上</p>}</div><div><h4>快捷入口</h4><p><button onClick={() => setTab('plan')}>去点菜</button><button onClick={() => setTab('memory')}>写味蕾记忆</button></p></div></div></section>}

      {tab === 'plan' && <section className='card'><h2>点菜预约</h2><input type='date' value={planForm.date} onChange={e => setPlanForm({ ...planForm, date: e.target.value })} /><select value={planForm.period} onChange={e => setPlanForm({ ...planForm, period: e.target.value as MealPeriod })}>{periods.map(p => <option key={p}>{p}</option>)}</select><select multiple value={planForm.dishIds} onChange={e => setPlanForm({ ...planForm, dishIds: [...e.target.selectedOptions].map(o => o.value) })}>{store.dishes.map(d => <option value={d.id} key={d.id}>{d.name}</option>)}</select><textarea placeholder='备注（少辣、加汤等）' value={planForm.note} onChange={e => setPlanForm({ ...planForm, note: e.target.value })} /><select value={planForm.orderedBy} onChange={e => setPlanForm({ ...planForm, orderedBy: e.target.value as UserName })}>{users.map(u => <option key={u}>{u}</option>)}</select><select value={planForm.status} onChange={e => setPlanForm({ ...planForm, status: e.target.value as OrderStatus })}>{statuses.map(s => <option key={s}>{s}</option>)}</select><button onClick={addPlan}>保存点菜预约</button>{store.mealPlans.map(m => <div className='list-row' key={m.id}><b>{m.date} {m.period}</b><span>{m.orderedBy} · {m.status}</span></div>)}</section>}

      {tab === 'menu' && <section className='card'><h2>菜单管理</h2><input placeholder='搜索菜品' value={keyword} onChange={e => setKeyword(e.target.value)} /><select value={filterCuisine} onChange={e => setFilterCuisine(e.target.value as '全部' | CuisineType)}>{cuisines.map(c => <option key={c}>{c}</option>)}</select><input placeholder='菜名' value={dishForm.name} onChange={e => setDishForm({ ...dishForm, name: e.target.value })} /><select value={dishForm.cuisine} onChange={e => setDishForm({ ...dishForm, cuisine: e.target.value as CuisineType })}>{cuisines.slice(1).map(c => <option key={c}>{c}</option>)}</select><input placeholder='图片 URL' value={dishForm.imageUrl} onChange={e => setDishForm({ ...dishForm, imageUrl: e.target.value })} /><textarea placeholder='菜品描述' value={dishForm.description} onChange={e => setDishForm({ ...dishForm, description: e.target.value })} /><select value={dishForm.createdBy} onChange={e => setDishForm({ ...dishForm, createdBy: e.target.value as UserName })}>{users.map(u => <option key={u}>{u}</option>)}</select><button onClick={saveDish}>{editingDishId ? '更新菜品' : '新增菜品'}</button>{filteredDishes.map(d => <div className='list-row' key={d.id}><div><b>{d.name}</b><p>{d.cuisine} · {d.createdBy}</p></div><p><button onClick={() => { setEditingDishId(d.id); setDishForm({ name: d.name, cuisine: d.cuisine, description: d.description, imageUrl: d.imageUrl, createdBy: d.createdBy }); }}>编辑</button><button onClick={() => persist({ ...store, dishes: store.dishes.filter(x => x.id !== d.id) })}>删除</button></p></div>)}</section>}

      {tab === 'memory' && <section className='card'><h2>味蕾记忆</h2><select value={memoryForm.dishId} onChange={e => setMemoryForm({ ...memoryForm, dishId: e.target.value })}><option value=''>选择关联菜品</option>{store.dishes.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select><input placeholder='图片 URL' value={memoryForm.imageUrl} onChange={e => setMemoryForm({ ...memoryForm, imageUrl: e.target.value })} /><textarea placeholder='填写评价' value={memoryForm.review} onChange={e => setMemoryForm({ ...memoryForm, review: e.target.value })} /><select value={memoryForm.cookedBy} onChange={e => setMemoryForm({ ...memoryForm, cookedBy: e.target.value as UserName })}>{users.map(u => <option key={u}>{u}</option>)}</select><button onClick={addMemory}>生成并保存 AI 味蕾记录</button>{store.tasteMemories.map(m => <article className='album' key={m.id}><img src={m.imageUrl} alt={m.aiTitle} /><div><b>{m.aiTitle}</b><p>{m.aiSummary}</p><small>{m.aiTags.join(' · ')}</small><p>建议：{m.aiSuggestion}</p><em>下厨人：{m.cookedBy}</em></div></article>)}</section>}

      {tab === 'footprint' && <section className='card'><h2>美味足迹</h2><input placeholder='餐厅名称' value={restaurantForm.name} onChange={e => setRestaurantForm({ ...restaurantForm, name: e.target.value })} /><select value={restaurantForm.status} onChange={e => setRestaurantForm({ ...restaurantForm, status: e.target.value as '想去' | '已去' })}><option>想去</option><option>已去</option></select><input placeholder='图片 URL' value={restaurantForm.imageUrl} onChange={e => setRestaurantForm({ ...restaurantForm, imageUrl: e.target.value })} /><input placeholder='城市' value={restaurantForm.city} onChange={e => setRestaurantForm({ ...restaurantForm, city: e.target.value })} /><input placeholder='地址' value={restaurantForm.address} onChange={e => setRestaurantForm({ ...restaurantForm, address: e.target.value })} /><textarea placeholder='评价' value={restaurantForm.review} onChange={e => setRestaurantForm({ ...restaurantForm, review: e.target.value })} /><button onClick={addRestaurant}>新增探店记录</button><div className='map'>{store.restaurants.filter(r => r.status === '已去').map(r => <button key={r.id} className='pin' style={{ left: `${((r.lng - 121.40) / 0.12) * 100}%`, top: `${((31.28 - r.lat) / 0.12) * 100}%` }} onClick={() => setSelectedMapId(r.id)}>📍</button>)}</div>{selectedSpot && <div className='bottom-card'><img src={selectedSpot.imageUrl} alt={selectedSpot.name} /><div><b>{selectedSpot.name}</b><p>{selectedSpot.city} · {selectedSpot.address}</p><p>{selectedSpot.review}</p><small>推荐指数：{selectedSpot.recommendation}/5</small></div></div>}<h4>想去</h4>{store.restaurants.filter(r => r.status === '想去').map(r => <p key={r.id}>{r.name} · {r.createdBy}</p>)}<h4>已去</h4>{store.restaurants.filter(r => r.status === '已去').map(r => <p key={r.id}>{r.name} · {r.createdBy}</p>)}</section>}
    </main>

    <nav className='tabbar'>{[
      ['home', '首页'], ['plan', '点菜'], ['menu', '菜单'], ['memory', '味蕾记忆'], ['footprint', '美味足迹']
    ].map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id as Tab)}>{label}</button>)}</nav>
  </div>;
}
