import React, { useState } from 'react';
import {
  Sparkles,
  Bookmark,
  Check,
  RefreshCw,
  Share2,
  Palette,
  Scissors,
  Shirt,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateCompleteLookWithAI } from '../services/aiService';
import { CompleteLook, SkinTone, FaceShape, BodyProportion, StyleVibe } from '../types/style';

interface GenerateLookPageProps {
  navigate: (path: string) => void;
  initialParams?: {
    skin?: string;
    face?: string;
    body?: string;
    styles?: string;
    occasion?: string;
    festival?: string;
  };
}

export const GenerateLookPage: React.FC<GenerateLookPageProps> = ({
  navigate,
  initialParams = {},
}) => {
  const { currentUser, latestAnalysis, saveOutfit } = useAuth();

  // Inputs
  const [skinTone, setSkinTone] = useState<SkinTone>(
    (initialParams.skin as SkinTone) || latestAnalysis?.skinTone || currentUser?.skinTone || 'Warm'
  );
  const [faceShape, setFaceShape] = useState<FaceShape>(
    (initialParams.face as FaceShape) || latestAnalysis?.faceShape || currentUser?.faceShape || 'Oval'
  );
  const [bodyProportion, setBodyProportion] = useState<BodyProportion>(
    (initialParams.body as BodyProportion) ||
      latestAnalysis?.bodyProportion ||
      currentUser?.bodyProportion ||
      'Hourglass'
  );
  const [selectedStyles, setSelectedStyles] = useState<StyleVibe[]>(() => {
    if (initialParams.styles) {
      return initialParams.styles.split(',') as StyleVibe[];
    }
    return currentUser?.favoriteStyles || ['Korean', 'Minimal'];
  });
  const [occasion, setOccasion] = useState<string>(initialParams.occasion || 'ไปคาเฟ่');
  const [festival, setFestival] = useState<string>(initialParams.festival || 'เทศกาลปกติ / ตามฤดูกาล');

  // Generation state & result
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLook, setGeneratedLook] = useState<CompleteLook | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const occasionsList = [
    'ไปคาเฟ่',
    'ไปเที่ยว / ท่องเที่ยว',
    'ไปห้าง / ช้อปปิ้ง',
    'ไปออกเดต',
    'ไปสัมภาษณ์งาน',
    'ไปงานแต่งงาน',
    'ไปโรงเรียน / กิจกรรม',
    'ไปมหาวิทยาลัย',
    'ไปงานวันเกิด / ปาร์ตี้',
    'ไปออกกำลังกาย / ยิม',
    'งานทางการ / ดินเนอร์หรู',
    'งานกึ่งทางการ / ประชุม',
    'อยู่บ้าน / Work from Home',
    'ไปคอนเสิร์ต / เฟสติวัล',
    'ไปวัด / ทำบุญ',
  ];

  const festivalsList = [
    'เทศกาลปกติ / ตามฤดูกาล',
    'เทศกาลสงกรานต์',
    'เทศกาลปีใหม่ / เคาท์ดาวน์',
    'วันวาเลนไทน์',
    'เทศกาลฮาโลวีน',
    'เทศกาลคริสต์มาส',
    'เทศกาลลอยกระทง',
    'งานรับปริญญา',
    'ซัมเมอร์ / หน้าร้อน',
    'วินเทอร์ / ฤดูหนาว',
    'หน้าฝน / ฤดูฝน',
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaveSuccess(false);

    try {
      const result = await generateCompleteLookWithAI({
        skinTone,
        faceShape,
        bodyProportion,
        preferredStyles: selectedStyles,
        occasion,
        festival: festival === 'เทศกาลปกติ / ตามฤดูกาล' ? undefined : festival,
      });

      setGeneratedLook(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLook = () => {
    if (!generatedLook) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }
    saveOutfit(generatedLook, occasion);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>AI Complete Look Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          สร้างลุคสมบูรณ์แบบเฉพาะตัวคุณ
        </h1>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          AI นำข้อมูลสีผิว โครงหน้า สัดส่วนเสื้อผ้า และโอกาสที่คุณจะไป มาสร้างการจับคู่ชุด เมคอัพ
          และทรงผมแบบครบองค์รวม (Complete Look)
        </p>
      </div>

      {/* Generator Control Dashboard Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. Skin Tone */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-500" />
              โทนสีผิว (Skin Tone):
            </label>
            <select
              value={skinTone}
              onChange={(e) => setSkinTone(e.target.value as SkinTone)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 font-medium focus:outline-hidden"
            >
              <option value="Warm">Warm Tone (อันเดอร์โทนอุ่น/เหลืองทอง)</option>
              <option value="Cool">Cool Tone (อันเดอร์โทนเย็น/ชมพูฟ้า)</option>
              <option value="Neutral">Neutral Tone (อันเดอร์โทนกลางสมดุล)</option>
            </select>
          </div>

          {/* 2. Face Shape */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-amber-500" />
              รูปหน้า (Face Shape):
            </label>
            <select
              value={faceShape}
              onChange={(e) => setFaceShape(e.target.value as FaceShape)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 font-medium focus:outline-hidden"
            >
              <option value="Oval">รูปหน้าไข่ (Oval)</option>
              <option value="Round">รูปหน้ากลม (Round)</option>
              <option value="Square">รูปหน้าเหลี่ยม (Square)</option>
              <option value="Rectangle">รูปหน้ายาว (Rectangle)</option>
              <option value="Heart">รูปหน้าหัวใจ (Heart)</option>
              <option value="Diamond">รูปหน้าเพชร (Diamond)</option>
            </select>
          </div>

          {/* 3. Body Proportion */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 flex items-center gap-1.5">
              <Shirt className="w-4 h-4 text-indigo-500" />
              สัดส่วนเสื้อผ้า (Proportions):
            </label>
            <select
              value={bodyProportion}
              onChange={(e) => setBodyProportion(e.target.value as BodyProportion)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 font-medium focus:outline-hidden"
            >
              <option value="Hourglass">สัดส่วนแนวสมดุล (Hourglass)</option>
              <option value="Straight">สัดส่วนแนวตรงเพรียว (Straight)</option>
              <option value="Triangle">สัดส่วนฐานสมดุล (Triangle)</option>
              <option value="Inverted Triangle">สัดส่วนช่วงบนเด่น (Inverted Triangle)</option>
              <option value="Rectangle">สัดส่วนทรงตรงเพรียว (Rectangle)</option>
              <option value="Custom / Not sure">Custom / ไม่ระบุ (ความสบายมั่นใจ)</option>
            </select>
          </div>

          {/* 4. Occasion */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" />
              โอกาสที่จะไป (Occasion):
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 font-medium focus:outline-hidden"
            >
              {occasionsList.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Festival or Season */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-500" />
              เทศกาล / ฤดูกาล (Festival):
            </label>
            <select
              value={festival}
              onChange={(e) => setFestival(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-[#FAF9F6] text-neutral-800 font-medium focus:outline-hidden"
            >
              {festivalsList.map((fest) => (
                <option key={fest} value={fest}>
                  {fest}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Style Preference */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-500" />
              สไตล์หลัก:
            </label>
            <div className="p-2 bg-[#FAF9F6] rounded-xl border border-neutral-200 text-neutral-800 font-semibold truncate">
              {selectedStyles.join(', ') || 'Korean, Minimal'}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>กำลังสังเคราะห์ Complete Look ด้วย AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>✨ Generate My Look ทันที</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Complete Look Result Display */}
      {generatedLook && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xl space-y-8 animate-in fade-in duration-300">
          {/* Look Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  ✨ COMPLETE LOOK RESULT
                </span>
                <span className="text-xs text-neutral-500">{generatedLook.vibe}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-2">
                {generatedLook.lookTitle}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                {generatedLook.concept}
              </p>
            </div>

            <button
              onClick={handleSaveLook}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกเรียบร้อย!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>บันทึกลุคนี้ (Save Look)</span>
                </>
              )}
            </button>
          </div>

          {/* Color Palette Row */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <span className="text-xs font-bold text-neutral-900">
              🎨 Color Palette · คู่สีที่ใช้ในลุคนี้:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {generatedLook.palette.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-neutral-200/80">
                  <span
                    className="w-6 h-6 rounded-lg border border-white shadow-xs shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{c.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Breakdown 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Col 1: Outfit Items */}
            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-150 space-y-3">
              <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2 pb-2 border-b border-neutral-200">
                <Shirt className="w-4 h-4 text-indigo-600" />
                <span>ชุดเสื้อผ้า (Outfit & Shoes)</span>
              </h4>
              <div className="space-y-2 text-xs text-neutral-700">
                <p><strong>👕 เสื้อ (Top):</strong> {generatedLook.outfit.top}</p>
                <p><strong>👖 ท่อนล่าง (Bottom):</strong> {generatedLook.outfit.bottom}</p>
                {generatedLook.outfit.outerwear && (
                  <p><strong>🧥 เสื้อคลุม:</strong> {generatedLook.outfit.outerwear}</p>
                )}
                <p><strong>👟 รองเท้า:</strong> {generatedLook.outfit.shoes}</p>
                <p><strong>👜 กระเป๋า:</strong> {generatedLook.outfit.bag}</p>
              </div>

              {generatedLook.outfit.accessories && generatedLook.outfit.accessories.length > 0 && (
                <div className="pt-2 border-t border-neutral-200 text-xs text-neutral-600">
                  <strong>💍 เครื่องประดับ:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    {generatedLook.outfit.accessories.map((acc, idx) => (
                      <li key={idx}>{acc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Col 2: Hair & Grooming */}
            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-150 space-y-3">
              <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2 pb-2 border-b border-neutral-200">
                <Scissors className="w-4 h-4 text-amber-600" />
                <span>ทรงผม (Hairstyle)</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <h5 className="font-bold text-neutral-900">{generatedLook.hairstyle.name}</h5>
                  <p className="text-[11px] text-neutral-500">{generatedLook.hairstyle.nameEn}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-neutral-100">
                  <strong>การจัดเซ็ต: </strong>
                  <span className="text-neutral-700">{generatedLook.hairstyle.styling}</span>
                </div>
                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-amber-900">
                  <strong>เหตุผลที่รับกับรูปหน้า: </strong>
                  <span>{generatedLook.hairstyle.whyItFitsFace}</span>
                </div>
              </div>
            </div>

            {/* Col 3: Makeup Direction */}
            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-150 space-y-3">
              <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2 pb-2 border-b border-neutral-200">
                <Palette className="w-4 h-4 text-rose-600" />
                <span>เมคอัพ (Makeup & Skin)</span>
              </h4>
              <div className="space-y-1.5 text-xs text-neutral-700">
                <p><strong>สไตล์:</strong> {generatedLook.makeup.style}</p>
                <p><strong>🧴 งานผิว:</strong> {generatedLook.makeup.foundation}</p>
                <p><strong>🌸 บลัชออน:</strong> {generatedLook.makeup.blush}</p>
                <p><strong>💄 ริมฝีปาก:</strong> {generatedLook.makeup.lip}</p>
                <p><strong>✨ เปลือกตา:</strong> {generatedLook.makeup.eyes}</p>
                <div className="mt-2 p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 text-rose-950 text-[11px]">
                  💡 <strong>ทิปส์:</strong> {generatedLook.makeup.tip}
                </div>
              </div>
            </div>
          </div>

          {/* Why It Works & Practical Tips (Crucial Requirement) */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3 text-xs">
            <div>
              <span className="font-bold text-emerald-950 text-sm">
                ทำไมแต่ละองค์ประกอบจึงเข้ากัน (Why It Works):
              </span>
              <p className="text-emerald-900 mt-1 leading-relaxed">
                {generatedLook.whyItWorks}
              </p>
            </div>
            {generatedLook.practicalTips && (
              <div className="pt-2 border-t border-emerald-200 text-emerald-800">
                <strong>คำแนะนำการสวมใส่จริง:</strong> {generatedLook.practicalTips}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
