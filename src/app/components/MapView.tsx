import { MapPin } from 'lucide-react';
import type { FoodListing } from '../App';

type MapViewProps = {
  listings: FoodListing[];
};

export function MapView({ listings }: MapViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-[600px] bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">地图视图</p>
            <p className="text-sm text-gray-500 mt-2">显示 {listings.length} 个优惠地点</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {listings.slice(0, 3).map(listing => (
              <div key={listing.id} className="bg-white rounded-lg p-3 min-w-[250px] shadow-lg">
                <div className="flex gap-3">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{listing.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{listing.storeName}</p>
                    <p className="text-green-600 mt-1">NT${listing.discountPrice}</p>
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
