import { ArrowLeft, Network, FolderTree, Users, Monitor, Shield, FileText, Calendar, Search, Mail, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface OUInfo {
  id: string;
  ouName: string;
  distinguishedName: string;
  description: string;
  userCount: number;
  computerCount: number;
  groupCount: number;
  parentOU: string;
  gpoLinked: number;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  managedBy: string;
}

interface OUUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  department: string;
  jobTitle: string;
  accountStatus: 'Active' | 'Disabled' | 'Locked';
  lastLogon: string;
}

interface OUComputer {
  id: string;
  computerName: string;
  operatingSystem: string;
  osVersion: string;
  status: 'Online' | 'Offline';
  lastLogon: string;
  ipAddress: string;
}

interface OUGroup {
  id: string;
  groupName: string;
  groupType: 'Security' | 'Distribution';
  scope: 'Domain Local' | 'Global' | 'Universal';
  memberCount: number;
  description: string;
}

interface ChildOU {
  id: string;
  ouName: string;
  description: string;
  userCount: number;
  computerCount: number;
}

interface LinkedGPO {
  id: string;
  gpoName: string;
  enforced: boolean;
  enabled: boolean;
  order: number;
}

// Mock OU data
const mockOUInfo: Record<string, OUInfo> = {
  '1': {
    id: '1',
    ouName: 'Domain Controllers',
    distinguishedName: 'OU=Domain Controllers,DC=company,DC=local',
    description: 'Default container for domain controllers',
    userCount: 0,
    computerCount: 3,
    groupCount: 0,
    parentOU: 'company.local',
    gpoLinked: 2,
    createdDate: '2020-01-05',
    modifiedDate: '2024-11-15',
    createdBy: 'Administrator',
    managedBy: 'IT Infrastructure Team'
  },
  '2': {
    id: '2',
    ouName: 'Workstations',
    distinguishedName: 'OU=Workstations,DC=company,DC=local',
    description: 'All employee workstations and laptops',
    userCount: 0,
    computerCount: 285,
    groupCount: 4,
    parentOU: 'company.local',
    gpoLinked: 8,
    createdDate: '2020-02-10',
    modifiedDate: '2024-12-20',
    createdBy: 'Administrator',
    managedBy: 'IT Operations Team'
  },
  '3': {
    id: '3',
    ouName: 'Servers',
    distinguishedName: 'OU=Servers,DC=company,DC=local',
    description: 'Production and development servers',
    userCount: 0,
    computerCount: 42,
    groupCount: 6,
    parentOU: 'company.local',
    gpoLinked: 5,
    createdDate: '2020-02-10',
    modifiedDate: '2024-12-18',
    createdBy: 'Administrator',
    managedBy: 'Server Operations Team'
  },
  '4': {
    id: '4',
    ouName: 'Users',
    distinguishedName: 'OU=Users,DC=company,DC=local',
    description: 'All domain user accounts',
    userCount: 398,
    computerCount: 0,
    groupCount: 12,
    parentOU: 'company.local',
    gpoLinked: 6,
    createdDate: '2020-02-12',
    modifiedDate: '2024-12-22',
    createdBy: 'Administrator',
    managedBy: 'User Management Team'
  },
  '5': {
    id: '5',
    ouName: 'Engineering',
    distinguishedName: 'OU=Engineering,OU=Users,DC=company,DC=local',
    description: 'Engineering department users',
    userCount: 42,
    computerCount: 0,
    groupCount: 3,
    parentOU: 'Users',
    gpoLinked: 3,
    createdDate: '2020-03-15',
    modifiedDate: '2024-12-15',
    createdBy: 'Administrator',
    managedBy: 'Engineering Manager'
  },
  '6': {
    id: '6',
    ouName: 'Finance',
    distinguishedName: 'OU=Finance,OU=Users,DC=company,DC=local',
    description: 'Finance and accounting department',
    userCount: 18,
    computerCount: 0,
    groupCount: 2,
    parentOU: 'Users',
    gpoLinked: 4,
    createdDate: '2020-04-20',
    modifiedDate: '2024-11-30',
    createdBy: 'Administrator',
    managedBy: 'Finance Manager'
  },
  '7': {
    id: '7',
    ouName: 'Sales',
    distinguishedName: 'OU=Sales,OU=Users,DC=company,DC=local',
    description: 'Sales department users',
    userCount: 34,
    computerCount: 0,
    groupCount: 2,
    parentOU: 'Users',
    gpoLinked: 2,
    createdDate: '2020-05-10',
    modifiedDate: '2024-12-19',
    createdBy: 'Administrator',
    managedBy: 'Sales Manager'
  },
  '8': {
    id: '8',
    ouName: 'Remote Users',
    distinguishedName: 'OU=Remote Users,OU=Users,DC=company,DC=local',
    description: 'Remote and mobile workforce',
    userCount: 87,
    computerCount: 0,
    groupCount: 3,
    parentOU: 'Users',
    gpoLinked: 5,
    createdDate: '2021-03-01',
    modifiedDate: '2024-12-21',
    createdBy: 'Administrator',
    managedBy: 'Remote Work Coordinator'
  },
  '9': {
    id: '9',
    ouName: 'Service Accounts',
    distinguishedName: 'OU=Service Accounts,DC=company,DC=local',
    description: 'Service and application accounts',
    userCount: 84,
    computerCount: 0,
    groupCount: 1,
    parentOU: 'company.local',
    gpoLinked: 3,
    createdDate: '2020-03-20',
    modifiedDate: '2024-12-10',
    createdBy: 'Administrator',
    managedBy: 'Service Account Management'
  },
  '10': {
    id: '10',
    ouName: 'Test Environment',
    distinguishedName: 'OU=Test Environment,DC=company,DC=local',
    description: 'Testing and development resources',
    userCount: 15,
    computerCount: 23,
    groupCount: 5,
    parentOU: 'company.local',
    gpoLinked: 2,
    createdDate: '2021-01-15',
    modifiedDate: '2024-10-05',
    createdBy: 'Administrator',
    managedBy: 'QA Team Lead'
  }
};

// Mock users data for each OU
const mockOUUsers: Record<string, OUUser[]> = {
  '4': [ // Users OU
    { id: '1', username: 'john.smith', displayName: 'John Smith', email: 'john.smith@company.com', department: 'IT', jobTitle: 'System Administrator', accountStatus: 'Active', lastLogon: '2024-12-23 08:30' },
    { id: '2', username: 'sarah.johnson', displayName: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'IT Security', jobTitle: 'Security Analyst', accountStatus: 'Active', lastLogon: '2024-12-23 07:15' },
    { id: '3', username: 'michael.chen', displayName: 'Michael Chen', email: 'michael.chen@company.com', department: 'IT', jobTitle: 'Network Engineer', accountStatus: 'Active', lastLogon: '2024-12-22 16:45' },
    { id: '4', username: 'jennifer.lee', displayName: 'Jennifer Lee', email: 'jennifer.lee@company.com', department: 'Finance', jobTitle: 'Financial Analyst', accountStatus: 'Active', lastLogon: '2024-12-23 08:15' },
    { id: '5', username: 'david.miller', displayName: 'David Miller', email: 'david.miller@company.com', department: 'Engineering', jobTitle: 'Senior Developer', accountStatus: 'Active', lastLogon: '2024-12-23 09:00' }
  ],
  '5': [ // Engineering
    { id: '11', username: 'alex.rodriguez', displayName: 'Alex Rodriguez', email: 'alex.rodriguez@company.com', department: 'Engineering', jobTitle: 'Lead Developer', accountStatus: 'Active', lastLogon: '2024-12-23 08:45' },
    { id: '12', username: 'emily.watson', displayName: 'Emily Watson', email: 'emily.watson@company.com', department: 'Engineering', jobTitle: 'Software Engineer', accountStatus: 'Active', lastLogon: '2024-12-23 09:15' },
    { id: '13', username: 'robert.taylor', displayName: 'Robert Taylor', email: 'robert.taylor@company.com', department: 'Engineering', jobTitle: 'DevOps Engineer', accountStatus: 'Active', lastLogon: '2024-12-22 17:30' }
  ],
  '6': [ // Finance
    { id: '21', username: 'lisa.anderson', displayName: 'Lisa Anderson', email: 'lisa.anderson@company.com', department: 'Finance', jobTitle: 'CFO', accountStatus: 'Active', lastLogon: '2024-12-23 08:00' },
    { id: '22', username: 'mark.wilson', displayName: 'Mark Wilson', email: 'mark.wilson@company.com', department: 'Finance', jobTitle: 'Accountant', accountStatus: 'Active', lastLogon: '2024-12-23 07:45' }
  ],
  '7': [ // Sales
    { id: '31', username: 'karen.clark', displayName: 'Karen Clark', email: 'karen.clark@company.com', department: 'Sales', jobTitle: 'Sales Manager', accountStatus: 'Active', lastLogon: '2024-12-22 16:15' },
    { id: '32', username: 'james.martin', displayName: 'James Martin', email: 'james.martin@company.com', department: 'Sales', jobTitle: 'Account Executive', accountStatus: 'Active', lastLogon: '2024-12-23 08:20' }
  ],
  '8': [ // Remote Users
    { id: '41', username: 'paul.robinson', displayName: 'Paul Robinson', email: 'paul.robinson@company.com', department: 'Engineering', jobTitle: 'Remote Developer', accountStatus: 'Active', lastLogon: '2024-12-23 08:45' },
    { id: '42', username: 'steven.rodriguez', displayName: 'Steven Rodriguez', email: 'steven.rodriguez@company.com', department: 'IT', jobTitle: 'Remote Support', accountStatus: 'Active', lastLogon: '2024-12-23 07:45' }
  ],
  '9': [ // Service Accounts
    { id: '51', username: 'svc_backup', displayName: 'Backup Service Account', email: 'svc_backup@company.com', department: 'IT Operations', jobTitle: 'Service Account', accountStatus: 'Active', lastLogon: '2024-12-23 02:00' },
    { id: '52', username: 'svc_monitoring', displayName: 'Monitoring Service Account', email: 'svc_monitoring@company.com', department: 'IT Operations', jobTitle: 'Service Account', accountStatus: 'Active', lastLogon: '2024-12-23 09:30' }
  ],
  '10': [ // Test Environment
    { id: '61', username: 'test.user1', displayName: 'Test User 1', email: 'test.user1@company.com', department: 'QA', jobTitle: 'QA Tester', accountStatus: 'Active', lastLogon: '2024-12-20 14:30' }
  ]
};

// Mock computers data
const mockOUComputers: Record<string, OUComputer[]> = {
  '1': [ // Domain Controllers
    { id: '1', computerName: 'SERVER-DC01', operatingSystem: 'Windows Server 2022', osVersion: '10.0.20348', status: 'Online', lastLogon: '2024-12-23 09:00', ipAddress: '10.0.0.1' },
    { id: '2', computerName: 'SERVER-DC02', operatingSystem: 'Windows Server 2022', osVersion: '10.0.20348', status: 'Online', lastLogon: '2024-12-23 09:00', ipAddress: '10.0.0.2' },
    { id: '3', computerName: 'SERVER-DC03', operatingSystem: 'Windows Server 2019', osVersion: '10.0.17763', status: 'Online', lastLogon: '2024-12-23 09:00', ipAddress: '10.0.0.3' }
  ],
  '2': [ // Workstations
    { id: '11', computerName: 'DESKTOP-WS001', operatingSystem: 'Windows 11 Pro', osVersion: '10.0.22631', status: 'Online', lastLogon: '2024-12-23 08:00', ipAddress: '10.0.1.101' },
    { id: '12', computerName: 'DESKTOP-WS002', operatingSystem: 'Windows 11 Pro', osVersion: '10.0.22631', status: 'Online', lastLogon: '2024-12-23 07:45', ipAddress: '10.0.1.102' },
    { id: '13', computerName: 'LAPTOP-MKT001', operatingSystem: 'Windows 11 Pro', osVersion: '10.0.22631', status: 'Offline', lastLogon: '2024-12-21 14:20', ipAddress: '10.0.1.215' },
    { id: '14', computerName: 'LAPTOP-ENG001', operatingSystem: 'Windows 11 Pro', osVersion: '10.0.22631', status: 'Online', lastLogon: '2024-12-23 09:15', ipAddress: '10.0.1.150' }
  ],
  '3': [ // Servers
    { id: '21', computerName: 'SERVER-APP01', operatingSystem: 'Windows Server 2022', osVersion: '10.0.20348', status: 'Online', lastLogon: '2024-12-23 09:00', ipAddress: '10.0.2.10' },
    { id: '22', computerName: 'SERVER-DB01', operatingSystem: 'Windows Server 2022', osVersion: '10.0.20348', status: 'Online', lastLogon: '2024-12-23 09:00', ipAddress: '10.0.2.20' },
    { id: '23', computerName: 'SERVER-WEB01', operatingSystem: 'Windows Server 2019', osVersion: '10.0.17763', status: 'Online', lastLogon: '2024-12-23 09:00', ipAddress: '10.0.2.30' }
  ],
  '10': [ // Test Environment
    { id: '31', computerName: 'TEST-VM01', operatingSystem: 'Windows 10 Pro', osVersion: '10.0.19045', status: 'Online', lastLogon: '2024-12-20 14:30', ipAddress: '10.0.99.10' },
    { id: '32', computerName: 'TEST-VM02', operatingSystem: 'Windows 11 Pro', osVersion: '10.0.22631', status: 'Offline', lastLogon: '2024-12-18 11:15', ipAddress: '10.0.99.11' }
  ]
};

// Mock groups data
const mockOUGroups: Record<string, OUGroup[]> = {
  '2': [ // Workstations
    { id: '1', groupName: 'Workstation Admins', groupType: 'Security', scope: 'Domain Local', memberCount: 12, description: 'Local administrators for workstations' },
    { id: '2', groupName: 'Workstation Users', groupType: 'Security', scope: 'Global', memberCount: 285, description: 'Standard workstation users' }
  ],
  '3': [ // Servers
    { id: '11', groupName: 'Server Administrators', groupType: 'Security', scope: 'Domain Local', memberCount: 8, description: 'Server administrators group' },
    { id: '12', groupName: 'Database Admins', groupType: 'Security', scope: 'Global', memberCount: 5, description: 'Database server administrators' }
  ],
  '4': [ // Users
    { id: '21', groupName: 'All Users', groupType: 'Security', scope: 'Global', memberCount: 398, description: 'All domain users' },
    { id: '22', groupName: 'Remote Access Users', groupType: 'Security', scope: 'Universal', memberCount: 87, description: 'Users with VPN access' }
  ],
  '5': [ // Engineering
    { id: '31', groupName: 'Engineering Team', groupType: 'Security', scope: 'Global', memberCount: 42, description: 'Engineering department group' },
    { id: '32', groupName: 'Developers', groupType: 'Security', scope: 'Global', memberCount: 35, description: 'Software developers' }
  ],
  '6': [ // Finance
    { id: '41', groupName: 'Finance Team', groupType: 'Security', scope: 'Global', memberCount: 18, description: 'Finance department group' }
  ],
  '7': [ // Sales
    { id: '51', groupName: 'Sales Team', groupType: 'Security', scope: 'Global', memberCount: 34, description: 'Sales department group' }
  ],
  '8': [ // Remote Users
    { id: '61', groupName: 'Remote Workers', groupType: 'Security', scope: 'Universal', memberCount: 87, description: 'Remote workforce group' }
  ],
  '9': [ // Service Accounts
    { id: '71', groupName: 'Service Accounts', groupType: 'Security', scope: 'Global', memberCount: 84, description: 'Service account group' }
  ],
  '10': [ // Test Environment
    { id: '81', groupName: 'QA Team', groupType: 'Security', scope: 'Global', memberCount: 15, description: 'Quality assurance team' }
  ]
};

// Mock child OUs
const mockChildOUs: Record<string, ChildOU[]> = {
  '4': [ // Users has child OUs
    { id: '5', ouName: 'Engineering', description: 'Engineering department users', userCount: 42, computerCount: 0 },
    { id: '6', ouName: 'Finance', description: 'Finance and accounting department', userCount: 18, computerCount: 0 },
    { id: '7', ouName: 'Sales', description: 'Sales department users', userCount: 34, computerCount: 0 },
    { id: '8', ouName: 'Remote Users', description: 'Remote and mobile workforce', userCount: 87, computerCount: 0 }
  ]
};

// Mock linked GPOs
const mockLinkedGPOs: Record<string, LinkedGPO[]> = {
  '1': [
    { id: '1', gpoName: 'Default Domain Policy', enforced: true, enabled: true, order: 1 },
    { id: '10', gpoName: 'Audit Policy', enforced: false, enabled: true, order: 2 }
  ],
  '2': [
    { id: '3', gpoName: 'Workstation Security', enforced: true, enabled: true, order: 1 },
    { id: '4', gpoName: 'Software Deployment', enforced: false, enabled: true, order: 2 }
  ],
  '3': [
    { id: '6', gpoName: 'Firewall Configuration', enforced: true, enabled: true, order: 1 },
    { id: '10', gpoName: 'Audit Policy', enforced: false, enabled: true, order: 2 }
  ],
  '4': [
    { id: '1', gpoName: 'Default Domain Policy', enforced: false, enabled: true, order: 1 },
    { id: '7', gpoName: 'Drive Mapping', enforced: false, enabled: true, order: 2 }
  ],
  '5': [
    { id: '7', gpoName: 'Drive Mapping', enforced: false, enabled: true, order: 1 }
  ],
  '6': [
    { id: '8', gpoName: 'Legacy Printer Policy', enforced: false, enabled: false, order: 1 }
  ],
  '7': [
    { id: '7', gpoName: 'Drive Mapping', enforced: false, enabled: true, order: 1 }
  ],
  '8': [
    { id: '5', gpoName: 'VPN Access Policy', enforced: true, enabled: true, order: 1 }
  ],
  '9': [
    { id: '9', gpoName: 'Screen Saver Lock', enforced: false, enabled: true, order: 1 }
  ],
  '10': [
    { id: '4', gpoName: 'Software Deployment', enforced: false, enabled: true, order: 1 }
  ]
};

interface OUDetailViewProps {
  ouId: string;
  onBack: () => void;
}

export function OUDetailView({ ouId, onBack }: OUDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'computers' | 'groups' | 'childOUs' | 'gpos'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  const ouInfo = mockOUInfo[ouId];
  const users = mockOUUsers[ouId] || [];
  const computers = mockOUComputers[ouId] || [];
  const groups = mockOUGroups[ouId] || [];
  const childOUs = mockChildOUs[ouId] || [];
  const linkedGPOs = mockLinkedGPOs[ouId] || [];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComputers = computers.filter(computer =>
    computer.computerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    computer.operatingSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    computer.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!ouInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-600">Organizational Unit not found</h2>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
            Back to OUs
          </button>
        </div>
      </div>
    );
  }

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
            <span>Back to Organizational Units</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Organizational Units</span>
            <span>/</span>
            <span className="text-gray-900">{ouInfo.ouName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-teal-100">
                <FolderTree className="text-teal-600" size={32} />
              </div>
              <div>
                <h1>{ouInfo.ouName}</h1>
                <p className="text-sm text-gray-600">{ouInfo.description}</p>
                <p className="text-xs text-gray-500 mt-1">{ouInfo.distinguishedName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OU Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Parent OU</p>
              <Network className="text-blue-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{ouInfo.parentOU}</p>
            <p className="text-xs text-gray-500 mt-1">Parent organizational unit</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Managed By</p>
              <Shield className="text-purple-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{ouInfo.managedBy}</p>
            <p className="text-xs text-gray-500 mt-1">OU manager</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Created By</p>
              <Users className="text-orange-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{ouInfo.createdBy}</p>
            <p className="text-xs text-gray-500 mt-1">Created: {ouInfo.createdDate}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Last Modified</p>
              <Calendar className="text-teal-600" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{ouInfo.modifiedDate}</p>
            <p className="text-xs text-gray-500 mt-1">Last update date</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-semibold text-blue-600">{ouInfo.userCount}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Computers</p>
                <p className="text-2xl font-semibold text-purple-600">{ouInfo.computerCount}</p>
              </div>
              <Monitor className="text-purple-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Groups</p>
                <p className="text-2xl font-semibold text-green-600">{ouInfo.groupCount}</p>
              </div>
              <Shield className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Child OUs</p>
                <p className="text-2xl font-semibold text-orange-600">{childOUs.length}</p>
              </div>
              <FolderTree className="text-orange-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Linked GPOs</p>
                <p className="text-2xl font-semibold text-indigo-600">{ouInfo.gpoLinked}</p>
              </div>
              <FileText className="text-indigo-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('computers')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'computers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Computers ({computers.length})
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'groups'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Groups ({groups.length})
              </button>
              <button
                onClick={() => setActiveTab('childOUs')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'childOUs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Child OUs ({childOUs.length})
              </button>
              <button
                onClick={() => setActiveTab('gpos')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'gpos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Linked GPOs ({linkedGPOs.length})
              </button>
            </nav>
          </div>

          {/* Search Bar (for users, computers, groups) */}
          {(activeTab === 'users' || activeTab === 'computers' || activeTab === 'groups') && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Logon</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="text-blue-600" size={16} />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.displayName}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Mail size={14} />
                                {user.email}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.department}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Briefcase size={14} />
                                {user.jobTitle}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.accountStatus === 'Active' ? 'bg-green-100 text-green-800' :
                                user.accountStatus === 'Disabled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.accountStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.lastLogon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No users found in this OU</p>
                  </div>
                )}
              </div>
            )}

            {/* Computers Tab */}
            {activeTab === 'computers' && (
              <div>
                {filteredComputers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Computer Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating System</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS Version</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Logon</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredComputers.map((computer) => (
                          <tr key={computer.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Monitor className="text-purple-600" size={16} />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{computer.computerName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{computer.operatingSystem}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{computer.osVersion}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{computer.ipAddress}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {computer.status === 'Online' ? (
                                  <CheckCircle className="text-green-500" size={16} />
                                ) : (
                                  <XCircle className="text-red-500" size={16} />
                                )}
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  computer.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {computer.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{computer.lastLogon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Monitor className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No computers found in this OU</p>
                  </div>
                )}
              </div>
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <div>
                {filteredGroups.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGroups.map((group) => (
                          <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <Shield className="text-green-600" size={16} />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{group.groupName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{group.description}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                group.groupType === 'Security' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {group.groupType}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {group.scope}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{group.memberCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No groups found in this OU</p>
                  </div>
                )}
              </div>
            )}

            {/* Child OUs Tab */}
            {activeTab === 'childOUs' && (
              <div>
                {childOUs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {childOUs.map((childOU) => (
                      <div key={childOU.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-teal-100">
                            <FolderTree className="text-teal-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{childOU.ouName}</h3>
                            <p className="text-sm text-gray-600 mt-1">{childOU.description}</p>
                            <div className="flex gap-4 mt-3">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users size={14} />
                                {childOU.userCount} users
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Monitor size={14} />
                                {childOU.computerCount} computers
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FolderTree className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No child OUs found</p>
                  </div>
                )}
              </div>
            )}

            {/* GPOs Tab */}
            {activeTab === 'gpos' && (
              <div>
                {linkedGPOs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Order</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPO Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enforced</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {linkedGPOs.map((gpo) => (
                          <tr key={gpo.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {gpo.order}
                              </span>
                            </td>
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
                              {gpo.enabled ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Enabled
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Disabled
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {gpo.enforced ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Enforced
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Not Enforced
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No GPOs linked to this OU</p>
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
