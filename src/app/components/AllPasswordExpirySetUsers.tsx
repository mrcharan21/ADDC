import { ArrowLeft, Search, Download, Clock, Eye, KeyRound, Mail, XCircle, FileText, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ExpiryUser {
  id: string;
  username: string;
  displayName: string;
  accountType: string;
  privilegeLevel: string;
  ou: string;
  passwordLastSet: string;
  passwordExpiry: string;
  daysRemaining: number;
  accountStatus: 'Enabled' | 'Disabled';
  riskLevel: 'High' | 'Medium' | 'Low';
}

const mockExpiryUsers: ExpiryUser[] = [
  {
    id: '1',
    username: 'expired.user1',
    displayName: 'John Expired',
    accountType: 'User',
    privilegeLevel: 'Normal',
    ou: 'Sales',
    passwordLastSet: '2024-09-10',
    passwordExpiry: '2024-12-10',
    daysRemaining: -12,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '2',
    username: 'urgent.user2',
    displayName: 'Sarah Urgent',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'IT Security',
    passwordLastSet: '2024-09-18',
    passwordExpiry: '2024-12-18',
    daysRemaining: 4,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '3',
    username: 'warning.user3',
    displayName: 'Mike Warning',
    accountType: 'User',
    privilegeLevel: 'Normal',
    ou: 'Finance',
    passwordLastSet: '2024-08-25',
    passwordExpiry: '2024-12-25',
    daysRemaining: 3,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '4',
    username: 'soon.user4',
    displayName: 'Emily Soon',
    accountType: 'User',
    privilegeLevel: 'Normal',
    ou: 'Marketing',
    passwordLastSet: '2024-08-10',
    passwordExpiry: '2024-12-30',
    daysRemaining: 8,
    accountStatus: 'Enabled',
    riskLevel: 'Medium'
  },
  {
    id: '5',
    username: 'monitor.user5',
    displayName: 'David Monitor',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'Engineering',
    passwordLastSet: '2024-08-15',
    passwordExpiry: '2025-01-05',
    daysRemaining: 14,
    accountStatus: 'Enabled',
    riskLevel: 'Medium'
  },
  {
    id: '6',
    username: 'safe.user6',
    displayName: 'Lisa Safe',
    accountType: 'User',
    privilegeLevel: 'Normal',
    ou: 'HR',
    passwordLastSet: '2024-07-20',
    passwordExpiry: '2025-01-15',
    daysRemaining: 24,
    accountStatus: 'Enabled',
    riskLevel: 'Medium'
  },
  {
    id: '7',
    username: 'good.user7',
    displayName: 'Robert Good',
    accountType: 'User',
    privilegeLevel: 'Normal',
    ou: 'Sales',
    passwordLastSet: '2024-07-01',
    passwordExpiry: '2025-02-05',
    daysRemaining: 45,
    accountStatus: 'Enabled',
    riskLevel: 'Low'
  },
  {
    id: '8',
    username: 'healthy.user8',
    displayName: 'Amanda Healthy',
    accountType: 'Service Account',
    privilegeLevel: 'Normal',
    ou: 'IT Operations',
    passwordLastSet: '2024-06-15',
    passwordExpiry: '2025-02-20',
    daysRemaining: 60,
    accountStatus: 'Enabled',
    riskLevel: 'Low'
  },
  {
    id: '9',
    username: 'expired.admin',
    displayName: 'Thomas Expired Admin',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'Database Admin',
    passwordLastSet: '2024-09-05',
    passwordExpiry: '2024-12-05',
    daysRemaining: -17,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '10',
    username: 'critical.user',
    displayName: 'Michelle Critical',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'IT Security',
    passwordLastSet: '2024-09-20',
    passwordExpiry: '2024-12-20',
    daysRemaining: 2,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  }
];

interface AllPasswordExpirySetUsersProps {
  onBack: () => void;
  initialFilter?: string;
}

export function AllPasswordExpirySetUsers({ onBack, initialFilter }: AllPasswordExpirySetUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterAccountType, setFilterAccountType] = useState('All');
  const [filterPrivilegeLevel, setFilterPrivilegeLevel] = useState('All');
  const [filterOU, setFilterOU] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterExpiryWindow, setFilterExpiryWindow] = useState<string>(
    initialFilter === 'expired' ? 'Expired' :
    initialFilter === '7days' ? '≤7 days' :
    initialFilter === '30days' ? '8-30 days' :
    'All'
  );
  const [sortBy, setSortBy] = useState<string>('daysRemaining');

  const filteredUsers = mockExpiryUsers
    .filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.ou.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAccountType = filterAccountType === 'All' || user.accountType === filterAccountType;
      const matchesPrivilege = filterPrivilegeLevel === 'All' || user.privilegeLevel === filterPrivilegeLevel;
      const matchesOU = filterOU === 'All' || user.ou === filterOU;
      const matchesStatus = filterStatus === 'All' || user.accountStatus === filterStatus;
      
      let matchesExpiryWindow = true;
      if (filterExpiryWindow === 'Expired') {
        matchesExpiryWindow = user.daysRemaining < 0;
      } else if (filterExpiryWindow === '≤7 days') {
        matchesExpiryWindow = user.daysRemaining >= 0 && user.daysRemaining <= 7;
      } else if (filterExpiryWindow === '8-30 days') {
        matchesExpiryWindow = user.daysRemaining >= 8 && user.daysRemaining <= 30;
      } else if (filterExpiryWindow === '30+ days') {
        matchesExpiryWindow = user.daysRemaining > 30;
      }
      
      return matchesSearch && matchesAccountType && matchesPrivilege && matchesOU && matchesStatus && matchesExpiryWindow;
    })
    .sort((a, b) => {
      if (sortBy === 'daysRemaining') {
        return a.daysRemaining - b.daysRemaining;
      } else if (sortBy === 'username') {
        return a.username.localeCompare(b.username);
      } else if (sortBy === 'ou') {
        return a.ou.localeCompare(b.ou);
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

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-red-700 font-semibold';
    if (days <= 7) return 'text-orange-700 font-semibold';
    if (days <= 30) return 'text-yellow-700 font-medium';
    return 'text-green-700';
  };

  const uniqueOUs = Array.from(new Set(mockExpiryUsers.map(u => u.ou)));

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
            <span>Back to Overview</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">Password Expiration Analysis</span>
            <span>/</span>
            <span className="text-gray-900">All Password Expiry Set Users</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={32} />
              <div>
                <h1>All Password Expiry Set Users</h1>
                <p className="text-sm text-gray-600">Complete inventory of users with password expiration configured</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-semibold text-gray-900">{filteredUsers.length}</p>
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
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by username, name, or OU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Filters</span>
            <ChevronDown className={`text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} size={20} />
          </button>
          
          {showFilters && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
                <select
                  value={filterAccountType}
                  onChange={(e) => setFilterAccountType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Account Types</option>
                  <option value="User">User</option>
                  <option value="Service Account">Service Account</option>
                </select>

                <select
                  value={filterPrivilegeLevel}
                  onChange={(e) => setFilterPrivilegeLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Privilege Levels</option>
                  <option value="Normal">Normal</option>
                  <option value="Admin">Admin</option>
                </select>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Account Status</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>

                <select
                  value={filterExpiryWindow}
                  onChange={(e) => setFilterExpiryWindow(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Expiry Windows</option>
                  <option value="Expired">Expired</option>
                  <option value="≤7 days">≤7 days</option>
                  <option value="8-30 days">8-30 days</option>
                  <option value="30+ days">30+ days</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daysRemaining">Sort by Days Remaining</option>
                  <option value="username">Sort by Username</option>
                  <option value="ou">Sort by OU</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privilege</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password Last Set</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Remaining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.displayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.accountType === 'Service Account' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.privilegeLevel === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.privilegeLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.ou}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.passwordLastSet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.passwordExpiry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getDaysRemainingColor(user.daysRemaining)}>
                        {user.daysRemaining < 0 ? `Expired ${Math.abs(user.daysRemaining)} days ago` : `${user.daysRemaining} days`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.accountStatus === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.accountStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredUsers.length} of {mockExpiryUsers.length} users with password expiry configured
        </div>
      </main>
    </div>
  );
}
