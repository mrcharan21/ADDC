import { ArrowLeft, Search, Download, Archive, Eye, UserPlus, Trash2, Link as LinkIcon, AlertTriangle, Calendar, Shield, Clock } from 'lucide-react';
import { useState } from 'react';

interface PassiveSecurityGroup {
  id: string;
  groupName: string;
  groupType: string;
  ou: string;
  createdDate: string;
  lastUsed: string;
  owner: string;
  cleanupStatus: 'Review' | 'Archive' | 'Delete';
  impactLevel: 'Low';
  description: string;
  hasGPOLinks: boolean;
}

const mockPassiveSecurityGroups: PassiveSecurityGroup[] = [
  {
    id: '1',
    groupName: 'Legacy CRM Users',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2019-03-15',
    lastUsed: '2023-08-20',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Old CRM application users - application decommissioned',
    hasGPOLinks: false
  },
  {
    id: '2',
    groupName: 'Temp Project Alpha',
    groupType: 'Security',
    ou: 'Engineering',
    createdDate: '2022-01-10',
    lastUsed: '2022-06-15',
    owner: 'Engineering Manager',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Temporary project team - project completed',
    hasGPOLinks: false
  },
  {
    id: '3',
    groupName: 'Old VPN Group',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2018-05-20',
    lastUsed: '2023-11-30',
    owner: 'IT Manager',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Replaced by new VPN access group',
    hasGPOLinks: true
  },
  {
    id: '4',
    groupName: 'Finance Quarterly Review',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2021-07-08',
    lastUsed: '2023-09-25',
    owner: 'Finance Director',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Ad-hoc group for quarterly reviews',
    hasGPOLinks: false
  },
  {
    id: '5',
    groupName: 'Marketing Campaign 2022',
    groupType: 'Security',
    ou: 'Marketing',
    createdDate: '2022-03-12',
    lastUsed: '2022-12-31',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Campaign-specific access - campaign ended',
    hasGPOLinks: false
  },
  {
    id: '6',
    groupName: 'Test Environment Users',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2020-09-15',
    lastUsed: '2024-01-10',
    owner: 'IT Operations',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Test environment access group - no longer in use',
    hasGPOLinks: false
  },
  {
    id: '7',
    groupName: 'HR Onboarding Temp',
    groupType: 'Security',
    ou: 'HR',
    createdDate: '2021-11-20',
    lastUsed: '2023-10-15',
    owner: 'HR Manager',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Temporary onboarding group',
    hasGPOLinks: false
  },
  {
    id: '8',
    groupName: 'Decommissioned App Access',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2019-06-10',
    lastUsed: '2023-05-20',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Access for decommissioned application',
    hasGPOLinks: false
  },
  {
    id: '9',
    groupName: 'Sales Training Group',
    groupType: 'Security',
    ou: 'Sales',
    createdDate: '2023-02-14',
    lastUsed: '2023-07-30',
    owner: 'Sales Manager',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Training session access group',
    hasGPOLinks: false
  },
  {
    id: '10',
    groupName: 'Legacy ERP Users',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2018-08-22',
    lastUsed: '2023-03-15',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Old ERP system users - system migrated',
    hasGPOLinks: false
  },
  {
    id: '11',
    groupName: 'Contractor Access 2021',
    groupType: 'Security',
    ou: 'Engineering',
    createdDate: '2021-04-05',
    lastUsed: '2022-03-20',
    owner: 'Engineering Lead',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Contractor project access - contract ended',
    hasGPOLinks: false
  },
  {
    id: '12',
    groupName: 'Old File Share Group',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2019-12-10',
    lastUsed: '2024-02-05',
    owner: 'IT Support',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'File share access - share decomissioned',
    hasGPOLinks: true
  },
  {
    id: '13',
    groupName: 'Marketing Event 2023',
    groupType: 'Security',
    ou: 'Marketing',
    createdDate: '2023-05-18',
    lastUsed: '2023-09-30',
    owner: 'Marketing Director',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Event-specific access group',
    hasGPOLinks: false
  },
  {
    id: '14',
    groupName: 'Temp Printer Access',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2020-07-12',
    lastUsed: '2023-11-10',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Temporary printer access group',
    hasGPOLinks: false
  },
  {
    id: '15',
    groupName: 'Audit Team 2022',
    groupType: 'Security',
    ou: 'Legal',
    createdDate: '2022-09-01',
    lastUsed: '2023-01-31',
    owner: 'Legal Director',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Annual audit team access',
    hasGPOLinks: false
  },
  {
    id: '16',
    groupName: 'Legacy HR Portal',
    groupType: 'Security',
    ou: 'HR',
    createdDate: '2019-02-10',
    lastUsed: '2023-06-12',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Old HR portal access',
    hasGPOLinks: false
  },
  {
    id: '17',
    groupName: 'Q3 Finance Review',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2022-08-15',
    lastUsed: '2023-12-01',
    owner: 'Finance Manager',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Quarterly review access',
    hasGPOLinks: false
  },
  {
    id: '18',
    groupName: 'Legacy Database Access',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2018-11-20',
    lastUsed: '2023-04-25',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Decommissioned database',
    hasGPOLinks: false
  },
  {
    id: '19',
    groupName: 'Project Beta Team',
    groupType: 'Security',
    ou: 'Engineering',
    createdDate: '2021-06-10',
    lastUsed: '2022-11-30',
    owner: 'Engineering Manager',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Completed project team',
    hasGPOLinks: false
  },
  {
    id: '20',
    groupName: 'Sales Conference 2023',
    groupType: 'Security',
    ou: 'Sales',
    createdDate: '2023-03-05',
    lastUsed: '2023-08-20',
    owner: 'Sales Director',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Conference event access',
    hasGPOLinks: false
  },
  {
    id: '21',
    groupName: 'Old Network Share',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2019-07-15',
    lastUsed: '2023-09-10',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Decommissioned network share',
    hasGPOLinks: true
  },
  {
    id: '22',
    groupName: 'Marketing Campaign Q4',
    groupType: 'Security',
    ou: 'Marketing',
    createdDate: '2022-10-01',
    lastUsed: '2023-01-15',
    owner: 'Marketing Manager',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Campaign-specific group',
    hasGPOLinks: false
  },
  {
    id: '23',
    groupName: 'Temp Vendor Access',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2020-04-20',
    lastUsed: '2023-07-30',
    owner: 'Finance Lead',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Vendor project access',
    hasGPOLinks: false
  },
  {
    id: '24',
    groupName: 'Legacy Email Group',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2018-09-12',
    lastUsed: '2023-02-18',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Old email distribution',
    hasGPOLinks: false
  },
  {
    id: '25',
    groupName: 'Training Session 2022',
    groupType: 'Security',
    ou: 'HR',
    createdDate: '2022-05-10',
    lastUsed: '2022-12-20',
    owner: 'HR Manager',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Training event access',
    hasGPOLinks: false
  },
  {
    id: '26',
    groupName: 'Product Launch Team',
    groupType: 'Security',
    ou: 'Marketing',
    createdDate: '2021-11-05',
    lastUsed: '2023-10-12',
    owner: 'Marketing Director',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Launch event team',
    hasGPOLinks: false
  },
  {
    id: '27',
    groupName: 'Old VDI Access',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2019-03-25',
    lastUsed: '2023-05-08',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Legacy VDI environment',
    hasGPOLinks: false
  },
  {
    id: '28',
    groupName: 'Finance Workshop 2023',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2023-01-15',
    lastUsed: '2023-06-30',
    owner: 'Finance Director',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Workshop access group',
    hasGPOLinks: false
  },
  {
    id: '29',
    groupName: 'Engineering Interns 2023',
    groupType: 'Security',
    ou: 'Engineering',
    createdDate: '2023-06-01',
    lastUsed: '2023-09-15',
    owner: 'Engineering Manager',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Summer intern access',
    hasGPOLinks: false
  },
  {
    id: '30',
    groupName: 'Deprecated App Users',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2018-12-10',
    lastUsed: '2023-03-22',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Application retired',
    hasGPOLinks: false
  },
  {
    id: '31',
    groupName: 'Sales Training 2022',
    groupType: 'Security',
    ou: 'Sales',
    createdDate: '2022-02-20',
    lastUsed: '2022-08-30',
    owner: 'Sales Manager',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Training program access',
    hasGPOLinks: false
  },
  {
    id: '32',
    groupName: 'Legal Review Panel',
    groupType: 'Security',
    ou: 'Legal',
    createdDate: '2021-09-12',
    lastUsed: '2023-11-20',
    owner: 'Legal Director',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Review panel access',
    hasGPOLinks: false
  },
  {
    id: '33',
    groupName: 'Old Backup Access',
    groupType: 'Security',
    ou: 'IT Security',
    createdDate: '2019-05-18',
    lastUsed: '2023-01-10',
    owner: 'Unassigned',
    cleanupStatus: 'Delete',
    impactLevel: 'Low',
    description: 'Legacy backup system',
    hasGPOLinks: false
  },
  {
    id: '34',
    groupName: 'HR Benefits Review',
    groupType: 'Security',
    ou: 'HR',
    createdDate: '2022-11-01',
    lastUsed: '2023-12-15',
    owner: 'HR Director',
    cleanupStatus: 'Review',
    impactLevel: 'Low',
    description: 'Benefits review team',
    hasGPOLinks: false
  },
  {
    id: '35',
    groupName: 'Merger Task Force',
    groupType: 'Security',
    ou: 'Finance',
    createdDate: '2021-03-10',
    lastUsed: '2022-05-20',
    owner: 'Finance Director',
    cleanupStatus: 'Archive',
    impactLevel: 'Low',
    description: 'Completed merger project',
    hasGPOLinks: false
  }
];

interface AllPassiveSecurityGroupsProps {
  onBack: () => void;
  initialFilter?: string;
  onGroupClick: (groupId: string) => void;
}

export function AllPassiveSecurityGroups({ onBack, initialFilter, onGroupClick }: AllPassiveSecurityGroupsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOU, setFilterOU] = useState<string>('All');
  const [filterOwner, setFilterOwner] = useState<string>('All');
  const [filterCleanupStatus, setFilterCleanupStatus] = useState<string>(
    initialFilter === 'Archive' ? 'Archive' :
      initialFilter === 'Review' ? 'Review' :
        initialFilter === 'Delete' ? 'Delete' : 'All'
  );
  const [sortBy, setSortBy] = useState<string>('oldest');

  const filteredGroups = mockPassiveSecurityGroups
    .filter(group => {
      const matchesSearch =
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.ou.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOU = filterOU === 'All' || group.ou === filterOU;
      const matchesOwner = filterOwner === 'All' ||
        (filterOwner === 'Assigned' && group.owner !== 'Unassigned') ||
        (filterOwner === 'Unassigned' && group.owner === 'Unassigned');
      const matchesCleanupStatus = filterCleanupStatus === 'All' || group.cleanupStatus === filterCleanupStatus;

      return matchesSearch && matchesOU && matchesOwner && matchesCleanupStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      } else if (sortBy === 'lastUsed') {
        return new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime();
      } else if (sortBy === 'ou') {
        return a.ou.localeCompare(b.ou);
      }
      return 0;
    });

  const getCleanupBadgeColor = (status: string) => {
    switch (status) {
      case 'Delete': return 'bg-red-100 text-red-800 border-red-200';
      case 'Archive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const uniqueOUs = Array.from(new Set(mockPassiveSecurityGroups.map(g => g.ou)));

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
            <span className="text-gray-900">Passive Security Groups</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Archive className="text-orange-600" size={32} />
              <div>
                <h1>All Passive Security Groups</h1>
                <p className="text-sm text-gray-600">Empty groups for governance and cleanup</p>
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
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Passive Groups</p>
              <Archive className="text-orange-600" size={20} />
            </div>
            <p className="text-3xl font-semibold text-orange-600">{mockPassiveSecurityGroups.length}</p>
            <p className="text-xs text-gray-500 mt-1">Empty groups (0 members)</p>
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ages</option>
              <option value="1year">Older than 1 year</option>
              <option value="2years">Older than 2 years</option>
              <option value="3years">Older than 3 years</option>
            </select>

            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Owners</option>
              <option value="Assigned">Owner Assigned</option>
              <option value="Unassigned">No Owner</option>
            </select>

            <select
              value={filterCleanupStatus}
              onChange={(e) => setFilterCleanupStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Review">Review</option>
              <option value="Archive">Archive</option>
              <option value="Delete">Delete</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="oldest">Sort by Oldest</option>
              <option value="lastUsed">Sort by Last Used</option>
              <option value="ou">Sort by OU</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{group.groupName}</div>
                        <div className="text-xs text-gray-500">{group.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {group.groupType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.ou}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.lastUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {group.owner === 'Unassigned' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Unassigned
                        </span>
                      ) : (
                        <span className="text-sm text-gray-900">{group.owner}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredGroups.length} of {mockPassiveSecurityGroups.length} passive security groups (0 members each)
        </div>
      </main>
    </div>
  );
}