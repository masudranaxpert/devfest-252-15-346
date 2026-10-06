import React from 'react';
import { FileText, Sun, Moon, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { TenderDetails } from '../types/index.ts';

interface HeaderProps {
  readonly language: Language;
  readonly onLanguageChange: (lang: Language) => void;
  readonly tender: TenderDetails | null;
  readonly canGenerate: boolean;
  readonly totalIncluded: number;
  readonly totalRequired: number;
  readonly theme: 'light' | 'dark';
  readonly onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  tender,
  canGenerate,
  totalIncluded,
  totalRequired,
  theme,
  onToggleTheme,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        {/* Top bar on all screens */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold border border-blue-200/60 dark:border-blue-800/80 shrink-0">
                  DevFest '26
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Status Pill */}
            {tender ? (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">{tender.tender_id}</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="flex items-center gap-1.5 font-medium">
                  {canGenerate ? (
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {totalIncluded}/{totalRequired} {language === 'bn' ? 'প্রস্তুত' : 'Ready'}
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      {totalIncluded}/{totalRequired} {language === 'bn' ? 'সম্পন্ন' : 'Complete'}
                    </span>
                  )}
                </span>
              </div>
            ) : null}

            {/* Dark / Light Mode Switch */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="min-h-[34px] px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition-all border border-slate-200/80 dark:border-slate-700/80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none flex items-center gap-1.5 active:scale-[0.98]"
              title={theme === 'dark' ? t.lightMode : t.darkMode}
              aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span className="hidden md:inline">
                {theme === 'dark' ? t.lightMode : t.darkMode}
              </span>
            </button>

            {/* Language switch */}
            <div
              className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-xs font-medium items-center"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`min-h-[30px] px-2.5 py-1 rounded-md transition-all text-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-pressed={language === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('bn')}
                className={`min-h-[30px] px-2.5 py-1 rounded-md transition-all text-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  language === 'bn'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-pressed={language === 'bn'}
              >
                বাং
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Status Sub-bar */}
        {tender ? (
          <div className="flex lg:hidden items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono text-[11px] truncate">
              {tender.tender_id}
            </span>
            <div className="flex items-center gap-1.5 font-medium shrink-0">
              {canGenerate ? (
                <span className="text-emerald-700 dark:text-emerald-400 text-[11px] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {totalIncluded}/{totalRequired} {language === 'bn' ? 'প্রস্তুত' : 'Ready'}
                </span>
              ) : (
                <span className="text-amber-700 dark:text-amber-400 text-[11px] flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {totalIncluded}/{totalRequired} {language === 'bn' ? 'সম্পন্ন' : 'Complete'}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};
