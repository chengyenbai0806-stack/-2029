import { MapPin } from 'lucide-react';
import type { FoodListing } from '../App';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api'; // <--- 1. 引入地圖元件
import { useState } from 'react';

type MapViewProps = {
  listings: FoodListing[];
  isLoaded: boolean;
};

// 地圖容器樣式
const containerStyle = {
  width: '100%',
  height: '600px'
};

// 預設中心點 (以虎科大附近為例)
const defaultCenter = {
  lat: 23.700,
  lng: 120.430
};

export function MapView({ listings, isLoaded }: MapViewProps) {
  const [selected, setSelected] = useState<FoodListing | null>(null);

  // 如果地圖還沒載入完成，顯示載入中畫面
  if (!isLoaded) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-gray-500">Google 地圖載入中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-[600px]">
        {/* 2. 放置真正的 Google Map 元件 */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={listings.length > 0 ? { lat: listings[0].lat, lng: listings[0].lng } : defaultCenter}
          zoom={14}
        >
          {/* 3. 根據資料產生標記點 */}
          {listings.map((listing) => (
            <MarkerF
              key={listing.id}
              position={{ lat: listing.lat, lng: listing.lng }}
              onClick={() => setSelected(listing)}
            />
          ))}

          {/* 當點擊標記時顯示資訊視窗 */}
          {selected && (
            <InfoWindowF
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="p-2">
                <h4 className="font-bold">{selected.title}</h4>
                <p className="text-sm">{selected.storeName}</p>
                <p className="text-green-600">NT$ {selected.discountPrice}</p>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>

        {/* 下方的滑動卡片清單 (保留你原本的 UI) */}
        <div className="absolute bottom-4 left-0 right-0 p-4 pointer-events-none">
          <div className="flex gap-2 overflow-x-auto pb-2 pointer-events-auto">
            {listings.map(listing => (
              <div 
                key={listing.id} 
                className="bg-white rounded-lg p-3 min-w-[250px] shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelected(listing)}
              >
                <div className="flex gap-3">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{listing.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{listing.storeName}</p>
                    <p className="text-green-600 mt-1 font-bold">NT${listing.discountPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}