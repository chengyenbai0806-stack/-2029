"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { FoodListing } from '../App';
import { supabase } from '../../supabase'; 
import { toast } from 'sonner';

type AddListingFormProps = {
  onSubmit: (listing: any) => void;
  onCancel: () => void;
  initialData?: FoodListing;
};

export function AddListingForm({ onSubmit, onCancel, initialData }: AddListingFormProps) {
  const [loading, setLoading] = useState(false);
  
  // 🎯 修正：狀態變數名稱改為與 FoodListing 型別一致
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    original_price: initialData?.original_price || 0,
    discounted_price: initialData?.discounted_price || 0,
    stock: initialData?.stock || 1,
    store_name: initialData?.store_name || '',
    category: initialData?.category || '其他'
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 【核心修正】這裡必須組裝完整的資料庫物件
  const lockerData = {
    title: formData.title,
    original_price: Number(formData.original_price),
    discounted_price: Number(formData.discounted_price),
    stock: Number(formData.stock),
    store_name: formData.store_name,
    category: formData.category,
    locker_no: "A-01", 
    status: "PENDING",
    is_ordered: false,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase.from('food_lockers').insert([lockerData]).select();
    if (error) throw error;

    toast.success("🚀 商品已發布！");
    
    // 【關鍵修正】這裡改為傳送後端回傳的完整資料，而非原本的表單資料
    onSubmit(data[0]); 
    
  } catch (error: any) {
    console.error("發布失敗:", error);
    toast.error(`資料庫寫入失敗: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* 略過 Header 部分，保持不變 */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <input type="text" placeholder="商品名稱" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded" />
          <input type="number" placeholder="原價" required value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })} className="w-full p-2 border rounded" />
          <input type="number" placeholder="折價後價格" required value={formData.discounted_price} onChange={(e) => setFormData({ ...formData, discounted_price: Number(e.target.value) })} className="w-full p-2 border rounded" />
          <input type="number" placeholder="庫存" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full p-2 border rounded" />
          <input type="text" placeholder="商店名稱" required value={formData.store_name} onChange={(e) => setFormData({ ...formData, store_name: e.target.value })} className="w-full p-2 border rounded" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-500 text-white rounded font-bold">
            {loading ? '發布中...' : '发布优惠'}
          </button>
        </form>
      </main>
    </div>
  );
}