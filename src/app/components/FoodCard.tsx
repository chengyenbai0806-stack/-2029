import { useState } from 'react';
import { MapPin, Calendar, Package, X } from 'lucide-react';
import type { FoodListing } from '../App';
import { api } from '../api/client';

type FoodCardProps = {
  listing: FoodListing;
};

export function FoodCard({ listing }: FoodCardProps) {
  const discount = Math.round((1 - listing.discountPrice / listing.originalPrice) * 100);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    quantity: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.createAppointment({
        listingId: listing.id,
        listingTitle: listing.title,
        buyerName: formData.buyerName,
        buyerPhone: formData.buyerPhone,
        buyerEmail: formData.buyerEmail,
        quantity: formData.quantity,
        totalPrice: listing.discountPrice * formData.quantity,
      });

      alert('预约成功！商家会尽快联系您。');
      setShowModal(false);
      setFormData({ buyerName: '', buyerPhone: '', buyerEmail: '', quantity: 1 });
    } catch (error) {
      console.error('Appointment creation failed:', error);
      alert('预约失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">预约购买</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{listing.storeName}</p>
              <p className="font-medium">{listing.title}</p>
              <p className="text-green-600 mt-1">NT${listing.discountPrice} / 份</p>
            </div>

            <form onSubmit={handlePurchase} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">姓名</label>
                <input
                  type="text"
                  required
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">电话</label>
                <input
                  type="tel"
                  required
                  value={formData.buyerPhone}
                  onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">邮箱</label>
                <input
                  type="email"
                  required
                  value={formData.buyerEmail}
                  onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">数量</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={listing.quantity}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between text-lg mb-4">
                  <span>总计：</span>
                  <span className="text-green-600 font-semibold">
                    NT${listing.discountPrice * formData.quantity}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? '提交中...' : '确认预约'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
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
            <span className="text-2xl text-green-600 ml-2">NT${listing.discountPrice}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            购买
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
