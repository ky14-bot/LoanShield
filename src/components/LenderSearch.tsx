import { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  ArrowLeft,
  Loader2,
  Lock,
  Unlock,
  MailCheck,
  MailX,
  FileCheck,
  FileX,
  FileSearch,
  AlertTriangle,
  CheckCircle,
  CalendarClock,
  CalendarCheck,
  ShieldAlert,
  Handshake,
  Building2,
  Banknote,
  Landmark,
  ChevronRight,
  Lightbulb,
  Smartphone,
  Phone,
  Globe,
  MapPin,
  Mail,
  BadgeCheck,
  Building,
  FileText,
  HelpCircle,
} from 'lucide-react';
import type { VerificationResult, CheckStatus, PermissionFlag, RiskLevel, NbfcSearchResult, NbfcEntry } from '@/types';
import { verifyLender, getVerdictConfig, searchNbfcDirectory, getNbfcCount } from '@/lib/verifyEngine';
import { isUrlOrDomain, searchByDomain, normalizeDomain, getRegisteredDomain, type DomainSearchResult } from '@/lib/domainUtils';
import { RBI_DIRECTORY, SUSPICIOUS_APPS } from '@/data/rbiDirectory';
import { ThemeToggle } from '@/components/ThemeToggle';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  MailCheck,
  MailX,
  FileCheck,
  FileX,
  FileSearch,
  AlertTriangle,
  CheckCircle,
  CalendarClock,
  CalendarCheck,
  HelpCircle,
};

interface LenderSearchProps {
  onBack: () => void;
}

export function LenderSearch({ onBack }: LenderSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [nbfcResults, setNbfcResults] = useState<NbfcSearchResult[]>([]);
  const [nbfcSearch, setNbfcSearch] = useState('');
  const [nbfcPage, setNbfcPage] = useState(0);
  const [selectedNbfc, setSelectedNbfc] = useState<NbfcEntry | null>(null);
  const [domainResult, setDomainResult] = useState<DomainSearchResult | null>(null);
  const [domainNotFound, setDomainNotFound] = useState<string | null>(null);
  const nbfcDetailRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const domainRef = useRef<HTMLDivElement>(null);
  const nbfcCount = getNbfcCount();
  const NBFC_PAGE_SIZE = 12;

  const handleSearch = (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setResult(null);
    setSelectedNbfc(null);
    setDomainResult(null);
    setDomainNotFound(null);
    setTimeout(() => {
      if (isUrlOrDomain(q)) {
        const domainMatch = searchByDomain(q);
        if (domainMatch) {
          setDomainResult(domainMatch);
          setSelectedNbfc(domainMatch.entry);
        } else {
          const normalized = normalizeDomain(q);
          setDomainNotFound(normalized || q);
        }
        setLoading(false);
      } else {
        const res = verifyLender(q);
        setResult(res);
        setLoading(false);
      }
    }, 1200);
  };

  const handleNbfcSelect = (entry: NbfcEntry) => {
    setSelectedNbfc(entry);
    setResult(null);
    setDomainResult(null);
    setDomainNotFound(null);
    setTimeout(() => {
      if (nbfcDetailRef.current) {
        nbfcDetailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (domainResult && domainRef.current) {
      domainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result, domainResult]);

  const handleNbfcSearch = (q: string) => {
    setNbfcSearch(q);
    setNbfcPage(0);
    setNbfcResults(q.trim() ? searchNbfcDirectory(q, 100) : []);
  };
  const hasFuzzyResults = nbfcResults.length > 0 && nbfcResults[0].matchType === 'fuzzy';
  const suggestions = [
    'KreditBee',
    'QuickCash Pro',
    'EasyLoan 24x7',
    'https://www.aadharhousing.com',
    'Bajaj Finserv',
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/60 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <ThemeToggle variant="subtle" />
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-500 to-trust-700 flex items-center justify-center shadow-lg shadow-trust-500/20 flex-shrink-0">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-none truncate">Lender & App Search</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verify against RBI DLA directory</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Verify a Lender or App</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Enter an app name, lender/NBFC name, website URL, or contact number to run a full multi-signal risk analysis.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            Search a lender name or paste a website link to check it against registered contact information.
          </p>

          {/* Search Bar */}
          <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}>
            <div className={`flex items-center gap-3 rounded-2xl border-2 bg-slate-50 dark:bg-slate-800/60 transition-all duration-300 ${
              searchFocused ? 'border-trust-500 bg-white shadow-lg shadow-trust-500/10' : 'border-slate-200 dark:border-slate-700'
            }`}>
              <div className="pl-4">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-trust-500 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search a lender or paste a website URL"
                className="flex-1 bg-transparent py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-sm sm:text-base"
                disabled={loading}
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="m-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-trust-500 to-trust-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-trust-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Scanning...' : 'Verify'}
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          {!result && !loading && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-400 mb-2.5">Try a sample search:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-trust-50 hover:text-trust-700 text-sm text-slate-600 font-medium transition-colors border border-slate-200 dark:border-slate-700 hover:border-trust-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-8 animate-fade-in">
            <div className="flex flex-col items-center text-center py-8">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-trust-100" />
                <div className="absolute inset-0 rounded-full border-4 border-trust-500 border-t-transparent animate-spin" />
                <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-trust-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">Running multi-signal analysis...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cross-referencing RBI directory, domain security, and compliance markers</p>
              <div className="mt-6 space-y-2 w-full max-w-xs">
                {['RBI Directory Check', 'Domain & Security Scan', 'KFS Compliance Review', 'Permission Audit'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2 text-sm text-slate-400 animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                    <Loader2 className="w-4 h-4 animate-spin text-trust-400" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div ref={resultRef} className="mt-6 space-y-5">
            <VerdictCard result={result} />
            <RelationshipCard result={result} />
            <EvidenceCard result={result} />
            <KfsCard result={result} />
            <PermissionsCard result={result} />
            <RecommendationsCard result={result} />
          </div>
        )}

        {/* Domain Verification Result */}
        {domainResult && !loading && (
          <div ref={domainRef} className="mt-6 space-y-5">
            <DomainVerificationCard domainResult={domainResult} />
          </div>
        )}

        {/* Domain Not Found */}
        {domainNotFound && !loading && (
          <div ref={domainRef} className="mt-6">
            <DomainNotFoundCard domain={domainNotFound} onBack={() => { setDomainNotFound(null); setQuery(''); }} />
          </div>
        )}

        {/* NBFC Registry Detail */}
        {selectedNbfc && !loading && (
          <div ref={nbfcDetailRef} className="mt-6 space-y-5">
            <NbfcDetailCard entry={selectedNbfc} onBack={() => setSelectedNbfc(null)} />
          </div>
        )}

        {/* Directory Preview */}
        {!result && !loading && !selectedNbfc && !domainResult && !domainNotFound && (
          <div className="mt-8 space-y-8">
            {/* Featured RBI DLA Lenders */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-5 h-5 text-trust-500" />
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Featured RBI Digital Lending Apps</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RBI_DIRECTORY.map((entry) => (
                  <button
                    key={entry.appName}
                    onClick={() => handleSearch(entry.appName)}
                    className="group flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 hover:border-trust-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-trust-50 dark:bg-trust-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-trust-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{entry.appName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{entry.regulatedEntity}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-trust-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Full NBFC Registry Search */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Landmark className="w-5 h-5 text-trust-500" />
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Full RBI NBFC Registry</h3>
                <span className="ml-auto text-xs font-semibold text-trust-600 bg-trust-50 dark:bg-trust-900/30 px-2.5 py-1 rounded-full">
                  {nbfcCount.toLocaleString()} entries
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Search the complete RBI NBFC directory (as of June 30, 2026). Enter any NBFC name, email, or CIN to verify registration.
              </p>

              <div className="relative mb-4">
                <div className="flex items-center gap-3 rounded-2xl border-2 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus-within:border-trust-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                  <div className="pl-4">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={nbfcSearch}
                    onChange={(e) => handleNbfcSearch(e.target.value)}
                    placeholder="Search 8,500+ NBFCs by name, email, or CIN..."
                    className="flex-1 bg-transparent py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-sm"
                  />
                </div>
              </div>

              {hasFuzzyResults && (
                <div className="mb-4 rounded-2xl border border-warn-200 bg-warn-50 p-4 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-4 h-4 text-warn-600 flex-shrink-0" />
                    <p className="text-sm font-semibold text-warn-700">Did you mean?</p>
                  </div>
                  <p className="text-xs text-warn-600 mb-3">
                    No exact or partial match found. Here are the closest registered entities:
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(nbfcSearch ? nbfcResults : []).slice(nbfcPage * NBFC_PAGE_SIZE, nbfcPage * NBFC_PAGE_SIZE + NBFC_PAGE_SIZE).map((result, idx) => (
                  <button
                    key={`${result.entry.cin}-${idx}`}
                    onClick={() => handleNbfcSelect(result.entry)}
                    className={`group flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border p-4 hover:shadow-md transition-all text-left ${
                      result.matchType === 'fuzzy'
                        ? 'border-warn-200 hover:border-warn-300'
                        : 'border-slate-200 dark:border-slate-700/80 hover:border-trust-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      result.matchType === 'fuzzy'
                        ? 'bg-warn-50 dark:bg-warn-900/30'
                        : 'bg-trust-50 dark:bg-trust-900/30'
                    }`}>
                      {result.matchType === 'fuzzy'
                        ? <Lightbulb className="w-5 h-5 text-warn-500" />
                        : <Building2 className="w-5 h-5 text-trust-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{result.entry.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {result.entry.classification} · {result.entry.region} · {result.entry.layer}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      result.matchType === 'fuzzy'
                        ? 'text-slate-300 group-hover:text-warn-500'
                        : 'text-slate-300 group-hover:text-trust-500'
                    }`} />
                  </button>
                ))}
              </div>

              {nbfcSearch && nbfcResults.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No matching RBI-listed entity found.
                </div>
              )}

              {nbfcSearch && nbfcResults.length > NBFC_PAGE_SIZE && (
                <div className="flex items-center justify-center gap-4 mt-5">
                  <button
                    onClick={() => setNbfcPage((p) => Math.max(0, p - 1))}
                    disabled={nbfcPage === 0}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Page {nbfcPage + 1} of {Math.ceil(nbfcResults.length / NBFC_PAGE_SIZE)}
                  </span>
                  <button
                    onClick={() => setNbfcPage((p) => Math.min(Math.ceil(nbfcResults.length / NBFC_PAGE_SIZE) - 1, p + 1))}
                    disabled={nbfcPage >= Math.ceil(nbfcResults.length / NBFC_PAGE_SIZE) - 1}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {!nbfcSearch && (
                <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  Start typing above to search the full {nbfcCount.toLocaleString()}-entry RBI NBFC registry.
                </div>
              )}
            </div>

            {/* Flagged Apps */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-danger-500" />
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Flagged & Suspicious Apps</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUSPICIOUS_APPS.map((app) => (
                  <button
                    key={app.name}
                    onClick={() => handleSearch(app.name)}
                    className="group flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-danger-200/60 dark:border-danger-800/60 p-4 hover:border-danger-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-danger-50 dark:bg-danger-900/30 flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-5 h-5 text-danger-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{app.name}</p>
                      <p className="text-xs text-danger-500 font-medium">{app.reportCount}+ reports</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-danger-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// === Verdict Card ===
function VerdictCard({ result }: { result: VerificationResult }) {
  const config = getVerdictConfig(result.verdict);
  const VerdictIcon = ICON_MAP[config.icon] || ShieldCheck;

  return (
    <div className={`relative overflow-hidden rounded-3xl border-2 ${config.border} ${config.bg} p-6 sm:p-8 animate-scale-in`}>
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient}`} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Score Ring — or N/A badge for unverified */}
        {result.verdict === 'unverified' ? (
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex flex-col items-center justify-center bg-slate-50">
              <HelpCircle className="w-7 h-7 text-slate-400 mb-0.5" />
              <span className="text-xs text-slate-400 font-medium">N/A</span>
            </div>
          </div>
        ) : (
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200/50" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={config.text}
                strokeDasharray={`${(result.score / 100) * 264} 264`}
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display font-extrabold text-2xl ${config.text}`}>{result.score}</span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
          </div>
        )}

        {/* Verdict */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
              <VerdictIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Risk Verdict</p>
              <h2 className={`font-display font-extrabold text-2xl ${config.text}`}>{config.label}</h2>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>
        </div>
      </div>
    </div>
  );
}

// === Relationship Card ===
function RelationshipCard({ result }: { result: VerificationResult }) {
  if (!result.relationship) return null;

  const icons = [Smartphone, Handshake, Building2, Landmark];
  const labels = ['App', 'LSP', 'Lender', 'RBI Regulated Entity'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-trust-50 flex items-center justify-center">
          <Banknote className="w-4 h-4 text-trust-500" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Entity Relationship Chain</h3>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
        {result.relationship.map((entity, idx) => {
          const Icon = icons[idx] || Building2;
          return (
            <div key={idx} className="flex items-center gap-2 sm:gap-0 sm:flex-1">
              <div className="flex-1 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-trust-50 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-trust-600" />
                </div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{labels[idx]}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{entity}</p>
              </div>
              {idx < result.relationship!.length - 1 && (
                <div className="hidden sm:flex items-center justify-center px-2">
                  <ChevronRight className="w-5 h-5 text-trust-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-safe-50 border border-safe-200">
        <CheckCircle className="w-4 h-4 text-safe-600 flex-shrink-0" />
        <p className="text-xs text-safe-700 font-medium">
          Full chain verified — this app is backed by an RBI-registered regulated entity.
        </p>
      </div>
    </div>
  );
}

// === Evidence Card ===
function EvidenceCard({ result }: { result: VerificationResult }) {
  const passed = result.checks.filter((c) => c.status === 'pass');
  const failed = result.checks.filter((c) => c.status === 'fail');
  const warned = result.checks.filter((c) => c.status === 'warn');
  const unknown = result.checks.filter((c) => c.status === 'unknown');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <FileSearch className="w-4 h-4 text-slate-600" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Evidence & Check Breakdown</h3>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-safe-50 border border-safe-200">
          <CheckCircle className="w-3.5 h-3.5 text-safe-600" />
          <span className="text-xs font-semibold text-safe-700">{passed.length} Passed</span>
        </div>
        {warned.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warn-50 border border-warn-200">
            <AlertTriangle className="w-3.5 h-3.5 text-warn-600" />
            <span className="text-xs font-semibold text-warn-700">{warned.length} Warning</span>
          </div>
        )}
        {failed.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger-50 border border-danger-200">
            <ShieldAlert className="w-3.5 h-3.5 text-danger-600" />
            <span className="text-xs font-semibold text-danger-700">{failed.length} Failed</span>
          </div>
        )}
        {unknown.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">{unknown.length} Unable to Determine</span>
          </div>
        )}
      </div>

      {/* Check items */}
      <div className="space-y-3">
        {result.checks.map((check) => {
          const Icon = ICON_MAP[check.icon] || FileSearch;
          return <CheckItem key={check.id} icon={Icon} title={check.title} status={check.status} detail={check.detail} category={check.category} />;
        })}
      </div>
    </div>
  );
}

function CheckItem({
  icon: Icon,
  title,
  status,
  detail,
  category,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  status: CheckStatus;
  detail: string;
  category: string;
}) {
  const config = {
    pass: { bg: 'bg-safe-50', border: 'border-safe-200', text: 'text-safe-700', iconBg: 'bg-safe-100', iconText: 'text-safe-600', label: 'Passed', LabelIcon: CheckCircle },
    fail: { bg: 'bg-danger-50', border: 'border-danger-200', text: 'text-danger-700', iconBg: 'bg-danger-100', iconText: 'text-danger-600', label: 'Failed', LabelIcon: ShieldAlert },
    warn: { bg: 'bg-warn-50', border: 'border-warn-200', text: 'text-warn-700', iconBg: 'bg-warn-100', iconText: 'text-warn-600', label: 'Warning', LabelIcon: AlertTriangle },
    info: { bg: 'bg-trust-50', border: 'border-trust-200', text: 'text-trust-700', iconBg: 'bg-trust-100', iconText: 'text-trust-600', label: 'Info', LabelIcon: FileSearch },
    unknown: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600', iconBg: 'bg-slate-200', iconText: 'text-slate-500', label: 'Unable to Determine', LabelIcon: HelpCircle },
  }[status];
  const LabelIcon = config.LabelIcon;

  return (
    <div className={`rounded-2xl border ${config.border} ${config.bg} p-4 flex items-start gap-3`}>
      <div className={`w-9 h-9 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${config.iconText}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h4>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">{category}</span>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
              <LabelIcon className="w-3 h-3" />
              <span className="text-xs font-semibold">{config.label}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

// === KFS Card ===
function KfsCard({ result }: { result: VerificationResult }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
            <FileCheck className="w-4 h-4 text-accent-600" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Key Fact Statement (KFS) Analyzer</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white">{result.kfsCompleteness}%</span>
          <span className="text-xs text-slate-400">complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 mb-5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            result.kfsCompleteness >= 80 ? 'bg-gradient-to-r from-safe-400 to-safe-600' : result.kfsCompleteness >= 40 ? 'bg-gradient-to-r from-warn-400 to-warn-600' : 'bg-gradient-to-r from-danger-400 to-danger-600'
          }`}
          style={{ width: `${result.kfsCompleteness}%` }}
        />
      </div>

      <div className="space-y-2.5">
        {result.kfsChecks.map((kfs) => (
          <div key={kfs.label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${kfs.passed ? 'bg-safe-100' : 'bg-danger-100'}`}>
              {kfs.passed ? <CheckCircle className="w-4 h-4 text-safe-600" /> : <AlertTriangle className="w-4 h-4 text-danger-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{kfs.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{kfs.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === Permissions Card ===
function PermissionsCard({ result }: { result: VerificationResult }) {
  const levelConfig: Record<RiskLevel, { label: string; bg: string; text: string; border: string; dot: string }> = {
    high: { label: 'High-Risk', bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200', dot: 'bg-danger-500' },
    medium: { label: 'Conditional', bg: 'bg-warn-50', text: 'text-warn-700', border: 'border-warn-200', dot: 'bg-warn-500' },
    low: { label: 'Low-Risk', bg: 'bg-safe-50', text: 'text-safe-700', border: 'border-safe-200', dot: 'bg-safe-500' },
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-slate-600" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Data Safety & Permission Audit</h3>
      </div>

      <div className="space-y-3">
        {result.permissions.map((perm: PermissionFlag) => {
          const cfg = levelConfig[perm.level];
          return (
            <div key={perm.permission} className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 flex items-start gap-3`}>
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} mt-1.5 flex-shrink-0 ${perm.level === 'high' ? 'animate-pulse' : ''}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{perm.permission}</p>
                  <span className={`text-xs font-bold ${cfg.text} px-2 py-0.5 rounded-full ${cfg.bg} border ${cfg.border} flex-shrink-0`}>
                    {perm.level === 'high' ? '🔴 ' : perm.level === 'medium' ? '🟡 ' : '🟢 '}{cfg.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{perm.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === Recommendations Card ===
function RecommendationsCard({ result }: { result: VerificationResult }) {
  if (result.recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-trust-900 to-trust-950 rounded-3xl border border-trust-800 shadow-xl p-6 sm:p-8 animate-fade-in-up overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-trust-500/10 rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-trust-500/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-accent-400" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Recommendations & Next Steps</h3>
        </div>

        <div className="space-y-3">
          {result.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent-300">{idx + 1}</span>
              </div>
              <p className="text-sm text-trust-50/90 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === NBFC Registry Detail Card ===
function NbfcDetailCard({ entry, onBack, embedded }: { entry: NbfcEntry; onBack?: () => void; embedded?: boolean }) {
  const depositColor = entry.acceptsDeposits.toLowerCase() === 'yes'
    ? { bg: 'bg-warn-50', text: 'text-warn-700', border: 'border-warn-200', dot: 'bg-warn-500' }
    : { bg: 'bg-safe-50', text: 'text-safe-700', border: 'border-safe-200', dot: 'bg-safe-500' };
  const registeredDomain = getRegisteredDomain(entry);

  return (
    <div className={embedded ? "bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6" : "bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-trust-500 to-trust-700 flex items-center justify-center shadow-lg shadow-trust-500/20 flex-shrink-0">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">RBI NBFC Registry</p>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Registry Details</h2>
          </div>
        </div>
        {!embedded && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to search</span>
          </button>
        )}
      </div>

      {/* Registered badge */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-safe-50 border border-safe-200 mb-8">
        <BadgeCheck className="w-5 h-5 text-safe-600 flex-shrink-0" />
        <p className="text-sm text-safe-700 font-semibold">Registered with the RBI</p>
      </div>

      {/* Detail sections */}
      <div className="space-y-6">
        <RegistrySection icon={Building} label="Legal entity name" value={entry.name} />

        <SectionDivider />

        <RegistrySection icon={FileText} label="Corporate Identification Number (CIN)" value={entry.cin} mono />

        <SectionDivider />

        <RegistrySection icon={BadgeCheck} label="Classification / Layer" value={`${entry.classification} · ${entry.layer}`} />

        <SectionDivider />

        <RegistrySection icon={MapPin} label="RBI regional office" value={entry.region} />

        <SectionDivider />

        <RegistrySection
          icon={Building}
          label="Accepts public deposits"
          value={entry.acceptsDeposits}
          badge={depositColor}
        />

        <SectionDivider />

        <RegistrySection icon={Mail} label="Registered email" value={entry.email} />

        {registeredDomain && (
          <>
            <SectionDivider />
            <RegistrySection icon={Globe} label="Registered contact domain" value={registeredDomain} mono />
          </>
        )}

        <SectionDivider />

        <RegistrySection icon={MapPin} label="Registered address" value={entry.address || 'Not available'} />
      </div>

      {/* Disclaimer */}
      <div className="mt-8 flex items-start gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
        <FileSearch className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Data sourced from the official RBI list of NBFCs registered with the Reserve Bank of India (as on June 30, 2026). Always verify independently on the RBI website before making financial decisions.
        </p>
      </div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-2 text-slate-200 dark:text-slate-700">
      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
      <ChevronRight className="w-3.5 h-3.5 rotate-90 text-slate-300 dark:text-slate-700" />
      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

function RegistrySection({
  icon: Icon,
  label,
  value,
  mono,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  badge?: { bg: string; text: string; border: string; dot: string };
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-trust-50 dark:bg-trust-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-trust-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
          {label}
        </p>
        {badge ? (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${badge.bg} ${badge.text} border ${badge.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            <span className="text-xs font-semibold">{value}</span>
          </div>
        ) : (
          <p className={`text-sm font-semibold text-slate-900 dark:text-white break-words leading-relaxed ${mono ? 'font-mono' : ''}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// === Domain Verification Card ===
function DomainVerificationCard({ domainResult }: { domainResult: DomainSearchResult }) {
  const { entry, registeredDomain } = domainResult;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up">
      {/* Green status banner */}
      <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-safe-50 border border-safe-200 mb-6">
        <div className="w-10 h-10 rounded-xl bg-safe-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-safe-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-sm text-safe-800 mb-1">Domain matches registered contact information</h3>
          <p className="text-xs text-safe-700 leading-relaxed">
            The domain you entered matches the domain associated with the registered email address for this RBI-listed entity.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 mb-6">
        <AlertTriangle className="w-4 h-4 text-warn-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          This does not by itself prove that every website, app, offer, or person using this domain is genuine. A matching domain is a useful consistency signal, but it does not guarantee that a specific loan offer, app, caller, or transaction is genuine.
        </p>
      </div>

      {/* Matched entity info */}
      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-trust-50 dark:bg-trust-900/20 border border-trust-100 dark:border-trust-800/40">
        <Building2 className="w-5 h-5 text-trust-500 flex-shrink-0" />
        <p className="text-sm font-semibold text-trust-700 dark:text-trust-300">{entry.name}</p>
      </div>

      {/* Registered contact domain */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-trust-50 dark:bg-trust-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Globe className="w-4 h-4 text-trust-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Registered contact domain
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white break-words font-mono">
            {registeredDomain}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Domain associated with the registered email address
          </p>
        </div>
      </div>

      {/* Full registry details follow below */}
      <NbfcDetailCard entry={entry} embedded />
    </div>
  );
}

// === Domain Not Found Card ===
function DomainNotFoundCard({ domain, onBack }: { domain: string; onBack: () => void }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 sm:p-8 animate-fade-in-up">
      {/* Yellow caution banner */}
      <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-warn-50 border border-warn-200 mb-6">
        <div className="w-10 h-10 rounded-xl bg-warn-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-warn-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-sm text-warn-800 mb-1">Domain not found in our registered contact data</h3>
          <p className="text-xs text-warn-700 leading-relaxed">
            We could not match this domain with a domain associated with the registered email information in our RBI registry dataset. This does not automatically mean the website is fraudulent, but its connection to an RBI-listed lender could not be verified using our available data.
          </p>
        </div>
      </div>

      {/* Searched domain */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Globe className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Domain searched
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white break-words font-mono">
            {domain}
          </p>
        </div>
      </div>

      {/* Suggestion */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-trust-50 dark:bg-trust-900/20 border border-trust-100 dark:border-trust-800/40 mb-6">
        <Lightbulb className="w-4 h-4 text-trust-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-trust-700 dark:text-trust-300 leading-relaxed">
          Search the lender name separately to check whether the company exists in the RBI registry.
        </p>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </button>
    </div>
  );
}
