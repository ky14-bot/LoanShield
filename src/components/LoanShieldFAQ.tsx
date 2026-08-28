import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const FAQS = [
  {
    id: 'is-loanshield-safe',
    question: 'Is LoanShield safe to use?',
    answer:
      'Yes, completely. LoanShield is an informational verification platform that checks publicly available financial databases, official RBI Digital Lending App directories, and security certificates. We do not store your private banking passwords, credit card numbers, or demand access to personal contacts.',
  },
  {
    id: 'how-verification-works',
    question: 'How does LoanShield verify lending apps and NBFCs?',
    answer:
      'Our multi-signal verification engine cross-references the app name, domain, and publisher against official RBI-registered NBFCs and bank listings. It checks domain registration age, security protocols (HTTPS), data permission policies, and whether the app provides a valid Key Fact Statement (KFS) as mandated by regulatory standards.',
  },
  {
    id: 'upfront-fees',
    question: 'What should I do if a loan app asks for an upfront fee?',
    answer:
      "Never pay advance charges. Legitimate lenders under RBI guidelines deduct any processing fees directly from the approved loan amount upon disbursal. Requesting upfront deposits, processing fees, or 'security clearance' fees before disbursal is a guaranteed marker of fraudulent activity.",
  },
  {
    id: 'report-scam',
    question: 'How can I report an illegal or abusive lending app?',
    answer:
      "You can use our 'Red Flag Report' option directly within the dashboard. Additionally, illegal harassment or unapproved apps should be reported immediately on the official RBI Sachet Portal (sachet.rbi.org.in) and to your local cyber crime authority.",
  },
];

export function LoanShieldFAQ() {
  const [openId, setOpenId] = useState<string | null>('is-loanshield-safe');

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 bg-white dark:bg-slate-900 transition-colors duration-300">
      <h2 className="text-2xl font-display font-bold text-center text-slate-900 dark:text-white mb-6">
        Frequently Asked Questions
      </h2>
      <div className="flex w-full flex-col">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="py-2 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => toggle(faq.id)}
                className="w-full py-2 text-left text-slate-900 dark:text-white font-medium group"
              >
                <div className="flex items-center">
                  <ChevronRight
                    className={`h-4 w-4 text-slate-900 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                  <div className="ml-2 text-slate-900 dark:text-white">{faq.question}</div>
                </div>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-out"
                style={{
                  maxHeight: isOpen ? '300px' : '0px',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <p className="pl-6 pr-2 py-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
