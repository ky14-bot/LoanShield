export type Verdict = 'verified' | 'caution' | 'high_risk' | 'unverified';

export type CheckStatus = 'pass' | 'fail' | 'warn' | 'info' | 'unknown';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface NbfcEntry {
  name: string;
  region: string;
  acceptsDeposits: string;
  classification: string;
  cin: string;
  layer: string;
  address: string;
  email: string;
}

export interface RbiDirectoryEntry {
  appName: string;
  lsp: string;
  lender: string;
  regulatedEntity: string;
  rbiRegistration: string;
  website: string;
  emailDomain: string;
  contactNumber: string;
  category: 'NBFC' | 'Bank' | 'Fintech-LSP';
  privacyPolicy: boolean;
  termsOfUse: boolean;
  securityPolicy: boolean;
  kfsCompliance: boolean;
  grievanceOfficer: string;
  grievanceEmail: string;
  kfsTemplate: KfsTemplate;
}

export interface KfsTemplate {
  aprRate: string;
  coolingOffPeriod: boolean;
  processingFee: string;
  otherCharges: string;
  aprVisible: boolean;
  processingFeeVisible: boolean;
  hiddenCharges: boolean;
  repaymentAmountVisible: boolean;
  grievanceContactVisible: boolean;
}

export interface SuspiciousApp {
  name: string;
  aliases: string[];
  redFlags: string[];
  reportCount: number;
}

export interface CheckResult {
  id: string;
  title: string;
  status: CheckStatus;
  detail: string;
  category: string;
  icon: string;
}

export interface PermissionFlag {
  permission: string;
  level: RiskLevel;
  reason: string;
}

export interface KfsCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export interface VerificationResult {
  query: string;
  verdict: Verdict;
  score: number;
  relationship: string[] | null;
  checks: CheckResult[];
  kfsChecks: KfsCheck[];
  kfsCompleteness: number;
  permissions: PermissionFlag[];
  upfrontFeeAlert: boolean;
  domainAgeDays: number | null;
  usesHttps: boolean;
  emailDomain: string | null;
  summary: string;
  recommendations: string[];
}

export type Screen = 'onboarding' | 'dashboard' | 'lender-search' | 'loan-status' | 'support';

export type SearchResultType = 'exact' | 'partial' | 'fuzzy';

export interface NbfcSearchResult {
  entry: NbfcEntry;
  matchType: SearchResultType;
  matchedField: string;
  score: number;
}

export interface LoanStatusEntry {
  id: string;
  lenderName: string;
  loanType: string;
  amount: number;
  status: 'pending' | 'approved' | 'disbursed' | 'rejected' | 'repayment';
  appliedDate: string;
  deadline: string | null;
  kfsProvided: boolean;
  documentsTransparent: boolean;
  nextStep: string;
}
