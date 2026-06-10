import { ArrowLeft, Search, Download, Clock, AlertTriangle, Eye, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface TimeBasedLogin {
  id: string;
  loginTime: string;
  loginHour: string;
  adminUsername: string;
  adminType: 'Domain Admin' | 'Endpoint Admin';
  endpoint: string;
  endpointType: 'Desktop' | 'Server';
  ipAddress: string;
  sessionDuration: string;
  activity: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
}

const mockTimeBasedLogins: TimeBasedLogin[] = [
  {
    id: '1',
    loginTime: '2024-12-24 08:15 AM',
    loginHour: '08:00',
    adminUsername: 'john.admin@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'DESKTOP-ENG-001',
    endpointType: 'Desktop',
    ipAddress: '192.168.10.101',
    sessionDuration: '1h 30m',
    activity: 'Software deployment',
    riskLevel: 'High'
  },
  {
    id: '2',
    loginTime: '2024-12-24 08:22 AM',
    loginHour: '08:00',
    adminUsername: 'server.admin1@contoso.com',
    adminType: 'Endpoint Admin',
    endpoint: 'SERVER-WEB01',
    endpointType: 'Server',
    ipAddress: '10.0.1.50',
    sessionDuration: '2h 10m',
    activity: 'IIS configuration',
    riskLevel: 'Low'
  },
  {
    id: '3',
    loginTime: '2024-12-24 08:45 AM',
    loginHour: '08:00',
    adminUsername: 'domain.superadmin@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'SERVER-DC01',
    endpointType: 'Server',
    ipAddress: '10.0.0.1',
    sessionDuration: '45m',
    activity: 'Active Directory management',
    riskLevel: 'Critical'
  },
  {
    id: '4',
    loginTime: '2024-12-24 09:10 AM',
    loginHour: '08:00',
    adminUsername: 'endpoint.admin2@contoso.com',
    adminType: 'Endpoint Admin',
    endpoint: 'DESKTOP-IT-005',
    endpointType: 'Desktop',
    ipAddress: '192.168.10.150',
    sessionDuration: '3h 20m',
    activity: 'Troubleshooting',
    riskLevel: 'Medium'
  },
  {
    id: '5',
    loginTime: '2024-12-24 10:05 AM',
    loginHour: '10:00',
    adminUsername: 'security.admin@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'SERVER-SQL01',
    endpointType: 'Server',
    ipAddress: '10.0.2.10',
    sessionDuration: '1h 15m',
    activity: 'Security audit',
    riskLevel: 'Critical'
  },
  {
    id: '6',
    loginTime: '2024-12-24 10:30 AM',
    loginHour: '10:00',
    adminUsername: 'db.admin@contoso.com',
    adminType: 'Endpoint Admin',
    endpoint: 'SERVER-DB01',
    endpointType: 'Server',
    ipAddress: '10.0.3.20',
    sessionDuration: '2h 0m',
    activity: 'Database maintenance',
    riskLevel: 'Low'
  },
  {
    id: '7',
    loginTime: '2024-12-24 10:50 AM',
    loginHour: '10:00',
    adminUsername: 'domain.admin2@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'DESKTOP-HR-012',
    endpointType: 'Desktop',
    ipAddress: '192.168.20.45',
    sessionDuration: '25m',
    activity: 'User account management',
    riskLevel: 'High'
  },
  {
    id: '8',
    loginTime: '2024-12-24 12:15 PM',
    loginHour: '12:00',
    adminUsername: 'it.support@contoso.com',
    adminType: 'Endpoint Admin',
    endpoint: 'DESKTOP-SALES-008',
    endpointType: 'Desktop',
    ipAddress: '192.168.30.88',
    sessionDuration: '40m',
    activity: 'Software installation',
    riskLevel: 'Low'
  },
  {
    id: '9',
    loginTime: '2024-12-24 14:20 PM',
    loginHour: '14:00',
    adminUsername: 'network.admin@contoso.com',
    adminType: 'Endpoint Admin',
    endpoint: 'SERVER-FIREWALL01',
    endpointType: 'Server',
    ipAddress: '10.0.5.1',
    sessionDuration: '1h 30m',
    activity: 'Firewall rule updates',
    riskLevel: 'Medium'
  },
  {
    id: '10',
    loginTime: '2024-12-24 14:45 PM',
    loginHour: '14:00',
    adminUsername: 'domain.admin3@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'SERVER-EXCH01',
    endpointType: 'Server',
    ipAddress: '10.0.4.50',
    sessionDuration: '55m',
    activity: 'Exchange configuration',
    riskLevel: 'Critical'
  },
  {
    id: '11',
    loginTime: '2024-12-24 16:10 PM',
    loginHour: '16:00',
    adminUsername: 'app.admin@contoso.com',
    adminType: 'Endpoint Admin',
    endpoint: 'SERVER-APP01',
    endpointType: 'Server',
    ipAddress: '10.0.6.30',
    sessionDuration: '1h 45m',
    activity: 'Application patching',
    riskLevel: 'Low'
  },
  {
    id: '12',
    loginTime: '2024-12-24 16:35 PM',
    loginHour: '16:00',
    adminUsername: 'infrastructure.admin@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'DESKTOP-EXEC-001',
    endpointType: 'Desktop',
    ipAddress: '192.168.50.10',
    sessionDuration: '20m',
    activity: 'Executive support',
    riskLevel: 'High'
  },
  {
    id: '13',
    loginTime: '2024-12-24 18:05 PM',
    loginHour: '18:00',
    adminUsername: 'backup.admin@contoso.com',
    adminType: 'Endpoint Admin',
    endpoint: 'SERVER-BACKUP01',
    endpointType: 'Server',
    ipAddress: '10.0.7.100',
    sessionDuration: '2h 30m',
    activity: 'Backup verification',
    riskLevel: 'Low'
  },
  {
    id: '14',
    loginTime: '2024-12-24 20:15 PM',
    loginHour: '20:00',
    adminUsername: 'security.ops@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'SERVER-DC02',
    endpointType: 'Server',
    ipAddress: '10.0.0.2',
    sessionDuration: '1h 10m',
    activity: 'After-hours monitoring',
    riskLevel: 'Critical'
  },
  {
    id: '15',
    loginTime: '2024-12-24 02:30 AM',
    loginHour: '02:00',
    adminUsername: 'maintenance.admin@contoso.com',
    adminType: 'Domain Admin',
    endpoint: 'SERVER-PROD01',
    endpointType: 'Server',
    ipAddress: '10.0.8.50',
    sessionDuration: '3h 0m',
    activity: 'Scheduled maintenance window',
    riskLevel: 'Medium'
  }
];

interface AdminEndpointLoginsViewProps {
  onBack: () => void;
}

export function AdminEndpointLoginsView({ onBack }: AdminEndpointLoginsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAdminType, setFilterAdminType] = useState<'All' | 'Domain Admin' | 'Endpoint Admin'>('All');
  const [filterEndpointType, setFilterEndpointType] = useState<'All' | 'Desktop' | 'Server'>('All');
  const [filterTimeRange, setFilterTimeRange] = useState<'All' | 'Morning' | 'Afternoon' | 'Evening' | 'Night'>('All');

  const getTimeCategory = (hour: string) => {
    const h = parseInt(hour.split(':')[0]);
    if (h >= 6 && h < 12) return 'Morning';
    if (h >= 12 && h < 17) return 'Afternoon';
    if (h >= 17 && h < 22) return 'Evening';
    return 'Night';
  };

  const filteredLogins = mockTimeBasedLogins.filter(login => {
    const matchesSearch =
      login.adminUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      login.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      login.activity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAdminType = filterAdminType === 'All' || login.adminType === filterAdminType;
    const matchesEndpointType = filterEndpointType === 'All' || login.endpointType === filterEndpointType;
    const matchesTimeRange = filterTimeRange === 'All' || getTimeCategory(login.loginHour) === filterTimeRange;

    return matchesSearch && matchesAdminType && matchesEndpointType && matchesTimeRange;
  });

  // Sort by login time (most recent first)
  const sortedLogins = [...filteredLogins].sort((a, b) =>
    new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime()
  );

  const domainAdminCount = mockTimeBasedLogins.filter(l => l.adminType === 'Domain Admin').length;
  const endpointAdminCount = mockTimeBasedLogins.filter(l => l.adminType === 'Endpoint Admin').length;
  const criticalCount = mockTimeBasedLogins.filter(l => l.riskLevel === 'Critical').length;
  const totalLogins = mockTimeBasedLogins.length;

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            <span className="text-gray-900">Admin Logins on Endpoints (Time-wise)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={32} />
              <div>
                <h1>Admin Logins - Time-wise Analysis</h1>
                <p className="text-sm text-gray-600">Today's admin login activity tracked by time intervals</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logins Today</p>
                <p className="text-2xl font-semibold text-blue-600">{totalLogins}</p>
              </div>
              <Clock className="text-blue-500" size={32} />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp size={14} />
              <span>Active monitoring</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Domain Admin</p>
                <p className="text-2xl font-semibold text-red-600">{domainAdminCount}</p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Critical access logins</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Endpoint Admin</p>
                <p className="text-2xl font-semibold text-blue-600">{endpointAdminCount}</p>
              </div>
              <Clock className="text-blue-500" size={32} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Standard admin logins</p>
          </div>
        </div>

        {/* Alert Banner */}
        {criticalCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <p className="font-semibold text-red-900">Security Alert</p>
              <p className="text-sm text-red-700">{criticalCount} critical admin logins detected today requiring review</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search logins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterAdminType}
              onChange={(e) => setFilterAdminType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Admin Types</option>
              <option value="Domain Admin">Domain Admin</option>
              <option value="Endpoint Admin">Endpoint Admin</option>
            </select>

            <select
              value={filterEndpointType}
              onChange={(e) => setFilterEndpointType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Endpoints</option>
              <option value="Desktop">Desktops</option>
              <option value="Server">Servers</option>
            </select>

            <select
              value={filterTimeRange}
              onChange={(e) => setFilterTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Times</option>
              <option value="Morning">Morning (6 AM - 12 PM)</option>
              <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="Evening">Evening (5 PM - 10 PM)</option>
              <option value="Night">Night (10 PM - 6 AM)</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {sortedLogins.length} of {mockTimeBasedLogins.length} login events</span>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>December 24, 2024</span>
            </div>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLogins.map((login) => (
                  <tr key={login.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="text-blue-600" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{login.loginTime}</div>
                          <div className="text-xs text-gray-500">{getTimeCategory(login.loginHour)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{login.adminUsername}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${login.adminType === 'Domain Admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {login.adminType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{login.endpoint}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${login.endpointType === 'Server' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {login.endpointType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {login.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {login.sessionDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Real-time Activity Monitoring</h3>
              <p className="text-sm text-blue-800">
                This view shows all admin login activities throughout the day, organized by time. Monitor domain and endpoint admin access patterns to identify unusual login times or suspicious activity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
