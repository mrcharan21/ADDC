import { ArrowLeft, Search, Download, Shield, Eye, FileText, Globe, Lock, UserMinus, XCircle } from 'lucide-react';
import { useState } from 'react';

interface PrivilegedUser {
  id: string;
  username: string;
  displayName: string;
  department: string;
  privilegeType: string;
  internetAccess: boolean;
  mfaStatus: 'Enabled' | 'Disabled';
  lastLogin: string;
  accountStatus: 'Active' | 'Inactive';
  riskLevel: 'High' | 'Medium' | 'Low';
}

const mockPrivilegedUsers: PrivilegedUser[] = [
  {
    id: '1',
    username: 'admin.smith',
    displayName: 'John Smith',
    department: 'IT Security',
    privilegeType: 'Domain Admin',
    internetAccess: false,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 09:30 AM',
    accountStatus: 'Active',
    riskLevel: 'Low'
  },
  {
    id: '2',
    username: 'db.admin.jones',
    displayName: 'Sarah Jones',
    department: 'Database Admin',
    privilegeType: 'Database Admin',
    internetAccess: true,
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-21 02:15 PM',
    accountStatus: 'Active',
    riskLevel: 'High'
  },
  {
    id: '3',
    username: 'net.admin.wilson',
    displayName: 'Mike Wilson',
    department: 'Network Team',
    privilegeType: 'Network Admin',
    internetAccess: true,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 11:00 AM',
    accountStatus: 'Active',
    riskLevel: 'Medium'
  },
  {
    id: '4',
    username: 'sys.admin.brown',
    displayName: 'Emily Brown',
    department: 'IT Operations',
    privilegeType: 'System Admin',
    internetAccess: false,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 08:45 AM',
    accountStatus: 'Active',
    riskLevel: 'Low'
  },
  {
    id: '5',
    username: 'backup.admin.taylor',
    displayName: 'David Taylor',
    department: 'IT Operations',
    privilegeType: 'Backup Operator',
    internetAccess: false,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-21 11:20 PM',
    accountStatus: 'Active',
    riskLevel: 'Low'
  },
  {
    id: '6',
    username: 'helpdesk.lead.anderson',
    displayName: 'Lisa Anderson',
    department: 'IT Support',
    privilegeType: 'Helpdesk Admin',
    internetAccess: true,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 10:15 AM',
    accountStatus: 'Active',
    riskLevel: 'Medium'
  },
  {
    id: '7',
    username: 'server.admin.martinez',
    displayName: 'Carlos Martinez',
    department: 'IT Operations',
    privilegeType: 'Server Admin',
    internetAccess: true,
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-20 04:30 PM',
    accountStatus: 'Active',
    riskLevel: 'High'
  },
  {
    id: '8',
    username: 'sharepoint.admin.garcia',
    displayName: 'Maria Garcia',
    department: 'IT Security',
    privilegeType: 'SharePoint Admin',
    internetAccess: false,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 09:00 AM',
    accountStatus: 'Active',
    riskLevel: 'Low'
  },
  {
    id: '9',
    username: 'exchange.admin.lee',
    displayName: 'Kevin Lee',
    department: 'IT Operations',
    privilegeType: 'Exchange Admin',
    internetAccess: true,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 07:45 AM',
    accountStatus: 'Active',
    riskLevel: 'Medium'
  },
  {
    id: '10',
    username: 'security.admin.white',
    displayName: 'Jennifer White',
    department: 'IT Security',
    privilegeType: 'Security Admin',
    internetAccess: false,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 10:30 AM',
    accountStatus: 'Active',
    riskLevel: 'Low'
  },
  {
    id: '11',
    username: 'app.admin.clark',
    displayName: 'Robert Clark',
    department: 'Engineering',
    privilegeType: 'Application Admin',
    internetAccess: true,
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-19 03:20 PM',
    accountStatus: 'Active',
    riskLevel: 'High'
  },
  {
    id: '12',
    username: 'dev.admin.hall',
    displayName: 'Amanda Hall',
    department: 'Engineering',
    privilegeType: 'Development Admin',
    internetAccess: true,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 11:15 AM',
    accountStatus: 'Active',
    riskLevel: 'Medium'
  },
  {
    id: '13',
    username: 'sql.admin.allen',
    displayName: 'Thomas Allen',
    department: 'Database Admin',
    privilegeType: 'SQL Admin',
    internetAccess: false,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-21 06:50 PM',
    accountStatus: 'Active',
    riskLevel: 'Low'
  },
  {
    id: '14',
    username: 'vpn.admin.young',
    displayName: 'Michelle Young',
    department: 'Network Team',
    privilegeType: 'VPN Admin',
    internetAccess: true,
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 08:00 AM',
    accountStatus: 'Active',
    riskLevel: 'Medium'
  },
  {
    id: '15',
    username: 'legacy.admin.king',
    displayName: 'Paul King',
    department: 'IT Operations',
    privilegeType: 'System Admin',
    internetAccess: true,
    mfaStatus: 'Disabled',
    lastLogin: '2024-11-15 01:30 PM',
    accountStatus: 'Inactive',
    riskLevel: 'High'
  }
];

interface AllPrivilegedUsersProps {
  onBack: () => void;
  initialFilter?: string;
}

export function AllPrivilegedUsers({ onBack, initialFilter }: AllPrivilegedUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrivilegeType, setFilterPrivilegeType] = useState<string>('All');
  const [filterInternetAccess, setFilterInternetAccess] = useState<string>(
    initialFilter === 'internet' ? 'Yes' : 'All'
  );
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [filterRisk, setFilterRisk] = useState<string>(
    initialFilter === 'high-risk' ? 'High' : 'All'
  );
  const [filterMFA, setFilterMFA] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('riskLevel');

  const filteredUsers = mockPrivilegedUsers
    .filter(user => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.privilegeType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrivilegeType = filterPrivilegeType === 'All' || user.privilegeType === filterPrivilegeType;
      const matchesInternetAccess = filterInternetAccess === 'All' ||
        (filterInternetAccess === 'Yes' && user.internetAccess) ||
        (filterInternetAccess === 'No' && !user.internetAccess);
      const matchesDepartment = filterDepartment === 'All' || user.department === filterDepartment;
      const matchesRisk = filterRisk === 'All' || user.riskLevel === filterRisk;
      const matchesMFA = filterMFA === 'All' || user.mfaStatus === filterMFA;
      const matchesStatus = filterStatus === 'All' || user.accountStatus === filterStatus;

      return matchesSearch && matchesPrivilegeType && matchesInternetAccess &&
        matchesDepartment && matchesRisk && matchesMFA && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'riskLevel') {
        const riskOrder = { High: 0, Medium: 1, Low: 2 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      } else if (sortBy === 'lastLogin') {
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      } else if (sortBy === 'privilegeType') {
        return a.privilegeType.localeCompare(b.privilegeType);
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

  const uniqueDepartments = Array.from(new Set(mockPrivilegedUsers.map(u => u.department)));
  const uniquePrivilegeTypes = Array.from(new Set(mockPrivilegedUsers.map(u => u.privilegeType)));

  // Determine the heading based on the filter
  const getHeading = () => {
    if (initialFilter === 'internet') {
      return 'Privileged users with internet access';
    } else if (initialFilter === 'high-risk') {
      return 'High-Risk Privileged Users';
    }
    return 'All Privileged Users';
  };

  const getBreadcrumb = () => {
    if (initialFilter === 'internet') {
      return 'Privileged users with internet access';
    } else if (initialFilter === 'high-risk') {
      return 'High-Risk Privileged Users';
    }
    return 'All Privileged Users';
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
            <span>Back to Overview</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">User Privileges Distribution</span>
            <span>/</span>
            <span className="text-gray-900">{getBreadcrumb()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-600" size={32} />
              <div>
                <h1>{getHeading()}</h1>
                <p className="text-sm text-gray-600">Administrative and elevated access inventory</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Privileged</p>
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
              placeholder="Search by username, department, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={filterPrivilegeType}
              onChange={(e) => setFilterPrivilegeType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Privilege Types</option>
              {uniquePrivilegeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filterInternetAccess}
              onChange={(e) => setFilterInternetAccess(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Internet Access: All</option>
              <option value="Yes">Has Internet Access</option>
              <option value="No">No Internet Access</option>
            </select>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filterMFA}
              onChange={(e) => setFilterMFA(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All MFA Status</option>
              <option value="Enabled">MFA Enabled</option>
              <option value="Disabled">MFA Disabled</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Account Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="riskLevel">Sort by Risk</option>
              <option value="lastLogin">Sort by Last Login</option>
              <option value="privilegeType">Sort by Privilege Type</option>
            </select>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privilege Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.displayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {user.privilegeType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.internetAccess ? (
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
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
          Showing {filteredUsers.length} of {mockPrivilegedUsers.length} privileged users
        </div>
      </main>
    </div>
  );
}