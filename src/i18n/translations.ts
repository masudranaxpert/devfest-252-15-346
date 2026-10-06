export type Language = 'en' | 'bn';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  loadSample: string;
  loadJson: string;
  uploadFiles: string;
  autoMatch: string;
  exportCsv: string;
  resetAll: string;
  generatePackage: string;
  generating: string;
  downloadPackage: string;
  tenderDetails: string;
  tenderId: string;
  procuringEntity: string;
  bidder: string;
  deadline: string;
  checklistTitle: string;
  checklistSubtitle: string;
  order: string;
  documentTitle: string;
  requirementType: string;
  mandatory: string;
  optional: string;
  attachedFile: string;
  pages: string;
  expiryDate: string;
  status: string;
  actions: string;
  noFile: string;
  selectFile: string;
  unmatch: string;
  enterDate: string;
  uploadedFilesTitle: string;
  dragDropText: string;
  supportedFormat: string;
  removeFile: string;
  duplicateWarning: string;
  duplicateOf: string;
  blockingNotice: string;
  allClearNotice: string;
  totalDocs: string;
  totalPagesEst: string;
  statusSummary: string;
  missingError: string;
  expiryNeededError: string;
  expiredError: string;
  notProvidedNotice: string;
  okSuccess: string;
  footerNotice: string;
  filterAll: string;
  filterBlocking: string;
  filterOk: string;
  pageCountLabel: string;
  selectFilePlaceholder: string;
  noTenderLoaded: string;
  darkMode: string;
  lightMode: string;
  themeToggle: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'TenderReady',
    appSubtitle: 'Verify all documents, submit in a single PDF',
    loadSample: 'Load Sample',
    loadJson: 'Import JSON',
    uploadFiles: 'Upload Documents',
    autoMatch: 'Auto-Match',
    exportCsv: 'Export CSV',
    resetAll: 'Reset',
    generatePackage: 'Generate Submission Package',
    generating: 'Generating Package PDF...',
    downloadPackage: 'Download Package PDF',
    tenderDetails: 'Tender Information',
    tenderId: 'Tender ID',
    procuringEntity: 'Procuring Entity',
    bidder: 'Bidder Name',
    deadline: 'Deadline',
    checklistTitle: 'Required Documents',
    checklistSubtitle: 'Attach each file and verify expiry dates before compiling.',
    order: 'Order',
    documentTitle: 'Document',
    requirementType: 'Type',
    mandatory: 'Mandatory',
    optional: 'Optional',
    attachedFile: 'Attached File',
    pages: 'Pages',
    expiryDate: 'Expiry Date',
    status: 'Status',
    actions: 'Action',
    noFile: 'No file attached',
    selectFile: 'Select file...',
    selectFilePlaceholder: '-- Select uploaded file --',
    unmatch: 'Detach',
    enterDate: 'YYYY-MM-DD',
    uploadedFilesTitle: 'Uploaded Files',
    dragDropText: 'Drop PDF files here, or tap to browse',
    supportedFormat: 'PDF only • Up to 30 files, 50 MB total',
    removeFile: 'Remove',
    duplicateWarning: 'Duplicate file detected',
    duplicateOf: 'Identical content to',
    blockingNotice: 'Cannot generate package yet. Resolve these issues first:',
    allClearNotice: 'All documents verified. Ready to create the PDF package.',
    totalDocs: 'Included Docs',
    totalPagesEst: 'Total Pages',
    statusSummary: 'Package Status',
    missingError: 'Missing',
    expiryNeededError: 'Expiry date needed',
    expiredError: 'Expired',
    notProvidedNotice: 'Not provided',
    okSuccess: 'OK',
    footerNotice: 'AI DevFest 2026',
    filterAll: 'All',
    filterBlocking: 'Blocking',
    filterOk: 'Ready',
    pageCountLabel: 'pages',
    noTenderLoaded: 'No tender requirements loaded yet. Click "Load Sample" or import requirements.json.',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    themeToggle: 'Toggle theme'
  },
  bn: {
    appTitle: 'টেন্ডার রেডি',
    appSubtitle: 'সব নথি যাচাই করুন, এক PDF-এ জমা দিন',
    loadSample: 'নমুনা লোড',
    loadJson: 'JSON আপলোড',
    uploadFiles: 'নথি আপলোড',
    autoMatch: 'অটো-ম্যাচ',
    exportCsv: 'CSV এক্সপোর্ট',
    resetAll: 'রিসেট',
    generatePackage: 'সাবমিশন প্যাকেজ তৈরি করুন',
    generating: 'প্যাকেজ তৈরি হচ্ছে...',
    downloadPackage: 'প্যাকেজ ডাউনলোড',
    tenderDetails: 'টেন্ডার তথ্য',
    tenderId: 'টেন্ডার আইডি',
    procuringEntity: 'সংগ্রহকারী কর্তৃপক্ষ',
    bidder: 'দরদাতা প্রতিষ্ঠান',
    deadline: 'শেষ তারিখ',
    checklistTitle: 'প্রয়োজনীয় নথিপত্র',
    checklistSubtitle: 'প্রতিটি ফাইল সংযুক্ত করে মেয়াদ পরীক্ষা সম্পন্ন করুন।',
    order: 'ক্রম',
    documentTitle: 'নথি',
    requirementType: 'ধরন',
    mandatory: 'বাধ্যতামূলক',
    optional: 'ঐচ্ছিক',
    attachedFile: 'সংযুক্ত ফাইল',
    pages: 'পৃষ্ঠা',
    expiryDate: 'মেয়াদের তারিখ',
    status: 'স্ট্যাটাস',
    actions: 'অ্যাকশন',
    noFile: 'কোনো ফাইল সংযুক্ত নেই',
    selectFile: 'ফাইল বাছাই...',
    selectFilePlaceholder: '-- ফাইল নির্বাচন করুন --',
    unmatch: 'আলাদা করুন',
    enterDate: 'YYYY-MM-DD',
    uploadedFilesTitle: 'আপলোডকৃত ফাইলসমূহ',
    dragDropText: 'PDF ফাইলসমূহ এখানে টেনে আনুন বা ক্লিক করুন',
    supportedFormat: 'শুধুমাত্র PDF • সর্বোচ্চ ৩০ ফাইল, ৫০ MB মোট',
    removeFile: 'মুছুন',
    duplicateWarning: 'ডুপ্লিকেট ফাইল শনাক্ত হয়েছে',
    duplicateOf: 'একই ফাইলের কপি:',
    blockingNotice: 'প্যাকেজ তৈরি আটকে আছে। নিচের সমস্যাগুলো সমাধান করুন:',
    allClearNotice: 'সব নথি যাচাই সম্পন্ন। PDF প্যাকেজ তৈরির জন্য প্রস্তুত।',
    totalDocs: 'সংযুক্ত নথি',
    totalPagesEst: 'মোট পৃষ্ঠা',
    statusSummary: 'প্যাকেজ অবস্থা',
    missingError: 'অনুপস্থিত',
    expiryNeededError: 'মেয়াদের তারিখ প্রয়োজন',
    expiredError: 'মেয়াদোত্তীর্ণ',
    notProvidedNotice: 'দেওয়া হয়নি',
    okSuccess: 'ঠিক আছে',
    footerNotice: 'AI DevFest ২০২৬',
    filterAll: 'সকল',
    filterBlocking: 'সমস্যাযুক্ত',
    filterOk: 'যাচাইকৃত',
    pageCountLabel: 'পৃষ্ঠা',
    noTenderLoaded: 'কোনো টেন্ডার তথ্য লোড করা হয়নি। "নমুনা লোড" ক্লিক করুন অথবা requirements.json ফাইল দিন।',
    darkMode: 'ডার্ক মোড',
    lightMode: 'লাইট মোড',
    themeToggle: 'থিম পরিবর্তন'
  }
};
