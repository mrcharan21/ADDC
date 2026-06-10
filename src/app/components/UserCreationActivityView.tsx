import { ArrowLeft, UserPlus, Search, Network, Server, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface UserCreationRecord {
  id: string;
  username: string;
  fullName: string;
  createdDate: string;
  createdTime: string;
  createdBy: string;
  creationSource: 'Active Directory' | 'Server';
  serverName?: string;
  department: string;
  initialGroups: string[];
  status: 'Active' | 'Pending';
}

const mockUserCreations: UserCreationRecord[] = [
  {
    id: '1',
    username: 'jdoe',
    fullName: 'John Doe',
    createdDate: '2024-12-24',
    createdTime: '09:15 AM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    department: 'Engineering',
    initialGroups: ['Domain Users', 'Engineering'],
    status: 'Active'
  },
  {
    id: '2',
    username: 'ssmith',
    fullName: 'Sarah Smith',
    createdDate: '2024-12-24',
    createdTime: '08:45 AM',
    createdBy: 'hr.admin@contoso.com',
    creationSource: 'Active Directory',
    department: 'Human Resources',
    initialGroups: ['Domain Users', 'HR Team'],
    status: 'Active'
  },
  {
    id: '3',
    username: 'mjohnson',
    fullName: 'Michael Johnson',
    createdDate: '2024-12-24',
    createdTime: '07:30 AM',
    createdBy: 'it.admin@contoso.com',
    creationSource: 'Server',
    serverName: 'SERVER-APP01',
    department: 'IT Operations',
    initialGroups: ['Local Users', 'App Operators'],
    status: 'Active'
  },
  {
    id: '4',
    username: 'ewilliams',
    fullName: 'Emily Williams',
    createdDate: '2024-12-23',
    createdTime: '04:20 PM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    department: 'Marketing',
    initialGroups: ['Domain Users', 'Marketing Team'],
    status: 'Active'
  },
  {
    id: '5',
    username: 'rbrown',
    fullName: 'Robert Brown',
    createdDate: '2024-12-23',
    createdTime: '03:15 PM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    department: 'Sales',
    initialGroups: ['Domain Users', 'Sales Team'],
    status: 'Active'
  },
  {
    id: '6',
    username: 'lgarcia',
    fullName: 'Linda Garcia',
    createdDate: '2024-12-23',
    createdTime: '02:45 PM',
    createdBy: 'server.admin@contoso.com',
    creationSource: 'Server',
    serverName: 'SERVER-DB01',
    department: 'Database Team',
    initialGroups: ['Local Users', 'DB Operators'],
    status: 'Active'
  },
  {
    id: '7',
    username: 'dmartinez',
    fullName: 'David Martinez',
    createdDate: '2024-12-23',
    createdTime: '01:30 PM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    department: 'Finance',
    initialGroups: ['Domain Users', 'Finance Team'],
    status: 'Active'
  },
  {
    id: '8',
    username: 'jlee',
    fullName: 'Jennifer Lee',
    createdDate: '2024-12-23',
    createdTime: '11:20 AM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    department: 'Legal',
    initialGroups: ['Domain Users', 'Legal Team'],
    status: 'Pending'
  },
  {
    id: '9',
    username: 'tclark',
    fullName: 'Thomas Clark',
    createdDate: '2024-12-22',
    createdTime: '05:10 PM',
    createdBy: 'it.admin@contoso.com',
    creationSource: 'Server',
    serverName: 'SERVER-WEB01',
    department: 'Web Team',
    initialGroups: ['Local Users', 'Web Admins'],
    status: 'Active'
  },
  {
    id: '10',
    username: 'kwalker',
    fullName: 'Karen Walker',
    createdDate: '2024-12-22',
    createdTime: '03:45 PM',
    createdBy: 'admin@contoso.com',
    creationSource: 'Active Directory',
    department: 'Operations',
    initialGroups: ['Domain Users', 'Operations Team'],
    status: 'Active'
  }
];

interface UserCreationActivityViewProps {
  onBack: () => void;
}

export function UserCreationActivityView({ onBack }: UserCreationActivityViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<'All' | 'Active Directory' | 'Server'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Pending'>('All');

  const filteredUsers = mockUserCreations.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.serverName && user.serverName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSource = filterSource === 'All' || user.creationSource === filterSource;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    
    return matchesSearch && matchesSource && matchesStatus;
  });

  const adCount = mockUserCreations.filter(u => u.creationSource === 'Active Directory').length;
  const serverCount = mockUserCreations.filter(u => u.creationSource === 'Server').length;
  const todayCount = mockUserCreations.filter(u => u.createdDate === '2024-12-24').length;

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
            <UserPlus className="text-blue-600" size={32} />
            <div>
              <h1>User Creation Activity</h1>
              <p className="text-sm text-gray-600">New users created at Active Directory and individual servers</p>
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
                <p className="text-sm text-gray-600">Total Users Created</p>
                <p className="text-2xl font-semibold text-blue-600">{mockUserCreations.length}</p>
              </div>
              <UserPlus className="text-blue-500" size={32} />
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
                <p className="text-2xl font-semibold text-purple-600">{adCount}</p>
              </div>
              <Network className="text-purple-500" size={32} />
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
                placeholder="Search users..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredUsers.length} of {mockUserCreations.length} users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Groups</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserPlus className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.createdDate}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {user.createdTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {user.creationSource === 'Active Directory' ? (
                          <>
                            <Network className="text-purple-600" size={16} />
                            <span className="text-sm text-gray-900">Active Directory</span>
                          </>
                        ) : (
                          <>
                            <Server className="text-orange-600" size={16} />
                            <div>
                              <div className="text-sm text-gray-900">Server</div>
                              <div className="text-xs text-gray-500">{user.serverName}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.initialGroups.map((group, idx) => (
                          <span key={idx} className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {group}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Security Monitoring</h3>
              <p className="text-sm text-blue-800">
                All user creation activities are monitored and logged for security compliance. New users created directly on servers are flagged for additional review to ensure proper authorization and group memberships.
              </p>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}