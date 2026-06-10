import { API_ENDPOINTS, apiUrl } from './config';

export interface DashboardStats {
  serviceAccounts: number;
  totalUsers: number;
  totalGroups: number;
  totalCiphers: number;
  gposApplied: number;
  organizationalUnits: number;
  totalDevices: number;
  kerberosTickets: number;
  overviewTickets: number;
}

const DASHBOARD_ENDPOINTS: Record<keyof DashboardStats, string> = {
  serviceAccounts: API_ENDPOINTS.serviceAccounts,
  totalUsers: API_ENDPOINTS.users,
  totalGroups: API_ENDPOINTS.groups,
  totalCiphers: API_ENDPOINTS.ciphers,
  gposApplied: API_ENDPOINTS.gpos,
  organizationalUnits: API_ENDPOINTS.ous,
  totalDevices: API_ENDPOINTS.devices,
  kerberosTickets: API_ENDPOINTS.kerberos,
  overviewTickets: API_ENDPOINTS.analysis.passwordExpiry,
};

function extractCount(payload: unknown, key?: keyof DashboardStats): number {
  if (Array.isArray(payload)) return payload.length;
  if (!payload || typeof payload !== 'object') {
    throw new Error('API response does not contain a count');
  }

  const data = payload as Record<string, unknown>;
  const keySpecificCount =
    key === 'serviceAccounts'
      ? readNumber(data, ['serviceAccounts', 'service_accounts', 'service_account_count', 'enabled_accounts'])
      : key === 'totalUsers'
        ? readNumber(data, ['totalUsers', 'total_users', 'users', 'user_count', 'active_users'])
        : key === 'totalGroups'
          ? readNumber(data, ['totalGroups', 'total_groups', 'groups', 'group_count'])
          : key === 'totalCiphers'
            ? readNumber(data, ['totalCiphers', 'total_ciphers', 'ciphers', 'cipher_count'])
            : key === 'gposApplied'
              ? readNumber(data, ['gposApplied', 'gpos_applied', 'gpos', 'gpo_count'])
              : key === 'organizationalUnits'
                ? readNumber(data, ['organizationalUnits', 'organizational_units', 'ous', 'ou_count'])
                : key === 'totalDevices'
                  ? readNumber(data, ['totalDevices', 'total_devices', 'devices', 'device_count'])
                  : key === 'kerberosTickets'
                    ? readNumber(data, ['kerberosTickets', 'kerberos_tickets', 'tickets', 'ticket_count', 'active_tickets'])
                    : key === 'overviewTickets'
                      ? readNumber(data, ['overviewTickets', 'overview_tickets', 'findings', 'issues', 'flagged_accounts'])
                      : undefined;
  const directCount = data.count ?? data.total ?? data.totalCount ?? data.total_count;

  if (typeof keySpecificCount === 'number') return keySpecificCount;
  if (typeof directCount === 'number') return directCount;
  if (typeof directCount === 'string' && directCount.trim() !== '' && !Number.isNaN(Number(directCount))) {
    return Number(directCount);
  }
  if (Array.isArray(data.items)) return data.items.length;
  if (Array.isArray(data.data)) return data.data.length;
  if (Array.isArray(data.results)) return data.results.length;
  if (Array.isArray(data.users)) return data.users.length;
  if (Array.isArray(data.groups)) return data.groups.length;
  if (Array.isArray(data.devices)) return data.devices.length;
  if (Array.isArray(data.ciphers)) return data.ciphers.length;
  if (Array.isArray(data.gpos)) return data.gpos.length;
  if (Array.isArray(data.ous)) return data.ous.length;
  if (Array.isArray(data.tickets)) return data.tickets.length;
  if (Array.isArray(data.accounts)) return data.accounts.length;
  if (Array.isArray(data.findings)) return data.findings.length;

  if (data.summary && typeof data.summary === 'object') {
    return extractCount(data.summary, key);
  }

  if (data.data && typeof data.data === 'object') {
    return extractCount(data.data, key);
  }

  throw new Error('API response does not contain a count');
}

function readNumber(data: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }

  return undefined;
}

function normalizeDashboardStats(payload: unknown): DashboardStats | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const data = payload as Record<string, unknown>;
  const source =
    data.summary && typeof data.summary === 'object' && !Array.isArray(data.summary)
      ? { ...data, ...(data.summary as Record<string, unknown>) }
      : data;
  const values = {
    serviceAccounts: readNumber(source, ['serviceAccounts', 'service_accounts', 'service_account_count']),
    totalUsers: readNumber(source, ['totalUsers', 'total_users', 'users', 'user_count']),
    totalGroups: readNumber(source, ['totalGroups', 'total_groups', 'groups', 'group_count']),
    totalCiphers: readNumber(source, ['totalCiphers', 'total_ciphers', 'ciphers', 'cipher_count']),
    gposApplied: readNumber(source, ['gposApplied', 'gpos_applied', 'gpos', 'gpo_count']),
    organizationalUnits: readNumber(source, ['organizationalUnits', 'organizational_units', 'ous', 'ou_count']),
    totalDevices: readNumber(source, ['totalDevices', 'total_devices', 'devices', 'device_count']),
    kerberosTickets: readNumber(source, ['kerberosTickets', 'kerberos_tickets', 'kerberos', 'ticket_count']),
    overviewTickets: readNumber(source, ['overviewTickets', 'overview_tickets', 'analysis_tickets', 'findings']),
  };

  if (Object.values(values).every((value) => value === undefined)) return null;

  return {
    serviceAccounts: values.serviceAccounts ?? 0,
    totalUsers: values.totalUsers ?? 0,
    totalGroups: values.totalGroups ?? 0,
    totalCiphers: values.totalCiphers ?? 0,
    gposApplied: values.gposApplied ?? 0,
    organizationalUnits: values.organizationalUnits ?? 0,
    totalDevices: values.totalDevices ?? 0,
    kerberosTickets: values.kerberosTickets ?? 0,
    overviewTickets: values.overviewTickets ?? 0,
  };
}

export async function fetchDashboardStats(
  signal?: AbortSignal,
): Promise<DashboardStats> {
  const dashboardResponse = await fetch(apiUrl(API_ENDPOINTS.dashboard), { signal });

  if (dashboardResponse.ok) {
    const stats = normalizeDashboardStats(await dashboardResponse.json());
    if (stats) return stats;
  }

  const entries = await Promise.all(
    Object.entries(DASHBOARD_ENDPOINTS).map(async ([key, path]) => {
      const response = await fetch(apiUrl(path), { signal });

      if (!response.ok) {
        throw new Error(`${key} API returned ${response.status}`);
      }

      try {
        return [key, extractCount(await response.json(), key as keyof DashboardStats)] as const;
      } catch {
        return [key, 0] as const;
      }
    }),
  );

  return Object.fromEntries(entries) as unknown as DashboardStats;
}
