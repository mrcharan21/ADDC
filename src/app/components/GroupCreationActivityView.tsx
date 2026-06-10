import { ArrowLeft, Shield, Search, Network, Server, Calendar, Clock, AlertCircle, Users } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface GroupCreationRecord {
  id: string;
  groupName: string;
  groupType: 'Security' | 'Distribution';
  scope: 'Global' | 'Universal' | 'Domain Local' | 'Local';
  createdDate: string;
  createdTime: string;
  createdBy: string;
  creationSource: 'Active Directory' | 'Server';
  serverName?: string;
  description: string;
  initialMembers: number;
  status: 'Active' | 'Pending';
}

const mockGroupCreations: GroupCreationRecord[] = [
  {
    id: '1',
    groupName: 'Engineering_DevOps_Team',
    groupType: 'Security',
    scope: 'Global',
    createdDate: '2024-12-24',
    createdTime: '09:30 AM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    description: 'DevOps team members with deployment privileges',
    initialMembers: 8,
    status: 'Active'
  },
  {
    id: '2',
    groupName: 'Marketing_Campaign_Access',
    groupType: 'Security',
    scope: 'Global',
    createdDate: '2024-12-24',
    createdTime: '08:15 AM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    description: 'Access to marketing campaign resources',
    initialMembers: 12,
    status: 'Active'
  },
  {
    id: '3',
    groupName: 'SERVER_APP01_Operators',
    groupType: 'Security',
    scope: 'Local',
    createdDate: '2024-12-24',
    createdTime: '07:45 AM',
    createdBy: 'it.admin@contoso.com',
    creationSource: 'Server',
    serverName: 'SERVER-APP01',
    description: 'Local operators for application server',
    initialMembers: 5,
    status: 'Active'
  },
  {
    id: '4',
    groupName: 'Finance_Audit_Team',
    groupType: 'Security',
    scope: 'Universal',
    createdDate: '2024-12-23',
    createdTime: '04:30 PM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    description: 'Financial audit and compliance team',
    initialMembers: 6,
    status: 'Active'
  },
  {
    id: '5',
    groupName: 'Project_Alpha_Team',
    groupType: 'Security',
    scope: 'Global',
    createdDate: '2024-12-23',
    createdTime: '03:20 PM',
    createdBy: 'pm@contoso.com',
    creationSource: 'Active Directory',
    description: 'Project Alpha cross-functional team',
    initialMembers: 15,
    status: 'Active'
  },
  {
    id: '6',
    groupName: 'SERVER_DB01_Admins',
    groupType: 'Security',
    scope: 'Local',
    createdDate: '2024-12-23',
    createdTime: '02:15 PM',
    createdBy: 'db.admin@contoso.com',
    creationSource: 'Server',
    serverName: 'SERVER-DB01',
    description: 'Database server administrators',
    initialMembers: 3,
    status: 'Active'
  },
  {
    id: '7',
    groupName: 'HR_Recruiting_Team',
    groupType: 'Distribution',
    scope: 'Global',
    createdDate: '2024-12-23',
    createdTime: '01:45 PM',
    createdBy: 'hr.admin@contoso.com',
    creationSource: 'Active Directory',
    description: 'HR recruiting team distribution list',
    initialMembers: 7,
    status: 'Active'
  },
  {
    id: '8',
    groupName: 'IT_Security_Incident_Response',
    groupType: 'Security',
    scope: 'Universal',
    createdDate: '2024-12-23',
    createdTime: '11:30 AM',
    createdBy: 'security.admin@contoso.com',
    creationSource: 'Active Directory',
    description: 'Security incident response team',
    initialMembers: 10,
    status: 'Active'
  },
  {
    id: '9',
    groupName: 'SERVER_WEB01_Publishers',
    groupType: 'Security',
    scope: 'Local',
    createdDate: '2024-12-22',
    createdTime: '05:00 PM',
    createdBy: 'web.admin@contoso.com',
    creationSource: 'Server',
    serverName: 'SERVER-WEB01',
    description: 'Web content publishers',
    initialMembers: 4,
    status: 'Active'
  },
  {
    id: '10',
    groupName: 'Legal_Document_Review',
    groupType: 'Security',
    scope: 'Domain Local',
    createdDate: '2024-12-22',
    createdTime: '03:15 PM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    description: 'Legal document review and approval',
    initialMembers: 5,
    status: 'Pending'
  }
];

interface GroupCreationActivityViewProps {
  onBack: () => void;
}

export function GroupCreationActivityView({ onBack }: GroupCreationActivityViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<'All' | 'Active Directory' | 'Server'>('All');
  const [filterType, setFilterType] = useState<'All' | 'Security' | 'Distribution'>('All');

  const filteredGroups = mockGroupCreations.filter(group => {
    const matchesSearch = 
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.serverName && group.serverName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSource = filterSource === 'All' || group.creationSource === filterSource;
    const matchesType = filterType === 'All' || group.groupType === filterType;
    
    return matchesSearch && matchesSource && matchesType;
  });

  const adCount = mockGroupCreations.filter(g => g.creationSource === 'Active Directory').length;
  const serverCount = mockGroupCreations.filter(g => g.creationSource === 'Server').length;
  const todayCount = mockGroupCreations.filter(g => g.createdDate === '2024-12-24').length;
  const securityCount = mockGroupCreations.filter(g => g.groupType === 'Security').length;

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
            <Shield className="text-purple-600" size={32} />
            <div>
              <h1>Security Group Creation Activity</h1>
              <p className="text-sm text-gray-600">New security groups created at Active Directory and individual servers</p>
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
                <p className="text-sm text-gray-600">Total Groups Created</p>
                <p className="text-2xl font-semibold text-purple-600">{mockGroupCreations.length}</p>
              </div>
              <Shield className="text-purple-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Created Today</p>
                <p className="text-2xl font-semibold text-green-600">{todayCount}</p>
              </div>
              <Calendar className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">From AD</p>
                <p className="text-2xl font-semibold text-blue-600">{adCount}</p>
              </div>
              <Network className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">From Servers</p>
                <p className="text-2xl font-semibold text-orange-600">{serverCount}</p>
              </div>
              <Server className="text-orange-500" size={32} />
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
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Sources</option>
              <option value="Active Directory">Active Directory</option>
              <option value="Server">Individual Servers</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Security">Security Groups</option>
              <option value="Distribution">Distribution Groups</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredGroups.length} of {mockGroupCreations.length} groups
          </div>
        </div>

        {/* Groups Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Shield className="text-purple-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{group.groupName}</div>
                          <div className="text-xs text-gray-500">{group.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        group.groupType === 'Security' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {group.groupType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.scope}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{group.createdDate}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {group.createdTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {group.creationSource === 'Active Directory' ? (
                          <>
                            <Network className="text-blue-600" size={16} />
                            <span className="text-sm text-gray-900">Active Directory</span>
                          </>
                        ) : (
                          <>
                            <Server className="text-orange-600" size={16} />
                            <div>
                              <div className="text-sm text-gray-900">Server</div>
                              <div className="text-xs text-gray-500">{group.serverName}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Users size={16} className="text-gray-500" />
                        {group.initialMembers}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        group.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {group.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert Section */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 mb-1">Security Compliance Alert</h3>
              <p className="text-sm text-amber-800">
                Security groups created on individual servers require special attention. These local groups may bypass domain-level security policies and should be audited regularly to ensure compliance with organizational security standards.
              </p>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}