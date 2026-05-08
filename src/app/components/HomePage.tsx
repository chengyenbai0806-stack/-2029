import { ShoppingBag, Store, TrendingDown, Users, Package } from 'lucide-react';

type HomePageProps = {
  onSelectBuyer: () => void;
  onSelectSeller: () => void;
};

export function HomePage({ onSelectBuyer, onSelectSeller }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">🌱 惜食平台</h1>
          <p className="text-gray-600">减少食物浪费，共创美好未来</p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={onSelectBuyer}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">我是买家</h2>
              <p className="text-xs text-gray-600 text-center">
                寻找优惠食品
              </p>
            </div>
          </button>

          <button
            onClick={onSelectSeller}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">我是卖家</h2>
              <p className="text-xs text-gray-600 text-center">
                发布优惠商品
              </p>
            </div>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <TrendingDown className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">60%</p>
            <p className="text-xs text-gray-600">平均折扣</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">1.2K</p>
            <p className="text-xs text-gray-600">活跃用户</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Package className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">356</p>
            <p className="text-xs text-gray-600">今日优惠</p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">为什么选择惜食？</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🌍</div>
              <div>
                <p className="font-medium text-sm">环保可持续</p>
                <p className="text-xs text-gray-600">减少食物浪费，保护地球环境</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <p className="font-medium text-sm">节省开支</p>
                <p className="text-xs text-gray-600">以实惠价格购买优质食品</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🤝</div>
              <div>
                <p className="font-medium text-sm">互助共赢</p>
                <p className="text-xs text-gray-600">商家减损，消费者得利</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
