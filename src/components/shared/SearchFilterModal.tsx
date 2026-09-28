import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Palette, Scissors, Shirt, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StyleVibe, SkinTone } from '../../types/style';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({ isOpen, onClose, navigate }) => {
  const { makeupList, hairstyleList, outfitList, occasionList, festivalList } = useAuth();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'makeup' | 'hairstyle' | 'outfit' | 'occasion' | 'festival'>('all');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');
  const [selectedToneFilter, setSelectedToneFilter] = useState<string>('all');

  const styles: StyleVibe[] = [
    'Casual',
    'Korean',
    'Street',
    'Minimal',
    'Sporty',
    'Smart Casual',
    'Vintage',
    'Y2K',
    'Cute',
    'Cool',
    'Formal',
    'Luxury',
    'Japanese',
  ];

  const tones: (SkinTone | 'all')[] = ['all', 'Warm', 'Cool', 'Neutral'];

  // Search logic
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const makeupMatches = makeupList.filter((m) => {
      const matchText = !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.colorGroup.toLowerCase().includes(q);
      const matchTone = selectedToneFilter === 'all' || m.tone === selectedToneFilter || m.tone === 'Universal';
      return matchText && matchTone;
    });

    const hairMatches = hairstyleList.filter((h) => {
      const matchText = !q || h.name.toLowerCase().includes(q) || h.nameEn.toLowerCase().includes(q) || h.description.toLowerCase().includes(q) || h.vibes.some((v) => v.toLowerCase().includes(q));
      const matchStyle = selectedStyleFilter === 'all' || h.vibes.some((v) => v.toLowerCase() === selectedStyleFilter.toLowerCase());
      return matchText && matchStyle;
    });

    const outfitMatches = outfitList.filter((o) => {
      const matchText = !q || o.title.toLowerCase().includes(q) || o.top.toLowerCase().includes(q) || o.bottom.toLowerCase().includes(q) || o.whyItWorks.toLowerCase().includes(q);
      const matchStyle = selectedStyleFilter === 'all' || o.style === selectedStyleFilter;
      return matchText && matchStyle;
    });

    const occasionMatches = occasionList.filter((occ) => {
      const matchText = !q || occ.nameTh.toLowerCase().includes(q) || occ.nameEn.toLowerCase().includes(q) || occ.description.toLowerCase().includes(q);
      const matchStyle = selectedStyleFilter === 'all' || occ.suggestedStyles.includes(selectedStyleFilter as StyleVibe);
      return matchText && matchStyle;
    });

    const festivalMatches = festivalList.filter((f) => {
      const matchText = !q || f.nameTh.toLowerCase().includes(q) || f.nameEn.toLowerCase().includes(q) || f.vibe.toLowerCase().includes(q) || f.outfitIdeas.toLowerCase().includes(q);
      const matchStyle = selectedStyleFilter === 'all' || f.recommendedStyles.includes(selectedStyleFilter as StyleVibe);
      return matchText && matchStyle;
    });

    return {
      makeup: makeupMatches,
      hairstyle: hairMatches,
      outfit: outfitMatches,
      occasion: occasionMatches,
      festival: festivalMatches,
      totalCount: makeupMatches.length + hairMatches.length + outfitMatches.length + occasionMatches.length + festivalMatches.length,
    };
  }, [query, selectedStyleFilter, selectedToneFilter, makeupList, hairstyleList, outfitList, occasionList, festivalList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FAF9F6] w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา สี, ทรงผม, สไตล์, ชุด, โอกาส, เทศกาล... (เช่น คาเฟ่, วูล์ฟคัท, คูลโทน)"
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-4 py-3 bg-[#F4F2EB] border-b border-neutral-200/80 flex flex-wrap items-center gap-2 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-neutral-200/60 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setActiveTab('makeup')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'makeup' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              เมคอัพ ({searchResults.makeup.length})
            </button>
            <button
              onClick={() => setActiveTab('hairstyle')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'hairstyle' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ทรงผม ({searchResults.hairstyle.length})
            </button>
            <button
              onClick={() => setActiveTab('outfit')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'outfit' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ชุด ({searchResults.outfit.length})
            </button>
            <button
              onClick={() => setActiveTab('occasion')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'occasion' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              โอกาส ({searchResults.occasion.length})
            </button>
            <button
              onClick={() => setActiveTab('festival')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'festival' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              เทศกาล ({searchResults.festival.length})
            </button>
          </div>

          {/* Style Selector */}
          <select
            value={selectedStyleFilter}
            onChange={(e) => setSelectedStyleFilter(e.target.value)}
            className="bg-white border border-neutral-200/80 rounded-xl px-2.5 py-1 text-neutral-700 text-xs focus:outline-hidden"
          >
            <option value="all">ทุกสไตล์ (All Styles)</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Tone Selector */}
          <select
            value={selectedToneFilter}
            onChange={(e) => setSelectedToneFilter(e.target.value)}
            className="bg-white border border-neutral-200/80 rounded-xl px-2.5 py-1 text-neutral-700 text-xs focus:outline-hidden"
          >
            <option value="all">ทุกโทนผิว (All Tones)</option>
            {tones.filter((t) => t !== 'all').map((t) => (
              <option key={t} value={t}>
                {t} Tone
              </option>
            ))}
          </select>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {searchResults.totalCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-sm">ไม่พบข้อมูลที่ตรงกับคำค้นหาหรือตัวกรอง</p>
              <p className="text-neutral-500 text-xs mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองเป็น &quot;ทั้งหมด&quot;</p>
            </div>
          ) : (
            <>
              {/* Makeup Section */}
              {(activeTab === 'all' || activeTab === 'makeup') && searchResults.makeup.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
                    <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-rose-500" />
                      เมคอัพ & พาเลตต์ ({searchResults.makeup.length})
                    </span>
                    <button
                      onClick={() => {
                        navigate('/makeup');
                        onClose();
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      ดูทั้งหมด →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {searchResults.makeup.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate('/makeup');
                          onClose();
                        }}
                        className="p-3 bg-white rounded-2xl border border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-xl shrink-0 shadow-xs border border-white"
                          style={{ backgroundColor: item.hexColor }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-neutral-600 truncate">{item.description}</p>
                          <div className="flex items-center gap-1 text-[10px] text-neutral-600 mt-1">
                            <span>{item.category}</span>
                            <span>·</span>
                            <span>{item.tone}</span>
                            <span>·</span>
                            <span>{item.finish}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hairstyle Section */}
              {(activeTab === 'all' || activeTab === 'hairstyle') && searchResults.hairstyle.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
                    <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-amber-500" />
                      ทรงผมตามรูปหน้า ({searchResults.hairstyle.length})
                    </span>
                    <button
                      onClick={() => {
                        navigate('/hairstyle');
                        onClose();
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      ดูทั้งหมด →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {searchResults.hairstyle.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate('/hairstyle');
                          onClose();
                        }}
                        className="p-3 bg-white rounded-2xl border border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-neutral-900">{item.name}</p>
                          <span className="text-[10px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                            {item.length}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 line-clamp-1 mt-1">{item.description}</p>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-600 mt-2">
                          <span>รูปหน้าที่เหมาะ: {item.suitableFaceShapes.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outfit Section */}
              {(activeTab === 'all' || activeTab === 'outfit') && searchResults.outfit.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
                    <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Shirt className="w-3.5 h-3.5 text-indigo-500" />
                      ชุดเสื้อผ้า & สไตล์ ({searchResults.outfit.length})
                    </span>
                    <button
                      onClick={() => {
                        navigate('/outfits');
                        onClose();
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      ดูทั้งหมด →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {searchResults.outfit.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate('/outfits');
                          onClose();
                        }}
                        className="p-3.5 bg-white rounded-2xl border border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-900">{item.title}</span>
                            <span className="text-[10px] text-rose-600 font-medium">[{item.style}]</span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-1 line-clamp-1">
                            {item.top} + {item.bottom}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.colorPalette.map((hex, i) => (
                            <span
                              key={i}
                              className="w-4 h-4 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Occasion Section */}
              {(activeTab === 'all' || activeTab === 'occasion') && searchResults.occasion.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
                    <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      โอกาสต่างๆ ({searchResults.occasion.length})
                    </span>
                    <button
                      onClick={() => {
                        navigate('/occasion');
                        onClose();
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      ดูทั้งหมด →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {searchResults.occasion.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate('/occasion');
                          onClose();
                        }}
                        className="p-3 bg-white rounded-2xl border border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-neutral-900">{item.nameTh}</p>
                        <p className="text-[10px] text-neutral-600 truncate">{item.nameEn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Festival Section */}
              {(activeTab === 'all' || activeTab === 'festival') && searchResults.festival.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
                    <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      เทศกาล & ฤดูกาล ({searchResults.festival.length})
                    </span>
                    <button
                      onClick={() => {
                        navigate('/festival');
                        onClose();
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      ดูทั้งหมด →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.festival.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate('/festival');
                          onClose();
                        }}
                        className="p-3 bg-white rounded-2xl border border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-neutral-900">{item.nameTh}</p>
                          <span className="text-[10px] text-neutral-600">{item.dateOrSeason}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600 mt-1 line-clamp-1">{item.vibe}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
