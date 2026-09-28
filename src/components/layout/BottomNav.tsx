import React from 'react';
import { Home, Sparkles, Layers, Bookmark, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPath, navigate }) => {
  const { savedOutfits } = useAuth();

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Analyze', path: '/analyze', icon: Sparkles, highlight: true },
    { label: 'Style', path: '/style', icon: Layers },
    { label: 'Saved', path: '/saved', icon: Bookmark, badge: savedOutfits.length > 0 },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center -mt-4 cursor-pointer focus:outline-hidden"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? 'bg-rose-600 text-white'
                      : 'bg-neutral-900 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-neutral-800 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors cursor-pointer relative ${
                isActive ? 'text-rose-600' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#FAF9F6]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 ${
                  isActive ? 'font-semibold text-rose-600' : 'font-normal text-neutral-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
