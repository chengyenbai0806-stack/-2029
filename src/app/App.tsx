import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { BuyerView } from './components/BuyerView';
import { SellerView } from './components/SellerView';
import { supabase } from '../supabase'; 
import { useJsApiLoader } from '@react-google-maps/api'; // <--- 新增：地圖載入工具

// 1. 定義資料結構 (保持不變)
export type FoodListing = {
  id: string; title: string; description: string;
  originalPrice: number; discountPrice: number;
  quantity: number; expiryDate: string;
  storeName: string; address: string;
  lat: number; lng: number; image: string; category: string;
};

export default function App() {
  const [view, setView] = useState<'home' | 'buyer' | 'seller'>('home');
  const [listings, setListings] = useState<FoodListing[]>([]);

  // 1-1. 載入 Google Maps API <--- 新增
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  // 3. 自動從 Supabase 抓取資料 (保持你的邏輯)
  useEffect(() => {
    const fetchRealData = async () => {
      const { data, error } = await supabase.from('fruit').select('*');
      if (data) {
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
          lat: parseFloat(d.lat) || 23.700,
          lng: parseFloat(d.lng) || 120.430,
          image: d.圖片網址 || 'https://via.placeholder.com/150',
          category: d.分類 || '未分類'
        }));
        setListings(mappedData);
      }
    };
    fetchRealData();
  }, []); // 👈 確保 useEffect 在這裡就結束了！

  // --- 步驟 3: 把這些功能寫在 useEffect 外面 (解決 Scope 問題) ---
  const addListing = async (newListing: Omit<FoodListing, 'id'>) => {
    const { error } = await supabase.from('fruit').insert([{
      名稱: newListing.title,
      描述: newListing.description,
      原價: newListing.originalPrice,
      折扣後: newListing.discountPrice,
      數量: newListing.quantity,
      到期日: newListing.expiryDate,
      商家名稱: newListing.storeName,
      地址: newListing.address,
      lat: newListing.lat,
      lng: newListing.lng,
      圖片網址: newListing.image,
      分類: newListing.category
    }]);
    if (error) console.error(error);
    else window.location.reload();
  };

  const updateListing = async (id: string, updates: Partial<FoodListing>) => {
    const { error } = await supabase.from('fruit').update({
      名稱: updates.title,
      描述: updates.description,
      原價: updates.originalPrice,
      折扣後: updates.discountPrice,
      數量: updates.quantity,
      地址: updates.address,
      到期日: updates.expiryDate
    }).eq('id', id);
    if (error) console.error(error);
    else window.location.reload();
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from('fruit').delete().eq('id', id);
    if (error) console.error(error);
    else window.location.reload();
  };

  // 5. 畫面切換邏輯 (修正語法與傳遞 Props)
  if (view === 'buyer') {
    return (
      <BuyerView 
        listings={listings}         
        onBack={() => setView('home')} 
        isLoaded={isLoaded} 
      />
    );
  }

  if (view === 'seller') {
    return (
      <SellerView 
        listings={listings}       
        onBack={() => setView('home')} 
        onAddListing={addListing}
        onUpdateListing={updateListing}
        onDeleteListing={deleteListing}
        isLoaded={isLoaded} 
      />
    );
  }

  return (
    <Home 
      onSelectBuyer={() => setView('buyer')}   
      onSelectSeller={() => setView('seller')}
    />
  );
}