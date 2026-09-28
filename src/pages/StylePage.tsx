import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Check,
  Bookmark,
  ArrowRight,
  Smile,
  Zap,
  Maximize2,
  Activity,
  Briefcase,
  Clock,
  Flame,
  Heart,
  Shield,
  Award,
  Gem,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STYLE_DEFINITIONS } from '../data/mockData';
import { StyleVibe } from '../types/style';

interface StylePageProps {
  navigate: (path: string) => void;
}

const STYLE_ICON_MAP: Record<string, any> = {
  Smile,
  Sparkles,
  Zap,
  Maximize2,
  Activity,
  Briefcase,
  Clock,
  Flame,
  Heart,
  Shield,
  Award,
  Gem,
  Compass,
};

export const StylePage: React.FC<StylePageProps> = ({ navigate }) => {
  const { currentUser, updateProfile, latestAnalysis } = useAuth();

  const [selectedStyles, setSelectedStyles] = useState<StyleVibe[]>(
    currentUser?.favoriteStyles || ['Korean', 'Minimal']
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleStyle = (styleId: StyleVibe) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((s) => s !== styleId) : [...prev, styleId]
    );
  };

  const handleSaveToProfile = () => {
    updateProfile({ favoriteStyles: selectedStyles });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Personal Style Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2">
            สารานุกรมสไตล์แฟชั่น & สไตล์ที่ชอบ
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            เลือกสไตล์ที่คุณชื่นชอบ (สามารถเลือกได้หลายแบบพร้อมกัน) เพื่อให้ AI รวบรวมข้อมูลและสร้าง Personal Style Profile ของคุณ
          </p>
        </div>

        {/* Selected Counter & Save */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right text-xs hidden sm:block">
            <span className="text-neutral-500">เลือกแล้ว: </span>
            <span className="font-bold text-neutral-900">{selectedStyles.length} สไตล์</span>
          </div>
          <button
            onClick={handleSaveToProfile}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>บันทึกลงโปรไฟล์แล้ว!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>บันทึกสไตล์ที่ชอบ ({selectedStyles.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected Styles Pills Strip */}
      {selectedStyles.length > 0 && (
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-neutral-700">สไตล์โปรดของคุณ:</span>
            {selectedStyles.map((s) => (
              <span
                key={s}
                onClick={() => toggleStyle(s)}
                className="px-3 py-1 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium flex items-center gap-1.5 cursor-pointer hover:border-red-300 hover:text-red-600"
                title="คลิกเพื่อเอาออก"
              >
                <span>{s}</span>
                <span className="text-neutral-400 text-[10px]">✕</span>
              </span>
            ))}
          </div>

          <button
            onClick={() =>
              navigate(
                `/generate-look?styles=${encodeURIComponent(selectedStyles.join(','))}&skin=${
                  latestAnalysis?.skinTone || 'Warm'
                }`
              )
            }
            className="text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>นำสไตล์เหล่านี้ไป Generate Complete Look</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STYLE_DEFINITIONS.map((item) => {
          const isSelected = selectedStyles.includes(item.id);
          const Icon = STYLE_ICON_MAP[item.icon] || Sparkles;

          return (
            <div
              key={item.id}
              onClick={() => toggleStyle(item.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-101'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/10 text-amber-300' : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{item.nameTh}</h3>
                      <p
                        className={`text-xs ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {item.nameEn}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                      isSelected
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'border-neutral-300 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </div>

                <p
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-rose-300' : 'text-rose-600'
                  }`}
                >
                  &quot;{item.tagline}&quot;
                </p>

                <p
                  className={`text-xs leading-relaxed ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  {item.description}
                </p>

                {/* Key Silhouettes */}
                <div
                  className={`p-3 rounded-2xl text-xs space-y-1 ${
                    isSelected ? 'bg-white/5 border border-white/10' : 'bg-neutral-50 border border-neutral-150'
                  }`}
                >
                  <span className={`font-bold block ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                    โครงสร้างและไอเทมหลัก:
                  </span>
                  <p className={isSelected ? 'text-neutral-300' : 'text-neutral-700'}>
                    {item.keySilhouettes}
                  </p>
                </div>
              </div>

              {/* Color Palette Footer */}
              <div
                className={`mt-5 pt-3 border-t flex items-center justify-between ${
                  isSelected ? 'border-white/10' : 'border-neutral-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {item.colorPalette.map((hex, i) => (
                    <span
                      key={i}
                      className="w-5 h-5 rounded-full border border-white/50 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-amber-300' : 'text-neutral-500'
                  }`}
                >
                  {isSelected ? 'เลือกแล้ว ✓' : 'คลิกเพื่อเลือก'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
