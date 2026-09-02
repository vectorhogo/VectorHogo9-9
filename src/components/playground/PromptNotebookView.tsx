import React, { useState } from 'react';
import { SavedPrompt, PromptCollection, PromptExperiment, PromptNote } from '../../types';
import { 
  BookMarked, 
  Folder, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Tag, 
  FileText,
  FlaskConical,
  FolderPlus
} from 'lucide-react';

interface PromptNotebookViewProps {
  savedPrompts: SavedPrompt[];
  collections?: PromptCollection[];
  experiments?: PromptExperiment[];
  notes?: PromptNote[];
  onLoadPrompt: (prompt: SavedPrompt) => void;
  onDeletePrompt: (id: string) => void;
  onCreateNote?: (note: Omit<PromptNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteNote?: (id: string) => void;
  onCreateCollection?: (title: string) => void;
}

export const PromptNotebookView: React.FC<PromptNotebookViewProps> = ({
  savedPrompts,
  collections = [],
  experiments = [],
  notes = [],
  onLoadPrompt,
  onDeletePrompt,
  onCreateNote,
  onDeleteNote,
  onCreateCollection
}) => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'experiments' | 'notes'>('prompts');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showAddCollection, setShowAddCollection] = useState(false);

  const filteredPrompts = savedPrompts.filter(p => {
    const matchCol = !selectedCollectionId || p.collectionId === selectedCollectionId;
    const matchSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCol && matchSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim() || !onCreateNote) return;
    onCreateNote({
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tags: ['Prompting', 'Insights']
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNote(false);
  };

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !onCreateCollection) return;
    onCreateCollection(newCollectionName.trim());
    setNewCollectionName('');
    setShowAddCollection(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#16161c] border-b border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">دفترچه پرامپت مهندسی (Prompt Notebook)</h3>
              <p className="text-[11px] text-white/50">آرشیو شخصی پرامپت‌ها، یادداشت‌ها و آزمایش‌های ثبت‌شده</p>
            </div>
          </div>

          {/* Sub-tabs: Prompts / Experiments / Notes */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0c0c10] border border-white/5">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                activeTab === 'prompts' ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              پرامپت‌ها ({savedPrompts.length})
            </button>
            <button
              onClick={() => setActiveTab('experiments')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                activeTab === 'experiments' ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              آزمایش‌ها ({experiments.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                activeTab === 'notes' ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              یادداشت‌ها ({notes.length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در آرشیو نوت‌بوک..."
            className="w-full pr-9 pl-4 py-2 rounded-xl bg-[#0c0c10] border border-white/10 text-xs text-white placeholder:text-white/30 focus:border-indigo-500/50 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'prompts' && (
          <div className="space-y-4">
            {/* Prompts Grid */}
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12 text-white/40 text-xs space-y-2">
                <BookMarked className="w-8 h-8 mx-auto text-white/20" />
                <p>هیچ پرامپتی ذخیره نشده است. در پلی‌گراند دکمه «ذخیره پرامپت» را بزنید.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredPrompts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#14141a] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{p.title}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{p.createdAt}</span>
                        </div>
                      </div>

                      <p className="text-xs text-white/60 font-mono leading-relaxed line-clamp-3 bg-[#0a0a0d] p-2.5 rounded-lg border border-white/5" dir="auto">
                        {p.userPrompt}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {p.tags?.map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 font-mono">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                      <button
                        onClick={() => onDeletePrompt(p.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(p.id, p.userPrompt)}
                          className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
                        >
                          {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === p.id ? 'کپی شد' : 'کپی'}</span>
                        </button>

                        <button
                          onClick={() => onLoadPrompt(p)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-medium transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>بارگذاری در ادیتور</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="space-y-3">
            {experiments.length === 0 ? (
              <div className="text-center py-12 text-white/40 text-xs space-y-2">
                <FlaskConical className="w-8 h-8 mx-auto text-white/20" />
                <p>هنوز آزمایشی ذخیره نشده است. در تب «آزمایشگاه A/B» آزمایش‌های خود را ثبت کنید.</p>
              </div>
            ) : (
              experiments.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-[#14141a] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-teal-300">{exp.title}</h4>
                    <span className="text-[10px] font-mono text-white/40">{exp.createdAt}</span>
                  </div>
                  <p className="text-xs text-white/80 font-vazir"><strong>فرضیه:</strong> {exp.hypothesis}</p>
                  <p className="text-xs text-emerald-300/90 font-vazir"><strong>نتیجه و یادگیری:</strong> {exp.learnings}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddNote(!showAddNote)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>یادداشت جدید</span>
              </button>
            </div>

            {showAddNote && (
              <form onSubmit={handleSaveNote} className="p-4 rounded-xl bg-[#14141a] border border-white/10 space-y-3">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="عنوان نکته یا تکنیک..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0a0d] border border-white/10 text-xs text-white outline-none"
                />
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  placeholder="متن یادداشت، درس‌آموخته یا قانون پرامپت‌نویسی..."
                  className="w-full p-2.5 rounded-lg bg-[#0a0a0d] border border-white/10 text-xs text-white outline-none resize-none font-vazir"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-medium"
                  >
                    ذخیره یادداشت
                  </button>
                </div>
              </form>
            )}

            {notes.length === 0 && !showAddNote ? (
              <div className="text-center py-12 text-white/40 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-white/20" />
                <p>یادداشتی ثبت نشده است.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl bg-[#14141a] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{note.title}</h4>
                    {onDeleteNote && (
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-white/30 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-white/70 font-vazir leading-relaxed">{note.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
