import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ServicesPage } from './components/ServicesPage';
import { ProfilePage } from './components/ProfilePage';
import { BuyerView } from './components/BuyerView';
import { SellerView } from './components/SellerView';
import { BottomNav } from './components/BottomNav';
import { api } from './api/client';

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
  const [currentTab, setCurrentTab] = useState<'home' | 'services' | 'profile'>('home');
  const [view, setView] = useState<'main' | 'buyer' | 'seller'>('main');
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化時只從雲端抓取資料
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);

      // 設定 5 秒逾時，避免無限轉圈
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('連線逾時，請檢查 Supabase Edge Functions 是否正常')), 5000)
      );

      // 直接呼叫 api.getListings()，這會去敲你的 Supabase 網址
      const fetchPromise = api.getListings();
      const data = await Promise.race([fetchPromise, timeout]) as FoodListing[];

      // 同步到畫面上
      setListings(data || []);
    } catch (err) {
      console.error('雲端資料加載失敗:', err);
      // 這裡不再切換到 sampleListings，而是顯示錯誤
      setError(err instanceof Error ? err.message : '連線失敗');
    } finally {
      setLoading(false);
    }
  };

  const addListing = async (listing: Omit<FoodListing, 'id'>) => {
    try {
      // 1. 發送到後端，這會觸發你 index.ts 裡的 app.post("/listings")
      const newListing = await api.createListing(listing);
      
      // 2. 後端成功存入 KV 後，前端才同步更新列表
      setListings(prev => [newListing, ...prev]);
      alert('商品已成功同步至雲端發布！');
    } catch (err) {
      console.error('發布失敗:', err);
      alert('發布失敗，請確認網路連線與 API Key 設定');
    }
  };

  const updateListing = async (id: string, updates: Partial<FoodListing>) => {
    try {
      await api.updateListing(id, updates);
      setListings(prev => prev.map(listing =>
        listing.id === id ? { ...listing, ...updates } : listing
      ));
    } catch (err) {
      console.error('更新失敗:', err);
      alert('雲端更新失敗');
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await api.deleteListing(id);
      setListings(prev => prev.filter(listing => listing.id !== id));
    } catch (err) {
      console.error('刪除失敗:', err);
      alert('無法從雲端刪除此商品');
    }
  };

  // 載入中畫面
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">連線至雲端資料庫...</p>
        </div>
      </div>
    );
  }

  // 錯誤處理畫面
  if (error && listings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">無法載入雲端資料</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={loadListings}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            重新連線
          </button>
        </div>
      </div>
    );
  }

  // 視圖切換
  if (view === 'buyer') {
    return <BuyerView listings={listings} onBack={() => setView('main')} />;
  }

  if (view === 'seller') {
    return (
      <SellerView
        listings={listings}
        onBack={() => setView('main')}
        onAddListing={addListing}
        onUpdateListing={updateListing}
        onDeleteListing={deleteListing}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {currentTab === 'home' && (
        <HomePage
          onSelectBuyer={() => setView('buyer')}
          onSelectSeller={() => setView('seller')}
        />
      )}
      {currentTab === 'services' && <ServicesPage />}
      {currentTab === 'profile' && <ProfilePage />}

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}