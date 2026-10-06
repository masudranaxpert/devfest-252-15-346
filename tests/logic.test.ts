import { describe, it, expect } from 'vitest';
import { calculateDocumentStatus, evaluateTenderPackage } from '../src/lib/statusEngine';
import { identifyDuplicates, validateDuplicateMatch } from '../src/lib/duplicateEngine';
import { validateRequirementsJson, validateUploadedFile } from '../src/lib/validation';
import { suggestMatches } from '../src/lib/autoMatcher';
import { safeText } from '../src/lib/pdfPackage';
import { Requirement, UploadedFileRecord } from '../src/types';

describe('Tender Compliance Engine Tests (AI DevFest 2026)', () => {
  describe('Status Rules (Section 5)', () => {
    it('returns "Missing" when a mandatory requirement has no file matched', () => {
      const req: Requirement = {
        id: 'R01',
        order: 1,
        title_en: 'Trade License',
        title_bn: 'ট্রেড লাইসেন্স',
        mandatory: true,
        has_expiry: true
      };
      const res = calculateDocumentStatus(req, null, '', '2026-10-20');
      expect(res.status).toBe('Missing');
      expect(res.isBlocking).toBe(true);
    });

    it('returns "Not provided" when an optional requirement has no file matched', () => {
      const req: Requirement = {
        id: 'R06',
        order: 6,
        title_en: 'Audited Financial Statement',
        title_bn: 'নিরীক্ষিত আর্থিক বিবরণী',
        mandatory: false,
        has_expiry: false
      };
      const res = calculateDocumentStatus(req, null, '', '2026-10-20');
      expect(res.status).toBe('Not provided');
      expect(res.isBlocking).toBe(false);
    });

    it('returns "Expiry date needed" when has_expiry is true and file matched but no date entered', () => {
      const req: Requirement = {
        id: 'R01',
        order: 1,
        title_en: 'Trade License',
        title_bn: 'ট্রেড লাইসেন্স',
        mandatory: true,
        has_expiry: true
      };
      const mockFile = {
        id: 'f1',
        name: 'trade.pdf',
        size: 1024,
        pageCount: 1,
        hash: 'h1',
        isDuplicate: false,
        file: {} as File
      };
      const res = calculateDocumentStatus(req, mockFile, '', '2026-10-20');
      expect(res.status).toBe('Expiry date needed');
      expect(res.isBlocking).toBe(true);
    });

    it('returns "Expired" when expiry date is strictly before submission deadline', () => {
      const req: Requirement = {
        id: 'R01',
        order: 1,
        title_en: 'Trade License',
        title_bn: 'ট্রেড লাইসেন্স',
        mandatory: true,
        has_expiry: true
      };
      const mockFile = {
        id: 'f1',
        name: 'trade_2025.pdf',
        size: 1024,
        pageCount: 1,
        hash: 'h1',
        isDuplicate: false,
        file: {} as File
      };
      const res = calculateDocumentStatus(req, mockFile, '2025-06-30', '2026-10-20');
      expect(res.status).toBe('Expired');
      expect(res.isBlocking).toBe(true);
    });

    it('returns "OK" when expiry date equals submission deadline (same day)', () => {
      const req: Requirement = {
        id: 'R01',
        order: 1,
        title_en: 'Trade License',
        title_bn: 'ট্রেড লাইসেন্স',
        mandatory: true,
        has_expiry: true
      };
      const mockFile = {
        id: 'f1',
        name: 'trade_2026.pdf',
        size: 1024,
        pageCount: 1,
        hash: 'h1',
        isDuplicate: false,
        file: {} as File
      };
      const res = calculateDocumentStatus(req, mockFile, '2026-10-20', '2026-10-20');
      expect(res.status).toBe('OK');
      expect(res.isBlocking).toBe(false);
    });

    it('returns "OK" when expiry date is after submission deadline', () => {
      const req: Requirement = {
        id: 'R01',
        order: 1,
        title_en: 'Trade License',
        title_bn: 'ট্রেড লাইসেন্স',
        mandatory: true,
        has_expiry: true
      };
      const mockFile = {
        id: 'f1',
        name: 'trade_2026.pdf',
        size: 1024,
        pageCount: 1,
        hash: 'h1',
        isDuplicate: false,
        file: {} as File
      };
      const res = calculateDocumentStatus(req, mockFile, '2027-06-30', '2026-10-20');
      expect(res.status).toBe('OK');
      expect(res.isBlocking).toBe(false);
    });

    it('returns "OK" for mandatory document without expiry requirement', () => {
      const req: Requirement = {
        id: 'R02',
        order: 2,
        title_en: 'TIN Certificate',
        title_bn: 'টিআইএন সনদ',
        mandatory: true,
        has_expiry: false
      };
      const mockFile = {
        id: 'f2',
        name: 'tin.pdf',
        size: 2048,
        pageCount: 1,
        hash: 'h2',
        isDuplicate: false,
        file: {} as File
      };
      const res = calculateDocumentStatus(req, mockFile, '', '2026-10-20');
      expect(res.status).toBe('OK');
      expect(res.isBlocking).toBe(false);
    });
  });

  describe('Duplicate Detection Engine (Task 4.6)', () => {
    it('flags duplicate files sharing identical content hash', () => {
      const files: UploadedFileRecord[] = [
        { id: 'f1', name: 'experience_cert.pdf', size: 3995, pageCount: 2, hash: 'md5_same', isDuplicate: false, file: {} as File },
        { id: 'f2', name: 'experience_cert (1).pdf', size: 3995, pageCount: 2, hash: 'md5_same', isDuplicate: false, file: {} as File },
        { id: 'f3', name: 'tin.pdf', size: 2606, pageCount: 1, hash: 'md5_diff', isDuplicate: false, file: {} as File }
      ];
      const identified = identifyDuplicates(files);
      expect(identified[0].isDuplicate).toBe(true);
      expect(identified[1].isDuplicate).toBe(true);
      expect(identified[1].duplicateOf).toBe('f1');
      expect(identified[2].isDuplicate).toBe(false);
    });

    it('prevents matching duplicate files to different requirements', () => {
      const files: UploadedFileRecord[] = [
        { id: 'f1', name: 'cert.pdf', size: 100, pageCount: 1, hash: 'hash1', isDuplicate: false, file: {} as File },
        { id: 'f2', name: 'cert_copy.pdf', size: 100, pageCount: 1, hash: 'hash1', isDuplicate: true, duplicateOf: 'f1', file: {} as File }
      ];
      const matchesMap = { R05: 'f1' };
      const check = validateDuplicateMatch('f2', 'R08', files, matchesMap);
      expect(check.allowed).toBe(false);
      expect(check.conflictingRequirementId).toBe('R05');
    });
  });

  describe('Validation Engine', () => {
    it('validates requirements schema correctly', () => {
      const validData = {
        tender: {
          tender_id: 'T-2026-0417',
          title: 'Supply of IT Equipment',
          procuring_entity: 'Directorate of Sample Services',
          bidder: 'Meghna Tech Solutions Ltd.',
          submission_deadline: '2026-10-20'
        },
        requirements: [
          { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true }
        ]
      };
      const res = validateRequirementsJson(validData);
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it('rejects non-PDF files', () => {
      const nonPdfFile = { name: 'company_logo.png', type: 'image/png', size: 5321 } as File;
      const res = validateUploadedFile(nonPdfFile, 0, 0);
      expect(res.valid).toBe(false);
      expect(res.errorEn).toContain('not a PDF file');
    });
  });

  describe('Package Evaluation & Aggregations', () => {
    it('computes exact page count including Cover Page and matched files', () => {
      const reqs: Requirement[] = [
        { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
        { id: 'R02', order: 2, title_en: 'TIN Certificate', title_bn: 'টিআইএন সনদ', mandatory: true, has_expiry: false },
        { id: 'R06', order: 6, title_en: 'Audited Statement', title_bn: 'আর্থিক বিবরণী', mandatory: false, has_expiry: false }
      ];
      const matchedFiles = {
        R01: { id: 'f1', name: 'trade.pdf', size: 1024, pageCount: 1, hash: 'h1', isDuplicate: false, file: {} as File },
        R02: { id: 'f2', name: 'tin.pdf', size: 1024, pageCount: 2, hash: 'h2', isDuplicate: false, file: {} as File }
      };
      const expiryDates = { R01: '2027-01-01' };

      const result = evaluateTenderPackage(reqs, matchedFiles, expiryDates, '2026-10-20');
      expect(result.canGenerate).toBe(true);
      expect(result.totalIncludedDocuments).toBe(2);
      // 1 cover page + 1 page from R01 + 2 pages from R02 = 4 total pages
      expect(result.totalEstimatedPages).toBe(4);
    });
  });

  describe('Auto Matcher (Bonus)', () => {
    it('maps filenames to appropriate requirements based on pattern match', () => {
      const reqs: Requirement[] = [
        { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
        { id: 'R02', order: 2, title_en: 'TIN Certificate', title_bn: 'টিআইএন সনদ', mandatory: true, has_expiry: false }
      ];
      const files: UploadedFileRecord[] = [
        { id: 'f1', name: '03_tin_certificate.pdf', size: 100, pageCount: 1, hash: 'h1', isDuplicate: false, file: {} as File },
        { id: 'f2', name: 'trade_license_2026.pdf', size: 100, pageCount: 1, hash: 'h2', isDuplicate: false, file: {} as File }
      ];
      const suggestions = suggestMatches(reqs, files);
      expect(suggestions.R01).toBe('f2');
      expect(suggestions.R02).toBe('f1');
    });
  });

  describe('End-to-End PDF Package Generation (Section 6 & 9)', () => {
    it('generates compliant output/T-2026-0417_Package.pdf with cover page and footers', async () => {
      const fs = await import('fs');
      const { generateTenderPackage } = await import('../src/lib/pdfPackage');
      const { PDFDocument } = await import('pdf-lib');

      const reqData = JSON.parse(fs.readFileSync('public/data/requirements.json', 'utf8'));
      const tender = reqData.tender;
      const reqs = reqData.requirements as Requirement[];

      const mapping: Record<string, { file: string; expiry: string }> = {
        R01: { file: 'trade_license_2026.pdf', expiry: '2027-06-30' },
        R02: { file: '03_tin_certificate.pdf', expiry: '' },
        R03: { file: '04_vat_certificate.pdf', expiry: '' },
        R04: { file: 'bank_solvency.pdf', expiry: '2026-12-31' },
        R05: { file: 'experience_cert.pdf', expiry: '' },
        R08: { file: '02_technical_proposal.pdf', expiry: '' },
        R09: { file: '01_financial_proposal.pdf', expiry: '' },
        R10: { file: 'scan_0042.pdf', expiry: '' },
      };

      const evaluatedRequirements = [];

      for (const req of reqs) {
        const match = mapping[req.id];
        let matchedFile = null;
        let expiry = '';

        if (match) {
          const filePath = 'public/data/documents/' + match.file;
          const buf = fs.readFileSync(filePath);
          const pdf = await PDFDocument.load(buf);
          matchedFile = {
            id: match.file,
            name: match.file,
            size: buf.length,
            pageCount: pdf.getPageCount(),
            hash: 'hash_' + match.file,
            isDuplicate: false,
            bytes: new Uint8Array(buf),
            file: {} as File,
          };
          expiry = match.expiry;
        }

        const st = calculateDocumentStatus(req, matchedFile, expiry, tender.submission_deadline);
        evaluatedRequirements.push({
          requirement: req,
          matchedFile,
          expiryDate: expiry,
          ...st,
        });
      }

      const pdfBytes = await generateTenderPackage({ tender, evaluatedRequirements });
      fs.mkdirSync('output', { recursive: true });
      const outPath = `output/${tender.tender_id}_Package.pdf`;
      fs.writeFileSync(outPath, pdfBytes);

      expect(fs.existsSync(outPath)).toBe(true);
      const generatedDoc = await PDFDocument.load(pdfBytes);
      // Cover page (1) + R01 (1) + R02 (1) + R03 (1) + R04 (1) + R05 (2) + R08 (6) + R09 (2) + R10 (1) = 16 pages
      expect(generatedDoc.getPageCount()).toBe(16);
    });
  });

  describe('PDF safeText Sanitization', () => {
    it('preserves valid ASCII / Latin-1 characters', () => {
      expect(safeText('Tender T-2026-0417')).toBe('Tender T-2026-0417');
    });

    it('replaces unencodable characters with question mark', () => {
      expect(safeText('ট্রেড লাইসেন্স')).toBe('????? ????????');
      expect(safeText('')).toBe('');
      expect(safeText(null)).toBe('');
    });
  });
});
