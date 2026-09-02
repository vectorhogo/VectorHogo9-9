import React, { useState } from 'react';
import { PromptTemplate } from '../../types';
import { PLAYGROUND_TEMPLATES } from '../../data/playgroundTemplates';
import { 
  Bookmark, 
  Search, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Filter, 
  Sparkles,
  TrendingUp,
  FileText,
  Code2,
  Database,
  BookOpen,
  Briefcase,
  GraduationCap,
  BarChart2,
  Share2,
  Zap,
  Bot
} from 'lucide-react';

interface PromptTemplateLibraryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

const CATEGORIES = [
  'همه',
  'بازاریابی و رشد',
  'نویسندگی و تولید محتوا',
  'برنامه‌نویسی و معماری',
  'پژوهش و تحلیل مقالات',
  'کسب‌وکار و مدیریت محصول',
  'آموزش و یادگیری عمیق',
  'تحلیل داده و هوش تجاری',
  'سوشال مدیا و ترندها',
  'بهره‌وری و اتوماسیون',
  'طراحی دستیار هوشمند و Agent'
];

export const PromptTemplateLibrary: React.FC<PromptTemplateLibraryProps> = ({
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = PLAYGROUND_TEMPLATES.filter(tpl => {
    const matchCategory = selectedCategory === 'همه' || tpl.categoryFa === selectedCategory;
    const matchSearch = 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header & Search */}
      <div className="p-4 bg-[#16161c] border-b border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">کتابخانه الگوهای مهندسی پرامپت (Templates)</h3>
              <p className="text-[11px] text-white/50">بیش از ۱۰ دسته‌بندی تخصصی با متغیرهای آماده</p>
            </div>
          </div>

          <span className="text-xs font-mono text-white/40">
            {filteredTemplates.length} الگو در دسترس
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام الگو، کاربرد یا تگ‌ها (مثلاً: B2B, Code, SEO)..."
            className="w-full pr-9 pl-4 py-2 rounded-xl bg-[#0c0c10] border border-white/10 text-xs text-white placeholder:text-white/30 focus:border-pink-500/50 outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all text-[11px] ${
                selectedCategory === cat
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-xs space-y-2">
            <Filter className="w-8 h-8 mx-auto text-white/20" />
            <p>هیچ الگویی با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-xl bg-[#14141a] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        {template.categoryFa}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1.5 group-hover:text-pink-300 transition-colors">
                        {template.title}
                      </h4>
                      <p className="text-[10px] font-mono text-white/40">{template.englishTitle}</p>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/60 font-mono">
                      {template.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 font-vazir leading-relaxed line-clamp-2">
                    {template.useCase}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {template.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                  <button
                    onClick={() => handleCopy(template.id, template.template)}
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    {copiedId === template.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی الگو</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-500/15 text-pink-300 hover:bg-pink-500/25 border border-pink-500/30 text-xs font-medium transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>باز کردن در پلی‌گراند</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
