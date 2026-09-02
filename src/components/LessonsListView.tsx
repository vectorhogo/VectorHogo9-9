import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Check
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import { DifficultyLevel } from '../types';

interface LessonsListViewProps {
  onNavigate: (view: string, lessonId?: string) => void;
}

export const LessonsListView: React.FC<LessonsListViewProps> = ({ onNavigate }) => {
  const { progress, isLessonCompleted } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('همه');
  const [selectedLevelId, setSelectedLevelId] = useState<number | 'all'>('all');

  // Flatten all lessons with their parent level
  const allLessons = CURRICULUM_LEVELS.flatMap((lvl) => 
    lvl.lessons.map((lesson) => ({
      ...lesson,
      levelCode: lvl.code,
      levelTitle: lvl.title
    }))
  );

  const filteredLessons = allLessons.filter((lesson) => {
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.concept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = selectedDifficulty === 'همه' || lesson.difficulty === selectedDifficulty;
    const matchesLevel = selectedLevelId === 'all' || lesson.levelId === selectedLevelId;

    return matchesSearch && matchesDifficulty && matchesLevel;
  });

  const difficulties: ('همه' | DifficultyLevel)[] = ['همه', 'مقدماتی', 'متوسط', 'پیشرفته', 'حرفه‌ای'];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-cyan-400">CURRICULUM REPOSITORY</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">{allLessons.length} درس تخصصی مهندسی</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            فهرست و بانک جامع درس‌ها
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            دسترسی مستقیم به تمامی دروس آموزشی همراه با مقایسه پرامپت‌ها، تمرین‌ها و سناریوهای تجاری.
          </p>
        </div>

        {/* Quick progress counter */}
        <div className="bg-[#141414] px-4 py-2.5 rounded-2xl border border-white/10 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-300 font-medium">
            {progress.completedLessons.length} از {allLessons.length} درس پاس شده
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#141414] p-4 rounded-3xl border border-white/5">
        
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس عنوان یا مفهوم..."
            className="w-full pr-10 pl-4 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        {/* Level Filter */}
        <div>
          <select
            value={selectedLevelId}
            onChange={(e) => setSelectedLevelId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-[#0d0d0d] border border-white/10 rounded-2xl text-xs text-gray-200 focus:outline-none focus:border-cyan-400/50"
          >
            <option value="all">تمام سطوح (۱۲ سطح)</option>
            {CURRICULUM_LEVELS.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.code}: {lvl.title}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_10px_rgba(124,58,237,0.2)]'
                  : 'bg-[#0d0d0d] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => {
          const isDone = isLessonCompleted(lesson.id);

          return (
            <div
              key={lesson.id}
              onClick={() => onNavigate('lesson', lesson.id)}
              className={`bg-[#141414] hover:bg-[#1a1a1a] border ${
                isDone ? 'border-emerald-500/30' : 'border-white/5 hover:border-white/10'
              } p-6 rounded-3xl flex flex-col justify-between cursor-pointer group transition-all duration-300`}
            >
              <div className="space-y-3">
                
                {/* Badges */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                    {lesson.levelCode}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {lesson.difficulty}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        تکمیل
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {lesson.englishTitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {lesson.shortDescription}
                </p>
              </div>

              {/* Bottom Footer */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  {lesson.duration}
                </span>

                <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <span>مشاهده و تمرین</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-16 bg-[#141414] rounded-3xl border border-white/5">
          <BookOpen className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">درسی با این مشخصات یافت نشد</h3>
          <p className="text-xs text-gray-400 mt-1">لطفاً فیلترهای جستجو را بازنشانی کنید.</p>
        </div>
      )}

    </div>
  );
};
