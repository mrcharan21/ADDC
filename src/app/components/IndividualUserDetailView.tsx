
import {
  ArrowLeft,
  User,
  Shield,
  Clock,
  Building,
  Key,
  Users,
  Activity,
  Lock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  FileText,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, apiUrl, formatApiLabel } from "../api/config";
// ─── Types ────────────────────────────────────────────────────────────────────

interface UserDetail {
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
  displayName: string;
  jobTitle: string;
  officeLocation: string;
  phoneNumber: string;
  manager: string;
  employeeId: string;
  accountCreated: string;
  lastPasswordChange: string;
  loginCount: number;
  failedLoginAttempts: number;
  distinguishedName: string;
  userPrincipalName: string;
  sid: string;
  homeDirectory: string;
  profilePath: string;
  scriptPath: string;
  accountExpires: string;
  passwordNeverExpires: boolean;
  cannotChangePassword: boolean;
  mustChangePasswordNextLogin: boolean;
  accountLocked: boolean;
  accountDisabled: boolean;
}

interface GroupMembership {
  id: string;
  groupName: string;
  groupType: string;
  ou: string;
  privileged: boolean;
  addedDate: string;
}

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  ip: string;
  device: string;
  actor: string;
}

interface RiskFactor {
  score: number;
  reason: string;
}

interface UserRisk {
  score: number;
  band: string;
  accountType: string;
  factors: Record<string, RiskFactor>;
  topReasons: string[];
  enriched: boolean;
}

interface ApiResponse {
  userDetail: UserDetail;
  groupMemberships: GroupMembership[];
  activityLog: ActivityLogEntry[];
  risk: UserRisk | null;
}

// ─── API Layer ────────────────────────────────────────────────────────────────

function normalizeAccountType(value?: string): UserDetail["accountType"] {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("admin")) return "Admin";
  if (normalized.includes("service")) return "Service";
  return "Standard";
}

function normalizeStatus(value?: string): UserDetail["status"] {
  const normalized = (value || "").toLowerCase();
  if (normalized === "locked") return "Locked";
  if (normalized === "inactive" || normalized === "disabled") return "Inactive";
  return "Active";
}

function normalizePrivilege(value?: string, groups: GroupMembership[] = []): UserDetail["privilegeLevel"] {
  if ((value || "").toLowerCase() === "high" || groups.some((group) => group.privileged)) {
    return "High";
  }
  return "Normal";
}

function normalizeDateTime(value?: string | null): string {
  if (!value) return "";
  return value.includes("T") ? value : value.replace(" ", "T");
}

function resolveBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeRisk(data: any): UserRisk | null {
  const risk = data?.risk;
  if (!risk) return null;

  return {
    score: Number(risk.score ?? 0),
    band: risk.band || "unknown",
    accountType: risk.account_type || "unknown",
    factors: risk.factors || {},
    topReasons: Array.isArray(risk.top_reasons) ? risk.top_reasons : [],
    enriched: Boolean(risk.enriched),
  };
}

function formatRiskFactorName(value: string): string {
  return formatApiLabel(value);
}

function normalizeActivityLog(data: any, username: string): ActivityLogEntry[] {
  const activityRows =
    data.activity ||
    data.activity_log ||
    data.activityLog ||
    data.activities ||
    data.logins ||
    data.overview?.activity ||
    data.overview?.activity_log ||
    [];

  return (Array.isArray(activityRows) ? activityRows : []).map((entry: any, index: number) => ({
    id: String(entry.id || `${username}-activity-${index}`),
    timestamp: normalizeDateTime(
      entry.timestamp ||
        entry.time ||
        entry.event_time ||
        entry.login_time ||
        entry.created_at ||
        entry.date,
    ) || "Unknown",
    eventType:
      entry.event_type ||
      entry.eventType ||
      entry.activity ||
      entry.action ||
      entry.event ||
      entry.type ||
      "Activity",
    description:
      entry.description ||
      entry.details ||
      entry.message ||
      entry.reason ||
      "No additional details",
    ip:
      entry.ip ||
      entry.ip_address ||
      entry.ipAddress ||
      entry.client_ip ||
      entry.source_ip ||
      "",
    device:
      entry.device ||
      entry.source ||
      entry.hostname ||
      entry.computer ||
      entry.domain_controller ||
      "",
    actor: entry.actor || entry.username || entry.user || entry.account || username,
  }));
}

async function fetchUserDetailsFromAPI(userId: string): Promise<ApiResponse> {
  const username = userId;

  const response = await fetch(apiUrl(API_ENDPOINTS.user(username)));

  if (!response.ok) {
    throw new Error(`User detail API error: ${response.status}`);
  }

  const data = await response.json();
  const groups: GroupMembership[] = (Array.isArray(data.groups) ? data.groups : []).map(
    (group: any, index: number) => ({
      id: `${data.username || username}-group-${index}`,
      groupName: group.group_name || "Unknown Group",
      groupType: group.type || "Security",
      ou: group.ou || "Unknown",
      privileged: Boolean(group.privileged),
      addedDate: group.added_date || "Unknown",
    }),
  );
  const flags = data.overview?.flags || {};
  const accountSecurity = data.overview?.account_security || {};
  const accountSummary = data.overview?.account_summary || {};
  const basic = data.overview?.basic || {};
  const contact = data.overview?.contact || {};
  const adSettings = data.ad_settings || {};
  const security = data.security || {};
  const tiles = data.tiles || {};
  const accountType = normalizeAccountType(data.account_type);
  const privilegeLevel = normalizePrivilege(data.privilege, groups);

  return {
    userDetail: {
      id: data.username || username,
      username: data.username || username,
      fullName: data.display_name || basic.display_name || data.username || username,
      displayName: basic.display_name || data.display_name || data.username || username,
      email: basic.email || `${username}@company.local`,
      department: data.department || contact.department || "Unknown",
      jobTitle: data.job_title || contact.job_title || "Not configured",
      officeLocation: contact.office_location || "Not configured",
      phoneNumber: contact.phone || "Not configured",
      manager: basic.manager || "Not configured",
      employeeId: basic.employee_id || "Not configured",
      status: normalizeStatus(data.status || accountSecurity.status),
      accountType,
      lastLogin: normalizeDateTime(tiles.last_login_raw),
      passwordExpiry: accountSecurity.password_expires || "Never",
      privilegeLevel,
      groupCount: tiles.group_memberships ?? groups.length,
      accountCreated: accountSummary.created || "Unknown",
      lastPasswordChange: normalizeDateTime(accountSecurity.last_pwd_change || security.last_pwd_change),
      loginCount: accountSummary.total_logins ?? tiles.total_logins ?? 0,
      failedLoginAttempts: accountSecurity.failed_login_count ?? 0,
      distinguishedName: adSettings.distinguished_name || "Not configured",
      userPrincipalName: adSettings.user_principal_name || basic.email || `${username}@company.local`,
      sid: adSettings.sid || "Not configured",
      homeDirectory: adSettings.home_directory || "Not configured",
      profilePath: adSettings.profile_path || "Not configured",
      scriptPath: adSettings.login_script || "",
      accountExpires: accountSummary.expires || "Never",
      passwordNeverExpires: !accountSecurity.password_expires,
      cannotChangePassword: !resolveBoolean(flags.user_can_change_password, true),
      mustChangePasswordNextLogin: !resolveBoolean(flags.no_pwd_change_required, true),
      accountLocked: !resolveBoolean(flags.account_not_locked, data.status === "Locked" ? false : true),
      accountDisabled: !resolveBoolean(flags.account_enabled, data.status === "Inactive" ? false : true),
    },
    groupMemberships: groups,
    activityLog: normalizeActivityLog(data, data.username || username),
    risk: normalizeRisk(data),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AccountFlagProps {
  status: boolean;
  successText: string;
  errorText: string;
  warning?: boolean;
  errorIcon?: "x" | "lock";
}

function AccountFlag({
  status,
  successText,
  errorText,
  warning = false,
  errorIcon = "x",
}: AccountFlagProps) {
  const Icon = status
    ? CheckCircle
    : warning
      ? AlertTriangle
      : errorIcon === "lock"
        ? Lock
        : XCircle;
  const stateClass = status
    ? "bg-green-50 border-green-200 text-green-800"
    : warning
      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
      : "bg-red-50 border-red-200 text-red-800";
  const iconClass = status
    ? "text-green-600"
    : warning
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border ${stateClass}`}
    >
      <Icon className={iconClass} size={20} />
      <span className="text-sm font-medium">
        {status ? successText : errorText}
      </span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-8">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-lg" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface IndividualUserDetailViewProps {
  userId: string;
  onBack: () => void;
  onGroupClick?: (groupName: string) => void;
}

export function IndividualUserDetailView({
  userId,
  onBack,
  onGroupClick,
}: IndividualUserDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "groups" | "activity" | "security" | "settings" | "risk"
  >("overview");
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [userGroups, setUserGroups] = useState<GroupMembership[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [userRisk, setUserRisk] = useState<UserRisk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserDetailsFromAPI(userId);
      setUserDetail(result.userDetail);
      setUserGroups(result.groupMemberships);
      setActivityLog(result.activityLog);
      setUserRisk(result.risk);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load user details"
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Locked":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Service":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskBandColor = (band: string) => {
    switch (band.toLowerCase()) {
      case "critical":
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // ── Loading / Error states ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to User Management</span>
          </button>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 px-8 pt-8 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading user details from CADA API...</span>
            </div>
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !userDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to User Management</span>
          </button>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
            <h1 className="text-2xl font-bold text-gray-900">
              Failed to load user
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {error ?? "No data returned for user ID " + userId}
            </p>
            <button
              onClick={loadUserData}
              className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const isAdmin = userDetail.accountType === "Admin";
  const lastLoginDate = new Date(userDetail.lastLogin);
  const lastLoginDisplay = isNaN(lastLoginDate.getTime())
    ? "Unknown"
    : lastLoginDate.toLocaleString();
  const riskLevel =
    userDetail.privilegeLevel === "High" && userDetail.passwordNeverExpires
      ? "High"
      : userDetail.failedLoginAttempts > 3
        ? "Medium"
        : "Low";
  const daysSinceLastLogin = isNaN(lastLoginDate.getTime())
    ? 0
    : Math.floor((Date.now() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
  const accountAge = Math.floor(
    (Date.now() - new Date(userDetail.accountCreated).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const riskFactors = userRisk
    ? Object.entries(userRisk.factors).sort(([, a], [, b]) => b.score - a.score)
    : [];
  const notableRiskFactors = riskFactors.filter(([, factor]) => factor.score > 0);
  const displayedRiskFactors =
    notableRiskFactors.length > 0 ? notableRiskFactors : riskFactors;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            aria-label="Back to user management"
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to User Management</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">User Management</span>
            <span>/</span>
            <span className="text-gray-900">{userDetail.fullName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="text-blue-600" size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userDetail.fullName}
                  </h1>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(userDetail.status)}`}
                  >
                    {userDetail.status}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getAccountTypeColor(userDetail.accountType)}`}
                  >
                    {userDetail.accountType}
                  </span>
                  {userDetail.privilegeLevel === "High" && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                      High Privileges
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {userDetail.jobTitle} - {userDetail.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                aria-label="Refresh user data"
                onClick={loadUserData}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={18} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banners */}
        {userDetail.status === "Locked" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">Account Locked</h3>
                <p className="text-sm text-red-800 mt-1">
                  This account has been locked due to multiple failed login
                  attempts. Contact IT Security to unlock.
                </p>
              </div>
            </div>
          </div>
        )}

        {userDetail.passwordNeverExpires && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-900">
                  Password Never Expires
                </h3>
                <p className="text-sm text-yellow-800 mt-1">
                  This account is configured with a password that never expires.
                  This may pose a security risk.
                </p>
              </div>
            </div>
          </div>
        )}

        {userDetail.failedLoginAttempts > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-orange-900">
                  Failed Login Attempts Detected
                </h3>
                <p className="text-sm text-orange-800 mt-1">
                  This account has {userDetail.failedLoginAttempts} recent
                  failed login attempt(s). Monitor for suspicious activity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Group Memberships</p>
              <Users className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-blue-600">
              {userDetail.groupCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">Security groups</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Logins</p>
              <Activity className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-green-600">
              {userDetail.loginCount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Last Login</p>
              <Clock className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-purple-600">
              {daysSinceLastLogin === 0 ? "Today" : `${daysSinceLastLogin}d ago`}
            </p>
            <p className="text-xs text-gray-500 mt-1">{lastLoginDisplay}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Account Age</p>
              <Calendar className="text-orange-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-orange-600">
              {Math.floor(accountAge / 365)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Years old</p>
          </div>
        </div>

        {/* User Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="space-y-3">
              {[
                ["Display Name", userDetail.displayName],
                ["Username", userDetail.username],
                ["Email Address", userDetail.email],
                ["Manager", userDetail.manager],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm text-gray-900 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-900">Contact & Location</h3>
            </div>
            <div className="space-y-3">
              {[
                ["Job Title", userDetail.jobTitle],
                ["Department", userDetail.department],
                ["Office Location", userDetail.officeLocation],
                ["Phone Number", userDetail.phoneNumber],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm text-gray-900 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-purple-600" size={20} />
              <h3 className="font-semibold text-gray-900">Account Security</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Account Status</p>
                <span
                  className={`mt-1 px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(userDetail.status)}`}
                >
                  {userDetail.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Failed Login Count</p>
                <p className="text-sm text-gray-900 mt-1">
                  {userDetail.failedLoginAttempts}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Password Expires</p>
                <p className="text-sm text-gray-900 mt-1">
                  {userDetail.passwordExpiry}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Password Change</p>
                <p className="text-sm text-gray-900 mt-1">
                  {userDetail.lastPasswordChange}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Risk Level</p>
                <span
                  className={`mt-1 px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${
                    riskLevel === "High"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : riskLevel === "Medium"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-green-100 text-green-800 border-green-200"
                  }`}
                >
                  {riskLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {(
              [
                { key: "overview", label: "Overview", Icon: FileText },
                {
                  key: "groups",
                  label: `Group Memberships (${userDetail.groupCount})`,
                  Icon: Users,
                },
                { key: "activity", label: "Activity Log", Icon: Activity },
                { key: "security", label: "Security Settings", Icon: Shield },
                { key: "settings", label: "AD Settings", Icon: Settings },
                { key: "risk", label: "Risk", Icon: AlertTriangle },
              ] as const
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Account Summary
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Account Created", userDetail.accountCreated],
                      ["Account Expires", userDetail.accountExpires],
                      [
                        "Total Logins",
                        userDetail.loginCount.toLocaleString(),
                      ],
                      ["Days Since Last Login", String(daysSinceLastLogin)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Account Flags
                </h4>
                <div className="space-y-3">
                  <AccountFlag
                    status={!userDetail.accountDisabled}
                    successText="Account Enabled"
                    errorText="Account Disabled"
                  />
                  <AccountFlag
                    status={!userDetail.accountLocked}
                    successText="Account Not Locked"
                    errorText="Account Locked"
                  />
                  <AccountFlag
                    status={!userDetail.passwordNeverExpires}
                    successText="Password Expiration Enabled"
                    errorText="Password Never Expires"
                    warning
                  />
                  <AccountFlag
                    status={!userDetail.mustChangePasswordNextLogin}
                    successText="No Password Change Required"
                    errorText="Must Change Password at Next Login"
                    warning
                  />
                  <AccountFlag
                    status={!userDetail.cannotChangePassword}
                    successText="User Can Change Password"
                    errorText="User Cannot Change Password"
                    errorIcon="lock"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === "groups" && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  Group Memberships ({userGroups.length})
                </h4>
                
              </div>
              {userGroups.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No group memberships found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Group Name", "Type", "OU", "Privileged"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userGroups.map((group) => (
                        <tr key={group.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {group.privileged && (
                                <Shield className="text-red-600" size={16} />
                              )}
                              <button
                                type="button"
                                onClick={() => onGroupClick?.(group.groupName)}
                                className="text-left text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline"
                              >
                                {group.groupName}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {group.groupType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {group.ou}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                group.privileged
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {group.privileged ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity" && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  Activity Log ({activityLog.length})
                </h4>
              </div>
              {activityLog.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No activity log entries returned for this user.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                          {["Users", "Event Type", "Description", "IP", "Device", "Timestamps"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activityLog.map((entry) => {
                        const eventDate = new Date(entry.timestamp);
                        const eventTime = isNaN(eventDate.getTime())
                          ? entry.timestamp
                          : eventDate.toLocaleString();

                        return (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {entry.actor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Activity className="text-blue-600" size={16} />
                                <span className="text-sm font-medium text-gray-900">
                                  {entry.eventType}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                              {entry.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {entry.ip || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {entry.device || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {eventTime}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Password Policy
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="text-gray-600" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Password Expiration
                        </p>
                        <p className="text-xs text-gray-600">
                          {userDetail.passwordExpiry}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="text-gray-600" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Last Password Change
                        </p>
                        <p className="text-xs text-gray-600">
                          {userDetail.lastPasswordChange}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AD Settings Tab */}
          {activeTab === "settings" && (
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Active Directory Attributes
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Distinguished Name</p>
                    <p className="text-sm text-gray-900 mt-1 font-mono break-all">
                      {userDetail.distinguishedName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User Principal Name</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {userDetail.userPrincipalName}
                    </p>
                  </div>
                  {isAdmin && (
                    <div>
                      <p className="text-xs text-gray-500">
                        Security Identifier (SID)
                      </p>
                      <p className="text-sm text-gray-900 mt-1 font-mono break-all">
                        {userDetail.sid}
                      </p>
                    </div>
                  )}
                </div>
              </div>
                  
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Profile Settings
                </h4>
                <div className="space-y-3">
                  {isAdmin && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Home Directory</p>
                        <p className="text-sm text-gray-900 mt-1 font-mono">
                          {userDetail.homeDirectory}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Profile Path</p>
                        <p className="text-sm text-gray-900 mt-1 font-mono">
                          {userDetail.profilePath}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Login Script</p>
                    <p className="text-sm text-gray-900 mt-1 font-mono">
                      {userDetail.scriptPath || "Not configured"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Tab */}
          {activeTab === "risk" && (
            <div className="p-6 space-y-6">
              {userRisk ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500">Risk Score</p>
                      <p className="text-3xl font-semibold text-gray-900 mt-1">
                        {userRisk.score}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500">Risk Band</p>
                      <span
                        className={`mt-2 px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getRiskBandColor(userRisk.band)}`}
                      >
                        {userRisk.band}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500">Account Type</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                        {userRisk.accountType}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {userRisk.enriched ? "Enriched risk data" : "Base risk data"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Top Reasons
                    </h4>
                    {userRisk.topReasons.length > 0 ? (
                      <div className="space-y-3">
                        {userRisk.topReasons.map((reason) => (
                          <div
                            key={reason}
                            className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg"
                          >
                            <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-orange-900">{reason}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No risk reasons reported.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Risk Factors
                    </h4>
                    <div className="space-y-3">
                      {displayedRiskFactors.map(([name, factor]) => (
                        <div
                          key={name}
                          className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatRiskFactorName(name)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {factor.reason}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                              factor.score > 0
                                ? "bg-orange-100 text-orange-800 border-orange-200"
                                : "bg-green-100 text-green-800 border-green-200"
                            }`}
                          >
                            {factor.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No risk data returned for this user.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
