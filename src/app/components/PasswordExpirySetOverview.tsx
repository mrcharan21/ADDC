import { ArrowLeft, Users, Clock, AlertTriangle, XCircle, Download, RefreshCw, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PasswordExpirySetOverviewProps {
  onBack: () => void;
  onNavigateToL3: (filter?: string) => void;
}

const expiryTimelineData = [
  { range: 'Expired', count: 12 },
  { range: '0-7 days', count: 18 },
  { range: '8-30 days', count: 45 },
  { range: '31-60 days', count: 68 },
  { range: '60+ days', count: 132 }
];

const ouDistributionData = [
  { ou: 'Sales', count: 52 },
  { ou: 'Finance', count: 48 },
  { ou: 'Engineering', count: 42 },
  { ou: 'Marketing', count: 38 },
  { ou: 'HR', count: 35 },
  { ou: 'IT Support', count: 32 },
  { ou: 'Legal', count: 28 }
];

const COLORS = ['#DC2626', '#F59E0B', '#FBBF24', '#10B981', '#3B82F6'];

export function PasswordExpirySetOverview({ onBack, onNavigateToL3 }: PasswordExpirySetOverviewProps) {
  const totalUsers = 275;
  const expiringSoon7Days = 18;
  const expiring830Days = 45;
  const alreadyExpired = 12;

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
            <span className="text-gray-900">Details</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={32} />
              <div>
                <h1>Password Expiry Set – Users</h1>
                <p className="text-sm text-gray-600">Monitoring password expiration and preventing account lockouts</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            onClick={() => onNavigateToL3('7days')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expiring ≤ 7 Days</p>
                <p className="text-2xl font-semibold text-orange-600">{expiringSoon7Days}</p>
              </div>
              <Clock className="text-orange-400 group-hover:text-orange-600 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
              <span>Urgent attention</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div 
            onClick={() => onNavigateToL3('30days')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-yellow-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expiring 8–30 Days</p>
                <p className="text-2xl font-semibold text-yellow-600">{expiring830Days}</p>
              </div>
              <AlertTriangle className="text-yellow-400 group-hover:text-yellow-600 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
              <span>Monitor closely</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div 
            onClick={() => onNavigateToL3('expired')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-red-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Already Expired</p>
                <p className="text-2xl font-semibold text-red-600">{alreadyExpired}</p>
              </div>
              <XCircle className="text-red-400 group-hover:text-red-600 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <span>Immediate action</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Password Expiry Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Expiry Timeline</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expiryTimelineData}>
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
                    {expiryTimelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* OU-wise Expiry Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">OU-wise Expiry Distribution</h3>
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">Monitoring Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Expiring Soon</p>
              </div>
              <p className="text-xs text-gray-600">18 users have passwords expiring in the next 7 days - send notifications</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Expired But Active</p>
              </div>
              <p className="text-xs text-gray-600">12 users with expired passwords are still logging in - enforce password change</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">OU Trends</p>
              </div>
              <p className="text-xs text-gray-600">Sales and Finance OUs have frequent password expiry issues requiring review</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Admin Users</p>
              </div>
              <p className="text-xs text-gray-600">8 privileged users have passwords expiring within 7 days - priority action</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Policy Gaps</p>
              </div>
              <p className="text-xs text-gray-600">Password enforcement gaps detected in 3 OUs - review GPO application</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Next 30 Days</p>
              </div>
              <p className="text-xs text-gray-600">63 users total will need password reset in the next 30 days</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
