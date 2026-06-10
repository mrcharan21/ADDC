import { ArrowLeft, Archive, Clock, Trash2, FileText, RefreshCw, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PassiveSecurityGroupsOverviewProps {
  onBack: () => void;
  onNavigateToL3: (filter?: string) => void;
}

const ouDistributionData = [
  { ou: 'Finance', count: 12 },
  { ou: 'IT Security', count: 9 },
  { ou: 'Engineering', count: 6 },
  { ou: 'Marketing', count: 4 },
  { ou: 'HR', count: 2 },
  { ou: 'Sales', count: 1 },
  { ou: 'Legal', count: 1 }
];

const COLORS = ['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4'];

export function PassiveSecurityGroupsOverview({ onBack, onNavigateToL3 }: PassiveSecurityGroupsOverviewProps) {
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
            <span className="hover:text-blue-600 cursor-pointer">Security Group Distribution</span>
            <span>/</span>
            <span className="text-gray-900">Details</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Archive className="text-orange-600" size={32} />
              <div>
                <h1>Passive Security Groups – Overview</h1>
                <p className="text-sm text-gray-600">Empty groups requiring governance and cleanup</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Passive Groups - PRIMARY NAVIGATION */}
          <div 
            onClick={() => onNavigateToL3()}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-gray-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Archive className="text-gray-600" size={28} />
              </div>
              <ArrowLeft className="text-gray-400 group-hover:text-gray-600 transition-colors rotate-180" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Passive Groups</p>
              <p className="text-3xl font-semibold text-gray-900 mb-2">35</p>
              <p className="text-xs text-gray-500">Security groups with zero members</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-600 font-medium">Click to view all groups →</p>
            </div>
          </div>

          {/* For Archive */}
          <div 
            onClick={() => onNavigateToL3('Archive')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Archive className="text-blue-600" size={28} />
              </div>
              <ArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors rotate-180" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">For Archive</p>
              <p className="text-3xl font-semibold text-gray-900 mb-2">10</p>
              <p className="text-xs text-gray-500">Groups ready to be archived</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-blue-600 font-medium">View archive list →</p>
            </div>
          </div>

          {/* Under Review */}
          <div 
            onClick={() => onNavigateToL3('Review')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Clock className="text-orange-600" size={28} />
              </div>
              <ArrowLeft className="text-gray-400 group-hover:text-orange-600 transition-colors rotate-180" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-3xl font-semibold text-gray-900 mb-2">15</p>
              <p className="text-xs text-gray-500">Awaiting cleanup decision</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-orange-600 font-medium">View review list →</p>
            </div>
          </div>

          {/* For Deletion */}
          <div 
            onClick={() => onNavigateToL3('Delete')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-red-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <Trash2 className="text-red-600" size={28} />
              </div>
              <ArrowLeft className="text-gray-400 group-hover:text-red-600 transition-colors rotate-180" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">For Deletion</p>
              <p className="text-3xl font-semibold text-gray-900 mb-2">10</p>
              <p className="text-xs text-gray-500">Safe to delete permanently</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-red-600 font-medium">View deletion list →</p>
            </div>
          </div>
        </div>

        {/* OU-wise Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">OU-wise Passive Security Groups</h2>
              <p className="text-sm text-gray-600 mt-1">Distribution of empty groups across organizational units</p>
            </div>
            <FileText className="text-gray-400" size={24} />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ouDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="ou" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Number of Passive Groups', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {ouDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="text-orange-600" size={20} />
            <h3 className="font-semibold text-gray-900">Governance Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Stale Groups</p>
              </div>
              <p className="text-xs text-gray-600">22 passive groups have been unused for over 90 days and require review</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">No Owner Assigned</p>
              </div>
              <p className="text-xs text-gray-600">13 passive groups have no assigned owner and need accountability</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Highest Concentration</p>
              </div>
              <p className="text-xs text-gray-600">Finance and IT OUs contain the highest number of passive groups requiring cleanup</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}