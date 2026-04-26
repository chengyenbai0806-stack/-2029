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
      image: 'https://upload-os-bbs.hoyolab.com/upload/2025/06/30/248389732/92d9f84247386d7a108f9de33c888762_578276970928279755.gif',
       category: '蔬菜'
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
