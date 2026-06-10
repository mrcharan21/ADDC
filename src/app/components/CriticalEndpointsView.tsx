import { ArrowLeft, Monitor, Search, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface CriticalEndpoint {
  id: string;
  endpointName: string;
  ipAddress: string;
  operatingSystem: string;
  criticalGroups: string[];
  status: 'Online' | 'Offline';
  lastSeen: string;
  riskLevel: 'Critical' | 'High' | 'Medium';
  location: string;
  owner: string;
  department: string;
}

const mockEndpoints: CriticalEndpoint[] = [
  {
    id: '1',
    endpointName: 'WS-ADMIN-001',
    ipAddress: '192.168.10.101',
    operatingSystem: 'Windows 11 Pro',
    criticalGroups: ['Domain Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:30 AM',
    riskLevel: 'Critical',
    location: 'IT Department',
    owner: 'John Smith',
    department: 'IT Infrastructure'
  },
  {
    id: '2',
    endpointName: 'WS-ADMIN-002',
    ipAddress: '192.168.10.102',
    operatingSystem: 'Windows 11 Pro',
    criticalGroups: ['Domain Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:28 AM',
    riskLevel: 'Critical',
    location: 'IT Department',
    owner: 'Sarah Johnson',
    department: 'IT Infrastructure'
  },
  {
    id: '3',
    endpointName: 'LAP-SEC-001',
    ipAddress: '192.168.20.50',
    operatingSystem: 'Windows 11 Pro',
    criticalGroups: ['Administrators', 'Account Operators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:25 AM',
    riskLevel: 'High',
    location: 'Security Office',
    owner: 'Michael Chen',
    department: 'IT Security'
  },
  {
    id: '4',
    endpointName: 'WS-IT-015',
    ipAddress: '192.168.10.115',
    operatingSystem: 'Windows 10 Pro',
    criticalGroups: ['Administrators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:20 AM',
    riskLevel: 'Medium',
    location: 'IT Department',
    owner: 'David Miller',
    department: 'IT Operations'
  },
  {
    id: '5',
    endpointName: 'LAP-ADMIN-003',
    ipAddress: '192.168.10.103',
    operatingSystem: 'Windows 11 Pro',
    criticalGroups: ['Domain Admins', 'Enterprise Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:15 AM',
    riskLevel: 'Critical',
    location: 'Remote',
    owner: 'Jennifer Lee',
    department: 'IT Infrastructure'
  },
  {
    id: '6',
    endpointName: 'WS-SEC-002',
    ipAddress: '192.168.20.51',
    operatingSystem: 'Windows 11 Pro',
    criticalGroups: ['Administrators', 'Account Operators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:10 AM',
    riskLevel: 'High',
    location: 'Security Office',
    owner: 'Robert Taylor',
    department: 'IT Security'
  },
  {
    id: '7',
    endpointName: 'LAP-IT-025',
    ipAddress: '192.168.10.125',
    operatingSystem: 'Windows 10 Pro',
    criticalGroups: ['Administrators'],
    status: 'Offline',
    lastSeen: '2024-12-23 05:30 PM',
    riskLevel: 'Medium',
    location: 'Remote',
    owner: 'Emily Watson',
    department: 'IT Operations'
  },
  {
    id: '8',
    endpointName: 'WS-NET-001',
    ipAddress: '192.168.30.10',
    operatingSystem: 'Windows 11 Pro',
    criticalGroups: ['Administrators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:22 AM',
    riskLevel: 'Medium',
    location: 'Network Operations',
    owner: 'Alex Rodriguez',
    department: 'Network Team'
  }
];

interface CriticalEndpointsViewProps {
  onBack: () => void;
  onEndpointClick?: (endpointId: string) => void;
}

export function CriticalEndpointsView({ onBack, onEndpointClick }: CriticalEndpointsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Online' | 'Offline'>('All');

  const filteredEndpoints = mockEndpoints.filter(endpoint => {
    const matchesSearch =
      endpoint.endpointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.criticalGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRisk = filterRisk === 'All' || endpoint.riskLevel === filterRisk;
    const matchesStatus = filterStatus === 'All' || endpoint.status === filterStatus;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const criticalCount = mockEndpoints.filter(e => e.riskLevel === 'Critical').length;
  const highCount = mockEndpoints.filter(e => e.riskLevel === 'High').length;
  const mediumCount = mockEndpoints.filter(e => e.riskLevel === 'Medium').length;
  const onlineCount = mockEndpoints.filter(e => e.status === 'Online').length;

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <Monitor className="text-blue-600" size={32} />
            <div>
              <h1>Critical Group Endpoints</h1>
              <p className="text-sm text-gray-600">Endpoints that are members of critical security groups</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Endpoints</p>
                <p className="text-2xl font-semibold text-blue-600">{mockEndpoints.length}</p>
              </div>
              <Monitor className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-2xl font-semibold text-green-600">{onlineCount}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEndpoints.length} of {mockEndpoints.length} endpoints
          </div>
        </div>

        {/* Endpoints Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critical Groups</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEndpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Monitor className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div
                            onClick={() => onEndpointClick && onEndpointClick(endpoint.id)}
                            className={`font-medium text-gray-900 ${onEndpointClick ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                          >
                            {endpoint.endpointName}
                          </div>
                          <div className="text-xs text-gray-500">{endpoint.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {endpoint.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {endpoint.operatingSystem}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {endpoint.criticalGroups.map((group, idx) => (
                          <span key={idx} className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <Shield className="mr-1" size={12} />
                            {group}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {endpoint.status === 'Online' ? (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle size={16} />
                          Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-red-600">
                          <XCircle size={16} />
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{endpoint.owner}</div>
                      <div className="text-xs text-gray-500">{endpoint.location}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
