import { ArrowLeft, Shield, Globe, AlertTriangle, Users, FileText, RefreshCw, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PrivilegedUsersOverviewProps {
  onBack: () => void;
  onNavigateToPrivilegedL3: (filter?: string) => void;
  onNavigateToNormalL3: () => void;
}

const departmentDistributionData = [
  { department: 'IT Security', count: 28 },
  { department: 'IT Operations', count: 22 },
  { department: 'Engineering', count: 15 },
  { department: 'Database Admin', count: 12 },
  { department: 'Network Team', count: 9 },
  { department: 'Finance', count: 6 },
  { department: 'HR', count: 3 }
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

export function PrivilegedUsersOverview({ onBack, onNavigateToPrivilegedL3, onNavigateToNormalL3 }: PrivilegedUsersOverviewProps) {
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
            <span className="hover:text-blue-600 cursor-pointer">User Privileges Distribution</span>
            <span>/</span>
            <span className="text-gray-900">Details</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-600" size={32} />
              <div>
                <h1>Privileged Users – Overview</h1>
                <p className="text-sm text-gray-600">Administrative and elevated access monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
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
        {/* KPI Summary Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Privileged Users - PRIMARY NAVIGATION */}
          <div
            onClick={() => onNavigateToPrivilegedL3()}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Shield className="text-blue-600" size={28} />
              </div>
              <ArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors rotate-180" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Privileged Users</p>
              <p className="text-3xl font-semibold text-gray-900 mb-2">95</p>
              <p className="text-xs text-gray-500">Users with administrative privileges</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-blue-600 font-medium">View all privileged users →</p>
            </div>
          </div>

          {/* Privileged Users with Internet Access */}
          <div
            onClick={() => onNavigateToPrivilegedL3('internet')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Globe className="text-orange-600" size={28} />
              </div>
              <ArrowLeft className="text-gray-400 group-hover:text-orange-600 transition-colors rotate-180" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">With Internet Access</p>
              <p className="text-3xl font-semibold text-gray-900 mb-2">19</p>
              <p className="text-xs text-gray-500">Privileged users with internet access</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-orange-600 font-medium">View internet-exposed admins →</p>
            </div>
          </div>

          {/* Normal Users */}
          <div
            onClick={onNavigateToNormalL3}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-green-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="text-green-600" size={28} />
              </div>
              <ArrowLeft className="text-gray-400 group-hover:text-green-600 transition-colors rotate-180" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Normal Users</p>
              <p className="text-3xl font-semibold text-gray-900 mb-2">303</p>
              <p className="text-xs text-gray-500">Standard user accounts</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-green-600 font-medium">View all normal users →</p>
            </div>
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Privileged Users by Department</h2>
              <p className="text-sm text-gray-600 mt-1">Distribution of administrative access across departments</p>
            </div>
            <FileText className="text-gray-400" size={24} />
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="department"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Number of Privileged Users', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {departmentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">Security Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Internet Exposure</p>
              </div>
              <p className="text-xs text-gray-600">19 privileged users have unrestricted internet access and require review</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">High-Risk Flagged</p>
              </div>
              <p className="text-xs text-gray-600">23 privileged users are flagged as high risk due to policy violations</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Department Ownership</p>
              </div>
              <p className="text-xs text-gray-600">IT Security and Operations departments own the majority of admin accounts</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
