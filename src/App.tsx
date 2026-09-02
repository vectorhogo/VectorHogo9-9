import React, { useState, useEffect } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { RoadmapView } from './components/RoadmapView';
import { LessonsListView } from './components/LessonsListView';
import { LessonDetailView } from './components/LessonDetailView';
import { AnthropicTrackView } from './components/AnthropicTrackView';
import { PlaygroundView } from './components/PlaygroundView';
import { PromptArenaView } from './components/PromptArenaView';
import { ExercisesView } from './components/ExercisesView';
import { ResourceLibraryView } from './components/ResourceLibraryView';
import { ProfileView } from './components/ProfileView';
import { FocusLoungeView } from './components/FocusLoungeView';
import { BenchmarkLabView } from './components/BenchmarkLabView';
import { SmartBreakReminder } from './components/SmartBreakReminder';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ToastContainer } from './components/ToastContainer';

const AppContent: React.FC = () => {
  const { 
    progress, 
    activeLessonId, 
    setActiveLessonId, 
    onboarding, 
    completeOnboarding, 
    toasts, 
    dismissToast 
  } = useProgress();
  
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [playgroundStarterPrompt, setPlaygroundStarterPrompt] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Trigger Onboarding on first launch if not yet completed or skipped
  useEffect(() => {
    if (!onboarding.completed && !onboarding.skipped) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [onboarding.completed, onboarding.skipped]);

  // Sync sidebar collapse when focus mode is toggled
  useEffect(() => {
    if (progress.focusModeEnabled) {
      setIsSidebarCollapsed(true);
    }
  }, [progress.focusModeEnabled]);

  // Global hotkey listeners: Ctrl+K for search, ? for shortcuts helper
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K -> Global Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      // ? or Shift + ? -> Open Shortcuts helper (when not typing in an input/textarea)
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string, lessonId?: string, starterPrompt?: string) => {
    if (starterPrompt) {
      setPlaygroundStarterPrompt(starterPrompt);
    }
    if (view === 'lesson' && lessonId) {
      setActiveLessonId(lessonId);
      setActiveView('lesson');
    } else {
      setActiveView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Immersive UI Background Ambient Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] pointer-events-none -z-0" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-cyan-400/5 blur-[100px] pointer-events-none -z-0" />
      {progress.focusModeEnabled && (
        <div className="fixed inset-0 pointer-events-none border-2 border-violet-500/20 z-50 animate-pulse" />
      )}

      {/* Top Sticky Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full relative z-10">
        
        {/* Right Sidebar (RTL) */}
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Main Workspace Area & Site Footer */}
        <div
          className={`flex-1 flex flex-col min-h-[calc(100vh-65px)] transition-all duration-300 ${
            isSidebarCollapsed ? 'md:mr-20' : 'md:mr-64'
          }`}
        >
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 max-w-[1720px] mx-auto w-full">
            {activeView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
            {activeView === 'roadmap' && <RoadmapView onNavigate={handleNavigate} />}
            {activeView === 'lessons' && <LessonsListView onNavigate={handleNavigate} />}
            {activeView === 'lesson' && <LessonDetailView lessonId={activeLessonId} onNavigate={handleNavigate} />}
            {activeView === 'anthropic' && <AnthropicTrackView />}
            {activeView === 'playground' && <PlaygroundView initialPrompt={playgroundStarterPrompt} onNavigate={handleNavigate} />}
            {activeView === 'arena' && <PromptArenaView />}
            {activeView === 'exercises' && <ExercisesView />}
            {activeView === 'resources' && <ResourceLibraryView />}
            {activeView === 'profile' && <ProfileView />}
            {activeView === 'benchmark' && <BenchmarkLabView onNavigate={handleNavigate} />}
            {activeView === 'lounge' && <FocusLoungeView onNavigate={handleNavigate} />}
            {/* Safe Fallback for Unknown Views */}
            {!['dashboard', 'roadmap', 'lessons', 'lesson', 'anthropic', 'playground', 'arena', 'exercises', 'resources', 'profile', 'benchmark', 'lounge'].includes(activeView) && (
              <DashboardView onNavigate={handleNavigate} />
            )}
          </main>

          {/* Site Footer */}
          <footer
            id="promptlab-site-footer"
            className="w-full border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 mt-auto"
          >
            <div className="max-w-[1720px] mx-auto flex flex-col items-center justify-center">
              {/* Creator Signature Easter Egg */}
              <div
                id="footer-creator-signature"
                dir="rtl"
                className="group inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-vazir text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10 hover:bg-white/[0.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.12),0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 cursor-default select-none whitespace-nowrap"
              >
                <span className="text-gray-500 group-hover:text-gray-400 transition-colors">
                  ساخته شده با عشق برای
                </span>
                <span
                  dir="ltr"
                  className="font-mono text-gray-400 group-hover:text-cyan-400 font-medium px-1 transition-colors inline-block"
                >
                  Nix
                </span>
                <span className="text-gray-500 group-hover:text-gray-400 transition-colors">
                  از طرف
                </span>
                <span
                  dir="ltr"
                  className="font-mono text-gray-400 group-hover:text-violet-400 font-medium px-1 transition-colors inline-block tracking-wider"
                >
                  V3CT0R
                </span>
                <span className="text-red-500/80 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 inline-block text-xs mr-0.5">
                  ❤️
                </span>
              </div>
            </div>
          </footer>
        </div>

      </div>

      {/* Smart Break Suggestion Notification */}
      <SmartBreakReminder onTakeBreak={() => handleNavigate('lounge')} />

      {/* Global Search & Command Palette Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onOpenSettings={() => {
          setIsSearchOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      {/* Settings & Data Management Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRestartOnboarding={() => {
          setIsSettingsOpen(false);
          setIsOnboardingOpen(true);
        }}
      />

      {/* Global Keyboard Shortcuts Helper Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Onboarding Guide Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(state, targetLessonId) => {
          completeOnboarding(state, targetLessonId);
          setIsOnboardingOpen(false);
          if (targetLessonId) {
            handleNavigate('lesson', targetLessonId);
          }
        }}
        onSkip={() => {
          completeOnboarding({ completed: true, skipped: true });
          setIsOnboardingOpen(false);
        }}
      />

      {/* Toast Feedback Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
};

export function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}

export default App;
