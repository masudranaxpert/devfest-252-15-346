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
import { EvaluatedRequirement, UploadedFileRecord, DocumentStatusType } from '../types';

interface RequirementsTableProps {
  language: Language;
  evaluatedRequirements: EvaluatedRequirement[];
  uploadedFiles: UploadedFileRecord[];
  onMatchFile: (requirementId: string, fileId: string | null) => void;
  onSetExpiryDate: (requirementId: string, date: string) => void;
  duplicateWarningMessage?: string | null;
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

  // Set of already matched file IDs by other requirements
  const matchedFileIdMap: Record<string, string> = {};
  evaluatedRequirements.forEach((item) => {
    if (item.matchedFile) {
      matchedFileIdMap[item.matchedFile.id] = item.requirement.id;
    }
  });

  const getStatusBadge = (status: DocumentStatusType) => {
    switch (status) {
      case 'OK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t.okSuccess}
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {t.missingError}
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            {t.expiredError}
          </span>
        );
      case 'Expiry date needed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {t.expiryNeededError}
          </span>
        );
      case 'Not provided':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            {t.checklistTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.checklistSubtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterAll} ({evaluatedRequirements.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('blocking')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterMode === 'blocking'
                ? 'bg-white text-rose-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterBlocking} (
            {evaluatedRequirements.filter((r) => r.isBlocking).length}
            )
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('ok')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterMode === 'ok'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterOk} (
            {evaluatedRequirements.filter((r) => r.status === 'OK').length}
            )
          </button>
        </div>
      </div>

      {duplicateWarningMessage && (
        <div className="mx-6 my-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{duplicateWarningMessage}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 w-12 text-center">{t.order}</th>
              <th className="py-3.5 px-4 min-w-[200px]">{t.documentTitle}</th>
              <th className="py-3.5 px-4 w-24">{t.requirementType}</th>
              <th className="py-3.5 px-4 min-w-[240px]">{t.attachedFile}</th>
              <th className="py-3.5 px-4 w-16 text-center">{t.pages}</th>
              <th className="py-3.5 px-4 min-w-[170px]">{t.expiryDate}</th>
              <th className="py-3.5 px-4 min-w-[150px]">{t.status}</th>
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
                  {/* Order Sequence */}
                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-800 text-xs">
                      {req.order}
                    </span>
                  </td>

                  {/* Document Title */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ID: {req.id}
                    </div>
                  </td>

                  {/* Mandatory / Optional Badge */}
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

                  {/* Attached File Dropdown / Unmatch */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <select
                        aria-label={`Select file for ${title}`}
                        value={item.matchedFile?.id || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          onMatchFile(req.id, val ? val : null);
                        }}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                      >
                        <option value="">-- {t.selectFile} --</option>
                        {uploadedFiles.map((f) => {
                          const isAlreadyMatchedToOther =
                            matchedFileIdMap[f.id] &&
                            matchedFileIdMap[f.id] !== req.id;

                          return (
                            <option
                              key={f.id}
                              value={f.id}
                              disabled={Boolean(isAlreadyMatchedToOther)}
                            >
                              {f.name} ({f.pageCount}p)
                              {isAlreadyMatchedToOther ? ' [Matched]' : ''}
                              {f.isDuplicate ? ' [Duplicate]' : ''}
                            </option>
                          );
                        })}
                      </select>

                      {hasFile && (
                        <button
                          type="button"
                          onClick={() => onMatchFile(req.id, null)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title={t.unmatch}
                          aria-label={`${t.unmatch} ${title}`}
                        >
                          <Unlink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Page Count */}
                  <td className="py-3 px-4 text-center text-slate-700 font-medium">
                    {item.matchedFile ? item.matchedFile.pageCount : '-'}
                  </td>

                  {/* Expiry Date Input */}
                  <td className="py-3 px-4">
                    {req.has_expiry ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                          type="date"
                          aria-label={`Expiry date for ${title}`}
                          value={item.expiryDate || ''}
                          disabled={!hasFile}
                          onChange={(e) =>
                            onSetExpiryDate(req.id, e.target.value)
                          }
                          className={`w-full text-xs rounded-lg py-1 px-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            !hasFile
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : item.status === 'Expired'
                              ? 'border-rose-400 bg-rose-50/50 text-rose-900 font-medium'
                              : 'border-slate-300 bg-white text-slate-800'
                          }`}
                        />
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">
                        N/A
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <div>{getStatusBadge(item.status)}</div>
                    {item.isBlocking && (
                      <div className="text-[10px] text-rose-600 font-medium mt-1">
                        {language === 'bn'
                          ? item.statusMessageBn
                          : item.statusMessageEn}
                      </div>
                    )}
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
