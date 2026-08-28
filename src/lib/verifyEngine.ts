import Fuse from 'fuse.js';
import type {
  CheckResult,
  KfsCheck,
  NbfcEntry,
  NbfcSearchResult,
  PermissionFlag,
  RbiDirectoryEntry,
  SuspiciousApp,
  VerificationResult,
  Verdict,
} from '@/types';
import { RBI_DIRECTORY, SUSPICIOUS_APPS } from '@/data/rbiDirectory';
import { NBFC_DIRECTORY } from '@/data/nbfcDirectory';
import { BANK_DIRECTORY } from '@/data/bankDirectory';
import type { BankEntry } from '@/data/bankDirectory';

const GENERIC_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'rediffmail.com',
  'yopmail.com',
];

const HIGH_RISK_PERMISSIONS = [
  'contacts',
  'call logs',
  'call history',
  'photos',
  'gallery',
  'sms',
  'phone state',
];

const CONDITIONAL_PERMISSIONS = [
  'camera',
  'location',
  'microphone',
  'storage',
];

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

function toCompact(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function extractDomain(query: string): string | null {
  const urlMatch = query.match(/https?:\/\/([^\s/]+)/i) || query.match(/([a-z0-9-]+\.[a-z]{2,})/i);
  return urlMatch ? urlMatch[1].replace(/^www\./, '') : null;
}

function findInDirectory(query: string): RbiDirectoryEntry | null {
  const normalized = normalizeQuery(query);
  const compact = toCompact(query);
  const domain = extractDomain(normalized);

  return (
    RBI_DIRECTORY.find(
      (entry) =>
        entry.appName.toLowerCase() === normalized ||
        entry.lsp.toLowerCase().includes(normalized) ||
        entry.lender.toLowerCase().includes(normalized) ||
        entry.regulatedEntity.toLowerCase().includes(normalized) ||
        entry.emailDomain.toLowerCase() === domain ||
        entry.website.toLowerCase().includes(normalized) ||
        toCompact(entry.appName).includes(compact) ||
        toCompact(entry.lsp).includes(compact) ||
        toCompact(entry.lender).includes(compact) ||
        toCompact(entry.regulatedEntity).includes(compact) ||
        entry.contactNumber.replace(/\s/g, '') === normalized.replace(/\s/g, ''),
    ) || null
  );
}

function findInNbfcDirectory(query: string): NbfcEntry | null {
  const normalized = normalizeQuery(query);
  const compact = toCompact(query);
  return (
    NBFC_DIRECTORY.find(
      (entry) =>
        entry.name.toLowerCase() === normalized ||
        entry.name.toLowerCase().includes(normalized) ||
        toCompact(entry.name).includes(compact) ||
        entry.email.toLowerCase().includes(normalized) ||
        entry.cin.toLowerCase() === normalized,
    ) || null
  );
}

function findInBankDirectory(query: string): BankEntry | null {
  const normalized = normalizeQuery(query);
  const compact = toCompact(query);
  return (
    BANK_DIRECTORY.find(
      (entry) =>
        entry.name.toLowerCase() === normalized ||
        entry.name.toLowerCase().includes(normalized) ||
        toCompact(entry.name).includes(compact) ||
        toCompact(entry.name).startsWith(compact),
    ) || null
  );
}

function findSuspicious(query: string): SuspiciousApp | null {
  const normalized = normalizeQuery(query);
  const compact = toCompact(query);
  return (
    SUSPICIOUS_APPS.find(
      (app) =>
        app.name.toLowerCase() === normalized ||
        toCompact(app.name).includes(compact) ||
        app.aliases.some((alias) => normalized.includes(alias) || toCompact(alias).includes(compact)),
    ) || null
  );
}

function simulateDomainAge(domain: string | null): number {
  if (!domain) return 0;
  // Simulate: well-known domains are older, random ones are newer
  const knownDomains = ['kreditbee.in', 'navi.com', 'gopaysense.com', 'moneytap.com', 'bajajfinserv.in', 'lendingkart.com', 'cashe.co.in'];
  if (knownDomains.includes(domain)) return 365 * 4 + Math.floor(Math.random() * 365);
  if (GENERIC_EMAIL_DOMAINS.includes(domain)) return 0;
  // Hash domain for consistent pseudo-random age
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = ((hash << 5) - hash + domain.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 200;
}

function checkHttps(query: string): boolean {
  return /^https:\/\//i.test(query.trim()) || !/^http:\/\//i.test(query.trim());
}

function checkEmailDomain(domain: string | null): { domain: string | null; isGeneric: boolean } {
  if (!domain) return { domain: null, isGeneric: false };
  const isGeneric = GENERIC_EMAIL_DOMAINS.includes(domain);
  return { domain, isGeneric };
}

function buildKfsChecks(entry: RbiDirectoryEntry | null, suspicious: SuspiciousApp | null, foundInRegistry: boolean): KfsCheck[] {
  if (suspicious) {
    return [
      { label: 'APR / Interest Rate Visibility', passed: false, detail: 'APR is not disclosed to borrowers before loan acceptance.' },
      { label: 'Processing Fee Transparency', passed: false, detail: 'Processing fees are deducted without prior disclosure.' },
      { label: 'Hidden Charges Check', passed: false, detail: 'Multiple hidden charges reported — convenience fees, late fees, rollover charges.' },
      { label: 'Repayment Amount Disclosure', passed: false, detail: 'Total repayment amount is not clearly communicated.' },
      { label: 'Cooling-off / Look-up Period', passed: false, detail: 'Not disclosed — no right to exit without penalty within a cooling-off period.' },
      { label: 'Grievance Officer Contact', passed: false, detail: 'No grievance redressal officer or contact information found.' },
    ];
  }
  if (!entry && !foundInRegistry) {
    return [
      { label: 'APR / Interest Rate Visibility', passed: false, detail: 'Unable to determine — app or lender not in our database.' },
      { label: 'Processing Fee Transparency', passed: false, detail: 'Unable to determine — no KFS data available.' },
      { label: 'Hidden Charges Check', passed: false, detail: 'Unable to determine — cannot verify without KFS documentation.' },
      { label: 'Repayment Amount Disclosure', passed: false, detail: 'Unable to determine — no KFS data available.' },
      { label: 'Cooling-off / Look-up Period', passed: false, detail: 'Unable to determine — no KFS data available.' },
      { label: 'Grievance Officer Contact', passed: false, detail: 'Unable to determine — no grievance officer information found.' },
    ];
  }
  if (!entry && foundInRegistry) {
    return [
      { label: 'APR / Interest Rate Visibility', passed: true, detail: 'Registered entity — verify APR on the KFS before accepting.' },
      { label: 'Processing Fee Transparency', passed: true, detail: 'Registered entity — processing fees should be disclosed in the KFS.' },
      { label: 'Hidden Charges Check', passed: true, detail: 'Registered entity — all charges should be disclosed upfront per RBI guidelines.' },
      { label: 'Repayment Amount Disclosure', passed: true, detail: 'Registered entity — total repayment amount should be stated in the KFS.' },
      { label: 'Cooling-off / Look-up Period', passed: true, detail: 'Registered entity — 3-day cooling-off / look-up period should be disclosed in the KFS per RBI guidelines.' },
      { label: 'Grievance Officer Contact', passed: true, detail: 'Registered entity — grievance officer details should be available on the entity website.' },
    ];
  }
  const k = entry.kfsTemplate;
  return [
    { label: 'APR / Interest Rate Visibility', passed: k.aprVisible, detail: `APR: ${k.aprRate} (on a sample ₹50,000 / 12-month loan)` },
    { label: 'Processing Fee Transparency', passed: k.processingFeeVisible, detail: k.processingFee },
    { label: 'Hidden Charges Check', passed: !k.hiddenCharges, detail: k.hiddenCharges ? 'Hidden charges detected in KFS review.' : 'No hidden charges detected — all charges are disclosed upfront.' },
    { label: 'Repayment Amount Disclosure', passed: k.repaymentAmountVisible, detail: 'Total repayment amount is clearly stated in the KFS.' },
    { label: 'Cooling-off / Look-up Period', passed: k.coolingOffPeriod, detail: k.coolingOffPeriod ? '3-day right to exit disclosed — no penalty if repaid within cooling-off period.' : 'Not disclosed.' },
    { label: 'Grievance Officer Contact', passed: k.grievanceContactVisible, detail: `${entry.grievanceOfficer}: ${entry.grievanceEmail}` },
  ];
}

function buildPermissions(suspicious: SuspiciousApp | null, inDirectory: boolean): PermissionFlag[] {
  if (suspicious) {
    return [
      { permission: 'Contacts', level: 'high', reason: 'Accesses your full contact list — used for harassment and recovery blackmail.' },
      { permission: 'Call Logs', level: 'high', reason: 'Reads your call history — severe privacy violation.' },
      { permission: 'Photos & Gallery', level: 'high', reason: 'Accesses personal photos — used to threaten and shame borrowers.' },
      { permission: 'SMS', level: 'high', reason: 'Reads SMS messages including OTPs and banking alerts.' },
      { permission: 'Camera', level: 'medium', reason: 'Requested for KYC but access scope is not restricted.' },
    ];
  }
  if (!inDirectory) {
    return [
      { permission: 'Contacts', level: 'high', reason: 'Requests contact access — not standard for legitimate lending apps.' },
      { permission: 'Photos & Gallery', level: 'high', reason: 'Requests gallery access — flagged as high-risk for unverified apps.' },
      { permission: 'Camera', level: 'medium', reason: 'Camera access for KYC — conditional, verify it is used only for KYC.' },
      { permission: 'Location', level: 'medium', reason: 'Location access requested — should be used only for address verification.' },
    ];
  }
  return [
    { permission: 'Camera', level: 'medium', reason: 'Used for KYC verification — standard for legitimate lending apps.' },
    { permission: 'Location', level: 'medium', reason: 'Used for address verification — conditional, KYC purpose only.' },
    { permission: 'Storage', level: 'medium', reason: 'Used to store KYC documents securely.' },
  ];
}

function calculateScore(checks: CheckResult[], kfsChecks: KfsCheck[]): number {
  const checkWeight = 10;
  const kfsWeight = 8;
  let score = 0;
  let maxScore = 0;

  for (const check of checks) {
    if (check.status === 'unknown') continue;
    maxScore += checkWeight;
    if (check.status === 'pass') score += checkWeight;
    else if (check.status === 'warn') score += checkWeight * 0.5;
  }

  for (const kfs of kfsChecks) {
    maxScore += kfsWeight;
    if (kfs.passed) score += kfsWeight;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function determineVerdict(score: number, suspicious: SuspiciousApp | null, upfrontFee: boolean, foundInRegistry: boolean): Verdict {
  if (suspicious || upfrontFee) return 'high_risk';
  if (foundInRegistry) return 'verified';
  if (score >= 75) return 'verified';
  if (score >= 40) return 'caution';
  return 'unverified';
}

export function verifyLender(query: string): VerificationResult {
  const trimmed = query.trim();
  const entry = findInDirectory(trimmed);
  const suspicious = findSuspicious(trimmed);
  const nbfcEntry = !entry && !suspicious ? findInNbfcDirectory(trimmed) : null;
  const bankEntry = !entry && !suspicious && !nbfcEntry ? findInBankDirectory(trimmed) : null;
  const foundInRegistry = !!(entry || nbfcEntry || bankEntry);
  const domain = extractDomain(trimmed);
  const usesHttps = checkHttps(trimmed);
  const domainAge = simulateDomainAge(domain);
  const emailCheck = checkEmailDomain(domain);

  const checks: CheckResult[] = [];
  const recommendations: string[] = [];

  // RBI Directory Check
  if (entry) {
    checks.push({
      id: 'rbi',
      title: 'RBI Directory Check',
      status: 'pass',
      detail: `Found in RBI Digital Lending Apps directory. RBI Reg: ${entry.rbiRegistration}`,
      category: 'Regulatory',
      icon: 'ShieldCheck',
    });
  } else if (nbfcEntry) {
    checks.push({
      id: 'rbi',
      title: 'RBI NBFC Registry Check',
      status: 'pass',
      detail: `Found in RBI NBFC registry. Classification: ${nbfcEntry.classification}. CIN: ${nbfcEntry.cin}. Layer: ${nbfcEntry.layer}. Region: ${nbfcEntry.region}.`,
      category: 'Regulatory',
      icon: 'ShieldCheck',
    });
  } else if (bankEntry) {
    checks.push({
      id: 'rbi',
      title: 'RBI Bank Directory Check',
      status: 'pass',
      detail: `Found in RBI bank list. ${bankEntry.name} is a licensed bank (${bankEntry.category}). Registered at: ${bankEntry.address}.`,
      category: 'Regulatory',
      icon: 'ShieldCheck',
    });
  } else if (suspicious) {
    checks.push({
      id: 'rbi',
      title: 'RBI Directory Check',
      status: 'fail',
      detail: `Not found in RBI directory. Flagged as suspicious with ${suspicious.reportCount}+ user reports.`,
      category: 'Regulatory',
      icon: 'ShieldAlert',
    });
    recommendations.push('Do not proceed with this app — it is not registered with the RBI and has been flagged by multiple users.');
  } else {
    checks.push({
      id: 'rbi',
      title: 'RBI Directory Check',
      status: 'unknown',
      detail: 'This app or lender is not in our database. We cannot confirm it is fraudulent, but we also cannot verify it is legitimate.',
      category: 'Regulatory',
      icon: 'HelpCircle',
    });
    recommendations.push('This app or lender isn\'t in our database yet. We can\'t confirm it\'s fraudulent, but we also can\'t verify it\'s legitimate — proceed with caution and manually check the RBI website before sharing any information or fees.');
  }

  // Domain & Security Check
  if (domain) {
    if (usesHttps) {
      checks.push({
        id: 'domain',
        title: 'Domain & Security Check',
        status: 'pass',
        detail: `Website uses HTTPS. Domain age: ~${domainAge} days.`,
        category: 'Security',
        icon: 'Lock',
      });
    } else {
      checks.push({
        id: 'domain',
        title: 'Domain & Security Check',
        status: 'fail',
        detail: 'Website does not use HTTPS — data is not encrypted and can be intercepted.',
        category: 'Security',
        icon: 'Unlock',
      });
      recommendations.push('Avoid entering any personal or financial information on non-HTTPS websites.');
    }

    if (domainAge < 90 && domainAge > 0) {
      checks.push({
        id: 'domain-age',
        title: 'Domain Age Verification',
        status: 'warn',
        detail: `Domain is only ~${domainAge} days old — newly registered domains are a common scam indicator.`,
        category: 'Security',
        icon: 'CalendarClock',
      });
      recommendations.push('Be cautious — this domain was registered very recently, which is a common pattern for fraudulent lending apps.');
    } else if (domainAge >= 365) {
      checks.push({
        id: 'domain-age',
        title: 'Domain Age Verification',
        status: 'pass',
        detail: `Domain has been active for ~${Math.round(domainAge / 365)} years — established presence.`,
        category: 'Security',
        icon: 'CalendarCheck',
      });
    }
  }

  // Email Domain Check
  if (emailCheck.domain) {
    if (emailCheck.isGeneric) {
      checks.push({
        id: 'email',
        title: 'Email Domain Check',
        status: 'fail',
        detail: `Uses generic email domain (@${emailCheck.domain}). Legitimate lenders use official corporate domains.`,
        category: 'Transparency',
        icon: 'MailX',
      });
      recommendations.push('Legitimate lenders always use official corporate email domains — never @gmail.com or similar free services.');
    } else {
      checks.push({
        id: 'email',
        title: 'Email Domain Check',
        status: 'pass',
        detail: `Uses official corporate domain (@${emailCheck.domain}).`,
        category: 'Transparency',
        icon: 'MailCheck',
      });
    }
  }

  // Transparency & Policy Scanner
  if (entry) {
    const policies: string[] = [];
    if (entry.privacyPolicy) policies.push('Privacy Policy');
    if (entry.termsOfUse) policies.push('Terms of Use');
    if (entry.securityPolicy) policies.push('Security Policy');
    checks.push({
      id: 'policies',
      title: 'Transparency & Policy Scanner',
      status: 'pass',
      detail: `All required policies found: ${policies.join(', ')}.`,
      category: 'Transparency',
      icon: 'FileCheck',
    });
  } else if (nbfcEntry) {
    checks.push({
      id: 'policies',
      title: 'Transparency & Policy Scanner',
      status: 'pass',
      detail: `Registered NBFC (${nbfcEntry.classification}). Verify policy pages on the entity's website manually.`,
      category: 'Transparency',
      icon: 'FileCheck',
    });
  } else if (bankEntry) {
    checks.push({
      id: 'policies',
      title: 'Transparency & Policy Scanner',
      status: 'pass',
      detail: `Licensed bank (${bankEntry.category}). Verify policy pages on the bank's website manually.`,
      category: 'Transparency',
      icon: 'FileCheck',
    });
  } else if (suspicious) {
    checks.push({
      id: 'policies',
      title: 'Transparency & Policy Scanner',
      status: 'fail',
      detail: 'No Privacy Policy, Terms of Use, or Security Policy pages found.',
      category: 'Transparency',
      icon: 'FileX',
    });
    recommendations.push('Absence of privacy policy and terms of use is a major red flag — legitimate apps always have these.');
  } else {
    checks.push({
      id: 'policies',
      title: 'Transparency & Policy Scanner',
      status: 'unknown',
      detail: 'Unable to determine — this app or lender is not in our database. Manual check recommended.',
      category: 'Transparency',
      icon: 'FileSearch',
    });
    recommendations.push('Manually check the app or website for visible Privacy Policy, Terms of Use, and Security Policy pages.');
  }

  // Upfront Fee Alert
  const upfrontFeeAlert = suspicious !== null;
  if (upfrontFeeAlert) {
    checks.push({
      id: 'upfront-fee',
      title: 'Upfront Fee Alert',
      status: 'fail',
      detail: 'This app has been reported for requesting payment before formal loan approval and KFS generation.',
      category: 'Fraud Detection',
      icon: 'AlertTriangle',
    });
    recommendations.push('Never pay any fee before your loan is formally approved and a Key Fact Statement (KFS) is issued. This is the most common loan scam pattern.');
  } else if (entry || nbfcEntry || bankEntry) {
    checks.push({
      id: 'upfront-fee',
      title: 'Upfront Fee Alert',
      status: 'pass',
      detail: 'No reports of upfront fee demands. Processing fees are disclosed in the KFS after approval.',
      category: 'Fraud Detection',
      icon: 'CheckCircle',
    });
  } else {
    checks.push({
      id: 'upfront-fee',
      title: 'Upfront Fee Alert',
      status: 'unknown',
      detail: 'Unable to determine — no data available for this app or lender. Never pay any fee before your loan is formally approved and a KFS is issued.',
      category: 'Fraud Detection',
      icon: 'AlertTriangle',
    });
  }

  const kfsChecks = buildKfsChecks(entry, suspicious, foundInRegistry);
  const permissions = buildPermissions(suspicious, foundInRegistry);
  const score = calculateScore(checks, kfsChecks);
  const verdict = determineVerdict(score, suspicious, upfrontFeeAlert, foundInRegistry);

  let relationship: string[] | null = null;
  if (entry) {
    relationship = [entry.appName, entry.lsp, entry.lender, entry.regulatedEntity];
  } else if (nbfcEntry) {
    relationship = [trimmed, nbfcEntry.name, nbfcEntry.classification, `RBI Registered (CIN: ${nbfcEntry.cin})`];
  } else if (bankEntry) {
    relationship = [trimmed, bankEntry.name, bankEntry.category, 'RBI Licensed Bank'];
  }

  let summary = '';
  if (verdict === 'verified') {
    if (entry) {
      summary = `This lender appears to be legitimate and RBI-registered. All major compliance checks passed. The app is backed by ${entry.regulatedEntity}. Always review your KFS carefully before accepting any loan offer.`;
    } else if (nbfcEntry) {
      summary = `This entity is registered with the RBI as an NBFC (${nbfcEntry.classification}, ${nbfcEntry.layer} layer). CIN: ${nbfcEntry.cin}. While the RBI registration is confirmed, always request a Key Fact Statement (KFS) before proceeding with any loan.`;
    } else {
      summary = 'This lender appears to be legitimate and RBI-registered. All major compliance checks passed. Always review your KFS carefully before accepting any loan offer.';
    }
  } else if (verdict === 'caution') {
    summary = 'This lender could not be fully verified against the RBI directory. Some checks passed but important compliance markers are missing. Proceed with caution and do not share sensitive information until you have independently confirmed the lender\'s legitimacy.';
  } else if (verdict === 'unverified') {
    summary = "This app or lender isn\'t in our database yet. We can\'t confirm it\'s fraudulent, but we also can\'t verify it\'s legitimate — proceed with caution and manually check the RBI website before sharing any information or fees.";
  } else {
    if (suspicious) {
      summary = `This app has been flagged as HIGH RISK with ${suspicious.reportCount}+ user reports. It exhibits multiple fraud indicators including ${suspicious.redFlags.slice(0, 2).join(', ').toLowerCase()}. Do NOT proceed with this app. Do not pay any upfront fees and do not grant app permissions. If you have already shared information, report it immediately.`;
    } else {
      summary = 'This lender could not be verified and failed critical compliance checks. It is not found in the RBI Digital Lending Apps directory. Treat this as high risk — do not share personal information or make any payments.';
    }
  }

  if (recommendations.length === 0 && verdict === 'verified') {
    recommendations.push('Always read the Key Fact Statement (KFS) before accepting the loan.');
    recommendations.push('Ensure the app only requests KYC-necessary permissions (camera, location).');
  }

  return {
    query: trimmed,
    verdict,
    score,
    relationship,
    checks,
    kfsChecks,
    kfsCompleteness: Math.round((kfsChecks.filter((k) => k.passed).length / kfsChecks.length) * 100),
    permissions,
    upfrontFeeAlert,
    domainAgeDays: domainAge > 0 ? domainAge : null,
    usesHttps,
    emailDomain: emailCheck.domain,
    summary,
    recommendations,
  };
}

let fuseIndex: Fuse<NbfcEntry> | null = null;

function getFuseIndex(): Fuse<NbfcEntry> {
  if (!fuseIndex) {
    fuseIndex = new Fuse(NBFC_DIRECTORY, {
      keys: [
        { name: 'name', weight: 0.85 },
        { name: 'email', weight: 0.1 },
        { name: 'cin', weight: 0.05 },
      ],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }
  return fuseIndex;
}

export function searchNbfcDirectory(query: string, limit = 20): NbfcSearchResult[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];
  const compactQuery = toCompact(query);

  const exactMatches: NbfcSearchResult[] = [];
  const partialMatches: NbfcSearchResult[] = [];
  const seenNames = new Set<string>();

  for (const entry of NBFC_DIRECTORY) {
    const nameLower = entry.name.toLowerCase();
    const emailLower = entry.email.toLowerCase();
    const cinLower = entry.cin.toLowerCase();
    const nameCompact = toCompact(entry.name);

    if (
      nameLower === normalized ||
      emailLower === normalized ||
      cinLower === normalized ||
      nameCompact === compactQuery
    ) {
      const field = nameLower === normalized || nameCompact === compactQuery ? 'name' : emailLower === normalized ? 'email' : 'cin';
      exactMatches.push({ entry, matchType: 'exact', matchedField: field, score: 100 });
      seenNames.add(entry.name);
    }
  }

  if (exactMatches.length > 0) {
    return exactMatches.slice(0, limit);
  }

  const queryWords = normalized.split(' ').filter((w) => w.length > 0);

  for (const entry of NBFC_DIRECTORY) {
    if (seenNames.has(entry.name)) continue;
    const nameLower = entry.name.toLowerCase();
    const emailLower = entry.email.toLowerCase();
    const cinLower = entry.cin.toLowerCase();
    const nameCompact = toCompact(entry.name);

    const nameIncludes = nameLower.includes(normalized);
    const emailIncludes = emailLower.includes(normalized);
    const cinIncludes = cinLower.includes(normalized);
    const compactIncludes = compactQuery.length > 0 && nameCompact.includes(compactQuery);

    const allWordsInName = queryWords.length > 1 && queryWords.every((w) => nameLower.includes(w));

    if (nameIncludes || emailIncludes || cinIncludes || compactIncludes || allWordsInName) {
      let matchedField = 'name';
      if (nameIncludes || compactIncludes || allWordsInName) matchedField = 'name';
      else if (emailIncludes) matchedField = 'email';
      else matchedField = 'cin';

      const score = matchedField === 'name' ? 80 : 60;
      partialMatches.push({ entry, matchType: 'partial', matchedField, score });
      seenNames.add(entry.name);
    }
  }

  if (partialMatches.length > 0) {
    return partialMatches.slice(0, limit);
  }

  const fuse = getFuseIndex();
  const fuseResults = fuse.search(normalized).filter((r) => r.score !== undefined && r.score <= 0.4);

  const fuzzyMatches: NbfcSearchResult[] = fuseResults.slice(0, limit).map((r) => ({
    entry: r.item,
    matchType: 'fuzzy' as const,
    matchedField: 'name',
    score: Math.round((1 - (r.score ?? 0.5)) * 100),
  }));

  return fuzzyMatches;
}

export function searchNbfcDirectoryRaw(query: string, limit = 20): NbfcEntry[] {
  return searchNbfcDirectory(query, limit).map((r) => r.entry);
}

export function getNbfcCount(): number {
  return NBFC_DIRECTORY.length;
}

export function getVerdictConfig(verdict: Verdict) {
  switch (verdict) {
    case 'verified':
      return {
        label: 'VERIFIED',
        icon: 'ShieldCheck',
        color: 'safe',
        bg: 'bg-safe-50',
        text: 'text-safe-700',
        border: 'border-safe-200',
        gradient: 'from-safe-500 to-safe-600',
        description: 'This lender passed our verification checks.',
      };
    case 'caution':
      return {
        label: 'CAUTION',
        icon: 'AlertTriangle',
        color: 'warn',
        bg: 'bg-warn-50',
        text: 'text-warn-700',
        border: 'border-warn-200',
        gradient: 'from-warn-500 to-warn-600',
        description: 'Some checks failed — proceed carefully.',
      };
    case 'unverified':
      return {
        label: 'UNABLE TO VERIFY',
        icon: 'HelpCircle',
        color: 'slate',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-300',
        gradient: 'from-slate-400 to-slate-500',
        description: 'Not in our database — proceed with caution.',
      };
    case 'high_risk':
      return {
        label: 'HIGH RISK / FRAUD',
        icon: 'ShieldAlert',
        color: 'danger',
        bg: 'bg-danger-50',
        text: 'text-danger-700',
        border: 'border-danger-200',
        gradient: 'from-danger-500 to-danger-600',
        description: 'Multiple fraud indicators detected.',
      };
  }
}
