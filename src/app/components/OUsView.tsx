import { ArrowLeft, Network, Search, FolderTree, Users, Monitor } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface OrganizationalUnit {
  id: string;
  ouName: string;
  distinguishedName: string;
  description: string;
  userCount: number;
  computerCount: number;
  groupCount: number;
  parentOU: string;
  gpoLinked: number;
  createdDate: string;
  modifiedDate: string;
}

const mockOUs: OrganizationalUnit[] = [
  {
    id: '1',
    ouName: 'Domain Controllers',
    distinguishedName: 'OU=Domain Controllers,DC=company,DC=local',
    description: 'Default container for domain controllers',
    userCount: 0,
    computerCount: 3,
    groupCount: 0,
    parentOU: 'company.local',
    gpoLinked: 2,
    createdDate: '2020-01-05',
    modifiedDate: '2024-11-15'
  },
  {
    id: '2',
    ouName: 'Workstations',
    distinguishedName: 'OU=Workstations,DC=company,DC=local',
    description: 'All employee workstations and laptops',
    userCount: 0,
    computerCount: 285,
    groupCount: 4,
    parentOU: 'company.local',
    gpoLinked: 8,
    createdDate: '2020-02-10',
    modifiedDate: '2024-12-20'
  },
  {
    id: '3',
    ouName: 'Servers',
    distinguishedName: 'OU=Servers,DC=company,DC=local',
    description: 'Production and development servers',
    userCount: 0,
    computerCount: 42,
    groupCount: 6,
    parentOU: 'company.local',
    gpoLinked: 5,
    createdDate: '2020-02-10',
    modifiedDate: '2024-12-18'
  },
  {
    id: '4',
    ouName: 'Users',
    distinguishedName: 'OU=Users,DC=company,DC=local',
    description: 'All domain user accounts',
    userCount: 398,
    computerCount: 0,
    groupCount: 12,
    parentOU: 'company.local',
    gpoLinked: 6,
    createdDate: '2020-02-12',
    modifiedDate: '2024-12-22'
  },
  {
    id: '5',
    ouName: 'Engineering',
    distinguishedName: 'OU=Engineering,OU=Users,DC=company,DC=local',
    description: 'Engineering department users',
    userCount: 42,
    computerCount: 0,
    groupCount: 3,
    parentOU: 'Users',
    gpoLinked: 3,
    createdDate: '2020-03-15',
    modifiedDate: '2024-12-15'
  },
  {
    id: '6',
    ouName: 'Finance',
    distinguishedName: 'OU=Finance,OU=Users,DC=company,DC=local',
    description: 'Finance and accounting department',
    userCount: 18,
    computerCount: 0,
    groupCount: 2,
    parentOU: 'Users',
    gpoLinked: 4,
    createdDate: '2020-04-20',
    modifiedDate: '2024-11-30'
  },
  {
    id: '7',
    ouName: 'Sales',
    distinguishedName: 'OU=Sales,OU=Users,DC=company,DC=local',
    description: 'Sales department users',
    userCount: 34,
    computerCount: 0,
    groupCount: 2,
    parentOU: 'Users',
    gpoLinked: 2,
    createdDate: '2020-05-10',
    modifiedDate: '2024-12-19'
  },
  {
    id: '8',
    ouName: 'Remote Users',
    distinguishedName: 'OU=Remote Users,OU=Users,DC=company,DC=local',
    description: 'Remote and mobile workforce',
    userCount: 87,
    computerCount: 0,
    groupCount: 3,
    parentOU: 'Users',
    gpoLinked: 5,
    createdDate: '2021-03-01',
    modifiedDate: '2024-12-21'
  },
  {
    id: '9',
    ouName: 'Service Accounts',
    distinguishedName: 'OU=Service Accounts,DC=company,DC=local',
    description: 'Service and application accounts',
    userCount: 84,
    computerCount: 0,
    groupCount: 1,
    parentOU: 'company.local',
    gpoLinked: 3,
    createdDate: '2020-03-20',
    modifiedDate: '2024-12-10'
  },
  {
    id: '10',
    ouName: 'Test Environment',
    distinguishedName: 'OU=Test Environment,DC=company,DC=local',
    description: 'Testing and development resources',
    userCount: 15,
    computerCount: 23,
    groupCount: 5,
    parentOU: 'company.local',
    gpoLinked: 2,
    createdDate: '2021-01-15',
    modifiedDate: '2024-10-05'
  }
];

interface OUsViewProps {
  onBack: () => void;
  onOUClick?: (ouId: string) => void;
}

export function OUsView({ onBack, onOUClick }: OUsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOUs = mockOUs.filter(ou => {
    const matchesSearch = 
      ou.ouName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ou.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ou.distinguishedName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalUsers = mockOUs.reduce((sum, ou) => sum + ou.userCount, 0);
  const totalComputers = mockOUs.reduce((sum, ou) => sum + ou.computerCount, 0);
  const totalGroups = mockOUs.reduce((sum, ou) => sum + ou.groupCount, 0);
  const totalGPOs = mockOUs.reduce((sum, ou) => sum + ou.gpoLinked, 0);

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
            <Network className="text-blue-600" size={32} />
            <div>
              <h1>Organizational Units</h1>
              <p className="text-sm text-gray-600">Active Directory OU structure and management</p>
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
                <p className="text-sm text-gray-600">Total OUs</p>
                <p className="text-2xl font-semibold text-teal-600">{mockOUs.length}</p>
              </div>
              <FolderTree className="text-teal-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-blue-600">{totalUsers}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Computers</p>
                <p className="text-2xl font-semibold text-purple-600">{totalComputers}</p>
              </div>
              <Monitor className="text-purple-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Linked GPOs</p>
                <p className="text-2xl font-semibold text-orange-600">{totalGPOs}</p>
              </div>
              <Network className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search organizational units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredOUs.length} of {mockOUs.length} organizational units
          </div>
        </div>

        {/* OUs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent OU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Computers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked GPOs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOUs.map((ou) => (
                  <tr key={ou.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <FolderTree className="text-teal-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div 
                            onClick={() => onOUClick && onOUClick(ou.id)}
                            className={`font-medium text-gray-900 ${onOUClick ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                          >
                            {ou.ouName}
                          </div>
                          <div className="text-xs text-gray-500">{ou.distinguishedName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">{ou.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ou.parentOU}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-blue-500" />
                        {ou.userCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Monitor size={14} className="text-purple-500" />
                        {ou.computerCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ou.groupCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {ou.gpoLinked} GPOs
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ou.modifiedDate}
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