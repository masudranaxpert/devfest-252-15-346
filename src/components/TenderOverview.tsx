import React, { useRef } from 'react';
import { Calendar, Building2, User2, FolderKanban, Upload, FileDown, AlertCircle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { TenderDetails } from '../types/index.ts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface TenderOverviewProps {
  readonly language: Language;
  readonly tender: TenderDetails | null;
  readonly onLoadSample: () => void;
  readonly onImportJson: (file: File) => void;
  readonly loadError?: string | null;
}

export const TenderOverview: React.FC<TenderOverviewProps> = ({
  language,
  tender,
  onLoadSample,
  onImportJson,
  loadError,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportJson(e.target.files[0]);
    }
  };

  return (
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {t.tenderDetails}
          </CardTitle>
          <CardDescription className="mt-0.5 truncate text-slate-500 dark:text-slate-400">
            {tender ? tender.title : t.checklistSubtitle}
          </CardDescription>
        </div>

        {/* Action Buttons for Loading Requirements */}
        <div className="flex items-center gap-2">
          <input
            id="json-requirements-input"
            name="json-requirements-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onLoadSample}
            className="border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100/80 dark:hover:bg-blue-900/50"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t.loadSample}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{t.loadJson}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {loadError ? (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{loadError}</span>
          </div>
        ) : null}

        {tender ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between min-h-[72px] sm:min-h-[80px]">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1 flex items-center gap-1">
                <FolderKanban className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{t.tenderId}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-mono break-all">{tender.tender_id}</div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between min-h-[72px] sm:min-h-[80px]">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{t.procuringEntity}</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 break-words leading-snug" title={tender.procuring_entity}>
                {tender.procuring_entity}
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between min-h-[72px] sm:min-h-[80px]">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1 flex items-center gap-1">
                <User2 className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{t.bidder}</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 break-words leading-snug" title={tender.bidder}>
                {tender.bidder}
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex flex-col justify-between min-h-[72px] sm:min-h-[80px]">
              <div className="text-[10px] sm:text-[11px] font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-0.5 sm:mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>{t.deadline}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 font-mono">
                {tender.submission_deadline}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
            {t.noTenderLoaded}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
