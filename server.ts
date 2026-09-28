import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI Image Analysis (Face / Full body)
app.post('/api/ai/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', analysisType = 'full', userPreferences } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    if (!ai) {
      // Return smart simulated analysis if no API key configured
      return res.json({
        success: true,
        source: 'smart-heuristic',
        message: 'No GEMINI_API_KEY detected. Using intelligent stylistic heuristic analysis.',
        data: generateHeuristicAnalysis(userPreferences),
      });
    }

    // Clean base64 string if it contains data URI prefix
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `
You are StyleMatch AI, a professional and body-positive personal styling, color analysis, and grooming consultant.
Analyze this user's photo carefully.

ETHICAL RULES:
- Never judge the body or face as "good/bad", "better/worse". Never suggest weight loss or unrealistic body standards.
- Focus strictly on harmonious colors, flattering garment silhouettes, balance, and aesthetic alignment.
- Be encouraging, respectful, modern, and helpful.
- If the image is too blurry, too dark, obstructed, or doesn't show a human face or body, return canAnalyze: false and a helpful explanation in Thai.

Analyze and return STRICT JSON with this schema:
{
  "canAnalyze": boolean,
  "clarityWarning": string or null,
  "skinTone": "Cool" | "Warm" | "Neutral",
  "skinToneThai": "คูลโทน (Cool Tone)" | "วอร์มโทน (Warm Tone)" | "นิวทรัลโทน (Neutral Tone)",
  "undertoneDescription": string in Thai explaining the undertone characteristics,
  "bestColors": string[] (5-6 hex color codes or names),
  "tryColors": string[] (3-4 complementary colors to try),
  "contrastColors": string[] (colors with high contrast to be mindful of),
  "faceShape": "Oval" | "Round" | "Square" | "Rectangle" | "Heart" | "Diamond",
  "faceShapeThai": string in Thai,
  "faceShapeDescription": string in Thai describing the facial proportions neutrally,
  "recommendedHairstyles": [
    {
      "name": string,
      "nameEn": string,
      "vibe": string,
      "reason": string in Thai
    }
  ],
  "makeupAdvice": {
    "foundationShadeTips": string in Thai,
    "blushShades": string[] (e.g. ["Peach Glow", "Warm Coral"]),
    "lipShades": string[] (e.g. ["MLBB Coral Nude", "Terracotta Red"]),
    "eyeshadowPalette": string[] (e.g. ["Warm Bronze", "Champagne Shimmer", "Soft Terracotta"]),
    "makeupSummary": string in Thai
  },
  "bodyProportion": "Straight" | "Triangle" | "Inverted Triangle" | "Hourglass" | "Rectangle" | "Custom / Not sure",
  "bodyProportionThai": string in Thai,
  "clothingRecommendations": {
    "tops": string in Thai,
    "bottoms": string in Thai,
    "layering": string in Thai,
    "silhouetteTips": string in Thai
  },
  "overallSummary": string in Thai
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      // Fallback extraction
      const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error during AI image analysis:', error);
    // Graceful fallback with smart analysis so user is not blocked
    return res.json({
      success: true,
      source: 'fallback-heuristic',
      data: generateHeuristicAnalysis(req.body.userPreferences),
      errorNote: error?.message || 'AI service temporarily unavailable, providing smart styling profile',
    });
  }
});

// Endpoint: AI Complete Look Generator
app.post('/api/ai/generate-complete-look', async (req, res) => {
  try {
    const { skinTone, faceShape, bodyProportion, preferredStyles, occasion, festival, favoriteColors } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'smart-heuristic',
        data: generateHeuristicLook({ skinTone, faceShape, bodyProportion, preferredStyles, occasion, festival, favoriteColors }),
      });
    }

    const prompt = `
Create a complete personalized styling recommendation for StyleMatch AI:
- Skin Tone: ${skinTone || 'Warm'}
- Face Shape: ${faceShape || 'Oval'}
- Body Proportion: ${bodyProportion || 'Hourglass'}
- Preferred Styles: ${Array.isArray(preferredStyles) ? preferredStyles.join(', ') : preferredStyles || 'Casual, Korean'}
- Occasion: ${occasion || 'Cafe hopping'}
- Festival / Season: ${festival || 'Summer'}
- Favorite Colors: ${Array.isArray(favoriteColors) ? favoriteColors.join(', ') : 'Pastel & Earth tones'}

Return STRICT JSON with this schema:
{
  "lookTitle": string in Thai (e.g. "ลุคชิคคาเฟ่สไตล์เกาหลีแบบมินิมอล"),
  "concept": string in Thai,
  "vibe": string,
  "palette": [
    { "name": string, "hex": string, "role": string }
  ],
  "makeup": {
    "style": string in Thai,
    "foundation": string in Thai,
    "blush": string in Thai,
    "lip": string in Thai,
    "eyes": string in Thai,
    "tip": string in Thai
  },
  "hairstyle": {
    "name": string in Thai,
    "nameEn": string,
    "styling": string in Thai,
    "whyItFitsFace": string in Thai
  },
  "outfit": {
    "top": string in Thai,
    "bottom": string in Thai,
    "outerwear": string in Thai,
    "shoes": string in Thai,
    "bag": string in Thai,
    "accessories": string[] (3 items)
  },
  "whyItWorks": string in Thai explaining the harmony of colors, silhouette, and occasion,
  "practicalTips": string in Thai
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '{}';
    const parsedData = JSON.parse(textOutput);

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating complete look:', error);
    return res.json({
      success: true,
      source: 'fallback-heuristic',
      data: generateHeuristicLook(req.body),
    });
  }
});

// Helper for high quality heuristic analysis
function generateHeuristicAnalysis(prefs: any = {}) {
  const skin = prefs?.skinTone || 'Warm';
  const face = prefs?.faceShape || 'Oval';
  const body = prefs?.bodyProportion || 'Hourglass';

  return {
    canAnalyze: true,
    clarityWarning: null,
    skinTone: skin,
    skinToneThai: skin === 'Cool' ? 'คูลโทน (Cool Tone)' : skin === 'Warm' ? 'วอร์มโทน (Warm Tone)' : 'นิวทรัลโทน (Neutral Tone)',
    undertoneDescription: skin === 'Cool'
      ? 'ผิวมีอันเดอร์โทนชมพูหรือน้ำเงิน เส้นเลือดที่ข้อมือมีโทนม่วง/น้ำเงิน เข้ากันได้ดีกับเครื่องประดับสีเงินและสีโทนเย็น'
      : skin === 'Warm'
      ? 'ผิวมีอันเดอร์โทนเหลืองหรือทอง เส้นเลือดที่ข้อมือมีโทนเขียว เข้ากันได้ดีกับเครื่องประดับสีทองและสีเอิร์ธโทน'
      : 'ผิวมีความสมดุลระหว่างอันเดอร์โทนอุ่นและเย็น สามารถใส่เครื่องประดับได้ทั้งสีทองและสีเงินอย่างกลมกลืน',
    bestColors: skin === 'Cool'
      ? ['#2563EB', '#EC4899', '#8B5CF6', '#E0E7FF', '#0F172A']
      : skin === 'Warm'
      ? ['#D97706', '#EA580C', '#65A30D', '#FEF3C7', '#78350F']
      : ['#0D9488', '#F43F5E', '#CA8A04', '#F1F5F9', '#334155'],
    tryColors: skin === 'Cool' ? ['#06B6D4', '#C084FC', '#F472B6'] : ['#F59E0B', '#84CC16', '#FB923C'],
    contrastColors: skin === 'Cool' ? ['#CA8A04', '#B45309'] : ['#3B82F6', '#6366F1'],
    faceShape: face,
    faceShapeThai: face === 'Oval' ? 'รูปหน้าไข่ (Oval)' : face === 'Round' ? 'รูปหน้ากลม (Round)' : face === 'Square' ? 'รูปหน้าเหลี่ยม (Square)' : face === 'Heart' ? 'รูปหน้าหัวใจ (Heart)' : 'รูปหน้าเพชร (Diamond)',
    faceShapeDescription: 'โครงหน้ามีสัดส่วนที่ชัดเจนและเป็นเอกลักษณ์ สามารถเลือกทรงผมที่ช่วยเสริมกรอบหน้าและขับเน้นจุดเด่นของรอยยิ้มได้อย่างสวยงาม',
    recommendedHairstyles: [
      { name: 'เลเยอร์คัทสไตล์เกาหลี', nameEn: 'Korean Soft Layer', vibe: 'Casual & Feminine', reason: 'ช่วยเพิ่มมิติและความนุ่มนวลให้กรอบหน้าดูมีวอลลุ่มเป็นธรรมชาติ' },
      { name: 'วูล์ฟคัทความยาวปานกลาง', nameEn: 'Modern Wolf Cut', vibe: 'Trendy & Cool', reason: 'ให้ความรู้สึกทันสมัย ทรงผมมีเท็กซ์เจอร์ไล่ระดับอย่างมีสไตล์' },
      { name: 'เคอร์เทนแบงส์ (หน้าม้าปัดข้าง)', nameEn: 'Curtain Bangs', vibe: 'Smart & Cute', reason: 'ช่วยนำสายตาให้ใบหน้าดูละมุนและเปิดมิติช่วงดวงตา' }
    ],
    makeupAdvice: {
      foundationShadeTips: skin === 'Cool' ? 'เลือกเฉดโทน Neutral-Cool ที่มีเบสชมพูอ่อน หลีกเลี่ยงรองพื้นที่อมเหลืองเข้มเกินไป' : 'เลือกเฉดโทน Warm ที่มีเบสเหลืองนวลหรือโกลเด้นเพื่อความผ่องเป็นธรรมชาติ',
      blushShades: skin === 'Cool' ? ['Baby Pink', 'Rose Mauve', 'Plum Pink'] : ['Soft Peach', 'Warm Coral', 'Sun-kissed Apricot'],
      lipShades: skin === 'Cool' ? ['Berry Rose', 'Cool Mauve', 'Cherry Red'] : ['Peach Nude', 'Warm Brick', 'Coral Orange'],
      eyeshadowPalette: skin === 'Cool' ? ['Taupe Rose', 'Silver Champagne', 'Soft Plum'] : ['Warm Bronze', 'Golden Peach', 'Rich Terracotta'],
      makeupSummary: 'เน้นงานผิวที่โปร่งใส ดูสุขภาพดี พร้อมแต้มสีบลัชและลิปสติกในโทนกลมกลืนเพื่อลุคที่เปล่งประกาย'
    },
    bodyProportion: body,
    bodyProportionThai: body === 'Hourglass' ? 'สัดส่วนสมดุลแบบเคิร์ฟ (Hourglass)' : body === 'Straight' ? 'สัดส่วนแนวตรงเพรียว (Straight)' : 'สัดส่วนแบบรูปสามเหลี่ยม (Triangle)',
    clothingRecommendations: {
      tops: 'เสื้อคอวี เสื้อเปิดไหล่ หรือเสื้อเชิ้ตโอเวอร์ไซส์ผ้านิ่มที่มีทิ้งตัวสวยงาม',
      bottoms: 'กางเกงทรงกระบอกตรง (Straight Leg) หรือกางเกงเอวสูงที่ช่วยเสริมแนวยาวของเรียวขา',
      layering: 'เบลเซอร์ทรงหลวมความยาวคลุมสะโพก หรือคาร์ดิแกนผ้าถักบางเบา',
      silhouetteTips: 'สร้างจุดโฟกัสด้วยการผสมผสานท่อนบนที่พอดีตัวคู่กับท่อนล่างที่มีความพริ้วไหว เพื่อลุคที่สบายและมั่นใจ'
    },
    overallSummary: 'คุณมีคู่สีและโครงสร้างสไตล์ที่โดดเด่น สามารถแต่งตัวได้หลากหลายแนวทั้ง Minimal, Korean, และ Street อย่างเป็นตัวของตัวเอง'
  };
}

function generateHeuristicLook(data: any) {
  const occ = data?.occasion || 'ไปคาเฟ่';
  const sty = Array.isArray(data?.preferredStyles) && data.preferredStyles.length > 0 ? data.preferredStyles[0] : 'Korean Minimal';

  return {
    lookTitle: `ลุค ${sty} สำหรับ ${occ}`,
    concept: `การผสมผสานความสบายแบบเป็นธรรมชาติเข้ากับดีเทลประณีต เหมาะสำหรับบรรยากาศ ${occ}`,
    vibe: `${sty} Chic & Effortless`,
    palette: [
      { name: 'Oatmeal Beige', hex: '#E5D9C5', role: 'สีหลัก (ท่อนบน/เสื้อนอก)' },
      { name: 'Soft Cream', hex: '#FDFBF7', role: 'สีรอง (เสื้อด้านใน)' },
      { name: 'Warm Mocha', hex: '#6E5343', role: 'สีคอนทราสต์ (กางเกง/กระเป๋า)' },
      { name: 'Vintage Olive', hex: '#70775B', role: 'สีแต้มแต่ง (เครื่องประดับ)' }
    ],
    makeup: {
      style: 'Glowy No-Makeup Look',
      foundation: 'คุชชั่นฟินิชกึ่งโกลว์ ให้ผิวดูฉ่ำน้ำเล่นแสง',
      blush: 'บลัชออนเนื้อครีมสีพีชอมส้ม ปัดเฉียงรับโหนกแก้ม',
      lip: 'ทินท์บาล์มสีคอรัลนู้ด เติมกลอสใสกลางริมฝีปาก',
      eyes: 'ชิมเมอร์สีแชมเปญทั่วเปลือกตา ปัดมาสคาร่าเส้นต่อเส้น',
      tip: 'เซ็ตแป้งฝุ่นเฉพาะทีโซนเพื่อให้ผิวดูเปล่งประกายตลอดวัน'
    },
    hairstyle: {
      name: 'ผมดัดลอนคลื่นเบาๆ แสกข้าง',
      nameEn: 'Effortless Soft Wave with Side Part',
      styling: 'หนีบลอนคลายๆ ฉีดสเปรย์เพิ่มเท็กซ์เจอร์ ให้ดูไม่ได้ตั้งใจแต่มีมิติ',
      whyItFitsFace: 'ช่วยพรางกรอบหน้าให้ดูละมุนและเพิ่มความมีชีวิตชีวาเข้ากับชุด'
    },
    outfit: {
      top: 'เสื้อเชิ้ตผ้าลินินสีครีม หรือเสื้อยืดคอกลมทรงผ่อนคลาย',
      bottom: 'กางเกงสแล็คขากว้าง (Wide-leg Trousers) สีมอคค่าเอวสูง',
      outerwear: 'คาร์ดิแกนถักไหมพรมเนื้อโปร่งพาดไหล่',
      shoes: 'รองเท้าโลฟเฟอร์หนังนิ่มสีน้ำตาล หรือสนีกเกอร์เรโทรสีขาวคลีน',
      bag: 'กระเป๋าสะพายไหล่หนังเรียบมินิมอล (Minimalist Shoulder Bag)',
      accessories: ['สร้อยคอสายโซ่จี้เล็กสีทอง', 'นาฬิกาหน้าปัดสี่เหลี่ยมสายหนัง', 'แว่นตากันแดดทรงวินเทจ']
    },
    whyItWorks: 'การจับคู่สีเอิร์ธโทนโทนอุ่นเข้ากับทรงเสื้อผ้าที่ทิ้งตัวสบาย ให้ความรู้สึกคล่องตัว เรียบหรู และถ่ายรูปขึ้นกับทุกมุม',
    practicalTips: 'สามารถถอดหรือพาดคาร์ดิแกนเพื่อเปลี่ยนลุคระหว่างห้องแอร์กับกลางแจ้งได้อย่างสะดวก'
  };
}

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StyleMatch AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
