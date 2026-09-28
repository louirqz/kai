import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Heart,
  Ghost,
  Gift,
  Moon,
  Award,
  Flag,
  Sun,
  CloudSnow,
  CloudRain,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FestivalItem } from '../types/style';

interface FestivalPageProps {
  navigate: (path: string) => void;
}

const FESTIVAL_ICON_MAP: Record<string, any> = {
  Droplets,
  Sparkles,
  Heart,
  Ghost,
  Gift,
  Moon,
  Award,
  Flag,
  Sun,
  CloudSnow,
  CloudRain,
  Sparkle: Sparkles,
};

export const FestivalPage: React.FC<FestivalPageProps> = ({ navigate }) => {
  const { festivalList, latestAnalysis } = useAuth();
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem>(festivalList[0]);

  const IconComp = FESTIVAL_ICON_MAP[selectedFestival.icon] || Sparkles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Festival & Seasonal Style</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2">
            ไอเดียชุดตามเทศกาลและฤดูกาล
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            ค้นหาแนวทางการแต่งกายที่เข้ากับบรรยากาศเฉลิมฉลอง เทศกาลแห่งความสุข และสภาพอากาศในแต่ละช่วงเวลาของปี
          </p>
        </div>
      </div>

      {/* Festival Selector Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          เลือกเทศกาลหรือฤดูกาล (SELECT FESTIVAL)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {festivalList.map((fest) => {
            const isSelected = selectedFestival.id === fest.id;
            const CardIcon = FESTIVAL_ICON_MAP[fest.icon] || Sparkles;
            return (
              <button
                key={fest.id}
                onClick={() => setSelectedFestival(fest)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/10 text-amber-300' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <CardIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold truncate">{fest.nameTh}</p>
                  <p
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {fest.dateOrSeason}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Festival Presentation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shadow-xs">
              <IconComp className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full">
                  {selectedFestival.dateOrSeason}
                </span>
                <span className="text-xs text-neutral-500">({selectedFestival.nameEn})</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mt-1">
                {selectedFestival.nameTh}
              </h2>
            </div>
          </div>

          <button
            onClick={() =>
              navigate(
                `/generate-look?festival=${encodeURIComponent(selectedFestival.nameTh)}&skin=${
                  latestAnalysis?.skinTone || 'Warm'
                }`
              )
            }
            className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ สร้างลุคสำหรับ {selectedFestival.nameTh}</span>
          </button>
        </div>

        {/* Vibe & Concept */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-neutral-900 text-xs">บรรยากาศและธีม (Vibe & Theme):</span>
            <p className="text-xs text-neutral-700 leading-relaxed">{selectedFestival.vibe}</p>
          </div>
        </div>

        {/* Festival Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Recommended Colors */}
          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-150 space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              โทนสีแนะนำประจำเทศกาล:
            </h4>
            <div className="space-y-2">
              {selectedFestival.recommendedColors.map((color, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-neutral-100">
                  <span
                    className="w-5 h-5 rounded-full border border-white shadow-xs shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{color.name}</p>
                    <p className="text-[10px] font-mono text-neutral-400">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Outfit Ideas */}
          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-150 space-y-3 md:col-span-2">
            <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              ไอเดียการจัดเซ็ตชุด (Outfit Ideas):
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed bg-white p-4 rounded-xl border border-neutral-100">
              {selectedFestival.outfitIdeas}
            </p>

            <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              เคล็ดลับทรงผมและเมคอัพ (Hair & Makeup Tips):
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed bg-white p-4 rounded-xl border border-neutral-100">
              {selectedFestival.hairAndMakeupTips}
            </p>
          </div>
        </div>

        {/* Footer Styles */}
        <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500">สไตล์ที่เข้ากัน:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedFestival.recommendedStyles.map((sty) => (
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
                `/generate-look?festival=${encodeURIComponent(selectedFestival.nameTh)}&skin=${
                  latestAnalysis?.skinTone || 'Warm'
                }`
              )
            }
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <span>รับ Complete Look ประจำเทศกาลนี้</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
