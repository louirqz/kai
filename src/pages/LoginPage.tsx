import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  User,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  HelpCircle,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  navigate: (path: string) => void;
  initialMode?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, initialMode = 'login' }) => {
  const { login, register, switchDemoUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMsg(null);
    setSuccessMsg('เติมข้อมูลบัญชีทดสอบเรียบร้อยแล้ว กดปุ่ม "เข้าสู่ระบบ" ได้เลย');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('กรุณากรอกชื่อ-นามสกุล หรือชื่อเล่น');
        return;
      }
      if (!email.trim()) {
        setErrorMsg('กรุณากรอกอีเมลของคุณ');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
        return;
      }

      const res = register(name, email, password);
      if (res.success) {
        setSuccessMsg('ลงทะเบียนสำเร็จ! กำลังเข้าสู่หน้าหลัก...');
        setTimeout(() => {
          navigate('/home');
        }, 600);
      } else {
        setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } else {
      // Login mode
      if (!email.trim()) {
        setErrorMsg('กรุณากรอกอีเมล');
        return;
      }
      if (!password) {
        setErrorMsg('กรุณากรอกรหัสผ่าน');
        return;
      }

      const res = login(email, password);
      if (res.success) {
        setSuccessMsg('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...');
        setTimeout(() => {
          if (email.toLowerCase().includes('admin')) {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        }, 500);
      } else {
        setErrorMsg(res.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotStatus('กรุณากรอกอีเมลที่ใช้ลงทะเบียน');
      return;
    }
    const clean = forgotEmail.trim().toLowerCase();
    if (clean.includes('admin')) {
      setForgotStatus('พบบัญชีผู้ดูแลระบบ! รหัสผ่านสำหรับทดสอบคือ: admin1234');
    } else if (clean.includes('sarah')) {
      setForgotStatus('พบบัญชีสมาชิก Sarah! รหัสผ่านสำหรับทดสอบคือ: user1234');
    } else {
      setForgotStatus(`ระบบจำลองการส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${clean} เรียบร้อยแล้ว (รหัสผ่านเริ่มต้น: user1234)`);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] mx-auto shadow-md">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-rose-500" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          {mode === 'login' ? 'เข้าสู่ระบบ StyleMatch AI' : 'สร้างบัญชีผู้ใช้ใหม่'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {mode === 'login'
            ? 'เข้าสู่ระบบด้วยอีเมลและรหัสผ่านเพื่อจัดการข้อมูลสไตล์และเข้าถึงระบบ'
            : 'ลงทะเบียนเพื่อเริ่มต้นวิเคราะห์และบันทึกสไตล์เฉพาะตัว'}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="bg-neutral-200/70 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'login'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>เข้าสู่ระบบ (Login)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'register'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>ลงทะเบียนใหม่ (Register)</span>
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4"
      >
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {mode === 'register' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800">
              ชื่อ-นามสกุล หรือชื่อเล่น:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น นภาพร หรือ Sarah"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800">อีเมล (Email):</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="เช่น sarah.sitanan@example.com หรือ panu.admin@stylematch.ai"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />
          </div>
        </div>

        {/* Password with Eye Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800">
              รหัสผ่าน (Password):
            </label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(true);
                  setForgotEmail(email);
                  setForgotStatus(null);
                }}
                className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                ลืมรหัสผ่าน?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านของคุณ"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
              title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password (Register mode) */}
        {mode === 'register' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800">
              ยืนยันรหัสผ่าน (Confirm Password):
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านเดิมอีกครั้ง"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                title={showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">ความยาวรหัสผ่านอย่างน้อย 6 ตัวอักษร</p>
          </div>
        )}

        {mode === 'login' && (
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
              />
              <span>จดจำฉันไว้ในอุปกรณ์นี้</span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-2"
        >
          <span>{mode === 'login' ? 'เข้าสู่ระบบ (Sign In)' : 'ยืนยันสร้างบัญชี (Sign Up)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Preset Accounts for Easy Evaluation */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-rose-500" />
            <span>บัญชีทดสอบสำหรับผู้ตรวจประเมิน:</span>
          </p>
          <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
            คลิกเพื่อเติมข้อมูลได้ทันที
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Sarah Card */}
          <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-all text-left flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                  👤 Sarah (สมาชิกทั่วไป)
                </span>
                <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-medium">
                  User
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5 truncate">
                sarah.sitanan@example.com
              </p>
              <p className="text-[11px] text-neutral-600 mt-1">
                รหัสผ่าน: <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono text-[11px]">user1234</code>
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => fillCredentials('sarah.sitanan@example.com', 'user1234')}
                className="flex-1 py-1.5 px-2 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 text-[11px] font-medium rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                เติมรหัสผ่าน
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('user');
                  navigate('/home');
                }}
                className="py-1.5 px-2 bg-neutral-900 text-white hover:bg-neutral-800 text-[11px] font-medium rounded-xl cursor-pointer shadow-xs"
              >
                เข้าทันที
              </button>
            </div>
          </div>

          {/* Admin Card */}
          <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all text-left flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  🛡️ Panu (ผู้ดูแลระบบ)
                </span>
                <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5 truncate">
                panu.admin@stylematch.ai
              </p>
              <p className="text-[11px] text-neutral-600 mt-1">
                รหัสผ่าน: <code className="bg-amber-200/80 px-1 py-0.5 rounded font-mono text-[11px]">admin1234</code>
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => fillCredentials('panu.admin@stylematch.ai', 'admin1234')}
                className="flex-1 py-1.5 px-2 bg-white border border-amber-200 hover:border-amber-300 text-amber-900 text-[11px] font-medium rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                เติมรหัสผ่าน
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('admin');
                  navigate('/admin');
                }}
                className="py-1.5 px-2 bg-amber-600 text-white hover:bg-amber-700 text-[11px] font-medium rounded-xl cursor-pointer shadow-xs"
              >
                เข้าหลังบ้าน
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Portal to Backoffice Passcode Door */}
      <div className="rounded-2xl border border-neutral-200/80 bg-gradient-to-r from-neutral-900 to-neutral-800 p-4 text-white flex items-center justify-between shadow-sm">
        <div className="space-y-0.5">
          <p className="text-xs font-bold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>เข้าสู่ระบบหลังบ้านด้วยรหัสผ่านแอดมิน (Backoffice Gate)</span>
          </p>
          <p className="text-[11px] text-neutral-400">
            ระบบตรวจสอบสิทธิ์ Master Passcode / Security PIN สำหรับผู้ดูแลระบบ
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0 transition-transform active:scale-95"
        >
          ไปที่ประตูหลังบ้าน
        </button>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-neutral-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm text-neutral-900">ค้นหา / รีเซ็ตรหัสผ่าน</h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer p-1"
              >
                ✕ ปิด
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              กรอกอีเมลของคุณเพื่อขอรับรหัสผ่าน หรือตรวจสอบข้อมูลบัญชีทดสอบในระบบ
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-700">อีเมล:</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl bg-[#FAF9F6] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              {forgotStatus && (
                <div className="p-3 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs rounded-xl font-medium">
                  {forgotStatus}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  ตรวจสอบรหัสผ่าน
                </button>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-neutral-200 text-neutral-600 text-xs hover:bg-neutral-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
