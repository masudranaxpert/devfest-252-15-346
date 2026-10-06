import { Requirement, UploadedFileRecord, DocumentStatusType, EvaluatedRequirement, PackageValidationResult } from '../types/index.ts';

/**
 * Calculates the exact status of a tender requirement based on Section 5 rules.
 */
export function calculateDocumentStatus(
  requirement: Requirement,
  matchedFile: UploadedFileRecord | null,
  expiryDate: string,
  submissionDeadline: string
): {
  status: DocumentStatusType;
  isBlocking: boolean;
  statusMessageEn: string;
  statusMessageBn: string;
} {
  // Case 1 & 4: No file matched
  if (!matchedFile) {
    if (requirement.mandatory) {
      return {
        status: 'Missing',
        isBlocking: true,
        statusMessageEn: 'Required document, no file matched.',
        statusMessageBn: 'বাধ্যতামূলক নথি, কোনো ফাইল সংযুক্ত করা হয়নি।'
      };
    }
    return {
      status: 'Not provided',
      isBlocking: false,
      statusMessageEn: 'Optional document, no file matched.',
      statusMessageBn: 'ঐচ্ছিক নথি, কোনো ফাইল সংযুক্ত করা হয়নি।'
    };
  }

  // Case 2 & 3 & 5: File matched
  if (requirement.has_expiry) {
    const cleanExpiry = expiryDate ? expiryDate.trim() : '';
    if (!cleanExpiry) {
      return {
        status: 'Expiry date needed',
        isBlocking: true,
        statusMessageEn: 'Expiry date needed for this document.',
        statusMessageBn: 'এই নথির মেয়াদ উত্তীর্ণের তারিখ প্রদান করা প্রয়োজন।'
      };
    }

    // Lexicographical string comparison works for standard YYYY-MM-DD format
    if (cleanExpiry < submissionDeadline) {
      return {
        status: 'Expired',
        isBlocking: true,
        statusMessageEn: `The expiry date (${cleanExpiry}) is before the submission deadline (${submissionDeadline}).`,
        statusMessageBn: `মেয়াদ উত্তীর্ণের তারিখ (${cleanExpiry}) জমা দেওয়ার শেষ তারিখের (${submissionDeadline}) পূর্বে।`
      };
    }

    return {
      status: 'OK',
      isBlocking: false,
      statusMessageEn: `Valid through ${cleanExpiry}.`,
      statusMessageBn: `${cleanExpiry} তারিখ পর্যন্ত কার্যকর ও বৈধ।`
    };
  }

  // Mandatory or optional file without expiry check needed
  return {
    status: 'OK',
    isBlocking: false,
    statusMessageEn: 'File matched and verified.',
    statusMessageBn: 'ফাইল সংযুক্ত ও যাচাই সম্পন্ন।'
  };
}

/**
 * Evaluates the full tender state across all requirements and returns a consolidated validation result.
 */
export function evaluateTenderPackage(
  requirements: Requirement[],
  matchedFilesMap: Record<string, UploadedFileRecord | null>,
  expiryDatesMap: Record<string, string>,
  submissionDeadline: string
): PackageValidationResult {
  const sortedRequirements = [...requirements].sort((a, b) => a.order - b.order);
  const evaluatedRequirements: EvaluatedRequirement[] = [];
  const blockingReasonsEn: string[] = [];
  const blockingReasonsBn: string[] = [];

  let totalIncludedDocuments = 0;
  let totalEstimatedPages = 1; // 1 for Cover Page

  for (const req of sortedRequirements) {
    const matchedFile = matchedFilesMap[req.id] || null;
    const expiryDate = expiryDatesMap[req.id] || '';

    const evaluation = calculateDocumentStatus(
      req,
      matchedFile,
      expiryDate,
      submissionDeadline
    );

    evaluatedRequirements.push({
      requirement: req,
      matchedFile,
      expiryDate,
      ...evaluation
    });

    if (evaluation.isBlocking) {
      blockingReasonsEn.push(`[${req.id}] ${req.title_en}: ${evaluation.status}`);
      blockingReasonsBn.push(`[${req.id}] ${req.title_bn}: ${evaluation.statusMessageBn}`);
    }

    if (matchedFile) {
      totalIncludedDocuments += 1;
      totalEstimatedPages += matchedFile.pageCount;
    }
  }

  const canGenerate = blockingReasonsEn.length === 0 && totalIncludedDocuments > 0;

  return {
    canGenerate,
    totalIncludedDocuments,
    totalEstimatedPages,
    blockingReasonsEn,
    blockingReasonsBn,
    evaluatedRequirements
  };
}
