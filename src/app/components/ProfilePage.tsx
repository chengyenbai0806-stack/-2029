import { User, Settings, ShoppingBag, Store, History, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export function ProfilePage() {
  const menuItems = [
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      title: '我的订单',
      subtitle: '查看购买记录',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: <Store className="w-5 h-5" />,
      title: '我的商品',
      subtitle: '管理发布的优惠',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <History className="w-5 h-5" />,
      title: '浏览历史',
      subtitle: '最近查看的商品',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: '设置',
      subtitle: '偏好设置和隐私',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: '帮助中心',
      subtitle: '常见问题解答',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-green-500 to-blue-500 px-4 pt-8 pb-20">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-1">惜食用户</h2>
              <p className="text-sm opacity-90">user@example.com</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 -mt-12 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="grid grid-cols-3 divide-x">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-xs text-gray-600 mt-1">已购买</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-xs text-gray-600 mt-1">已发布</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">8</p>
                <p className="text-xs text-gray-600 mt-1">已收藏</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-600">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}

          {/* Logout Button */}
          <button className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center gap-4 mt-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-600">退出登录</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
