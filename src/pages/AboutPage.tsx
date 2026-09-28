import React from 'react';
import {
  Sparkles,
  Heart,
  Shield,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About StyleMatch AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
          เกี่ยวกับ StyleMatch AI
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          ระบบผู้ช่วยวิเคราะห์สไตล์ส่วนตัวด้วย AI เพื่อช่วยให้ทุกคนค้นพบและมั่นใจในความงดงามและสไตล์ที่เป็นเอกลักษณ์ของตนเอง
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-300 text-sm font-bold">
          <Heart className="w-5 h-5 text-rose-400" />
          <span>ข้อความชี้แจงความเป็นกลางและจุดยืนทางจริยธรรม (Disclaimer):</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
          “ผลลัพธ์จาก AI เป็นคำแนะนำทั่วไป ไม่ใช่การวินิจฉัยหรือการประเมินคุณค่าของบุคคล และผู้ใช้สามารถเลือกแต่งตัวตามความชอบของตนเองได้”
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed pt-1">
          ระบบเน้นเฉพาะมิติด้านทรงเสื้อผ้า คู่สี และความกลมกลืนของการสวมใส่ โดยไม่มีการตัดสินว่ารูปร่างแบบใดดีหรือไม่ดี
          และไม่ส่งเสริมการลดน้ำหนักหรือมาตรฐานรูปร่างที่ไม่สมจริง
        </p>
      </div>

      {/* Core Philosophies (3 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-neutral-900">Personal Color Theory</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            อิงหลักวิทยาศาสตร์สี อันเดอร์โทนของผิว (Cool / Warm / Neutral) เพื่อแนะนำเฉดสีที่ช่วยขับประกายผิวตามธรรมชาติ
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-neutral-900">Silhouette Balance</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            สร้างความสมดุลด้วยทรงเสื้อผ้า ท่อนบนและท่อนล่าง การเลเยอร์ และการเล่นระดับความยาว เพื่อความสบายและมั่นใจ
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-neutral-900">Privacy First</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            รูปภาพของผู้ใช้ถือเป็นข้อมูลส่วนตัว ไม่มีการเผยแพร่ต่อสาธารณะ และผู้ใช้สามารถกดลบภาพหรือบัญชีได้ตลอดเวลา
          </p>
        </div>
      </div>

      {/* Technology Stack & Integration Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-neutral-900">สถาปัตยกรรมระบบ (System Architecture)</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          StyleMatch AI ได้รับการออกแบบตามมาตรฐาน Full-Stack Web Application ด้วย React, TypeScript, Tailwind CSS, Express
          และผสานพลังการวิเคราะห์รูปภาพและข้อความด้วย Google Gemini AI API บนฝั่ง Server พร้อมระบบจัดเก็บสถานะที่มีความยืดหยุ่นสูง
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-neutral-100 rounded-lg text-neutral-800 font-medium">React 19 & Vite</span>
          <span className="px-3 py-1 bg-neutral-100 rounded-lg text-neutral-800 font-medium">TypeScript</span>
          <span className="px-3 py-1 bg-neutral-100 rounded-lg text-neutral-800 font-medium">Tailwind CSS</span>
          <span className="px-3 py-1 bg-neutral-100 rounded-lg text-neutral-800 font-medium">@google/genai (Gemini 3.8 Flash)</span>
          <span className="px-3 py-1 bg-neutral-100 rounded-lg text-neutral-800 font-medium">Express Full-Stack Architecture</span>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>เริ่มค้นหาสไตล์ส่วนตัวของคุณ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
