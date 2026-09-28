import React, { useState, useMemo } from 'react';
import { Palette, Sparkles, Check, Filter, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkinTone } from '../types/style';

interface MakeupPageProps {
  navigate: (path: string) => void;
}

export const MakeupPage: React.FC<MakeupPageProps> = ({ navigate }) => {
  const { makeupList, latestAnalysis } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTone, setSelectedTone] = useState<string>(
    latestAnalysis ? latestAnalysis.skinTone : 'all'
  );
  const [activeItem, setActiveItem] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'ทั้งหมด (All)' },
    { id: 'Lip', label: '💄 ริมฝีปาก (Lip)' },
    { id: 'Blush', label: '🌸 บลัชออน (Blush)' },
    { id: 'Eyeshadow', label: '✨ อายแชโดว์ (Eyes)' },
    { id: 'Foundation', label: '🧴 เฉดรองพื้น (Foundation)' },
  ];

  const tones: { id: string; label: string }[] = [
    { id: 'all', label: 'ทุกโทน (All Tones)' },
    { id: 'Warm', label: 'Warm Tone (วอร์มโทน)' },
    { id: 'Cool', label: 'Cool Tone (คูลโทน)' },
    { id: 'Neutral', label: 'Neutral Tone (นิวทรัลโทน)' },
  ];

  const filteredItems = useMemo(() => {
    return makeupList.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchTone =
        selectedTone === 'all' || item.tone === selectedTone || item.tone === 'Universal';
      return matchCat && matchTone;
    });
  }, [makeupList, selectedCategory, selectedTone]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>Makeup Palette Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2">
            สตูดิโอแนะนำโทนสีเมคอัพ
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            ค้นหาเฉดสีลิปสติก บลัชออน อายแชโดว์ และแนวทางการทดสอบเฉดรองพื้นที่สอดรับกับอันเดอร์โทนผิวของคุณ
          </p>
        </div>

        {latestAnalysis && (
          <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200 text-xs shrink-0 flex items-center gap-3">
            <div>
              <span className="font-semibold text-rose-900">โทนผิวของคุณ: </span>
              <span className="font-bold text-rose-950">{latestAnalysis.skinToneThai}</span>
              <p className="text-rose-800 text-[11px]">ระบบกำลังกรองเฉดสีที่เหมาะกับคุณโดยอัตโนมัติ</p>
            </div>
            <button
              onClick={() => setSelectedTone(latestAnalysis.skinTone)}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-medium text-[11px] hover:bg-rose-700 cursor-pointer"
            >
              ใช้โทนนี้
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Tones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-neutral-600 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> โทนสีผิว:
          </span>
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTone(t.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                selectedTone === t.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-neutral-200/80 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => {
          const isSelected = activeItem?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                isSelected
                  ? 'border-neutral-900 ring-2 ring-neutral-900/10 shadow-md'
                  : 'border-neutral-200/90 hover:border-neutral-300'
              }`}
            >
              <div className="space-y-3">
                {/* Color Swatch Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl shrink-0 shadow-sm border-2 border-white ring-1 ring-neutral-200/60"
                    style={{ backgroundColor: item.hexColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-neutral-600">{item.colorGroup}</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-neutral-800">
                    {item.tone === 'Universal' ? 'ทุกโทนผิว' : `${item.tone} Tone`}
                  </span>
                  <span>·</span>
                  <span>{item.finish}</span>
                </div>
                <span className="text-rose-600 font-medium hover:underline">แตะเพื่อดูรายละเอียด</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal if an item is clicked */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 relative">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl shrink-0 shadow-md border-2 border-white ring-1 ring-neutral-200"
                style={{ backgroundColor: activeItem.hexColor }}
              />
              <div>
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  {activeItem.category} · {activeItem.finish}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">{activeItem.name}</h3>
                <p className="text-xs text-neutral-600 font-mono">Hex: {activeItem.hexColor}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <span className="font-bold text-neutral-900">คำอธิบายและสัมผัส:</span>
                <p className="text-neutral-700 leading-relaxed">{activeItem.description}</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <span className="font-bold text-neutral-900">แนะนำสำหรับ:</span>
                <p className="text-neutral-700 leading-relaxed">{activeItem.recommendedFor}</p>
              </div>

              <div className="flex items-center justify-between text-neutral-600 pt-2 border-t border-neutral-100">
                <span>โทนผิวที่เข้ากัน: <strong>{activeItem.tone}</strong></span>
                <span>ฟินิชเนื้อสัมผัส: <strong>{activeItem.finish}</strong></span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveItem(null);
                navigate('/generate-look');
              }}
              className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ผสมผสานใน Complete Look</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
