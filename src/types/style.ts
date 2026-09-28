export type SkinTone = 'Cool' | 'Warm' | 'Neutral';

export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Rectangle' | 'Heart' | 'Diamond';

export type BodyProportion = 
  | 'Straight' 
  | 'Triangle' 
  | 'Inverted Triangle' 
  | 'Hourglass' 
  | 'Rectangle' 
  | 'Custom / Not sure';

export type StyleVibe = 
  | 'Casual' 
  | 'Korean' 
  | 'Street' 
  | 'Minimal' 
  | 'Sporty' 
  | 'Smart Casual' 
  | 'Vintage' 
  | 'Y2K' 
  | 'Cute' 
  | 'Cool' 
  | 'Formal' 
  | 'Luxury' 
  | 'Japanese';

export interface ColorItem {
  name: string;
  hex: string;
  role?: string;
  category?: 'best' | 'try' | 'contrast';
}

export interface MakeupItem {
  id: string;
  name: string;
  category: 'Lip' | 'Blush' | 'Eyeshadow' | 'Foundation';
  tone: SkinTone | 'Universal';
  colorGroup: string;
  hexColor: string;
  description: string;
  finish: 'Matte' | 'Glow' | 'Satin' | 'Velvet' | 'Shimmer';
  recommendedFor: string;
}

export interface HairstyleItem {
  id: string;
  name: string;
  nameEn: string;
  length: 'Short' | 'Medium' | 'Long';
  suitableFaceShapes: FaceShape[];
  vibes: string[];
  description: string;
  stylingTips: string;
  imageUrl?: string;
}

export interface OutfitItem {
  id: string;
  title: string;
  style: StyleVibe;
  occasionId: string;
  season: 'All' | 'Summer' | 'Winter' | 'Rainy';
  top: string;
  bottom: string;
  outerwear?: string;
  shoes: string;
  accessories: string[];
  bag: string;
  colorPalette: string[];
  whyItWorks: string;
  imageUrl?: string;
}

export interface OccasionItem {
  id: string;
  nameTh: string;
  nameEn: string;
  icon: string;
  description: string;
  suggestedStyles: StyleVibe[];
  keyElements: string[];
  recommendedColors: string[];
}

export interface FestivalItem {
  id: string;
  nameTh: string;
  nameEn: string;
  dateOrSeason: string;
  icon: string;
  vibe: string;
  recommendedStyles: StyleVibe[];
  recommendedColors: { name: string; hex: string }[];
  outfitIdeas: string;
  hairAndMakeupTips: string;
}

export interface CompleteLook {
  id?: string;
  lookTitle: string;
  concept: string;
  vibe: string;
  palette: ColorItem[];
  makeup: {
    style: string;
    foundation: string;
    blush: string;
    lip: string;
    eyes: string;
    tip: string;
  };
  hairstyle: {
    name: string;
    nameEn: string;
    styling: string;
    whyItFitsFace: string;
  };
  outfit: {
    top: string;
    bottom: string;
    outerwear?: string;
    shoes: string;
    bag: string;
    accessories: string[];
  };
  whyItWorks: string;
  practicalTips: string;
  createdAt?: string;
}

export interface AnalysisResult {
  canAnalyze: boolean;
  clarityWarning?: string | null;
  skinTone: SkinTone;
  skinToneThai: string;
  undertoneDescription: string;
  bestColors: string[];
  tryColors: string[];
  contrastColors: string[];
  faceShape: FaceShape;
  faceShapeThai: string;
  faceShapeDescription: string;
  recommendedHairstyles: {
    name: string;
    nameEn: string;
    vibe: string;
    reason: string;
  }[];
  makeupAdvice: {
    foundationShadeTips: string;
    blushShades: string[];
    lipShades: string[];
    eyeshadowPalette: string[];
    makeupSummary: string;
  };
  bodyProportion: BodyProportion;
  bodyProportionThai: string;
  clothingRecommendations: {
    tops: string;
    bottoms: string;
    layering: string;
    silhouetteTips: string;
  };
  overallSummary: string;
  generatedLook?: CompleteLook;
  uploadedPhotoUrl?: string;
  timestamp?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  status: 'active' | 'disabled';
  registeredDate: string;
  lastActive: string;
  skinTone?: SkinTone;
  faceShape?: FaceShape;
  bodyProportion?: BodyProportion;
  favoriteStyles: StyleVibe[];
  favoriteColors: string[];
  avatarUrl?: string;
  savedOutfits: SavedOutfit[];
}

export interface SavedOutfit {
  id: string;
  title: string;
  occasion: string;
  festival?: string;
  dateSaved: string;
  look: CompleteLook;
  notes?: string;
}

export interface AdminLog {
  id: string;
  action: string;
  category: 'User' | 'Content' | 'System' | 'Security';
  performedBy: string;
  timestamp: string;
  details: string;
}
