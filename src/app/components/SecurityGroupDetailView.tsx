import { ArrowLeft, Shield, Users, Activity, Lock, Calendar, Download, Search, Edit, Trash2, UserPlus, UserMinus, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { useState } from 'react';

interface GroupMember {
  username: string;
  displayName: string;
  email: string;
  type: 'User' | 'Computer' | 'Group';
  ou: string;
  status: 'Active' | 'Inactive' | 'Disabled';
  lastLogin: string;
  accountCreated: string;
  memberSince: string;
}

interface SecurityGroupDetail {
  id: string;
  groupName: string;
  groupType: string;
  ou: string;
  memberCount: number;
  privileged: boolean;
  lastUsed: string;
  createdDate: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  description: string;
  distinguishedName: string;
  sid: string;
  scope: string;
  managedBy: string;
  email: string;
  notes: string;
}

interface Permission {
  resource: string;
  type: string;
  level: string;
  inherited: boolean;
}

interface GroupActivity {
  date: string;
  action: string;
  performedBy: string;
  details: string;
}

const mockGroupDetails: { [key: string]: SecurityGroupDetail } = {
  '1': {
    id: '1',
    groupName: 'Domain Admins',
    groupType: 'Security - Global',
    ou: 'IT Security',
    memberCount: 5,
    privileged: true,
    lastUsed: '2024-12-22',
    createdDate: '2020-01-10',
    riskLevel: 'High',
    description: 'Designated administrators of the domain with full control over domain resources',
    distinguishedName: 'CN=Domain Admins,OU=IT Security,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-512',
    scope: 'Global',
    managedBy: 'CN=IT Security Team,OU=IT Security,DC=contoso,DC=com',
    email: 'domain-admins@contoso.com',
    notes: 'Critical security group - all changes require approval from CISO'
  },
  // Passive group example
  'passive-1': {
    id: 'passive-1',
    groupName: 'Legacy CRM Users',
    groupType: 'Security - Global',
    ou: 'Finance',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-08-20',
    createdDate: '2019-03-15',
    riskLevel: 'Low',
    description: 'Old CRM application users - application decommissioned',
    distinguishedName: 'CN=Legacy CRM Users,OU=Finance,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1045',
    scope: 'Global',
    managedBy: 'Unassigned',
    email: 'legacy-crm@contoso.com',
    notes: 'Marked for deletion - application decommissioned in August 2023'
  }
};

const mockMembers: { [key: string]: GroupMember[] } = {
  '1': [
    {
      username: 'admin1@contoso.com',
      displayName: 'James Anderson',
      email: 'james.anderson@contoso.com',
      type: 'User',
      ou: 'IT Security',
      status: 'Active',
      lastLogin: '2024-12-22 14:30:00',
      accountCreated: '2020-01-15',
      memberSince: '2020-01-20'
    },
    {
      username: 'admin2@contoso.com',
      displayName: 'Sarah Mitchell',
      email: 'sarah.mitchell@contoso.com',
      type: 'User',
      ou: 'IT Security',
      status: 'Active',
      lastLogin: '2024-12-22 09:15:00',
      accountCreated: '2020-02-10',
      memberSince: '2020-02-15'
    },
    {
      username: 'admin3@contoso.com',
      displayName: 'Michael Chen',
      email: 'michael.chen@contoso.com',
      type: 'User',
      ou: 'IT Security',
      status: 'Active',
      lastLogin: '2024-12-21 16:45:00',
      accountCreated: '2020-03-05',
      memberSince: '2020-03-10'
    },
    {
      username: 'admin4@contoso.com',
      displayName: 'Emily Davis',
      email: 'emily.davis@contoso.com',
      type: 'User',
      ou: 'IT Security',
      status: 'Inactive',
      lastLogin: '2024-11-15 10:20:00',
      accountCreated: '2021-01-12',
      memberSince: '2021-01-20'
    },
    {
      username: 'admin5@contoso.com',
      displayName: 'Robert Taylor',
      email: 'robert.taylor@contoso.com',
      type: 'User',
      ou: 'IT Security',
      status: 'Active',
      lastLogin: '2024-12-22 11:00:00',
      accountCreated: '2021-06-18',
      memberSince: '2021-06-25'
    },
    {
      username: 'backup.admin@contoso.com',
      displayName: 'Backup Administrator',
      email: 'backup.admin@contoso.com',
      type: 'User',
      ou: 'Service Accounts',
      status: 'Active',
      lastLogin: '2024-12-22 03:00:00',
      accountCreated: '2020-01-10',
      memberSince: '2020-01-10'
    },
    {
      username: 'DC01$',
      displayName: 'Domain Controller 01',
      email: 'N/A',
      type: 'Computer',
      ou: 'Domain Controllers',
      status: 'Active',
      lastLogin: '2024-12-22 14:35:00',
      accountCreated: '2020-01-10',
      memberSince: '2020-01-10'
    }
  ]
};

const mockPermissions: Permission[] = [
  { resource: 'C:\\SharedFiles\\Finance', type: 'File Share', level: 'Full Control', inherited: false },
  { resource: 'C:\\SharedFiles\\HR', type: 'File Share', level: 'Full Control', inherited: false },
  { resource: 'Exchange Admin Center', type: 'Application', level: 'Administrator', inherited: false },
  { resource: 'SharePoint Admin', type: 'Application', level: 'Full Control', inherited: true },
  { resource: 'SQL Server - PROD', type: 'Database', level: 'db_owner', inherited: false },
  { resource: 'Active Directory', type: 'Directory', level: 'Full Control', inherited: false }
];

const mockActivity: GroupActivity[] = [
  { date: '2024-12-22 14:30:00', action: 'Member Added', performedBy: 'admin1@contoso.com', details: 'Added robert.taylor@contoso.com to group' },
  { date: '2024-12-20 10:15:00', action: 'Permission Modified', performedBy: 'admin2@contoso.com', details: 'Updated SharePoint permissions' },
  { date: '2024-12-18 16:45:00', action: 'Member Removed', performedBy: 'admin1@contoso.com', details: 'Removed john.old@contoso.com from group' },
  { date: '2024-12-15 09:30:00', action: 'Group Modified', performedBy: 'admin3@contoso.com', details: 'Updated group description' },
  { date: '2024-12-10 11:20:00', action: 'Permission Added', performedBy: 'admin1@contoso.com', details: 'Granted access to SQL Server - PROD' }
];

interface SecurityGroupDetailViewProps {
  groupId: string;
  onBack: () => void;
}

export function SecurityGroupDetailView({ groupId, onBack }: SecurityGroupDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState<'members' | 'permissions' | 'activity'>('members');

  const groupDetail = mockGroupDetails[groupId] || mockGroupDetails['1'];
  const members = mockMembers[groupId] || mockMembers['1'];

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || member.type === filterType;
    const matchesStatus = filterStatus === 'All' || member.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const activeMembers = members.filter(m => m.status === 'Active').length;
  const inactiveMembers = members.filter(m => m.status === 'Inactive' || m.status === 'Disabled').length;
  const userMembers = members.filter(m => m.type === 'User').length;
  const computerMembers = members.filter(m => m.type === 'Computer').length;
  const groupMembers = members.filter(m => m.type === 'Group').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Disabled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'User':
        return 'bg-blue-100 text-blue-800';
      case 'Computer':
        return 'bg-purple-100 text-purple-800';
      case 'Group':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to All Groups</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">Security Groups</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">All Active Groups</span>
            <span>/</span>
            <span className="text-gray-900">{groupDetail.groupName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="text-blue-600" size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1>{groupDetail.groupName}</h1>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRiskColor(groupDetail.riskLevel)}`}>
                    {groupDetail.riskLevel} Risk
                  </span>
                  {groupDetail.privileged && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      Privileged
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{groupDetail.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <UserPlus size={18} />
                <span>Add Member</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Edit size={18} />
                <span>Edit Group</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Group Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Members</p>
              <Users className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
            <p className="text-xs text-gray-500 mt-1">{userMembers} users, {computerMembers} computers</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Members</p>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-green-600">{activeMembers}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((activeMembers / members.length) * 100)}% of total</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Inactive Members</p>
              <AlertTriangle className="text-orange-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-orange-600">{inactiveMembers}</p>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Permissions</p>
              <Lock className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{mockPermissions.length}</p>
            <p className="text-xs text-gray-500 mt-1">Assigned resources</p>
          </div>
        </div>

        {/* Group Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Group Type</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.groupType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Scope</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.scope}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Organizational Unit</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.ou}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Managed By</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.managedBy}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="text-purple-600" size={20} />
              <h3 className="font-semibold text-gray-900">Technical Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Distinguished Name</p>
                <p className="text-xs text-gray-900 mt-1 font-mono break-all">{groupDetail.distinguishedName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Security Identifier (SID)</p>
                <p className="text-xs text-gray-900 mt-1 font-mono break-all">{groupDetail.sid}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created Date</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.createdDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'members'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Members ({members.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'permissions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <Lock size={18} />
                <span>Permissions ({mockPermissions.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <Activity size={18} />
                <span>Activity Log</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="p-6">
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="User">Users</option>
                  <option value="Computer">Computers</option>
                  <option value="Group">Groups</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.displayName}</div>
                            <div className="text-xs text-gray-500">{member.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(member.type)}`}>
                            {member.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {member.ou}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {member.lastLogin}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {member.memberSince}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Users size={16} />
                            </button>
                            <button
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove Member"
                            >
                              <UserMinus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inherited</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockPermissions.map((permission, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {permission.resource}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {permission.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {permission.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {permission.inherited ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Direct
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit Permission"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove Permission"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <div className="space-y-4">
                {mockActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Activity className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Performed by: <span className="font-medium">{activity.performedBy}</span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}