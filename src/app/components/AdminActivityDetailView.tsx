import { ArrowLeft, Search, Download, Clock, Shield, Server, Eye, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LoginActivity {
  id: string;
  timestamp: string;
  username: string;
  adminType: 'Domain Admin' | 'Endpoint Admin';
  sourceIP: string;
  targetDevice: string;
  sessionDuration: string;
  ou: string;
  authMethod: string;
  status: 'Success' | 'Failed';
}

const mockLoginActivities: LoginActivity[] = [
  {
    id: '1',
    timestamp: '2024-12-23 15:30',
    username: 'domain.admin1',
    adminType: 'Domain Admin',
    sourceIP: '192.168.1.45',
    targetDevice: 'SRV-DC-01',
    sessionDuration: '2h 15m',
    ou: 'IT Security',
    authMethod: 'Kerberos',
    status: 'Success'
  },
  {
    id: '2',
    timestamp: '2024-12-23 15:20',
    username: 'endpoint.admin1',
    adminType: 'Endpoint Admin',
    sourceIP: '192.168.1.102',
    targetDevice: 'SRV-APP-01',
    sessionDuration: '1h 45m',
    ou: 'IT Operations',
    authMethod: 'NTLM',
    status: 'Success'
  },
  {
    id: '3',
    timestamp: '2024-12-23 14:55',
    username: 'domain.admin2',
    adminType: 'Domain Admin',
    sourceIP: '192.168.1.50',
    targetDevice: 'SRV-DC-02',
    sessionDuration: '3h 10m',
    ou: 'IT Security',
    authMethod: 'Kerberos',
    status: 'Success'
  },
  {
    id: '4',
    timestamp: '2024-12-23 14:30',
    username: 'server.admin1',
    adminType: 'Endpoint Admin',
    sourceIP: '192.168.1.115',
    targetDevice: 'SRV-DB-01',
    sessionDuration: '45m',
    ou: 'Database Admin',
    authMethod: 'NTLM',
    status: 'Success'
  },
  {
    id: '5',
    timestamp: '2024-12-23 13:45',
    username: 'network.admin',
    adminType: 'Endpoint Admin',
    sourceIP: '192.168.1.120',
    targetDevice: 'SRV-NET-01',
    sessionDuration: '2h 30m',
    ou: 'Network Admin',
    authMethod: 'Kerberos',
    status: 'Success'
  },
  {
    id: '6',
    timestamp: '2024-12-23 12:20',
    username: 'security.admin',
    adminType: 'Domain Admin',
    sourceIP: '192.168.1.60',
    targetDevice: 'SRV-DC-01',
    sessionDuration: '1h 15m',
    ou: 'IT Security',
    authMethod: 'Kerberos',
    status: 'Success'
  },
  {
    id: '7',
    timestamp: '2024-12-23 11:50',
    username: 'endpoint.admin2',
    adminType: 'Endpoint Admin',
    sourceIP: '192.168.1.130',
    targetDevice: 'SRV-WEB-01',
    sessionDuration: '4h 20m',
    ou: 'IT Operations',
    authMethod: 'NTLM',
    status: 'Success'
  },
  {
    id: '8',
    timestamp: '2024-12-23 11:10',
    username: 'db.admin.prod',
    adminType: 'Endpoint Admin',
    sourceIP: '192.168.1.65',
    targetDevice: 'SRV-DB-02',
    sessionDuration: '5h 30m',
    ou: 'Database Admin',
    authMethod: 'Kerberos',
    status: 'Success'
  },
  {
    id: '9',
    timestamp: '2024-12-23 10:30',
    username: 'domain.svc.admin',
    adminType: 'Domain Admin',
    sourceIP: '192.168.1.70',
    targetDevice: 'SRV-DC-03',
    sessionDuration: '30m',
    ou: 'IT Security',
    authMethod: 'Kerberos',
    status: 'Success'
  },
  {
    id: '10',
    timestamp: '2024-12-23 09:45',
    username: 'local.server.admin',
    adminType: 'Endpoint Admin',
    sourceIP: '192.168.1.135',
    targetDevice: 'SRV-FILE-01',
    sessionDuration: '2h 0m',
    ou: 'Server Admin',
    authMethod: 'NTLM',
    status: 'Success'
  }
];

const activityTrendData = [
  { time: '00:00', domainAdmin: 2, endpointAdmin: 3 },
  { time: '03:00', domainAdmin: 1, endpointAdmin: 2 },
  { time: '06:00', domainAdmin: 5, endpointAdmin: 7 },
  { time: '09:00', domainAdmin: 12, endpointAdmin: 23 },
  { time: '12:00', domainAdmin: 8, endpointAdmin: 18 },
  { time: '15:00', domainAdmin: 15, endpointAdmin: 25 },
  { time: '18:00', domainAdmin: 6, endpointAdmin: 14 },
  { time: '21:00', domainAdmin: 2, endpointAdmin: 4 },
];

interface AdminActivityDetailViewProps {
  onBack: () => void;
}

export function AdminActivityDetailView({ onBack }: AdminActivityDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterAdminType, setFilterAdminType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState<string>('timestamp');

  const filteredActivities = mockLoginActivities
    .filter(activity => {
      const matchesSearch = 
        activity.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.targetDevice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.sourceIP.includes(searchTerm);
      
      const matchesAdminType = filterAdminType === 'All' || activity.adminType === filterAdminType;
      const matchesStatus = filterStatus === 'All' || activity.status === filterStatus;
      
      return matchesSearch && matchesAdminType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return 0;
    });

  const domainAdminLogins = mockLoginActivities.filter(a => a.adminType === 'Domain Admin').length;
  const endpointAdminLogins = mockLoginActivities.filter(a => a.adminType === 'Endpoint Admin').length;
  const totalLogins = mockLoginActivities.length;

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
            <span>Back to Dashboard</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900">Admin Login Activity</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-600" size={32} />
              <div>
                <h1>Domain vs Endpoint Admin Login Activity</h1>
                <p className="text-sm text-gray-600">Comprehensive login activity analysis for administrative accounts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Logins</p>
                <p className="text-xl font-semibold text-gray-900">{totalLogins}</p>
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
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Logins (24h)</p>
              <Clock className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{totalLogins}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Domain Admin Logins</p>
              <Shield className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-red-600">{domainAdminLogins}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Endpoint Admin Logins</p>
              <Server className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-blue-600">{endpointAdminLogins}</p>
          </div>
        </div>

        {/* Activity Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Login Activity Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="domainAdmin" stroke="#dc2626" strokeWidth={2} name="Domain Admin Logins" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="endpointAdmin" stroke="#3b82f6" strokeWidth={2} name="Endpoint Admin Logins" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by username, device, or IP address..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <select
                  value={filterAdminType}
                  onChange={(e) => setFilterAdminType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Admin Types</option>
                  <option value="Domain Admin">Domain Admin</option>
                  <option value="Endpoint Admin">Endpoint Admin</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="timestamp">Sort by Timestamp</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auth Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{activity.username}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.adminType === 'Domain Admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.adminType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.sourceIP}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.targetDevice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.sessionDuration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.ou}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.authMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredActivities.length} of {mockLoginActivities.length} login activities
        </div>
      </main>
    </div>
  );
}
