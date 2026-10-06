import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  XCircle,
  HelpCircle,
  Unlink,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { EvaluatedRequirement, UploadedFileRecord, DocumentStatusType } from '../types/index.ts';
import { CustomSelect } from './ui/CustomSelect';
import { DatePicker } from './ui/DatePicker';

interface RequirementsTableProps {
  readonly language: Language;
  readonly evaluatedRequirements: readonly EvaluatedRequirement[];
  readonly uploadedFiles: readonly UploadedFileRecord[];
  readonly onMatchFile: (requirementId: string, fileId: string | null) => void;
  readonly onSetExpiryDate: (requirementId: string, date: string) => void;
  readonly duplicateWarningMessage?: string | null;
}

export const RequirementsTable: React.FC<RequirementsTableProps> = ({
  language,
  evaluatedRequirements,
  uploadedFiles,
  onMatchFile,
  onSetExpiryDate,
  duplicateWarningMessage,
}) => {
  const t = translations[language];
  const [filterMode, setFilterMode] = useState<'all' | 'blocking' | 'ok'>('all');

  // Map of matched file IDs by requirement
  const matchedFileIdMap: Record<string, string> = {};
  evaluatedRequirements.forEach((item) => {
    if (item.matchedFile) {
      matchedFileIdMap[item.matchedFile.id] = item.requirement.id;
    }
  });

  const getFileOptions = (reqId: string) => {
    return uploadedFiles.map((f) => {
      const isAlreadyMatchedToOther =
        matchedFileIdMap[f.id] && matchedFileIdMap[f.id] !== reqId;

      return {
        value: f.id,
        label: f.name,
        pageCount: f.pageCount,
        isDuplicate: f.isDuplicate,
        disabled: Boolean(isAlreadyMatchedToOther),
        isMatched: Boolean(isAlreadyMatchedToOther),
      };
    });
  };

  const getStatusBadge = (status: DocumentStatusType) => {
    switch (status) {
      case 'OK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {t.okSuccess}
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            {t.missingError}
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            {t.expiredError}
          </span>
        );
      case 'Expiry date needed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            {t.expiryNeededError}
          </span>
        );
      case 'Not provided':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            {t.notProvidedNotice}
          </span>
        );
    }
  };

  const filteredRequirements = evaluatedRequirements.filter((item) => {
    if (filterMode === 'blocking') return item.isBlocking;
    if (filterMode === 'ok') return item.status === 'OK';
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {t.checklistTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.checklistSubtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl text-xs font-medium self-start sm:self-auto" role="group" aria-label="Filter requirements">
          <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 hidden sm:block" />
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            aria-pressed={filterMode === 'all'}
            className={`px-2.5 py-1 rounded-lg transition-all text-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterAll} ({evaluatedRequirements.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('blocking')}
            aria-pressed={filterMode === 'blocking'}
            className={`px-2.5 py-1 rounded-lg transition-all text-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              filterMode === 'blocking'
                ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterBlocking} (
            {evaluatedRequirements.filter((r) => r.isBlocking).length}
            )
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('ok')}
            aria-pressed={filterMode === 'ok'}
            className={`px-2.5 py-1 rounded-lg transition-all text-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              filterMode === 'ok'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterOk} (
            {evaluatedRequirements.filter((r) => r.status === 'OK').length}
            )
          </button>
        </div>
      </div>

      {duplicateWarningMessage ? (
        <div className="mx-4 sm:mx-6 my-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{duplicateWarningMessage}</span>
        </div>
      ) : null}

      {/* MOBILE VIEW: Adaptive Responsive Cards (No horizontal overflow!) */}
      <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
        {filteredRequirements.map((item) => {
          const req = item.requirement;
          const title = language === 'bn' ? req.title_bn : req.title_en;
          const hasFile = item.matchedFile !== null;

          return (
            <div
              key={req.id}
              className={`p-3.5 rounded-xl border transition-all ${
                item.isBlocking
                  ? 'bg-rose-50/25 border-rose-200/70'
                  : item.status === 'OK'
                  ? 'bg-emerald-50/20 border-emerald-200/60'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              {/* Card Header: Order, Title, Badges */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-800 text-xs font-bold shrink-0 mt-0.5">
                    {req.order}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug">
                      {title}
                    </h3>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {req.id} • {req.mandatory ? (
                        <span className="text-rose-600 font-semibold">{t.mandatory}</span>
                      ) : (
                        <span className="text-slate-500">{t.optional}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="shrink-0">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Card Body: File selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100/80">
                <div className="flex items-center gap-1.5">
                  <CustomSelect
                    id={`mobile-match-${req.id}`}
                    name={`mobile-match-${req.id}`}
                    ariaLabel={`Select file for ${title}`}
                    value={item.matchedFile?.id || ''}
                    onChange={(val) => onMatchFile(req.id, val ? val : null)}
                    placeholder={t.selectFilePlaceholder}
                    options={getFileOptions(req.id)}
                  />

                  {hasFile ? (
                    <button
                      type="button"
                      onClick={() => onMatchFile(req.id, null)}
                      className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0 border border-slate-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      title={t.unmatch}
                      aria-label={`${t.unmatch} ${title}`}
                    >
                      <Unlink className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>

                {/* Expiry Date Row if applicable */}
                {req.has_expiry ? (
                  <div className="flex items-center gap-2 pt-1">
                    <label
                      htmlFor={`mobile-expiry-${req.id}`}
                      className="text-[11px] font-medium text-slate-600 shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {t.expiryDate}:
                    </label>
                    <DatePicker
                      id={`mobile-expiry-${req.id}`}
                      name={`mobile-expiry-${req.id}`}
                      ariaLabel={`Expiry date for ${title}`}
                      value={item.expiryDate || ''}
                      disabled={!hasFile}
                      onChange={(date) => onSetExpiryDate(req.id, date)}
                      hasError={item.status === 'Expired'}
                    />
                  </div>
                ) : null}

                {/* Status Message Text */}
                {item.isBlocking ? (
                  <div className="text-[10px] text-rose-600 font-medium pt-1">
                    {language === 'bn' ? item.statusMessageBn : item.statusMessageEn}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP VIEW: Data Table (clean and spacious for >=768px screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3.5 px-4 w-12 text-center">{t.order}</th>
              <th scope="col" className="py-3.5 px-4 min-w-[200px]">{t.documentTitle}</th>
              <th scope="col" className="py-3.5 px-4 w-24">{t.requirementType}</th>
              <th scope="col" className="py-3.5 px-4 min-w-[240px]">{t.attachedFile}</th>
              <th scope="col" className="py-3.5 px-4 w-16 text-center">{t.pages}</th>
              <th scope="col" className="py-3.5 px-4 min-w-[170px]">{t.expiryDate}</th>
              <th scope="col" className="py-3.5 px-4 min-w-[150px]">{t.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRequirements.map((item) => {
              const req = item.requirement;
              const title = language === 'bn' ? req.title_bn : req.title_en;
              const hasFile = item.matchedFile !== null;

              return (
                <tr
                  key={req.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    item.isBlocking ? 'bg-rose-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-800 text-xs">
                      {req.order}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      ID: {req.id}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {req.mandatory ? (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {t.mandatory}
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {t.optional}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <CustomSelect
                        id={`desktop-match-${req.id}`}
                        name={`desktop-match-${req.id}`}
                        ariaLabel={`Select file for ${title}`}
                        value={item.matchedFile?.id || ''}
                        onChange={(val) => onMatchFile(req.id, val ? val : null)}
                        placeholder={t.selectFilePlaceholder}
                        options={getFileOptions(req.id)}
                      />

                      {hasFile ? (
                        <button
                          type="button"
                          onClick={() => onMatchFile(req.id, null)}
                          className="p-1.5 min-h-[34px] min-w-[34px] flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                          title={t.unmatch}
                          aria-label={`${t.unmatch} ${title}`}
                        >
                          <Unlink className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center text-slate-700 font-medium">
                    {item.matchedFile ? item.matchedFile.pageCount : '-'}
                  </td>

                  <td className="py-3 px-4">
                    {req.has_expiry ? (
                      <DatePicker
                        id={`desktop-expiry-${req.id}`}
                        name={`desktop-expiry-${req.id}`}
                        ariaLabel={`Expiry date for ${title}`}
                        value={item.expiryDate || ''}
                        disabled={!hasFile}
                        onChange={(date) => onSetExpiryDate(req.id, date)}
                        hasError={item.status === 'Expired'}
                      />
                    ) : (
                      <span className="text-slate-500 text-[11px] font-medium">
                        N/A
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div>{getStatusBadge(item.status)}</div>
                    {item.isBlocking ? (
                      <div className="text-[10px] text-rose-700 font-semibold mt-1">
                        {language === 'bn'
                          ? item.statusMessageBn
                          : item.statusMessageEn}
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
