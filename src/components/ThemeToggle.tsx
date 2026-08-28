import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

interface ThemeToggleProps {
  variant?: 'default' | 'glass' | 'subtle';
  className?: string;
}

export function ThemeToggle({ variant = 'default', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses = 'relative flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 group';

  const variantClasses = {
    default: isDark
      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
    glass: 'glass-card-dark text-white hover:bg-white/10 border border-white/10',
    subtle: isDark
      ? 'text-slate-400 hover:text-trust-300 hover:bg-slate-800/50'
      : 'text-slate-500 hover:text-trust-600 hover:bg-slate-100',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          } text-amber-500`}
        />
        <Moon
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          } text-trust-300`}
        />
      </div>
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
