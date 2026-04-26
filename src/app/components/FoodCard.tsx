import { MapPin, Calendar, Package } from 'lucide-react';
import type { FoodListing } from '../App';

type FoodCardProps = {
  listing: FoodListing;
};

export function FoodCard({ listing }: FoodCardProps) {
  const discount = Math.round((1 - listing.discountPrice / listing.originalPrice) * 100);

  return (
    <div className="bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          -{discount}%
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg mb-1">{listing.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{listing.storeName}</p>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{listing.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{listing.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>有效期至 {listing.expiryDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>剩余 {listing.quantity} 份</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-gray-400 line-through text-sm">NT${listing.originalPrice}</span>
            <span className="text-2xl text-red-600 ml-2">NT${listing.discountPrice}</span>
          </div>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
            购买
          </button>
        </div>
      </div>
    </div>
  );
}
