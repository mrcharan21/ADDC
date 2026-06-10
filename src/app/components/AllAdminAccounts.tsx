import { ArrowLeft, Search, Download, Eye, History, Shield, UserMinus, XCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AdminAccount {
  id: string;
  username: string;
  adminType: 'Domain Admin' | 'Endpoint Admin';
  ou: string;
  lastLogin: string;
  internetAccess: boolean;
  accountStatus: 'Enabled' | 'Disabled';
  passwordPosture: 'Expiry Set' | 'Never Expires';
  riskLevel: 'High' | 'Medium' | 'Low';
}

const mockAdminAccounts: AdminAccount[] = [
  {
    id: '1',
    username: 'domain.admin1',
    adminType: 'Domain Admin',
    ou: 'IT Security',
    lastLogin: '2024-12-22 14:30',
    internetAccess: true,
    accountStatus: 'Enabled',
    passwordPosture: 'Never Expires',
    riskLevel: 'High'
  },
  {
    id: '2',
    username: 'domain.admin2',
    adminType: 'Domain Admin',
    ou: 'IT Security',
    lastLogin: '2024-12-21 09:15',
    internetAccess: false,
    accountStatus: 'Enabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'High'
  },
  {
    id: '3',
    username: 'endpoint.admin1',
    adminType: 'Endpoint Admin',
    ou: 'IT Operations',
    lastLogin: '2024-12-23 11:45',
    internetAccess: true,
    accountStatus: 'Enabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'High'
  },
  {
    id: '4',
    username: 'endpoint.admin2',
    adminType: 'Endpoint Admin',
    ou: 'Server Admin',
    lastLogin: '2024-12-20 16:20',
    internetAccess: false,
    accountStatus: 'Enabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'Medium'
  },
  {
    id: '5',
    username: 'domain.svc.admin',
    adminType: 'Domain Admin',
    ou: 'IT Security',
    lastLogin: '2024-12-19 08:00',
    internetAccess: true,
    accountStatus: 'Enabled',
    passwordPosture: 'Never Expires',
    riskLevel: 'High'
  },
  {
    id: '6',
    username: 'server.admin1',
    adminType: 'Endpoint Admin',
    ou: 'Database Admin',
    lastLogin: '2024-12-22 13:30',
    internetAccess: false,
    accountStatus: 'Enabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'Medium'
  },
  {
    id: '7',
    username: 'network.admin',
    adminType: 'Endpoint Admin',
    ou: 'Network Admin',
    lastLogin: '2024-12-23 10:00',
    internetAccess: true,
    accountStatus: 'Enabled',
    passwordPosture: 'Never Expires',
    riskLevel: 'High'
  },
  {
    id: '8',
    username: 'endpoint.admin.old',
    adminType: 'Endpoint Admin',
    ou: 'Engineering',
    lastLogin: '2024-11-15 14:20',
    internetAccess: false,
    accountStatus: 'Disabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'Low'
  },
  {
    id: '9',
    username: 'db.admin.prod',
    adminType: 'Endpoint Admin',
    ou: 'Database Admin',
    lastLogin: '2024-12-22 15:45',
    internetAccess: false,
    accountStatus: 'Enabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'Medium'
  },
  {
    id: '10',
    username: 'domain.backup.admin',
    adminType: 'Domain Admin',
    ou: 'IT Operations',
    lastLogin: '2024-12-18 07:30',
    internetAccess: false,
    accountStatus: 'Enabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'High'
  },
  {
    id: '11',
    username: 'security.admin',
    adminType: 'Domain Admin',
    ou: 'IT Security',
    lastLogin: '2024-12-23 09:00',
    internetAccess: true,
    accountStatus: 'Enabled',
    passwordPosture: 'Never Expires',
    riskLevel: 'High'
  },
  {
    id: '12',
    username: 'local.server.admin',
    adminType: 'Endpoint Admin',
    ou: 'Server Admin',
    lastLogin: '2024-12-21 12:15',
    internetAccess: false,
    accountStatus: 'Enabled',
    passwordPosture: 'Expiry Set',
    riskLevel: 'Low'
  }
];

interface AllAdminAccountsProps {
  onBack: () => void;
  initialFilter?: string;
}

export function AllAdminAccounts({ onBack, initialFilter }: AllAdminAccountsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterAdminType, setFilterAdminType] = useState(
    initialFilter === 'domain' ? 'Domain Admin' :
    initialFilter === 'endpoint' ? 'Endpoint Admin' :
    'All'
  );
  const [filterOU, setFilterOU] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterInternetAccess, setFilterInternetAccess] = useState('All');
  const [filterRiskLevel, setFilterRiskLevel] = useState('All');
  const [sortBy, setSortBy] = useState<string>('riskLevel');

  const filteredAccounts = mockAdminAccounts
    .filter(account => {
      const matchesSearch = 
        account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.ou.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.adminType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAdminType = filterAdminType === 'All' || account.adminType === filterAdminType;
      const matchesOU = filterOU === 'All' || account.ou === filterOU;
      const matchesStatus = filterStatus === 'All' || account.accountStatus === filterStatus;
      const matchesInternet = filterInternetAccess === 'All' || 
        (filterInternetAccess === 'Yes' && account.internetAccess) ||
        (filterInternetAccess === 'No' && !account.internetAccess);
      const matchesRisk = filterRiskLevel === 'All' || account.riskLevel === filterRiskLevel;
      
      return matchesSearch && matchesAdminType && matchesOU && matchesStatus && matchesInternet && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'riskLevel') {
        const riskOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      } else if (sortBy === 'lastLogin') {
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      } else if (sortBy === 'adminType') {
        return a.adminType.localeCompare(b.adminType);
      }
      return 0;
    });

  const getPageTitle = () => {
    if (initialFilter === 'domain') return 'All Domain Admin Accounts';
    if (initialFilter === 'endpoint') return 'All Endpoint Admin Accounts';
    return 'All Admin Accounts';
  };

  const uniqueOUs = Array.from(new Set(mockAdminAccounts.map(a => a.ou)));

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
            <span className="hover:text-blue-600 cursor-pointer">Admin Accounts Distribution</span>
            <span>/</span>
            <span className="text-gray-900">Admin Accounts</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-purple-600" size={32} />
              <div>
                <h1>{getPageTitle()}</h1>
                <p className="text-sm text-gray-600">Authoritative inventory of privileged administrative accounts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Accounts</p>
                <p className="text-xl font-semibold text-gray-900">{filteredAccounts.length}</p>
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
              placeholder="Search by username, OU, or role..."
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
                  value={filterAdminType}
                  onChange={(e) => setFilterAdminType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Admin Types</option>
                  <option value="Domain Admin">Domain Admin</option>
                  <option value="Endpoint Admin">Endpoint Admin</option>
                </select>

                <select
                  value={filterOU}
                  onChange={(e) => setFilterOU(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All OUs / Departments</option>
                  {uniqueOUs.map(ou => (
                    <option key={ou} value={ou}>{ou}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Account Status</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={filterInternetAccess}
                  onChange={(e) => setFilterInternetAccess(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Internet Access</option>
                  <option value="Yes">With Internet Access</option>
                  <option value="No">No Internet Access</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="riskLevel">Sort by Risk Level</option>
                  <option value="lastLogin">Sort by Last Login</option>
                  <option value="adminType">Sort by Admin Type</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU / Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internet Access</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password Posture</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{account.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.adminType === 'Domain Admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {account.adminType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.ou}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {account.internetAccess ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.accountStatus === 'Enabled' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.passwordPosture === 'Never Expires' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {account.passwordPosture}
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
          Showing {filteredAccounts.length} of {mockAdminAccounts.length} admin accounts
        </div>
      </main>
    </div>
  );
}