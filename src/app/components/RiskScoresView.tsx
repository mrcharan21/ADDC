import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, Loader2, RefreshCw, Search, Shield } from 'lucide-react';
import { API_ENDPOINTS, apiUrl } from '../api/config';
import { PaginationControls } from './PaginationControls';
import { ScrollToTopButton } from './ScrollToTopButton';

type RiskBand = 'High' | 'Medium' | 'Low';

interface RiskUser {
  id: string;
  username: string;
  displayName: string;
  department: string;
  riskScore: number;
  riskBand: RiskBand;
}

interface RiskScoresViewProps {
  initialBand?: RiskBand;
  onBack: () => void;
  onUserClick?: (username: string) => void;
}

function normalizeRiskBand(value: unknown): RiskBand {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'high' || normalized === 'critical') return 'High';
  if (normalized === 'medium') return 'Medium';
  return 'Low';
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return 0;
}

function extractRiskUsers(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function mapRiskUser(user: any, index: number): RiskUser {
  const nestedRisk = user.risk && typeof user.risk === 'object' ? user.risk : {};
  const username = user.username || user.user_name || user.sam_account_name || user.name || `user-${index + 1}`;

  return {
    id: String(user.id || user.user_id || user.object_guid || user.sid || username),
    username,
    displayName: user.display_name || user.full_name || user.name || username,
    department: user.department || user.ou || 'Unknown',
    riskScore: toNumber(user.risk_score ?? user.riskScore ?? user.score ?? nestedRisk.score),
    riskBand: normalizeRiskBand(user.risk_band ?? user.riskBand ?? user.band ?? nestedRisk.band),
  };
}

function getRiskBadgeColor(riskBand: RiskBand): string {
  if (riskBand === 'High') return 'bg-red-100 text-red-800';
  if (riskBand === 'Medium') return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

export function RiskScoresView({ initialBand, onBack, onUserClick }: RiskScoresViewProps) {
  const [users, setUsers] = useState<RiskUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBand, setFilterBand] = useState<RiskBand | 'All'>(initialBand ?? 'All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const loadRiskUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl(API_ENDPOINTS.risk.users));

      if (!response.ok) {
        throw new Error(`Risk users API error: ${response.status}`);
      }

      const payload = await response.json();
      setUsers(extractRiskUsers(payload).map(mapRiskUser));
    } catch (err) {
      setUsers([]);
      setError(err instanceof Error ? err.message : 'Failed to load risk users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRiskUsers();
  }, [loadRiskUsers]);

  useEffect(() => {
    setFilterBand(initialBand ?? 'All');
  }, [initialBand]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(normalizedSearch) ||
        user.displayName.toLowerCase().includes(normalizedSearch) ||
        user.department.toLowerCase().includes(normalizedSearch);
      const matchesBand = filterBand === 'All' || user.riskBand === filterBand;

      return matchesSearch && matchesBand;
    });
  }, [filterBand, searchTerm, users]);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const pageStartIndex = (currentPage - 1) * usersPerPage;
  const pageEndIndex = pageStartIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(pageStartIndex, pageEndIndex);
  const visibleStart = filteredUsers.length === 0 ? 0 : pageStartIndex + 1;
  const visibleEnd = Math.min(pageEndIndex, filteredUsers.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBand]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
            <Shield className="text-red-600" size={32} />
            <div>
              <h1>Risk Score & Band</h1>
              <p className="text-sm text-gray-600">Detailed user risk scores and risk bands</p>
            </div>
            {loading && <Loader2 className="text-blue-600 animate-spin" size={20} />}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {error && (
            <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
              <button
                aria-label="Retry loading risk users"
                onClick={loadRiskUsers}
                className="flex items-center gap-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterBand}
              onChange={(event) => setFilterBand(event.target.value as RiskBand | 'All')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Risk Bands</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {visibleStart}-{visibleEnd} of {filteredUsers.length} users
          </div>
        </div>

        <div id="risk-scores-table" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-6">
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Band
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-blue-600" size={18} />
                        <span>Loading risk users...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                      No risk users found
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onUserClick?.(user.username)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.displayName}</div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.riskScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeColor(user.riskBand)}`}
                        >
                          {user.riskBand}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollTargetId="risk-scores-table"
        />
      </main>
      <ScrollToTopButton />
    </div>
  );
}
