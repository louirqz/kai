import React from 'react';
import {
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  Palette,
  Scissors,
  Shirt,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { latestAnalysis } = useAuth();

  const previewCategories = [
    {
      id: 'makeup',
      title: '💄 Makeup Palette',
      subtitle: 'เมคอัพที่เข้ากับอันเดอร์โทน',
      desc: 'แนะนำเฉดสีลิป บลัชออน อายแชโดว์ และทิศทางรองพื้นที่กลมกลืนกับผิวของคุณ',
      path: '/makeup',
      badge: '25+ เฉดสี',
      color: 'from-rose-500/10 to-pink-500/10 border-rose-200/60',
    },
    {
      id: 'hairstyle',
      title: '💇 Hairstyle',
      subtitle: 'ทรงผมตามรูปหน้า',
      desc: 'วิเคราะห์โครงหน้า Oval, Round, Square, Heart แนะนำทรงผมเสริมกรอบหน้าอย่างมั่นใจ',
      path: '/hairstyle',
      badge: '20+ สไตล์ทรงผม',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-200/60',
    },
    {
      id: 'fashion',
      title: '👕 Fashion & Silhouettes',
      subtitle: 'การแต่งตัวและสัดส่วน',
      desc: 'แนะนำทรงเสื้อ กางเกง กระโปรง และการเลเยอร์เพื่อสร้างสมดุลแบบไม่ตัดสินรูปร่าง',
      path: '/outfits',
      badge: '30+ เซ็ตการแต่งตัว',
      color: 'from-indigo-500/10 to-blue-500/10 border-indigo-200/60',
    },
    {
      id: 'color',
      title: '🎨 Color Analysis',
      subtitle: 'วิเคราะห์สีผิวบุคคล',
      desc: 'จำแนก Cool Tone, Warm Tone, Neutral Tone พร้อมคู่สีที่ขับผิวและสีคอนทราสต์',
      path: '/analyze',
      badge: 'Personal Color',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/60',
    },
    {
      id: 'events',
      title: '🎉 Events & Occasions',
      subtitle: 'ชุดตามโอกาส & เทศกาล',
      desc: 'ไปคาเฟ่ เดต สัมภาษณ์งาน งานแต่ง หรือเทศกาลสงกรานต์ ปีใหม่ คริสต์มาส',
      path: '/occasion',
      badge: '25+ โอกาสและเทศกาล',
      color: 'from-purple-500/10 to-violet-500/10 border-purple-200/60',
    },
    {
      id: 'personal',
      title: '✨ Personal Style',
      subtitle: 'AI Style Generator',
      desc: 'ผสานข้อมูลทั้งหมดของคุณ เพื่อสร้าง Complete Look เฉพาะบุคคลพร้อมเหตุผล',
      path: '/generate-look',
      badge: 'Custom Match',
      color: 'from-rose-500/10 to-amber-500/10 border-rose-200/60',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-14 pb-8 overflow-hidden">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-rose-100/70 via-amber-50/50 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 space-y-6">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-semibold text-neutral-800">
              StyleMatch AI · ระบบผู้ช่วยวิเคราะห์สไตล์ส่วนตัว
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
            ค้นหาสไตล์ที่เหมาะกับคุณ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
              ด้วยพลังแห่ง AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
            อัปโหลดรูปภาพหรือตอบคำถามสั้นๆ ให้ AI ช่วยวิเคราะห์โทนสีผิว รูปหน้า
            และสัดส่วนทั่วไป เพื่อแนะนำเมคอัพ ทรงผม และชุดแต่งตัวที่เข้ากันในทุกสถานการณ์
          </p>

          {/* Action Buttons Row (per user prompt) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Primary 1: เริ่มวิเคราะห์สไตล์ */}
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>เริ่มวิเคราะห์สไตล์</span>
            </button>

            {/* Primary 2: วิเคราะห์จากรูปภาพ */}
            <button
              onClick={() => navigate('/analyze?mode=photo')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-neutral-800 bg-white hover:bg-neutral-50 active:scale-95 border border-neutral-200/90 rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-rose-500" />
              <span>วิเคราะห์จากรูปภาพ</span>
            </button>

            {/* Primary 3: เลือกสไตล์ด้วยตัวเอง */}
            <button
              onClick={() => navigate('/style')}
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/70 rounded-2xl transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-neutral-500" />
              <span>เลือกสไตล์ด้วยตัวเอง</span>
            </button>

            {/* Primary 4: ดูคำแนะนำทั้งหมด */}
            <button
              onClick={() => navigate('/outfits')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              <span>ดูคำแนะนำทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Previous Analysis Alert Banner (if user already ran analysis) */}
          {latestAnalysis && (
            <div className="pt-4 max-w-lg mx-auto">
              <div
                onClick={() => navigate('/analysis-result')}
                className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/70 flex items-center justify-between text-left cursor-pointer hover:bg-rose-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-950">
                      คุณมีผลวิเคราะห์ล่าสุด: {latestAnalysis.skinToneThai} · {latestAnalysis.faceShapeThai}
                    </p>
                    <p className="text-[11px] text-rose-800">แตะเพื่อเปิดผลวิเคราะห์และพาเลตต์ของคุณ</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </div>
            </div>
          )}

          {/* Neutrality & Privacy Micro Guarantee */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ปลอดภัย ไม่เปิดเผยรูปภาพ
            </span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              เน้นความมั่นใจ ไม่ตัดสินรูปร่าง
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              ขับเคลื่อนด้วยทฤษฎี Personal Color
            </span>
          </div>
        </div>
      </section>

      {/* Preview Categories Section (6 Cards per user request) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              สำรวจหมวดหมู่การวิเคราะห์สไตล์
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              ครอบคลุมทุกมิติตั้งแต่งานผิว ทรงผม เสื้อผ้า และโอกาสสำคัญ
            </p>
          </div>
          <button
            onClick={() => navigate('/generate-look')}
            className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>✨ เปิด AI Style Generator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {previewCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(cat.path)}
              className={`p-6 rounded-3xl bg-white border ${cat.color} hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-lg font-bold text-neutral-900 group-hover:text-rose-600 transition-colors">
                    {cat.title}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
                    {cat.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-700 mb-1">{cat.subtitle}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">{cat.desc}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-800 group-hover:text-rose-600">
                <span>เริ่มสำรวจหมวดนี้</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Feature Showcase: How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
              3 STEPS TO YOUR SIGNATURE STYLE
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
              ค้นพบสไตล์ที่สร้างสรรค์มาเพื่อคุณโดยเฉพาะ
            </h3>
            <p className="text-neutral-300 text-sm mt-2 leading-relaxed">
              ไม่จำเป็นต้องตามเทรนด์จนเหนื่อย AI จะช่วยค้นหาโทนสีและรูปทรงที่ดึงความโดดเด่นตามธรรมชาติของคุณออกมาอย่างงดงาม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="text-base font-semibold text-white">วิเคราะห์สีผิว & รูปหน้า</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                อัปโหลดภาพใบหน้าหรือตอบคำถาม 4 ข้อ เพื่อหาโทนสีผิว Cool / Warm / Neutral และรูปทรงใบหน้าที่แท้จริง
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="text-base font-semibold text-white">เลือกสไตล์ & บรรยากาศ</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                ผสมผสานสไตล์ที่คุณชอบ เช่น Korean, Minimal, Street เข้ากับโอกาส เช่น ไปคาเฟ่ ไปสัมภาษณ์ หรือออกเดต
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="text-base font-semibold text-white">รับ Complete Look ทันที</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                รับการจับคู่เสื้อ กางเกง รองเท้า เมคอัพ ทรงผม พร้อมคำอธิบายเหตุผลด้านความกลมกลืน และบันทึกลงโปรไฟล์ได้
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-neutral-300">
                รองรับทั้งสมาร์ตโฟน แท็บเล็ต และคอมพิวเตอร์ ใช้งานง่าย สะดวกรวดเร็ว
              </span>
            </div>
            <button
              onClick={() => navigate('/analyze')}
              className="px-6 py-3 rounded-xl bg-white text-neutral-900 font-semibold text-xs sm:text-sm hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              เริ่มต้นใช้งานฟรีทันที →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
