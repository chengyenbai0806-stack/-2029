import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';
import type { FoodListing } from '../App';

type GoogleMapViewProps = {
  listings: FoodListing[];
};

const projectId = 'dhocswugqgkiyunhvksu';
// 這裡已經換上你在截圖中看到的正確 Key
const publicAnonKey = 'sb_publishable_pgfFIc_TN20PVtw9gVL7lA_dMjfbJOJ';

export function GoogleMapView({ listings }: GoogleMapViewProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      setLoading(true);
      // 修正後的網址路徑
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-810daab7/maps-key`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey, // 這是解決 CORS 的關鍵標頭
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`伺服器錯誤 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("成功抓取地圖金鑰資料:", data);

      const key = data.apiKey || data.key;
      if (!key) {
        throw new Error('回傳的資料中找不到 API Key');
      }

      setApiKey(key);
    } catch (err) {
      console.error('詳細錯誤報告:', err);
      const errorMessage = err instanceof Error ? err.message : '發生未知錯誤';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
        <p className="text-gray-600">載入地圖中...</p>
      </div>
    );
  }

  if (error || !apiKey) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="bg-red-50 p-4 rounded-lg inline-block mb-4">
            <MapPin className="w-12 h-12 mx-auto text-red-400" />
        </div>
        <p className="text-red-600 font-medium">{error || '地圖載入失敗'}</p>
        <button 
          onClick={fetchApiKey}
          className="mt-4 text-sm text-blue-500 underline"
        >
          重新嘗試連線
        </button>
      </div>
    );
  }

  const center = listings.length > 0
    ? {
        lat: listings.reduce((sum, l) => sum + l.lat, 0) / listings.length,
        lng: listings.reduce((sum, l) => sum + l.lng, 0) / listings.length,
      }
    : { lat: 25.033, lng: 121.565 };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <APIProvider apiKey={apiKey}>
        <div className="h-[600px]">
          <Map
            defaultCenter={center}
            defaultZoom={12}
            mapId="惜食地圖"
            gestureHandling="greedy"
          >
            {listings.map((listing) => (
              <AdvancedMarker
                key={listing.id}
                position={{ lat: listing.lat, lng: listing.lng }}
                onClick={() => setSelectedListing(listing)}
              >
                <Pin
                  background="#22c55e"
                  borderColor="#16a34a"
                  glyphColor="#fff"
                />
              </AdvancedMarker>
            ))}

            {selectedListing && (
              <InfoWindow
                position={{ lat: selectedListing.lat, lng: selectedListing.lng }}
                onCloseClick={() => setSelectedListing(null)}
              >
                <div className="p-2 max-w-xs">
                  <img
                    src={selectedListing.image}
                    alt={selectedListing.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-lg mb-1">{selectedListing.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedListing.storeName}</p>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {selectedListing.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through text-sm">
                        NT${selectedListing.originalPrice}
                      </span>
                      <span className="text-green-600 font-semibold ml-2">
                        NT${selectedListing.discountPrice}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      剩餘 {selectedListing.quantity} 份
                    </span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>

      <div className="p-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-600 text-center">
          📍 顯示 {listings.length} 個優惠地點 - 點擊標記查看詳情
        </p>
      </div>
    </div>
  );
}