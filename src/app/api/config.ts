export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const API_ENDPOINTS = {
  dashboard: '/dashboard',
  users: '/users',
  user: (username: string) => `/users/${encodeURIComponent(username)}`,
  serviceAccounts: '/service-accounts',
  groups: '/groups',
  group: (groupName: string) => `/groups/${encodeURIComponent(groupName)}`,
  kerberos: '/kerberos',
  devices: '/devices',
  ciphers: '/ciphers',
  gpos: '/gpos',
  ous: '/ous',
  analysis: {
    passwordExpiry: '/analysis/password-expiry',
    adminAccounts: '/analysis/admin-accounts',
    accountFlags: '/analysis/account-flags',
    cipherBreakdown: '/analysis/cipher-breakdown',
    privilegeBreakdown: '/analysis/privilege-breakdown',
    passwordHealth: '/analysis/password-health',
  },
  risk: {
    org: '/risk/org',
    summary: '/risk/summary',
    distribution: '/risk/distribution',
    departments: '/risk/departments',
    factorSummary: '/risk/factors/summary',
    scoreHistogram: '/risk/score-histogram',
    users: '/risk/users',
    user: (username: string) => `/risk/users/${encodeURIComponent(username)}`,
    refresh: '/risk/refresh',
  },
} as const;

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export function formatApiLabel(value: string): string {
  return value
    .replace(/pct/gi, 'percentage')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
