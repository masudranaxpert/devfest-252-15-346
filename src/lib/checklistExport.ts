import { EvaluatedRequirement, TenderDetails } from '../types';

/**
 * Generates and downloads a CSV export of the compliance checklist.
 */
export function exportChecklistCsv(
  tender: TenderDetails,
  evaluatedRequirements: EvaluatedRequirement[]
): void {
  const headers = ['Order', 'Requirement ID', 'Document Title (EN)', 'Document Title (BN)', 'Mandatory', 'Has Expiry', 'Matched File', 'Pages', 'Expiry Date', 'Status'];
  
  const rows = evaluatedRequirements.map(item => [
    item.requirement.order,
    `"${item.requirement.id}"`,
    `"${item.requirement.title_en}"`,
    `"${item.requirement.title_bn}"`,
    item.requirement.mandatory ? 'YES' : 'NO',
    item.requirement.has_expiry ? 'YES' : 'NO',
    item.matchedFile ? `"${item.matchedFile.name}"` : 'None',
    item.matchedFile ? item.matchedFile.pageCount : 0,
    item.expiryDate || 'N/A',
    `"${item.status}"`
  ]);

  const csvContent = [
    `# Tender Submission Compliance Checklist - ${tender.tender_id} (${tender.title})`,
    `# Generated at: ${new Date().toISOString()}`,
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${tender.tender_id}_Compliance_Checklist.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
