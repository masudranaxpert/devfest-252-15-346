import React from 'react';
import { FileText, Globe, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { TenderDetails } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  tender: TenderDetails | null;
  canGenerate: boolean;
  totalIncluded: number;
  totalRequired: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  tender,
  canGenerate,
  totalIncluded,
  totalRequired,
  onReset,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-blue-700/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {t.appTitle}
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                AI DevFest '26
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Controls */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {tender && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">{tender.tender_id}</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5 font-medium">
                {canGenerate ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {totalIncluded}/{totalRequired} Ready
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {totalIncluded}/{totalRequired} Completed
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors border border-slate-200/80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none flex items-center gap-1.5"
            title={t.resetAll}
            aria-label={t.resetAll}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.resetAll}</span>
          </button>

          {/* Language Switcher */}
          <div
            className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-medium"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={language === 'en'}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('bn')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'bn'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={language === 'bn'}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
