import { useMemo, useState } from 'react';
import { APP_NAME } from './data/mockData';
import { aiService } from './services/aiService';
import { storageService } from './services/storageService';
import { CuisineType, Dish, MealOrder, OrderStatus, Restaurant, TasteMemory } from './types/index';

type Tab = 'home' | 'meal' | 'menu' | 'memory' | 'footprint';

const nav: { id: Tab; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'meal', label: '点菜' },
  { id: 'menu', label: '菜单' },
  { id: 'memory', label: '味蕾记忆' },
  { id: 'footprint', label: '美味足迹' }
];

const cuisines: ('全部' | CuisineType)[] = ['全部', '家常菜', '川湘菜', '粤菜', '日料', '西餐', '甜品', '轻食'];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [store, setStore] = useState(storageService.load());
  const [keyword, setKeyword] = useState('');
  const [filterCuisine, setFilterCuisine] = useState<'全部' | CuisineType>('全部');

  const persist = (next: typeof store) => {
    setStore(next);
    storageService.save(next);
  };

  const filteredDishes = useMemo(() => store.dishes.filter((d) =>
    d.name.includes(keyword) && (filterCuisine === '全部' || d.cuisine === filterCuisine)
  ), [store.dishes, keyword, filterCuisine]);

  const addDish = (dish: Omit<Dish, 'id'>) => persist({ ...store, dishes: [{ ...dish, id: crypto.randomUUID() }, ...store.dishes] });
  const deleteDish = (id: string) => persist({ ...store, dishes: store.dishes.filter((d) => d.id !== id) });
  const updateDish = (id: string, patch: Partial<Dish>) => persist({ ...store, dishes: store.dishes.map((d) => d.id === id ? { ...d, ...patch } : d) });

  const addOrder = (order: Omit<MealOrder, 'id'>) => persist({ ...store, orders: [{ ...order, id: crypto.randomUUID() }, ...store.orders] });
  const updateOrderStatus = (id: string, status: OrderStatus) => persist({ ...store, orders: store.orders.map((o) => o.id === id ? { ...o, status } : o) });

  const addMemory = (memory: Omit<TasteMemory, 'id' | 'createdAt'>) => persist({ ...store, memories: [{ ...memory, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...store.memories] });
  const addRestaurant = (restaurant: Omit<Restaurant, 'id'>) => persist({ ...store, restaurants: [{ ...restaurant, id: crypto.randomUUID() }, ...store.restaurants] });

  return <div className='app'>
    <header className='header'><h1>{APP_NAME}</h1><p>记录属于我们的私房菜生活</p></header>
    <main className='main'>
      {tab === 'home' && <section className='card'><h2>今天吃什么？</h2><p>小白和小鸡毛今天想吃点什么？</p><p>已记录菜品 {store.dishes.length} 道，味蕾记忆 {store.memories.length} 条。</p></section>}
      {tab === 'menu' && <section className='card'><h2>菜单管理</h2><input placeholder='搜索菜品' value={keyword} onChange={e => setKeyword(e.target.value)} /><select value={filterCuisine} onChange={e => setFilterCuisine(e.target.value as any)}>{cuisines.map(c => <option key={c}>{c}</option>)}</select><button onClick={() => addDish({ name: '新菜品', cuisine: '家常菜', description: '待补充描述', imageUrl: '' })}>新增菜品</button>{filteredDishes.map(d => <div key={d.id}><b>{d.name}</b> · {d.cuisine}<button onClick={() => updateDish(d.id, { name: d.name + '✨' })}>编辑</button><button onClick={() => deleteDish(d.id)}>删除</button></div>)}</section>}
      {tab === 'meal' && <section className='card'><h2>点菜预约</h2><button onClick={() => addOrder({ date: new Date().toISOString().slice(0,10), period: '晚餐', dishIds: store.dishes.slice(0,1).map(d => d.id), note: '这一餐还没有安排，先来一份试试', orderedBy: '小白', status: '待确认' })}>新增预约</button>{store.orders.map(o => <div key={o.id}>{o.date} {o.period} · {o.orderedBy} · {o.status}<button onClick={() => updateOrderStatus(o.id, '已确认')}>设为已确认</button></div>)}</section>}
      {tab === 'memory' && <section className='card'><h2>味蕾记忆</h2><button onClick={() => {
        const dish = store.dishes[0]; if (!dish) return;
        const ai = aiService.summarizeTaste('今天这道菜很香很暖', dish.name);
        addMemory({ imageUrl: dish.imageUrl, review: '今天这道菜，值得再做一次', dishId: dish.id, chef: '小鸡毛', aiTitle: ai.title, aiSummary: ai.summary, aiTags: ai.tags, aiSuggestion: ai.suggestion });
      }}>生成一条 AI 味蕾记录</button>{store.memories.map(m => <div key={m.id}><b>{m.aiTitle}</b><p>{m.aiSummary}</p><small>{m.aiTags.join(' / ')}</small></div>)}</section>}
      {tab === 'footprint' && <section className='card'><h2>美味足迹</h2><button onClick={() => addRestaurant({ name: '想去的小馆子', status: '想去', city: '上海', address: '静安区', imageUrl: '', avgCost: 120, recommendedDishes: '招牌面', review: '先收藏，周末去', sourcePlatform: '美团', lat: 31.23, lng: 121.47 })}>新增餐厅</button>{store.restaurants.map(r => <div key={r.id}><b>{r.name}</b> · {r.city} · {r.status}<p>{r.address}</p></div>)}</section>}
    </main>
    <footer className='nav'>{nav.map(n => <button key={n.id} className={tab===n.id ? 'active' : ''} onClick={() => setTab(n.id)}>{n.label}</button>)}</footer>
  </div>;
}
