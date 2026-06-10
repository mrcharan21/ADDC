import { ArrowLeft, Server, Search, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface CriticalServer {
  id: string;
  serverName: string;
  ipAddress: string;
  operatingSystem: string;
  criticalGroups: string[];
  status: 'Online' | 'Offline';
  lastSeen: string;
  riskLevel: 'Critical' | 'High' | 'Medium';
  location: string;
  owner: string;
}

const mockServers: CriticalServer[] = [
  {
    id: '1',
    serverName: 'SERVER-DC01',
    ipAddress: '10.0.0.1',
    operatingSystem: 'Windows Server 2022',
    criticalGroups: ['Domain Admins', 'Enterprise Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:30 AM',
    riskLevel: 'Critical',
    location: 'Data Center Rack 1',
    owner: 'IT Infrastructure'
  },
  {
    id: '2',
    serverName: 'SERVER-DC02',
    ipAddress: '10.0.0.2',
    operatingSystem: 'Windows Server 2022',
    criticalGroups: ['Domain Admins', 'Enterprise Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:30 AM',
    riskLevel: 'Critical',
    location: 'Data Center Rack 1',
    owner: 'IT Infrastructure'
  },
  {
    id: '3',
    serverName: 'SERVER-SQL01',
    ipAddress: '10.0.2.10',
    operatingSystem: 'Windows Server 2022',
    criticalGroups: ['Administrators', 'Account Operators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:25 AM',
    riskLevel: 'High',
    location: 'Data Center Rack 5',
    owner: 'Database Team'
  },
  {
    id: '4',
    serverName: 'SERVER-EXCH01',
    ipAddress: '10.0.3.10',
    operatingSystem: 'Windows Server 2019',
    criticalGroups: ['Administrators', 'Schema Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:28 AM',
    riskLevel: 'High',
    location: 'Data Center Rack 8',
    owner: 'Email Team'
  },
  {
    id: '5',
    serverName: 'SERVER-FILE01',
    ipAddress: '10.0.4.10',
    operatingSystem: 'Windows Server 2022',
    criticalGroups: ['Administrators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:20 AM',
    riskLevel: 'Medium',
    location: 'Data Center Rack 12',
    owner: 'Storage Team'
  },
  {
    id: '6',
    serverName: 'SERVER-APP01',
    ipAddress: '10.0.5.10',
    operatingSystem: 'Windows Server 2019',
    criticalGroups: ['Administrators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:15 AM',
    riskLevel: 'Medium',
    location: 'Data Center Rack 15',
    owner: 'Application Team'
  },
  {
    id: '7',
    serverName: 'SERVER-WEB01',
    ipAddress: '10.0.6.10',
    operatingSystem: 'Windows Server 2022',
    criticalGroups: ['Administrators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:22 AM',
    riskLevel: 'Medium',
    location: 'DMZ Zone',
    owner: 'Web Team'
  },
  {
    id: '8',
    serverName: 'SERVER-BACKUP01',
    ipAddress: '10.0.7.10',
    operatingSystem: 'Windows Server 2022',
    criticalGroups: ['Administrators', 'Account Operators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:10 AM',
    riskLevel: 'High',
    location: 'Data Center Rack 20',
    owner: 'Backup Team'
  }
];

interface CriticalServersViewProps {
  onBack: () => void;
  onServerClick?: (serverId: string) => void;
}

export function CriticalServersView({ onBack, onServerClick }: CriticalServersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Online' | 'Offline'>('All');

  const filteredServers = mockServers.filter(server => {
    const matchesSearch =
      server.serverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.criticalGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRisk = filterRisk === 'All' || server.riskLevel === filterRisk;
    const matchesStatus = filterStatus === 'All' || server.status === filterStatus;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const criticalCount = mockServers.filter(s => s.riskLevel === 'Critical').length;
  const highCount = mockServers.filter(s => s.riskLevel === 'High').length;
  const mediumCount = mockServers.filter(s => s.riskLevel === 'Medium').length;
  const onlineCount = mockServers.filter(s => s.status === 'Online').length;

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
            <Server className="text-purple-600" size={32} />
            <div>
              <h1>Critical Group Servers</h1>
              <p className="text-sm text-gray-600">Servers that are members of critical security groups</p>
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
                <p className="text-sm text-gray-600">Total Servers</p>
                <p className="text-2xl font-semibold text-purple-600">{mockServers.length}</p>
              </div>
              <Server className="text-purple-500" size={32} />
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
                placeholder="Search servers..."
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
            Showing {filteredServers.length} of {mockServers.length} servers
          </div>
        </div>

        {/* Servers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critical Groups</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServers.map((server) => (
                  <tr key={server.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Server className="text-purple-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div
                            onClick={() => onServerClick && onServerClick(server.id)}
                            className={`font-medium text-gray-900 ${onServerClick ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                          >
                            {server.serverName}
                          </div>
                          <div className="text-xs text-gray-500">{server.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {server.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {server.operatingSystem}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {server.criticalGroups.map((group, idx) => (
                          <span key={idx} className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <Shield className="mr-1" size={12} />
                            {group}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {server.status === 'Online' ? (
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {server.location}
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
