import { ArrowLeft, FileText, Search, CheckCircle, AlertCircle, Users, Monitor } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface GPO {
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

const mockGPOs: GPO[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
];

interface GPOsViewProps {
  onBack: () => void;
  onGPOClick?: (gpoId: string) => void;
}

export function GPOsView({ onBack, onGPOClick }: GPOsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Enabled' | 'Disabled'>('All');
  const [filterAppliedTo, setFilterAppliedTo] = useState<'All' | 'Users' | 'Computers' | 'Both'>('All');

  const filteredGPOs = mockGPOs.filter(gpo => {
    const matchesSearch = 
      gpo.gpoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gpo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gpo.linkedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || gpo.status === filterStatus;
    const matchesAppliedTo = filterAppliedTo === 'All' || gpo.appliedTo === filterAppliedTo;
    
    return matchesSearch && matchesStatus && matchesAppliedTo;
  });

  const enabledGPOs = mockGPOs.filter(g => g.status === 'Enabled').length;
  const disabledGPOs = mockGPOs.filter(g => g.status === 'Disabled').length;
  const userGPOs = mockGPOs.filter(g => g.appliedTo === 'Users' || g.appliedTo === 'Both').length;
  const computerGPOs = mockGPOs.filter(g => g.appliedTo === 'Computers' || g.appliedTo === 'Both').length;

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
            <FileText className="text-blue-600" size={32} />
            <div>
              <h1>Group Policy Objects</h1>
              <p className="text-sm text-gray-600">Manage and monitor domain GPO configurations</p>
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
                <p className="text-sm text-gray-600">Enabled GPOs</p>
                <p className="text-2xl font-semibold text-green-600">{enabledGPOs}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disabled GPOs</p>
                <p className="text-2xl font-semibold text-gray-600">{disabledGPOs}</p>
              </div>
              <AlertCircle className="text-gray-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User GPOs</p>
                <p className="text-2xl font-semibold text-blue-600">{userGPOs}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Computer GPOs</p>
                <p className="text-2xl font-semibold text-purple-600">{computerGPOs}</p>
              </div>
              <Monitor className="text-purple-500" size={32} />
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
                placeholder="Search GPOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
            
            <select
              value={filterAppliedTo}
              onChange={(e) => setFilterAppliedTo(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Applied To All</option>
              <option value="Users">Users Only</option>
              <option value="Computers">Computers Only</option>
              <option value="Both">Both</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredGPOs.length} of {mockGPOs.length} GPOs
          </div>
        </div>

        {/* GPOs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPO Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGPOs.map((gpo) => (
                  <tr key={gpo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FileText className="text-indigo-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div 
                            onClick={() => onGPOClick && onGPOClick(gpo.id)}
                            className={`font-medium text-gray-900 ${onGPOClick ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                          >
                            {gpo.gpoName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        gpo.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gpo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        gpo.appliedTo === 'Users' ? 'bg-blue-100 text-blue-800' :
                        gpo.appliedTo === 'Computers' ? 'bg-purple-100 text-purple-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {gpo.appliedTo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {gpo.linkedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      v{gpo.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {gpo.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gpo.modifiedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}