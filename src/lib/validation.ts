import { TenderConfig } from '../types/index.ts';

export interface ValidationIssue {
  field: string;
  messageEn: string;
  messageBn: string;
}

/**
 * Validates the loaded requirements.json according to Section 3 specification.
 */
export function validateRequirementsJson(data: unknown): {
  valid: boolean;
  config?: TenderConfig;
  errors: ValidationIssue[];
} {
  const errors: ValidationIssue[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{
        field: 'root',
        messageEn: 'Invalid JSON: root must be an object.',
        messageBn: 'অবৈধ JSON: মূল ডেটা একটি অবজেক্ট হতে হবে।'
      }]
    };
  }

  const obj = data as Record<string, unknown>;

  // Check tender
  if (!obj.tender || typeof obj.tender !== 'object') {
    errors.push({
      field: 'tender',
      messageEn: 'Missing "tender" object.',
      messageBn: '"tender" অবজেক্টটি পাওয়া যায়নি।'
    });
  } else {
    const tender = obj.tender as Record<string, unknown>;
    const requiredTenderFields = ['tender_id', 'title', 'procuring_entity', 'bidder', 'submission_deadline'];
    for (const f of requiredTenderFields) {
      if (typeof tender[f] !== 'string' || !tender[f]) {
        errors.push({
          field: `tender.${f}`,
          messageEn: `Missing or invalid string for tender field "${f}".`,
          messageBn: `টেন্ডার ফিল্ড "${f}" পাওয়া যায়নি বা সঠিক নয়।`
        });
      }
    }
  }

  // Check requirements
  if (!Array.isArray(obj.requirements)) {
    errors.push({
      field: 'requirements',
      messageEn: '"requirements" must be an array of documents.',
      messageBn: '"requirements" অবশ্যই ডকুমেন্টের একটি অ্যারে হতে হবে।'
    });
  } else {
    if (obj.requirements.length === 0) {
      errors.push({
        field: 'requirements',
        messageEn: '"requirements" array is empty.',
        messageBn: '"requirements" তালিকায় কোনো ডকুমেন্ট নেই।'
      });
    }

    const seenOrders = new Set<number>();
    const seenIds = new Set<string>();

    obj.requirements.forEach((req, idx) => {
      if (!req || typeof req !== 'object') {
        errors.push({
          field: `requirements[${idx}]`,
          messageEn: `Requirement at index ${idx} is not an object.`,
          messageBn: `সূচক ${idx}-এ রিকোয়ারমেন্টটি অবজেক্ট নয়।`
        });
        return;
      }
      const r = req as Record<string, unknown>;
      if (typeof r.id !== 'string' || !r.id) {
        errors.push({
          field: `requirements[${idx}].id`,
          messageEn: `Missing requirement id at index ${idx}.`,
          messageBn: `সূচক ${idx}-এ রিকোয়ারমেন্ট আইডি অনুপস্থিত।`
        });
      } else if (seenIds.has(r.id)) {
        errors.push({
          field: `requirements[${idx}].id`,
          messageEn: `Duplicate requirement id "${r.id}".`,
          messageBn: `ডুপ্লিকেট রিকোয়ারমেন্ট আইডি "${r.id}"।`
        });
      } else {
        seenIds.add(r.id);
      }

      if (typeof r.order !== 'number' || r.order < 1) {
        errors.push({
          field: `requirements[${idx}].order`,
          messageEn: `Invalid order for requirement at index ${idx}.`,
          messageBn: `সূচক ${idx}-এ অর্ডার নম্বরটি সঠিক নয়।`
        });
      } else if (seenOrders.has(r.order)) {
        errors.push({
          field: `requirements[${idx}].order`,
          messageEn: `Duplicate order number ${r.order}.`,
          messageBn: `ডুপ্লিকেট অর্ডার নম্বর ${r.order}।`
        });
      } else {
        seenOrders.add(r.order);
      }

      if (typeof r.title_en !== 'string') {
        errors.push({
          field: `requirements[${idx}].title_en`,
          messageEn: `Missing title_en for requirement ${r.id || idx}.`,
          messageBn: `রিকোয়ারমেন্ট ${r.id || idx}-এ title_en নেই।`
        });
      }
      if (typeof r.title_bn !== 'string') {
        errors.push({
          field: `requirements[${idx}].title_bn`,
          messageEn: `Missing title_bn for requirement ${r.id || idx}.`,
          messageBn: `রিকোয়ারমেন্ট ${r.id || idx}-এ title_bn নেই।`
        });
      }
      if (typeof r.mandatory !== 'boolean') {
        errors.push({
          field: `requirements[${idx}].mandatory`,
          messageEn: `Missing boolean "mandatory" flag for ${r.id || idx}.`,
          messageBn: `রিকোয়ারমেন্ট ${r.id || idx}-এ "mandatory" বুলিয়ান নেই।`
        });
      }
      if (typeof r.has_expiry !== 'boolean') {
        errors.push({
          field: `requirements[${idx}].has_expiry`,
          messageEn: `Missing boolean "has_expiry" flag for ${r.id || idx}.`,
          messageBn: `রিকোয়ারমেন্ট ${r.id || idx}-এ "has_expiry" বুলিয়ান নেই।`
        });
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    config: data as TenderConfig,
    errors: []
  };
}

/**
 * Validates an uploaded file: must be a PDF, check size and total limits.
 */
export function validateUploadedFile(
  file: File,
  currentCount: number,
  currentTotalBytes: number
): { valid: boolean; errorEn?: string; errorBn?: string } {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return {
      valid: false,
      errorEn: `"${file.name}" is not a PDF file. Only PDF files are accepted.`,
      errorBn: `"${file.name}" কোনো PDF ফাইল নয়। শুধুমাত্র PDF ফাইল গ্রহণযোগ্য।`
    };
  }

  if (currentCount >= 30) {
    return {
      valid: false,
      errorEn: 'Maximum limit of 30 files exceeded.',
      errorBn: 'সর্বোচ্চ ৩০টি ফাইলের সীমা অতিক্রান্ত হয়েছে।'
    };
  }

  const maxBytes = 50 * 1024 * 1024; // 50MB
  if (currentTotalBytes + file.size > maxBytes) {
    return {
      valid: false,
      errorEn: 'Total files size exceeds 50 MB limit.',
      errorBn: 'মোট ফাইলের আকার ৫০ মেগাবাইটের সীমা অতিক্রম করেছে।'
    };
  }

  return { valid: true };
}
