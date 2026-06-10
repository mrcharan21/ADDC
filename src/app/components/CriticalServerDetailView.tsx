import { ArrowLeft, Server, Shield, AlertTriangle, CheckCircle, Cpu, MemoryStick, Database, Wifi, Calendar, Clock, User, MapPin, FileText, Activity, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ServerDetail {
  id: string;
  serverName: string;
  ipAddress: string;
  macAddress: string;
  operatingSystem: string;
  osVersion: string;
  criticalGroups: string[];
  status: 'Online' | 'Offline';
  lastSeen: string;
  riskLevel: 'Critical' | 'High' | 'Medium';
  location: string;
  owner: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  domainJoinedDate: string;
  lastReboot: string;
  uptime: string;
  processor: string;
  ram: string;
  storage: string;
  services: number;
  openPorts: number[];
}

interface GroupMembershipHistory {
  date: string;
  groupsCount: number;
  criticalGroupsCount: number;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'Warning' | 'Critical' | 'Info';
  description: string;
  group: string;
}

const mockServerDetails: Record<string, ServerDetail> = {
  '1': {
    id: '1',
    serverName: 'SERVER-DC01',
    ipAddress: '10.0.0.1',
    macAddress: '00:15:5D:01:02:03',
    operatingSystem: 'Windows Server 2022',
    osVersion: 'Datacenter - Build 20348.2159',
    criticalGroups: ['Domain Admins', 'Enterprise Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:30 AM',
    riskLevel: 'Critical',
    location: 'Data Center Rack 1',
    owner: 'IT Infrastructure',
    manufacturer: 'Dell',
    model: 'PowerEdge R750',
    serialNumber: 'SRV-DC01-2022-001',
    domainJoinedDate: '2020-01-15',
    lastReboot: '2024-12-15 02:00 AM',
    uptime: '9 days 7 hours',
    processor: 'Intel Xeon Gold 6338 @ 2.0GHz (32 cores)',
    ram: '128 GB DDR4 ECC',
    storage: '4 TB SSD RAID 1',
    services: 42,
    openPorts: [53, 88, 135, 389, 445, 636, 3268, 3269]
  },
  '2': {
    id: '2',
    serverName: 'SERVER-DC02',
    ipAddress: '10.0.0.2',
    macAddress: '00:15:5D:01:02:04',
    operatingSystem: 'Windows Server 2022',
    osVersion: 'Datacenter - Build 20348.2159',
    criticalGroups: ['Domain Admins', 'Enterprise Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:30 AM',
    riskLevel: 'Critical',
    location: 'Data Center Rack 1',
    owner: 'IT Infrastructure',
    manufacturer: 'HP',
    model: 'ProLiant DL380 Gen10',
    serialNumber: 'SRV-DC02-2022-002',
    domainJoinedDate: '2020-01-15',
    lastReboot: '2024-12-15 02:15 AM',
    uptime: '9 days 7 hours',
    processor: 'Intel Xeon Gold 6230 @ 2.1GHz (40 cores)',
    ram: '256 GB DDR4 ECC',
    storage: '8 TB SSD RAID 10',
    services: 45,
    openPorts: [53, 88, 135, 389, 445, 636, 3268, 3269]
  },
  '3': {
    id: '3',
    serverName: 'SERVER-SQL01',
    ipAddress: '10.0.2.10',
    macAddress: '00:15:5D:02:03:10',
    operatingSystem: 'Windows Server 2022',
    osVersion: 'Standard - Build 20348.2159',
    criticalGroups: ['Administrators', 'Account Operators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:25 AM',
    riskLevel: 'High',
    location: 'Data Center Rack 5',
    owner: 'Database Team',
    manufacturer: 'Dell',
    model: 'PowerEdge R740',
    serialNumber: 'SRV-SQL01-2021-010',
    domainJoinedDate: '2021-06-10',
    lastReboot: '2024-12-10 03:00 AM',
    uptime: '14 days 6 hours',
    processor: 'Intel Xeon Silver 4214 @ 2.2GHz (24 cores)',
    ram: '64 GB DDR4 ECC',
    storage: '2 TB SSD RAID 1',
    services: 28,
    openPorts: [445, 1433, 3389]
  }
};

const mockGroupHistory: GroupMembershipHistory[] = [
  { date: '2024-11-01', groupsCount: 8, criticalGroupsCount: 2 },
  { date: '2024-11-08', groupsCount: 8, criticalGroupsCount: 2 },
  { date: '2024-11-15', groupsCount: 9, criticalGroupsCount: 2 },
  { date: '2024-11-22', groupsCount: 9, criticalGroupsCount: 2 },
  { date: '2024-11-29', groupsCount: 10, criticalGroupsCount: 2 },
  { date: '2024-12-06', groupsCount: 10, criticalGroupsCount: 2 },
  { date: '2024-12-13', groupsCount: 10, criticalGroupsCount: 2 },
  { date: '2024-12-20', groupsCount: 11, criticalGroupsCount: 2 },
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    timestamp: '2024-12-24 08:15 AM',
    eventType: 'Info',
    description: 'Server successfully authenticated to Domain Controller',
    group: 'Domain Admins'
  },
  {
    id: '2',
    timestamp: '2024-12-23 02:30 PM',
    eventType: 'Warning',
    description: 'Elevated privileges used for system configuration',
    group: 'Administrators'
  },
  {
    id: '3',
    timestamp: '2024-12-22 10:45 AM',
    eventType: 'Critical',
    description: 'Attempt to access critical security group detected',
    group: 'Enterprise Admins'
  },
  {
    id: '4',
    timestamp: '2024-12-21 04:20 PM',
    eventType: 'Info',
    description: 'Group Policy successfully applied',
    group: 'Domain Admins'
  },
  {
    id: '5',
    timestamp: '2024-12-20 11:30 AM',
    eventType: 'Warning',
    description: 'Security group membership modified',
    group: 'Administrators'
  }
];

interface CriticalServerDetailViewProps {
  serverId: string;
  onBack: () => void;
}

export function CriticalServerDetailView({ serverId, onBack }: CriticalServerDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'security' | 'activity'>('overview');

  const server = mockServerDetails[serverId];

  if (!server) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-600">Server not found</h2>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to Critical Servers
          </button>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-100';
      case 'High': return 'bg-orange-100';
      case 'Medium': return 'bg-yellow-100';
      default: return 'bg-gray-100';
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
            <span>Back to Critical Servers</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Critical Servers</span>
            <span>/</span>
            <span className="text-gray-900">{server.serverName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Server className="text-purple-600" size={32} />
              </div>
              <div>
                <h1>{server.serverName}</h1>
                <p className="text-sm text-gray-600">{server.operatingSystem} • {server.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getRiskBg(server.riskLevel)} ${getRiskColor(server.riskLevel)}`}>
                {server.riskLevel} Risk
              </span>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                server.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {server.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Critical Groups</p>
              <Shield className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-red-600">{server.criticalGroups.length}</p>
            <p className="text-xs text-gray-500 mt-1">Security group memberships</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Uptime</p>
              <Clock className="text-green-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{server.uptime}</p>
            <p className="text-xs text-gray-500 mt-1">Last reboot: {server.lastReboot}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Running Services</p>
              <Activity className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-blue-600">{server.services}</p>
            <p className="text-xs text-gray-500 mt-1">Active services</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Open Ports</p>
              <Wifi className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-purple-600">{server.openPorts.length}</p>
            <p className="text-xs text-gray-500 mt-1">Network ports</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'groups'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Critical Groups ({server.criticalGroups.length})
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security Events
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Group Activity
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Server Name:</span>
                        <span className="text-sm font-medium text-gray-900">{server.serverName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">IP Address:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{server.ipAddress}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">MAC Address:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{server.macAddress}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Operating System:</span>
                        <span className="text-sm font-medium text-gray-900">{server.operatingSystem}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">OS Version:</span>
                        <span className="text-sm font-medium text-gray-900">{server.osVersion}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Manufacturer:</span>
                        <span className="text-sm font-medium text-gray-900">{server.manufacturer}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Model:</span>
                        <span className="text-sm font-medium text-gray-900">{server.model}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Serial Number:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{server.serialNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm font-medium text-gray-900">{server.location}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Owner:</span>
                        <span className="text-sm font-medium text-gray-900">{server.owner}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hardware Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Cpu className="text-blue-600" size={24} />
                        <h4 className="font-semibold text-gray-900">Processor</h4>
                      </div>
                      <p className="text-sm text-gray-600">{server.processor}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <MemoryStick className="text-purple-600" size={24} />
                        <h4 className="font-semibold text-gray-900">Memory</h4>
                      </div>
                      <p className="text-sm text-gray-600">{server.ram}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="text-green-600" size={24} />
                        <h4 className="font-semibold text-gray-900">Storage</h4>
                      </div>
                      <p className="text-sm text-gray-600">{server.storage}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Configuration</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Open Ports:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{server.openPorts.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Security Groups</h3>
                <div className="space-y-3">
                  {server.criticalGroups.map((group, idx) => (
                    <div key={idx} className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-100">
                            <Shield className="text-red-600" size={20} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{group}</h4>
                            <p className="text-sm text-gray-600">Critical security group membership</p>
                          </div>
                        </div>
                        <AlertTriangle className="text-red-600" size={24} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Security Recommendation:</span> Review and audit server's membership in these critical groups regularly. Ensure proper justification and authorization for elevated privileges.
                  </p>
                </div>
              </div>
            )}

            {/* Security Events Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
                <div className="space-y-3">
                  {mockSecurityEvents.map((event) => (
                    <div key={event.id} className={`rounded-lg p-4 border ${
                      event.eventType === 'Critical' ? 'bg-red-50 border-red-200' :
                      event.eventType === 'Warning' ? 'bg-orange-50 border-orange-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          event.eventType === 'Critical' ? 'bg-red-100' :
                          event.eventType === 'Warning' ? 'bg-orange-100' :
                          'bg-blue-100'
                        }`}>
                          {event.eventType === 'Critical' ? (
                            <AlertTriangle className="text-red-600" size={20} />
                          ) : event.eventType === 'Warning' ? (
                            <AlertTriangle className="text-orange-600" size={20} />
                          ) : (
                            <CheckCircle className="text-blue-600" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.eventType === 'Critical' ? 'bg-red-100 text-red-800' :
                              event.eventType === 'Warning' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {event.eventType}
                            </span>
                            <span className="text-xs text-gray-500">{event.timestamp}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{event.description}</p>
                          <p className="text-xs text-gray-600">Related Group: <span className="font-semibold">{event.group}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Membership History</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockGroupHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="groupsCount" 
                      stroke="#3b82f6" 
                      name="Total Groups"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="criticalGroupsCount" 
                      stroke="#ef4444" 
                      name="Critical Groups"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-blue-600" size={20} />
                      <span className="text-sm font-medium text-blue-900">Total Groups</span>
                    </div>
                    <p className="text-2xl font-semibold text-blue-600">11</p>
                    <p className="text-xs text-blue-700 mt-1">+3 from last month</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="text-red-600" size={20} />
                      <span className="text-sm font-medium text-red-900">Critical Groups</span>
                    </div>
                    <p className="text-2xl font-semibold text-red-600">2</p>
                    <p className="text-xs text-red-700 mt-1">No change</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
