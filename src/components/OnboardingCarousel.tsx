import { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ShieldCheck,
  Search,
  FileText,
  BadgeCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Eye,
  Lock,
  CheckCircle,
  AlertTriangle,
  Handshake,
  Building2,
  Landmark,
} from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 1,
    title: 'LoanShield',
    tagline: 'Scan, verify, and borrow safely.',
    description: 'Your trusted companion for identifying legitimate digital lending apps and protecting yourself from loan scams.',
    icon: ShieldCheck,
    accent: 'from-trust-500 to-trust-700',
    glow: 'bg-trust-500/20',
    visual: 'brand',
  },
  {
    id: 2,
    title: 'Spot Scams in Seconds',
    tagline: 'Instant multi-signal verification',
    description: 'Our engine cross-references app names, domains, and lenders against the official RBI Digital Lending Apps (DLA) directory — giving you an instant risk verdict.',
    icon: Search,
    accent: 'from-trust-500 to-accent-500',
    glow: 'bg-accent-500/20',
    visual: 'scan',
  },
  {
    id: 3,
    title: 'Uncover Hidden Terms',
    tagline: 'KFS & compliance auditing',
    description: 'Audit Key Fact Statements for APR transparency, hidden processing fees, aggressive app permissions, and missing grievance contacts before you borrow.',
    icon: FileText,
    accent: 'from-accent-500 to-accent-700',
    glow: 'bg-accent-500/20',
    visual: 'kfs',
  },
  {
    id: 4,
    title: 'Borrow with Confidence',
    tagline: 'Trusted, official, and legally aligned with RBI guidelines and regulatory safety standards.',
    description: 'Every check is grounded in official regulatory data. Make informed borrowing decisions backed by real compliance markers.',
    icon: BadgeCheck,
    accent: 'from-safe-500 to-safe-700',
    glow: 'bg-safe-500/20',
    visual: 'trust',
  },
];

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goNext = useCallback(() => {
    setDirection('next');
    setCurrent((prev) => Math.min(prev + 1, SLIDES.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setDirection('prev');
    setCurrent((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 'next' : 'prev');
    setCurrent(index);
  };

  useEffect(() => {
    if (current < SLIDES.length - 1) {
      const timer = setTimeout(goNext, 5000);
      return () => clearTimeout(timer);
    }
  }, [current, goNext]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Enter' && current === SLIDES.length - 1) onComplete();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, goNext, goPrev, onComplete]);

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  return (
    <div className="relative min-h-screen mesh-gradient overflow-hidden flex flex-col">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-trust-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Skip button */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <ThemeToggle variant="glass" />
        <button
          onClick={onComplete}
          className="text-sm text-trust-100/60 hover:text-white font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full">
          {/* Visual */}
          <div className="flex justify-center mb-8 animate-scale-in" key={`visual-${current}`}>
            <SlideVisual slide={slide} />
          </div>

          {/* Text content */}
          <div
            key={`content-${current}`}
            className="text-center"
            style={{
              animation: `${direction === 'next' ? 'fadeInUp' : 'fadeInDown'} 0.5s ease-out forwards`,
            }}
          >
            {slide.id === 1 ? (
              <>
                <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
                  Loan<span className="bg-gradient-to-r from-trust-300 to-accent-300 bg-clip-text text-transparent">Shield</span>
                </h1>
                <p className="mt-4 text-xl text-trust-100/90 font-medium">{slide.tagline}</p>
              </>
            ) : (
              <>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-dark mb-4`}>
                  <slide.icon className="w-4 h-4 text-accent-300" />
                  <span className="text-sm text-trust-50/80 font-medium">{slide.tagline}</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{slide.title}</h2>
              </>
            )}
            <p className="mt-4 text-base sm:text-lg text-trust-100/70 leading-relaxed max-w-md mx-auto">{slide.description}</p>
          </div>

          {/* CTA on last slide */}
          {isLast && (
            <div className="mt-8 flex flex-col items-center animate-fade-in-up">
              <button
                onClick={onComplete}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-trust-500 to-accent-500 text-white font-semibold text-lg shadow-xl shadow-trust-500/30 hover:shadow-2xl hover:shadow-trust-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-4 flex items-center gap-2 text-trust-100/50">
                <BadgeCheck className="w-4 h-4 text-safe-400" />
                <span className="text-xs font-medium">RBI Aligned &mdash; Regulatory Safety Standards</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 pb-8 px-6">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Prev button */}
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="w-11 h-11 rounded-full glass-card-dark flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => goTo(idx)}
                className="group relative"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === current
                      ? 'w-8 bg-gradient-to-r from-trust-400 to-accent-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Next button or spacer */}
          {isLast ? (
            <div className="w-11" />
          ) : (
            <button
              onClick={goNext}
              className="w-11 h-11 rounded-full glass-card-dark flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress text */}
        <div className="mt-4 text-center">
          <span className="text-xs text-trust-100/40 font-medium">
            {current + 1} / {SLIDES.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function SlideVisual({ slide }: { slide: typeof SLIDES[number] }) {
  const Icon = slide.icon;

  switch (slide.visual) {
    case 'brand':
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-trust-400/30 blur-2xl rounded-full animate-shield-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-trust-500 to-trust-700 flex items-center justify-center shadow-2xl shadow-trust-500/30">
            <ShieldCheck className="w-16 h-16 text-white" strokeWidth={2} />
          </div>
        </div>
      );

    case 'scan':
      return (
        <div className="relative w-48 h-48">
          {/* Scanning rings */}
          <div className="absolute inset-0 rounded-full border-2 border-trust-400/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 rounded-full border-2 border-accent-400/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-trust-500 to-accent-500 flex items-center justify-center shadow-xl">
              <Search className="w-10 h-10 text-white" />
            </div>
          </div>
          {/* Floating checkmarks */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-safe-500/90 flex items-center justify-center animate-float">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="absolute bottom-4 left-0 w-7 h-7 rounded-full bg-danger-500/90 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="absolute bottom-0 right-4 w-7 h-7 rounded-full bg-warn-500/90 flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
        </div>
      );

    case 'kfs':
      return (
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Document stack */}
          <div className="relative">
            <div className="absolute -bottom-2 -right-2 w-28 h-36 rounded-2xl bg-accent-700/40 border border-accent-600/30" />
            <div className="absolute -bottom-1 -right-1 w-28 h-36 rounded-2xl bg-accent-600/50 border border-accent-500/40" />
            <div className="relative w-28 h-36 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-xl p-4 flex flex-col gap-2">
              <div className="h-2 w-3/4 rounded-full bg-white/40" />
              <div className="h-2 w-full rounded-full bg-white/30" />
              <div className="h-2 w-5/6 rounded-full bg-white/30" />
              <div className="mt-auto flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-safe-400/80 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <div className="h-2 w-12 rounded-full bg-white/40" />
              </div>
            </div>
            {/* Floating eye icon */}
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-float">
              <Eye className="w-5 h-5 text-accent-300" />
            </div>
          </div>
        </div>
      );

    case 'trust':
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-safe-400/30 blur-2xl rounded-full animate-shield-pulse" />
          {/* Handshake + shield */}
          <div className="relative w-40 h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-full h-full">
              <g className="animate-handshake" style={{ transformOrigin: '60px 60px' }}>
                <rect x="10" y="45" width="70" height="30" rx="15" fill="url(#leftGrad2)" />
                <circle cx="75" cy="60" r="16" fill="url(#handGrad3)" />
              </g>
              <g className="animate-handshake" style={{ transformOrigin: '140px 60px', animationDelay: '0.1s' }}>
                <rect x="120" y="45" width="70" height="30" rx="15" fill="url(#rightGrad2)" />
                <circle cx="125" cy="60" r="16" fill="url(#handGrad4)" />
              </g>
              <circle cx="100" cy="60" r="14" fill="#10b981" opacity="0.5" className="animate-pulse" />
              <circle cx="100" cy="25" r="3" fill="#fbbf24" className="animate-pulse" />
              <circle cx="80" cy="20" r="2" fill="#6ee7b7" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="120" cy="20" r="2" fill="#a7f3d0" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <defs>
                <linearGradient id="leftGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="rightGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <radialGradient id="handGrad3">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </radialGradient>
                <radialGradient id="handGrad4">
                  <stop offset="0%" stopColor="#d1fae5" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Badge below */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-safe-500 to-safe-700 flex items-center justify-center shadow-lg border-2 border-white/20">
            <BadgeCheck className="w-7 h-7 text-white" />
          </div>
        </div>
      );

    default:
      return (
        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${slide.accent} flex items-center justify-center shadow-2xl`}>
          <Icon className="w-14 h-14 text-white" />
        </div>
      );
  }
}
