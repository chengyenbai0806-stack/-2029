import { Home, Grid, User } from 'lucide-react';

type BottomNavProps = {
  currentTab: 'home' | 'services' | 'profile';
  onTabChange: (tab: 'home' | 'services' | 'profile') => void;
};

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            currentTab === 'home'
              ? 'text-green-600'
              : 'text-gray-500'
          }`}
        >
          <Home className={`w-6 h-6 ${currentTab === 'home' ? 'fill-green-600' : ''}`} />
          <span className="text-xs">首页</span>
        </button>

        <button
          onClick={() => onTabChange('services')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            currentTab === 'services'
              ? 'text-green-600'
              : 'text-gray-500'
          }`}
        >
          <Grid className={`w-6 h-6 ${currentTab === 'services' ? 'fill-green-600' : ''}`} />
          <span className="text-xs">服务</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            currentTab === 'profile'
              ? 'text-green-600'
              : 'text-gray-500'
          }`}
        >
          <User className={`w-6 h-6 ${currentTab === 'profile' ? 'fill-green-600' : ''}`} />
          <span className="text-xs">个人资讯</span>
        </button>
      </div>
    </div>
  );
}
