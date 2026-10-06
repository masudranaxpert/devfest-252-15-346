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
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Tender Document Package Builder',
    appSubtitle: 'Automated compliance verification, ordering & dossier generation',
    loadSample: 'Load Sample Tender',
    loadJson: 'Import requirements.json',
    uploadFiles: 'Upload Documents (PDF)',
    autoMatch: 'Auto-Match Files',
    exportCsv: 'Export Checklist (CSV)',
    resetAll: 'Reset All',
    generatePackage: 'Generate Submission Package',
    generating: 'Generating Package PDF...',
    downloadPackage: 'Download Package PDF',
    tenderDetails: 'Tender Dossier Overview',
    tenderId: 'Tender ID',
    procuringEntity: 'Procuring Entity',
    bidder: 'Bidder Name',
    deadline: 'Submission Deadline',
    checklistTitle: 'Tender Requirements & Document Matching',
    checklistSubtitle: 'Ensure all mandatory files are attached with valid expiry dates.',
    order: 'Order',
    documentTitle: 'Required Document',
    requirementType: 'Type',
    mandatory: 'Mandatory',
    optional: 'Optional',
    attachedFile: 'Attached File',
    pages: 'Pages',
    expiryDate: 'Expiry Date',
    status: 'Compliance Status',
    actions: 'Action',
    noFile: 'No file matched',
    selectFile: 'Select uploaded file...',
    unmatch: 'Detach',
    enterDate: 'YYYY-MM-DD',
    uploadedFilesTitle: 'Uploaded Repository',
    dragDropText: 'Drop PDF files here, or click to browse (up to 30 files, 50MB)',
    supportedFormat: 'Accepts PDF only. Content duplicates will be flagged.',
    removeFile: 'Remove',
    duplicateWarning: 'Duplicate File Detected',
    duplicateOf: 'Identical content to',
    blockingNotice: 'Package generation is blocked by incomplete or expired documents:',
    allClearNotice: 'All documents comply! Ready to generate official PDF package.',
    totalDocs: 'Included Documents',
    totalPagesEst: 'Total Package Pages',
    statusSummary: 'Status Summary',
    missingError: 'Missing',
    expiryNeededError: 'Expiry date needed',
    expiredError: 'Expired',
    notProvidedNotice: 'Not provided',
    okSuccess: 'OK',
    footerNotice: 'AI DevFest 2026 Contest • Autonomous Solution',
    filterAll: 'All Requirements',
    filterBlocking: 'Blocking Only',
    filterOk: 'Compliant Only'
  },
  bn: {
    appTitle: 'টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার',
    appSubtitle: 'স্বয়ংক্রিয় কমপ্লায়েন্স যাচাই, ক্রমবিন্যাস ও টেন্ডার ডসিয়ার প্রস্তুতকারক',
    loadSample: 'নমুনা টেন্ডার লোড করুন',
    loadJson: 'requirements.json আপলোড',
    uploadFiles: 'নথিপত্র আপলোড (PDF)',
    autoMatch: 'স্বয়ংক্রিয় ফাইল ম্যাচিং',
    exportCsv: 'চেকলিস্ট এক্সপোর্ট (CSV)',
    resetAll: 'রিসেট করুন',
    generatePackage: 'সাবমিশন প্যাকেজ তৈরি করুন',
    generating: 'প্যাকেজ PDF তৈরি হচ্ছে...',
    downloadPackage: 'প্যাকেজ PDF ডাউনলোড',
    tenderDetails: 'টেন্ডার সারসংক্ষেপ',
    tenderId: 'টেন্ডার আইডি',
    procuringEntity: 'সংগ্রহকারী কর্তৃপক্ষ',
    bidder: 'দরদাতা প্রতিষ্ঠান',
    deadline: 'জমা দেওয়ার শেষ তারিখ',
    checklistTitle: 'টেন্ডার রিকোয়ারমেন্টস ও ফাইল ম্যাচিং তালিকা',
    checklistSubtitle: 'বাধ্যতামূলক নথিসমূহ সংযুক্ত ও মেয়াদ যাচাই নিশ্চিত করুন।',
    order: 'ক্রম',
    documentTitle: 'প্রয়োজনীয় নথি',
    requirementType: 'ধরন',
    mandatory: 'বাধ্যতামূলক',
    optional: 'ঐচ্ছিক',
    attachedFile: 'সংযুক্ত ফাইল',
    pages: 'পৃষ্ঠা',
    expiryDate: 'মেয়াদ উত্তীর্ণের তারিখ',
    status: 'বর্তমান স্ট্যাটাস',
    actions: 'অ্যাকশন',
    noFile: 'কোনো ফাইল সংযুক্ত নেই',
    selectFile: 'ফাইল বাছাই করুন...',
    unmatch: 'বিচ্ছিন্ন করুন',
    enterDate: 'YYYY-MM-DD',
    uploadedFilesTitle: 'আপলোডকৃত ফাইলের তালিকা',
    dragDropText: 'PDF ফাইলসমূহ এখানে টেনে আনুন অথবা ক্লিক করে আপলোড করুন (সর্বোচ্চ ৩০টি, ৫০ মেগাবাইট)',
    supportedFormat: 'শুধুমাত্র PDF গ্রহণযোগ্য। ডুপ্লিকেট কনটেন্ট স্বয়ংক্রিয়ভাবে শনাক্ত হবে।',
    removeFile: 'মুছুন',
    duplicateWarning: 'ডুপ্লিকেট ফাইল শনাক্ত হয়েছে',
    duplicateOf: 'হুবহু একই ফাইলের প্রতিরূপ:',
    blockingNotice: 'নিচের নথিপত্র অসম্পূর্ণ বা মেয়াদোত্তীর্ণ থাকায় প্যাকেজ তৈরি করা যাচ্ছে না:',
    allClearNotice: 'সকল নথি যাচাই সম্পন্ন! অফিশিয়াল PDF প্যাকেজ তৈরি করার জন্য প্রস্তুত।',
    totalDocs: 'সংযুক্ত মোট নথি',
    totalPagesEst: 'প্যাকেজের মোট পৃষ্ঠা',
    statusSummary: 'স্ট্যাটাস সারসংক্ষেপ',
    missingError: 'Missing',
    expiryNeededError: 'Expiry date needed',
    expiredError: 'Expired',
    notProvidedNotice: 'Not provided',
    okSuccess: 'OK',
    footerNotice: 'এআই ডেভফেস্ট ২০২৬ কনটেস্ট • স্বয়ংক্রিয় সল্যুশন',
    filterAll: 'সকল রিকোয়ারমেন্ট',
    filterBlocking: 'শুধুমাত্র ব্লকিং সমস্যা',
    filterOk: 'যাচাইকৃত নথি'
  }
};
