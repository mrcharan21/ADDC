import { ArrowLeft, Search, Download, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PaginationControls } from './PaginationControls';

interface NormalUser {
  id: string;
  username: string;
  displayName: string;
  department: string;
  email: string;
  mfaStatus: 'Enabled' | 'Disabled';
  lastLogin: string;
  accountStatus: 'Active' | 'Inactive' | 'Locked';
  accountType: 'Standard User' | 'Guest';
}

const mockNormalUsers: NormalUser[] = [
  {
    id: '1',
    username: 'jdoe',
    displayName: 'Jane Doe',
    department: 'Finance',
    email: 'jane.doe@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 09:15 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '2',
    username: 'bsmith',
    displayName: 'Bob Smith',
    department: 'Sales',
    email: 'bob.smith@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 08:30 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '3',
    username: 'awhite',
    displayName: 'Alice White',
    department: 'Marketing',
    email: 'alice.white@company.local',
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-21 05:45 PM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '4',
    username: 'cjohnson',
    displayName: 'Chris Johnson',
    department: 'Engineering',
    email: 'chris.johnson@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 10:20 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '5',
    username: 'mwilliams',
    displayName: 'Mary Williams',
    department: 'HR',
    email: 'mary.williams@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 09:00 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '6',
    username: 'djones',
    displayName: 'Daniel Jones',
    department: 'Finance',
    email: 'daniel.jones@company.local',
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-20 03:30 PM',
    accountStatus: 'Inactive',
    accountType: 'Standard User'
  },
  {
    id: '7',
    username: 'lbrown',
    displayName: 'Laura Brown',
    department: 'Sales',
    email: 'laura.brown@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 11:00 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '8',
    username: 'rdavis',
    displayName: 'Richard Davis',
    department: 'Engineering',
    email: 'richard.davis@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 08:45 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '9',
    username: 'smiller',
    displayName: 'Susan Miller',
    department: 'Marketing',
    email: 'susan.miller@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 10:15 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '10',
    username: 'gwilson',
    displayName: 'George Wilson',
    department: 'Finance',
    email: 'george.wilson@company.local',
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-19 02:20 PM',
    accountStatus: 'Locked',
    accountType: 'Standard User'
  },
  {
    id: '11',
    username: 'pmoore',
    displayName: 'Patricia Moore',
    department: 'HR',
    email: 'patricia.moore@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 09:30 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '12',
    username: 'jtaylor',
    displayName: 'James Taylor',
    department: 'Sales',
    email: 'james.taylor@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 07:50 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '13',
    username: 'kanderson',
    displayName: 'Karen Anderson',
    department: 'Marketing',
    email: 'karen.anderson@company.local',
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-21 04:15 PM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '14',
    username: 'gthomas',
    displayName: 'Gary Thomas',
    department: 'Engineering',
    email: 'gary.thomas@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 11:30 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '15',
    username: 'njackson',
    displayName: 'Nancy Jackson',
    department: 'Finance',
    email: 'nancy.jackson@company.local',
    mfaStatus: 'Enabled',
    lastLogin: '2024-12-22 08:10 AM',
    accountStatus: 'Active',
    accountType: 'Standard User'
  },
  {
    id: '16',
    username: 'guest.contractor1',
    displayName: 'Contractor Guest',
    department: 'Engineering',
    email: 'guest1@company.local',
    mfaStatus: 'Disabled',
    lastLogin: '2024-12-18 11:00 AM',
    accountStatus: 'Active',
    accountType: 'Guest'
  }
];

interface AllNormalUsersProps {
  onBack: () => void;
}

export function AllNormalUsers({ onBack }: AllNormalUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [filterMFA, setFilterMFA] = useState<string>('Enabled');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterAccountType, setFilterAccountType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('lastLogin');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers = mockNormalUsers
    .filter(user => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = filterDepartment === 'All' || user.department === filterDepartment;
      const matchesMFA = user.mfaStatus === filterMFA;
      const matchesStatus = filterStatus === 'All' || user.accountStatus === filterStatus;
      const matchesAccountType = filterAccountType === 'All' || user.accountType === filterAccountType;

      return matchesSearch && matchesDepartment && matchesMFA && matchesStatus && matchesAccountType;
    })
    .sort((a, b) => {
      if (sortBy === 'lastLogin') {
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      } else if (sortBy === 'username') {
        return a.username.localeCompare(b.username);
      } else if (sortBy === 'department') {
        return a.department.localeCompare(b.department);
      }
      return 0;
    });
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const pageStartIndex = (currentPage - 1) * usersPerPage;
  const pageEndIndex = pageStartIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(pageStartIndex, pageEndIndex);
  const visibleStart = filteredUsers.length === 0 ? 0 : pageStartIndex + 1;
  const visibleEnd = Math.min(pageEndIndex, filteredUsers.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterMFA, filterStatus, filterAccountType, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const uniqueDepartments = Array.from(new Set(mockNormalUsers.map(u => u.department)));

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
            <span className="text-gray-900">All Normal Users</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-green-600" size={32} />
              <div>
                <h1>All Normal Users</h1>
                <p className="text-sm text-gray-600">Standard user accounts without elevated privileges</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Normal Users</p>
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
              placeholder="Search by username, name, department, or email..."
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
              value={filterMFA}
              onChange={(e) => setFilterMFA(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
              <option value="Locked">Locked</option>
            </select>

            <select
              value={filterAccountType}
              onChange={(e) => setFilterAccountType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Account Types</option>
              <option value="Standard User">Standard User</option>
              <option value="Guest">Guest</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lastLogin">Sort by Last Login</option>
              <option value="username">Sort by Username</option>
              <option value="department">Sort by Department</option>
            </select>
          </div>
        </div>

        {/* Main Data Table */}
        <div id="normal-users-table" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-6">
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="text-green-600" size={20} />
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.accountType === 'Standard User' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                        {user.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.accountStatus === 'Active' ? 'bg-green-100 text-green-800' :
                          user.accountStatus === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
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
          Showing {visibleStart}-{visibleEnd} of {filteredUsers.length} normal users
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollTargetId="normal-users-table"
        />
      </main>
    </div>
  );
}
