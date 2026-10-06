import React, { useRef } from 'react';
import { Calendar, Building, User, Tag, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { TenderDetails } from '../types';

interface TenderOverviewProps {
  language: Language;
  tender: TenderDetails | null;
  onLoadSample: () => void;
  onImportJson: (file: File) => void;
  loadError?: string | null;
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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            {t.tenderDetails}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tender ? tender.title : t.checklistSubtitle}
          </p>
        </div>

        {/* Action Buttons for Loading Requirements */}
        <div className="flex items-center flex-wrap gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {t.loadSample}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            {t.loadJson}
          </button>
        </div>
      </div>

      {loadError && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{loadError}</span>
        </div>
      )}

      {tender ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-slate-400" />
              {t.tenderId}
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">{tender.tender_id}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building className="w-3 h-3 text-slate-400" />
              {t.procuringEntity}
            </div>
            <div className="text-sm font-semibold text-slate-900 truncate" title={tender.procuring_entity}>
              {tender.procuring_entity}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-400" />
              {t.bidder}
            </div>
            <div className="text-sm font-semibold text-slate-900 truncate" title={tender.bidder}>
              {tender.bidder}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-amber-700" />
              {t.deadline}
            </div>
            <div className="text-sm font-bold text-amber-900 font-mono flex items-center gap-2">
              {tender.submission_deadline}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                Target
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-xs">
          No tender requirements loaded yet. Click "{t.loadSample}" or upload requirements.json.
        </div>
      )}
    </div>
  );
};
