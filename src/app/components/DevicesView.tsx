import { ArrowLeft, HardDrive, Search, Monitor, Server, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface Device {
  id: string;
  deviceName: string;
  deviceType: 'Workstation' | 'Server' | 'Mobile' | 'Virtual Machine';
  operatingSystem: string;
  ipAddress: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
  location: string;
  owner: string;
  joinedDate: string;
  lastLogon: string;
  riskScore: number;
  riskBand: 'High' | 'Medium' | 'Low';
}

const mockDevices: Device[] = [
  {
    id: '1',
    deviceName: 'WS-ENG-001',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    ipAddress: '192.168.1.101',
    status: 'Online',
    lastSeen: '2024-12-22 11:45 AM',
    location: 'Engineering Floor 3',
    owner: 'John Doe',
    joinedDate: '2023-03-15',
    lastLogon: '2024-12-22 08:30 AM',
    riskScore: 75,
    riskBand: 'High'
  },
  {
    id: '2',
    deviceName: 'SRV-SQL-01',
    deviceType: 'Server',
    operatingSystem: 'Windows Server 2022',
    ipAddress: '192.168.10.50',
    status: 'Online',
    lastSeen: '2024-12-22 11:47 AM',
    location: 'Data Center Rack 12',
    owner: 'IT Operations',
    joinedDate: '2021-06-10',
    lastLogon: '2024-12-22 12:00 AM',
    riskScore: 90,
    riskBand: 'High'
  },
  {
    id: '3',
    deviceName: 'WS-FIN-012',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 10 Pro',
    ipAddress: '192.168.2.45',
    status: 'Online',
    lastSeen: '2024-12-22 11:30 AM',
    location: 'Finance Department',
    owner: 'Alice Smith',
    joinedDate: '2022-08-20',
    lastLogon: '2024-12-22 09:15 AM',
    riskScore: 60,
    riskBand: 'Medium'
  },
  {
    id: '4',
    deviceName: 'LAP-SALES-089',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    ipAddress: '192.168.5.178',
    status: 'Offline',
    lastSeen: '2024-12-20 05:30 PM',
    location: 'Remote',
    owner: 'Kevin Anderson',
    joinedDate: '2023-11-05',
    lastLogon: '2024-12-20 04:45 PM',
    riskScore: 40,
    riskBand: 'Low'
  },
  {
    id: '5',
    deviceName: 'SRV-WEB-01',
    deviceType: 'Server',
    operatingSystem: 'Windows Server 2019',
    ipAddress: '192.168.10.80',
    status: 'Online',
    lastSeen: '2024-12-22 11:48 AM',
    location: 'Data Center Rack 8',
    owner: 'IT Operations',
    joinedDate: '2020-04-12',
    lastLogon: 'N/A',
    riskScore: 85,
    riskBand: 'High'
  },
  {
    id: '6',
    deviceName: 'VM-DEV-023',
    deviceType: 'Virtual Machine',
    operatingSystem: 'Windows Server 2022',
    ipAddress: '192.168.20.23',
    status: 'Online',
    lastSeen: '2024-12-22 11:40 AM',
    location: 'Virtual Environment',
    owner: 'Engineering Team',
    joinedDate: '2024-01-15',
    lastLogon: '2024-12-22 10:20 AM',
    riskScore: 70,
    riskBand: 'Medium'
  },
  {
    id: '7',
    deviceName: 'WS-HR-007',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    ipAddress: '192.168.3.67',
    status: 'Online',
    lastSeen: '2024-12-22 11:25 AM',
    location: 'HR Department',
    owner: 'Mary Johnson',
    joinedDate: '2023-07-08',
    lastLogon: '2024-12-22 08:45 AM',
    riskScore: 55,
    riskBand: 'Medium'
  },
  {
    id: '8',
    deviceName: 'MOBILE-IT-015',
    deviceType: 'Mobile',
    operatingSystem: 'iOS 17.2',
    ipAddress: '192.168.100.45',
    status: 'Online',
    lastSeen: '2024-12-22 11:35 AM',
    location: 'Mobile Device',
    owner: 'Lisa Martinez',
    joinedDate: '2024-05-20',
    lastLogon: '2024-12-22 07:30 AM',
    riskScore: 30,
    riskBand: 'Low'
  },
  {
    id: '9',
    deviceName: 'SRV-BACKUP-01',
    deviceType: 'Server',
    operatingSystem: 'Windows Server 2022',
    ipAddress: '192.168.10.100',
    status: 'Online',
    lastSeen: '2024-12-22 11:50 AM',
    location: 'Data Center Rack 15',
    owner: 'IT Operations',
    joinedDate: '2022-02-10',
    lastLogon: 'N/A',
    riskScore: 80,
    riskBand: 'High'
  },
  {
    id: '10',
    deviceName: 'LAP-MKT-034',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    ipAddress: '192.168.4.134',
    status: 'Offline',
    lastSeen: '2024-12-21 03:15 PM',
    location: 'Marketing Department',
    owner: 'Carol Davis',
    joinedDate: '2023-09-12',
    lastLogon: '2024-12-21 02:30 PM',
    riskScore: 45,
    riskBand: 'Low'
  }
];

interface DevicesViewProps {
  onBack: () => void;
  onDeviceClick?: (deviceId: string) => void;
}

export function DevicesView({ onBack, onDeviceClick }: DevicesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Workstation' | 'Server' | 'Mobile' | 'Virtual Machine'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Online' | 'Offline'>('All');
  const [filterRisk, setFilterRisk] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = 
      device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.operatingSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || device.deviceType === filterType;
    const matchesStatus = filterStatus === 'All' || device.status === filterStatus;
    const matchesRisk = filterRisk === 'All' || device.riskBand === filterRisk;

    return matchesSearch && matchesType && matchesStatus && matchesRisk;
  });

  const onlineDevices = mockDevices.filter(d => d.status === 'Online').length;
  const offlineDevices = mockDevices.filter(d => d.status === 'Offline').length;
  const workstations = mockDevices.filter(d => d.deviceType === 'Workstation').length;
  const servers = mockDevices.filter(d => d.deviceType === 'Server').length;

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Workstation': return <Monitor className="text-blue-600" size={20} />;
      case 'Server': return <Server className="text-purple-600" size={20} />;
      case 'Mobile': return <Smartphone className="text-green-600" size={20} />;
      case 'Virtual Machine': return <HardDrive className="text-orange-600" size={20} />;
      default: return <HardDrive className="text-gray-600" size={20} />;
    }
  };

  const getDeviceIconBg = (type: string) => {
    switch (type) {
      case 'Workstation': return 'bg-blue-100';
      case 'Server': return 'bg-purple-100';
      case 'Mobile': return 'bg-green-100';
      case 'Virtual Machine': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  const getRiskBadgeColor = (riskBand: Device['riskBand']) => {
    switch (riskBand) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
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
            <HardDrive className="text-blue-600" size={32} />
            <div>
              <h1>Device Management</h1>
              <p className="text-sm text-gray-600">All registered devices in Active Directory</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Devices</p>
                <p className="text-2xl font-semibold text-green-600">{onlineDevices}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline Devices</p>
                <p className="text-2xl font-semibold text-red-600">{offlineDevices}</p>
              </div>
              <XCircle className="text-red-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workstations</p>
                <p className="text-2xl font-semibold text-blue-600">{workstations}</p>
              </div>
              <Monitor className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Servers</p>
                <p className="text-2xl font-semibold text-purple-600">{servers}</p>
              </div>
              <Server className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Workstation">Workstation</option>
              <option value="Server">Server</option>
              <option value="Mobile">Mobile</option>
              <option value="Virtual Machine">Virtual Machine</option>
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
            
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDevices.length} of {mockDevices.length} devices
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Band</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getDeviceIconBg(device.deviceType)}`}>
                          {getDeviceIcon(device.deviceType)}
                        </div>
                        <div className="ml-4">
                          <div 
                            onClick={() => onDeviceClick && onDeviceClick(device.id)}
                            className={`font-medium text-gray-900 ${onDeviceClick ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                          >
                            {device.deviceName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.deviceType === 'Workstation' ? 'bg-blue-100 text-blue-800' :
                        device.deviceType === 'Server' ? 'bg-purple-100 text-purple-800' :
                        device.deviceType === 'Mobile' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {device.deviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.operatingSystem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {device.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.owner}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {device.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.riskScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeColor(device.riskBand)}`}>
                        {device.riskBand}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.lastSeen}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}
