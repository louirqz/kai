import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Coffee,
  Compass,
  ShoppingBag,
  Heart,
  Briefcase,
  BookOpen,
  GraduationCap,
  Cake,
  Activity,
  Award,
  Users,
  Home,
  Music,
  Sun,
  Feather,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OccasionItem } from '../types/style';

interface OccasionPageProps {
  navigate: (path: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Coffee,
  Compass,
  ShoppingBag,
  Heart,
  Briefcase,
  Sparkles,
  BookOpen,
  GraduationCap,
  Cake,
  Activity,
  Award,
  Users,
  Home,
  Music,
  Sun,
  Feather,
};

export const OccasionPage: React.FC<OccasionPageProps> = ({ navigate }) => {
  const { occasionList, latestAnalysis } = useAuth();
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionItem>(occasionList[0]);

  const IconComp = ICON_MAP[selectedOccasion.icon] || Calendar;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Outfit for Occasion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2">
            แนะนำชุดและการแต่งตัวตามโอกาส
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            เลือกโอกาสหรือสถานที่ที่คุณจะไป เพื่อรับคำแนะนำการจับคู่ชุด ทรงผม เมคอัพ
            และโทนสีที่เหมาะสมกับบรรยากาศ
          </p>
        </div>
      </div>

      {/* Occasion Selection Cards Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          เลือกโอกาสหรือสถานที่ (SELECT OCCASION)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {occasionList.map((occ) => {
            const isSelected = selectedOccasion.id === occ.id;
            const CardIcon = ICON_MAP[occ.icon] || Calendar;
            return (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(occ)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md scale-102'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/10 text-amber-300' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <CardIcon className="w-5 h-5" />
                </div>
                <div className="w-full truncate">
                  <p className="text-xs font-bold truncate">{occ.nameTh}</p>
                  <p
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-600'
                    }`}
                  >
                    {occ.nameEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Occasion Detailed Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <IconComp className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  คำแนะนำเฉพาะสำหรับ: {selectedOccasion.nameTh}
                </span>
                <span className="text-xs text-neutral-600">({selectedOccasion.nameEn})</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mt-1">
                {selectedOccasion.nameTh}
              </h2>
            </div>
          </div>

          <button
            onClick={() =>
              navigate(
                `/generate-look?occasion=${encodeURIComponent(selectedOccasion.nameTh)}&skin=${
                  latestAnalysis?.skinTone || 'Warm'
                }`
              )
            }
            className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ สร้างลุคสำหรับ {selectedOccasion.nameTh}</span>
          </button>
        </div>

        {/* Occasion Concept */}
        <p className="text-sm text-neutral-700 leading-relaxed font-normal">
          {selectedOccasion.description}
        </p>

        {/* The 8 Recommendation Facets (per user request) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 1. เสื้อ */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">👕 1. เสื้อ (Top):</span>
            <p className="text-neutral-700 leading-relaxed">
              เน้นความคล่องตัว สบาย และเข้ากับสภาพอากาศ เช่น เชิ้ตลินินคอจีน, เสื้อยืด Boxy ทรงสะอาด, หรือเบลาส์แขนกุด
            </p>
          </div>

          {/* 2. กางเกง/กระโปรง */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">👖 2. กางเกง/กระโปรง (Bottom):</span>
            <p className="text-neutral-700 leading-relaxed">
              กางเกงสแล็คขากว้างเอวสูง (Wide-Leg), ยีนส์สีเดนิมฟอกตรง หรือกระโปรงพลีทยาวพริ้วไหว
            </p>
          </div>

          {/* 3. รองเท้า */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">👟 3. รองเท้า (Shoes):</span>
            <p className="text-neutral-700 leading-relaxed">
              รองเท้าโลฟเฟอร์หนังนิ่ม, สนีกเกอร์คลีนสีขาว, หรือรองเท้าแมรี่เจนส้นเตี้ยสำหรับเดินสบาย
            </p>
          </div>

          {/* 4. เครื่องประดับ */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">💍 4. เครื่องประดับ (Accessories):</span>
            <p className="text-neutral-700 leading-relaxed">
              สร้อยคอเส้นบางมินิมอล, แว่นตากันแดดทรงคลาสสิก, นาฬิกาข้อมือสายหนัง และต่างหูห่วงเล็ก
            </p>
          </div>

          {/* 5. กระเป๋า */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">👜 5. กระเป๋า (Bag):</span>
            <p className="text-neutral-700 leading-relaxed">
              กระเป๋าสะพายไหล่หนังเรียบ (Shoulder Bag) หรือกระเป๋าโท้ทผ้าแคนวาสคัตติ้งเนี้ยบ
            </p>
          </div>

          {/* 6. สีของชุด */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">🎨 6. สีของชุด (Color Palette):</span>
            <div className="flex items-center gap-1.5 pt-1">
              {selectedOccasion.recommendedColors.map((hex, i) => (
                <span
                  key={i}
                  className="w-5 h-5 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
            <p className="text-[11px] text-neutral-600 mt-1">โทนสีสอดคล้องกับแสงและบรรยากาศสถานที่</p>
          </div>

          {/* 7. ทรงผม */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">💇 7. ทรงผม (Hairstyle):</span>
            <p className="text-neutral-700 leading-relaxed">
              ผมดัดลอนคลายเบาๆ หรือรวบครึ่งศีรษะ (Half-up) ปล่อยปอยหวานข้างกรอบหน้าอย่างเป็นธรรมชาติ
            </p>
          </div>

          {/* 8. Makeup */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-xs">💄 8. เมคอัพ (Makeup):</span>
            <p className="text-neutral-700 leading-relaxed">
              งานผิวฉ่ำวาวบางเบา คุมมันเฉพาะจุด บลัชออนสีพีชหรือชมพูระเรื่อ และลิปทินท์เนื้อกลอสซี่
            </p>
          </div>
        </div>

        {/* Suggested Styles Tags */}
        <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500">สไตล์ที่แนะนำสำหรับโอกาสนี้:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedOccasion.suggestedStyles.map((sty) => (
                <span
                  key={sty}
                  className="px-2.5 py-1 bg-neutral-100 rounded-lg text-xs font-medium text-neutral-800"
                >
                  #{sty}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() =>
              navigate(
                `/generate-look?occasion=${encodeURIComponent(selectedOccasion.nameTh)}&skin=${
                  latestAnalysis?.skinTone || 'Warm'
                }`
              )
            }
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>รับ Complete Look ทันที</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
