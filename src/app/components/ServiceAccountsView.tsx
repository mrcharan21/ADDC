import { ArrowLeft, UserCog, Search, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface ServiceAccount {
  id: string;
  accountName: string;
  displayName: string;
  description: string;
  status: 'Enabled' | 'Disabled';
  lastPasswordChange: string;
  passwordExpiry: string;
  servicePrincipalName: string;
  createdDate: string;
  privilegeLevel: 'Standard' | 'High';
}

const mockServiceAccounts: ServiceAccount[] = [
  {
    id: '1',
    accountName: 'svc_backup',
    displayName: 'Backup Service Account',
    description: 'Primary backup service for all domain servers',
    status: 'Enabled',
    lastPasswordChange: '2024-09-15',
    passwordExpiry: 'Never',
    servicePrincipalName: 'BackupExec/dc01.company.local',
    createdDate: '2022-01-10',
    privilegeLevel: 'High'
  },
  {
    id: '2',
    accountName: 'svc_sql',
    displayName: 'SQL Server Service Account',
    description: 'SQL Server database engine service',
    status: 'Enabled',
    lastPasswordChange: '2024-11-20',
    passwordExpiry: 'Never',
    servicePrincipalName: 'MSSQLSvc/sqlserver.company.local:1433',
    createdDate: '2021-06-05',
    privilegeLevel: 'High'
  },
  {
    id: '3',
    accountName: 'svc_monitoring',
    displayName: 'Monitoring Service Account',
    description: 'System monitoring and alerting service',
    status: 'Enabled',
    lastPasswordChange: '2024-12-01',
    passwordExpiry: '2025-06-01',
    servicePrincipalName: 'HTTP/monitoring.company.local',
    createdDate: '2022-03-15',
    privilegeLevel: 'Standard'
  },
  {
    id: '4',
    accountName: 'svc_sharepoint',
    displayName: 'SharePoint Service Account',
    description: 'SharePoint application pool service',
    status: 'Enabled',
    lastPasswordChange: '2024-10-05',
    passwordExpiry: 'Never',
    servicePrincipalName: 'HTTP/sharepoint.company.local',
    createdDate: '2021-09-20',
    privilegeLevel: 'High'
  },
  {
    id: '5',
    accountName: 'svc_exchange',
    displayName: 'Exchange Service Account',
    description: 'Exchange mail server service',
    status: 'Enabled',
    lastPasswordChange: '2024-11-10',
    passwordExpiry: 'Never',
    servicePrincipalName: 'exchangeMDB/exchange.company.local',
    createdDate: '2021-04-12',
    privilegeLevel: 'High'
  },
  {
    id: '6',
    accountName: 'svc_scan',
    displayName: 'Network Scanner Service',
    description: 'Network scanning and inventory service',
    status: 'Enabled',
    lastPasswordChange: '2024-08-22',
    passwordExpiry: '2025-02-22',
    servicePrincipalName: 'HTTP/scanner.company.local',
    createdDate: '2022-08-01',
    privilegeLevel: 'Standard'
  },
  {
    id: '7',
    accountName: 'svc_legacy',
    displayName: 'Legacy Application Service',
    description: 'Old CRM application service account',
    status: 'Disabled',
    lastPasswordChange: '2023-05-10',
    passwordExpiry: '2024-11-10',
    servicePrincipalName: 'HTTP/crm.company.local',
    createdDate: '2019-02-14',
    privilegeLevel: 'Standard'
  },
  {
    id: '8',
    accountName: 'svc_reporting',
    displayName: 'Reporting Service Account',
    description: 'Business intelligence and reporting service',
    status: 'Enabled',
    lastPasswordChange: '2024-11-28',
    passwordExpiry: '2025-05-28',
    servicePrincipalName: 'HTTP/reports.company.local',
    createdDate: '2022-07-08',
    privilegeLevel: 'Standard'
  }
];

interface ServiceAccountsViewProps {
  onBack: () => void;
}

export function ServiceAccountsView({ onBack }: ServiceAccountsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Enabled' | 'Disabled'>('All');
  const [filterPrivilege, setFilterPrivilege] = useState<'All' | 'Standard' | 'High'>('All');

  const filteredAccounts = mockServiceAccounts.filter(account => {
    const matchesSearch =
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || account.status === filterStatus;
    const matchesPrivilege = filterPrivilege === 'All' || account.privilegeLevel === filterPrivilege;

    return matchesSearch && matchesStatus && matchesPrivilege;
  });

  const enabledAccounts = mockServiceAccounts.filter(a => a.status === 'Enabled').length;
  const disabledAccounts = mockServiceAccounts.filter(a => a.status === 'Disabled').length;
  const highPrivilegeAccounts = mockServiceAccounts.filter(a => a.privilegeLevel === 'High').length;
  const neverExpireAccounts = mockServiceAccounts.filter(a => a.passwordExpiry === 'Never').length;

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
            <UserCog className="text-blue-600" size={32} />
            <div>
              <h1>Service Accounts Management</h1>
              <p className="text-sm text-gray-600">Detailed view of all service accounts</p>
            </div>
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
                <p className="text-sm text-gray-600">Enabled Accounts</p>
                <p className="text-2xl font-semibold text-green-600">{enabledAccounts}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disabled Accounts</p>
                <p className="text-2xl font-semibold text-gray-600">{disabledAccounts}</p>
              </div>
              <XCircle className="text-gray-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Privilege</p>
                <p className="text-2xl font-semibold text-orange-600">{highPrivilegeAccounts}</p>
              </div>
              <Shield className="text-orange-500" size={32} />
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
                placeholder="Search service accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>

            <select
              value={filterPrivilege}
              onChange={(e) => setFilterPrivilege(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Privileges</option>
              <option value="Standard">Standard</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAccounts.length} of {mockServiceAccounts.length} service accounts
          </div>
        </div>

        {/* Service Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privilege</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCog className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{account.accountName}</div>
                          <div className="text-sm text-gray-500">{account.displayName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">{account.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{account.servicePrincipalName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${account.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${account.privilegeLevel === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {account.privilegeLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.createdDate}
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