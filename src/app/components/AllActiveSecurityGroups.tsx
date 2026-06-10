import { ArrowLeft, Search, Download, Users, Eye, FileText, Link as LinkIcon, Lock, Trash2, ChevronDown, ChevronRight, Calendar, Shield, Activity, UserPlus } from 'lucide-react';
import { useState, Fragment } from 'react';

interface SecurityGroup {
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
}

interface GroupMember {
  username: string;
  displayName: string;
  type: 'User' | 'Computer' | 'Group';
  ou: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

const mockGroupMembers: { [key: string]: GroupMember[] } = {
  '1': [
    { username: 'admin1@contoso.com', displayName: 'Administrator One', type: 'User', ou: 'IT Security', status: 'Active', lastLogin: '2024-12-22' },
    { username: 'admin2@contoso.com', displayName: 'Administrator Two', type: 'User', ou: 'IT Security', status: 'Active', lastLogin: '2024-12-21' },
    { username: 'admin3@contoso.com', displayName: 'Administrator Three', type: 'User', ou: 'IT Security', status: 'Active', lastLogin: '2024-12-20' },
    { username: 'admin4@contoso.com', displayName: 'Administrator Four', type: 'User', ou: 'IT Security', status: 'Inactive', lastLogin: '2024-11-15' },
    { username: 'admin5@contoso.com', displayName: 'Administrator Five', type: 'User', ou: 'IT Security', status: 'Active', lastLogin: '2024-12-22' },
  ],
  '2': [
    { username: 'enterprise.admin1@contoso.com', displayName: 'Enterprise Admin One', type: 'User', ou: 'IT Security', status: 'Active', lastLogin: '2024-12-20' },
    { username: 'enterprise.admin2@contoso.com', displayName: 'Enterprise Admin Two', type: 'User', ou: 'IT Security', status: 'Active', lastLogin: '2024-12-19' },
    { username: 'enterprise.admin3@contoso.com', displayName: 'Enterprise Admin Three', type: 'User', ou: 'IT Security', status: 'Active', lastLogin: '2024-12-18' },
  ],
  '3': [
    { username: 'user1@contoso.com', displayName: 'John Doe', type: 'User', ou: 'Marketing', status: 'Active', lastLogin: '2024-12-22' },
    { username: 'user2@contoso.com', displayName: 'Jane Smith', type: 'User', ou: 'Sales', status: 'Active', lastLogin: '2024-12-22' },
    { username: 'user3@contoso.com', displayName: 'Bob Wilson', type: 'User', ou: 'Engineering', status: 'Active', lastLogin: '2024-12-21' },
    { username: 'laptop-001', displayName: 'Marketing Laptop 001', type: 'Computer', ou: 'Computers', status: 'Active', lastLogin: '2024-12-22' },
  ]
};

const mockSecurityGroups: SecurityGroup[] = [
  {
    id: '1',
    groupName: 'Domain Admins',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 5,
    privileged: true,
    lastUsed: '2024-12-22',
    createdDate: '2020-01-10',
    riskLevel: 'High',
    description: 'Designated administrators of the domain'
  },
  {
    id: '2',
    groupName: 'Enterprise Admins',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 3,
    privileged: true,
    lastUsed: '2024-12-20',
    createdDate: '2020-01-10',
    riskLevel: 'High',
    description: 'Enterprise-wide administrators'
  },
  {
    id: '3',
    groupName: 'VPN Users',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 87,
    privileged: false,
    lastUsed: '2024-12-22',
    createdDate: '2020-06-01',
    riskLevel: 'Medium',
    description: 'Users with VPN access privileges'
  },
  {
    id: '4',
    groupName: 'Finance Team',
    groupType: 'Security',
    ou: 'Finance',
    memberCount: 18,
    privileged: false,
    lastUsed: '2024-12-21',
    createdDate: '2020-05-20',
    riskLevel: 'Low',
    description: 'Finance department access'
  },
  {
    id: '5',
    groupName: 'SharePoint Admins',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 8,
    privileged: true,
    lastUsed: '2024-12-19',
    createdDate: '2021-04-12',
    riskLevel: 'High',
    description: 'SharePoint site administrators'
  },
  {
    id: '6',
    groupName: 'Engineering',
    groupType: 'Security',
    ou: 'Engineering',
    memberCount: 42,
    privileged: false,
    lastUsed: '2024-12-22',
    createdDate: '2020-03-15',
    riskLevel: 'Medium',
    description: 'Engineering department group'
  },
  {
    id: '7',
    groupName: 'Database Admins',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 6,
    privileged: true,
    lastUsed: '2024-12-21',
    createdDate: '2020-08-10',
    riskLevel: 'High',
    description: 'Database server administrators'
  },
  {
    id: '8',
    groupName: 'HR Department',
    groupType: 'Security',
    ou: 'HR',
    memberCount: 12,
    privileged: false,
    lastUsed: '2024-12-20',
    createdDate: '2020-02-14',
    riskLevel: 'Low',
    description: 'Human resources department'
  },
  {
    id: '9',
    groupName: 'Sales Team',
    groupType: 'Security',
    ou: 'Sales',
    memberCount: 34,
    privileged: false,
    lastUsed: '2024-12-22',
    createdDate: '2020-07-08',
    riskLevel: 'Low',
    description: 'Sales department members'
  },
  {
    id: '10',
    groupName: 'Backup Operators',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 4,
    privileged: true,
    lastUsed: '2024-12-22',
    createdDate: '2020-03-20',
    riskLevel: 'High',
    description: 'Backup and recovery operators'
  },
  {
    id: '11',
    groupName: 'IT Support',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 15,
    privileged: false,
    lastUsed: '2024-12-21',
    createdDate: '2020-03-20',
    riskLevel: 'Medium',
    description: 'IT helpdesk and support team'
  },
  {
    id: '12',
    groupName: 'Marketing',
    groupType: 'Security',
    ou: 'Marketing',
    memberCount: 25,
    privileged: false,
    lastUsed: '2024-12-20',
    createdDate: '2021-02-10',
    riskLevel: 'Low',
    description: 'Marketing department access'
  },
  {
    id: '13',
    groupName: 'Remote Desktop Users',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 45,
    privileged: false,
    lastUsed: '2024-12-22',
    createdDate: '2020-09-15',
    riskLevel: 'Medium',
    description: 'Remote desktop access group'
  },
  {
    id: '14',
    groupName: 'Server Admins',
    groupType: 'Security',
    ou: 'IT Security',
    memberCount: 7,
    privileged: true,
    lastUsed: '2024-12-22',
    createdDate: '2020-05-10',
    riskLevel: 'High',
    description: 'Server infrastructure administrators'
  },
  {
    id: '15',
    groupName: 'Legal Team',
    groupType: 'Security',
    ou: 'Legal',
    memberCount: 8,
    privileged: false,
    lastUsed: '2024-12-19',
    createdDate: '2020-11-12',
    riskLevel: 'Low',
    description: 'Legal department access'
  }
];

interface AllActiveSecurityGroupsProps {
  onBack: () => void;
  initialFilter?: string;
  onGroupClick: (groupId: string) => void;
}

export function AllActiveSecurityGroups({ onBack, initialFilter, onGroupClick }: AllActiveSecurityGroupsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOU, setFilterOU] = useState<string>('All');
  const [filterPrivileged, setFilterPrivileged] = useState<string>(
    initialFilter === 'privileged' ? 'Yes' : 'All'
  );
  const [filterRisk, setFilterRisk] = useState<string>(
    initialFilter === 'high-risk' ? 'High' : 'All'
  );
  const [sortBy, setSortBy] = useState<string>('riskLevel');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const filteredGroups = mockSecurityGroups
    .filter(group => {
      const matchesSearch =
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.ou.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOU = filterOU === 'All' || group.ou === filterOU;
      const matchesPrivileged = filterPrivileged === 'All' ||
        (filterPrivileged === 'Yes' && group.privileged) ||
        (filterPrivileged === 'No' && !group.privileged);
      const matchesRisk = filterRisk === 'All' || group.riskLevel === filterRisk;

      return matchesSearch && matchesOU && matchesPrivileged && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'riskLevel') {
        const riskOrder = { High: 0, Medium: 1, Low: 2 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      } else if (sortBy === 'memberCount') {
        return b.memberCount - a.memberCount;
      } else if (sortBy === 'lastUsed') {
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      }
      return 0;
    });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const uniqueOUs = Array.from(new Set(mockSecurityGroups.map(g => g.ou)));

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
            <span>Back to Dashboard</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900">Active Security Groups</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={32} />
              <div>
                <h1>All Active Security Groups</h1>
                <p className="text-sm text-gray-600">Complete inventory of groups actively granting access</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Groups</p>
                <p className="text-xl font-semibold text-gray-900">{filteredGroups.length}</p>
              </div>

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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Active Groups</p>
              <Shield className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-semibold text-blue-600">{mockSecurityGroups.length}</p>
            <p className="text-xs text-gray-500 mt-1">All security groups</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Privileged Groups</p>
              <Lock className="text-orange-600" size={20} />
            </div>
            <p className="text-3xl font-semibold text-orange-600">
              {mockSecurityGroups.filter(g => g.privileged).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">High privilege access</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Members</p>
              <Users className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-semibold text-green-600">
              {mockSecurityGroups.reduce((acc, g) => acc + g.memberCount, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Across all groups</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by group name, OU, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filterOU}
              onChange={(e) => setFilterOU(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All OUs</option>
              {uniqueOUs.map(ou => (
                <option key={ou} value={ou}>{ou}</option>
              ))}
            </select>

            <select
              value={filterPrivileged}
              onChange={(e) => setFilterPrivileged(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Privileges</option>
              <option value="Yes">Privileged</option>
              <option value="No">Non-Privileged</option>
            </select>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="riskLevel">Sort by Risk</option>
              <option value="memberCount">Sort by Members</option>
              <option value="lastUsed">Sort by Last Used</option>
            </select>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU / Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privileged</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onGroupClick(group.id)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{group.groupName}</div>
                        <div className="text-xs text-gray-500">{group.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {group.groupType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.ou}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Users size={14} className="text-gray-400" />
                        {group.memberCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {group.privileged ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.lastUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.createdDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredGroups.length} of {mockSecurityGroups.length} active security groups
        </div>
      </main>
    </div>
  );
}