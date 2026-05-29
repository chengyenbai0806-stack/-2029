"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { FoodListing } from '../App';
import { supabase } from '../../supabase';
import { toast } from 'sonner';

export function BuyerView({ listings, onBack, onRefresh }: { 
  listings: FoodListing[], onBack: () => void, onRefresh: () => void 
}) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (item: FoodListing) => {
    setLoading(item.id);
    try {
      const newStock = Math.max(0, item.stock - 1);
      
      const { error } = await supabase
        .from('food_lockers')
        .update({ is_ordered: true, stock: newStock })
        .eq('id', item.id);

      if (error) throw error;

      toast.success("🛒 購買成功！");
      onRefresh(); // 更新清單
      onBack();    // 🎯 直接返回選購畫面
    } catch (err) {
      toast.error("連線錯誤");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="mb-4 flex items-center"><ArrowLeft /> 返回選購</button>
      <div className="grid gap-4">
        {listings.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow">
            <h3>{item.title}</h3>
            <button onClick={() => handleBuy(item)} className="bg-green-500 text-white w-full py-2 rounded">
              {loading === item.id ? "處理中..." : "下單 (庫存-1)"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}