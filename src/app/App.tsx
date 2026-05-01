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
  category: d.分類 || '未分類',       
  image: d.圖片網址 || 'https://via.placeholder.com/150', 
  expiryDate: d.到期日 || '無限期',  
  
  originalPrice: d.原價 || 0,
  discountPrice: d.折扣後 || 0,
  quantity: d.庫存 || 0,
  storeName: d.商家名稱 || '未知商家',
  address: d.地址 || '',
  lat: parseFloat(d.lat) || 23.700,
  lng: parseFloat(d.lng) || 120.430
}));
setListings(mappedData);
       
      }
    };
    fetchRealData();
  }, []); // 👈 確保 useEffect 在這裡就結束了！

  // --- 步驟 3: 把這些功能寫在 useEffect 外面 (解決 Scope 問題) ---
  const addListing = async (newListing: Omit<FoodListing, 'id'>) => {
  // 強制轉換型別，確保傳給 Supabase 的是數字而非字串
  const { error } = await supabase.from('fruit').insert([{
    名稱: newListing.title,
    描述: newListing.description,
    // 使用 Number() 確保型別正確，避免 bigint 或 float 報錯
    原價: Number(newListing.originalPrice) || 0, 
    折扣後: Number(newListing.discountPrice) || 0,
    數量: Number(newListing.quantity) || 1,
    到期日: newListing.expiryDate,
    商家名稱: newListing.storeName,
    地址: newListing.address,
    // 經緯度一定要是數字，否則地圖會壞掉
    lat: Number(newListing.lat) || 23.700,
    lng: Number(newListing.lng) || 120.430,
    圖片網址: newListing.image,
    分類: newListing.category
  }]);

  if (error) {
    console.error("新增失敗，請檢查 Supabase 欄位名稱是否正確:", error.message);
    alert("新增失敗：" + error.message);
  } else {
    console.log("新增成功！");
    window.location.reload();
  }
};

  const updateListing = async (id: string, updates: Partial<FoodListing>) => {
   
  console.log("1. 進入函式，ID 為:", id);
  
  // 檢查資料型別是否正確
  const payload = {
    名稱: updates.title,
    描述: updates.description,
    分類: updates.category,
    圖片網址: updates.image,
    到期日: updates.expiryDate,
    原價: Number(updates.originalPrice),
    折扣後: Number(updates.discountPrice),
    庫存: Number(updates.quantity), // 確保這兩個字是「庫存」
    地址: updates.address
  };
  
  console.log("2. 準備送出的資料 (Payload):", payload);

  const { data, error, status } = await supabase
    .from('fruit')
    .update(payload)
    .eq('id', Number(id))
    .select();

  if (error) {
    // 💡 如果這行跑出來，會直接告訴你是欄位錯、權限錯、還是型別錯
    console.error("3. ❌ Supabase 報錯了！狀態碼:", status);
    console.error("錯誤訊息:", error.message);
    alert("更新失敗: " + error.message);
  } else if (data && data.length === 0) {
    // 💡 如果沒報錯但 data 是空的，代表沒找到這筆 ID
    console.warn("3. ⚠️ 沒報錯，但沒有任何資料被更新。請檢查 ID 是否正確。");
    alert("找不到該筆資料，無法更新。");
  } else {
    console.log("3. ✅ 更新成功！回傳資料:", data);
    alert("修改成功！");
    window.location.reload(); 
  }
};
const deleteListing = async (id: string) => {
  // 確認是否要刪除
  if (!window.confirm("確定要刪除這筆資料嗎？")) return;

  const { error } = await supabase
    .from('fruit')
    .delete()
    .eq('id', Number(id))

  if (error) {
    console.error("刪除失敗：", error.message);
    alert("刪除失敗：" + error.message);
  } else {
    alert("刪除成功！");
    // 重新整理畫面
    window.location.reload();
  }
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