import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import type { FoodListing } from '../App';
import { AddListingForm } from './AddListingForm';

type SellerViewProps = {
  listings: FoodListing[];
  onBack: () => void;
  onAddListing: (listing: Omit<FoodListing, 'id'>) => void;
  onUpdateListing: (id: string, updates: Partial<FoodListing>) => void;
  onDeleteListing: (id: string) => void;
};

export function SellerView({ listings, onBack, onAddListing, onUpdateListing, onDeleteListing }: SellerViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<FoodListing | null>(null);

  const handleSubmit = (listing: Omit<FoodListing, 'id'>) => {
    if (editingListing) {
      onUpdateListing(editingListing.id, listing);
      setEditingListing(null);
    } else {
      onAddListing(listing);
    }
    setShowForm(false);
  };

  const handleEdit = (listing: FoodListing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingListing(null);
  };

  if (showForm) {
    return (
      <AddListingForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={editingListing || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl">我的优惠</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              发布优惠
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl text-gray-600 mb-2">还没有发布任何优惠</h2>
            <p className="text-gray-500 mb-6">开始发布你的第一个优惠吧！</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              立即发布
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl mb-1">{listing.title}</h3>
                        <p className="text-gray-600 text-sm">{listing.store_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('确定要删除这个优惠吗？')) {
                              onDeleteListing(listing.id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{listing.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">原价：</span>
                        <span className="line-through text-gray-400">NT${listing.original_price}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">特价：</span>
                        <span className="text-green-600 font-semibold">NT${listing.discounted_price}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">库存：</span>
                        <span>{listing.stock} 份</span>
                      </div>
                      <div>
                        <span className="text-gray-500">有效期至：</span>
                        <span>{listing.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}