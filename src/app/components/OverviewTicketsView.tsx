import { ArrowLeft, AlertTriangle, Lock, Shield, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, apiUrl } from '../api/config';

interface AnalysisItem {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  count: number;
}

interface OverviewTicketsViewProps {
  onBack: () => void;
  onPasswordExpiryClick: () => void;
  onAdminAccountsClick: () => void;
}

const ANALYSIS_ENDPOINTS = [
  {
    id: 'password-expiry',
    title: 'Password Expiry',
    path: API_ENDPOINTS.analysis.passwordExpiry,
    fallback: 'Accounts with password expiry findings that need review.',
  },
  {
    id: 'admin-accounts',
    title: 'Admin Accounts',
    path: API_ENDPOINTS.analysis.adminAccounts,
    fallback: 'Administrative accounts with findings that need review.',
  },
  {
    id: 'account-flags',
    title: 'Account Flags',
    path: API_ENDPOINTS.analysis.accountFlags,
    fallback: 'Account flags that need security review.',
  },
  {
    id: 'cipher-breakdown',
    title: 'Cipher Breakdown',
    path: API_ENDPOINTS.analysis.cipherBreakdown,
    fallback: 'Cipher and encryption findings that need review.',
  },
  {
    id: 'privilege-breakdown',
    title: 'Privilege Breakdown',
    path: API_ENDPOINTS.analysis.privilegeBreakdown,
    fallback: 'Privilege distribution findings that need review.',
  },
  {
    id: 'password-health',
    title: 'Password Health',
    path: API_ENDPOINTS.analysis.passwordHealth,
    fallback: 'Password health findings that need review.',
  },
] as const;

function getCount(payload: any): number {
  if (typeof payload?.count === 'number') return payload.count;
  if (typeof payload?.total === 'number') return payload.total;
  if (typeof payload?.summary?.count === 'number') return payload.summary.count;
  if (typeof payload?.summary?.total === 'number') return payload.summary.total;
  if (Array.isArray(payload?.items)) return payload.items.length;
  if (Array.isArray(payload?.users)) return payload.users.length;
  if (Array.isArray(payload?.data)) return payload.data.length;
  if (Array.isArray(payload)) return payload.length;
  return 0;
}

function getDescription(payload: any, fallback: string): string {
  return payload?.description || payload?.message || payload?.summary?.description || fallback;
}

function normalizeSeverity(value: unknown, count: number): AnalysisItem['severity'] {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'high' || normalized === 'critical') return 'High';
  if (normalized === 'medium') return 'Medium';
  return count > 0 ? 'Medium' : 'Low';
}

function buildAnalysisItem(
  id: string,
  title: string,
  payload: any,
  fallbackDescription: string,
): AnalysisItem {
  const count = getCount(payload);

  return {
    id,
    title,
    description: getDescription(payload, fallbackDescription),
    severity: normalizeSeverity(payload?.severity || payload?.risk_level || payload?.risk?.band, count),
    count,
  };
}

export function OverviewTicketsView({
  onBack,
  onPasswordExpiryClick,
  onAdminAccountsClick,
}: OverviewTicketsViewProps) {
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const responses = await Promise.all(
        ANALYSIS_ENDPOINTS.map(async (endpoint) => {
          const response = await fetch(apiUrl(endpoint.path));

          if (!response.ok) {
            throw new Error(`${endpoint.title} analysis API error: ${response.status}`);
          }

          return {
            endpoint,
            payload: await response.json(),
          };
        }),
      );

      setItems(
        responses.map(({ endpoint, payload }) =>
          buildAnalysisItem(endpoint.id, endpoint.title, payload, endpoint.fallback),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  const getSeverityColor = (severity: AnalysisItem['severity']) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleItemClick = (id: string) => {
    if (id === 'password-expiry') {
      onPasswordExpiryClick();
    } else if (id === 'admin-accounts') {
      onAdminAccountsClick();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <Lock className="text-red-600" size={32} />
            <div>
              <h1>Overview Tickets</h1>
              <p className="text-sm text-gray-600">Analysis findings from password, account, cipher, and privilege checks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-600">
            Loading analysis tickets...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={loadAnalysis}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <RefreshCw size={16} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.id === 'password-expiry' ? (
                      <AlertTriangle className="text-orange-600" size={28} />
                    ) : (
                      <Shield className="text-purple-600" size={28} />
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-3xl font-semibold text-gray-900">{item.count}</p>
                  <p className="text-xs text-gray-500 mt-1">Analysis findings</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
