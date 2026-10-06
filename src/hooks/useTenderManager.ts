import { useState, useEffect, useMemo, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  TenderDetails,
  Requirement,
  UploadedFileRecord,
  PackageValidationResult,
} from '../types/index.ts';
import { computeHash, identifyDuplicates, validateDuplicateMatch } from '../lib/duplicateEngine.ts';
import { validateRequirementsJson, validateUploadedFile } from '../lib/validation.ts';
import { evaluateTenderPackage } from '../lib/statusEngine.ts';
import { suggestMatches } from '../lib/autoMatcher.ts';

const SAMPLE_DOC_NAMES = [
  '01_financial_proposal.pdf',
  '02_technical_proposal.pdf',
  '03_tin_certificate.pdf',
  '04_vat_certificate.pdf',
  'bank_solvency.pdf',
  'experience_cert.pdf',
  'experience_cert (1).pdf',
  'scan_0042.pdf',
  'trade_license_2025.pdf',
  'trade_license_2026.pdf',
] as const;

export function useTenderManager(language: 'en' | 'bn') {
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileRecord[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const [matches, setMatches] = useState<Record<string, string | null>>({});
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});

  // Parallel loading of sample documents (eliminating waterfalls)
  const loadSampleDocuments = useCallback(async () => {
    try {
      const fetchPromises = SAMPLE_DOC_NAMES.map(async (name) => {
        try {
          const res = await fetch(`./data/documents/${name}`);
          if (!res.ok) return null;
          const arrayBuf = await res.arrayBuffer();
          const bytes = new Uint8Array(arrayBuf);
          const [hash, pdfDoc] = await Promise.all([
            computeHash(arrayBuf),
            PDFDocument.load(bytes),
          ]);
          const pageCount = pdfDoc.getPageCount();
          const fileBlob = new Blob([bytes], { type: 'application/pdf' });
          const file = new File([fileBlob], name, { type: 'application/pdf' });

          return {
            id: `sample-${name}`,
            file,
            name,
            size: bytes.length,
            pageCount,
            hash,
            isDuplicate: false,
            bytes,
          } as UploadedFileRecord;
        } catch {
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      const validRecords = results.filter((r): r is UploadedFileRecord => r !== null);
      if (validRecords.length > 0) {
        setUploadedFiles(identifyDuplicates(validRecords));
      }
    } catch {
      // Ignore background sample doc fetch error
    }
  }, []);

  // Load sample tender configuration
  const loadSampleData = useCallback(async () => {
    try {
      setLoadError(null);
      const res = await fetch('./data/requirements.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const validation = validateRequirementsJson(data);

      if (!validation.valid || !validation.config) {
        setLoadError(
          language === 'bn'
            ? validation.errors[0]?.messageBn || 'ভুল স্কিমা'
            : validation.errors[0]?.messageEn || 'Invalid schema'
        );
        return;
      }

      setTender(validation.config.tender);
      setRequirements(validation.config.requirements);
      await loadSampleDocuments();
    } catch (err) {
      setLoadError(
        language === 'bn'
          ? 'নমুনা ডেটা লোড করতে ব্যর্থ হয়েছে।'
          : err instanceof Error ? err.message : 'Failed to load sample'
      );
    }
  }, [loadSampleDocuments, language]);

  // Initial load
  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  // Upload handler with parallel processing
  const handleFileUpload = useCallback(
    async (fileList: FileList | File[]) => {
      setUploadError(null);
      const filesArray = Array.from(fileList);

      let currentTotalBytes = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
      let currentCount = uploadedFiles.length;

      const validFilesToProcess: File[] = [];

      for (const file of filesArray) {
        const val = validateUploadedFile(file, currentCount, currentTotalBytes);
        if (!val.valid) {
          setUploadError(language === 'bn' ? val.errorBn! : val.errorEn!);
          continue;
        }
        validFilesToProcess.push(file);
        currentCount++;
        currentTotalBytes += file.size;
      }

      // Parallel processing of valid files
      const parsedRecords = await Promise.all(
        validFilesToProcess.map(async (file) => {
          try {
            const arrayBuf = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuf);
            // Load PDF without ignoreEncryption so password-protected PDFs are rejected
            const [hash, pdfDoc] = await Promise.all([
              computeHash(arrayBuf),
              PDFDocument.load(bytes),
            ]);
            const pageCount = pdfDoc.getPageCount();

            return {
              id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              file,
              name: file.name,
              size: file.size,
              pageCount,
              hash,
              isDuplicate: false,
              bytes,
            } as UploadedFileRecord;
          } catch {
            return null;
          }
        })
      );

      const validProcessed = parsedRecords.filter((r): r is UploadedFileRecord => r !== null);
      if (validProcessed.length < validFilesToProcess.length) {
        setUploadError(
          language === 'bn'
            ? 'কিছু ফাইল ক্ষতিগ্রস্ত অথবা এনক্রিপ্টেড হওয়ায় প্রসেস করা সম্ভব হয়নি।'
            : 'Some files could not be parsed (corrupted or password-protected).'
        );
      }

      if (validProcessed.length > 0) {
        setUploadedFiles((prev) => identifyDuplicates([...prev, ...validProcessed]));
      }
    },
    [uploadedFiles, language]
  );

  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => identifyDuplicates(prev.filter((f) => f.id !== fileId)));
    setMatches((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(next)) {
        if (v === fileId) next[k] = null;
      }
      return next;
    });
  }, []);

  const handleImportJson = useCallback(async (file: File) => {
    try {
      setLoadError(null);
      const text = await file.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        setLoadError(
          language === 'bn'
            ? 'JSON ফাইলটি পার্স করা যায়নি (ত্রুটিপূর্ণ ফরম্যাট)।'
            : 'Failed to parse JSON file (invalid format).'
        );
        return;
      }

      const val = validateRequirementsJson(parsed);

      if (!val.valid || !val.config) {
        setLoadError(
          language === 'bn'
            ? val.errors[0]?.messageBn || 'ভুল স্কিমা'
            : val.errors[0]?.messageEn || 'Invalid schema'
        );
        return;
      }

      setTender(val.config.tender);
      setRequirements(val.config.requirements);
      setMatches({});
      setExpiryDates({});
      // Clear uploaded files, errors, and warnings so old files do not mix with new pack
      setUploadedFiles([]);
      setUploadError(null);
      setDuplicateWarning(null);
    } catch (err) {
      setLoadError(
        language === 'bn'
          ? 'ফাইল লোড করতে ব্যর্থ হয়েছে।'
          : err instanceof Error ? err.message : 'Failed to parse JSON file.'
      );
    }
  }, [language]);

  const handleMatchFile = useCallback(
    (requirementId: string, fileId: string | null) => {
      setDuplicateWarning(null);

      if (fileId) {
        const check = validateDuplicateMatch(fileId, requirementId, uploadedFiles, matches);
        if (!check.allowed) {
          const msg =
            language === 'bn'
              ? `ডুপ্লিকেট ফাইল সতর্কতা: একই কনটেন্টের ফাইল ইতিমধ্যে রিকোয়ারমেন্ট ${check.conflictingRequirementId} এ সংযুক্ত রয়েছে।`
              : `Duplicate file blocked: An identical document is already attached to requirement ${check.conflictingRequirementId}.`;
          setDuplicateWarning(msg);
          return;
        }
      }

      setMatches((prev) => ({ ...prev, [requirementId]: fileId }));
    },
    [uploadedFiles, matches, language]
  );

  const handleSetExpiryDate = useCallback((requirementId: string, date: string) => {
    setExpiryDates((prev) => ({ ...prev, [requirementId]: date }));
  }, []);

  const handleAutoMatch = useCallback(() => {
    setDuplicateWarning(null);
    const suggestions = suggestMatches(requirements, uploadedFiles);
    setMatches((prev) => ({ ...prev, ...suggestions }));
  }, [requirements, uploadedFiles]);

  const handleReset = useCallback(() => {
    setMatches({});
    setExpiryDates({});
    setUploadError(null);
    setDuplicateWarning(null);
  }, []);

  // O(1) indexed lookup for matched files
  const matchedFilesMap = useMemo(() => {
    const fileMap = new Map<string, UploadedFileRecord>();
    for (const f of uploadedFiles) {
      fileMap.set(f.id, f);
    }

    const map: Record<string, UploadedFileRecord | null> = {};
    for (const req of requirements) {
      const fileId = matches[req.id];
      map[req.id] = fileId ? fileMap.get(fileId) ?? null : null;
    }
    return map;
  }, [requirements, matches, uploadedFiles]);

  // Derived validation results
  const validation: PackageValidationResult = useMemo(() => {
    return evaluateTenderPackage(
      requirements,
      matchedFilesMap,
      expiryDates,
      tender?.submission_deadline ?? '2099-12-31'
    );
  }, [requirements, matchedFilesMap, expiryDates, tender]);

  return {
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
  };
}
