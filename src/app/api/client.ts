// 1. 引用型別
import type { FoodListing } from '../App';

// 2. 定義變數
const projectId = 'dhocswugqgkiyunhvksu';
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-810daab7`;

/**
 * 【重要】請去 Supabase Dashboard > Project Settings > API
 * 找到 "anon public" 這一串以 eyJ 開頭的長字串，貼在下面。
 * 如果這串沒改，API 就會報 CORS 錯誤。
 */
const publicAnonKey = 'sb_publishable_pgfFIc_TN20PVtw9gVL7lA_dMjfbJOJ'; 

type Appointment = {
  id?: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  quantity: number;
  totalPrice: number;
  createdAt?: string;
};

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey, // Supabase 安全層必備
        'x-client-info': 'supabase-js/v2', // 增加連線成功率
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err; 
  }
}

export const api = {
  // 獲取商品列表
  async getListings(): Promise<FoodListing[]> {
    const data = await fetchAPI('/listings');
    return data?.listings || [];
  },

  // 建立商品
  async createListing(listing: Omit<FoodListing, 'id'>): Promise<FoodListing> {
    const data = await fetchAPI('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
    return data.listing;
  },

  // 更新商品
  async updateListing(id: string, updates: Partial<FoodListing>): Promise<FoodListing> {
    const data = await fetchAPI(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.listing;
  },

  // 刪除商品
  async deleteListing(id: string): Promise<void> {
    await fetchAPI(`/listings/${id}`, {
      method: 'DELETE',
    });
  },

  // 【關鍵新增】向後端索取 Google Maps API Key
  async getMapsKey(): Promise<{ apiKey: string }> {
    return await fetchAPI('/maps-key');
  },

  // 建立預約
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const data = await fetchAPI('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
    return data.appointment;
  },

  // 獲取所有預約
  async getAppointments(): Promise<Appointment[]> {
    const data = await fetchAPI('/appointments');
    return data?.appointments || [];
  },
};

export type { Appointment };