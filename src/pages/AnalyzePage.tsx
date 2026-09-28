import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  validateImageClarity,
  analyzeImageWithAI,
  analyzeSkinToneFromQuiz,
  analyzeFaceShapeFromQuiz,
  analyzeBodyProportionFromQuiz,
  SkinQuizAnswers,
  FaceQuizAnswers,
  BodyQuizAnswers,
} from '../services/aiService';

interface AnalyzePageProps {
  navigate: (path: string) => void;
  defaultMode?: 'photo' | 'quiz';
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ navigate, defaultMode = 'photo' }) => {
  const { setLatestAnalysis } = useAuth();

  const [activeTab, setActiveTab] = useState<'photo' | 'quiz'>(defaultMode);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageWarning, setImageWarning] = useState<string | null>(null);
  const [isPrivacyNoticeAccepted, setIsPrivacyNoticeAccepted] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Questionnaire States
  const [skinAnswers, setSkinAnswers] = useState<SkinQuizAnswers>({
    overallHue: 'medium-honey',
    veinColor: 'green-olive',
    jewelryPreference: 'gold',
    sunReaction: 'tan-easily',
  });

  const [faceAnswers, setFaceAnswers] = useState<FaceQuizAnswers>({
    foreheadWidth: 'balanced',
    cheekboneProminence: 'high-broad',
    jawlineShape: 'curved-round',
    faceRatio: 'balanced-oval',
  });

  const [bodyAnswers, setBodyAnswers] = useState<BodyQuizAnswers>({
    shoulderHipRatio: 'balanced',
    waistDefinition: 'clearly-defined',
    silhouettePreference: 'layered-balanced',
  });

  // Handle Image Upload
  const handleImageFile = async (file: File) => {
    setImageWarning(null);
    const { isClear, warning, base64 } = await validateImageClarity(file);
    setSelectedImage(base64);
    if (!isClear && warning) {
      setImageWarning(warning);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Run Analysis Simulation with multi-step animation
  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Multi-step animated progress
    setTimeout(() => setAnalysisStep(2), 700);
    setTimeout(() => setAnalysisStep(3), 1500);

    try {
      if (activeTab === 'photo' && selectedImage) {
        const result = await analyzeImageWithAI(selectedImage, {
          skinTone: skinAnswers.veinColor === 'purple-blue' ? 'Cool' : 'Warm',
        });
        setTimeout(() => {
          setLatestAnalysis(result);
          setIsAnalyzing(false);
          navigate('/analysis-result');
        }, 2200);
      } else {
        // Calculate from quiz
        const skin = analyzeSkinToneFromQuiz(skinAnswers);
        const face = analyzeFaceShapeFromQuiz(faceAnswers);
        const body = analyzeBodyProportionFromQuiz(bodyAnswers);

        const syntheticResult = {
          canAnalyze: true,
          clarityWarning: null,
          skinTone: skin.skinTone,
          skinToneThai: skin.skinToneThai,
          undertoneDescription: skin.description,
          bestColors: skin.bestColors,
          tryColors: skin.tryColors,
          contrastColors: skin.contrastColors,
          faceShape: face.faceShape,
          faceShapeThai: face.faceShapeThai,
          faceShapeDescription: face.description,
          recommendedHairstyles: face.hairstyles,
          makeupAdvice: {
            foundationShadeTips:
              skin.skinTone === 'Cool'
                ? 'เลือกเฉดโทน Cool หรือ Neutral-Cool ที่มีเบสชมพูอ่อน หลีกเลี่ยงรองพื้นที่อมเหลืองเข้มเกินไป'
                : 'เลือกเฉดโทน Warm ที่มีเบสเหลืองนวลหรือโกลเด้น เพื่อขับผิวหน้าให้ดูผ่องเปล่งปลั่ง',
            blushShades:
              skin.skinTone === 'Cool'
                ? ['Baby Pink', 'Rose Mauve', 'Plum Pink']
                : ['Soft Peach', 'Warm Coral', 'Sun-kissed Apricot'],
            lipShades:
              skin.skinTone === 'Cool'
                ? ['Berry Rose', 'Cool Mauve', 'Cherry Red']
                : ['Coral Sun Velvet', 'MLBB Terracotta Brick', 'Soft Apricot Nude'],
            eyeshadowPalette:
              skin.skinTone === 'Cool'
                ? ['Mauve Lavender', 'Silver Taupe', 'Rose Champagne']
                : ['Golden Amber', 'Warm Copper', 'Champagne Shimmer'],
            makeupSummary: 'เลือกใช้คู่สีที่สอดคล้องกับอันเดอร์โทนเพื่อความเป็นธรรมชาติและความสดใส',
          },
          bodyProportion: body.bodyProportion,
          bodyProportionThai: body.bodyProportionThai,
          clothingRecommendations: body.recommendations,
          overallSummary:
            'จากการประมวลผลคำตอบ คุณมีคู่สีและสัดส่วนที่ชัดเจน เหมาะกับสไตล์หลากหลายที่เน้นความสมดุลและการจัดวางเลเยอร์อย่างมั่นใจ',
          timestamp: new Date().toISOString(),
        };

        setTimeout(() => {
          setLatestAnalysis(syntheticResult);
          setIsAnalyzing(false);
          navigate('/analysis-result');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Personal Style Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          วิเคราะห์สไตล์ส่วนตัวของคุณ
        </h1>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          เลือกวิธีที่คุณสะดวก เพื่อให้ AI วิเคราะห์โทนสีผิว รูปหน้า และโครงสร้างสัดส่วนทั่วไป
        </p>
      </div>

      {/* Tab Switcher: Method 1 vs Method 2 */}
      <div className="flex justify-center">
        <div className="bg-neutral-200/70 p-1.5 rounded-2xl flex items-center gap-1 w-full max-w-md">
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'photo'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Camera className="w-4 h-4 text-rose-500" />
            <span>วิธีที่ 1: อัปโหลดรูปภาพ</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>วิธีที่ 2: ตอบคำถามสั้น</span>
          </button>
        </div>
      </div>

      {/* Loading Modal Overlay when Analyzing */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200">
            {/* Animated Pulse Emblem */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-900">กำลังวิเคราะห์สไตล์ของคุณ...</h3>
              <p className="text-xs text-neutral-500">
                ระบบ AI กำลังประมวลผลข้อมูลและจำแนกคู่สีที่เหมาะสมที่สุด
              </p>
            </div>

            {/* Step Indicators */}
            <div className="space-y-3 text-left pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-3 text-xs">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    analysisStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  ✓
                </div>
                <span className={analysisStep >= 1 ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                  1. ตรวจจับแสง สีผิว และอันเดอร์โทน (Undertone)
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    analysisStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {analysisStep >= 2 ? '✓' : '2'}
                </div>
                <span className={analysisStep >= 2 ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                  2. วิเคราะห์โครงสร้างกรอบหน้าและทรงผมที่รับกัน
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    analysisStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {analysisStep >= 3 ? '✓' : '3'}
                </div>
                <span className={analysisStep >= 3 ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                  3. คัดสรรพาเลตต์เครื่องสำอางและซิลูเอทชุด
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* METHOD 1: UPLOAD PHOTO */}
      {activeTab === 'photo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          {/* Privacy Notice Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-emerald-900">
              <span className="font-semibold">นโยบายความเป็นส่วนตัวของรูปภาพ (Privacy Notice): </span>
              รูปภาพของคุณถือเป็นข้อมูลส่วนตัว ใช้เพื่อการประมวลผลวิเคราะห์สไตล์เฉพาะคุณเท่านั้น
              จะไม่ถูกเปิดเผยต่อสาธารณะหรือสมาชิกคนอื่น และคุณสามารถกดลบรูปภาพออกจากระบบได้ตลอดเวลา
            </div>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              selectedImage
                ? 'border-rose-400 bg-rose-50/20'
                : 'border-neutral-300 hover:border-rose-400 hover:bg-neutral-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
            />

            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-48 h-48 sm:w-60 sm:h-60 object-cover rounded-2xl mx-auto shadow-md border-2 border-white ring-1 ring-neutral-200"
                  />
                  <div className="absolute top-2 right-2 bg-neutral-900/80 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-xs">
                    แตะเพื่อเปลี่ยนรูป
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-800">
                    รูปภาพพร้อมสำหรับการวิเคราะห์
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    คลิกหรือลากรูปใหม่มาวางหากต้องการเปลี่ยน
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800">
                    ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่ออัปโหลด
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    รองรับไฟล์ JPG, PNG หรือภาพถ่ายจากกล้องมือถือ (หน้าตรง แสงธรรมชาติ แนะนำไม่สวมแว่นกันแดด)
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 cursor-pointer shadow-xs"
                >
                  เลือกรูปภาพจากเครื่อง
                </button>
              </div>
            )}
          </div>

          {/* Clarity Warning Alert */}
          {imageWarning && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">ข้อแนะนำคุณภาพรูปภาพ: </span>
                <span>{imageWarning}</span>
                <p className="text-amber-800 text-[11px] pt-1">
                  💡 คำแนะนำ: หากภาพไม่ชัด คุณสามารถลองอัปโหลดรูปใหม่ หรือเลือกแท็บ &quot;วิธีที่ 2: ตอบคำถามสั้น&quot; เพื่อความแม่นยำสูงเช่นกัน
                </p>
              </div>
            </div>
          )}

          {/* Tips for Best Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-neutral-600">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>ถ่ายในที่มีแสงธรรมชาติ ส่องสว่างทั่วใบหน้า</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>หน้าตรง เปิดให้เห็นหน้าผากและกรอบหน้า</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>เห็นแนวสีผิวบริเวณลำคอหรือข้อมือชัดเจน</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100">
            {selectedImage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setImageWarning(null);
                }}
                className="text-xs text-neutral-500 hover:text-red-600 cursor-pointer"
              >
                ลบรูปภาพนี้
              </button>
            )}
            <button
              onClick={startAnalysis}
              disabled={!selectedImage}
              className={`w-full sm:w-auto ml-auto px-8 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                selectedImage
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>เริ่มการวิเคราะห์สไตล์ด้วย AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* METHOD 2: QUESTIONNAIRE */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-8">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-900">
              แบบสำรวจวิเคราะห์สไตล์ (Style & Color Diagnostic)
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              ตอบคำถามตามความรู้สึกและลักษณะที่พบเห็นบ่อยที่สุด เพื่อให้ AI สรุปโทนสีผิวและโครงสร้างสไตล์ของคุณ
            </p>
          </div>

          {/* Section 1: Skin Tone Questions */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs">
                1
              </span>
              <span>วิเคราะห์อันเดอร์โทนและสีผิว (Skin Undertone)</span>
            </div>

            {/* Q1: Vein Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800">
                1.1 สีเส้นเลือดบริเวณข้อมือในแสงธรรมชาติของคุณเห็นเด่นเป็นสีอะไร?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    val: 'purple-blue',
                    title: 'สีม่วง หรือ น้ำเงินชัดเจน',
                    desc: 'โน้มเอียงไปทาง Cool Tone',
                  },
                  {
                    val: 'green-olive',
                    title: 'สีเขียว หรือ เขียวมะกอก',
                    desc: 'โน้มเอียงไปทาง Warm Tone',
                  },
                  {
                    val: 'blue-green-mix',
                    title: 'ผสมกัน แยกยาก หรือสีฟ้าอมเขียว',
                    desc: 'โน้มเอียงไปทาง Neutral Tone',
                  },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() =>
                      setSkinAnswers({ ...skinAnswers, veinColor: opt.val as any })
                    }
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      skinAnswers.veinColor === opt.val
                        ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className="text-xs font-semibold text-neutral-900">{opt.title}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Jewelry Preference */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800">
                1.2 สีเครื่องประดับที่ใส่แล้วรู้สึกว่าขับผิวผ่องที่สุด?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    val: 'silver',
                    title: 'สีเงิน / ทองคำขาว / แพลตตินัม',
                    desc: 'ให้ความรู้สึกกระจ่างใส ละมุน',
                  },
                  {
                    val: 'gold',
                    title: 'สีทอง / โรสโกลด์ / ทองเหลือง',
                    desc: 'ให้ความรู้สึกอบอุ่น เปล่งปลั่ง',
                  },
                  {
                    val: 'both',
                    title: 'ใส่ได้ทั้งสีเงินและสีทอง',
                    desc: 'ดูกลมกลืนทั้งสองโทน ไม่ขัดตา',
                  },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() =>
                      setSkinAnswers({ ...skinAnswers, jewelryPreference: opt.val as any })
                    }
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      skinAnswers.jewelryPreference === opt.val
                        ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className="text-xs font-semibold text-neutral-900">{opt.title}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Sun Reaction */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800">
                1.3 เมื่อผิวของคุณต้องเผชิญกับแสงแดดจัดเป็นเวลานาน ผิวมีปฏิกิริยาอย่างไร?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    val: 'burn-easily',
                    title: 'ผิวแดง แสบง่าย แต่ไม่ค่อยคล้ำ',
                    desc: 'เมลานินชนิดฟีโอเมลานินสูง (Cool)',
                  },
                  {
                    val: 'tan-easily',
                    title: 'ผิวเปลี่ยนเป็นสีเข้ม/แทนทันที ไม่ค่อยไหม้',
                    desc: 'เมลานินสร้างไว (Warm)',
                  },
                  {
                    val: 'burn-then-tan',
                    title: 'แดงเล็กน้อยก่อน จากนั้นจึงค่อยคล้ำขึ้น',
                    desc: 'ปฏิกิริยากึ่งกลาง (Neutral/Balanced)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() =>
                      setSkinAnswers({ ...skinAnswers, sunReaction: opt.val as any })
                    }
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      skinAnswers.sunReaction === opt.val
                        ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className="text-xs font-semibold text-neutral-900">{opt.title}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Face Shape Features */}
          <div className="space-y-5 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                2
              </span>
              <span>ลักษณะโครงสร้างและรูปหน้า (Face Geometry)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800">
                  2.1 แนวสัดส่วนความกว้างต่อความยาวของใบหน้า:
                </label>
                <select
                  value={faceAnswers.faceRatio}
                  onChange={(e) =>
                    setFaceAnswers({ ...faceAnswers, faceRatio: e.target.value as any })
                  }
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-800 focus:outline-hidden"
                >
                  <option value="balanced-oval">ความยาวมากกว่าความกว้างเล็กน้อย เส้นกรอบหน้าโค้งมน (สัดส่วนสมดุล)</option>
                  <option value="equal-width-length">ความกว้างและความยาวใกล้เคียงกัน โหนกแก้มอิ่ม</option>
                  <option value="longer-than-wide">ใบหน้ามีความยาวมากกว่าความกว้างชัดเจน</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800">
                  2.2 เส้นแนวขากรรไกรและปลายคาง:
                </label>
                <select
                  value={faceAnswers.jawlineShape}
                  onChange={(e) =>
                    setFaceAnswers({ ...faceAnswers, jawlineShape: e.target.value as any })
                  }
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-800 focus:outline-hidden"
                >
                  <option value="curved-round">โค้งมน นุ่มนวล ไม่มีมุมเหลี่ยมชัด</option>
                  <option value="strong-square">กรามและสันกรามมีมุมเหลี่ยมชัดเจน</option>
                  <option value="pointed-chin">ปลายคางเรียวแหลมชัดเจน</option>
                  <option value="sharp-angular">โครงสร้างกระดูกและมิติด้านข้างชัดเจน</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Body Proportion (Non-judgmental & respectful) */}
          <div className="space-y-5 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                3
              </span>
              <span>แนวทางสัดส่วนเสื้อผ้า (Garment Silhouette Guidelines)</span>
            </div>

            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                การเลือกสัดส่วนในส่วนนี้ใช้เพื่อแนะนำทรงเสื้อผ้า กางเกง และการเลเยอร์ที่สมดุลเท่านั้น
                ระบบไม่ตัดสินคุณค่ารูปร่างและไม่มีการประเมินคะแนนความสวยงาม
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800">
                  3.1 สัดส่วนระหว่างช่วงไหล่และช่วงสะโพกโดยประมาณ:
                </label>
                <select
                  value={bodyAnswers.shoulderHipRatio}
                  onChange={(e) =>
                    setBodyAnswers({ ...bodyAnswers, shoulderHipRatio: e.target.value as any })
                  }
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-800 focus:outline-hidden"
                >
                  <option value="balanced">ช่วงไหล่และช่วงสะโพกมีความกว้างใกล้เคียงกัน</option>
                  <option value="shoulders-broader">ช่วงไหล่กว้างกว่าช่วงสะโพกเล็กน้อย</option>
                  <option value="hips-broader">ช่วงสะโพกกว้างกว่าช่วงไหล่เล็กน้อย</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-800">
                  3.2 สไตล์โครงสร้างชุดที่คุณใส่แล้วมั่นใจและสบายตัว:
                </label>
                <select
                  value={bodyAnswers.silhouettePreference}
                  onChange={(e) =>
                    setBodyAnswers({ ...bodyAnswers, silhouettePreference: e.target.value as any })
                  }
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs bg-[#FAF9F6] text-neutral-800 focus:outline-hidden"
                >
                  <option value="layered-balanced">เลเยอร์ท่อนบนพอดีตัว คู่กับท่อนล่างทรงปล่อย</option>
                  <option value="flowy-relaxed">เสื้อผ้าทรงหลวม (Relaxed/Oversized) ใส่สบายคล่องตัว</option>
                  <option value="fitted-tailored">เสื้อผ้าคัตติ้งเนี้ยบพอดีสัดส่วน</option>
                  <option value="not-sure">ยังไม่แน่ใจ อยากให้ AI ช่วยแนะนำแนวทางใหม่ๆ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end border-t border-neutral-100">
            <button
              onClick={startAnalysis}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-sm bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ประมวลผลคำตอบ & สรุปสไตล์ส่วนตัว</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
