import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { TenderOverview } from './components/TenderOverview';
import { UploadDropzone } from './components/UploadDropzone';
import { RequirementsTable } from './components/RequirementsTable';
import { PreflightPanel } from './components/PreflightPanel';
import { Language, translations } from './i18n/translations';
import { useTenderManager } from './hooks/useTenderManager';
import { generateTenderPackage, downloadPdf } from './lib/pdfPackage';
import { exportChecklistCsv } from './lib/checklistExport';

export const App: React.FC = () => {
  // 1. Language state persisted in localStorage
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('devfest_tender_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('devfest_tender_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  // 2. Tender manager hook
  const {
    tender,
    requirements,
    loadError,
    uploadedFiles,
    uploadError,
    duplicateWarning,
    validation,
    loadSampleData,
    handleFileUpload,
    handleRemoveFile,
    handleImportJson,
    handleMatchFile,
    handleSetExpiryDate,
    handleAutoMatch,
    handleReset,
  } = useTenderManager(language);

  // 3. Package generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // PDF Generation callback
  const handleGeneratePackage = useCallback(async () => {
    if (!tender || !validation.canGenerate) return;
    setIsGenerating(true);

    try {
      const pdfBytes = await generateTenderPackage({
        tender,
        evaluatedRequirements: validation.evaluatedRequirements,
      });

      const fileName = `${tender.tender_id}_Package.pdf`;
      downloadPdf(pdfBytes, fileName);
    } catch (err) {
      alert(`Package generation failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  }, [tender, validation]);

  const handleExportCsv = useCallback(() => {
    if (!tender) return;
    exportChecklistCsv(tender, validation.evaluatedRequirements);
  }, [tender, validation]);

  const totalMandatory = useMemo(() => {
    return requirements.filter((r) => r.mandatory).length;
  }, [requirements]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        tender={tender}
        canGenerate={validation.canGenerate}
        totalIncluded={validation.totalIncludedDocuments}
        totalRequired={totalMandatory}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tender Dossier Overview */}
        <TenderOverview
          language={language}
          tender={tender}
          onLoadSample={loadSampleData}
          onImportJson={handleImportJson}
          loadError={loadError}
        />

        {/* Upload Repository & Dropzone */}
        <UploadDropzone
          language={language}
          uploadedFiles={uploadedFiles}
          onUpload={handleFileUpload}
          onRemove={handleRemoveFile}
          errorMessage={uploadError}
        />

        {/* Requirements Table */}
        <RequirementsTable
          language={language}
          evaluatedRequirements={validation.evaluatedRequirements}
          uploadedFiles={uploadedFiles}
          onMatchFile={handleMatchFile}
          onSetExpiryDate={handleSetExpiryDate}
          duplicateWarningMessage={duplicateWarning}
        />

        {/* Preflight Validation & Package Generator */}
        <PreflightPanel
          language={language}
          tender={tender}
          validation={validation}
          isGenerating={isGenerating}
          onAutoMatch={handleAutoMatch}
          onExportCsv={handleExportCsv}
          onGeneratePackage={handleGeneratePackage}
        />
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>{t.footerNotice} • Masud Rana (ID: 252-15-346)</p>
      </footer>
    </div>
  );
};

export default App;
