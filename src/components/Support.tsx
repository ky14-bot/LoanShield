import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ArrowLeft,
  LifeBuoy,
  Flag,
  Send,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  ShieldAlert,
  Clock,
  Headphones,
} from 'lucide-react';

interface SupportProps {
  onBack: () => void;
}

export function Support({ onBack }: SupportProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    appName: '',
    reportType: 'suspicious_behavior',
    description: '',
    contactMethod: 'email',
    contactInfo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const reportTypes = [
    { id: 'suspicious_behavior', label: 'Suspicious App Behavior', icon: ShieldAlert },
    { id: 'upfront_fee', label: 'Upfront Fee Demand', icon: AlertTriangle },
    { id: 'harassment', label: 'Harassment / Blackmail', icon: Flag },
    { id: 'data_misuse', label: 'Data Misuse', icon: ShieldAlert },
    { id: 'other', label: 'Other Concern', icon: MessageSquare },
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warn-500 to-warn-700 flex items-center justify-center shadow-lg shadow-warn-500/20 flex-shrink-0">
              <LifeBuoy className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-none truncate">Support & Red Flag Report</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Report suspicious apps or contact grievance support</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {submitted ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700/80 dark:border-slate-800 shadow-sm p-8 sm:p-12 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-safe-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-safe-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Report Submitted Successfully</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Thank you for helping keep the community safe. Our team will review your report and take appropriate action. You will receive a response within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ appName: '', reportType: 'suspicious_behavior', description: '', contactMethod: 'email', contactInfo: '' });
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-trust-500 to-trust-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-trust-500/30 transition-all"
              >
                Submit Another Report
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Emergency Banner */}
            <div className="mb-6 bg-gradient-to-br from-danger-500 to-danger-600 rounded-3xl p-6 shadow-lg shadow-danger-500/20 animate-fade-in-up overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white mb-1">Facing Immediate Harassment?</h2>
                  <p className="text-sm text-danger-50/90 leading-relaxed">
                    If you are being threatened or harassed by a lending app, call the National Cyber Crime Helpline at <span className="font-bold text-white">1930</span> or visit cybercrime.gov.in immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <ContactCard icon={Phone} title="Call Us" detail="1800-120-4567" subtitle="Mon–Sat, 9am–6pm" color="trust" delay={0.1} />
              <ContactCard icon={Mail} title="Email Us" detail="grievance@loanshield.in" subtitle="Response in 48 hours" color="accent" delay={0.15} />
              <ContactCard icon={MessageSquare} title="Live Chat" detail="Chat with an agent" subtitle="Available 24x7" color="warn" delay={0.2} />
            </div>

            {/* Report Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-warn-50 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-warn-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Report a Suspicious App or Lender</h3>
              </div>

              {/* App Name */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  App or Lender Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.appName}
                  onChange={(e) => setForm({ ...form, appName: e.target.value })}
                  placeholder="e.g. QuickCash Pro, EasyLoan 24x7"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-warn-500 focus:bg-white transition-all"
                />
              </div>

              {/* Report Type */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Type of Concern <span className="text-danger-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    const selected = form.reportType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setForm({ ...form, reportType: type.id })}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                          selected ? 'border-warn-500 bg-warn-50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? 'bg-warn-100' : 'bg-slate-100'}`}>
                          <Icon className={`w-4 h-4 ${selected ? 'text-warn-600' : 'text-slate-500 dark:text-slate-400'}`} />
                        </div>
                        <span className={`text-sm font-medium ${selected ? 'text-warn-700' : 'text-slate-600'}`}>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Describe What Happened <span className="text-danger-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Please describe the suspicious behavior, including dates, amounts, and any communication you received..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-warn-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Contact Method */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">How Should We Reach You?</label>
                <div className="flex gap-2 mb-3">
                  {[
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'phone', label: 'Phone', icon: Phone },
                  ].map((method) => {
                    const Icon = method.icon;
                    const selected = form.contactMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setForm({ ...form, contactMethod: method.id })}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                          selected ? 'border-trust-500 bg-trust-50 text-trust-700' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {method.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={form.contactInfo}
                  onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                  placeholder={form.contactMethod === 'email' ? 'your@email.com' : '+91 XXXXX XXXXX'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-trust-500 focus:bg-white transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-warn-500 to-warn-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-warn-500/30 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </button>

              <p className="mt-4 text-xs text-slate-400 text-center">
                Your report is confidential and will be reviewed by our grievance team within 48 hours.
              </p>
            </form>

            {/* Support Hours */}
            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-slate-100 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Grievance Redressal Timeline:</span> First response within 48 hours. Escalation to Nodal Officer available if not resolved within 30 days.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  detail,
  subtitle,
  color,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  subtitle: string;
  color: 'trust' | 'accent' | 'warn';
  delay: number;
}) {
  const colors = {
    trust: { bg: 'bg-trust-50', icon: 'text-trust-600', iconBg: 'bg-trust-100' },
    accent: { bg: 'bg-accent-50', icon: 'text-accent-600', iconBg: 'bg-accent-100' },
    warn: { bg: 'bg-warn-50', icon: 'text-warn-600', iconBg: 'bg-warn-100' },
  };
  const c = colors[color];

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <p className="font-semibold text-sm text-slate-900 dark:text-white">{title}</p>
      <p className={`text-sm font-medium ${c.icon} mt-0.5`}>{detail}</p>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}
