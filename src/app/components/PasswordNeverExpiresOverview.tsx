import { ArrowLeft, Users, Shield, Cog, AlertTriangle, Download, RefreshCw, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PasswordNeverExpiresOverviewProps {
  onBack: () => void;
  onNavigateToL3: (filter?: string) => void;
}

const passwordAgeData = [
  { range: '0-90 days', count: 8 },
  { range: '91-180 days', count: 15 },
  { range: '181-365 days', count: 22 },
  { range: '>365 days', count: 38 }
];

const ouDistributionData = [
  { ou: 'IT Security', count: 18 },
  { ou: 'IT Operations', count: 16 },
  { ou: 'Engineering', count: 14 },
  { ou: 'Finance', count: 12 },
  { ou: 'Database Admin', count: 10 },
  { ou: 'Service Accounts', count: 13 }
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#DC2626'];

export function PasswordNeverExpiresOverview({ onBack, onNavigateToL3 }: PasswordNeverExpiresOverviewProps) {
  const totalUsers = 83;
  const privilegedUsers = 42;
  const serviceAccounts = 28;
  const highRiskUsers = 38;

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

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">Password Expiration Analysis</span>
            <span>/</span>
            <span className="text-gray-900">Password Never Expires</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={32} />
              <div>
                <h1>Password Never Expires – Overview</h1>
                <p className="text-sm text-gray-600">Security governance for accounts with password expiration disabled</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 30 days</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
              </select>

              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={20} className="text-gray-600" />
              </button>

              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => onNavigateToL3()}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
              </div>
              <Users className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <span>View all users</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div
            onClick={() => onNavigateToL3('privileged')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-red-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Privileged Users</p>
                <p className="text-2xl font-semibold text-red-600">{privilegedUsers}</p>
              </div>
              <Shield className="text-red-400 group-hover:text-red-600 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <span>Critical attention</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div
            onClick={() => onNavigateToL3('service')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Service Accounts</p>
                <p className="text-2xl font-semibold text-blue-600">{serviceAccounts}</p>
              </div>
              <Cog className="text-blue-400 group-hover:text-blue-600 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <span>Review exceptions</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Password Age Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Age Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={passwordAgeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="range" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {passwordAgeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* OU-wise Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">OU-wise User Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ouDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="ou" stroke="#6B7280" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={90} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-600" size={20} />
            <h3 className="font-semibold text-gray-900">Security Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Privileged Users at Risk</p>
              </div>
              <p className="text-xs text-gray-600">42 privileged users have password never expires enabled - immediate review required</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Stale Passwords</p>
              </div>
              <p className="text-xs text-gray-600">38 users have passwords older than 365 days and require rotation</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Exception Violations</p>
              </div>
              <p className="text-xs text-gray-600">48 users have no approved exception and violate password policy</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Policy Mismatch</p>
              </div>
              <p className="text-xs text-gray-600">IT Security and IT Operations OUs have the highest exception counts</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
