import React from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20 pb-20 sm:pb-8 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 p-[1.5px]">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                </div>
              </div>
              <span className="text-lg font-bold text-neutral-900">StyleMatch AI</span>
            </div>
            <p className="text-sm text-neutral-600 max-w-md leading-relaxed">
              ระบบผู้ช่วยวิเคราะห์สไตล์ส่วนตัวด้วย AI ให้คำแนะนำโทนสีผิว รูปหน้า ทรงผม เมคอัพ
              และชุดเสื้อผ้าอย่างเข้าใจ ให้คุณมั่นใจและเปล่งประกายในแบบที่เป็นตัวเอง
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>ภาพถ่ายของคุณปลอดภัยและไม่ถูกเปิดเผยต่อสาธารณะ</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-900 tracking-wider">
              สำรวจสไตล์ (EXPLORE)
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600">
              <li>
                <button
                  onClick={() => navigate('/analyze')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  วิเคราะห์โทนสีผิวและรูปหน้า
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/makeup')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  โทนสีเมคอัพพาเลตต์
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/hairstyle')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  ทรงผมตามรูปหน้า
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/occasion')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  แต่งตัวตามโอกาส
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/festival')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  ชุดตามเทศกาล & ฤดูกาล
                </button>
              </li>
            </ul>
          </div>

          {/* About & Ethics */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-900 tracking-wider">
              เกี่ยวกับระบบ (SYSTEM)
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  เกี่ยวกับ StyleMatch AI & จริยธรรม
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/profile')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  ความเป็นส่วนตัวและการลบข้อมูล
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-neutral-900 cursor-pointer"
                >
                  แดชบอร์ดผู้ดูแล (Admin)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="bg-neutral-50/70 rounded-xl p-4 text-xs text-neutral-600 leading-relaxed border border-neutral-100 flex items-start gap-3">
            <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-800">คำชี้แจงความเป็นกลาง (Neutrality Disclaimer): </span>
              ผลลัพธ์จาก AI เป็นคำแนะนำทั่วไปด้านการจับคู่สี ทรงเสื้อผ้า และการจัดแต่งเพื่อเป็นแนวทางสำรวจสไตล์เท่านั้น
              ไม่ใช่การวินิจฉัย การตัดสินคุณค่า หรือการส่งเสริมมาตรฐานรูปร่างแบบใดแบบหนึ่ง ผู้ใช้สามารถเลือกสไตล์และแต่งกายได้อย่างอิสระตามความพึงพอใจของตนเอง
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-xs text-neutral-600 gap-2">
            <p>© {new Date().getFullYear()} StyleMatch AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>สร้างด้วยความใส่ใจและเคารพทุกความหลากหลาย</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
