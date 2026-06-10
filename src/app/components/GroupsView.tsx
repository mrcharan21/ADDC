import { ArrowLeft, Users, Search, Shield, Globe, Lock } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, apiUrl } from '../api/config';
import { ScrollToTopButton } from './ScrollToTopButton';

interface Group {
  id: string;
  groupName: string;
  description: string;
  type: 'Security' | 'Distribution';
  scope: 'Global' | 'Universal' | 'Domain Local';
  memberCount: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  privileged: boolean;
  createdDate: string;
  modifiedDate: string;
  managedBy: string;
}

function normalizeGroupType(value: unknown): Group['type'] {
  const normalized = String(value || '').toLowerCase();
  return normalized.includes('distribution') ? 'Distribution' : 'Security';
}

function normalizeGroupScope(value: unknown): Group['scope'] {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('universal')) return 'Universal';
  if (normalized.includes('domain')) return 'Domain Local';
  return 'Global';
}

function normalizeRiskLevel(value: unknown): Group['riskLevel'] {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'high' || normalized === 'critical') return 'High';
  if (normalized === 'medium') return 'Medium';
  return 'Low';
}

function resolveBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    return ['true', 'yes', '1', 'privileged'].includes(value.toLowerCase());
  }
  return false;
}

function extractGroups(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.groups)) return payload.groups;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function mapApiGroup(group: any, index: number): Group {
  const name = group.groupName || group.group_name || group.name || group.cn || `Group ${index + 1}`;

  return {
    id: String(group.id || group.group_id || group.object_guid || group.sid || name),
    groupName: name,
    description: group.description || group.info || 'No description',
    type: normalizeGroupType(group.type || group.group_type || group.category),
    scope: normalizeGroupScope(group.scope || group.group_scope),
    memberCount: Number(group.memberCount ?? group.member_count ?? group.members_count ?? group.members ?? 0),
    riskLevel: normalizeRiskLevel(group.riskLevel || group.risk_level || group.risk?.band || group.risk_band),
    privileged: resolveBoolean(group.privileged ?? group.is_privileged ?? group.privilege ?? group.admin),
    createdDate: group.createdDate || group.created_date || group.when_created || 'Unknown',
    modifiedDate: group.modifiedDate || group.modified_date || group.when_changed || 'Unknown',
    managedBy: group.managedBy || group.managed_by || group.owner || 'Unassigned',
  };
}

interface GroupsViewProps {
  onBack: () => void;
  onGroupClick?: (groupId: string) => void;
}

export function GroupsView({ onBack, onGroupClick }: GroupsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Security' | 'Distribution'>('All');
  const [filterScope, setFilterScope] = useState<'All' | 'Global' | 'Universal' | 'Domain Local'>('All');
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl(API_ENDPOINTS.groups));

      if (!response.ok) {
        throw new Error(`Groups API error: ${response.status}`);
      }

      const payload = await response.json();
      setGroups(extractGroups(payload).map(mapApiGroup));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.managedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.riskLevel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || group.type === filterType;
    const matchesScope = filterScope === 'All' || group.scope === filterScope;
    
    return matchesSearch && matchesType && matchesScope;
  });

  const securityGroups = groups.filter(g => g.type === 'Security').length;
  const distributionGroups = groups.filter(g => g.type === 'Distribution').length;
  const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0);

  const getRiskBadgeColor = (riskLevel: Group['riskLevel']) => {
    switch (riskLevel) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <Users className="text-blue-600" size={32} />
            <div>
              <h1>Groups Management</h1>
              <p className="text-sm text-gray-600">Security and distribution groups overview</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Groups</p>
                <p className="text-2xl font-semibold text-purple-600">{groups.length}</p>
              </div>
              <Users className="text-purple-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Groups</p>
                <p className="text-2xl font-semibold text-blue-600">{securityGroups}</p>
              </div>
              <Shield className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Distribution Groups</p>
                <p className="text-2xl font-semibold text-green-600">{distributionGroups}</p>
              </div>
              <Globe className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-semibold text-orange-600">{totalMembers}</p>
              </div>
              <Users className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Security">Security</option>
              <option value="Distribution">Distribution</option>
            </select>
            
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Scopes</option>
              <option value="Global">Global</option>
              <option value="Universal">Universal</option>
              <option value="Domain Local">Domain Local</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredGroups.length} of {groups.length} groups
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-600">
            Loading groups from CADA API...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6 mb-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={loadGroups}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Groups Table */}
        {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privileged</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Managed By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          group.type === 'Security' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {group.type === 'Security' ? (
                            <Lock className="text-blue-600" size={20} />
                          ) : (
                            <Globe className="text-green-600" size={20} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div 
                            onClick={() => onGroupClick && onGroupClick(group.groupName)}
                            className={`font-medium text-gray-900 ${onGroupClick ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                          >
                            {group.groupName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">{group.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        group.type === 'Security' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {group.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {group.scope}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.memberCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeColor(group.riskLevel)}`}>
                        {group.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        group.privileged
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {group.privileged ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.managedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.modifiedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No groups found matching your search</p>
            </div>
          )}
        </div>
        )}
      </main>
      <ScrollToTopButton />
    </div>
  );
}
