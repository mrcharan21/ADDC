import {
  ArrowLeft,
  Users,
  Search,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Mail,
  Building,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS, apiUrl } from "../api/config";
import { PaginationControls } from "./PaginationControls";
import { ScrollToTopButton } from "./ScrollToTopButton";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  department: string;
  status: "Active" | "Inactive" | "Locked";
  accountType: "Standard" | "Admin" | "Service";
  lastLogin: string;
  passwordExpiry: string;
  privilegeLevel: "Normal" | "High";
  groupCount: number;
  riskScore: number;
  riskband: "Low" | "Medium" | "High";
}

interface UsersSummary {
  active_users: number;
  inactive_users: number;
  locked_accounts: number;
  admin_accounts: number;
}

function normalizeAccountType(value?: string): User["accountType"] {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("admin")) return "Admin";
  if (normalized.includes("service")) return "Service";
  return "Standard";
}

function normalizeRiskBand(value?: string): User["riskband"] {
  const normalized = (value || "").toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  return "Low";
}

function normalizeStatus(value?: string): User["status"] {
  const normalized = (value || "").toLowerCase();
  if (normalized === "locked") return "Locked";
  if (normalized === "inactive" || normalized === "disabled") return "Inactive";
  return "Active";
}

function mapApiUser(user: any, index: number): User {
  return {
    id: user.username || String(index + 1),
    username: user.username || "",
    fullName: user.display_name || user.username || "Unknown User",
    email: user.email || `${user.username || "unknown"}@company.local`,
    department: user.department || "Unknown",
    status: normalizeStatus(user.status),
    accountType: normalizeAccountType(user.account_type),
    lastLogin: user.last_login || "Never",
    passwordExpiry: user.password_expiry || "Never",
    privilegeLevel: user.privilege === "High" ? "High" : "Normal",
    groupCount: user.group_count ?? 0,
    riskScore: user.risk_score ?? 0,
    riskband: normalizeRiskBand(user.risk_band),
  };
}

interface UserDetailsViewProps {
  onBack: () => void;
  onUserClick: (userId: string) => void;
}

export function UserDetailsView({ onBack, onUserClick }: UserDetailsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive" | "Locked"
  >("All");
  const [filterAccountType, setFilterAccountType] = useState<
    "All" | "Standard" | "Admin" | "Service"
  >("All");
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<UsersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl(API_ENDPOINTS.users)}?limit=100`);

      if (!response.ok) {
        throw new Error(`Users API error: ${response.status}`);
      }

      const data = await response.json();
      setUsers((Array.isArray(data.users) ? data.users : []).map(mapApiUser));
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || user.status === filterStatus;
    const matchesAccountType =
      filterAccountType === "All" || user.accountType === filterAccountType;

    return matchesSearch && matchesStatus && matchesAccountType;
  });
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const pageStartIndex = (currentPage - 1) * usersPerPage;
  const pageEndIndex = pageStartIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(pageStartIndex, pageEndIndex);
  const visibleStart = filteredUsers.length === 0 ? 0 : pageStartIndex + 1;
  const visibleEnd = Math.min(pageEndIndex, filteredUsers.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterAccountType]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const activeUsers =
    summary?.active_users ?? users.filter((u) => u.status === "Active").length;
  const inactiveUsers =
    summary?.inactive_users ?? users.filter((u) => u.status === "Inactive").length;
  const lockedUsers =
    summary?.locked_accounts ?? users.filter((u) => u.status === "Locked").length;
  const adminUsers =
    summary?.admin_accounts ?? users.filter((u) => u.accountType === "Admin").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Locked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Service":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <Users className="text-blue-600" size={32} />
            <div>
              <h1>User Management</h1>
              <p className="text-sm text-gray-600">
                Detailed view of all Active Directory users
              </p>
            </div>
            {loading && <Loader2 className="text-blue-600 animate-spin" size={20} />}
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
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-green-600">
                  {activeUsers}
                </p>
              </div>
              <UserCheck className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {inactiveUsers}
                </p>
              </div>
              <UserX className="text-gray-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Locked Accounts</p>
                <p className="text-2xl font-semibold text-red-600">
                  {lockedUsers}
                </p>
              </div>
              <Shield className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin Accounts</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {adminUsers}
                </p>
              </div>
              <Shield className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {error && (
            <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
              <button
                aria-label="Retry loading users"
                onClick={loadUsers}
                className="flex items-center gap-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Locked">Locked</option>
            </select>

            <select
              value={filterAccountType}
              onChange={(e) => setFilterAccountType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Account Types</option>
              <option value="Standard">Standard</option>
              <option value="Admin">Admin</option>
              <option value="Service">Service</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {visibleStart}-{visibleEnd} of {filteredUsers.length} users
          </div>
        </div>

        {/* Users Table */}
        <div id="user-management-table" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-6">
          <div className="overflow-x-auto">
            <table className="w-full user-management-table">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
                <col className="w-[9%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[6%]" />
                <col className="w-[8%]" />
                <col className="w-[7%]" />
                <col className="w-[7%]" />
              </colgroup>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groups
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Privilege
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk band
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-blue-600" size={18} />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onUserClick(user.username)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex min-w-0 items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </span>
                          </div>
                          <div className="ml-3 min-w-0">
                            <div className="truncate font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="flex min-w-0 items-center gap-1 text-sm text-gray-500">
                              <Mail size={12} />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Building size={14} className="text-gray-400" />
                          <span className="truncate">{user.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAccountTypeColor(user.accountType)}`}
                        >
                          {user.accountType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Clock size={14} className="text-gray-400" />
                          {user.lastLogin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.passwordExpiry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.groupCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.privilegeLevel === "High"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.privilegeLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.riskScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.riskband === "High"
                              ? "bg-red-100 text-red-800"
                              : user.riskband === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.riskband}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollTargetId="user-management-table"
        />
        
      </main>
      <ScrollToTopButton />
    </div>
  );
}
