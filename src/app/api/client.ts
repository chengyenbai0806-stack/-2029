// src/app/api/client.ts
import type { FoodListing } from '../App';

const projectId = 'dhocswugqgkiyunhvksu';

/**
 * ✅ 門牌校正：
 * 這裡要包含到 Function 名稱，且結尾「不要」有斜線。
 */
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-810daab7`;

const publicAnonKey = 'sb_publishable_pgfFIc_TN20PVtw9gVL7lA_dMjfbJOJ'; 

// ... 剩下的 fetchAPI 和 api 邏輯保持不變 ...
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    // 拼接結果會是：https://.../make-server-810daab7/listings
    const url = `${API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey, 
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err; 
  }
}

export const api = {
  async getListings(): Promise<FoodListing[]> {
    const data = await fetchAPI('/listings');
    return data?.listings || [];
  },
  async createListing(listing: Omit<FoodListing, 'id'>): Promise<FoodListing> {
    const data = await fetchAPI('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
    return data.listing;
  },
  async updateListing(id: string, updates: Partial<FoodListing>): Promise<FoodListing> {
    const data = await fetchAPI(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.listing;
  },
  async deleteListing(id: string): Promise<void> {
    await fetchAPI(`/listings/${id}`, {
      method: 'DELETE',
    });
  },
  async getMapsKey(): Promise<{ apiKey: string }> {
    return await fetchAPI('/maps-key');
  },
};