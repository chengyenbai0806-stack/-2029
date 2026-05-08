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

  // Sample data for initial setup
  const sampleListings: FoodListing[] = [
    {
      id: '1',
      title: '新鲜面包',
      description: '当天制作的面包，即将过期优惠出售',
      originalPrice: 30,
      discountPrice: 10,
      quantity: 5,
      expiryDate: '2026-04-25',
      storeName: '阳光面包店',
      address: '台北市大安区信义路100号',
      lat: 25.033,
      lng: 121.565,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      category: '面包糕点'
    },
    {
      id: '2',
      title: '有机蔬菜组合',
      description: '新鲜有机蔬菜，今日特价',
      originalPrice: 150,
      discountPrice: 80,
      quantity: 3,
      expiryDate: '2026-04-24',
      storeName: '绿色超市',
      address: '台北市中山区南京东路200号',
      lat: 25.052,
      lng: 121.544,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      category: '蔬菜水果'
    },
    {
      id: '3',
      title: '便当特价',
      description: '午餐时段剩余便当，健康美味',
      originalPrice: 120,
      discountPrice: 60,
      quantity: 8,
      expiryDate: '2026-04-24',
      storeName: '美味便当',
      address: '台北市松山区八德路300号',
      lat: 25.048,
      lng: 121.576,
      image: 'https://images.unsplash.com/photo-1576328077645-2dd68934d2b7?w=400',
      category: '即食餐点'
    },
    {
      id: '4',
      title: '北欧风书架',
      description: '展示样品书架，九成新，清仓优惠',
      originalPrice: 3500,
      discountPrice: 1200,
      quantity: 2,
      expiryDate: '2026-05-30',
      storeName: '居家生活馆',
      address: '台北市内湖区民权东路500号',
      lat: 25.068,
      lng: 121.567,
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
      category: '家具'
    }
  ];

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);

      // --- 優化點 1：防止 API 永久卡死，設定 3 秒逾時 ---
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );

      const fetchPromise = api.getListings();
      
      // 誰快聽誰的，如果 API 超過 3 秒沒回應，直接進 catch
      const data = await Promise.race([fetchPromise, timeout]) as FoodListing[];

      if (!data || data.length === 0) {
        console.log('資料庫為空，顯示範例數據並同步...');
        setListings(sampleListings);
        
        // --- 優化點 2：背景同步不使用 await，避免阻礙 loading 狀態關閉 ---
        sampleListings.forEach(l => {
          api.createListing(l).catch(e => console.error("背景初始化失敗:", e));
        });
      } else {
        setListings(data);
      }
    } catch (err) {
      console.error('資料載入發生問題，改用本地數據:', err);
      setListings(sampleListings);
    } finally {
      // --- 優化點 3：確保最後一定會關閉加載畫面 ---
      setLoading(false);
    }
  };

  const addListing = async (listing: Omit<FoodListing, 'id'>) => {
    try {
      const newListing = await api.createListing(listing);
      setListings([newListing, ...listings]);
    } catch (err) {
      console.error('Error creating listing:', err);
      alert('创建商品失败，请稍后重試');
    }
  };

  const updateListing = async (id: string, updates: Partial<FoodListing>) => {
    try {
      await api.updateListing(id, updates);
      setListings(listings.map(listing =>
        listing.id === id ? { ...listing, ...updates } : listing
      ));
    } catch (err) {
      console.error('Error updating listing:', err);
      alert('更新商品失败，请稍后重試');
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await api.deleteListing(id);
      setListings(listings.filter(listing => listing.id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('删除商品失败，请稍后重試');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

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
    <>
      {currentTab === 'home' && (
        <HomePage
          onSelectBuyer={() => setView('buyer')}
          onSelectSeller={() => setView('seller')}
        />
      )}
      {currentTab === 'services' && <ServicesPage />}
      {currentTab === 'profile' && <ProfilePage />}

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </>
  );
}