import React, { useState } from 'react';
import { 
  Library, 
  Search, 
  ExternalLink, 
  Bookmark, 
  Tag, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Check, 
  ShieldCheck,
  Filter
} from 'lucide-react';
import { CURATED_RESOURCES } from '../data/resources';
import { ResourceCategory, DifficultyLevel, ResourceItem } from '../types';

export const ResourceLibraryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('همه');

  const categories: ('همه' | ResourceCategory)[] = [
    'همه',
    'مهندسی پرامپت',
    'مبانی هوش مصنوعی',
    'مدل‌های زبانی بزرگ',
    'مهندسی کانتکست',
    'ایجنت‌های هوشمند',
    'ارزیابی پرامپت',
    'کدنویسی با AI',
    'تولید تصویر با AI',
    'اتوماسیون با AI'
  ];

  const difficulties: ('همه' | DifficultyLevel)[] = ['همه', 'مقدماتی', 'متوسط', 'پیشرفته', 'حرفه‌ای'];

  const filteredResources = CURATED_RESOURCES.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'همه' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'همه' || item.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-cyan-400">CURATED RESOURCE DIRECTORY</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">۹ دسته‌بندی مرجع و آکادمیک</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            کتابخانه و مراجع منتخب هوش مصنوعی
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            مستندات معتبر، مقالات بنیادین، گیت‌هاب‌های رسمی و ابزارهای استاندارد صنعت مهندسی هوش مصنوعی.
          </p>
        </div>

        <div className="bg-[#141414] px-4 py-2.5 rounded-2xl border border-white/5 text-xs text-gray-300 flex items-center gap-2">
          <Library className="w-4 h-4 text-cyan-400" />
          <span>{CURATED_RESOURCES.length} منبع معتبر بازبینی‌شده</span>
        </div>
      </div>

      {/* Category Filter Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#141414] p-4 rounded-3xl border border-white/5">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام مقالات، سازمان‌ها (Anthropic, OpenAI, Stanford) یا برچسب‌ها..."
            className="w-full pr-10 pl-4 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        {/* Difficulty Selector */}
        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-2xl text-xs text-gray-200 focus:outline-none focus:border-cyan-400/50"
          >
            <option value="همه">همه سطوح سختی</option>
            {difficulties.filter((d) => d !== 'همه').map((diff) => (
              <option key={diff} value={diff}>
                سطح: {diff}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-[#141414] border border-white/5 hover:border-white/10 hover:bg-[#1a1a1a] p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300"
          >
            <div className="space-y-3">
              
              {/* Top Tags */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                  {item.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {item.isOfficial && (
                    <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                      رسمی
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {item.difficulty}
                  </span>
                </div>
              </div>

              {/* Title & English */}
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5 line-clamp-1">
                  {item.englishTitle}
                </p>
              </div>

              {/* Source badge */}
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <span className="text-gray-500">منبع:</span>
                <span className="font-semibold text-gray-300">{item.source}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                {item.shortDescription}
              </p>

              {/* Keyword Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#0d0d0d] border border-white/5 text-gray-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Direct Link Action */}
            <div className="pt-4 mt-4 border-t border-white/5">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#0d0d0d] hover:bg-cyan-400/10 border border-white/5 hover:border-cyan-400/30 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>مشاهده منبع آنلاین</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-16 bg-[#141414] rounded-3xl border border-white/5">
          <Library className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">منبعی با این فیلترها یافت نشد</h3>
          <p className="text-xs text-gray-400 mt-1">دسته‌بندی یا کلمات جستجو را تغییر دهید.</p>
        </div>
      )}

    </div>
  );
};
