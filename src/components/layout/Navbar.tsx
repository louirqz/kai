import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Bookmark,
  ChevronDown,
  Palette,
  Scissors,
  Shirt,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, openSearch }) => {
  const { currentUser, isAdmin, isAdminUnlocked, logout, switchDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'หน้าแรก', path: '/home' },
    { label: 'วิเคราะห์สไตล์', path: '/analyze' },
    { label: 'เมคอัพ', path: '/makeup', icon: Palette },
    { label: 'ทรงผม', path: '/hairstyle', icon: Scissors },
    { label: 'ชุดเสื้อผ้า', path: '/outfits', icon: Shirt },
    { label: 'ตามโอกาส', path: '/occasion', icon: Calendar },
    { label: 'เทศกาล', path: '/festival', icon: Sparkles },
    { label: 'สไตล์', path: '/style', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#FAF9F6] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 via-rose-950 to-neutral-800 bg-clip-text text-transparent">
                  StyleMatch
                </span>
                <span className="text-xs font-semibold text-rose-500 ml-1">AI</span>
                <p className="text-[10px] text-neutral-600 hidden sm:block -mt-1 font-normal">
                  ค้นหาสไตล์ที่ใช่ด้วย AI
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer relative ${
                    isActive
                      ? 'text-rose-600 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-rose-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="ค้นหาไอเทม สไตล์ สี และโอกาส"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => navigate('/analyze')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>เริ่มวิเคราะห์สไตล์</span>
            </button>

            {/* Saved Outfits Quick Link */}
            <button
              onClick={() => navigate('/saved')}
              className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                currentPath === '/saved'
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title="ชุดที่บันทึกไว้"
            >
              <Bookmark className="w-5 h-5" />
              {currentUser?.savedOutfits && currentUser.savedOutfits.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-neutral-200/80 hover:bg-neutral-100/60 transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-[11px] font-bold text-white shadow-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-neutral-700 max-w-[80px] truncate hidden md:inline-block">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {isAdmin && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-medium">
                        Admin
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs font-semibold text-neutral-900 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-neutral-600 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] text-neutral-600">
                          สิทธิ์: {currentUser.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'สมาชิกทั่วไป'}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => navigate('/profile')}
                          className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-neutral-600" />
                          โปรไฟล์สไตล์ของฉัน (My Style Profile)
                        </button>
                        <button
                          onClick={() => navigate('/saved')}
                          className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Bookmark className="w-4 h-4 text-neutral-600" />
                          ชุดที่บันทึกไว้ ({currentUser.savedOutfits?.length || 0})
                        </button>

                        <button
                          onClick={() => navigate('/admin')}
                          className="w-full text-left px-4 py-2 text-xs text-amber-900 hover:bg-amber-50 flex items-center justify-between font-semibold cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span>ระบบหลังบ้าน (Admin Gate)</span>
                          </div>
                          {isAdminUnlocked ? (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                              ปลดล็อคแล้ว
                            </span>
                          ) : (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                              ใส่รหัสผ่าน
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="border-t border-neutral-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          ออกจากระบบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-xs font-semibold text-neutral-800 hover:text-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 shadow-xs cursor-pointer"
                  >
                    เข้าสู่ระบบ / ลงทะเบียน
                  </button>
                  <button
                    onClick={() => navigate('/admin')}
                    className="hidden sm:inline-flex text-[11px] text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl font-bold cursor-pointer hover:bg-amber-200 transition-colors items-center gap-1 shadow-xs"
                    title="เข้าสู่ระบบหลังบ้านด้วยรหัสผ่านแอดมิน"
                  >
                    <Shield className="w-3 h-3 text-amber-700" />
                    <span>หลังบ้าน (Admin)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 bg-[#FAF9F6] px-4 pt-2 pb-6 space-y-2 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-200">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium text-left cursor-pointer ${
                  currentPath === link.path
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 text-neutral-600" />}
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                navigate('/generate-look');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 rounded-xl cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              ✨ Generate My Look
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-xs font-bold text-neutral-800 bg-white border border-neutral-200 rounded-xl cursor-pointer text-center hover:bg-neutral-50 shadow-xs"
              >
                เข้าสู่ระบบ / บัญชี
              </button>
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 rounded-xl cursor-pointer text-center hover:bg-amber-200 shadow-xs flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>หลังบ้าน (Admin)</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 text-neutral-600 border-t border-neutral-200">
              <span className="text-[11px]">ทดลอง 1 คลิก:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    switchDemoUser('user');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 bg-white border border-neutral-200 rounded text-neutral-700 text-[11px]"
                >
                  Sarah (User)
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 bg-amber-100 border border-amber-300 rounded text-amber-900 text-[11px] font-bold"
                >
                  Panu (Admin)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
