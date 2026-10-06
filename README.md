# TenderReady — Tender Submission Package Builder (AI DevFest 2026)

**Participant Name**: Masud Rana  
**Registration ID**: 252-15-346  
**Repository**: [https://github.com/masudranaxpert/TenderReady](https://github.com/masudranaxpert/TenderReady)  
**Live URL**: [https://devfest.masud-rana.me](https://devfest.masud-rana.me)  
**Contest Time (T0)**: 2026-10-06 17:40:00 +06:00  

---

## 1. Project overview and architecture

**TenderReady** (টেন্ডার রেডি — *"সব নথি যাচাই করুন, এক PDF-এ জমা দিন"*) is a fast, client-side web application for preparing tender submission packages. It loads requirements from `requirements.json`, accepts PDF uploads, detects duplicates via content hashing, matches files to requirements, checks document expiry dates against the submission deadline, and merges included documents into a single PDF with an English cover page and running page footers.

### Architecture

- Browser processing: The application processes all files locally using Web Crypto and pdf-lib. It runs without an external server, API route, or database.
- Logic separation: Status calculation, duplicate hashing, and schema validation reside in `src/lib/` as pure TypeScript functions.
- State flow: `src/hooks/useTenderManager.ts` manages file attachments and expiry dates, re-evaluating requirement statuses whenever inputs change.
- Language support: The interface is bilingual (English and Bengali with `Noto Sans Bengali` fallback), with the selected language persisted in `localStorage`.
- Responsive design: The layout adapts from desktop displays down to mobile viewports (390px) and provides keyboard-accessible file inputs.

---

## 2. Mandatory features completed

- [x] **Task 4.1: Load requirements**: Validates and loads `requirements.json`, displaying tender metadata and requirements sorted by `order`.
- [x] **Task 4.2: File upload and validation**: Supports multi-file upload and drag-and-drop, reads page counts with pdf-lib, rejects non-PDF files with localized errors, and allows deleting uploaded files.
- [x] **Task 4.3: 1-to-1 document matching**: Links uploaded PDFs to specific requirements, enforces that each file and requirement are paired at most once, and allows detaching at any time.
- [x] **Task 4.4: Expiry date entry**: Prompts for expiry dates on matched documents where `has_expiry = true`.
- [x] **Task 4.5: Exact Section 5 status engine**:
  - `Missing` (Blocks: YES): Required document without matched file.
  - `Expiry date needed` (Blocks: YES): Expiry requirement matched without date entered.
  - `Expired` (Blocks: YES): Expiry date is before submission deadline.
  - `Not provided` (Blocks: NO): Optional document without matched file.
  - `OK` (Blocks: NO): Matched file with valid expiry (`expiry >= deadline`, including same-day expiry).
- [x] **Task 4.6: Duplicate detection**: Calculates SHA-256 hashes via Web Crypto to flag identical files and prevents assigning duplicates to different requirements.
- [x] **Task 4.7: Package generation**: Disables package generation while blocking statuses remain, displays blocking reasons, and compiles the combined PDF once all requirements are satisfied.
- [x] **Task 4.8: Package download**: Downloads `<tender_id>_Package.pdf` directly in the browser.
- [x] **Task 4.9: Bilingual interface**: Toggles between English and Bengali, displaying document names from `title_en` or `title_bn` and matching status strings.

---

## 3. Package structure (Section 6)

- [x] **Cover page**: Page 1 English cover page displaying Tender ID, Title, Procuring Entity, Bidder Name, Submission Deadline, Generation Date, and table of included documents.
- [x] **Document order**: Appends included files in ascending order of requirements. All pages of each matched file are preserved in sequence, skipping unprovided optional items.
- [x] **Running footer**: Adds `<tender_id> | Page X of Y` centered at the bottom of every page, including the cover page.
- [x] **Sample package**: Generates `output/T-2026-0417_Package.pdf` (16 pages total) after resolving the sample pack's expired license, duplicate certificate, and scanned declaration.

---

## 4. Bonus features completed

- [x] **Auto-match**: Matches uploaded files to requirements by filename keyword rules (`src/lib/autoMatcher.ts`).
- [x] **Checklist export**: Exports compliance status table to CSV with document order, IDs, titles, filenames, page counts, expiry dates, and statuses.
- [x] **Bad file handling**: Traps corrupted or encrypted PDFs safely with a user-facing error instead of crashing.
- [x] **Sample data loader**: Pre-loads the official sample requirements and documents for quick testing.

---

## 5. Known limitations and design notes

- In-memory PDF processing: PDF parsing and compilation occur in browser memory. Very large submissions with hundreds of scanned pages depend on available client RAM.
- Keyword auto-matching: The auto-matcher uses pattern rules on common filenames. Files with unconventional names may require manual matching.
- Date format: Expiry dates must be in `YYYY-MM-DD` format as specified in the schema.

---

## 6. How to run and test

### Prerequisites
- Node.js >= 20
- npm >= 10

### Installation and scripts
```bash
# 1. Install dependencies
npm install

# 2. Run unit and compliance tests (Vitest)
npm test

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 7. Screenshots

- **Desktop overview**: [screenshots/01-desktop-overview.png](screenshots/01-desktop-overview.png)
- **Mobile responsive view (iPhone 390px)**: [screenshots/02-mobile-responsive.png](screenshots/02-mobile-responsive.png)
- **Document statuses and preflight panel**: [screenshots/03-document-statuses.png](screenshots/03-document-statuses.png)

---

## 8. AI tools and prompt

- **AI tools**: Google Antigravity (Gemini 3.8 Flash / Claude 3.5 Sonnet pairing).
- **Most useful prompt**:
  > "complete full contest task end to end. Follow AGENTS.md rules strictly. Compute all results dynamically without hardcoding. Enforce exact Section 5 status rules and Section 6 PDF packaging requirements."

---

## 9. License

MIT License. Copyright (c) 2026 Masud Rana.
