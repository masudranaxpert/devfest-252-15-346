import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, Copy, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { UploadedFileRecord } from '../types';

interface UploadDropzoneProps {
  language: Language;
  uploadedFiles: UploadedFileRecord[];
  onUpload: (files: FileList | File[]) => void;
  onRemove: (fileId: string) => void;
  errorMessage?: string | null;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  language,
  uploadedFiles,
  onUpload,
  onRemove,
  errorMessage,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            {t.uploadFiles}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.supportedFormat}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {uploadedFiles.length} / 30 Files
        </span>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t.dragDropText}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".pdf,application/pdf"
          onChange={(e) => {
            if (e.target.files) onUpload(e.target.files);
          }}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            {t.dragDropText}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Accepts: PDF documents up to 50MB total.
          </p>
        </div>
      </div>

      {/* Uploaded File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-slate-500" />
            {t.uploadedFilesTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {uploadedFiles.map((f) => {
              const origFile = f.duplicateOf
                ? uploadedFiles.find(item => item.id === f.duplicateOf)
                : null;

              return (
                <div
                  key={f.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                    f.isDuplicate
                      ? 'bg-amber-50/40 border-amber-300/80 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${f.isDuplicate ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      <File className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate" title={f.name}>
                        {f.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5 font-medium text-slate-700">
                          <Layers className="w-3 h-3 text-slate-400" />
                          {f.pageCount} {f.pageCount === 1 ? 'page' : 'pages'}
                        </span>
                        <span>•</span>
                        <span>{formatFileSize(f.size)}</span>
                      </div>
                      {f.isDuplicate && (
                        <div className="text-[10px] font-bold text-amber-700 mt-1 flex items-center gap-1">
                          <Copy className="w-2.5 h-2.5" />
                          <span>{t.duplicateWarning}</span>
                          {origFile && <span className="font-normal opacity-80 truncate">({origFile.name})</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(f.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title={t.removeFile}
                    aria-label={`${t.removeFile} ${f.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
