import { ArrowLeft, Users, Mail, Calendar, Shield, UserCheck, Building, Lock, Globe } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, apiUrl } from '../api/config';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  accountStatus: 'Active' | 'Disabled';
  lastLogin: string;
  joinedDate: string;
}

interface GroupInfo {
  id: string;
  groupName: string;
  description: string;
  type: 'Security' | 'Distribution';
  scope: 'Global' | 'Universal' | 'Domain Local';
  memberCount: number;
  createdDate: string;
  modifiedDate: string;
  managedBy: string;
}

interface GroupDetailApiResponse {
  groupInfo: GroupInfo;
  members: User[];
}

interface GroupDetailViewProps {
  groupId: string;
  onBack: () => void;
}

function normalizeGroupType(value: unknown): GroupInfo['type'] {
  const normalized = String(value || '').toLowerCase();
  return normalized.includes('distribution') ? 'Distribution' : 'Security';
}

function normalizeGroupScope(value: unknown): GroupInfo['scope'] {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('universal')) return 'Universal';
  if (normalized.includes('domain')) return 'Domain Local';
  return 'Global';
}

function normalizeAccountStatus(value: unknown): User['accountStatus'] {
  const normalized = String(value || '').toLowerCase();
  return normalized === 'disabled' || normalized === 'inactive' ? 'Disabled' : 'Active';
}

function getGroupPayload(payload: any): any {
  return payload?.group || payload?.data?.group || payload?.data || payload;
}

function extractMembers(payload: any, groupPayload: any): any[] {
  if (Array.isArray(payload?.members)) return payload.members;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data?.members)) return payload.data.members;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  if (Array.isArray(groupPayload?.members)) return groupPayload.members;
  if (Array.isArray(groupPayload?.users)) return groupPayload.users;
  return [];
}

function mapApiUser(user: any, index: number): User {
  const name = user.name || user.display_name || user.full_name || user.username || user.sam_account_name || `Member ${index + 1}`;

  return {
    id: String(user.id || user.user_id || user.sid || user.username || user.sam_account_name || name),
    name,
    email: user.email || user.mail || user.user_principal_name || 'Not configured',
    department: user.department || 'Unknown',
    title: user.title || user.job_title || 'Not configured',
    accountStatus: normalizeAccountStatus(user.accountStatus || user.account_status || user.status || user.enabled),
    lastLogin: user.lastLogin || user.last_login || user.last_logon || 'Unknown',
    joinedDate: user.joinedDate || user.joined_date || user.added_date || user.member_since || 'Unknown',
  };
}

function mapApiGroup(payload: any, groupName: string): GroupDetailApiResponse {
  const group = getGroupPayload(payload);
  const members = extractMembers(payload, group).map(mapApiUser);
  const name = group.groupName || group.group_name || group.name || group.cn || groupName;

  return {
    groupInfo: {
      id: String(group.id || group.group_id || group.object_guid || group.sid || name),
      groupName: name,
      description: group.description || group.info || 'No description',
      type: normalizeGroupType(group.type || group.group_type || group.category),
      scope: normalizeGroupScope(group.scope || group.group_scope),
      memberCount: Number(group.memberCount ?? group.member_count ?? group.members_count ?? members.length),
      createdDate: group.createdDate || group.created_date || group.when_created || 'Unknown',
      modifiedDate: group.modifiedDate || group.modified_date || group.when_changed || 'Unknown',
      managedBy: group.managedBy || group.managed_by || group.owner || 'Unassigned',
    },
    members,
  };
}

export function GroupDetailView({ groupId, onBack }: GroupDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroupDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl(API_ENDPOINTS.group(groupId)));

      if (!response.ok) {
        throw new Error(`Group detail API error: ${response.status}`);
      }

      const payload = await response.json();
      const mapped = mapApiGroup(payload, groupId);
      setGroupInfo(mapped.groupInfo);
      setAllUsers(mapped.members);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group details');
      setGroupInfo(null);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadGroupDetail();
  }, [loadGroupDetail]);

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = filteredUsers.filter(u => u.accountStatus === 'Active').length;
  const disabledUsers = filteredUsers.filter(u => u.accountStatus === 'Disabled').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Groups</span>
          </button>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-600">
            Loading group details from CADA API...
          </div>
        </div>
      </div>
    );
  }

  if (error || !groupInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-xl text-gray-900">Failed to load group</h2>
          <p className="text-sm text-gray-600 mt-2">{error ?? `No details found for ${groupId}`}</p>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={loadGroupDetail} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Retry
            </button>
            <button onClick={onBack} className="px-4 py-2 text-blue-600 hover:text-blue-700">
              Back to Groups
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Groups</span>
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Groups</span>
            <span>/</span>
            <span className="text-gray-900">{groupInfo.groupName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${groupInfo.type === 'Security' ? 'bg-blue-100' : 'bg-green-100'}`}>
                {groupInfo.type === 'Security' ? (
                  <Lock className="text-blue-600" size={32} />
                ) : (
                  <Globe className="text-green-600" size={32} />
                )}
              </div>
              <div>
                <h1>{groupInfo.groupName}</h1>
                <p className="text-sm text-gray-600">{groupInfo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Group Type</p>
              <Shield className="text-blue-600" size={20} />
            </div>
            <p className="text-xl font-semibold text-gray-900">{groupInfo.type}</p>
            <p className="text-xs text-gray-500 mt-1">{groupInfo.scope} scope</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Members</p>
              <Users className="text-green-600" size={20} />
            </div>
            <p className="text-xl font-semibold text-green-600">{groupInfo.memberCount || allUsers.length}</p>
            <p className="text-xs text-gray-500 mt-1">Group members</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Managed By</p>
              <UserCheck className="text-purple-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{groupInfo.managedBy}</p>
            <p className="text-xs text-gray-500 mt-1">Group manager</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Last Modified</p>
              <Calendar className="text-orange-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{groupInfo.modifiedDate}</p>
            <p className="text-xs text-gray-500 mt-1">Created: {groupInfo.createdDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disabled Users</p>
                <p className="text-2xl font-semibold text-red-600">{disabledUsers}</p>
              </div>
              <UserCheck className="text-red-500" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search members by name, email, department, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredUsers.length} of {allUsers.length} members
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Group Members</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail size={14} className="text-gray-400 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building size={14} className="text-gray-400 mr-2" />
                        {user.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.accountStatus === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No members found matching your search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
