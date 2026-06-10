import { ArrowLeft, FileText, CheckCircle, XCircle, Clock, Users, Monitor, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

interface GPOInfo {
  id: string;
  gpoName: string;
  description: string;
  status: 'Enabled' | 'Disabled';
  linkedTo: string;
  appliedTo: 'Users' | 'Computers' | 'Both';
  version: string;
  createdDate: string;
  modifiedDate: string;
  owner: string;
  enforcedLinks: number;
}

interface ApplicationTarget {
  id: string;
  name: string;
  type: 'User' | 'Computer';
  status: 'Success' | 'Failed';
  appliedDate: string;
  lastRefresh: string;
  failureReason?: string;
  department?: string;
  ou: string;
}

// Mock GPO data
const mockGPOInfo: Record<string, GPOInfo> = {
  '1': {
    id: '1',
    gpoName: 'Default Domain Policy',
    description: 'Default domain-wide security settings',
    status: 'Enabled',
    linkedTo: 'company.local',
    appliedTo: 'Both',
    version: '12.0',
    createdDate: '2020-01-05',
    modifiedDate: '2024-12-15',
    owner: 'Domain Admins',
    enforcedLinks: 1
  },
  '2': {
    id: '2',
    gpoName: 'Password Policy',
    description: 'Enterprise password complexity requirements',
    status: 'Enabled',
    linkedTo: 'company.local',
    appliedTo: 'Users',
    version: '8.0',
    createdDate: '2020-02-10',
    modifiedDate: '2024-11-20',
    owner: 'IT Security',
    enforcedLinks: 1
  },
  '3': {
    id: '3',
    gpoName: 'Workstation Security',
    description: 'Security settings for all workstations',
    status: 'Enabled',
    linkedTo: 'OU=Workstations',
    appliedTo: 'Computers',
    version: '15.0',
    createdDate: '2020-03-15',
    modifiedDate: '2024-12-18',
    owner: 'IT Security',
    enforcedLinks: 2
  },
  '4': {
    id: '4',
    gpoName: 'Software Deployment',
    description: 'Automated software installation and updates',
    status: 'Enabled',
    linkedTo: 'OU=Workstations',
    appliedTo: 'Computers',
    version: '23.0',
    createdDate: '2021-01-20',
    modifiedDate: '2024-12-20',
    owner: 'IT Operations',
    enforcedLinks: 1
  },
  '5': {
    id: '5',
    gpoName: 'VPN Access Policy',
    description: 'VPN client configuration and restrictions',
    status: 'Enabled',
    linkedTo: 'OU=Remote Users',
    appliedTo: 'Users',
    version: '6.0',
    createdDate: '2021-05-10',
    modifiedDate: '2024-10-30',
    owner: 'Network Team',
    enforcedLinks: 1
  },
  '6': {
    id: '6',
    gpoName: 'Firewall Configuration',
    description: 'Windows Firewall rules and settings',
    status: 'Enabled',
    linkedTo: 'company.local',
    appliedTo: 'Computers',
    version: '11.0',
    createdDate: '2020-04-12',
    modifiedDate: '2024-11-25',
    owner: 'Network Security',
    enforcedLinks: 1
  },
  '7': {
    id: '7',
    gpoName: 'Drive Mapping',
    description: 'Network drive mappings for departments',
    status: 'Enabled',
    linkedTo: 'OU=Users',
    appliedTo: 'Users',
    version: '5.0',
    createdDate: '2020-06-08',
    modifiedDate: '2024-09-15',
    owner: 'IT Operations',
    enforcedLinks: 0
  },
  '8': {
    id: '8',
    gpoName: 'Legacy Printer Policy',
    description: 'Old printer deployment policy',
    status: 'Disabled',
    linkedTo: 'OU=Finance',
    appliedTo: 'Users',
    version: '3.0',
    createdDate: '2019-08-20',
    modifiedDate: '2023-06-10',
    owner: 'IT Support',
    enforcedLinks: 0
  },
  '9': {
    id: '9',
    gpoName: 'Screen Saver Lock',
    description: 'Automatic screen lock after inactivity',
    status: 'Enabled',
    linkedTo: 'company.local',
    appliedTo: 'Users',
    version: '4.0',
    createdDate: '2020-07-15',
    modifiedDate: '2024-08-20',
    owner: 'IT Security',
    enforcedLinks: 1
  },
  '10': {
    id: '10',
    gpoName: 'Audit Policy',
    description: 'Security auditing and logging configuration',
    status: 'Enabled',
    linkedTo: 'company.local',
    appliedTo: 'Both',
    version: '9.0',
    createdDate: '2020-05-25',
    modifiedDate: '2024-12-05',
    owner: 'IT Security',
    enforcedLinks: 1
  }
};

// Mock application targets data
const mockApplicationTargets: Record<string, ApplicationTarget[]> = {
  '1': [ // Default Domain Policy - applied to both users and computers
    { id: '1', name: 'DESKTOP-WS001', type: 'Computer', status: 'Success', appliedDate: '2024-12-20', lastRefresh: '2024-12-23 08:00', ou: 'OU=Workstations' },
    { id: '2', name: 'DESKTOP-WS002', type: 'Computer', status: 'Success', appliedDate: '2024-12-20', lastRefresh: '2024-12-23 07:45', ou: 'OU=Workstations' },
    { id: '3', name: 'DESKTOP-WS003', type: 'Computer', status: 'Failed', appliedDate: '2024-12-20', lastRefresh: '2024-12-23 06:30', failureReason: 'Access Denied', ou: 'OU=Workstations' },
    { id: '4', name: 'john.smith', type: 'User', status: 'Success', appliedDate: '2024-12-15', lastRefresh: '2024-12-23 08:30', department: 'IT', ou: 'OU=Users' },
    { id: '5', name: 'sarah.johnson', type: 'User', status: 'Success', appliedDate: '2024-12-15', lastRefresh: '2024-12-23 07:15', department: 'IT Security', ou: 'OU=Users' },
    { id: '6', name: 'michael.chen', type: 'User', status: 'Success', appliedDate: '2024-12-15', lastRefresh: '2024-12-22 16:45', department: 'IT', ou: 'OU=Users' },
    { id: '7', name: 'SERVER-DC01', type: 'Computer', status: 'Success', appliedDate: '2024-12-20', lastRefresh: '2024-12-23 05:00', ou: 'OU=Servers' }
  ],
  '2': [ // Password Policy - users only
    { id: '8', name: 'john.smith', type: 'User', status: 'Success', appliedDate: '2024-11-20', lastRefresh: '2024-12-23 08:30', department: 'IT', ou: 'OU=Users' },
    { id: '9', name: 'sarah.johnson', type: 'User', status: 'Success', appliedDate: '2024-11-20', lastRefresh: '2024-12-23 07:15', department: 'IT Security', ou: 'OU=Users' },
    { id: '10', name: 'david.miller', type: 'User', status: 'Success', appliedDate: '2024-11-20', lastRefresh: '2024-12-23 09:00', department: 'Engineering', ou: 'OU=Users' },
    { id: '11', name: 'jessica.brown', type: 'User', status: 'Failed', appliedDate: '2024-11-20', lastRefresh: '2024-12-22 17:30', failureReason: 'User Object Not Found', department: 'Engineering', ou: 'OU=Users' },
    { id: '12', name: 'jennifer.lee', type: 'User', status: 'Success', appliedDate: '2024-11-20', lastRefresh: '2024-12-23 08:15', department: 'Finance', ou: 'OU=Users' }
  ],
  '3': [ // Workstation Security - computers only
    { id: '13', name: 'DESKTOP-WS001', type: 'Computer', status: 'Success', appliedDate: '2024-12-18', lastRefresh: '2024-12-23 08:00', ou: 'OU=Workstations' },
    { id: '14', name: 'DESKTOP-WS002', type: 'Computer', status: 'Success', appliedDate: '2024-12-18', lastRefresh: '2024-12-23 07:45', ou: 'OU=Workstations' },
    { id: '15', name: 'DESKTOP-WS003', type: 'Computer', status: 'Success', appliedDate: '2024-12-18', lastRefresh: '2024-12-23 06:30', ou: 'OU=Workstations' },
    { id: '16', name: 'LAPTOP-MKT001', type: 'Computer', status: 'Failed', appliedDate: '2024-12-18', lastRefresh: '2024-12-21 14:20', failureReason: 'Network Timeout', ou: 'OU=Workstations' },
    { id: '17', name: 'LAPTOP-ENG001', type: 'Computer', status: 'Success', appliedDate: '2024-12-18', lastRefresh: '2024-12-23 09:15', ou: 'OU=Workstations' },
    { id: '18', name: 'LAPTOP-ENG002', type: 'Computer', status: 'Failed', appliedDate: '2024-12-18', lastRefresh: '2024-12-22 10:00', failureReason: 'GPO Version Mismatch', ou: 'OU=Workstations' }
  ],
  '4': [ // Software Deployment
    { id: '19', name: 'DESKTOP-WS001', type: 'Computer', status: 'Success', appliedDate: '2024-12-20', lastRefresh: '2024-12-23 08:00', ou: 'OU=Workstations' },
    { id: '20', name: 'DESKTOP-WS002', type: 'Computer', status: 'Success', appliedDate: '2024-12-20', lastRefresh: '2024-12-23 07:45', ou: 'OU=Workstations' },
    { id: '21', name: 'LAPTOP-MKT001', type: 'Computer', status: 'Failed', appliedDate: '2024-12-20', lastRefresh: '2024-12-21 14:20', failureReason: 'Insufficient Permissions', ou: 'OU=Workstations' }
  ],
  '5': [ // VPN Access Policy
    { id: '22', name: 'paul.robinson', type: 'User', status: 'Success', appliedDate: '2024-10-30', lastRefresh: '2024-12-23 08:45', department: 'Engineering', ou: 'OU=Remote Users' },
    { id: '23', name: 'karen.clark', type: 'User', status: 'Success', appliedDate: '2024-10-30', lastRefresh: '2024-12-22 16:15', department: 'Sales', ou: 'OU=Remote Users' },
    { id: '24', name: 'steven.rodriguez', type: 'User', status: 'Failed', appliedDate: '2024-10-30', lastRefresh: '2024-12-23 07:45', failureReason: 'Insufficient Permissions', department: 'IT', ou: 'OU=Remote Users' }
  ],
  '6': [ // Firewall Configuration
    { id: '25', name: 'DESKTOP-WS001', type: 'Computer', status: 'Success', appliedDate: '2024-11-25', lastRefresh: '2024-12-23 08:00', ou: 'OU=Workstations' },
    { id: '26', name: 'DESKTOP-WS002', type: 'Computer', status: 'Success', appliedDate: '2024-11-25', lastRefresh: '2024-12-23 07:45', ou: 'OU=Workstations' },
    { id: '27', name: 'SERVER-DC01', type: 'Computer', status: 'Success', appliedDate: '2024-11-25', lastRefresh: '2024-12-23 05:00', ou: 'OU=Servers' }
  ],
  '7': [ // Drive Mapping
    { id: '28', name: 'john.smith', type: 'User', status: 'Success', appliedDate: '2024-09-15', lastRefresh: '2024-12-23 08:30', department: 'IT', ou: 'OU=Users' },
    { id: '29', name: 'sarah.johnson', type: 'User', status: 'Success', appliedDate: '2024-09-15', lastRefresh: '2024-12-23 07:15', department: 'IT Security', ou: 'OU=Users' }
  ],
  '8': [ // Legacy Printer Policy (disabled)
    { id: '30', name: 'jennifer.lee', type: 'User', status: 'Failed', appliedDate: '2023-06-10', lastRefresh: '2023-06-10 10:00', failureReason: 'GPO Disabled', department: 'Finance', ou: 'OU=Finance' }
  ],
  '9': [ // Screen Saver Lock
    { id: '31', name: 'john.smith', type: 'User', status: 'Success', appliedDate: '2024-08-20', lastRefresh: '2024-12-23 08:30', department: 'IT', ou: 'OU=Users' },
    { id: '32', name: 'sarah.johnson', type: 'User', status: 'Success', appliedDate: '2024-08-20', lastRefresh: '2024-12-23 07:15', department: 'IT Security', ou: 'OU=Users' },
    { id: '33', name: 'david.miller', type: 'User', status: 'Success', appliedDate: '2024-08-20', lastRefresh: '2024-12-23 09:00', department: 'Engineering', ou: 'OU=Users' }
  ],
  '10': [ // Audit Policy
    { id: '34', name: 'DESKTOP-WS001', type: 'Computer', status: 'Success', appliedDate: '2024-12-05', lastRefresh: '2024-12-23 08:00', ou: 'OU=Workstations' },
    { id: '35', name: 'SERVER-DC01', type: 'Computer', status: 'Success', appliedDate: '2024-12-05', lastRefresh: '2024-12-23 05:00', ou: 'OU=Servers' },
    { id: '36', name: 'john.smith', type: 'User', status: 'Success', appliedDate: '2024-12-05', lastRefresh: '2024-12-23 08:30', department: 'IT', ou: 'OU=Users' }
  ]
};

interface GPODetailViewProps {
  gpoId: string;
  onBack: () => void;
}

export function GPODetailView({ gpoId, onBack }: GPODetailViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'User' | 'Computer'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Success' | 'Failed'>('All');
  
  const gpoInfo = mockGPOInfo[gpoId];
  const allTargets = mockApplicationTargets[gpoId] || [];

  const filteredTargets = allTargets.filter(target => {
    const matchesSearch = 
      target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.ou.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (target.department && target.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'All' || target.type === filterType;
    const matchesStatus = filterStatus === 'All' || target.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const successCount = allTargets.filter(t => t.status === 'Success').length;
  const failedCount = allTargets.filter(t => t.status === 'Failed').length;
  const userCount = allTargets.filter(t => t.type === 'User').length;
  const computerCount = allTargets.filter(t => t.type === 'Computer').length;

  if (!gpoInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-600">GPO not found</h2>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to GPOs
          </button>
        </div>
      </div>
    );
  }

  const successRate = allTargets.length > 0 ? ((successCount / allTargets.length) * 100).toFixed(1) : '0';

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
            <span>Back to Group Policy Objects</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>GPOs</span>
            <span>/</span>
            <span className="text-gray-900">{gpoInfo.gpoName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-100">
                <FileText className="text-indigo-600" size={32} />
              </div>
              <div>
                <h1>{gpoInfo.gpoName}</h1>
                <p className="text-sm text-gray-600">{gpoInfo.description}</p>
              </div>
            </div>
            <div>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                gpoInfo.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {gpoInfo.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* GPO Info Cards - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Version</p>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <p className="text-xl font-semibold text-gray-900">v{gpoInfo.version}</p>
            <p className="text-xs text-gray-500 mt-1">Current version</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Linked To</p>
              <FileText className="text-purple-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{gpoInfo.linkedTo}</p>
            <p className="text-xs text-gray-500 mt-1">{gpoInfo.enforcedLinks} enforced link(s)</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Owner</p>
              <Users className="text-orange-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{gpoInfo.owner}</p>
            <p className="text-xs text-gray-500 mt-1">Policy owner</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Last Modified</p>
              <Calendar className="text-teal-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{gpoInfo.modifiedDate}</p>
            <p className="text-xs text-gray-500 mt-1">Created: {gpoInfo.createdDate}</p>
          </div>
        </div>

        {/* Application Statistics - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold text-green-600">{successRate}%</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-semibold text-green-600">{successCount}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-semibold text-red-600">{failedCount}</p>
              </div>
              <XCircle className="text-red-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Targets</p>
                <p className="text-2xl font-semibold text-blue-600">{allTargets.length}</p>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        {/* User/Computer Breakdown - Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applied to Users</p>
                <p className="text-2xl font-semibold text-blue-600">{userCount}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applied to Computers</p>
                <p className="text-2xl font-semibold text-purple-600">{computerCount}</p>
              </div>
              <Monitor className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search targets by name, OU, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="User">Users</option>
              <option value="Computer">Computers</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredTargets.length} of {allTargets.length} targets
          </div>
        </div>

        {/* Application Targets Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Policy Application Targets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department/OU</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTargets.map((target) => (
                  <tr key={target.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          target.type === 'User' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {target.type === 'User' ? (
                            <Users className="text-blue-600" size={20} />
                          ) : (
                            <Monitor className="text-purple-600" size={20} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{target.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        target.type === 'User' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {target.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {target.status === 'Success' && <CheckCircle className="text-green-500" size={16} />}
                        {target.status === 'Failed' && <XCircle className="text-red-500" size={16} />}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          target.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {target.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {target.department || target.ou}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTargets.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No application targets found matching your criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}