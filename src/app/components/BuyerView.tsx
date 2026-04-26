import { useState } from 'react';
import { ArrowLeft, MapPin, List, Search, Filter } from 'lucide-react';
import type { FoodListing } from '../App';
import { FoodCard } from './FoodCard';
import { MapView } from './MapView';

type BuyerViewProps = {
  listings: FoodListing[];
  onBack: () => void;
};

export function BuyerView({ listings, onBack }: BuyerViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = ['全部', '面包糕点', '蔬菜水果', '即食餐点', '乳制品', '其他'];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl flex-1">发现优惠</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
              >
                <List className="w-6 h-6" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
              >
                <MapPin className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索食品或商家..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'list' ? (
          <div>
            <p className="text-gray-600 mb-4">找到 {filteredListings.length} 个优惠</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <FoodCard key={listing.id} listing={listing} />
              ))}
            </div>
            {filteredListings.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>没有找到符合条件的优惠</p>
              </div>
            )}
          </div>
        ) : (
          <MapView listings={filteredListings} />
        )}
      </main>
    </div>
  );
}
