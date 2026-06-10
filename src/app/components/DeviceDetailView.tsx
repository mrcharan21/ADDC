import { ArrowLeft, Monitor, Server, Smartphone, HardDrive, CheckCircle, XCircle, Cpu, MemoryStick, Database, Wifi, Shield, Calendar, Clock, User, MapPin, FileText, Activity, AlertTriangle, Package } from 'lucide-react';
import { useState } from 'react';

interface DeviceInfo {
  id: string;
  deviceName: string;
  deviceType: 'Workstation' | 'Server' | 'Mobile' | 'Virtual Machine';
  operatingSystem: string;
  osVersion: string;
  osBuild: string;
  ipAddress: string;
  macAddress: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
  location: string;
  owner: string;
  joinedDate: string;
  lastLogon: string;
  lastReboot: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  ou: string;
}

interface HardwareSpec {
  processor: string;
  cores: number;
  ram: string;
  storage: string;
  graphicsCard?: string;
}

interface NetworkInfo {
  ipv4Address: string;
  ipv6Address: string;
  macAddress: string;
  subnetMask: string;
  defaultGateway: string;
  dnsServers: string[];
  dhcpEnabled: boolean;
}

interface SecurityInfo {
  antivirusStatus: 'Active' | 'Inactive' | 'Not Installed';
  antivirusProduct: string;
  lastScan: string;
  firewallStatus: 'Enabled' | 'Disabled';
  encryptionStatus: 'Encrypted' | 'Not Encrypted';
  lastPatchDate: string;
  pendingUpdates: number;
  securityScore: number;
}

interface AppliedGPO {
  id: string;
  gpoName: string;
  appliedDate: string;
  status: 'Success' | 'Failed';
}

interface UserLoginHistory {
  id: string;
  username: string;
  loginTime: string;
  logoutTime: string;
  duration: string;
  loginType: 'Local' | 'Remote';
}

interface EventLog {
  id: string;
  timestamp: string;
  eventType: 'Information' | 'Warning' | 'Error';
  source: string;
  eventId: string;
  description: string;
}

// Mock device data
const mockDeviceInfo: Record<string, DeviceInfo> = {
  '1': {
    id: '1',
    deviceName: 'WS-ENG-001',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    osVersion: '22H2',
    osBuild: '22621.2861',
    ipAddress: '192.168.1.101',
    macAddress: '00:1A:2B:3C:4D:5E',
    status: 'Online',
    lastSeen: '2024-12-22 11:45 AM',
    location: 'Engineering Floor 3',
    owner: 'John Doe',
    joinedDate: '2023-03-15',
    lastLogon: '2024-12-22 08:30 AM',
    lastReboot: '2024-12-20 06:00 PM',
    manufacturer: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'DL-7090-2023-001',
    purchaseDate: '2023-03-01',
    warrantyExpiry: '2026-03-01',
    ou: 'OU=Workstations,DC=company,DC=local'
  },
  '2': {
    id: '2',
    deviceName: 'SRV-SQL-01',
    deviceType: 'Server',
    operatingSystem: 'Windows Server 2022',
    osVersion: 'Datacenter',
    osBuild: '20348.2159',
    ipAddress: '192.168.10.50',
    macAddress: '00:2B:3C:4D:5E:6F',
    status: 'Online',
    lastSeen: '2024-12-22 11:47 AM',
    location: 'Data Center Rack 12',
    owner: 'IT Operations',
    joinedDate: '2021-06-10',
    lastLogon: '2024-12-22 12:00 AM',
    lastReboot: '2024-12-15 02:00 AM',
    manufacturer: 'HP',
    model: 'ProLiant DL380 Gen10',
    serialNumber: 'HP-DL380-2021-050',
    purchaseDate: '2021-06-01',
    warrantyExpiry: '2026-06-01',
    ou: 'OU=Servers,DC=company,DC=local'
  },
  '3': {
    id: '3',
    deviceName: 'WS-FIN-012',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 10 Pro',
    osVersion: '22H2',
    osBuild: '19045.3803',
    ipAddress: '192.168.2.45',
    macAddress: '00:3C:4D:5E:6F:7A',
    status: 'Online',
    lastSeen: '2024-12-22 11:30 AM',
    location: 'Finance Department',
    owner: 'Alice Smith',
    joinedDate: '2022-08-20',
    lastLogon: '2024-12-22 09:15 AM',
    lastReboot: '2024-12-21 06:30 PM',
    manufacturer: 'Lenovo',
    model: 'ThinkCentre M720q',
    serialNumber: 'LN-M720-2022-012',
    purchaseDate: '2022-08-01',
    warrantyExpiry: '2025-08-01',
    ou: 'OU=Workstations,DC=company,DC=local'
  },
  '4': {
    id: '4',
    deviceName: 'LAP-SALES-089',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    osVersion: '23H2',
    osBuild: '22631.2861',
    ipAddress: '192.168.5.178',
    macAddress: '00:4D:5E:6F:7A:8B',
    status: 'Offline',
    lastSeen: '2024-12-20 05:30 PM',
    location: 'Remote',
    owner: 'Kevin Anderson',
    joinedDate: '2023-11-05',
    lastLogon: '2024-12-20 04:45 PM',
    lastReboot: '2024-12-20 09:00 AM',
    manufacturer: 'HP',
    model: 'EliteBook 840 G9',
    serialNumber: 'HP-EB840-2023-089',
    purchaseDate: '2023-10-15',
    warrantyExpiry: '2026-10-15',
    ou: 'OU=Workstations,DC=company,DC=local'
  },
  '5': {
    id: '5',
    deviceName: 'SRV-WEB-01',
    deviceType: 'Server',
    operatingSystem: 'Windows Server 2019',
    osVersion: 'Standard',
    osBuild: '17763.5329',
    ipAddress: '192.168.10.80',
    macAddress: '00:5E:6F:7A:8B:9C',
    status: 'Online',
    lastSeen: '2024-12-22 11:48 AM',
    location: 'Data Center Rack 8',
    owner: 'IT Operations',
    joinedDate: '2020-04-12',
    lastLogon: 'N/A',
    lastReboot: '2024-12-10 03:00 AM',
    manufacturer: 'Dell',
    model: 'PowerEdge R740',
    serialNumber: 'DL-R740-2020-080',
    purchaseDate: '2020-04-01',
    warrantyExpiry: '2025-04-01',
    ou: 'OU=Servers,DC=company,DC=local'
  },
  '6': {
    id: '6',
    deviceName: 'VM-DEV-023',
    deviceType: 'Virtual Machine',
    operatingSystem: 'Windows Server 2022',
    osVersion: 'Standard',
    osBuild: '20348.2159',
    ipAddress: '192.168.20.23',
    macAddress: '00:6F:7A:8B:9C:AD',
    status: 'Online',
    lastSeen: '2024-12-22 11:40 AM',
    location: 'Virtual Environment',
    owner: 'Engineering Team',
    joinedDate: '2024-01-15',
    lastLogon: '2024-12-22 10:20 AM',
    lastReboot: '2024-12-22 08:00 AM',
    manufacturer: 'VMware',
    model: 'Virtual Machine',
    serialNumber: 'VM-2024-023',
    purchaseDate: '2024-01-15',
    warrantyExpiry: 'N/A',
    ou: 'OU=Servers,DC=company,DC=local'
  },
  '7': {
    id: '7',
    deviceName: 'WS-HR-007',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    osVersion: '22H2',
    osBuild: '22621.2861',
    ipAddress: '192.168.3.67',
    macAddress: '00:7A:8B:9C:AD:BE',
    status: 'Online',
    lastSeen: '2024-12-22 11:25 AM',
    location: 'HR Department',
    owner: 'Mary Johnson',
    joinedDate: '2023-07-08',
    lastLogon: '2024-12-22 08:45 AM',
    lastReboot: '2024-12-21 07:00 PM',
    manufacturer: 'Dell',
    model: 'Latitude 5430',
    serialNumber: 'DL-L5430-2023-007',
    purchaseDate: '2023-07-01',
    warrantyExpiry: '2026-07-01',
    ou: 'OU=Workstations,DC=company,DC=local'
  },
  '8': {
    id: '8',
    deviceName: 'MOBILE-IT-015',
    deviceType: 'Mobile',
    operatingSystem: 'iOS 17.2',
    osVersion: '17.2',
    osBuild: '21C52',
    ipAddress: '192.168.100.45',
    macAddress: '00:8B:9C:AD:BE:CF',
    status: 'Online',
    lastSeen: '2024-12-22 11:35 AM',
    location: 'Mobile Device',
    owner: 'Lisa Martinez',
    joinedDate: '2024-05-20',
    lastLogon: '2024-12-22 07:30 AM',
    lastReboot: '2024-12-21 11:00 PM',
    manufacturer: 'Apple',
    model: 'iPhone 15 Pro',
    serialNumber: 'APPL-IP15P-2024-015',
    purchaseDate: '2024-05-15',
    warrantyExpiry: '2025-05-15',
    ou: 'OU=Mobile Devices,DC=company,DC=local'
  },
  '9': {
    id: '9',
    deviceName: 'SRV-BACKUP-01',
    deviceType: 'Server',
    operatingSystem: 'Windows Server 2022',
    osVersion: 'Datacenter',
    osBuild: '20348.2159',
    ipAddress: '192.168.10.100',
    macAddress: '00:9C:AD:BE:CF:DA',
    status: 'Online',
    lastSeen: '2024-12-22 11:50 AM',
    location: 'Data Center Rack 15',
    owner: 'IT Operations',
    joinedDate: '2022-02-10',
    lastLogon: 'N/A',
    lastReboot: '2024-12-18 04:00 AM',
    manufacturer: 'HP',
    model: 'ProLiant DL360 Gen10',
    serialNumber: 'HP-DL360-2022-100',
    purchaseDate: '2022-02-01',
    warrantyExpiry: '2027-02-01',
    ou: 'OU=Servers,DC=company,DC=local'
  },
  '10': {
    id: '10',
    deviceName: 'LAP-MKT-034',
    deviceType: 'Workstation',
    operatingSystem: 'Windows 11 Pro',
    osVersion: '23H2',
    osBuild: '22631.2861',
    ipAddress: '192.168.4.134',
    macAddress: '00:AD:BE:CF:DA:EB',
    status: 'Offline',
    lastSeen: '2024-12-21 03:15 PM',
    location: 'Marketing Department',
    owner: 'Carol Davis',
    joinedDate: '2023-09-12',
    lastLogon: '2024-12-21 02:30 PM',
    lastReboot: '2024-12-21 09:00 AM',
    manufacturer: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 11',
    serialNumber: 'LN-X1C11-2023-034',
    purchaseDate: '2023-09-01',
    warrantyExpiry: '2026-09-01',
    ou: 'OU=Workstations,DC=company,DC=local'
  }
};

// Mock hardware specs
const mockHardwareSpecs: Record<string, HardwareSpec> = {
  '1': { processor: 'Intel Core i7-11700', cores: 8, ram: '32 GB DDR4', storage: '512 GB NVMe SSD', graphicsCard: 'Intel UHD Graphics 750' },
  '2': { processor: 'Intel Xeon Gold 6338', cores: 32, ram: '128 GB DDR4 ECC', storage: '2 TB SSD RAID 1', graphicsCard: 'N/A' },
  '3': { processor: 'Intel Core i5-10400', cores: 6, ram: '16 GB DDR4', storage: '256 GB SSD', graphicsCard: 'Intel UHD Graphics 630' },
  '4': { processor: 'Intel Core i7-1265U', cores: 10, ram: '16 GB DDR4', storage: '512 GB NVMe SSD', graphicsCard: 'Intel Iris Xe Graphics' },
  '5': { processor: 'Intel Xeon Silver 4214', cores: 24, ram: '64 GB DDR4 ECC', storage: '1 TB SSD RAID 1', graphicsCard: 'N/A' },
  '6': { processor: 'Virtual 8 vCPUs', cores: 8, ram: '16 GB', storage: '200 GB Virtual Disk' },
  '7': { processor: 'Intel Core i5-1235U', cores: 10, ram: '16 GB DDR4', storage: '256 GB NVMe SSD', graphicsCard: 'Intel Iris Xe Graphics' },
  '8': { processor: 'Apple A17 Pro', cores: 6, ram: '8 GB', storage: '256 GB' },
  '9': { processor: 'Intel Xeon Gold 6230', cores: 40, ram: '256 GB DDR4 ECC', storage: '8 TB SSD RAID 10', graphicsCard: 'N/A' },
  '10': { processor: 'Intel Core i7-1355U', cores: 10, ram: '16 GB LPDDR5', storage: '512 GB NVMe SSD', graphicsCard: 'Intel Iris Xe Graphics' }
};

// Mock network info
const mockNetworkInfo: Record<string, NetworkInfo> = {
  '1': {
    ipv4Address: '192.168.1.101',
    ipv6Address: 'fe80::1a2b:3c4d:5e6f:7a8b',
    macAddress: '00:1A:2B:3C:4D:5E',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.1.1',
    dnsServers: ['192.168.1.10', '192.168.1.11'],
    dhcpEnabled: true
  },
  '2': {
    ipv4Address: '192.168.10.50',
    ipv6Address: 'fe80::2b3c:4d5e:6f7a:8b9c',
    macAddress: '00:2B:3C:4D:5E:6F',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.10.1',
    dnsServers: ['192.168.10.10', '192.168.10.11'],
    dhcpEnabled: false
  },
  '3': {
    ipv4Address: '192.168.2.45',
    ipv6Address: 'fe80::3c4d:5e6f:7a8b:9cad',
    macAddress: '00:3C:4D:5E:6F:7A',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.2.1',
    dnsServers: ['192.168.2.10', '192.168.2.11'],
    dhcpEnabled: true
  }
};

// Mock security info
const mockSecurityInfo: Record<string, SecurityInfo> = {
  '1': {
    antivirusStatus: 'Active',
    antivirusProduct: 'Windows Defender',
    lastScan: '2024-12-22 08:00 AM',
    firewallStatus: 'Enabled',
    encryptionStatus: 'Encrypted',
    lastPatchDate: '2024-12-15',
    pendingUpdates: 2,
    securityScore: 92
  },
  '2': {
    antivirusStatus: 'Active',
    antivirusProduct: 'Symantec Endpoint Protection',
    lastScan: '2024-12-22 02:00 AM',
    firewallStatus: 'Enabled',
    encryptionStatus: 'Encrypted',
    lastPatchDate: '2024-12-10',
    pendingUpdates: 0,
    securityScore: 98
  },
  '3': {
    antivirusStatus: 'Active',
    antivirusProduct: 'Windows Defender',
    lastScan: '2024-12-22 07:30 AM',
    firewallStatus: 'Enabled',
    encryptionStatus: 'Not Encrypted',
    lastPatchDate: '2024-12-18',
    pendingUpdates: 1,
    securityScore: 85
  }
};

// Mock applied GPOs
const mockAppliedGPOs: Record<string, AppliedGPO[]> = {
  '1': [
    { id: '1', gpoName: 'Default Domain Policy', appliedDate: '2023-03-15', status: 'Success' },
    { id: '3', gpoName: 'Workstation Security', appliedDate: '2023-03-15', status: 'Success' },
    { id: '6', gpoName: 'Firewall Configuration', appliedDate: '2023-03-15', status: 'Success' }
  ],
  '2': [
    { id: '1', gpoName: 'Default Domain Policy', appliedDate: '2021-06-10', status: 'Success' },
    { id: '10', gpoName: 'Audit Policy', appliedDate: '2021-06-10', status: 'Success' }
  ],
  '3': [
    { id: '1', gpoName: 'Default Domain Policy', appliedDate: '2022-08-20', status: 'Success' },
    { id: '3', gpoName: 'Workstation Security', appliedDate: '2022-08-20', status: 'Success' }
  ]
};

// Mock user login history
const mockUserLoginHistory: Record<string, UserLoginHistory[]> = {
  '1': [
    { id: '1', username: 'john.doe', loginTime: '2024-12-22 08:30 AM', logoutTime: 'Active', duration: '3h 15m', loginType: 'Local' },
    { id: '2', username: 'john.doe', loginTime: '2024-12-21 08:45 AM', logoutTime: '2024-12-21 05:30 PM', duration: '8h 45m', loginType: 'Local' },
    { id: '3', username: 'john.doe', loginTime: '2024-12-20 09:00 AM', logoutTime: '2024-12-20 06:15 PM', duration: '9h 15m', loginType: 'Local' }
  ],
  '2': [
    { id: '11', username: 'svc_backup', loginTime: '2024-12-22 02:00 AM', logoutTime: '2024-12-22 02:45 AM', duration: '45m', loginType: 'Local' },
    { id: '12', username: 'admin', loginTime: '2024-12-20 10:00 AM', logoutTime: '2024-12-20 11:30 AM', duration: '1h 30m', loginType: 'Remote' }
  ],
  '3': [
    { id: '21', username: 'alice.smith', loginTime: '2024-12-22 09:15 AM', logoutTime: 'Active', duration: '2h 15m', loginType: 'Local' },
    { id: '22', username: 'alice.smith', loginTime: '2024-12-21 08:30 AM', logoutTime: '2024-12-21 05:00 PM', duration: '8h 30m', loginType: 'Local' }
  ]
};

// Mock event logs
const mockEventLogs: Record<string, EventLog[]> = {
  '1': [
    { id: '1', timestamp: '2024-12-22 08:30 AM', eventType: 'Information', source: 'Microsoft-Windows-Security-Auditing', eventId: '4624', description: 'An account was successfully logged on' },
    { id: '2', timestamp: '2024-12-22 07:00 AM', eventType: 'Information', source: 'Microsoft-Windows-Kernel-Boot', eventId: '27', description: 'The boot type was 0x0' },
    { id: '3', timestamp: '2024-12-21 05:30 PM', eventType: 'Information', source: 'Microsoft-Windows-Security-Auditing', eventId: '4634', description: 'An account was logged off' },
    { id: '4', timestamp: '2024-12-20 03:15 PM', eventType: 'Warning', source: 'Microsoft-Windows-WindowsUpdateClient', eventId: '20', description: 'Windows Update Agent was unable to provide updates' }
  ],
  '2': [
    { id: '11', timestamp: '2024-12-22 02:00 AM', eventType: 'Information', source: 'MSSQLSERVER', eventId: '17162', description: 'SQL Server is starting' },
    { id: '12', timestamp: '2024-12-21 11:30 PM', eventType: 'Information', source: 'VSS', eventId: '8224', description: 'The VSS service is shutting down' },
    { id: '13', timestamp: '2024-12-20 10:00 AM', eventType: 'Information', source: 'Microsoft-Windows-Security-Auditing', eventId: '4624', description: 'An account was successfully logged on' },
    { id: '14', timestamp: '2024-12-18 02:30 AM', eventType: 'Error', source: 'Disk', eventId: '11', description: 'The driver detected a controller error on \\Device\\Harddisk0\\DR0' }
  ],
  '3': [
    { id: '21', timestamp: '2024-12-22 09:15 AM', eventType: 'Information', source: 'Microsoft-Windows-Security-Auditing', eventId: '4624', description: 'An account was successfully logged on' },
    { id: '22', timestamp: '2024-12-22 08:00 AM', eventType: 'Information', source: 'Windows Defender', eventId: '1000', description: 'Windows Defender scan completed successfully' },
    { id: '23', timestamp: '2024-12-21 05:00 PM', eventType: 'Information', source: 'Microsoft-Windows-Security-Auditing', eventId: '4634', description: 'An account was logged off' }
  ]
};

interface DeviceDetailViewProps {
  deviceId: string;
  onBack: () => void;
}

export function DeviceDetailView({ deviceId, onBack }: DeviceDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'hardware' | 'network' | 'security' | 'gpos' | 'users' | 'events'>('overview');

  const deviceInfo = mockDeviceInfo[deviceId];
  const hardwareSpec = mockHardwareSpecs[deviceId] || {} as HardwareSpec;
  const networkInfo = mockNetworkInfo[deviceId] || {} as NetworkInfo;
  const securityInfo = mockSecurityInfo[deviceId] || {} as SecurityInfo;
  const appliedGPOs = mockAppliedGPOs[deviceId] || [];
  const userLoginHistory = mockUserLoginHistory[deviceId] || [];
  const eventLogs = mockEventLogs[deviceId] || [];

  if (!deviceInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-600">Device not found</h2>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to Devices
          </button>
        </div>
      </div>
    );
  }

  const getDeviceIcon = () => {
    switch (deviceInfo.deviceType) {
      case 'Workstation': return <Monitor className="text-blue-600" size={32} />;
      case 'Server': return <Server className="text-purple-600" size={32} />;
      case 'Mobile': return <Smartphone className="text-green-600" size={32} />;
      case 'Virtual Machine': return <HardDrive className="text-orange-600" size={32} />;
      default: return <HardDrive className="text-gray-600" size={32} />;
    }
  };

  const getDeviceIconBg = () => {
    switch (deviceInfo.deviceType) {
      case 'Workstation': return 'bg-blue-100';
      case 'Server': return 'bg-purple-100';
      case 'Mobile': return 'bg-green-100';
      case 'Virtual Machine': return 'bg-orange-100';
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
            <span>Back to Devices</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Devices</span>
            <span>/</span>
            <span className="text-gray-900">{deviceInfo.deviceName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${getDeviceIconBg()}`}>
                {getDeviceIcon()}
              </div>
              <div>
                <h1>{deviceInfo.deviceName}</h1>
                <p className="text-sm text-gray-600">{deviceInfo.operatingSystem} • {deviceInfo.location}</p>
              </div>
            </div>
            <div>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                deviceInfo.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {deviceInfo.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Row 1 - Device Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Device Type</p>
              {getDeviceIcon()}
            </div>
            <p className="text-sm font-semibold text-gray-900">{deviceInfo.deviceType}</p>
            <p className="text-xs text-gray-500 mt-1">{deviceInfo.manufacturer} {deviceInfo.model}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Owner</p>
              <User className="text-blue-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{deviceInfo.owner}</p>
            <p className="text-xs text-gray-500 mt-1">Device owner</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Location</p>
              <MapPin className="text-orange-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{deviceInfo.location}</p>
            <p className="text-xs text-gray-500 mt-1">Physical location</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Last Reboot</p>
              <Clock className="text-purple-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{deviceInfo.lastReboot}</p>
            <p className="text-xs text-gray-500 mt-1">System reboot time</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('hardware')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'hardware'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hardware
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'network'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('gpos')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'gpos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                GPOs ({appliedGPOs.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Logins ({userLoginHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Event Logs ({eventLogs.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Device Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Device Name:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.deviceName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Operating System:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.operatingSystem}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">OS Version:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.osVersion}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">OS Build:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{deviceInfo.osBuild}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">IP Address:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{deviceInfo.ipAddress}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">MAC Address:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{deviceInfo.macAddress}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Manufacturer:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.manufacturer}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Model:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.model}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Serial Number:</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{deviceInfo.serialNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Organizational Unit:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.ou}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Domain Joined:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.joinedDate}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Last Logon:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.lastLogon}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Last Reboot:</span>
                        <span className="text-sm font-medium text-gray-900">{deviceInfo.lastReboot}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hardware Tab */}
            {activeTab === 'hardware' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hardware Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Cpu className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Processor</h4>
                        <p className="text-sm text-gray-600">{hardwareSpec.processor}</p>
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <span className="text-sm text-gray-600">Cores:</span>
                      <span className="text-sm font-medium text-gray-900">{hardwareSpec.cores}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <MemoryStick className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Memory</h4>
                        <p className="text-sm text-gray-600">{hardwareSpec.ram}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Database className="text-green-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Storage</h4>
                        <p className="text-sm text-gray-600">{hardwareSpec.storage}</p>
                      </div>
                    </div>
                  </div>

                  {hardwareSpec.graphicsCard && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-100">
                          <Monitor className="text-orange-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Graphics</h4>
                          <p className="text-sm text-gray-600">{hardwareSpec.graphicsCard}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Network Tab */}
            {activeTab === 'network' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">IPv4 Address:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{networkInfo.ipv4Address || deviceInfo.ipAddress}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">IPv6 Address:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono text-xs">{networkInfo.ipv6Address || 'Not configured'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">MAC Address:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{networkInfo.macAddress || deviceInfo.macAddress}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Subnet Mask:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{networkInfo.subnetMask || '255.255.255.0'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Default Gateway:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{networkInfo.defaultGateway || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">DNS Servers:</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{networkInfo.dnsServers?.join(', ') || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">DHCP Enabled:</span>
                      <span className={`text-sm font-medium ${networkInfo.dhcpEnabled ? 'text-green-600' : 'text-gray-900'}`}>
                        {networkInfo.dhcpEnabled !== undefined ? (networkInfo.dhcpEnabled ? 'Yes' : 'No') : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Security Score</p>
                        <Shield className="text-blue-600" size={20} />
                      </div>
                      <p className="text-3xl font-semibold text-blue-600">{securityInfo.securityScore || 'N/A'}</p>
                      <p className="text-xs text-gray-500 mt-1">Out of 100</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Pending Updates</p>
                        <Package className="text-orange-600" size={20} />
                      </div>
                      <p className="text-3xl font-semibold text-orange-600">{securityInfo.pendingUpdates ?? 'N/A'}</p>
                      <p className="text-xs text-gray-500 mt-1">Updates available</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Last Patch</p>
                        <Calendar className="text-green-600" size={20} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{securityInfo.lastPatchDate || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-1">Latest patch date</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Antivirus Status:</span>
                        <span className={`text-sm font-medium ${
                          securityInfo.antivirusStatus === 'Active' ? 'text-green-600' : 
                          securityInfo.antivirusStatus === 'Inactive' ? 'text-red-600' : 
                          'text-gray-900'
                        }`}>
                          {securityInfo.antivirusStatus || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Antivirus Product:</span>
                        <span className="text-sm font-medium text-gray-900">{securityInfo.antivirusProduct || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Last Scan:</span>
                        <span className="text-sm font-medium text-gray-900">{securityInfo.lastScan || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Firewall Status:</span>
                        <span className={`text-sm font-medium ${
                          securityInfo.firewallStatus === 'Enabled' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {securityInfo.firewallStatus || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Encryption Status:</span>
                        <span className={`text-sm font-medium ${
                          securityInfo.encryptionStatus === 'Encrypted' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {securityInfo.encryptionStatus || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GPOs Tab */}
            {activeTab === 'gpos' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Applied Group Policies</h3>
                {appliedGPOs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPO Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appliedGPOs.map((gpo) => (
                          <tr key={gpo.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <FileText className="text-indigo-600" size={16} />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{gpo.gpoName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                gpo.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {gpo.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No GPO information available</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Login History</h3>
                {userLoginHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userLoginHistory.map((login) => (
                          <tr key={login.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="text-blue-600" size={16} />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{login.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{login.loginTime}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {login.logoutTime === 'Active' ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                              ) : (
                                login.logoutTime
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No user login history available</p>
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Event Logs</h3>
                {eventLogs.length > 0 ? (
                  <div className="space-y-3">
                    {eventLogs.map((event) => (
                      <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            event.eventType === 'Information' ? 'bg-blue-100' :
                            event.eventType === 'Warning' ? 'bg-orange-100' :
                            'bg-red-100'
                          }`}>
                            {event.eventType === 'Information' ? (
                              <Activity className="text-blue-600" size={20} />
                            ) : event.eventType === 'Warning' ? (
                              <AlertTriangle className="text-orange-600" size={20} />
                            ) : (
                              <XCircle className="text-red-600" size={20} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                event.eventType === 'Information' ? 'bg-blue-100 text-blue-800' :
                                event.eventType === 'Warning' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {event.eventType}
                              </span>
                              <span className="text-xs text-gray-500">{event.timestamp}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">{event.description}</p>
                            <div className="flex gap-4 text-xs text-gray-600">
                              <span>Source: {event.source}</span>
                              <span>Event ID: {event.eventId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No event logs available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}