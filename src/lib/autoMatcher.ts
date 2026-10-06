import { Requirement, UploadedFileRecord } from '../types/index.ts';

const KEYWORD_RULES = new Map<string, readonly RegExp[]>([
  ['R01', [/trade.*license/i, /trade/i]],
  ['R02', [/tin/i, /taxpayer/i]],
  ['R03', [/vat/i, /bin/i]],
  ['R04', [/solvency/i, /bank/i]],
  ['R05', [/experience/i, /cert/i]],
  ['R06', [/financial.*statement/i, /audit/i]],
  ['R07', [/manufacturer/i, /authorization/i]],
  ['R08', [/technical/i, /tech.*prop/i]],
  ['R09', [/financial.*prop/i, /financial/i]],
  ['R10', [/declaration/i, /scan/i, /signed/i]],
]);

/**
 * Suggests file matches for requirements based on filename keyword similarity.
 */
export function suggestMatches(
  requirements: readonly Requirement[],
  files: readonly UploadedFileRecord[]
): Record<string, string | null> {
  const suggestions: Record<string, string | null> = {};
  const matchedFileIds = new Set<string>();
  const fileById = new Map<string, UploadedFileRecord>();

  for (const f of files) {
    fileById.set(f.id, f);
  }

  for (const req of requirements) {
    const patterns = KEYWORD_RULES.get(req.id) ?? [
      new RegExp(req.title_en.toLowerCase().replace(/\s+/g, '.*'), 'i'),
    ];

    let candidate: UploadedFileRecord | null = null;
    for (const f of files) {
      if (!matchedFileIds.has(f.id) && patterns.some((p) => p.test(f.name))) {
        candidate = f;
        break;
      }
    }

    if (candidate) {
      const chosen = candidate.isDuplicate && candidate.duplicateOf
        ? (fileById.get(candidate.duplicateOf) ?? candidate)
        : candidate;

      if (!matchedFileIds.has(chosen.id)) {
        suggestions[req.id] = chosen.id;
        matchedFileIds.add(chosen.id);
      }
    }
  }

  return suggestions;
}
