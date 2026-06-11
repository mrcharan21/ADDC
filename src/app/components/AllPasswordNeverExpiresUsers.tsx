import { ArrowLeft, Search, Download, Clock, ChevronDown, Eye, ShieldCheck, ShieldX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface User {
  id: string;
  username: string;
  displayName: string;
  accountType: string;
  privilegeLevel: string;
  ou: string;
  passwordLastSet: string;
  passwordExpiry: string;
  passwordAgeDays: number;
  exceptionApproved: boolean;
  accountStatus: 'Enabled' | 'Disabled';
  riskLevel: 'High' | 'Medium' | 'Low';
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'svc_backup',
    displayName: 'Backup Service Account',
    accountType: 'Service Account',
    privilegeLevel: 'Admin',
    ou: 'Service Accounts',
    passwordLastSet: '2022-03-15',
    passwordExpiry: 'Never',
    passwordAgeDays: 1012,
    exceptionApproved: true,
    accountStatus: 'Enabled',
    riskLevel: 'Medium'
  },
  {
    id: '2',
    username: 'admin.legacy',
    displayName: 'Legacy Admin Account',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'IT Security',
    passwordLastSet: '2021-08-20',
    passwordExpiry: 'Never',
    passwordAgeDays: 1220,
    exceptionApproved: false,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '3',
    username: 'svc_monitoring',
    displayName: 'Monitoring Service',
    accountType: 'Service Account',
    privilegeLevel: 'Normal',
    ou: 'IT Operations',
    passwordLastSet: '2023-01-10',
    passwordExpiry: 'Never',
    passwordAgeDays: 712,
    exceptionApproved: true,
    accountStatus: 'Enabled',
    riskLevel: 'Low'
  },
  {
    id: '4',
    username: 'db.admin.prod',
    displayName: 'Production DB Admin',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'Database Admin',
    passwordLastSet: '2022-06-15',
    passwordExpiry: 'Never',
    passwordAgeDays: 920,
    exceptionApproved: true,
    accountStatus: 'Enabled',
    riskLevel: 'Medium'
  },
  {
    id: '5',
    username: 'test.admin',
    displayName: 'Test Environment Admin',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'Engineering',
    passwordLastSet: '2023-06-20',
    passwordExpiry: 'Never',
    passwordAgeDays: 550,
    exceptionApproved: false,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '6',
    username: 'svc_integration',
    displayName: 'Integration Service',
    accountType: 'Service Account',
    privilegeLevel: 'Normal',
    ou: 'IT Operations',
    passwordLastSet: '2023-09-01',
    passwordExpiry: 'Never',
    passwordAgeDays: 477,
    exceptionApproved: true,
    accountStatus: 'Enabled',
    riskLevel: 'Low'
  },
  {
    id: '7',
    username: 'finance.admin',
    displayName: 'Finance Administrator',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'Finance',
    passwordLastSet: '2023-03-10',
    passwordExpiry: 'Never',
    passwordAgeDays: 652,
    exceptionApproved: false,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '8',
    username: 'svc_reporting',
    displayName: 'Reporting Service Account',
    accountType: 'Service Account',
    privilegeLevel: 'Normal',
    ou: 'Finance',
    passwordLastSet: '2023-11-15',
    passwordExpiry: 'Never',
    passwordAgeDays: 402,
    exceptionApproved: true,
    accountStatus: 'Enabled',
    riskLevel: 'Low'
  },
  {
    id: '9',
    username: 'sec.admin.old',
    displayName: 'Old Security Admin',
    accountType: 'User',
    privilegeLevel: 'Admin',
    ou: 'IT Security',
    passwordLastSet: '2021-12-01',
    passwordExpiry: 'Never',
    passwordAgeDays: 1117,
    exceptionApproved: false,
    accountStatus: 'Enabled',
    riskLevel: 'High'
  },
  {
    id: '10',
    username: 'svc_sql_backup',
    displayName: 'SQL Backup Service',
    accountType: 'Service Account',
    privilegeLevel: 'Admin',
    ou: 'Database Admin',
    passwordLastSet: '2022-09-10',
    passwordExpiry: 'Never',
    passwordAgeDays: 832,
    exceptionApproved: true,
    accountStatus: 'Enabled',
    riskLevel: 'Medium'
  }
];

interface AllPasswordNeverExpiresUsersProps {
  onBack: () => void;
  initialFilter?: string;
}

export function AllPasswordNeverExpiresUsers({ onBack, initialFilter }: AllPasswordNeverExpiresUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAccountType, setFilterAccountType] = useState('All');
  const [filterPrivilegeLevel, setFilterPrivilegeLevel] = useState(
    initialFilter === 'privileged' ? 'Admin' : 'All'
  );
  const [filterOU, setFilterOU] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterException, setFilterException] = useState('All');
  const [filterPasswordAge, setFilterPasswordAge] = useState(
    initialFilter === 'highrisk' ? '>365 days' : 'All'
  );
  const [sortBy, setSortBy] = useState<string>('passwordAgeDays');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const usersPerPage = 5;
  const tableTopRef = useRef<HTMLDivElement | null>(null);

  // Apply initial filter
  useState(() => {
    if (initialFilter === 'service') {
      setFilterAccountType('Service Account');
    }
  });

  const updateExceptionApproval = (userId: string, approved: boolean) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, exceptionApproved: approved } : user
      )
    );
    setOpenActionMenuId(null);
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.ou.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAccountType = filterAccountType === 'All' || user.accountType === filterAccountType;
      const matchesPrivilege = filterPrivilegeLevel === 'All' || user.privilegeLevel === filterPrivilegeLevel;
      const matchesOU = filterOU === 'All' || user.ou === filterOU;
      const matchesStatus = filterStatus === 'All' || user.accountStatus === filterStatus;
      const matchesException = filterException === 'All' || 
        (filterException === 'Yes' && user.exceptionApproved) ||
        (filterException === 'No' && !user.exceptionApproved);
      
      let matchesPasswordAge = true;
      if (filterPasswordAge === '>365 days') {
        matchesPasswordAge = user.passwordAgeDays > 365;
      } else if (filterPasswordAge === '181-365 days') {
        matchesPasswordAge = user.passwordAgeDays >= 181 && user.passwordAgeDays <= 365;
      } else if (filterPasswordAge === '91-180 days') {
        matchesPasswordAge = user.passwordAgeDays >= 91 && user.passwordAgeDays <= 180;
      } else if (filterPasswordAge === '0-90 days') {
        matchesPasswordAge = user.passwordAgeDays <= 90;
      }
      
      return matchesSearch && matchesAccountType && matchesPrivilege && matchesOU && matchesStatus && matchesException && matchesPasswordAge;
    })
    .sort((a, b) => {
      if (sortBy === 'passwordAgeDays') {
        return b.passwordAgeDays - a.passwordAgeDays;
      } else if (sortBy === 'username') {
        return a.username.localeCompare(b.username);
      } else if (sortBy === 'ou') {
        return a.ou.localeCompare(b.ou);
      }
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const pageStartIndex = (currentPage - 1) * usersPerPage;
  const pageEndIndex = pageStartIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(pageStartIndex, pageEndIndex);
  const visibleStart = filteredUsers.length === 0 ? 0 : pageStartIndex + 1;
  const visibleEnd = Math.min(pageEndIndex, filteredUsers.length);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPasswordAgeColor = (days: number) => {
    if (days > 365) return 'text-red-700 font-semibold';
    if (days > 180) return 'text-orange-700 font-semibold';
    if (days > 90) return 'text-yellow-700 font-medium';
    return 'text-green-700';
  };

  const getExceptionApprovalColor = (approved: boolean) => {
    return approved
      ? 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200'
      : 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200';
  };

  const uniqueOUs = Array.from(new Set(users.map(u => u.ou)));

  useEffect(() => {
    setCurrentPage(1);
    setOpenActionMenuId(null);
  }, [searchTerm, filterAccountType, filterPrivilegeLevel, filterOU, filterStatus, filterException, filterPasswordAge, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setOpenActionMenuId(null);
  }, [currentPage]);

  useEffect(() => {
    if (filteredUsers.length === 0) return;
    tableTopRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [currentPage]);

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
            <span className="text-gray-900">All Password Never Expires Users</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-red-600" size={32} />
              <div>
                <h1>All Password Never Expires Users</h1>
                <p className="text-sm text-gray-600">Complete inventory of users with password expiration disabled</p>
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
                  value={filterException}
                  onChange={(e) => setFilterException(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">Exception Status</option>
                  <option value="Yes">Approved</option>
                  <option value="No">Not Approved</option>
                </select>

                <select
                  value={filterPasswordAge}
                  onChange={(e) => setFilterPasswordAge(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Password Ages</option>
                  <option value=">365 days">&gt;365 days</option>
                  <option value="181-365 days">181-365 days</option>
                  <option value="91-180 days">91-180 days</option>
                  <option value="0-90 days">0-90 days</option>
                </select>
              </div>

              <div className="mt-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="passwordAgeDays">Sort by Password Age (Oldest First)</option>
                  <option value="username">Sort by Username</option>
                  <option value="ou">Sort by OU</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Main Data Table */}
        <div
          id="password-never-expires-table"
          ref={tableTopRef}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible mb-8 scroll-mt-6"
        >
          <div className="overflow-x-auto">
              <table className="w-full min-w-[1280px]">
              <colgroup>
                <col className="w-[14%]" />
                <col className="w-[18%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[14%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privilege</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password Last Set</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age (Days)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exception Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getPasswordAgeColor(user.passwordAgeDays)}>
                        {user.passwordAgeDays} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getExceptionApprovalColor(user.exceptionApproved)}>
                        {user.exceptionApproved ? 'Approved' : 'Not Approved'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.accountStatus === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionMenuId((current) => (current === user.id ? null : user.id))
                        }
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        aria-label="Open exception actions"
                      >
                        <Eye size={16} />
                      </button>
                      {openActionMenuId === user.id && (
                        <div className="absolute right-6 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateExceptionApproval(user.id, true)}
                            className="w-full px-4 py-3 flex items-center gap-2 text-sm text-left text-green-700 hover:bg-green-50 transition-colors"
                          >
                            <ShieldCheck size={16} />
                            Approve Exception
                          </button>
                          <button
                            type="button"
                            onClick={() => updateExceptionApproval(user.id, false)}
                            className="w-full px-4 py-3 flex items-center gap-2 text-sm text-left text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <ShieldX size={16} />
                            Not Approve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing {visibleStart}-{visibleEnd} of {filteredUsers.length} users
              {searchTerm ? ` matching "${searchTerm}"` : ''}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                  const isActive = page === currentPage;
                  const isEdge = page === 1 || page === totalPages;
                  const isNearCurrent = Math.abs(page - currentPage) <= 1;

                  if (!isEdge && !isNearCurrent) {
                    const shouldShowEllipsis =
                      (page === currentPage - 2 && page > 2) ||
                      (page === currentPage + 2 && page < totalPages - 1);

                    if (shouldShowEllipsis) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    return null;
                  }

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[2.25rem] px-3 py-2 text-sm rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredUsers.length} of {users.length} users with password never expires
        </div>
      </main>
    </div>
  );
}
