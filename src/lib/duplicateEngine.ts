import { UploadedFileRecord } from '../types/index.ts';

/**
 * Computes SHA-256 hex digest for an ArrayBuffer using Web Crypto API.
 */
export async function computeHash(buffer: ArrayBuffer): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Deterministic fast hash for non-subtle environments
  let hash = 0;
  const view = new Uint8Array(buffer);
  for (let i = 0; i < view.length; i++) {
    hash = ((hash << 5) - hash + view[i]) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Flags duplicate files across an uploaded list.
 * Marks later instances as duplicates of the first file with the same content hash.
 */
export function identifyDuplicates(files: UploadedFileRecord[]): UploadedFileRecord[] {
  const hashToFirstFile = new Map<string, string>();

  return files.map(file => {
    if (!hashToFirstFile.has(file.hash)) {
      hashToFirstFile.set(file.hash, file.id);
      return {
        ...file,
        isDuplicate: false,
        duplicateOf: undefined
      };
    } else {
      const originalId = hashToFirstFile.get(file.hash)!;
      return {
        ...file,
        isDuplicate: true,
        duplicateOf: originalId
      };
    }
  });
}

/**
 * Verifies if assigning a file to a requirement violates duplicate rules.
 * Rule: Duplicate files (same hash) cannot be matched to different documents.
 */
export function validateDuplicateMatch(
  targetFileId: string,
  targetRequirementId: string,
  files: UploadedFileRecord[],
  matchesMap: Record<string, string | null> // requirementId -> fileId
): { allowed: boolean; conflictingRequirementId?: string; conflictingFileName?: string } {
  const fileById = new Map<string, UploadedFileRecord>();
  for (const f of files) {
    fileById.set(f.id, f);
  }

  const fileToAssign = fileById.get(targetFileId);
  if (!fileToAssign) return { allowed: true };

  // Find all file IDs that share the same hash
  const duplicateFileIds = new Set<string>();
  for (const f of files) {
    if (f.hash === fileToAssign.hash) {
      duplicateFileIds.add(f.id);
    }
  }

  // Check if any of these duplicate files is already matched to another requirement
  for (const [reqId, matchedFileId] of Object.entries(matchesMap)) {
    if (reqId !== targetRequirementId && matchedFileId && duplicateFileIds.has(matchedFileId)) {
      const conflictingFile = fileById.get(matchedFileId);
      return {
        allowed: false,
        conflictingRequirementId: reqId,
        conflictingFileName: conflictingFile?.name || matchedFileId
      };
    }
  }

  return { allowed: true };
}
