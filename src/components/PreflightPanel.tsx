import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileDown,
  FileSpreadsheet,
  Layers,
  Loader2,
  GitMerge,
  ShieldCheck,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { PackageValidationResult, TenderDetails } from '../types/index.ts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';

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
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {t.statusSummary}
          </CardTitle>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono">{totalIncludedDocuments}</span>
              <span>{t.totalDocs}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono">{totalEstimatedPages}</span>
              <span>{t.totalPagesEst}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAutoMatch}
          >
            <GitMerge className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t.autoMatch}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            disabled={!tender}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.exportCsv}</span>
          </Button>

          <Button
            type="button"
            variant={canGenerate ? 'default' : 'secondary'}
            size="sm"
            onClick={onGeneratePackage}
            disabled={!canGenerate || isGenerating}
            className={`w-full sm:w-auto font-bold ${
              canGenerate
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                : 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>{t.generatePackage}</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {!canGenerate ? (
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t.blockingNotice}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 dark:text-amber-200/90 pl-1">
              {(language === 'bn' ? blockingReasonsBn : blockingReasonsEn).slice(0, 5).map((reason) => (
                <li key={reason} className="leading-relaxed">{reason}</li>
              ))}
              {blockingReasonsEn.length > 5 ? (
                <li className="italic text-amber-700 dark:text-amber-400">
                  +{blockingReasonsEn.length - 5} {language === 'bn' ? 'টি আরও সমস্যা...' : 'more issues...'}
                </li>
              ) : null}
            </ul>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t.allClearNotice}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
