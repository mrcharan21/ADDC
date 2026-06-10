import { ArrowLeft, Monitor, Shield, AlertTriangle, CheckCircle, Cpu, MemoryStick, Database, Wifi, Clock, User, Activity, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EndpointDetail {
  id: string;
  endpointName: string;
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
  department: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  domainJoinedDate: string;
  lastReboot: string;
  lastLogin: string;
  processor: string;
  ram: string;
  storage: string;
  installedSoftware: number;
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

const mockEndpointDetails: Record<string, EndpointDetail> = {
  '1': {
    id: '1',
    endpointName: 'WS-ADMIN-001',
    ipAddress: '192.168.10.101',
    macAddress: '00:1A:2B:3C:4D:5E',
    operatingSystem: 'Windows 11 Pro',
    osVersion: '22H2 - Build 22621.2861',
    criticalGroups: ['Domain Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:30 AM',
    riskLevel: 'Critical',
    location: 'IT Department',
    owner: 'John Smith',
    department: 'IT Infrastructure',
    manufacturer: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'WS-ADMIN-001-2023',
    domainJoinedDate: '2023-01-15',
    lastReboot: '2024-12-23 06:00 PM',
    lastLogin: '2024-12-24 08:30 AM',
    processor: 'Intel Core i7-11700 @ 2.5GHz (8 cores)',
    ram: '32 GB DDR4',
    storage: '512 GB NVMe SSD',
    installedSoftware: 45
  },
  '2': {
    id: '2',
    endpointName: 'WS-ADMIN-002',
    ipAddress: '192.168.10.102',
    macAddress: '00:1A:2B:3C:4D:5F',
    operatingSystem: 'Windows 11 Pro',
    osVersion: '22H2 - Build 22621.2861',
    criticalGroups: ['Domain Admins'],
    status: 'Online',
    lastSeen: '2024-12-24 09:28 AM',
    riskLevel: 'Critical',
    location: 'IT Department',
    owner: 'Sarah Johnson',
    department: 'IT Infrastructure',
    manufacturer: 'HP',
    model: 'EliteDesk 800 G8',
    serialNumber: 'WS-ADMIN-002-2023',
    domainJoinedDate: '2023-02-10',
    lastReboot: '2024-12-23 06:15 PM',
    lastLogin: '2024-12-24 08:15 AM',
    processor: 'Intel Core i7-11700 @ 2.5GHz (8 cores)',
    ram: '32 GB DDR4',
    storage: '1 TB NVMe SSD',
    installedSoftware: 52
  },
  '3': {
    id: '3',
    endpointName: 'LAP-SEC-001',
    ipAddress: '192.168.20.50',
    macAddress: '00:2B:3C:4D:5E:6F',
    operatingSystem: 'Windows 11 Pro',
    osVersion: '23H2 - Build 22631.2861',
    criticalGroups: ['Administrators', 'Account Operators'],
    status: 'Online',
    lastSeen: '2024-12-24 09:25 AM',
    riskLevel: 'High',
    location: 'Security Office',
    owner: 'Michael Chen',
    department: 'IT Security',
    manufacturer: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 11',
    serialNumber: 'LAP-SEC-001-2023',
    domainJoinedDate: '2023-03-20',
    lastReboot: '2024-12-22 07:00 PM',
    lastLogin: '2024-12-24 08:45 AM',
    processor: 'Intel Core i7-1355U @ 1.7GHz (10 cores)',
    ram: '16 GB LPDDR5',
    storage: '512 GB NVMe SSD',
    installedSoftware: 38
  }
};

const mockGroupHistory: GroupMembershipHistory[] = [
  { date: '2024-11-01', groupsCount: 5, criticalGroupsCount: 1 },
  { date: '2024-11-08', groupsCount: 5, criticalGroupsCount: 1 },
  { date: '2024-11-15', groupsCount: 6, criticalGroupsCount: 1 },
  { date: '2024-11-22', groupsCount: 6, criticalGroupsCount: 1 },
  { date: '2024-11-29', groupsCount: 7, criticalGroupsCount: 1 },
  { date: '2024-12-06', groupsCount: 7, criticalGroupsCount: 1 },
  { date: '2024-12-13', groupsCount: 8, criticalGroupsCount: 1 },
  { date: '2024-12-20', groupsCount: 8, criticalGroupsCount: 1 },
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    timestamp: '2024-12-24 08:30 AM',
    eventType: 'Info',
    description: 'User successfully logged in with domain admin privileges',
    group: 'Domain Admins'
  },
  {
    id: '2',
    timestamp: '2024-12-23 03:15 PM',
    eventType: 'Warning',
    description: 'Elevated privileges used for system modification',
    group: 'Administrators'
  },
  {
    id: '3',
    timestamp: '2024-12-22 11:20 AM',
    eventType: 'Critical',
    description: 'Attempt to access sensitive domain resources',
    group: 'Domain Admins'
  },
  {
    id: '4',
    timestamp: '2024-12-21 02:45 PM',
    eventType: 'Info',
    description: 'Security policy successfully applied',
    group: 'Domain Admins'
  },
  {
    id: '5',
    timestamp: '2024-12-20 10:15 AM',
    eventType: 'Warning',
    description: 'User added to critical security group',
    group: 'Administrators'
  }
];

interface CriticalEndpointDetailViewProps {
  endpointId: string;
  onBack: () => void;
}

export function CriticalEndpointDetailView({ endpointId, onBack }: CriticalEndpointDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'security' | 'activity'>('overview');

  const endpoint = mockEndpointDetails[endpointId];

  if (!endpoint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-600">Endpoint not found</h2>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to Critical Endpoints
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
            <span>Back to Critical Endpoints</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Critical Endpoints</span>
            <span>/</span>
            <span className="text-gray-900">{endpoint.endpointName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Monitor className="text-blue-600" size={32} />
              </div>
              <div>
                <h1>{endpoint.endpointName}</h1>
                <p className="text-sm text-gray-600">{endpoint.owner} • {endpoint.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getRiskBg(endpoint.riskLevel)} ${getRiskColor(endpoint.riskLevel)}`}>
                {endpoint.riskLevel} Risk
              </span>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                endpoint.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {endpoint.status}
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
            <p className="text-2xl font-semibold text-red-600">{endpoint.criticalGroups.length}</p>
            <p className="text-xs text-gray-500 mt-1">Security group memberships</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Last Login</p>
              <User className="text-blue-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{endpoint.lastLogin}</p>
            <p className="text-xs text-gray-500 mt-1">User: {endpoint.owner}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Installed Software</p>
              <Activity className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-purple-600">{endpoint.installedSoftware}</p>
            <p className="text-xs text-gray-500 mt-1">Applications</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Last Reboot</p>
              <Clock className="text-green-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{endpoint.lastReboot}</p>
            <p className="text-xs text-gray-500 mt-1">System restart</p>
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
                Critical Groups ({endpoint.criticalGroups.length})
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoint Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Endpoint Name:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.endpointName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">IP Address:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{endpoint.ipAddress}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">MAC Address:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{endpoint.macAddress}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Operating System:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.operatingSystem}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">OS Version:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.osVersion}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Owner:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.owner}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Department:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.department}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.location}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Domain Joined:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.domainJoinedDate}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Last Seen:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hardware Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Manufacturer:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.manufacturer}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Model:</span>
                        <span className="text-sm font-medium text-gray-900">{endpoint.model}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Serial Number:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{endpoint.serialNumber}</span>
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
                      <p className="text-sm text-gray-600">{endpoint.processor}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <MemoryStick className="text-purple-600" size={24} />
                        <h4 className="font-semibold text-gray-900">Memory</h4>
                      </div>
                      <p className="text-sm text-gray-600">{endpoint.ram}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="text-green-600" size={24} />
                        <h4 className="font-semibold text-gray-900">Storage</h4>
                      </div>
                      <p className="text-sm text-gray-600">{endpoint.storage}</p>
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
                  {endpoint.criticalGroups.map((group, idx) => (
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
                    <span className="font-semibold">Security Recommendation:</span> This endpoint has access to critical security groups. Ensure the user ({endpoint.owner}) requires these elevated privileges and monitor activity regularly.
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
                    <p className="text-2xl font-semibold text-blue-600">8</p>
                    <p className="text-xs text-blue-700 mt-1">+3 from last month</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="text-red-600" size={20} />
                      <span className="text-sm font-medium text-red-900">Critical Groups</span>
                    </div>
                    <p className="text-2xl font-semibold text-red-600">{endpoint.criticalGroups.length}</p>
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
