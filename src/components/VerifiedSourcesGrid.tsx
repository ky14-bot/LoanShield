import { Building2 } from 'lucide-react';
import { InfiniteSlider } from '@/components/core/infinite-slider';

const BANKS = [
  { id: 1, name: 'State Bank of India', logo: '/sbi_logo.svg' },
  { id: 2, name: 'HDFC Bank', logo: '/hdfc_logo.svg' },
  { id: 3, name: 'ICICI Bank', logo: '/icici_logo.svg' },
  { id: 4, name: 'YES Bank', logo: '/yes_bank_logo.svg' },
  { id: 5, name: 'Axis Bank', logo: '/axis_bank_logo.svg' },
  { id: 6, name: 'Bank of Baroda', logo: '/bob_logo.svg' },
];

export function VerifiedSourcesGrid() {
  return (
    <div className="w-full py-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <h3 className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5">
        Cross-Referencing Data Across RBI Regulated Entities &amp; Official Directories
      </h3>
      <InfiniteSlider gap={32} duration={30} className="py-2">
        {BANKS.map((bank) => (
          <div
            key={bank.id}
            className="flex items-center justify-center px-6 py-3 border border-slate-200/80 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-trust-200 transition-all flex-shrink-0"
          >
            <img src={bank.logo} alt={bank.name} className="h-8 w-auto" loading="lazy" />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
