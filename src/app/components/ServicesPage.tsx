import { MapPin, Bell, Heart, Clock, MessageCircle, Shield } from 'lucide-react';

export function ServicesPage() {
  const services = [
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: '附近优惠',
      description: '查找你周边的惜食优惠',
      color: 'bg-green-100'
    },
    {
      icon: <Bell className="w-8 h-8 text-blue-600" />,
      title: '优惠提醒',
      description: '订阅你喜欢的商品通知',
      color: 'bg-blue-100'
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: '我的收藏',
      description: '保存感兴趣的商品',
      color: 'bg-red-100'
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: '预约记录',
      description: '查看你的购买历史',
      color: 'bg-orange-100'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: '客服中心',
      description: '联系我们获取帮助',
      color: 'bg-purple-100'
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: '安全保障',
      description: '了解我们的安全政策',
      color: 'bg-indigo-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl mb-1">服务中心</h1>
          <p className="text-gray-600 text-sm">探索更多惜食平台功能</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all active:scale-95 text-left"
            >
              <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-3`}>
                {service.icon}
              </div>
              <h3 className="font-semibold mb-1">{service.title}</h3>
              <p className="text-xs text-gray-600">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">📊 本月成果</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold">2.3吨</p>
              <p className="text-sm opacity-90">减少食物浪费</p>
            </div>
            <div>
              <p className="text-3xl font-bold">18K</p>
              <p className="text-sm opacity-90">成功交易</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
