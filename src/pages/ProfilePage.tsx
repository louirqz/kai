import React, { useState } from 'react';
import {
  User,
  Shield,
  Trash2,
  Bookmark,
  Check,
  Palette,
  Scissors,
  Layers,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkinTone, FaceShape, StyleVibe } from '../types/style';

interface ProfilePageProps {
  navigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const {
    currentUser,
    updateProfile,
    deleteAccount,
    deleteUploadedPhoto,
    latestAnalysis,
    savedOutfits,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [skinTone, setSkinTone] = useState<SkinTone>(currentUser?.skinTone || 'Warm');
  const [faceShape, setFaceShape] = useState<FaceShape>(currentUser?.faceShape || 'Oval');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-800">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-xs text-neutral-500">
          เข้าสู่ระบบหรือลงทะเบียนเพื่อบันทึกและจัดการโปรไฟล์สไตล์ส่วนตัวของคุณ
        </p>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 cursor-pointer"
        >
          <span>เข้าสู่ระบบ / ลงทะเบียน</span>
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      skinTone,
      faceShape,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-sm">
            <div className="w-full h-full bg-[#FAF9F6] rounded-[22px] flex items-center justify-center text-xl font-extrabold text-neutral-900">
              {currentUser.name.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-neutral-900">{currentUser.name}</h1>
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {currentUser.role === 'admin' ? '🛡️ ผู้ดูแลระบบ (Admin)' : '✨ สมาชิกทั่วไป'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            >
              ยกเลิก
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
            >
              แก้ไขโปรไฟล์
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Profile Overview or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-neutral-900">แก้ไขข้อมูลส่วนตัว</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-800">ชื่อผู้ใช้งาน (Name):</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 focus:outline-hidden"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-800">อีเมล (Email):</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-neutral-400">อีเมลไม่สามารถแก้ไขได้โดยตรง</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-800">โทนสีผิว (Skin Tone):</label>
              <select
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value as SkinTone)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 focus:outline-hidden"
              >
                <option value="Warm">Warm Tone (อันเดอร์โทนอุ่น)</option>
                <option value="Cool">Cool Tone (อันเดอร์โทนเย็น)</option>
                <option value="Neutral">Neutral Tone (อันเดอร์โทนกลาง)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-800">รูปหน้า (Face Shape):</label>
              <select
                value={faceShape}
                onChange={(e) => setFaceShape(e.target.value as FaceShape)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 focus:outline-hidden"
              >
                <option value="Oval">รูปหน้าไข่ (Oval)</option>
                <option value="Round">รูปหน้ากลม (Round)</option>
                <option value="Square">รูปหน้าเหลี่ยม (Square)</option>
                <option value="Rectangle">รูปหน้ายาว (Rectangle)</option>
                <option value="Heart">รูปหน้าหัวใจ (Heart)</option>
                <option value="Diamond">รูปหน้าเพชร (Diamond)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer shadow-xs"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Style Stats */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              ลักษณะสไตล์ที่บันทึก
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-600">โทนสีผิว (Skin Tone):</span>
                <span className="font-bold text-neutral-900">{currentUser.skinTone || 'ยังไม่ได้ระบุ'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-600">รูปหน้า (Face Shape):</span>
                <span className="font-bold text-neutral-900">{currentUser.faceShape || 'ยังไม่ได้ระบุ'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-600">สัดส่วนเสื้อผ้า:</span>
                <span className="font-bold text-neutral-900">{currentUser.bodyProportion || 'สมดุล'}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/analyze')}
              className="w-full py-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>วิเคราะห์สไตล์ใหม่ด้วย AI</span>
            </button>
          </div>

          {/* Card 2: Favorite Styles */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              สไตล์โปรดที่เลือกไว้ ({currentUser.favoriteStyles?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.favoriteStyles && currentUser.favoriteStyles.length > 0 ? (
                currentUser.favoriteStyles.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 bg-rose-50 border border-rose-200/80 rounded-lg text-xs font-medium text-rose-800"
                  >
                    #{s}
                  </span>
                ))
              ) : (
                <p className="text-xs text-neutral-400">ยังไม่ได้เลือกสไตล์โปรด</p>
              )}
            </div>

            <button
              onClick={() => navigate('/style')}
              className="w-full py-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-200"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>จัดการสไตล์โปรด</span>
            </button>
          </div>

          {/* Card 3: Saved Looks Count */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                ชุดที่บันทึกไว้
              </h3>
              <p className="text-3xl font-extrabold text-neutral-900">
                {savedOutfits.length}{' '}
                <span className="text-xs font-normal text-neutral-500">เซ็ตชุด</span>
              </p>
              <p className="text-xs text-neutral-500">
                บันทึกคำแนะนำทั้งเมคอัพ ทรงผม และชุดสำหรับโอกาสพิเศษ
              </p>
            </div>

            <button
              onClick={() => navigate('/saved')}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>เปิดดูชุดที่บันทึกไว้</span>
            </button>
          </div>
        </div>
      )}

      {/* Privacy and Security Center (Strict user requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-neutral-900">
            ความเป็นส่วนตัวและความปลอดภัยของข้อมูล (Privacy & Security)
          </h3>
        </div>

        <div className="space-y-4 text-xs text-neutral-600">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-2">
            <span className="font-bold text-neutral-900 block text-xs">
              การเก็บรักษาข้อมูลรูปภาพและผลวิเคราะห์:
            </span>
            <ul className="list-disc list-inside space-y-1 text-neutral-700">
              <li>รูปภาพที่คุณอัปโหลดจะถูกประมวลผลอย่างเป็นส่วนตัว ไม่ถูกเผยแพร่ต่อสาธารณะ</li>
              <li>ผู้ดูแลระบบและสมาชิกคนอื่นไม่สามารถมองเห็นรูปภาพส่วนตัวของคุณได้</li>
              <li>รหัสผ่านของคุณถูกเข้ารหัสอย่างปลอดภัย (Admin ไม่สามารถดูรหัสผ่านของคุณได้)</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <p className="font-semibold text-neutral-800">ลบรูปภาพที่เคยอัปโหลด</p>
              <p className="text-[11px] text-neutral-500">
                ล้างไฟล์ภาพใบหน้าออกจากแคชการประมวลผลของระบบทันที
              </p>
            </div>
            <button
              onClick={() => {
                deleteUploadedPhoto();
                alert('ลบรูปภาพออกจากระบบเรียบร้อยแล้ว');
              }}
              className="px-4 py-2 rounded-xl border border-neutral-300 hover:border-red-300 text-neutral-700 hover:text-red-600 text-xs font-semibold cursor-pointer"
            >
              ลบรูปภาพออกจากระบบ
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
            <div>
              <p className="font-semibold text-red-600">ลบบัญชีผู้ใช้งานถาวร (Delete Account)</p>
              <p className="text-[11px] text-neutral-500">
                ลบข้อมูลโปรไฟล์ สไตล์ที่บันทึก และประวัติการวิเคราะห์ทั้งหมดออกจากระบบอย่างถาวร
              </p>
            </div>
            {confirmDeleteAccount ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmDeleteAccount(false)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs text-neutral-600"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    deleteAccount();
                    navigate('/home');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
                >
                  ยืนยันลบบัญชีถาวร
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteAccount(true)}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold cursor-pointer"
              >
                ลบบัญชีของฉัน
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
