import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { BuyerView } from './components/BuyerView';
import { SellerView } from './components/SellerView';
import { supabase } from '../supabase'; // 確保路徑正確

// 1. 定義資料結構
export type FoodListing = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  expiryDate: string;
  storeName: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  category: string;
};

export default function App() {
  const [view, setView] = useState<'home' | 'buyer' | 'seller'>('home');
  
  // 2. 這是你的初始預設資料（當雲端沒資料時顯示）
  const [listings, setListings] = useState<FoodListing[]>([
    {
      id: '1',
      title: '雲端載入中...',
      description: '正在嘗試從 Supabase 抓取最新資料',
      originalPrice: 0,
      discountPrice: 0,
      quantity: 0,
      expiryDate: '',
      storeName: '系統',
      address: '',
      lat: 25.033,
      lng: 121.565,
      image: 'https://i.ytimg.com/vi/DSCuXyduXXA/hqdefault.jpg',
      category: '系統'
    }
  ]);

  // 3. 自動從 Supabase 抓取資料的邏輯
  useEffect(() => {
    const fetchRealData = async () => {
      const { data, error } = await supabase
        .from('fruit') // 這裡對應你 Supabase 的資料表
        .select('*');

      if (error) {
        console.error('抓取雲端失敗，使用預設資料:', error);
      } else {
        console.log('Supabase 資料:', data);
      }

      if (data && data.length > 0) {
        // 將 Supabase 的欄位映射到你的 FoodListing 格式
        const mappedData = data.map((d: any) => ({
          id: d.id.toString(),
          title: d.名稱 || '未知產品',
          description: d.描述 || '無描述',
          originalPrice: d.原價 || 0,
          discountPrice: d.折扣後 || 0,
          quantity: d.數量 || 1,
          expiryDate: d.到期日 || '',
          storeName: d.商家名稱 || '未知商家',
          address: d.地址 || '',
          lat: d.lat || 25.0,
          lng: d.lng || 121.0,
          image: d.圖片網址 || 'https://via.placeholder.com/150',
          category: d.分類 || '未分類'
        }));
        setListings(mappedData);
      }
    };

    fetchRealData();
  }, []);

  // 4. 功能函式（新增、修改、刪除）
  const addListing = (listing: Omit<FoodListing, 'id'>) => {
    const newListing: FoodListing = { ...listing, id: Date.now().toString() };
    setListings([newListing, ...listings]);
  };

  const updateListing = (id: string, updates: Partial<FoodListing>) => {
    setListings(listings.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
  };

  // 5. 畫面切換邏輯
  if (view === 'buyer') {
    return <BuyerView listings={listings} onBack={() => setView('home')} />;
  }

  if (view === 'seller') {
    return (
      <SellerView
        listings={listings}
        onBack={() => setView('home')}
        onAddListing={addListing}
        onUpdateListing={updateListing}
        onDeleteListing={deleteListing}
      />
    );
  }

  return <Home onSelectBuyer={() => setView('buyer')} onSelectSeller={() => setView('seller')} />;
}