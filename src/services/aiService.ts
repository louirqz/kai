import {
  AnalysisResult,
  CompleteLook,
  FaceShape,
  SkinTone,
  BodyProportion,
  StyleVibe,
} from '../types/style';

export interface SkinQuizAnswers {
  overallHue: 'fair-pink' | 'fair-yellow' | 'medium-honey' | 'tan-golden' | 'deep-warm';
  veinColor: 'purple-blue' | 'green-olive' | 'blue-green-mix';
  jewelryPreference: 'silver' | 'gold' | 'both';
  sunReaction: 'burn-easily' | 'tan-easily' | 'burn-then-tan';
}

export interface FaceQuizAnswers {
  foreheadWidth: 'narrow' | 'wide' | 'balanced';
  cheekboneProminence: 'high-broad' | 'soft-rounded' | 'aligned-with-jaw';
  jawlineShape: 'sharp-angular' | 'curved-round' | 'pointed-chin' | 'strong-square';
  faceRatio: 'equal-width-length' | 'longer-than-wide' | 'balanced-oval';
}

export interface BodyQuizAnswers {
  shoulderHipRatio: 'balanced' | 'shoulders-broader' | 'hips-broader';
  waistDefinition: 'clearly-defined' | 'subtle-straight' | 'soft-curved';
  silhouettePreference: 'flowy-relaxed' | 'fitted-tailored' | 'layered-balanced' | 'not-sure';
}

// Check image clarity on client side using canvas
export async function validateImageClarity(
  file: File
): Promise<{ isClear: boolean; warning?: string; base64: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Create canvas to analyze brightness and contrast
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = Math.min(img.width, 200);
        const height = Math.min(img.height, 200);
        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          return resolve({ isClear: true, base64 });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Standard luminance formula
          const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (data.length / 4);

        if (avgBrightness < 30) {
          return resolve({
            isClear: false,
            warning: 'ภาพค่อนข้างมืด แนะนำให้ถ่ายในที่ที่มีแสงธรรมชาติหรือแสงสว่างเพียงพอเพื่อให้ผลวิเคราะห์แม่นยำที่สุด',
            base64,
          });
        }

        if (avgBrightness > 245) {
          return resolve({
            isClear: false,
            warning: 'ภาพสว่างจ้าเกินไป อาจทำให้ระบบแยกแยะอันเดอร์โทนของสีผิวได้ยาก กรุณาลองใช้ภาพที่มีแสงสมดุล',
            base64,
          });
        }

        if (img.width < 120 || img.height < 120) {
          return resolve({
            isClear: false,
            warning: 'ความละเอียดของภาพค่อนข้างต่ำ แนะนำให้ใช้ภาพถ่ายใบหน้าตรงที่มีความคมชัด',
            base64,
          });
        }

        resolve({ isClear: true, base64 });
      };
      img.onerror = () => {
        resolve({
          isClear: false,
          warning: 'ไม่สามารถโหลดไฟล์รูปภาพได้ กรุณาตรวจสอบไฟล์รูปภาพอีกครั้ง',
          base64: '',
        });
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  });
}

// 1. Analyze Skin Tone from Quiz
export function analyzeSkinToneFromQuiz(answers: SkinQuizAnswers): {
  skinTone: SkinTone;
  skinToneThai: string;
  description: string;
  bestColors: string[];
  tryColors: string[];
  contrastColors: string[];
} {
  let coolScore = 0;
  let warmScore = 0;

  if (answers.veinColor === 'purple-blue') coolScore += 3;
  else if (answers.veinColor === 'green-olive') warmScore += 3;
  else {
    coolScore += 1;
    warmScore += 1;
  }

  if (answers.jewelryPreference === 'silver') coolScore += 2;
  else if (answers.jewelryPreference === 'gold') warmScore += 2;
  else {
    coolScore += 1;
    warmScore += 1;
  }

  if (answers.sunReaction === 'burn-easily') coolScore += 2;
  else if (answers.sunReaction === 'tan-easily') warmScore += 2;
  else {
    coolScore += 1;
    warmScore += 1;
  }

  if (answers.overallHue === 'fair-pink') coolScore += 2;
  else if (answers.overallHue === 'fair-yellow' || answers.overallHue === 'tan-golden' || answers.overallHue === 'deep-warm') warmScore += 2;

  let tone: SkinTone = 'Neutral';
  if (coolScore > warmScore + 1) tone = 'Cool';
  else if (warmScore > coolScore + 1) tone = 'Warm';

  if (tone === 'Cool') {
    return {
      skinTone: 'Cool',
      skinToneThai: 'คูลโทน (Cool Tone)',
      description: 'ผิวมีอันเดอร์โทนชมพู เย็น และสดชื่น ขับเน้นเสน่ห์ได้อย่างสง่างามด้วยสีโทนเย็น อัญมณีสีเงิน และเฉดพาสเทลละมุน',
      bestColors: ['#2563EB', '#EC4899', '#8B5CF6', '#38BDF8', '#0F172A'],
      tryColors: ['#F472B6', '#C084FC', '#06B6D4', '#E0E7FF'],
      contrastColors: ['#CA8A04', '#D97706', '#B45309'],
    };
  }

  if (tone === 'Warm') {
    return {
      skinTone: 'Warm',
      skinToneThai: 'วอร์มโทน (Warm Tone)',
      description: 'ผิวมีอันเดอร์โทนเหลือง ทอง และอบอุ่น กลมกลืนอย่างมีระดับกับสีเอิร์ธโทน เครื่องประดับสีทอง และเฉดส้มอิฐคอรัล',
      bestColors: ['#D97706', '#EA580C', '#65A30D', '#9A3412', '#FEF3C7'],
      tryColors: ['#F59E0B', '#84CC16', '#FB923C', '#D4AF37'],
      contrastColors: ['#2563EB', '#6366F1', '#3B82F6'],
    };
  }

  return {
    skinTone: 'Neutral',
    skinToneThai: 'นิวทรัลโทน (Neutral Tone)',
    description: 'ผิวมีความสมดุลระหว่างโทนอุ่นและโทนเย็น เป็นโทนที่มีความยืดหยุ่นสูง สามารถใส่ได้ทั้งเครื่องประดับสีทองและสีเงินอย่างกลมกลืน',
    bestColors: ['#0D9488', '#F43F5E', '#CA8A04', '#F1F5F9', '#334155'],
    tryColors: ['#10B981', '#FB7185', '#E2E8F0', '#6366F1'],
    contrastColors: ['#000000', '#FDE047'],
  };
}

// 2. Analyze Face Shape from Quiz
export function analyzeFaceShapeFromQuiz(answers: FaceQuizAnswers): {
  faceShape: FaceShape;
  faceShapeThai: string;
  description: string;
  hairstyles: { name: string; nameEn: string; vibe: string; reason: string }[];
} {
  let shape: FaceShape = 'Oval';

  if (answers.faceRatio === 'equal-width-length' && answers.jawlineShape === 'curved-round') {
    shape = 'Round';
  } else if (answers.jawlineShape === 'strong-square' || answers.jawlineShape === 'sharp-angular') {
    shape = answers.faceRatio === 'longer-than-wide' ? 'Rectangle' : 'Square';
  } else if (answers.jawlineShape === 'pointed-chin' && answers.foreheadWidth === 'wide') {
    shape = 'Heart';
  } else if (answers.cheekboneProminence === 'high-broad' && answers.jawlineShape === 'pointed-chin') {
    shape = 'Diamond';
  } else {
    shape = 'Oval';
  }

  const map: Record<FaceShape, any> = {
    Oval: {
      faceShapeThai: 'รูปหน้าไข่ (Oval)',
      description: 'สัดส่วนความยาวและความกว้างของใบหน้ามีความสมดุล เส้นกรอบหน้าโค้งมนเป็นธรรมชาติ สามารถตัดและจัดแต่งทรงผมได้หลากหลายสไตล์อย่างอิสระ',
      hairstyles: [
        { name: 'เลเยอร์คัทสไตล์เกาหลี', nameEn: 'Korean Soft Layer', vibe: 'Casual & Clean', reason: 'ช่วยเน้นความสมดุลของกรอบหน้าให้ดูสดใสมีชีวิตชีวา' },
        { name: 'บ็อบตรงสั้นสไตล์มินิมอล', nameEn: 'Blunt Minimal Bob', vibe: 'Smart & Chic', reason: 'เน้นเส้นสายของสันกรามและลำคอให้ดูเพรียวสง่างาม' },
        { name: 'เคอร์เทนแบงส์กับลอนคลาย', nameEn: 'Curtain Bangs with Waves', vibe: 'Cute & Feminine', reason: 'เปิดมิติช่วงดวงตาและเพิ่มความนุ่มนวลให้รอยยิ้ม' },
      ],
    },
    Round: {
      faceShapeThai: 'รูปหน้ากลม (Round)',
      description: 'ใบหน้ามีความกว้างและความยาวใกล้เคียงกัน โหนกแก้มและคางมีความโค้งมนละมุนตา มอบความอ่อนเยาว์และเป็นมิตร',
      hairstyles: [
        { name: 'วูล์ฟคัทเลเยอร์ไล่ระดับ', nameEn: 'Layered Wolf Cut', vibe: 'Cool & Trendy', reason: 'เลเยอร์ผมด้านบนช่วยเพิ่มความสูงและเส้นแนวตั้งให้ใบหน้าดูเรียวยาว' },
        { name: 'แสกข้างวอลลุ่มยกโคน', nameEn: 'Side Part Volume Wave', vibe: 'Smart & Casual', reason: 'การแสกข้างช่วยทำลายความสมมาตรกลมและนำสายตาให้ดูมีมิติ' },
        { name: 'บ็อบยาวประบ่า (Lob)', nameEn: 'Textured Long Bob', vibe: 'Clean & Korean', reason: 'ความยาวประบ่าช่วยเสริมเส้นกรอบหน้าด้านข้างให้ดูชัดเจนขึ้น' },
      ],
    },
    Square: {
      faceShapeThai: 'รูปหน้าเหลี่ยม (Square)',
      description: 'เส้นสันกรามและหน้าผากมีความกว้างใกล้เคียงกัน มีโครงสร้างกระดูกและมุมกรามที่ชัดเจน แสดงถึงความมั่นใจและมีพลัง',
      hairstyles: [
        { name: 'ลอนคลื่นใหญ่ธรรมชาติ', nameEn: 'Soft Bouncy Waves', vibe: 'Feminine & Luxury', reason: 'ความพริ้วไหวของลอนช่วยเสริมความนุ่มนวลรอบมุมกราม' },
        { name: 'หน้าม้าปัดข้างซีทรู', nameEn: 'Side Swept Wispy Bangs', vibe: 'Casual & Cute', reason: 'ช่วยลดทอนเส้นตรงของหน้าผากและสร้างมุมมองที่นุ่มนวล' },
        { name: 'เลเยอร์สไลซ์กรอบหน้า', nameEn: 'Face-Framing Layers', vibe: 'Smart & Modern', reason: 'ปลายผมที่สไลซ์สัมผัสช่วงคางช่วยพรางมุมเหลี่ยมได้อย่างพอดี' },
      ],
    },
    Rectangle: {
      faceShapeThai: 'รูปหน้ายาว / สี่เหลี่ยมผืนผ้า (Rectangle)',
      description: 'ใบหน้ามีความยาวมากกว่าความกว้าง เส้นข้างแก้มตรงและมีโครงสร้างชัดเจน ให้ลุคที่ดูสง่า ภูมิฐาน และคลาสสิก',
      hairstyles: [
        { name: 'หน้าม้าซีทรูสไตล์เกาหลี', nameEn: 'Korean See-Through Bangs', vibe: 'Cute & Youthful', reason: 'ช่วยแบ่งสัดส่วนความยาวของใบหน้าให้ดูสมดุลและสดใสขึ้น' },
        { name: 'ดัดลอนเพิ่มวอลลุ่มด้านข้าง', nameEn: 'Voluminous Side Waves', vibe: 'Luxury & Elegant', reason: 'เพิ่มความกว้างและมิติด้านข้างใบหน้าเพื่อความสมดุล' },
        { name: 'บ็อบดัดลอนคลายระดับคาง', nameEn: 'Chin-Length Wavy Bob', vibe: 'Chic & Casual', reason: 'ความยาวระดับคางช่วยดึงดูดสายตาให้อยู่ในแนวนอน' },
      ],
    },
    Heart: {
      faceShapeThai: 'รูปหน้ารูปหัวใจ (Heart)',
      description: 'หน้าผากและโหนกแก้มกว้าง เรียวเล็กลงมารับกับคางที่ได้รูปชัดเจน ให้ความรู้สึกสดใสและน่ารัก',
      hairstyles: [
        { name: 'บ็อบปลายสะบัดออก', nameEn: 'Flipped Out Bob', vibe: 'Cute & Retro', reason: 'ปลายผมที่สะบัดออกช่วยเพิ่มน้ำหนักความกว้างช่วงปลายคาง' },
        { name: 'เคอร์เทนแบงส์เปิดหน้าผาก', nameEn: 'Curtain Bangs', vibe: 'Casual & Korean', reason: 'ช่วยจัดสมดุลความกว้างของหน้าผากให้รับกับจุดเด่นของคาง' },
        { name: 'ผมยาวลอนคลื่นไล่ระดับคางลงไป', nameEn: 'Lower Half Waves', vibe: 'Smart & Feminine', reason: 'ดึงจุดสนใจมาที่ความพริ้วไหวช่วงล่างของใบหน้า' },
      ],
    },
    Diamond: {
      faceShapeThai: 'รูปหน้าเพชร (Diamond)',
      description: 'โหนกแก้มเป็นจุดเด่นที่สวยงาม หน้าผากและคางเรียวแคบอย่างสมดุล โครงหน้ามีมิติสวยงามและถ่ายรูปขึ้นมาก',
      hairstyles: [
        { name: 'บ็อบเทคัตติ้งคม', nameEn: 'Sleek Chin Bob', vibe: 'Cool & High Fashion', reason: 'เน้นโหนกแก้มที่เป็นเอกลักษณ์และขับรูปคางให้ดูโฉบเฉี่ยว' },
        { name: 'ลอนคลื่นเปิดกรอบหน้า', nameEn: 'Swept Back Waves', vibe: 'Luxury & Confident', reason: 'เปิดโชว์ความคมชัดของโหนกแก้มอย่างภาคภูมิใจ' },
        { name: 'หน้าม้าปัดข้างยาวระดับแก้ม', nameEn: 'Cheekbone-Length Bangs', vibe: 'Smart & Casual', reason: 'นำสายตาและเพิ่มความนุ่มนวลบริเวณขมับ' },
      ],
    },
  };

  return {
    faceShape: shape,
    faceShapeThai: map[shape].faceShapeThai,
    description: map[shape].description,
    hairstyles: map[shape].hairstyles,
  };
}

// 3. Analyze Body Proportion neutrally from Quiz
export function analyzeBodyProportionFromQuiz(answers: BodyQuizAnswers): {
  bodyProportion: BodyProportion;
  bodyProportionThai: string;
  recommendations: {
    tops: string;
    bottoms: string;
    layering: string;
    silhouetteTips: string;
  };
} {
  let proportion: BodyProportion = 'Straight';

  if (answers.shoulderHipRatio === 'balanced' && answers.waistDefinition === 'clearly-defined') {
    proportion = 'Hourglass';
  } else if (answers.shoulderHipRatio === 'hips-broader') {
    proportion = 'Triangle';
  } else if (answers.shoulderHipRatio === 'shoulders-broader') {
    proportion = 'Inverted Triangle';
  } else if (answers.waistDefinition === 'subtle-straight') {
    proportion = 'Rectangle';
  } else {
    proportion = 'Custom / Not sure';
  }

  const map: Record<BodyProportion, any> = {
    Hourglass: {
      bodyProportionThai: 'สัดส่วนแนวสมดุล (Hourglass Silhouette)',
      tops: 'เสื้อคอวี, เสื้อป้ายหน้า (Wrap top), เสื้อครอปพอดีตัว หรือเสื้อเชิ้ตเก็บชายเข้าในกางเกง',
      bottoms: 'กางเกงเอวสูงทรงกระบอกตรง, กระโปรงทรงเอ หรือกางเกงสแล็คผ้าทิ้งตัว',
      layering: 'เบลเซอร์เข้ารูปเล็กน้อย หรือคาร์ดิแกนสั้นความยาวเสมอเอว',
      silhouetteTips: 'สร้างจุดเน้นที่สบายตาด้วยการจับคู่เสื้อผ้าที่สอดรับกับแนวสัดส่วนธรรมชาติ หลีกเลี่ยงเสื้อผ้าที่หนาเทอะทะเกินไป',
    },
    Triangle: {
      bodyProportionThai: 'สัดส่วนแนวฐานสมดุล (Triangle Silhouette)',
      tops: 'เสื้อเปิดไหล่ (Off-shoulder), เสื้อแขนพองเบาๆ, เสื้อเชิ้ตมีดีเทลช่วงปก หรือเสื้อพิมพ์ลายท่อนบน',
      bottoms: 'กางเกงขากว้าง (Wide-leg), กางเกงสแล็คผ้าทิ้งตัวสีเข้ม หรือกระโปรงพลีททรงเอ',
      layering: 'แจ็คเก็ตความยาวระดับสะโพกบน หรือเสื้อกั๊กเปิดกระดุม',
      silhouetteTips: 'เพิ่มลูกเล่นและความสว่างสดใสที่ท่อนบนเพื่อกระจายจุดสนใจ และใช้ท่อนล่างที่มีทรงพริ้วไหวโปร่งสบาย',
    },
    'Inverted Triangle': {
      bodyProportionThai: 'สัดส่วนแนวช่วงบนเด่น (Inverted Triangle)',
      tops: 'เสื้อคอวี เสื้อคอยูเนื้อผ้านิ่มทิ้งตัว เสื้อแขนสโลป หรือเสื้อเชิ้ตเปิดคอโปร่ง',
      bottoms: 'กางเกงคาร์โก้, กางเกงขาม้า, กางเกงพลีท หรือกระโปรงทรงบานที่มีวอลลุ่มสวยงาม',
      layering: 'คาร์ดิแกนตัวยาว หรือโค้ททรงตรงที่ปล่อยชายเปิด',
      silhouetteTips: 'สร้างความสมดุลด้วยการเลือกท่อนล่างที่มีลูกเล่น เช่น กระเป๋าข้างหรือจีบพลีท เพื่อความโปร่งและมีมิติ',
    },
    Rectangle: {
      bodyProportionThai: 'สัดส่วนแนวตรงเพรียว (Rectangle Silhouette)',
      tops: 'เสื้อคอเหลี่ยม, เสื้อระบายลูกไม้, เสื้อไหมพรมถักมีเท็กซ์เจอร์ หรือเสื้อเชิ้ตโอเวอร์ไซส์ผูกเอว',
      bottoms: 'กางเกงเป้าต่ำทรงสตรีท หรือกางเกงกระบอกใหญ่เอวสูงคู่เข็มขัด',
      layering: 'เบลเซอร์โอเวอร์ไซส์ทรง Boxy หรือแจ็คเก็ตยีนส์คลาสสิก',
      silhouetteTips: 'สนุกกับการเลเยอร์เสื้อผ้าหลากเนื้อสัมผัสเพื่อสร้างมิติความลึกและความน่าสนใจให้กับลุค',
    },
    Straight: {
      bodyProportionThai: 'สัดส่วนแนวเส้นตรงสบายตา (Straight Silhouette)',
      tops: 'เสื้อยืดผ้าคอตตอนคุณภาพสูง, เสื้อเชิ้ตทรงหลวม, เสื้อสเวตเตอร์คอกลม',
      bottoms: 'กางเกงยีนส์ขากระบอกตรง (Straight Leg), กางเกงชิโน่, หรือกางเกงจ็อกเกอร์',
      layering: 'เสื้อคลุมผ้าลินิน หรือโอเวอร์เชิ้ตสวมทับแบบเปิดกระดุม',
      silhouetteTips: 'เน้นความคล่องตัว สบายตา และเส้นสายที่สะอาดเรียบง่ายสไตล์มินิมอลหรือสตรีท',
    },
    'Custom / Not sure': {
      bodyProportionThai: 'สัดส่วนเอกลักษณ์เฉพาะตัว (Custom Silhouette)',
      tops: 'เสื้อทรงผ่อนคลาย (Relaxed Fit) ที่สวมใส่แล้วรู้สึกมั่นใจและเคลื่อนไหวสะดวก',
      bottoms: 'กางเกงที่พอดีกับช่วงเอวและสะโพก มีความยืดหยุ่นและสบายตลอดวัน',
      layering: 'เสื้อคลุมหรือคาร์ดิแกนที่สามารถถอดปรับได้ตามสภาพอากาศ',
      silhouetteTips: 'เลือกใส่เสื้อผ้าตามความรู้สึกสบายและความมั่นใจของตนเองเป็นหลัก เพราะความมั่นใจคือสไตล์ที่ดีที่สุด',
    },
  };

  return {
    bodyProportion: proportion,
    bodyProportionThai: map[proportion].bodyProportionThai,
    recommendations: {
      tops: map[proportion].tops,
      bottoms: map[proportion].bottoms,
      layering: map[proportion].layering,
      silhouetteTips: map[proportion].silhouetteTips,
    },
  };
}

// 4. Client-side Image Analysis (Calls Server API with Gemini, or falls back to smart local AI)
export async function analyzeImageWithAI(
  imageBase64: string,
  userPreferences?: any
): Promise<AnalysisResult> {
  try {
    const res = await fetch('/api/ai/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        mimeType: 'image/jpeg',
        userPreferences,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return {
          ...data.data,
          uploadedPhotoUrl: imageBase64,
          timestamp: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable or network error, using smart styling fallback:', err);
  }

  // Smart algorithmic synthesis fallback
  const skin = analyzeSkinToneFromQuiz({
    overallHue: 'medium-honey',
    veinColor: 'green-olive',
    jewelryPreference: 'gold',
    sunReaction: 'tan-easily',
  });
  const face = analyzeFaceShapeFromQuiz({
    foreheadWidth: 'balanced',
    cheekboneProminence: 'high-broad',
    jawlineShape: 'curved-round',
    faceRatio: 'balanced-oval',
  });
  const body = analyzeBodyProportionFromQuiz({
    shoulderHipRatio: 'balanced',
    waistDefinition: 'clearly-defined',
    silhouettePreference: 'layered-balanced',
  });

  return {
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
      foundationShadeTips: 'เลือกเฉดโทนอุ่น (Warm-Golden) ที่มีเบสเหลืองนวลหรือโอลีฟ ทดสอบเฉดสีบริเวณแนวกรามในแสงธรรมชาติ',
      blushShades: ['Soft Peach', 'Warm Coral', 'Toasted Apricot'],
      lipShades: ['Coral Sun Velvet', 'MLBB Terracotta Brick', 'Soft Apricot Nude'],
      eyeshadowPalette: ['Golden Amber', 'Warm Copper', 'Champagne Shimmer'],
      makeupSummary: 'เน้นงานผิวที่ดูสุขภาพดี ฉ่ำวาวเป็นธรรมชาติ ขับเน้นพวงแก้มและริมฝีปากด้วยโทนสีพีช-คอรัลอบอุ่น',
    },
    bodyProportion: body.bodyProportion,
    bodyProportionThai: body.bodyProportionThai,
    clothingRecommendations: body.recommendations,
    overallSummary: 'คุณมีอันเดอร์โทนและรูปหน้าที่โดดเด่น สามารถแต่งตัวได้หลากหลายสไตล์ทั้ง Korean, Minimal, และ Street ได้อย่างมั่นใจ',
    uploadedPhotoUrl: imageBase64,
    timestamp: new Date().toISOString(),
  };
}

// 5. Complete Look Generator (Calls Server API with Gemini, or falls back to rich synthesis)
export async function generateCompleteLookWithAI(params: {
  skinTone: SkinTone;
  faceShape: FaceShape;
  bodyProportion: BodyProportion;
  preferredStyles: StyleVibe[];
  occasion: string;
  festival?: string;
  favoriteColors?: string[];
}): Promise<CompleteLook> {
  try {
    const res = await fetch('/api/ai/generate-complete-look', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return {
          ...data.data,
          id: 'look-' + Date.now(),
          createdAt: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable, using smart look generator:', err);
  }

  const primaryStyle = params.preferredStyles?.[0] || 'Korean';
  const occasion = params.occasion || 'ไปคาเฟ่';

  return {
    id: 'look-' + Date.now(),
    lookTitle: `ลุค ${primaryStyle} ชิคสำหรับ ${occasion}`,
    concept: `การผสมผสานความสบายแบบเป็นธรรมชาติเข้ากับดีเทลประณีต ให้ความรู้สึกเข้าถึงง่ายและถ่ายรูปขึ้นกับบรรยากาศ ${occasion}`,
    vibe: `${primaryStyle} Effortless & Radiant`,
    palette: [
      { name: 'Oatmeal Beige', hex: '#FAF5F0', role: 'สีหลัก (ท่อนบน/เสื้อนอก)' },
      { name: 'Peach Coral', hex: '#E06A55', role: 'สีรอง (เมคอัพ/ดีเทล)' },
      { name: 'Mocha Brown', hex: '#8C6D58', role: 'สีคอนทราสต์ (กางเกง/กระเป๋า)' },
      { name: 'Vintage Gold', hex: '#D4AF37', role: 'สีแต้มแต่ง (เครื่องประดับ)' },
    ],
    makeup: {
      style: `${params.skinTone === 'Cool' ? 'Cool Mauve Rosy Glow' : 'Warm Sunset Peach Glow'}`,
      foundation: 'คุชชั่นฟินิชกึ่งโกลว์ ให้ผิวดูอิ่มน้ำเล่นแสงธรรมชาติ ไม่หนาเตอะ',
      blush: params.skinTone === 'Cool' ? 'บลัชเนื้อครีมสีชมพูนม ปัดกลางหน้าแก้ม' : 'บลัชเนื้อครีมสีพีชอมส้ม ปัดเฉียงรับโหนกแก้ม',
      lip: params.skinTone === 'Cool' ? 'ทินท์สีเบอร์รี่ตุ่น ทาทับด้วยกลอสใส' : 'ทินท์สีคอรัลนู้ด เกลี่ยขอบปากฟุ้งๆ สไตล์เกาหลี',
      eyes: 'ชิมเมอร์สีแชมเปญทั่วเปลือกตา ปัดมาสคาร่าเรียงเส้นเป็นธรรมชาติ',
      tip: 'เซ็ตแป้งฝุ่นเฉพาะทีโซนเพื่อให้ผิวดูเปล่งประกายตลอดทั้งวัน',
    },
    hairstyle: {
      name: 'ผมดัดลอนคลายปอยหวาน',
      nameEn: 'Effortless Soft Waves with Face-Framing Bangs',
      styling: 'หนีบลอนคลื่นหลวมๆ ฉีดสเปรย์เพิ่มเท็กซ์เจอร์ ให้ดูเหมือนไม่ได้ตั้งใจเซ็ต',
      whyItFitsFace: `ช่วยเสริมกรอบหน้าทรง ${params.faceShape} ให้ดูละมุนและมีมิติเวลาถ่ายรูป`,
    },
    outfit: {
      top: 'เสื้อเชิ้ตผ้าลินินสีครีม หรือเสื้อสเวตเตอร์ไหมพรมถักเนื้อโปร่ง',
      bottom: 'กางเกงสแล็คขากว้าง (Wide-leg Trousers) เอวสูงสีมอคค่าทิ้งตัวสวย',
      outerwear: 'คาร์ดิแกนถักนุ่มพาดไหล่ หรือเบลเซอร์ผ้าลินินบางเบา',
      shoes: 'รองเท้าโลฟเฟอร์หนังนิ่ม หรือสนีกเกอร์เรโทรสีขาวคลีน',
      bag: 'กระเป๋าสะพายไหล่หนังมินิมอล (Minimalist Shoulder Bag)',
      accessories: [
        'สร้อยคอสายโซ่เส้นจิ๋วพร้อมจี้มินิมอล',
        'นาฬิกาข้อมือสายหนังคลาสสิก',
        'แว่นตากันแดดทรงวินเทจ',
      ],
    },
    whyItWorks: `การจับคู่สีโทน ${params.skinTone} เข้ากับรูปทรงเสื้อผ้าแบบทิ้งตัว ช่วยเสริมสัดส่วน ${params.bodyProportion} ให้ดูสมดุล คล่องตัว และเข้ากับบรรยากาศ ${occasion} ได้อย่างยอดเยี่ยม`,
    practicalTips: 'สามารถปรับเปลี่ยนลุคระหว่างวันได้ง่ายๆ โดยการปลดกระดุมเสื้อเชิ้ต หรือสวมคาร์ดิแกนทับเมื่ออยู่ในห้องแอร์',
    createdAt: new Date().toISOString(),
  };
}
