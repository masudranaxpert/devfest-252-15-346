# Tender Document Package Builder — AI DevFest 2026

**Participant Name**: Masud Rana  
**Registration ID**: 252-15-346  
**Repository**: [https://github.com/masudranaxpert/devfest-252-15-346](https://github.com/masudranaxpert/devfest-252-15-346)  
**Live URL**: [Pending Vercel/VPS Deployment]  
**Contest Time (T0)**: 2026-10-06 17:40:00 +06:00  

---

## 1. Project Overview & Architecture
Tender Document Package Builder is an autonomous, high-performance, client-side web application built for **AI DevFest 2026**. It allows procurement teams and bidders to load tender document requirements (`requirements.json`), upload batches of PDF documents, automatically detect duplicates, match requirements 1-to-1, enforce strict expiry rules, and generate a standardized, compiled submission PDF dossier with a professional cover page and running pagination footer.

### Key Architectural Decisions
- **Zero-Backend Architecture**: 100% browser-side processing using modern Web Crypto API and `pdf-lib`. No participant backend, edge functions, or cloud databases.
- **Pure Functional Logic**: All compliance rules, hash detection, schema validations, and status calculations reside in `src/lib/` as pure, testable TypeScript functions.
- **Single Source of Truth**: State transitions in `src/hooks/useTenderManager.ts` compute derived compliance metrics reactively with zero duplicate effects (Vercel React Best Practices).
- **Full Bilingual i18n**: Seamless toggling between English and বাংলা (`Noto Sans Bengali`), persisted in `localStorage`.
- **Accessibility & UX**: High contrast badges, accessible dropzone (`role="button"`, keyboard navigation), responsive layouts, and zero console errors.

---

## 2. Mandatory Features Completed
- [x] **Task 4.1: Load Requirements**: Loads `requirements.json` with schema validation, displaying tender metadata and requirements sorted by `order`.
- [x] **Task 4.2: File Upload & Validation**: Multi-file drag & drop and file input; page counting via `pdf-lib`; rejects non-PDF files (e.g. `company_logo.png`) with descriptive bilingual notices; individual file removal.
- [x] **Task 4.3: 1-to-1 Document Matching**: Matches uploaded PDFs to requirements; strictly prevents one file from matching multiple requirements or vice-versa; supports unmatching/undoing anytime.
- [x] **Task 4.4: Expiry Date Entry**: Enables date inputs for requirements where `has_expiry = true` upon matching; disables date entry for unmatched documents.
- [x] **Task 4.5: Exact Section 5 Status Engine**:
  - `Missing` (Blocks: YES) — Required document without matched file.
  - `Expiry date needed` (Blocks: YES) — Expiry requirement matched without date entered.
  - `Expired` (Blocks: YES) — Expiry date is before submission deadline.
  - `Not provided` (Blocks: NO) — Optional document without matched file.
  - `OK` (Blocks: NO) — Matched file with valid expiry (`expiry >= deadline`, including same-day expiry).
- [x] **Task 4.6: Duplicate Detection**: Web Crypto SHA-256 hashing flags duplicate files (e.g., `experience_cert.pdf` vs `experience_cert (1).pdf`) and blocks assigning duplicates to different requirements.
- [x] **Task 4.7: Package Generation**: Disables package compilation while any blocking status remains; shows detailed blocking breakdown; creates compliant combined PDF when all clear.
- [x] **Task 4.8: Package Download**: Automatically names and downloads `<tender_id>_Package.pdf` (e.g. `T-2026-0417_Package.pdf`).
- [x] **Task 4.9: Bilingual Interface**: English & বাংলা interface; titles respect `title_en` / `title_bn`; exact Section 5 status terms displayed verbatim in English mode.

---

## 3. Package Structure (Section 6)
- [x] **Cover Page**: Page 1 English cover page showing Tender ID, Title, Procuring Entity, Bidder Name, Submission Deadline, Generation Date, and table of included documents.
- [x] **Order & Sequence**: Included documents concatenated in ascending `order`. All pages included in original sequence; missing optional documents skipped without gaps.
- [x] **Running Footer**: Centered `<tender_id> | Page X of Y` on every single page (including cover).
- [x] **Sample Pack Resolution**: Output package `output/T-2026-0417_Package.pdf` generated (16 pages total) resolving expired license, duplicate experience certificate, and scanned declaration (`scan_0042.pdf`).

---

## 4. Bonus Features Completed
- [x] **Auto-Matcher**: Automatically suggests and matches uploaded files to requirements based on keyword analysis (`src/lib/autoMatcher.ts`).
- [x] **Checklist Export (CSV)**: One-click export of compliance checklist table with document order, IDs, titles, filenames, page counts, expiry dates, and statuses.
- [x] **Corrupted / Protected PDF Guard**: Safe error trapping prevents app crashing on invalid or password-protected files.
- [x] **One-Click Sample Loader**: Pre-loads official sample requirements and documents for instant evaluation.

---

## 5. How to Run & Test
### Prerequisites
- Node.js >= 20
- npm >= 10

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Run unit & compliance tests (Vitest)
npm test

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 6. Screenshots
- **Baseline Unmatched State**: [screenshots/01-baseline-unmatched.png](screenshots/01-baseline-unmatched.png)
- **Expiry Dates Needed State**: [screenshots/02-expiry-dates-needed.png](screenshots/02-expiry-dates-needed.png)

---

## 7. AI Tools & Key Prompts
- **AI Tool**: Google Antigravity (Gemini 3.8 Flash / Claude 3.5 Sonnet agentic pairing).
- **Most Useful Prompt**:
  > "complete full contest task end to end. Follow AGENTS.md rules strictly. Compute all results dynamically without hardcoding. Enforce exact Section 5 status rules and Section 6 PDF packaging requirements."

---

## 8. License
MIT License — Copyright (c) 2026 Masud Rana.
