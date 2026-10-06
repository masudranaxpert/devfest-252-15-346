# REQUIREMENTS.md — Tender Document Package Builder

## 1. Project Information
- **Contest**: AI DevFest 2026 Vibe-Coding Contest
- **Participant**: Masud Rana
- **Registration ID**: 252-15-346
- **Repository**: `masudranaxpert/devfest-252-15-346`
- **Live Deployment**: `[Pending: User requested Vercel/VPS manual deployment]`
- **Start Time (T0)**: 2026-10-06 17:40:00 +06:00
- **Deadline (T90)**: 2026-10-06 19:10:00 +06:00

---

## 2. Mandatory Tasks Checklist (Section 4)
- [ ] **Task 4.1: Load Requirements**:
  - Load `requirements.json` via file input, drag-and-drop, or one-click "Load Sample" button.
  - Display tender details: `tender_id`, `title`, `procuring_entity`, `bidder`, `submission_deadline`.
  - Display list of required documents sorted by `order` ascending.
- [ ] **Task 4.2: Upload Files**:
  - Multi-file upload support (up to 30 files, 50MB total).
  - Inspect each file: display filename, file size, and page count.
  - Reject non-PDF files immediately with a clear bilingual error message.
  - Allow removing any uploaded file.
- [ ] **Task 4.3: Match Files**:
  - Interactive matching interface: associate each uploaded PDF with exactly one requirement.
  - Constraint: One document requirement gets at most one file.
  - Constraint: One file goes to at most one document requirement.
  - Allow user to change or undo matches at any time.
- [ ] **Task 4.4: Expiry Date Entry**:
  - When a requirement has `has_expiry = true` and a file is matched to it, prompt user to enter its expiry date (`YYYY-MM-DD`).
- [ ] **Task 4.5: Check Everything & Live Status Computation**:
  - Live status update after every change (file upload, removal, match, date edit).
  - Follow Section 5 Status Rules verbatim:
    1. **Missing** (Blocks: YES) — Required document (`mandatory: true`), no file matched.
    2. **Expiry date needed** (Blocks: YES) — `has_expiry: true` and file matched, but no expiry date entered.
    3. **Expired** (Blocks: YES) — Expiry date is strictly before submission deadline (`expiry < deadline`).
    4. **Not provided** (Blocks: NO) — Optional document (`mandatory: false`), no file matched.
    5. **OK** (Blocks: NO) — File matched, and if `has_expiry: true`, expiry date is on or after submission deadline (`expiry >= deadline`).
- [ ] **Task 4.6: Duplicate Detection**:
  - Compute content hash (SHA-256) of every uploaded file.
  - Flag files with identical content as duplicates.
  - Prevent duplicate files from being matched to different requirements.
- [ ] **Task 4.7: Package Generation**:
  - Keep "Generate Package" button disabled while ANY document has a blocking status (`Missing`, `Expiry date needed`, `Expired`).
  - Provide a clear banner / tooltip explaining why generation is blocked.
  - When all blocking issues are resolved, compile combined PDF following Section 6 rules.
- [ ] **Task 4.8: Download Package**:
  - Download generated package named `<tender_id>_Package.pdf` (e.g. `T-2026-0417_Package.pdf`).
- [ ] **Task 4.9: Bilingual Interface (English + Bangla)**:
  - Header language switch ("English | বাংলা") persisted in `localStorage`.
  - Document titles display `title_en` or `title_bn` based on selected language.
  - Exact English status strings shown verbatim in English mode; high-quality Bangla equivalents in Bangla mode.
  - Responsive, accessible typography using Noto Sans Bengali fallback.

---

## 3. Package Structure Rules (Section 6)
- [ ] **6.1 Cover Page**:
  - English cover page as Page 1.
  - Contains: Tender ID, Tender Title, Procuring Entity, Bidder Name, Submission Deadline, Generation Date (`YYYY-MM-DD`), and ordered list of included documents.
- [ ] **6.2 Document Ordering**:
  - Included documents strictly ordered by requirement `order`.
  - All pages of matched files included in original sequence.
  - Optional documents with no file skipped without leaving blank gaps.
- [ ] **6.3 Running Footer**:
  - Every page (including Cover Page) has footer: `<tender_id> | Page X of Y` where `Y` is total page count.
- [ ] **6.4 Visual Quality**:
  - Footer clean, professional, non-overlapping, crisp typography.

---

## 4. Bonus Features (Section 7)
- [ ] **Bonus 1**: Table of Contents / Index page after cover showing starting page number of each document.
- [ ] **Bonus 2**: Checklist Export to CSV/Excel (`document`, `filename`, `pages`, `expiry_date`, `status`).
- [ ] **Bonus 3**: Auto-match suggestions based on filename similarity.
- [ ] **Bonus 4**: Project Save & Reopen (`localStorage` auto-save + export/import project state JSON).
- [ ] **Bonus 5**: Digital seal / company logo placement on cover or pages.
- [ ] **Bonus 6**: Resilient error handling for corrupted/encrypted PDFs.

---

## 5. Input Schema & Validation Rules
### `requirements.json` Schema:
```json
{
  "tender": {
    "tender_id": "string (required)",
    "title": "string (required)",
    "procuring_entity": "string (required)",
    "bidder": "string (required)",
    "submission_deadline": "YYYY-MM-DD (required)"
  },
  "requirements": [
    {
      "id": "string (required)",
      "order": "integer (required, 1-indexed)",
      "title_en": "string (required)",
      "title_bn": "string (required)",
      "mandatory": "boolean (required)",
      "has_expiry": "boolean (required)"
    }
  ]
}
```

### Validation Matrix:
| Scenario | Action | Expected Status | Blocks? |
|---|---|---|---|
| Mandatory doc, no file | None | `Missing` | YES |
| Optional doc, no file | None | `Not provided` | NO |
| Doc with expiry, file matched, no date | Upload & match | `Expiry date needed` | YES |
| Doc with expiry, date < deadline | Set 2025-06-30 vs 2026-10-20 | `Expired` | YES |
| Doc with expiry, date == deadline | Set 2026-10-20 vs 2026-10-20 | `OK` | NO |
| Doc with expiry, date > deadline | Set 2027-06-30 vs 2026-10-20 | `OK` | NO |
| Duplicate file uploaded | Upload identical files | Flagged Duplicate | Disallow multi-match |
| Non-PDF uploaded | Upload PNG/TXT | Rejected with warning | N/A |

---

## 6. Deliverables & Required Files
- `output/T-2026-0417_Package.pdf`: Generated final sample package.
- `screenshots/`: High-resolution UI screenshots of dashboard, statuses, validation, and package generation.
- `README.md`: Full contest documentation including how to run, architecture, AI prompts, and live link.
- `LICENSE`: MIT License (Masud Rana, 2026).
- GitHub Pages live deployment at `https://masudranaxpert.github.io/devfest-252-15-346/`.
