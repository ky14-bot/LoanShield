import { NBFC_DIRECTORY } from '@/data/nbfcDirectory';
import type { NbfcEntry } from '@/types';

const PUBLIC_EMAIL_PROVIDERS = new Set([
  'gmail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'rediffmail.com',
  'icloud.com',
  'protonmail.com',
]);

const TLD_PATTERN = /\.(com|in|org|net|co\.in|io|ai|co|biz|info|me|us|uk|au|ca|de|fr|eu|gov|edu|mil|int|asia|africa|online|site|store|tech|app|dev|xyz|bank|finance|financial|loan|loans|credit|money|pay|fintech|digital|india)$/i;

export function extractEmailDomain(email: string | null | undefined): string | null {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) return null;
  const parts = trimmed.split('@');
  if (parts.length !== 2) return null;
  const domain = parts[1].trim();
  if (!domain || !domain.includes('.')) return null;
  if (PUBLIC_EMAIL_PROVIDERS.has(domain)) return null;
  return domain;
}

export function isUrlOrDomain(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^www\./i.test(trimmed)) return true;
  if (TLD_PATTERN.test(trimmed) && /\.[a-z]{2,}/i.test(trimmed)) return true;
  return false;
}

export function normalizeDomain(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.split('/')[0] || '';
  domain = domain.split('?')[0] || '';
  domain = domain.split('#')[0] || '';
  domain = domain.replace(/\/$/, '');
  domain = domain.replace(/:\d+$/, '');
  if (!domain || !domain.includes('.')) return null;
  return domain;
}

export interface DomainSearchResult {
  entry: NbfcEntry;
  registeredDomain: string;
  matchedDomain: string;
}

export function searchByDomain(input: string): DomainSearchResult | null {
  const normalized = normalizeDomain(input);
  if (!normalized) return null;

  for (const entry of NBFC_DIRECTORY) {
    const registeredDomain = extractEmailDomain(entry.email);
    if (!registeredDomain) continue;
    if (registeredDomain === normalized) {
      return { entry, registeredDomain, matchedDomain: normalized };
    }
  }
  return null;
}

export function getRegisteredDomain(entry: NbfcEntry): string | null {
  return extractEmailDomain(entry.email);
}
