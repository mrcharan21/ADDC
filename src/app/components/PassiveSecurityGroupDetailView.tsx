import { ArrowLeft, Shield, Users, Activity, Lock, Calendar, Download, Archive, AlertTriangle, CheckCircle, Settings, Trash2, History, Link as LinkIcon, FileText, Database, AlertCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface SecurityGroupDetail {
  id: string;
  groupName: string;
  groupType: string;
  ou: string;
  memberCount: number;
  privileged: boolean;
  lastUsed: string;
  createdDate: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  description: string;
  distinguishedName: string;
  sid: string;
  scope: string;
  managedBy: string;
  email: string;
  notes: string;
  cleanupStatus: 'Review' | 'Archive' | 'Delete';
}

interface GroupActivity {
  date: string;
  action: string;
  performedBy: string;
  details: string;
}

const mockGroupDetails: { [key: string]: SecurityGroupDetail } = {
  '1': {
    id: '1',
    groupName: 'Legacy CRM Users',
    groupType: 'Security - Global',
    ou: 'Finance',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-08-20',
    createdDate: '2019-03-15',
    riskLevel: 'Low',
    description: 'Old CRM application users - application decommissioned',
    distinguishedName: 'CN=Legacy CRM Users,OU=Finance,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1045',
    scope: 'Global',
    managedBy: 'Unassigned',
    email: 'legacy-crm@contoso.com',
    notes: 'Marked for deletion - application decommissioned in August 2023',
    cleanupStatus: 'Delete'
  },
  '2': {
    id: '2',
    groupName: 'Temp Project Alpha',
    groupType: 'Security - Global',
    ou: 'Engineering',
    memberCount: 0,
    privileged: false,
    lastUsed: '2022-06-15',
    createdDate: '2022-01-10',
    riskLevel: 'Low',
    description: 'Temporary project team - project completed',
    distinguishedName: 'CN=Temp Project Alpha,OU=Engineering,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1046',
    scope: 'Global',
    managedBy: 'Engineering Manager',
    email: 'project-alpha@contoso.com',
    notes: 'Project completed June 2022 - safe to archive',
    cleanupStatus: 'Archive'
  },
  '3': {
    id: '3',
    groupName: 'Old VPN Group',
    groupType: 'Security - Global',
    ou: 'IT Security',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-11-30',
    createdDate: '2018-05-20',
    riskLevel: 'Low',
    description: 'Replaced by new VPN access group',
    distinguishedName: 'CN=Old VPN Group,OU=IT Security,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1047',
    scope: 'Global',
    managedBy: 'IT Manager',
    email: 'old-vpn@contoso.com',
    notes: 'Has active GPO links - review before deletion',
    cleanupStatus: 'Review'
  },
  '4': {
    id: '4',
    groupName: 'Sales Q3 2023 Team',
    groupType: 'Security - Domain Local',
    ou: 'Sales',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-10-05',
    createdDate: '2023-07-01',
    riskLevel: 'Low',
    description: 'Quarterly sales team access',
    distinguishedName: 'CN=Sales Q3 2023 Team,OU=Sales,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1048',
    scope: 'Domain Local',
    managedBy: 'Sales Director',
    email: 'sales-q3-2023@contoso.com',
    notes: 'Quarter ended - can be archived',
    cleanupStatus: 'Archive'
  },
  '5': {
    id: '5',
    groupName: 'Old Finance Share',
    groupType: 'Security - Global',
    ou: 'Finance',
    memberCount: 0,
    privileged: false,
    lastUsed: '2024-01-12',
    createdDate: '2020-08-10',
    riskLevel: 'Low',
    description: 'Legacy file share access',
    distinguishedName: 'CN=Old Finance Share,OU=Finance,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1049',
    scope: 'Global',
    managedBy: 'Finance Manager',
    email: 'finance-old@contoso.com',
    notes: 'File share migrated to SharePoint - pending review',
    cleanupStatus: 'Review'
  },
  '6': {
    id: '6',
    groupName: 'Marketing Campaign 2022',
    groupType: 'Security - Universal',
    ou: 'Marketing',
    memberCount: 0,
    privileged: false,
    lastUsed: '2022-12-31',
    createdDate: '2022-03-15',
    riskLevel: 'Low',
    description: 'Campaign team access - campaign ended',
    distinguishedName: 'CN=Marketing Campaign 2022,OU=Marketing,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1050',
    scope: 'Universal',
    managedBy: 'Marketing Lead',
    email: 'campaign-2022@contoso.com',
    notes: 'Campaign concluded - safe to delete',
    cleanupStatus: 'Delete'
  },
  '7': {
    id: '7',
    groupName: 'Intern Summer 2023',
    groupType: 'Security - Global',
    ou: 'HR',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-09-01',
    createdDate: '2023-06-01',
    riskLevel: 'Low',
    description: 'Summer internship program access',
    distinguishedName: 'CN=Intern Summer 2023,OU=HR,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1051',
    scope: 'Global',
    managedBy: 'HR Director',
    email: 'interns-summer-2023@contoso.com',
    notes: 'Internship program ended - archive recommended',
    cleanupStatus: 'Archive'
  },
  '8': {
    id: '8',
    groupName: 'Test Environment Users',
    groupType: 'Security - Global',
    ou: 'IT Security',
    memberCount: 0,
    privileged: false,
    lastUsed: '2024-03-20',
    createdDate: '2019-11-05',
    riskLevel: 'Low',
    description: 'Old test environment - decommissioned',
    distinguishedName: 'CN=Test Environment Users,OU=IT Security,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1052',
    scope: 'Global',
    managedBy: 'Unassigned',
    email: 'test-env@contoso.com',
    notes: 'Environment decommissioned March 2024',
    cleanupStatus: 'Delete'
  },
  '9': {
    id: '9',
    groupName: 'Remote Workers 2021',
    groupType: 'Security - Global',
    ou: 'IT Security',
    memberCount: 0,
    privileged: false,
    lastUsed: '2022-01-15',
    createdDate: '2021-03-20',
    riskLevel: 'Low',
    description: 'COVID-19 remote work group - replaced',
    distinguishedName: 'CN=Remote Workers 2021,OU=IT Security,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1053',
    scope: 'Global',
    managedBy: 'IT Support',
    email: 'remote-2021@contoso.com',
    notes: 'Replaced by new hybrid work policy group',
    cleanupStatus: 'Review'
  },
  '10': {
    id: '10',
    groupName: 'Project Beta Access',
    groupType: 'Security - Domain Local',
    ou: 'Engineering',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-05-10',
    createdDate: '2022-11-15',
    riskLevel: 'Low',
    description: 'Project Beta development team',
    distinguishedName: 'CN=Project Beta Access,OU=Engineering,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1054',
    scope: 'Domain Local',
    managedBy: 'Engineering Lead',
    email: 'project-beta@contoso.com',
    notes: 'Project discontinued May 2023',
    cleanupStatus: 'Archive'
  },
  '11': {
    id: '11',
    groupName: 'Contractor Access 2021',
    groupType: 'Security - Global',
    ou: 'Engineering',
    memberCount: 0,
    privileged: false,
    lastUsed: '2022-03-20',
    createdDate: '2021-04-05',
    riskLevel: 'Low',
    description: 'Contractor project access - contract ended',
    distinguishedName: 'CN=Contractor Access 2021,OU=Engineering,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1055',
    scope: 'Global',
    managedBy: 'Engineering Lead',
    email: 'contractors-2021@contoso.com',
    notes: 'Contract ended March 2022 - safe to archive',
    cleanupStatus: 'Archive'
  },
  '12': {
    id: '12',
    groupName: 'Old File Share Group',
    groupType: 'Security - Global',
    ou: 'IT Security',
    memberCount: 0,
    privileged: false,
    lastUsed: '2024-02-05',
    createdDate: '2019-12-10',
    riskLevel: 'Low',
    description: 'File share access - share decommissioned',
    distinguishedName: 'CN=Old File Share Group,OU=IT Security,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1056',
    scope: 'Global',
    managedBy: 'IT Support',
    email: 'old-share@contoso.com',
    notes: 'Has GPO links - requires careful review',
    cleanupStatus: 'Review'
  },
  '13': {
    id: '13',
    groupName: 'Marketing Event 2023',
    groupType: 'Security - Global',
    ou: 'Marketing',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-09-30',
    createdDate: '2023-05-18',
    riskLevel: 'Low',
    description: 'Event-specific access group',
    distinguishedName: 'CN=Marketing Event 2023,OU=Marketing,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1057',
    scope: 'Global',
    managedBy: 'Marketing Director',
    email: 'event-2023@contoso.com',
    notes: 'Event concluded September 2023',
    cleanupStatus: 'Archive'
  },
  '14': {
    id: '14',
    groupName: 'Temp Printer Access',
    groupType: 'Security - Global',
    ou: 'Finance',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-11-10',
    createdDate: '2020-07-12',
    riskLevel: 'Low',
    description: 'Temporary printer access group',
    distinguishedName: 'CN=Temp Printer Access,OU=Finance,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1058',
    scope: 'Global',
    managedBy: 'Unassigned',
    email: 'temp-printer@contoso.com',
    notes: 'No longer needed - delete recommended',
    cleanupStatus: 'Delete'
  },
  '15': {
    id: '15',
    groupName: 'Audit Team 2022',
    groupType: 'Security - Global',
    ou: 'Legal',
    memberCount: 0,
    privileged: false,
    lastUsed: '2023-01-31',
    createdDate: '2022-09-01',
    riskLevel: 'Low',
    description: 'Annual audit team access',
    distinguishedName: 'CN=Audit Team 2022,OU=Legal,DC=contoso,DC=com',
    sid: 'S-1-5-21-3623811015-3361044348-30300820-1059',
    scope: 'Global',
    managedBy: 'Legal Director',
    email: 'audit-2022@contoso.com',
    notes: 'Audit completed January 2023 - archive recommended',
    cleanupStatus: 'Archive'
  }
};

const mockActivity: GroupActivity[] = [
  { date: '2023-08-20 10:30:00', action: 'Last Member Removed', performedBy: 'it.admin@contoso.com', details: 'Final member removed from group' },
  { date: '2023-08-15 14:20:00', action: 'Member Removed', performedBy: 'it.admin@contoso.com', details: 'Removed user.last@contoso.com from group' },
  { date: '2023-08-10 09:15:00', action: 'Member Removed', performedBy: 'it.admin@contoso.com', details: 'Removed user.test@contoso.com from group' },
  { date: '2023-07-25 16:45:00', action: 'Group Flagged', performedBy: 'system', details: 'Automatically flagged as passive (0 members)' },
  { date: '2022-12-15 11:20:00', action: 'Member Removed', performedBy: 'hr.manager@contoso.com', details: 'Removed multiple members during cleanup' }
];

// Different activity logs for each group
const mockActivityByGroup: { [key: string]: GroupActivity[] } = {
  '1': [
    { date: '2023-08-20 10:30:00', action: 'Last Member Removed', performedBy: 'it.admin@contoso.com', details: 'Final CRM user john.smith@contoso.com removed from group' },
    { date: '2023-08-15 14:20:00', action: 'Application Decommissioned', performedBy: 'it.admin@contoso.com', details: 'Legacy CRM application shut down' },
    { date: '2023-08-10 09:15:00', action: 'Member Removed', performedBy: 'it.admin@contoso.com', details: 'Removed mary.jones@contoso.com from group' },
    { date: '2023-07-25 16:45:00', action: 'Group Flagged', performedBy: 'system', details: 'Automatically flagged as passive (0 members)' },
    { date: '2023-03-15 11:20:00', action: 'Member Removed', performedBy: 'finance.admin@contoso.com', details: 'Removed 5 members during app migration' }
  ],
  '2': [
    { date: '2022-06-15 16:45:00', action: 'Last Member Removed', performedBy: 'eng.manager@contoso.com', details: 'Project Alpha completed, last member removed' },
    { date: '2022-06-10 14:30:00', action: 'Project Closure', performedBy: 'eng.manager@contoso.com', details: 'Project Alpha officially closed' },
    { date: '2022-06-05 10:15:00', action: 'Member Removed', performedBy: 'eng.manager@contoso.com', details: 'Removed contractor.user@external.com from group' },
    { date: '2022-05-20 09:00:00', action: 'Member Removed', performedBy: 'eng.manager@contoso.com', details: 'Removed 3 team members after project completion' }
  ],
  '3': [
    { date: '2023-11-30 11:20:00', action: 'Last Member Removed', performedBy: 'it.security@contoso.com', details: 'Migrated last VPN user to new VPN group' },
    { date: '2023-11-25 14:30:00', action: 'Migration Completed', performedBy: 'it.security@contoso.com', details: 'All users migrated to new VPN access group' },
    { date: '2023-11-20 09:15:00', action: 'Bulk Member Removal', performedBy: 'it.security@contoso.com', details: 'Migrated 15 users to new VPN group' },
    { date: '2023-11-15 10:00:00', action: 'GPO Review', performedBy: 'it.admin@contoso.com', details: 'Identified active GPO links - requires review before deletion' }
  ]
};

// Historical peak members data for each group
const historicalPeakMembers: { [key: string]: number } = {
  '1': 12, '2': 8, '3': 25, '4': 6, '5': 15, '6': 10, '7': 18, '8': 7, '9': 22, '10': 9, '11': 5, '12': 14, '13': 11, '14': 4, '15': 8
};

// Impact assessment data for each group
const impactData: { [key: string]: { hasPermissions: boolean; hasGPO: boolean; hasNestedGroups: boolean } } = {
  '1': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '2': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '3': { hasPermissions: false, hasGPO: true, hasNestedGroups: false },
  '4': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '5': { hasPermissions: true, hasGPO: false, hasNestedGroups: false },
  '6': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '7': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '8': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '9': { hasPermissions: false, hasGPO: true, hasNestedGroups: true },
  '10': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '11': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '12': { hasPermissions: false, hasGPO: true, hasNestedGroups: false },
  '13': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '14': { hasPermissions: false, hasGPO: false, hasNestedGroups: false },
  '15': { hasPermissions: true, hasGPO: false, hasNestedGroups: false }
};

interface PassiveSecurityGroupDetailViewProps {
  groupId: string;
  onBack: () => void;
}

export function PassiveSecurityGroupDetailView({ groupId, onBack }: PassiveSecurityGroupDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'cleanup'>('overview');

  const groupDetail = mockGroupDetails[groupId] || mockGroupDetails['1'];

  const getCleanupColor = (status: string) => {
    switch (status) {
      case 'Delete':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Archive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const daysSinceLastUsed = Math.floor((new Date().getTime() - new Date(groupDetail.lastUsed).getTime()) / (1000 * 60 * 60 * 24));
  const groupAge = Math.floor((new Date().getTime() - new Date(groupDetail.createdDate).getTime()) / (1000 * 60 * 60 * 24));

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
            <span>Back to All Passive Groups</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">Security Groups</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">All Passive Groups</span>
            <span>/</span>
            <span className="text-gray-900">{groupDetail.groupName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Archive className="text-orange-600" size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1>{groupDetail.groupName}</h1>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCleanupColor(groupDetail.cleanupStatus)}`}>
                    {groupDetail.cleanupStatus}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Passive (0 members)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{groupDetail.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
                <Archive size={18} />
                <span>Archive Group</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 size={18} />
                <span>Delete Group</span>
              </button>
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
        {/* Alert Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Passive Security Group - No Active Members</h3>
              <p className="text-sm text-orange-800 mt-1">
                This group has been empty for <span className="font-semibold">{daysSinceLastUsed} days</span>. 
                Consider archiving or deleting this group if it's no longer needed to maintain a clean Active Directory environment.
              </p>
            </div>
          </div>
        </div>

        {/* Group Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Members</p>
              <Users className="text-gray-400" size={20} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Empty group</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Days Inactive</p>
              <Calendar className="text-orange-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-orange-600">{daysSinceLastUsed}</p>
            <p className="text-xs text-gray-500 mt-1">Since last used</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Group Age</p>
              <Activity className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-blue-600">{Math.floor(groupAge / 365)}</p>
            <p className="text-xs text-gray-500 mt-1">Years old</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Impact Level</p>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-green-600">Low</p>
            <p className="text-xs text-gray-500 mt-1">Safe to remove</p>
          </div>
        </div>

        {/* Group Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Group Type</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.groupType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Scope</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.scope}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Organizational Unit</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.ou}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Managed By</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.managedBy}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="text-purple-600" size={20} />
              <h3 className="font-semibold text-gray-900">Technical Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Distinguished Name</p>
                <p className="text-xs text-gray-900 mt-1 font-mono break-all">{groupDetail.distinguishedName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Security Identifier (SID)</p>
                <p className="text-xs text-gray-900 mt-1 font-mono break-all">{groupDetail.sid}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created Date</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Used</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.lastUsed}</p>
              </div>
            </div>
          </div>

          {/* Cleanup Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-orange-600" size={20} />
              <h3 className="font-semibold text-gray-900">Cleanup Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Cleanup Status</p>
                <span className={`mt-1 px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getCleanupColor(groupDetail.cleanupStatus)}`}>
                  {groupDetail.cleanupStatus}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Notes</p>
                <p className="text-sm text-gray-900 mt-1">{groupDetail.notes}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">GPO Links</p>
                <p className="text-sm text-gray-900 mt-1">None</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Dependencies</p>
                <p className="text-sm text-gray-900 mt-1">No active dependencies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity size={18} />
                <span>Activity Log</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('cleanup')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'cleanup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Archive size={18} />
                <span>Cleanup Options</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Group Status</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Current Members</p>
                        <p className="text-lg font-semibold text-gray-900">0</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Historical Peak Members</p>
                        <p className="text-lg font-semibold text-gray-900">{historicalPeakMembers[groupId]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Member Removed</p>
                        <p className="text-sm text-gray-900">{groupDetail.lastUsed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Days Empty</p>
                        <p className="text-lg font-semibold text-orange-600">{daysSinceLastUsed}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Impact Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {impactData[groupId]?.hasPermissions ? (
                        <>
                          <AlertCircle className="text-orange-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Active permissions found</p>
                            <p className="text-xs text-gray-600">Group has some assigned permissions - review before deletion</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="text-green-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">No active permissions</p>
                            <p className="text-xs text-gray-600">Group has no assigned permissions or access rights</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {impactData[groupId]?.hasGPO ? (
                        <>
                          <AlertCircle className="text-orange-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">GPO links detected</p>
                            <p className="text-xs text-gray-600">Referenced in Group Policy Objects - requires careful review</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="text-green-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">No GPO links</p>
                            <p className="text-xs text-gray-600">Not referenced in any Group Policy Objects</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {impactData[groupId]?.hasNestedGroups ? (
                        <>
                          <AlertCircle className="text-orange-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Nested group memberships</p>
                            <p className="text-xs text-gray-600">Member of other security groups - review dependencies</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="text-green-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">No nested groups</p>
                            <p className="text-xs text-gray-600">Not a member of any other security groups</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <div className="space-y-4">
                {mockActivityByGroup[groupId] ? mockActivityByGroup[groupId].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Activity className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Performed by: <span className="font-medium">{activity.performedBy}</span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                )) : mockActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Activity className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Performed by: <span className="font-medium">{activity.performedBy}</span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cleanup Tab */}
          {activeTab === 'cleanup' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions</h4>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Trash2 className="text-red-600 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="font-medium text-red-900">Delete Group</p>
                          <p className="text-sm text-red-800 mt-1">
                            Permanently remove this group from Active Directory. This action cannot be undone.
                          </p>
                          <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                            Delete Permanently
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Archive className="text-yellow-600 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="font-medium text-yellow-900">Archive Group</p>
                          <p className="text-sm text-yellow-800 mt-1">
                            Move group to archive OU for potential future reference. Can be restored if needed.
                          </p>
                          <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                            Archive Group
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="text-blue-600 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="font-medium text-blue-900">Keep for Compliance</p>
                          <p className="text-sm text-blue-800 mt-1">
                            Retain group for audit or compliance purposes. Mark as reviewed and exclude from future cleanup reports.
                          </p>
                          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Mark as Reviewed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Pre-Deletion Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <p className="text-sm text-gray-900">Group has no active members</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <p className="text-sm text-gray-900">No assigned permissions or access rights</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <p className="text-sm text-gray-900">Not referenced in GPO policies</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <p className="text-sm text-gray-900">Owner has been notified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}