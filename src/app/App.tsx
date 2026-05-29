import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ServicesPage } from './components/ServicesPage';
import { ProfilePage } from './components/ProfilePage';
import { BuyerView } from './components/BuyerView';
import { SellerView } from './components/SellerView';
import { BottomNav } from './components/BottomNav';
import { supabase } from '../supabase';
import { toast } from 'sonner';

export type FoodListing = {
  id: string;
  created_at?: string;
  title: string;
  description: string;       // 新增
  original_price: number;    // 使用底線命名
  discounted_price: number;  // 使用底線命名
  stock: number;             // 使用底線命名 (替換 quantity)
  expiryDate: string;        // 新增
  store_name: string;        // 使用底線命名 (替換 storeName)
  image: string;             // 新增
  category: string;
  locker_no?: string;
  status?: string;
  is_ordered?: boolean;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'services' | 'profile'>('home');
  const [view, setView] = useState<'main' | 'buyer' | 'seller'>('main');
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_lockers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (err) {
      console.error('資料庫讀取失敗:', err);
      toast.error('無法連線至雲端資料庫');
    } finally {
      setLoading(false);
    }
  };

  const addListing = async (listing: Omit<FoodListing, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('food_lockers')
        .insert([listing])
        .select();

      if (error) throw error;
      
      setListings(prev => [data[0], ...prev]);
      toast.success('商品已成功發布！');
    } catch (err) {
      console.error('發布失敗:', err);
      toast.error('發布失敗，請確認資料庫設定');
    }
  };

  const updateListing = async (id: string, updates: Partial<FoodListing>) => {
    try {
      const { error } = await supabase
        .from('food_lockers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    } catch (err) {
      console.error('更新失敗:', err);
      toast.error('更新失敗');
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('food_lockers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setListings(prev => prev.filter(l => l.id !== id));
      toast.success('刪除成功');
    } catch (err) {
      console.error('刪除失敗:', err);
      toast.error('刪除失敗');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (view === 'buyer') {
    return <BuyerView listings={listings} onBack={() => setView('main')} onRefresh={loadListings} />;
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
      {currentTab === 'home' && <HomePage onSelectBuyer={() => setView('buyer')} onSelectSeller={() => setView('seller')} />}
      {currentTab === 'services' && <ServicesPage />}
      {currentTab === 'profile' && <ProfilePage />}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}