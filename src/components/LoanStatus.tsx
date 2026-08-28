import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  FileCheck,
  FileX,
  ChevronDown,
  ChevronUp,
  Percent,
  Receipt,
  Eye,
  Headphones,
  TrendingUp,
} from 'lucide-react';
import type { LoanStatusEntry } from '@/types';

interface LoanStatusProps {
  onBack: () => void;
}

const MOCK_LOANS: LoanStatusEntry[] = [
  {
    id: 'LN-2026-0841',
    lenderName: 'Navi Finserv Ltd',
    loanType: 'Personal Loan',
    amount: 150000,
    status: 'approved',
    appliedDate: '2026-08-15',
    deadline: '2026-08-28',
    kfsProvided: true,
    documentsTransparent: true,
    nextStep: 'Review and sign the KFS to receive disbursement within 24 hours.',
  },
  {
    id: 'LN-2026-0732',
    lenderName: 'KreditBee',
    loanType: 'Instant Cash Loan',
    amount: 50000,
    status: 'repayment',
    appliedDate: '2026-07-20',
    deadline: '2026-09-20',
    kfsProvided: true,
    documentsTransparent: true,
    nextStep: 'Next EMI due on September 20, 2026. Pay via the app or your bank portal.',
  },
  {
    id: 'LN-2026-0915',
    lenderName: 'QuickCash Pro',
    loanType: 'Short-Term Advance',
    amount: 20000,
    status: 'pending',
    appliedDate: '2026-08-21',
    deadline: '2026-08-25',
    kfsProvided: false,
    documentsTransparent: false,
    nextStep: 'No KFS has been provided. Request the KFS before proceeding. Do not pay any upfront fees.',
  },
];

export function LoanStatus({ onBack }: LoanStatusProps) {
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_LOANS[0].id);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/60 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <ThemeToggle variant="subtle" />
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20 flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-none truncate">Loan Status & Lifecycle</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track deadlines, KFS & document transparency</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-in-up">
          <SummaryCard icon={TrendingUp} label="Total Loans" value="3" color="trust" />
          <SummaryCard icon={CheckCircle} label="Approved" value="1" color="safe" />
          <SummaryCard icon={Clock} label="Pending" value="1" color="warn" />
          <SummaryCard icon={AlertCircle} label="Needs Action" value="1" color="danger" />
        </div>

        {/* Info Banner */}
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-accent-50 border border-accent-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Eye className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-accent-800 leading-relaxed">
            <span className="font-semibold">Document Transparency Tip:</span> Always ensure your lender provides a Key Fact Statement (KFS) before signing. The KFS must include APR, processing fees, repayment amount, and grievance contacts.
          </p>
        </div>

        {/* Loan Cards */}
        <div className="space-y-4">
          {MOCK_LOANS.map((loan, idx) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              expanded={expandedId === loan.id}
              onToggle={() => toggle(loan.id)}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: 'trust' | 'safe' | 'warn' | 'danger';
}) {
  const colors = {
    trust: { bg: 'bg-trust-50', text: 'text-trust-600', icon: 'text-trust-500' },
    safe: { bg: 'bg-safe-50', text: 'text-safe-600', icon: 'text-safe-500' },
    warn: { bg: 'bg-warn-50', text: 'text-warn-600', icon: 'text-warn-500' },
    danger: { bg: 'bg-danger-50', text: 'text-danger-600', icon: 'text-danger-500' },
  };
  const c = colors[color];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
      <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center mb-2`}>
        <Icon className={`w-4 h-4 ${c.icon}`} />
      </div>
      <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </div>
  );
}

function LoanCard({
  loan,
  expanded,
  onToggle,
  delay,
}: {
  loan: LoanStatusEntry;
  expanded: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const statusConfig = {
    pending: { label: 'Pending Review', bg: 'bg-warn-50', text: 'text-warn-700', border: 'border-warn-200', dot: 'bg-warn-500', Icon: Clock },
    approved: { label: 'Approved', bg: 'bg-safe-50', text: 'text-safe-700', border: 'border-safe-200', dot: 'bg-safe-500', Icon: CheckCircle },
    disbursed: { label: 'Disbursed', bg: 'bg-trust-50', text: 'text-trust-700', border: 'border-trust-200', dot: 'bg-trust-500', Icon: TrendingUp },
    rejected: { label: 'Rejected', bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200', dot: 'bg-danger-500', Icon: XCircle },
    repayment: { label: 'In Repayment', bg: 'bg-trust-50', text: 'text-trust-700', border: 'border-trust-200', dot: 'bg-trust-500', Icon: TrendingUp },
  };
  const cfg = statusConfig[loan.status];
  const StatusIcon = cfg.Icon;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border ${loan.kfsProvided ? 'border-slate-200/80' : 'border-danger-200/60'} shadow-sm overflow-hidden animate-fade-in-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Card Header */}
      <button onClick={onToggle} className="w-full p-5 text-left hover:bg-slate-50 dark:bg-slate-800/60/50 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon className={`w-5 h-5 ${cfg.text}`} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{loan.lenderName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{loan.loanType} &middot; {loan.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {loan.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </p>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>

        {/* Status badge row */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.border} border`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${loan.status === 'pending' ? 'animate-pulse' : ''}`} />
            <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
          </div>
          {!loan.kfsProvided && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger-50 border border-danger-200">
              <AlertCircle className="w-3 h-3 text-danger-600" />
              <span className="text-xs font-semibold text-danger-700">No KFS</span>
            </div>
          )}
          {!loan.documentsTransparent && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger-50 border border-danger-200">
              <FileX className="w-3 h-3 text-danger-600" />
              <span className="text-xs font-semibold text-danger-700">Opaque Docs</span>
            </div>
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4 animate-fade-in">
          {/* Timeline */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Applied Date</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(loan.appliedDate)}</p>
            </div>
            <div className={`rounded-xl p-3 ${loan.deadline ? 'bg-warn-50' : 'bg-slate-50 dark:bg-slate-800/60'}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className={`w-3.5 h-3.5 ${loan.deadline ? 'text-warn-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-medium ${loan.deadline ? 'text-warn-600' : 'text-slate-500 dark:text-slate-400'}`}>Deadline</span>
              </div>
              <p className={`text-sm font-semibold ${loan.deadline ? 'text-warn-800' : 'text-slate-400'}`}>
                {loan.deadline ? formatDate(loan.deadline) : 'N/A'}
              </p>
            </div>
          </div>

          {/* KFS & Transparency */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <TransparencyItem
              icon={loan.kfsProvided ? FileCheck : FileX}
              label="KFS Provided"
              passed={loan.kfsProvided}
              detail={loan.kfsProvided ? 'Key Fact Statement received' : 'No KFS — request before signing'}
            />
            <TransparencyItem
              icon={loan.documentsTransparent ? FileCheck : FileX}
              label="Document Transparency"
              passed={loan.documentsTransparent}
              detail={loan.documentsTransparent ? 'All documents are clear' : 'Documents are unclear or missing'}
            />
          </div>

          {/* KFS Breakdown (if provided) */}
          {loan.kfsProvided && (
            <div className="rounded-2xl bg-accent-50 border border-accent-200 p-4 mb-4">
              <p className="text-xs font-semibold text-accent-700 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                KFS Completeness Breakdown
              </p>
              <div className="space-y-2">
                <KfsRow icon={Percent} label="APR Visibility" passed={true} detail="APR range disclosed" />
                <KfsRow icon={Receipt} label="Processing Fees" passed={true} detail="Fees disclosed upfront" />
                <KfsRow icon={Eye} label="Repayment Amount" passed={true} detail="Total repayment clearly stated" />
                <KfsRow icon={Headphones} label="Grievance Contact" passed={true} detail="Officer & email available" />
              </div>
            </div>
          )}

          {/* Next Step */}
          <div className={`flex items-start gap-3 p-4 rounded-xl ${loan.kfsProvided ? 'bg-trust-50 border border-trust-200' : 'bg-danger-50 border border-danger-200'}`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${loan.kfsProvided ? 'text-trust-600' : 'text-danger-600'}`} />
            <div>
              <p className={`text-xs font-semibold mb-0.5 ${loan.kfsProvided ? 'text-trust-700' : 'text-danger-700'}`}>Next Step</p>
              <p className="text-sm text-slate-700 leading-relaxed">{loan.nextStep}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TransparencyItem({
  icon: Icon,
  label,
  passed,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  passed: boolean;
  detail: string;
}) {
  return (
    <div className={`rounded-xl p-3 border ${passed ? 'bg-safe-50 border-safe-200' : 'bg-danger-50 border-danger-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${passed ? 'text-safe-600' : 'text-danger-600'}`} />
        <span className="text-xs font-semibold text-slate-700">{label}</span>
      </div>
      <p className={`text-xs ${passed ? 'text-safe-700' : 'text-danger-700'}`}>{detail}</p>
    </div>
  );
}

function KfsRow({
  icon: Icon,
  label,
  passed,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  passed: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${passed ? 'bg-safe-200' : 'bg-danger-200'}`}>
        <Icon className={`w-3 h-3 ${passed ? 'text-safe-700' : 'text-danger-700'}`} />
      </div>
      <span className="text-xs font-medium text-slate-700 flex-1">{label}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{detail}</span>
      {passed ? (
        <CheckCircle className="w-4 h-4 text-safe-600" />
      ) : (
        <XCircle className="w-4 h-4 text-danger-600" />
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
