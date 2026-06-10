import { ArrowLeft, Shield, AlertTriangle, Server, Download, RefreshCw, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminAccountsOverviewProps {
  onBack: () => void;
  onNavigateToL3: (filter: string) => void;
}

const ouDistributionData = [
  { ou: 'IT Security', count: 18 },
  { ou: 'IT Operations', count: 14 },
  { ou: 'Database Admin', count: 10 },
  { ou: 'Engineering', count: 8 },
  { ou: 'Server Admin', count: 7 },
  { ou: 'Network Admin', count: 5 }
];

export function AdminAccountsOverview({ onBack, onNavigateToL3 }: AdminAccountsOverviewProps) {
  const domainAdminCount = 15;
  const endpointAdminCount = 47;
  const highRiskAdminCount = 21;

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
            <span className="hover:text-blue-600 cursor-pointer">Admin Accounts Distribution</span>
            <span>/</span>
            <span className="text-gray-900">Details</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-purple-600" size={32} />
              <div>
                <h1>Admin Accounts – Overview</h1>
                <p className="text-sm text-gray-600">Executive summary of privileged administrative accounts</p>
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
        {/* KPI Summary Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Domain Admin Accounts */}
          <div
            onClick={() => onNavigateToL3('domain')}
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8 cursor-pointer hover:shadow-lg hover:border-red-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <Shield className="text-red-600" size={28} />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-red-600 transition-colors" size={24} />
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold text-gray-900">{domainAdminCount}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Domain Admin Accounts</p>
              <p className="text-sm text-gray-600">Accounts with full domain-wide control</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-red-600 font-medium">Click to view detailed inventory →</p>
            </div>
          </div>

          {/* Endpoint Admin Accounts */}
          <div
            onClick={() => onNavigateToL3('endpoint')}
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Server className="text-blue-600" size={28} />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold text-gray-900">{endpointAdminCount}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Endpoint Admin Accounts</p>
              <p className="text-sm text-gray-600">Accounts with endpoint or server-level admin access</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-blue-600 font-medium">Click to view detailed inventory →</p>
            </div>
          </div>
        </div>

        {/* OU-wise Admin Account Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">OU-wise Admin Account Distribution</h3>
          <p className="text-sm text-gray-600 mb-6">Concentration of administrative power across organizational units</p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ouDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="ou"
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-purple-600" size={20} />
            <h3 className="font-semibold text-gray-900">Executive Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Domain-Wide Control</p>
              </div>
              <p className="text-xs text-gray-600">{domainAdminCount} accounts have domain-wide administrative control and require strict governance</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Endpoint Administration</p>
              </div>
              <p className="text-xs text-gray-600">{endpointAdminCount} accounts administer endpoints and servers with elevated privileges</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">High-Risk Flagged</p>
              </div>
              <p className="text-xs text-gray-600">{highRiskAdminCount} admin accounts are flagged as high risk and need immediate attention</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">OU Ownership</p>
              </div>
              <p className="text-xs text-gray-600">IT Security and IT Operations OUs own the majority of admin identities</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
