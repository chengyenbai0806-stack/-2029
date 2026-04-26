import { ShoppingBag, Store } from 'lucide-react';

type HomeProps = {
  onSelectBuyer: () => void;
  onSelectSeller: () => void;
};

export function Home({ onSelectBuyer, onSelectSeller }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl mb-4">🌱 惜食平台</h1>
        <p className="text-xl text-gray-600">减少食物浪费，共创美好未来</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button
          onClick={onSelectBuyer}
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl">我是买家</h2>
            <p className="text-gray-600 text-center">
              寻找附近的优惠食品<br />
              以实惠价格购买新鲜食材
            </p>
          </div>
        </button>

        <button
          onClick={onSelectSeller}
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Store className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl">我是卖家</h2>
            <p className="text-gray-600 text-center">
              发布即将过期的食品优惠<br />
              减少浪费，增加收益
            </p>
          </div>
        </button>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl text-center">
        <div>
          <div className="text-3xl mb-2">🌍</div>
          <p className="text-sm text-gray-600">环保可持续</p>
        </div>
        <div>
          <div className="text-3xl mb-2">💰</div>
          <p className="text-sm text-gray-600">节省开支</p>
        </div>
        <div>
          <div className="text-3xl mb-2">🤝</div>
          <p className="text-sm text-gray-600">互助共赢</p>
        </div>
      </div>
    </div>
  );
}
