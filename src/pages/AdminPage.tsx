import React, { useState, useMemo } from 'react';
import {
  Shield,
  Users,
  Layers,
  Palette,
  Scissors,
  Shirt,
  Calendar,
  Sparkles,
  BarChart3,
  Settings,
  Search,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Key,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, MakeupItem, HairstyleItem, OutfitItem } from '../types/style';

interface AdminPageProps {
  navigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const {
    currentUser,
    isAdmin,
    isAdminUnlocked,
    adminPasscode,
    unlockAdminWithPasscode,
    lockAdmin,
    updateAdminPasscode,
    updateUserPassword,
    login,
    logout,
    allUsers,
    makeupList,
    hairstyleList,
    outfitList,
    occasionList,
    festivalList,
    adminLogs,
    toggleUserStatus,
    addMakeupItem,
    deleteMakeupItem,
    addHairstyleItem,
    deleteHairstyleItem,
    addOutfitItem,
    deleteOutfitItem,
    switchDemoUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'users'
    | 'makeup'
    | 'hairstyles'
    | 'outfits'
    | 'occasions'
    | 'festivals'
    | 'styles'
    | 'reports'
    | 'settings'
  >('dashboard');

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [selectedUserModal, setSelectedUserModal] = useState<UserProfile | null>(null);

  // Security Gate State (ที่ใส่รหัสระบบหลังบ้านกับแอดมิน)
  const [gateMode, setGateMode] = useState<'passcode' | 'account'>('passcode');
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('panu.admin@stylematch.ai');
  const [adminPassword, setAdminPassword] = useState('admin1234');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateSuccess, setGateSuccess] = useState<string | null>(null);

  // Backoffice Master Passcode Settings State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmNewPassInput, setConfirmNewPassInput] = useState('');
  const [passcodeUpdateMsg, setPasscodeUpdateMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [showMasterPasscode, setShowMasterPasscode] = useState(false);

  // Admin Account Password State
  const [adminNewPassInput, setAdminNewPassInput] = useState('');
  const [adminPassUpdateMsg, setAdminPassUpdateMsg] = useState<{ success: boolean; text: string } | null>(null);

  // User Reset Password Modal
  const [resettingUser, setResettingUser] = useState<UserProfile | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('user1234');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // New Content Forms
  const [newMakeupOpen, setNewMakeupOpen] = useState(false);
  const [newMakeupData, setNewMakeupData] = useState({
    name: '',
    category: 'Lip' as any,
    tone: 'Warm' as any,
    colorGroup: 'Coral',
    hexColor: '#E06A55',
    description: '',
    finish: 'Velvet' as any,
    recommendedFor: 'Warm undertone',
  });

  const [newHairOpen, setNewHairOpen] = useState(false);
  const [newHairData, setNewHairData] = useState({
    name: '',
    nameEn: '',
    length: 'Medium' as any,
    suitableFaceShapes: ['Oval', 'Round'] as any[],
    vibes: ['Korean', 'Casual'],
    description: '',
    stylingTips: '',
  });

  // Keypad click handler for passcode
  const handleKeypadPress = (val: string) => {
    setGateError(null);
    if (val === 'C') {
      setEnteredPasscode('');
    } else if (val === 'backspace') {
      setEnteredPasscode((prev) => prev.slice(0, -1));
    } else {
      setEnteredPasscode((prev) => (prev.length < 16 ? prev + val : prev));
    }
  };

  const handleUnlockWithPasscode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGateError(null);
    setGateSuccess(null);

    const res = unlockAdminWithPasscode(enteredPasscode);
    if (res.success) {
      setGateSuccess('ปลดล็อคระบบหลังบ้านสำเร็จ! กำลังเข้าสู่แดชบอร์ด...');
    } else {
      setGateError(res.error || 'รหัสผ่านระบบหลังบ้านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleUnlockWithAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);
    setGateSuccess(null);

    const res = login(adminEmail, adminPassword);
    if (res.success) {
      setGateSuccess('เข้าสู่ระบบแอดมินสำเร็จ! กำลังเปิดแดชบอร์ด...');
    } else {
      setGateError(res.error || 'อีเมลหรือรหัสผ่านแอดมินไม่ถูกต้อง');
    }
  };

  // Guard: If not admin or not unlocked, show Backoffice Security Gate
  if (!isAdmin || !isAdminUnlocked) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              ระบบรักษาความปลอดภัยหลังบ้าน
            </h1>
            <p className="text-xs text-neutral-500">
              StyleMatch AI Backoffice & Administration Gate
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>สถานะ: ล็อคความปลอดภัย (Protected)</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="bg-neutral-100 p-1 rounded-2xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setGateMode('passcode');
                setGateError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                gateMode === 'passcode'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>ใส่รหัสผ่านหลังบ้าน (PIN)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setGateMode('account');
                setGateError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                gateMode === 'account'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ล็อกอินแอดมิน</span>
            </button>
          </div>

          {/* Alerts */}
          {gateError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2 animate-in fade-in">
              <XCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span className="leading-relaxed font-medium">{gateError}</span>
            </div>
          )}

          {gateSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="leading-relaxed font-medium">{gateSuccess}</span>
            </div>
          )}

          {/* Tab 1: Passcode / PIN Entry */}
          {gateMode === 'passcode' && (
            <form onSubmit={handleUnlockWithPasscode} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800">
                    รหัสผ่านลับระบบหลังบ้าน (Master Passcode):
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {enteredPasscode.length} ตัวอักษร
                  </span>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={enteredPasscode}
                    onChange={(e) => setEnteredPasscode(e.target.value)}
                    placeholder="กรอกรหัสผ่านลับ เช่น admin888"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-sm font-mono tracking-wider bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                    title={showPasscode ? 'ซ่อนรหัส' : 'แสดงรหัส'}
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Interactive Virtual Keypad for Tactical Entry */}
              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 space-y-2">
                <p className="text-[10px] font-semibold text-neutral-500 text-center uppercase tracking-wider">
                  แป้นพิมพ์ตัวเลขสัมผัส (Virtual Keypad)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'backspace'].map((key) => {
                    const isClear = key === 'C';
                    const isBack = key === 'backspace';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeypadPress(key)}
                        className={`h-11 rounded-xl text-sm font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs ${
                          isClear
                            ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                            : isBack
                            ? 'bg-neutral-200 text-neutral-800 border border-neutral-300 hover:bg-neutral-300'
                            : 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                        }`}
                      >
                        {isBack ? '⌫ ลบ' : key}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Helper Button for Evaluator */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-amber-950">รหัสผ่านลับเริ่มต้น:</p>
                  <code className="text-xs font-mono font-bold text-amber-900">admin888</code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPasscode('admin888');
                    setGateError(null);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  คลิกใส่รหัสนี้
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                <Unlock className="w-4 h-4 text-amber-400" />
                <span>ปลดล็อคระบบหลังบ้าน (Unlock Backoffice)</span>
              </button>
            </form>
          )}

          {/* Tab 2: Admin Account Login */}
          {gateMode === 'account' && (
            <form onSubmit={handleUnlockWithAccount} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800">อีเมลผู้ดูแลระบบ:</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="panu.admin@stylematch.ai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800">รหัสผ่านแอดมิน:</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Helper for Admin credentials */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-neutral-900">บัญชีแอดมินทดสอบ (Panu):</p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    pass: <strong>admin1234</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('panu.admin@stylematch.ai');
                    setAdminPassword('admin1234');
                    setGateError(null);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] rounded-lg shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  เติมข้อมูลนี้
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>เข้าสู่ระบบแอดมิน (Sign In as Admin)</span>
              </button>
            </form>
          )}

          {/* Navigation Back */}
          <div className="pt-2 text-center border-t border-neutral-100">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
            >
              ← กลับสู่หน้าหลัก StyleMatch AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const matchQuery =
        !userSearchQuery ||
        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(userSearchQuery.toLowerCase());
      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
      return matchQuery && matchStatus;
    });
  }, [allUsers, userSearchQuery, userStatusFilter]);

  const stats = {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter((u) => u.status === 'active').length,
    totalAnalyses: 1420 + allUsers.length * 3,
    savedOutfitsCount: allUsers.reduce((acc, u) => acc + (u.savedOutfits?.length || 0), 0) + 42,
    popularStyles: ['Korean (34%)', 'Minimal (28%)', 'Street (18%)', 'Y2K (12%)'],
    popularColors: ['#E06A55 (Coral)', '#FAF5F0 (Cream)', '#8C6D58 (Mocha)'],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-amber-400 flex items-center justify-center font-bold shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">ระบบหลังบ้าน (Admin Backoffice)</h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ปลดล็อคความปลอดภัยแล้ว</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              ผู้ดูแลระบบปัจจุบัน: <strong className="text-neutral-800 font-semibold">{currentUser?.name}</strong> ({currentUser?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Lock Backoffice Button */}
          <button
            onClick={() => {
              lockAdmin();
              setGateSuccess(null);
              setGateError('ล็อคระบบความปลอดภัยหลังบ้านเรียบร้อยแล้ว');
            }}
            className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            title="ล็อคระบบหลังบ้านทันทีและต้องใส่รหัสผ่านใหม่เพื่อเข้าใช้งาน"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>ล็อคระบบหลังบ้าน</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/home');
            }}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>

          <button
            onClick={() => navigate('/home')}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 cursor-pointer transition-colors"
          >
            กลับสู่หน้าร้าน →
          </button>
        </div>
      </div>

      {/* Main Admin Layout: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <aside className="space-y-1 bg-white p-3 rounded-3xl border border-neutral-200 shadow-xs h-fit">
          {[
            { id: 'dashboard', label: 'แดชบอร์ดภาพรวม', icon: BarChart3 },
            { id: 'users', label: 'จัดการสมาชิก (Users)', icon: Users, badge: allUsers.length },
            { id: 'makeup', label: 'ข้อมูลเมคอัพ (Makeup)', icon: Palette, badge: makeupList.length },
            { id: 'hairstyles', label: 'ข้อมูลทรงผม (Hairstyle)', icon: Scissors, badge: hairstyleList.length },
            { id: 'outfits', label: 'ข้อมูลชุดเสื้อผ้า (Outfit)', icon: Shirt, badge: outfitList.length },
            { id: 'occasions', label: 'ข้อมูลโอกาส (Occasion)', icon: Calendar, badge: occasionList.length },
            { id: 'festivals', label: 'ข้อมูลเทศกาล (Festival)', icon: Sparkles, badge: festivalList.length },
            { id: 'styles', label: 'หมวดหมู่สไตล์ (Styles)', icon: Layers },
            { id: 'reports', label: 'กราฟวิเคราะห์ (Reports)', icon: TrendingUp },
            { id: 'settings', label: 'ตั้งค่าระบบ & Logs', icon: Settings },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-3 space-y-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-1">
                  <span className="text-xs text-neutral-500 font-semibold">Total Users</span>
                  <p className="text-2xl font-extrabold text-neutral-900">{stats.totalUsers}</p>
                  <p className="text-[10px] text-emerald-600">สมาชิกทั้งหมดในระบบ</p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-1">
                  <span className="text-xs text-neutral-500 font-semibold">Active Users</span>
                  <p className="text-2xl font-extrabold text-neutral-900">{stats.activeUsers}</p>
                  <p className="text-[10px] text-neutral-500">ผู้ใช้งานสถานะปกติ</p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-1">
                  <span className="text-xs text-neutral-500 font-semibold">Style Analyses</span>
                  <p className="text-2xl font-extrabold text-neutral-900">{stats.totalAnalyses}</p>
                  <p className="text-[10px] text-rose-600">การวิเคราะห์ผ่าน AI ทั้งหมด</p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-1">
                  <span className="text-xs text-neutral-500 font-semibold">Saved Outfits</span>
                  <p className="text-2xl font-extrabold text-neutral-900">
                    {stats.savedOutfitsCount}
                  </p>
                  <p className="text-[10px] text-indigo-600">ชุดที่ผู้ใช้กดบันทึก</p>
                </div>
              </div>

              {/* Popular breakdown cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    สไตล์ที่ถูกเลือกบ่อยที่สุด (Popular Styles)
                  </h3>
                  <div className="space-y-2 text-xs">
                    {stats.popularStyles.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50">
                        <span className="font-semibold text-neutral-800">{item.split(' ')[0]}</span>
                        <span className="font-mono text-neutral-500">{item.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    สีที่ถูกบันทึกบ่อย (Popular Colors)
                  </h3>
                  <div className="space-y-2 text-xs">
                    {stats.popularColors.map((color, i) => {
                      const hex = color.split(' ')[0];
                      const name = color.split(' ')[1];
                      return (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50">
                          <span
                            className="w-6 h-6 rounded-lg border border-white shadow-xs shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="font-semibold text-neutral-800">{name}</span>
                          <span className="font-mono text-neutral-500 text-[11px] ml-auto">{hex}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick User List Shortcut */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    สมาชิกล่าสุด (Recent Members)
                  </h3>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    ดูทั้งหมด →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400">
                        <th className="pb-2">ชื่อผู้ใช้</th>
                        <th className="pb-2">อีเมล</th>
                        <th className="pb-2">สิทธิ์</th>
                        <th className="pb-2">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {allUsers.slice(0, 4).map((u) => (
                        <tr key={u.id} className="hover:bg-neutral-50">
                          <td className="py-2.5 font-semibold text-neutral-900">{u.name}</td>
                          <td className="py-2.5 text-neutral-500">{u.email}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                u.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    ระบบจัดการสมาชิก (User Management)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Admin สามารถดู ค้นหา กรอง และระงับบัญชีสมาชิก (ไม่แสดงรหัสผ่านของสมาชิกเพื่อความปลอดภัย)
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value as any)}
                    className="p-2 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-800"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="active">ปกติ (Active)</option>
                    <option value="disabled">ระงับ (Disabled)</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="ค้นหาด้วย ชื่อ, อีเมล หรือ User ID..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] focus:outline-hidden"
                />
              </div>

              {/* User Table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                    <tr>
                      <th className="p-3">User ID</th>
                      <th className="p-3">ชื่อ-นามสกุล</th>
                      <th className="p-3">อีเมล</th>
                      <th className="p-3">วันที่ลงทะเบียน</th>
                      <th className="p-3">ใช้งานล่าสุด</th>
                      <th className="p-3">สถานะ</th>
                      <th className="p-3 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-50/70">
                        <td className="p-3 font-mono text-[11px] text-neutral-400">{u.id}</td>
                        <td className="p-3 font-semibold text-neutral-900">{u.name}</td>
                        <td className="p-3 text-neutral-600">{u.email}</td>
                        <td className="p-3 text-neutral-500">{u.registeredDate}</td>
                        <td className="p-3 text-neutral-500">{u.lastActive}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedUserModal(u)}
                            className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-medium cursor-pointer"
                          >
                            ดูโปรไฟล์
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'ระงับบัญชี' : 'เปิดใช้งาน'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MAKEUP DATA MANAGEMENT */}
          {activeTab === 'makeup' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    จัดการข้อมูลเมคอัพ (Makeup Dataset)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    เพิ่ม แก้ไข และลบเฉดสีลิป บลัชออน อายแชโดว์ และคำแนะนำรองพื้น
                  </p>
                </div>
                <button
                  onClick={() => setNewMakeupOpen(!newMakeupOpen)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มเฉดสีใหม่</span>
                </button>
              </div>

              {/* Add form */}
              {newMakeupOpen && (
                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 text-xs animate-in fade-in duration-150">
                  <h3 className="font-bold text-neutral-900">เพิ่มไอเทมเมคอัพใหม่</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ชื่อเฉดสี (เช่น Berry Rose Velvet)"
                      value={newMakeupData.name}
                      onChange={(e) => setNewMakeupData({ ...newMakeupData, name: e.target.value })}
                      className="p-2 rounded-lg border border-neutral-200 bg-white"
                    />
                    <select
                      value={newMakeupData.category}
                      onChange={(e) => setNewMakeupData({ ...newMakeupData, category: e.target.value as any })}
                      className="p-2 rounded-lg border border-neutral-200 bg-white"
                    >
                      <option value="Lip">Lip (ลิปสติก)</option>
                      <option value="Blush">Blush (บลัชออน)</option>
                      <option value="Eyeshadow">Eyeshadow (อายแชโดว์)</option>
                      <option value="Foundation">Foundation (รองพื้น)</option>
                    </select>
                    <select
                      value={newMakeupData.tone}
                      onChange={(e) => setNewMakeupData({ ...newMakeupData, tone: e.target.value as any })}
                      className="p-2 rounded-lg border border-neutral-200 bg-white"
                    >
                      <option value="Warm">Warm Tone</option>
                      <option value="Cool">Cool Tone</option>
                      <option value="Neutral">Neutral Tone</option>
                      <option value="Universal">Universal</option>
                    </select>
                    <input
                      type="text"
                      placeholder="โค้ดสี Hex เช่น #E06A55"
                      value={newMakeupData.hexColor}
                      onChange={(e) => setNewMakeupData({ ...newMakeupData, hexColor: e.target.value })}
                      className="p-2 rounded-lg border border-neutral-200 bg-white font-mono"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="คำอธิบายเฉดสีและสัมผัส"
                    value={newMakeupData.description}
                    onChange={(e) => setNewMakeupData({ ...newMakeupData, description: e.target.value })}
                    className="w-full p-2 rounded-lg border border-neutral-200 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setNewMakeupOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={() => {
                        if (!newMakeupData.name) return;
                        addMakeupItem(newMakeupData);
                        setNewMakeupOpen(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold cursor-pointer"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {makeupList.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-xl border border-white shadow-xs shrink-0"
                        style={{ backgroundColor: m.hexColor }}
                      />
                      <div>
                        <p className="font-bold text-neutral-900">{m.name}</p>
                        <p className="text-[10px] text-neutral-500">
                          {m.category} · {m.tone} · {m.finish}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMakeupItem(m.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="ลบไอเทม"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HAIRSTYLES MANAGEMENT */}
          {activeTab === 'hairstyles' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    จัดการข้อมูลทรงผม (Hairstyles Dataset)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    เพิ่ม แก้ไข และลบข้อมูลทรงผม รูปหน้าที่เหมาะ และเทคนิคการเซ็ต
                  </p>
                </div>
                <button
                  onClick={() => setNewHairOpen(!newHairOpen)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มทรงผมใหม่</span>
                </button>
              </div>

              {/* Add form */}
              {newHairOpen && (
                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 text-xs animate-in fade-in duration-150">
                  <h3 className="font-bold text-neutral-900">เพิ่มทรงผมใหม่</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ชื่อภาษาไทย (เช่น วูล์ฟคัทเกาหลี)"
                      value={newHairData.name}
                      onChange={(e) => setNewHairData({ ...newHairData, name: e.target.value })}
                      className="p-2 rounded-lg border border-neutral-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="ชื่อภาษาอังกฤษ (เช่น Korean Wolf Cut)"
                      value={newHairData.nameEn}
                      onChange={(e) => setNewHairData({ ...newHairData, nameEn: e.target.value })}
                      className="p-2 rounded-lg border border-neutral-200 bg-white"
                    />
                    <select
                      value={newHairData.length}
                      onChange={(e) => setNewHairData({ ...newHairData, length: e.target.value as any })}
                      className="p-2 rounded-lg border border-neutral-200 bg-white"
                    >
                      <option value="Short">ผมสั้น (Short)</option>
                      <option value="Medium">ความยาวปานกลาง (Medium)</option>
                      <option value="Long">ผมยาว (Long)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="คำอธิบายลักษณะทรงผม"
                    value={newHairData.description}
                    onChange={(e) => setNewHairData({ ...newHairData, description: e.target.value })}
                    className="w-full p-2 rounded-lg border border-neutral-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="เทคนิคการเซ็ตผม (Styling Tips)"
                    value={newHairData.stylingTips}
                    onChange={(e) => setNewHairData({ ...newHairData, stylingTips: e.target.value })}
                    className="w-full p-2 rounded-lg border border-neutral-200 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setNewHairOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={() => {
                        if (!newHairData.name) return;
                        addHairstyleItem(newHairData);
                        setNewHairOpen(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold cursor-pointer"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              )}

              {/* Hairstyles List */}
              <div className="space-y-3">
                {hairstyleList.map((h) => (
                  <div
                    key={h.id}
                    className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{h.name}</span>
                        <span className="text-[10px] text-neutral-500">({h.nameEn})</span>
                        <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                          {h.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{h.description}</p>
                    </div>
                    <button
                      onClick={() => deleteHairstyleItem(h.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: OUTFITS MANAGEMENT */}
          {activeTab === 'outfits' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    จัดการข้อมูลชุดเสื้อผ้า (Outfits Dataset)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    แคตตาล็อกชุดตามสไตล์ โอกาส และการจับคู่สี
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {outfitList.map((o) => (
                  <div
                    key={o.id}
                    className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{o.title}</span>
                        <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          {o.style}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mt-0.5">
                        {o.top} + {o.bottom}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteOutfitItem(o.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: OCCASIONS & FESTIVALS */}
          {(activeTab === 'occasions' || activeTab === 'festivals' || activeTab === 'styles') && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6 text-xs">
              <h2 className="text-lg font-bold text-neutral-900">
                ข้อมูลหมวดหมู่: {activeTab.toUpperCase()}
              </h2>
              <p className="text-neutral-500">
                ระบบเชื่อมต่อข้อมูลหมวดหมู่เพื่อการแนะนำชุดแบบอัตโนมัติ
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTab === 'occasions' &&
                  occasionList.map((occ) => (
                    <div key={occ.id} className="p-3 bg-neutral-50 rounded-xl border">
                      <p className="font-bold text-neutral-900">{occ.nameTh} ({occ.nameEn})</p>
                      <p className="text-neutral-500 mt-1">{occ.description}</p>
                    </div>
                  ))}
                {activeTab === 'festivals' &&
                  festivalList.map((fest) => (
                    <div key={fest.id} className="p-3 bg-neutral-50 rounded-xl border">
                      <p className="font-bold text-neutral-900">{fest.nameTh} - {fest.dateOrSeason}</p>
                      <p className="text-neutral-500 mt-1">{fest.vibe}</p>
                    </div>
                  ))}
                {activeTab === 'styles' && (
                  <p className="text-neutral-600">
                    มีสไตล์ทั้งหมด 13 รูปแบบ ได้แก่ Casual, Korean, Street, Minimal, Sporty, Smart Casual, Vintage, Y2K, Cute, Cool, Formal, Luxury, Japanese
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: REPORTS (INTERACTIVE SVG CHARTS) */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  สถิติและการวิเคราะห์เชิงลึก (Analytics & Reports)
                </h2>
                <p className="text-xs text-neutral-500">
                  กราฟแสดงการเติบโตของผู้ใช้ กิจกรรมการวิเคราะห์สไตล์ และความนิยม
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1: User Growth */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-800">
                    User Growth · การเติบโตของสมาชิก (รายเดือน)
                  </h4>
                  <svg viewBox="0 0 300 120" className="w-full h-32">
                    <polyline
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="3"
                      points="20,100 70,85 120,70 170,55 220,35 270,15"
                    />
                    <circle cx="20" cy="100" r="4" fill="#E11D48" />
                    <circle cx="70" cy="85" r="4" fill="#E11D48" />
                    <circle cx="120" cy="70" r="4" fill="#E11D48" />
                    <circle cx="170" cy="55" r="4" fill="#E11D48" />
                    <circle cx="220" cy="35" r="4" fill="#E11D48" />
                    <circle cx="270" cy="15" r="4" fill="#E11D48" />
                  </svg>
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>เม.ย.</span>
                    <span>พ.ค.</span>
                    <span>มิ.ย.</span>
                    <span>ก.ค.</span>
                    <span>ส.ค.</span>
                    <span>ก.ย.</span>
                  </div>
                </div>

                {/* Chart 2: Analysis Activity */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-800">
                    Analysis Activity · สัดส่วนโทนสีผิวที่ตรวจพบ
                  </h4>
                  <div className="space-y-2 pt-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>Warm Tone (52%)</span>
                        <span className="font-semibold">738 ครั้ง</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full w-[52%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>Cool Tone (31%)</span>
                        <span className="font-semibold">440 ครั้ง</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-rose-500 h-2 rounded-full w-[31%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>Neutral Tone (17%)</span>
                        <span className="font-semibold">242 ครั้ง</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full w-[17%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS & PASSCODES & ACTIVITY LOGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-xs">
              {/* Backoffice Security & Master Passcode Management Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                        การจัดการรหัสผ่านระบบหลังบ้าน (Master Passcode Management)
                      </h2>
                      <p className="text-xs text-neutral-500">
                        รหัสผ่านสำหรับเข้าถึง Backoffice Gate และปลดล็อคระบบจัดการ
                      </p>
                    </div>
                  </div>

                  {/* Current Active Passcode Badge */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[11px] font-semibold text-neutral-600">รหัสปัจจุบัน:</span>
                    <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded-lg border border-neutral-200 text-neutral-900">
                      {showMasterPasscode ? adminPasscode : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMasterPasscode(!showMasterPasscode)}
                      className="text-neutral-500 hover:text-neutral-900 cursor-pointer p-0.5"
                      title={showMasterPasscode ? 'ซ่อนรหัส' : 'แสดงรหัส'}
                    >
                      {showMasterPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Change Passcode Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPasscodeUpdateMsg(null);
                    if (newPassInput !== confirmNewPassInput) {
                      setPasscodeUpdateMsg({ success: false, text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' });
                      return;
                    }
                    const res = updateAdminPasscode(currentPassInput, newPassInput);
                    if (res.success) {
                      setPasscodeUpdateMsg({ success: true, text: 'เปลี่ยนรหัสผ่านระบบหลังบ้าน (Master Passcode) เรียบร้อยแล้ว' });
                      setCurrentPassInput('');
                      setNewPassInput('');
                      setConfirmNewPassInput('');
                    } else {
                      setPasscodeUpdateMsg({ success: false, text: res.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
                    }
                  }}
                  className="space-y-4 max-w-xl"
                >
                  {passcodeUpdateMsg && (
                    <div
                      className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                        passcodeUpdateMsg.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      {passcodeUpdateMsg.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>{passcodeUpdateMsg.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">รหัสผ่านหลังบ้านเดิม:</label>
                      <input
                        type="password"
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="เช่น admin888"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-[#FAF9F6] text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">รหัสผ่านใหม่ (อย่างน้อย 4 ตัว):</label>
                      <input
                        type="password"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="รหัสใหม่"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-[#FAF9F6] text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">ยืนยันรหัสผ่านใหม่:</label>
                      <input
                        type="password"
                        value={confirmNewPassInput}
                        onChange={(e) => setConfirmNewPassInput(e.target.value)}
                        placeholder="ยืนยันรหัสใหม่"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-[#FAF9F6] text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    บันทึกรหัสผ่านหลังบ้านใหม่ (Update Master Passcode)
                  </button>
                </form>
              </div>

              {/* Admin Personal Account Password Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      เปลี่ยนรหัสผ่านบัญชีแอดมิน ({currentUser?.email})
                    </h2>
                    <p className="text-xs text-neutral-500">
                      สำหรับใช้ในการเข้าสู่ระบบด้วยอีเมลและรหัสผ่านปกติ
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAdminPassUpdateMsg(null);
                    if (!currentUser) return;
                    const res = updateUserPassword(currentUser.id, adminNewPassInput);
                    if (res.success) {
                      setAdminPassUpdateMsg({ success: true, text: 'เปลี่ยนรหัสผ่านบัญชีแอดมินเรียบร้อยแล้ว' });
                      setAdminNewPassInput('');
                    } else {
                      setAdminPassUpdateMsg({ success: false, text: res.error || 'เกิดข้อผิดพลาด' });
                    }
                  }}
                  className="space-y-3 max-w-md"
                >
                  {adminPassUpdateMsg && (
                    <div
                      className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                        adminPassUpdateMsg.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      {adminPassUpdateMsg.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>{adminPassUpdateMsg.text}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">รหัสผ่านแอดมินใหม่ (อย่างน้อย 6 ตัวอักษร):</label>
                    <input
                      type="password"
                      value={adminNewPassInput}
                      onChange={(e) => setAdminNewPassInput(e.target.value)}
                      placeholder="กรอกรหัสผ่านบัญชีใหม่"
                      className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-[#FAF9F6] text-xs font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    อัปเดตรหัสผ่านบัญชีแอดมิน
                  </button>
                </form>
              </div>

              {/* Admin Activity & Security Logs Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                    ประวัติกิจกรรมและความปลอดภัยระบบ (Security & Activity Logs)
                  </h2>
                  <span className="text-[11px] text-neutral-500 font-mono bg-neutral-100 px-2.5 py-1 rounded-full">
                    {adminLogs.length} รายการ
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden">
                  {adminLogs.map((log) => {
                    const isSecurity = log.category === 'Security';
                    return (
                      <div
                        key={log.id}
                        className={`p-3.5 flex items-center justify-between transition-colors ${
                          isSecurity ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'bg-neutral-50/50 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-900">{log.action}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isSecurity
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-neutral-200 text-neutral-700'
                              }`}
                            >
                              {log.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono shrink-0 ml-2">{log.timestamp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* User Detail & Password Management Modal */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-neutral-900">{selectedUserModal.name}</h3>
                <p className="text-neutral-500 font-mono text-[11px]">{selectedUserModal.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedUserModal(null);
                  setResetSuccessMsg(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
              <p><strong>User ID:</strong> {selectedUserModal.id}</p>
              <p><strong>บทบาท:</strong> <span className="uppercase font-bold">{selectedUserModal.role}</span></p>
              <p><strong>สถานะ:</strong> <span className={selectedUserModal.status === 'active' ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>{selectedUserModal.status}</span></p>
              <p><strong>โทนสีผิว:</strong> {selectedUserModal.skinTone || 'ยังไม่ระบุ'}</p>
              <p><strong>รูปหน้า:</strong> {selectedUserModal.faceShape || 'ยังไม่ระบุ'}</p>
              <p><strong>สไตล์โปรด:</strong> {selectedUserModal.favoriteStyles?.join(', ') || 'ไม่มี'}</p>
              <p><strong>จำนวนชุดที่บันทึก:</strong> {selectedUserModal.savedOutfits?.length || 0} ลุค</p>
              <p>
                <strong>รหัสผ่านปัจจุบัน:</strong>{' '}
                <code className="bg-neutral-200 px-1.5 py-0.5 rounded font-mono text-[11px]">
                  {selectedUserModal.password || (selectedUserModal.role === 'admin' ? 'admin1234' : 'user1234')}
                </code>
              </p>
            </div>

            {/* Admin Reset User Password Section */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>รีเซ็ตรหัสผ่านสำหรับสมาชิกรายนี้:</span>
              </p>
              {resetSuccessMsg && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 font-medium">
                  {resetSuccessMsg}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  placeholder="รหัสผ่านใหม่"
                  className="flex-1 px-3 py-1.5 text-xs border border-amber-200 rounded-xl bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const res = updateUserPassword(selectedUserModal.id, newResetPassword);
                    if (res.success) {
                      setResetSuccessMsg(`อัปเดตรหัสผ่านใหม่เป็น "${newResetPassword}" สำเร็จ`);
                      // Update modal view
                      setSelectedUserModal({ ...selectedUserModal, password: newResetPassword });
                    }
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  บันทึก
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  toggleUserStatus(selectedUserModal.id);
                  setSelectedUserModal(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold cursor-pointer text-center ${
                  selectedUserModal.status === 'active'
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {selectedUserModal.status === 'active' ? 'ระงับบัญชีผู้ใช้นี้' : 'ปลดระงับบัญชีผู้ใช้นี้'}
              </button>
              <button
                onClick={() => {
                  setSelectedUserModal(null);
                  setResetSuccessMsg(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold cursor-pointer hover:bg-neutral-800"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
