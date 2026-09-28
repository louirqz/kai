import React, { useState } from 'react';
import { Bookmark, Sparkles, Trash2, ArrowRight, Calendar, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SavedOutfit } from '../types/style';

interface SavedPageProps {
  navigate: (path: string) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({ navigate }) => {
  const { savedOutfits, removeSavedOutfit } = useAuth();
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null);

  if (savedOutfits.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-800">ยังไม่มีชุดที่บันทึกไว้</h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          เมื่อคุณวิเคราะห์สไตล์หรือค้นหาชุดที่ถูกใจ สามารถกดปุ่ม &quot;บันทึกชุดนี้&quot; เพื่อเก็บไว้ดูเป็นแนวทางในอนาคตได้ที่นี่
        </p>
        <button
          onClick={() => navigate('/generate-look')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>เริ่มสร้างลุคใหม่ทันที</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Outfits Collection</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-2">
            ชุดและลุคที่คุณบันทึกไว้ ({savedOutfits.length})
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            คอลเลกชันสไตล์ส่วนตัวที่คุณสามารถเปิดดูทบทวนได้ทุกเมื่อ
          </p>
        </div>

        <button
          onClick={() => navigate('/generate-look')}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>สร้างลุคเพิ่ม</span>
        </button>
      </div>

      {/* Grid of Saved Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedOutfits.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedOutfit(item)}
            className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {item.occasion}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSavedOutfit(item.id);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="ลบชุดนี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {item.look.concept}
              </p>
            </div>

            {/* Micro Palette */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                {item.look.palette.map((p, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: p.hex }}
                  />
                ))}
              </div>
              <span className="text-rose-600 font-semibold hover:underline">เปิดดูรายละเอียด →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {selectedOutfit.occasion} · บันทึกเมื่อ {selectedOutfit.dateSaved}
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 mt-2">
                {selectedOutfit.title}
              </h3>
              <p className="text-xs text-neutral-600 mt-1">{selectedOutfit.look.concept}</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Palette */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
                <span className="font-bold text-neutral-900 block mb-2">คู่สีของลุคนี้:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedOutfit.look.palette.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-neutral-200">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.hex }} />
                      <span className="text-[10px] text-neutral-700 font-medium">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Garments */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-1.5">
                <span className="font-bold text-neutral-900 block">ชิ้นส่วนชุดเสื้อผ้า:</span>
                <p>👕 <strong>ท่อนบน:</strong> {selectedOutfit.look.outfit.top}</p>
                <p>👖 <strong>ท่อนล่าง:</strong> {selectedOutfit.look.outfit.bottom}</p>
                {selectedOutfit.look.outfit.outerwear && (
                  <p>🧥 <strong>เสื้อคลุม:</strong> {selectedOutfit.look.outfit.outerwear}</p>
                )}
                <p>👟 <strong>รองเท้า:</strong> {selectedOutfit.look.outfit.shoes}</p>
                <p>👜 <strong>กระเป๋า:</strong> {selectedOutfit.look.outfit.bag}</p>
              </div>

              {/* Hair & Makeup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-1">
                  <span className="font-bold text-neutral-900">💇 ทรงผม:</span>
                  <p className="font-semibold text-neutral-800">{selectedOutfit.look.hairstyle.name}</p>
                  <p className="text-neutral-600">{selectedOutfit.look.hairstyle.styling}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-1">
                  <span className="font-bold text-neutral-900">💄 เมคอัพ:</span>
                  <p className="font-semibold text-neutral-800">{selectedOutfit.look.makeup.style}</p>
                  <p className="text-neutral-600">{selectedOutfit.look.makeup.lip}</p>
                </div>
              </div>

              {/* Why It Works */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-950">
                <span className="font-bold">ทำไมชุดนี้จึงเข้ากัน:</span>
                <p className="mt-0.5 leading-relaxed">{selectedOutfit.look.whyItWorks}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  removeSavedOutfit(selectedOutfit.id);
                  setSelectedOutfit(null);
                }}
                className="py-2.5 px-4 rounded-xl border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 cursor-pointer"
              >
                ลบชุดนี้ออกจากที่บันทึก
              </button>
              <button
                onClick={() => setSelectedOutfit(null)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
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
