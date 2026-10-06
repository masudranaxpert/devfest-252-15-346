export interface TenderDetails {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  submission_deadline: string;
}

export interface Requirement {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
}

export interface TenderConfig {
  tender: TenderDetails;
  requirements: Requirement[];
}

export interface UploadedFileRecord {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  hash: string;
  isDuplicate: boolean;
  duplicateOf?: string;
  bytes?: Uint8Array;
}

export interface MatchState {
  requirementId: string;
  fileId: string | null;
  expiryDate: string; // YYYY-MM-DD
}

export type DocumentStatusType =
  | 'Missing'
  | 'Expiry date needed'
  | 'Expired'
  | 'Not provided'
  | 'OK';

export interface EvaluatedRequirement {
  requirement: Requirement;
  matchedFile: UploadedFileRecord | null;
  expiryDate: string;
  status: DocumentStatusType;
  isBlocking: boolean;
  statusMessageEn: string;
  statusMessageBn: string;
}

export interface PackageValidationResult {
  canGenerate: boolean;
  totalIncludedDocuments: number;
  totalEstimatedPages: number;
  blockingReasonsEn: string[];
  blockingReasonsBn: string[];
  evaluatedRequirements: EvaluatedRequirement[];
}
