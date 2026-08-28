import { useState } from 'react';
import type { Screen } from '@/types';
import { OnboardingCarousel } from '@/components/OnboardingCarousel';
import { Dashboard } from '@/components/Dashboard';
import { LenderSearch } from '@/components/LenderSearch';
import { LoanStatus } from '@/components/LoanStatus';
import { Support } from '@/components/Support';

function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');

  const navigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  switch (screen) {
    case 'onboarding':
      return <OnboardingCarousel onComplete={() => navigate('dashboard')} />;
    case 'dashboard':
      return <Dashboard onNavigate={navigate} />;
    case 'lender-search':
      return <LenderSearch onBack={() => navigate('dashboard')} />;
    case 'loan-status':
      return <LoanStatus onBack={() => navigate('dashboard')} />;
    case 'support':
      return <Support onBack={() => navigate('dashboard')} />;
    default:
      return <Dashboard onNavigate={navigate} />;
  }
}

export default App;
