import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Layers,
  Loader2,
  Wand2,
  ShieldCheck,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { PackageValidationResult, TenderDetails } from '../types';

export interface PreflightPanelProps {
  readonly language: Language;
  readonly tender: TenderDetails | null;
  readonly validation: PackageValidationResult;
  readonly isGenerating: boolean;
  readonly onAutoMatch: () => void;
  readonly onExportCsv: () => void;
  readonly onGeneratePackage: () => void;
}

export const PreflightPanel: React.FC<PreflightPanelProps> = ({
  language,
  tender,
  validation,
  isGenerating,
  onAutoMatch,
  onExportCsv,
  onGeneratePackage,
}) => {
  const t = translations[language];
  const { canGenerate, totalIncludedDocuments, totalEstimatedPages, blockingReasonsEn, blockingReasonsBn } = validation;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Summary Metrics */}
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            {t.statusSummary}
          </h2>
          <div className="flex items-center gap-3 sm:gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-bold text-slate-900 text-sm">{totalIncludedDocuments}</span>
              <span>{t.totalDocs}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-900 text-sm">{totalEstimatedPages}</span>
              <span>{t.totalPagesEst}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onAutoMatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
            {t.autoMatch}
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            disabled={!tender}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            {t.exportCsv}
          </button>

          <button
            type="button"
            onClick={onGeneratePackage}
            disabled={!canGenerate || isGenerating}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
              canGenerate && !isGenerating
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t.generatePackage}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Compliance Status Details */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        {!canGenerate ? (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-800 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.blockingNotice}</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-amber-900/90 pl-1">
              {(language === 'bn' ? blockingReasonsBn : blockingReasonsEn).slice(0, 5).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
              {blockingReasonsEn.length > 5 ? (
                <li className="italic text-amber-700">
                  +{blockingReasonsEn.length - 5} {language === 'bn' ? 'টি আরও সমস্যা...' : 'more issues...'}
                </li>
              ) : null}
            </ul>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.allClearNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
