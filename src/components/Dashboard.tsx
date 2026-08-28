import { ShieldCheck, Search, FileText, LifeBuoy, ArrowRight, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Screen } from '@/types';
import { VerifiedSourcesGrid } from '@/components/VerifiedSourcesGrid';
import { LoanShieldFAQ } from '@/components/LoanShieldFAQ';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getNbfcCount } from '@/lib/verifyEngine';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const nbfcCount = getNbfcCount();
  const nbfcDisplay = nbfcCount >= 1000 ? `${(nbfcCount / 1000).toFixed(1)}k+` : `${nbfcCount}+`;
  const options = [
    {
      id: 'lender-search' as Screen,
      title: 'Lender & App Search',
      description: 'Type an app name, lender/NBFC, website URL, or contact number to verify legitimacy against the official RBI Digital Lending Apps directory.',
      icon: Search,
      gradient: 'from-trust-500 to-trust-700',
      iconBg: 'bg-trust-500',
      features: ['RBI Directory Cross-Check', 'Domain & Security Analysis', 'Risk Verdict + Evidence'],
      stats: `${nbfcDisplay} verified lenders`,
    },
    {
      id: 'loan-status' as Screen,
      title: 'Loan Status & Lifecycle',
      description: 'Track your loan status, check deadlines, evaluate Key Fact Statements (KFS), and review document transparency.',
      icon: FileText,
      gradient: 'from-accent-500 to-accent-700',
      iconBg: 'bg-accent-500',
      features: ['Status Tracking', 'Deadline Alerts', 'KFS Completeness Review'],
      stats: 'Lifecycle monitoring',
    },
    {
      id: 'support' as Screen,
      title: 'Support & Red Flag Report',
      description: 'Report suspicious behavior, flag fraudulent apps, or contact grievance support for help with lending disputes.',
      icon: LifeBuoy,
      gradient: 'from-warn-500 to-warn-700',
      iconBg: 'bg-warn-500',
      features: ['Report Suspicious Apps', 'Grievance Support', 'Fraud Documentation'],
      stats: '24x7 support',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-500 to-trust-700 flex items-center justify-center shadow-lg shadow-trust-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-none">LoanShield</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Scan, verify & borrow safely</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="subtle" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-safe-50 dark:bg-safe-900/30 border border-safe-200 dark:border-safe-800">
            <div className="w-2 h-2 rounded-full bg-safe-500 animate-pulse" />
              <span className="text-xs font-semibold text-safe-700 dark:text-safe-300">RBI Aligned</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden mesh-gradient">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-trust-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark mb-5 animate-fade-in-down">
              <Sparkles className="w-4 h-4 text-accent-300" />
              <span className="text-sm text-trust-50/90 font-medium">Multi-signal risk analysis engine</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight animate-fade-in-up">
              Your shield against{' '}
              <span className="bg-gradient-to-r from-danger-300 to-warn-300 bg-clip-text text-transparent">digital loan scams</span>
            </h2>
            <p className="mt-4 text-lg text-trust-100/80 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Verify any lending app or NBFC against the official RBI directory. Get instant risk verdicts with transparent evidence — before you share a single detail.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card-dark rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-safe-400" />
                <span className="text-xs text-trust-100/70 font-medium">Verified</span>
              </div>
              <p className="text-2xl font-display font-bold text-white">{nbfcDisplay}</p>
            </div>
            <div className="glass-card-dark rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-danger-400" />
                <span className="text-xs text-trust-100/70 font-medium">Flagged</span>
              </div>
              <p className="text-2xl font-display font-bold text-white">412</p>
            </div>
            <div className="glass-card-dark rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-accent-400" />
                <span className="text-xs text-trust-100/70 font-medium">Checks</span>
              </div>
              <p className="text-2xl font-display font-bold text-white">10+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Sources Grid */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <VerifiedSourcesGrid />
        </div>
      </section>

      {/* Action Hub */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">What would you like to do?</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Choose an option below to get started.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {options.map((option, idx) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => onNavigate(option.id)}
                className="group relative text-left bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-slate-300/40 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h4 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">{option.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{option.description}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">{option.stats}</span>
                  <div className={`flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all`}>
                    Open
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-trust-500 transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <LoanShieldFAQ />
      </section>

      {/* Trust Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-trust-500 to-trust-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-slate-900 dark:text-white">LoanShield</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Aligned with RBI digital lending guidelines</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              &copy; 2026 LoanShield. For educational and safety purposes. Always verify independently.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
