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
      description: '兩千年前制作的面包，即將過期優惠出售',
      originalPrice: 30,
      discountPrice: 10,
      quantity: 5,
      expiryDate: '2026-04-25',
      storeName: '陰濕面包店',
      address: '林北市大安區信義路1000',
      lat: 25.033,
      lng: 121.565,
      image: 'https://i.ytimg.com/vi/DSCuXyduXXA/hqdefault.jpg',
      category: '烘焙'
    },
    {
      id: '2',
      title: '有機蔬菜组合',
      description: '有機蔬菜，今日特價',
      originalPrice: 150,
      discountPrice: 80,
      quantity: 3,
      expiryDate: '2026-04-26',
      storeName: '绿色超市',
      address: '台轎市中山区南京东路200号',
      lat: 25.052,
      lng: 121.544,
      image: 'https://cdn2.ettoday.net/images/8216/d8216578.jpg',
       category: '蔬菜'
    },
    
    {
      id: '3',
      title: '遊戲',
      description: '全新遊戲，因店面搬遷急售',
      originalPrice: 120,
      discountPrice: 60,
      quantity: 8,
      expiryDate: '2026-04-26',
      storeName: '遊戲特賣',
      address: '台東市清水斷崖附近',
      lat: 25.048,
      lng:  121.576,
      image: 'https://upload-os-bbs.hoyolab.com/upload/2025/06/30/248389732/92d9f84247386d7a108f9de33c888762_578276970928279755.gif',
       category: '遊戲'
       },
        {
      id: '4',
      title: '家具特賣',
      description: '全新家具，因店面搬遷急售',
      originalPrice: 120,
      discountPrice: 60,
      quantity: 8,
      expiryDate: '2026-04-26',
      storeName: '家具特賣',
      address: '台南市赤崁樓附近',
      lat: 25.048,
      lng: 121.576,
      image: 'data:image/jpeg;base64,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',
       category: '家具'
       },
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
