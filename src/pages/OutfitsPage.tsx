import React, { useState, useMemo } from 'react';
import { Shirt, Sparkles, Filter, Bookmark, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StyleVibe } from '../types/style';

interface OutfitsPageProps {
  navigate: (path: string) => void;
}

export const OutfitsPage: React.FC<OutfitsPageProps> = ({ navigate }) => {
  const { outfitList, saveOutfit, currentUser } = useAuth();

  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<any>(null);
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  const styles: { id: string; label: string }[] = [
    { id: 'all', label: 'ทุกสไตล์ (All Styles)' },
    { id: 'Korean', label: 'เกาหลี (Korean)' },
    { id: 'Minimal', label: 'มินิมอล (Minimal)' },
    { id: 'Street', label: 'สตรีท (Street)' },
    { id: 'Smart Casual', label: 'สมาร์ทแคชชวล (Smart Casual)' },
    { id: 'Y2K', label: 'วายทูเค (Y2K)' },
    { id: 'Casual', label: 'แคชชวล (Casual)' },
    { id: 'Sporty', label: 'สปอร์ตตี้ (Sporty)' },
    { id: 'Vintage', label: 'วินเทจ (Vintage)' },
    { id: 'Cute', label: 'คิวท์ตี้ (Cute)' },
    { id: 'Luxury', label: 'ลักชูรี (Luxury)' },
    { id: 'Formal', label: 'ฟอร์มอล (Formal)' },
    { id: 'Japanese', label: 'เจแปนนิส (Japanese)' },
  ];

  const seasons = [
    { id: 'all', label: 'ทุกฤดูกาล' },
    { id: 'All', label: 'ใส่ได้ทุกฤดู' },
    { id: 'Summer', label: 'หน้าร้อน (Summer)' },
    { id: 'Winter', label: 'หน้าหนาว (Winter)' },
    { id: 'Rainy', label: 'หน้าฝน (Rainy)' },
  ];

  const filteredOutfits = useMemo(() => {
    return outfitList.filter((item) => {
      const matchStyle = selectedStyle === 'all' || item.style === selectedStyle;
      const matchSeason = selectedSeason === 'all' || item.season === selectedSeason;
      return matchStyle && matchSeason;
    });
  }, [outfitList, selectedStyle, selectedSeason]);

  const handleSave = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const lookData = {
      lookTitle: item.title,
      concept: item.whyItWorks,
      vibe: item.style,
      palette: item.colorPalette.map((hex: string, i: number) => ({
        name: `Color ${i + 1}`,
        hex,
        role: i === 0 ? 'สีหลัก' : 'สีรอง',
      })),
      makeup: {
        style: 'Natural Harmonious Glow',
        foundation: 'เฉดที่เข้ากับอันเดอร์โทนผิว',
        blush: 'บลัชออนสีพีชหรือชมพูกลีบกุหลาบ',
        lip: 'ลิปสติกโทนตุ่นธรรมชาติ',
        eyes: 'ชิมเมอร์ประกายเบาๆ',
        tip: 'เซ็ตผิวให้ดูเป็นธรรมชาติ',
      },
      hairstyle: {
        name: 'ทรงผมสไตล์แคชชวลเข้าชุด',
        nameEn: 'Effortless Styling',
        styling: 'จัดเซ็ตให้เข้ากับเส้นสายของคอเสื้อ',
        whyItFitsFace: 'เพิ่มความคล่องตัวและเสริมบุคลิก',
      },
      outfit: {
        top: item.top,
        bottom: item.bottom,
        outerwear: item.outerwear,
        shoes: item.shoes,
        bag: item.bag,
        accessories: item.accessories,
      },
      whyItWorks: item.whyItWorks,
      practicalTips: 'สามารถปรับเปลี่ยนไอเทมตามสภาพอากาศได้สะดวก',
    };

    saveOutfit(lookData, item.occasionId);
    setSavedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setSavedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Shirt className="w-3.5 h-3.5" />
            <span>Fashion Outfits Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2">
            แคตตาล็อกชุดและสไตล์แฟชั่น
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            สำรวจการจับคู่เสื้อ กางเกง กระโปรง รองเท้า และเครื่องประดับตามหลักการสร้างสมดุลสัดส่วน (Silhouettes & Balance)
          </p>
        </div>

        <button
          onClick={() => navigate('/generate-look')}
          className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>✨ สร้างลุคส่วนตัวใหม่</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Style Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-neutral-500 font-semibold shrink-0">สไตล์:</span>
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(s.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                selectedStyle === s.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Season Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-semibold shrink-0">ฤดูกาล:</span>
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                selectedSeason === season.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {season.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOutfits.map((outfit) => {
          const isSaved = savedMap[outfit.id];
          return (
            <div
              key={outfit.id}
              onClick={() => setActiveItem(outfit)}
              className="p-6 rounded-3xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      {outfit.style}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900">{outfit.title}</h3>
                  </div>

                  <button
                    onClick={(e) => handleSave(outfit, e)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="บันทึกชุดนี้"
                  >
                    {isSaved ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Outfit Components */}
                <div className="space-y-2 text-xs text-neutral-700 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                  <p>
                    <strong className="text-neutral-900">ท่อนบน:</strong> {outfit.top}
                  </p>
                  <p>
                    <strong className="text-neutral-900">ท่อนล่าง:</strong> {outfit.bottom}
                  </p>
                  {outfit.outerwear && (
                    <p>
                      <strong className="text-neutral-900">เสื้อคลุม:</strong> {outfit.outerwear}
                    </p>
                  )}
                  <p>
                    <strong className="text-neutral-900">รองเท้า:</strong> {outfit.shoes}
                  </p>
                </div>

                {/* Why It Works Reason */}
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                  {outfit.whyItWorks}
                </p>
              </div>

              {/* Color Palette Footer */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {outfit.colorPalette.map((hex, i) => (
                    <span
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-800 hover:text-rose-600">
                  ดูรายละเอียด →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outfit Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 relative">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {activeItem.style} · สำหรับ {activeItem.occasionId}
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 mt-2">{activeItem.title}</h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Detailed Breakdown */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-2">
                <h4 className="font-bold text-neutral-900 text-xs">องค์ประกอบของชุด:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700">
                  <div><strong>👕 ท่อนบน:</strong> {activeItem.top}</div>
                  <div><strong>👖 ท่อนล่าง:</strong> {activeItem.bottom}</div>
                  {activeItem.outerwear && <div><strong>🧥 เสื้อคลุม:</strong> {activeItem.outerwear}</div>}
                  <div><strong>👟 รองเท้า:</strong> {activeItem.shoes}</div>
                  <div><strong>👜 กระเป๋า:</strong> {activeItem.bag}</div>
                </div>
                {activeItem.accessories && activeItem.accessories.length > 0 && (
                  <div className="pt-1 text-neutral-700">
                    <strong>💍 เครื่องประดับ:</strong> {activeItem.accessories.join(', ')}
                  </div>
                )}
              </div>

              {/* Color Swatches */}
              <div>
                <span className="font-bold text-neutral-900 block mb-1.5">โทนสีชุด (Color Palette):</span>
                <div className="flex items-center gap-2">
                  {activeItem.colorPalette.map((hex: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200">
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[10px] font-mono text-neutral-600">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why it works */}
              <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1">
                <span className="font-bold text-rose-950">ทำไมชุดนี้จึงสร้างความสมดุล (Why It Works):</span>
                <p className="text-rose-900 leading-relaxed">{activeItem.whyItWorks}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => handleSave(activeItem, e)}
                className="flex-1 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                <span>บันทึกชุดนี้</span>
              </button>
              <button
                onClick={() => {
                  setActiveItem(null);
                  navigate('/generate-look');
                }}
                className="flex-1 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>สร้างลุคนี้เป็น Complete Look</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
