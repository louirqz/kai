import React, { useState, useMemo } from 'react';
import { Scissors, Sparkles, Filter, Info, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FaceShape } from '../types/style';

interface HairstylePageProps {
  navigate: (path: string) => void;
}

export const HairstylePage: React.FC<HairstylePageProps> = ({ navigate }) => {
  const { hairstyleList, latestAnalysis } = useAuth();

  const [selectedFaceShape, setSelectedFaceShape] = useState<string>(
    latestAnalysis ? latestAnalysis.faceShape : 'all'
  );
  const [selectedLength, setSelectedLength] = useState<string>('all');
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<any>(null);

  const faceShapes: { id: string; label: string }[] = [
    { id: 'all', label: 'ทุกรูปหน้า (All Face Shapes)' },
    { id: 'Oval', label: 'รูปหน้าไข่ (Oval)' },
    { id: 'Round', label: 'รูปหน้ากลม (Round)' },
    { id: 'Square', label: 'รูปหน้าเหลี่ยม (Square)' },
    { id: 'Rectangle', label: 'รูปหน้ายาว (Rectangle)' },
    { id: 'Heart', label: 'รูปหน้าหัวใจ (Heart)' },
    { id: 'Diamond', label: 'รูปหน้าเพชร (Diamond)' },
  ];

  const lengths = [
    { id: 'all', label: 'ทุกความยาว' },
    { id: 'Short', label: 'ผมสั้น (Short)' },
    { id: 'Medium', label: 'ความยาวปานกลาง / ประบ่า (Medium)' },
    { id: 'Long', label: 'ผมยาว (Long)' },
  ];

  const vibes = ['all', 'Clean', 'Casual', 'Smart', 'Cute', 'Cool', 'Korean', 'Sporty', 'Trendy'];

  const filteredHairstyles = useMemo(() => {
    return hairstyleList.filter((item) => {
      const matchFace =
        selectedFaceShape === 'all' ||
        item.suitableFaceShapes.includes(selectedFaceShape as FaceShape);
      const matchLength = selectedLength === 'all' || item.length === selectedLength;
      const matchVibe =
        selectedVibe === 'all' ||
        item.vibes.some((v) => v.toLowerCase() === selectedVibe.toLowerCase());
      return matchFace && matchLength && matchVibe;
    });
  }, [hairstyleList, selectedFaceShape, selectedLength, selectedVibe]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Scissors className="w-3.5 h-3.5" />
            <span>Hairstyle & Grooming Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2">
            ทรงผมที่เข้ากับรูปหน้าของคุณ
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            สำรวจทรงผมทั้งสั้น กลาง ยาว พร้อมเทคนิคการจัดเซ็ตที่ช่วยดึงความมั่นใจและเสริมกรอบหน้าอย่างเป็นธรรมชาติ
          </p>
        </div>

        {latestAnalysis && (
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs shrink-0 flex items-center gap-3">
            <div>
              <span className="font-semibold text-amber-950">รูปหน้าของคุณ: </span>
              <span className="font-bold text-amber-900">{latestAnalysis.faceShapeThai}</span>
              <p className="text-amber-800 text-[11px]">ระบบคัดสรรทรงผมที่เข้ากับคุณโดยเฉพาะ</p>
            </div>
            <button
              onClick={() => setSelectedFaceShape(latestAnalysis.faceShape)}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-medium text-[11px] hover:bg-amber-700 cursor-pointer"
            >
              ใช้รูปหน้านี้
            </button>
          </div>
        )}
      </div>

      {/* Non-judgmental message */}
      <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
        <Info className="w-4 h-4 text-neutral-500 shrink-0" />
        <span>
          <strong>คำชี้แจง: </strong> ทุกรูปหน้ามีความสวยงามและมีเอกลักษณ์ ทรงผมเป็นเพียงเครื่องมือเสริมสร้างความมั่นใจและการแสดงออกของตัวคุณเอง
        </span>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Face Shapes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-neutral-500 font-semibold shrink-0">รูปหน้า:</span>
          {faceShapes.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFaceShape(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                selectedFaceShape === f.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Length & Vibe */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-semibold">ความยาว:</span>
            <select
              value={selectedLength}
              onChange={(e) => setSelectedLength(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1 text-neutral-700"
            >
              {lengths.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-semibold">สไตล์/ลุค (Vibe):</span>
            <select
              value={selectedVibe}
              onChange={(e) => setSelectedVibe(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1 text-neutral-700"
            >
              {vibes.map((v) => (
                <option key={v} value={v}>
                  {v === 'all' ? 'ทุกสไตล์ (All Vibes)' : v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hairstyles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHairstyles.map((hair) => (
          <div
            key={hair.id}
            onClick={() => setActiveItem(hair)}
            className="p-6 rounded-3xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{hair.name}</h3>
                  <p className="text-xs text-neutral-500 font-medium">{hair.nameEn}</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full shrink-0">
                  {hair.length}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                {hair.description}
              </p>

              {/* Suitable Face Shapes Tags */}
              <div className="pt-1">
                <span className="text-[10px] text-neutral-500 block mb-1">
                  เสริมสัดส่วนรูปหน้าที่ดี:
                </span>
                <div className="flex flex-wrap gap-1">
                  {hair.suitableFaceShapes.map((shape) => (
                    <span
                      key={shape}
                      className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded-md text-[10px] text-neutral-700"
                    >
                      {shape}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {hair.vibes.map((v) => (
                  <span key={v} className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                    #{v}
                  </span>
                ))}
              </div>
              <span className="text-amber-700 font-semibold hover:underline shrink-0">ดูวิธีเซ็ต →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hairstyle Detail Modal */}
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
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  ความยาว: {activeItem.length}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {activeItem.vibes.join(' · ')}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-neutral-900 mt-2">{activeItem.name}</h3>
              <p className="text-xs text-neutral-500 font-medium">{activeItem.nameEn}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <span className="font-bold text-neutral-900">ลักษณะทรงผม:</span>
                <p className="text-neutral-700 leading-relaxed">{activeItem.description}</p>
              </div>

              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1">
                <span className="font-bold text-amber-950">วิธีจัดแต่งทรง (Styling Tips):</span>
                <p className="text-amber-900 leading-relaxed">{activeItem.stylingTips}</p>
              </div>

              <div>
                <span className="font-bold text-neutral-900 block mb-1.5">
                  รูปหน้าที่กลมกลืนและช่วยขับเน้นจุดเด่น:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.suitableFaceShapes.map((shape: string) => (
                    <span
                      key={shape}
                      className="px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800 font-medium"
                    >
                      ✓ {shape}
                    </span>
                  ))}
                </div>
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
              <span>นำทรงนี้ไปสร้าง Complete Look</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
