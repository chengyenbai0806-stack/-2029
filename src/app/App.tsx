import { useState } from 'react';
import { Home } from './components/Home';
import { BuyerView } from './components/BuyerView';
import { SellerView } from './components/SellerView';

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
  const [listings, setListings] = useState<FoodListing[]>([
    {
      id: '1',
      title: '新鲜面包',
      description: '兩千年前制作的面包，即将过期优惠出售',
      originalPrice: 30,
      discountPrice: 10,
      quantity: 5,
      expiryDate: '2026-04-25',
      storeName: '陰濕面包店',
      address: '林北市大安区信义路1000',
      lat: 25.033,
      lng: 121.565,
      image: 'https://i.ytimg.com/vi/DSCuXyduXXA/hqdefault.jpg',
      category: '烘焙'
    },
    {
      id: '2',
      title: '機机蔬菜组合',
      description: '新冠有机蔬菜，今日特价',
      originalPrice: 150,
      discountPrice: 80,
      quantity: 3,
      expiryDate: '2026-04-24',
      storeName: '绿色超市',
      address: '台轎市中山区南京东路200号',
      lat: 25.052,
      lng: 121.544,
      image: 'https://cdn2.ettoday.net/images/8216/d8216578.jpg',
       category: '蔬菜'
    },
    {
      id: '3',
      title: '便当漲价',
      description: '午餐时段剩余便当，健康美味',
      originalPrice: 120,
      discountPrice: 60,
      quantity: 8,
      expiryDate: '2026-04-24',
      storeName: '美味便当',
      address: '台北市松山区八德路300号',
      lat: 25.048,
      lng: 121.576,
      image: 'data:image/jpeg;base64,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',
       category: '白厄'
    }
  ]);

  const addListing = (listing: Omit<FoodListing, 'id'>) => {
    const newListing: FoodListing = {
      ...listing,
      id: Date.now().toString()
    };
    setListings([newListing, ...listings]);
  };

  const updateListing = (id: string, updates: Partial<FoodListing>) => {
    setListings(listings.map(listing =>
      listing.id === id ? { ...listing, ...updates } : listing
    ));
  };

  const deleteListing = (id: string) => {
    setListings(listings.filter(listing => listing.id !== id));
  };

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
