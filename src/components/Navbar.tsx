import React from 'react';
import { Target, CheckSquare, Calendar, Settings, Sun, Moon, Flame } from 'lucide-react';

interface NavbarProps {
  activeTab: 'today' | 'longTerm' | 'history' | 'settings';
  setActiveTab: (tab: 'today' | 'longTerm' | 'history' | 'settings') => void;
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  streakCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  streakCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('today')}>
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 font-bold shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight tracking-tight">
              Goals & Rules
            </h1>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Daily Discipline & Targets
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'today'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Today</span>
          </button>

          <button
            onClick={() => setActiveTab('longTerm')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'longTerm'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Long-Term</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden md:inline">History</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </nav>

        {/* Right Section: Streak Counter & Theme Switcher */}
        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakCount}d Streak</span>
          </div>

          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
