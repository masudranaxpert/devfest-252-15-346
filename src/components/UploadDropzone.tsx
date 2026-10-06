import React, { useRef, useState } from 'react';
import { FileUp, FileText, Trash2, Files, AlertCircle, Layers } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { UploadedFileRecord } from '../types/index.ts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface UploadDropzoneProps {
  readonly language: Language;
  readonly uploadedFiles: readonly UploadedFileRecord[];
  readonly onUpload: (files: FileList | File[]) => void;
  readonly onRemove: (fileId: string) => void;
  readonly errorMessage?: string | null;
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
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {t.uploadFiles}
          </CardTitle>
          <CardDescription className="mt-0.5 text-slate-500 dark:text-slate-400">
            {t.supportedFormat}
          </CardDescription>
        </div>
        <Badge variant="secondary" className="font-mono">
          {uploadedFiles.length} / 30 Files
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {errorMessage ? (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

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
          className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
          }`}
        >
          <input
            id="file-dropzone-input"
            name="file-dropzone-input"
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
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
              <FileUp className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t.dragDropText}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t.supportedFormat}
            </p>
          </div>
        </div>

        {/* Uploaded File List */}
        {uploadedFiles.length > 0 ? (
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{t.uploadedFilesTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {uploadedFiles.map((f) => {
                const origFile = f.duplicateOf
                  ? uploadedFiles.find((item) => item.id === f.duplicateOf)
                  : null;

                return (
                  <div
                    key={f.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                      f.isDuplicate
                        ? 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          f.isDuplicate
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'
                            : 'bg-blue-100/70 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate" title={f.name}>
                          {f.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="flex items-center gap-0.5 font-medium text-slate-700 dark:text-slate-300">
                            <Layers className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            {f.pageCount} {t.pageCountLabel}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(f.size)}</span>
                        </div>
                        {f.isDuplicate ? (
                          <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 flex items-center gap-1 truncate">
                            <Files className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">
                              {t.duplicateWarning} {origFile ? `(${origFile.name})` : ''}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(f.id);
                      }}
                      className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 shrink-0"
                      title={t.removeFile}
                      aria-label={`${t.removeFile} ${f.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
