import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Scissors,
  Shirt,
  Bookmark,
  Share2,
  RefreshCw,
  Trash2,
  ChevronRight,
  Info,
  Check,
  CheckCircle2,
  Eye,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AnalysisResultPageProps {
  navigate: (path: string) => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({ navigate }) => {
  const { latestAnalysis, deleteUploadedPhoto, updateProfile, currentUser } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (!latestAnalysis) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-800">ยังไม่มีผลการวิเคราะห์สไตล์</h2>
        <p className="text-xs text-neutral-500">
          กรุณาอัปโหลดรูปภาพหรือทำแบบสำรวจสั้นๆ เพื่อให้ AI ประมวลผลและสร้างคำแนะนำเฉพาะบุคคลของคุณ
        </p>
        <button
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>ไปที่หน้าวิเคราะห์สไตล์</span>
        </button>
      </div>
    );
  }

  const handleSaveToProfile = () => {
    updateProfile({
      skinTone: latestAnalysis.skinTone,
      faceShape: latestAnalysis.faceShape,
      bodyProportion: latestAnalysis.bodyProportion,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              วิเคราะห์สำเร็จแล้ว ✨
            </span>
            <span className="text-xs text-neutral-600">
              เมื่อ {latestAnalysis.timestamp ? new Date(latestAnalysis.timestamp).toLocaleDateString('th-TH') : 'วันนี้'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Your Style Result · ผลวิเคราะห์สไตล์เฉพาะบุคคล
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            สรุปข้อมูลโทนสี โครงหน้า และแนวทางเสื้อผ้าที่ช่วยขับเน้นจุดเด่นของคุณอย่างเป็นธรรมชาติ
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/analyze')}
            className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs flex items-center gap-1.5 cursor-pointer"
            title="วิเคราะห์ใหม่อีกครั้ง"
          >
            <RefreshCw className="w-4 h-4 text-neutral-600" />
            <span className="hidden sm:inline">วิเคราะห์ใหม่</span>
          </button>

          {latestAnalysis.uploadedPhotoUrl && (
            <button
              onClick={deleteUploadedPhoto}
              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-red-50 text-neutral-600 hover:text-red-600 text-xs flex items-center gap-1.5 cursor-pointer"
              title="ลบรูปภาพที่อัปโหลดเพื่อความเป็นส่วนตัว"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">ลบรูปภาพ</span>
            </button>
          )}

          <button
            onClick={handleSaveToProfile}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
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
                <span>บันทึกลงโปรไฟล์</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Highlight Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50/60 to-amber-50/60 border border-rose-200/80 shadow-xs flex flex-col md:flex-row items-center gap-6">
        {latestAnalysis.uploadedPhotoUrl && (
          <img
            src={latestAnalysis.uploadedPhotoUrl}
            alt="Your portrait"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border-2 border-white shadow-md ring-1 ring-rose-200"
          />
        )}
        <div className="space-y-2 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-neutral-900 shadow-xs">
              {latestAnalysis.skinToneThai}
            </span>
            <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-neutral-900 shadow-xs">
              {latestAnalysis.faceShapeThai}
            </span>
            <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-neutral-900 shadow-xs">
              {latestAnalysis.bodyProportionThai}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
            {latestAnalysis.overallSummary}
          </p>
        </div>

        {/* Big CTA to Generate Complete Look */}
        <div className="shrink-0 w-full md:w-auto">
          <button
            onClick={() =>
              navigate(
                `/generate-look?skin=${latestAnalysis.skinTone}&face=${latestAnalysis.faceShape}&body=${encodeURIComponent(
                  latestAnalysis.bodyProportion
                )}`
              )
            }
            className="w-full px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ Generate My Complete Look</span>
          </button>
        </div>
      </div>

      {/* RESULT SECTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CARD 1: Skin Tone Result */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Skin Tone Result</h3>
                  <p className="text-[11px] text-neutral-600">การวิเคราะห์โทนสีผิวและอันเดอร์โทน</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-rose-600">
                {latestAnalysis.skinTone} Tone
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-neutral-800">{latestAnalysis.skinToneThai}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {latestAnalysis.undertoneDescription}
              </p>
            </div>

            {/* Best Colors */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                สีที่เหมาะ ขับผิวให้ดูผ่องเปล่งประกาย (Best Colors):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {latestAnalysis.bestColors.map((hex, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-200">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[10px] font-mono text-neutral-600">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Try Colors */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                สีที่ควรลอง เพื่อเปลี่ยนบรรยากาศ (Complimentary Shades):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {latestAnalysis.tryColors.map((hex, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-200">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[10px] font-mono text-neutral-600">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contrast Colors */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                สีที่สร้างคอนทราสต์ชัดเจน (Contrast Colors):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {latestAnalysis.contrastColors.map((hex, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-200">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[10px] font-mono text-neutral-600">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex justify-end">
            <button
              onClick={() => navigate('/makeup')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>สำรวจเมคอัพที่เข้ากับโทนนี้</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 2: Your Face Shape & Hairstyle */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Your Face Shape</h3>
                  <p className="text-[11px] text-neutral-600">รูปหน้าและทรงผมที่ส่งเสริมกรอบหน้า</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-700">
                {latestAnalysis.faceShape}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-neutral-800">
                รูปหน้าของคุณมีลักษณะใกล้เคียงกับ: {latestAnalysis.faceShapeThai}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {latestAnalysis.faceShapeDescription}
              </p>
            </div>

            {/* Recommended Hairstyles */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-700">
                ทรงผมและการจัดทรงที่แนะนำ (Hairstyle Recommendations):
              </span>
              <div className="space-y-2">
                {latestAnalysis.recommendedHairstyles.map((hair, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">{hair.name}</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        {hair.vibe}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1">{hair.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex justify-end">
            <button
              onClick={() => navigate('/hairstyle')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>ดูแกลเลอรีทรงผมทั้งหมด</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 3: Makeup Recommendations Palette */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Your Makeup Palette</h3>
                  <p className="text-[11px] text-neutral-600">คำแนะนำสีลิป บลัชออน อายแชโดว์ และรองพื้น</p>
                </div>
              </div>
            </div>

            {/* Foundation Testing Advice */}
            <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs space-y-1">
              <span className="font-bold text-rose-950">Foundation · เฉดรองพื้นแนะนำสำหรับทดสอบ:</span>
              <p className="text-rose-900 text-[11px] leading-relaxed">
                {latestAnalysis.makeupAdvice.foundationShadeTips}
              </p>
            </div>

            {/* Blush & Lip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-1.5">
                <span className="font-bold text-neutral-900">Blush (แก้ม):</span>
                <div className="flex flex-wrap gap-1">
                  {latestAnalysis.makeupAdvice.blushShades.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-neutral-200 rounded-md text-[10px] text-neutral-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-1.5">
                <span className="font-bold text-neutral-900">Lipstick (ริมฝีปาก):</span>
                <div className="flex flex-wrap gap-1">
                  {latestAnalysis.makeupAdvice.lipShades.map((l, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-neutral-200 rounded-md text-[10px] text-neutral-700">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Eyeshadow */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-1.5 text-xs">
              <span className="font-bold text-neutral-900">Eyeshadow Palette (ตา):</span>
              <div className="flex flex-wrap gap-1.5">
                {latestAnalysis.makeupAdvice.eyeshadowPalette.map((e, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[10px] text-neutral-700 font-medium">
                    ✨ {e}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex justify-end">
            <button
              onClick={() => navigate('/makeup')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>เปิดสตูดิโอแต่งหน้า</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 4: Style & Body Silhouette Guidelines */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Style Recommendation</h3>
                  <p className="text-[11px] text-neutral-600">สัดส่วนเสื้อผ้าและการจับคู่เพื่อความสมดุล</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                {latestAnalysis.bodyProportion}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-neutral-800">
                แนวทางโครงสร้างชุด: {latestAnalysis.bodyProportionThai}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {latestAnalysis.clothingRecommendations.silhouetteTips}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="font-bold text-neutral-900">เสื้อ (Tops): </span>
                <span className="text-neutral-700">{latestAnalysis.clothingRecommendations.tops}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="font-bold text-neutral-900">กางเกง / กระโปรง (Bottoms): </span>
                <span className="text-neutral-700">{latestAnalysis.clothingRecommendations.bottoms}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="font-bold text-neutral-900">เสื้อคลุม & เลเยอร์ (Layering): </span>
                <span className="text-neutral-700">{latestAnalysis.clothingRecommendations.layering}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex justify-end">
            <button
              onClick={() => navigate('/outfits')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>ดูแคตตาล็อกชุดเสื้อผ้า</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sticky-like Call To Action to Generate Complete Look */}
      <div className="p-8 rounded-3xl bg-neutral-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl text-center sm:text-left">
          <h3 className="text-xl font-bold">พร้อมสร้าง Complete Look เฉพาะบุคคลของคุณหรือยัง?</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            เลือกโอกาส เช่น ไปคาเฟ่ ไปงานแต่ง หรือเลือกเทศกาลที่คุณกำลังจะไป แล้วให้ AI ประมวลผลลุคแบบเต็มตัว
            (ตั้งแต่เมคอัพ ทรงผม เสื้อ กางเกง รองเท้า จนถึงเครื่องประดับ)
          </p>
        </div>
        <button
          onClick={() =>
            navigate(
              `/generate-look?skin=${latestAnalysis.skinTone}&face=${latestAnalysis.faceShape}&body=${encodeURIComponent(
                latestAnalysis.bodyProportion
              )}`
            )
          }
          className="px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 text-white font-bold text-sm hover:opacity-95 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>ไปที่ AI Look Generator →</span>
        </button>
      </div>
    </div>
  );
};
