import { ArrowLeft, Lock, Search, Download, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface KerberosTicket {
  id: string;
  ticketType: 'TGT' | 'TGS';
  username: string;
  service: string;
  clientAddress: string;
  issueTime: string;
  expiryTime: string;
  encryptionType: string;
  status: 'Active' | 'Expired' | 'Revoked';
  flags: string[];
}

const mockKerberosTickets: KerberosTicket[] = [
  {
    id: 'KRB-001',
    ticketType: 'TGT',
    username: 'john.doe@contoso.com',
    service: 'krbtgt/CONTOSO.COM',
    clientAddress: '192.168.1.101',
    issueTime: '2024-12-23 08:00:00',
    expiryTime: '2024-12-23 18:00:00',
    encryptionType: 'AES256-CTS-HMAC-SHA1-96',
    status: 'Active',
    flags: ['forwardable', 'renewable', 'initial']
  },
  {
    id: 'KRB-002',
    ticketType: 'TGS',
    username: 'jane.smith@contoso.com',
    service: 'HTTP/webapp.contoso.com',
    clientAddress: '192.168.1.102',
    issueTime: '2024-12-23 09:15:00',
    expiryTime: '2024-12-23 19:15:00',
    encryptionType: 'AES256-CTS-HMAC-SHA1-96',
    status: 'Active',
    flags: ['forwardable']
  },
  {
    id: 'KRB-003',
    ticketType: 'TGT',
    username: 'admin@contoso.com',
    service: 'krbtgt/CONTOSO.COM',
    clientAddress: '192.168.1.50',
    issueTime: '2024-12-23 07:30:00',
    expiryTime: '2024-12-23 17:30:00',
    encryptionType: 'AES256-CTS-HMAC-SHA1-96',
    status: 'Active',
    flags: ['forwardable', 'renewable', 'initial', 'pre-authent']
  },
  {
    id: 'KRB-004',
    ticketType: 'TGS',
    username: 'service.account@contoso.com',
    service: 'MSSQL/db.contoso.com',
    clientAddress: '192.168.1.200',
    issueTime: '2024-12-23 06:00:00',
    expiryTime: '2024-12-23 16:00:00',
    encryptionType: 'RC4-HMAC',
    status: 'Active',
    flags: ['forwardable']
  },
  {
    id: 'KRB-005',
    ticketType: 'TGT',
    username: 'bob.wilson@contoso.com',
    service: 'krbtgt/CONTOSO.COM',
    clientAddress: '192.168.1.103',
    issueTime: '2024-12-22 14:00:00',
    expiryTime: '2024-12-23 00:00:00',
    encryptionType: 'AES128-CTS-HMAC-SHA1-96',
    status: 'Expired',
    flags: ['forwardable', 'renewable']
  },
  {
    id: 'KRB-006',
    ticketType: 'TGS',
    username: 'mary.jones@contoso.com',
    service: 'cifs/fileserver.contoso.com',
    clientAddress: '192.168.1.104',
    issueTime: '2024-12-23 10:00:00',
    expiryTime: '2024-12-23 20:00:00',
    encryptionType: 'AES256-CTS-HMAC-SHA1-96',
    status: 'Active',
    flags: ['forwardable']
  },
  {
    id: 'KRB-007',
    ticketType: 'TGT',
    username: 'test.user@contoso.com',
    service: 'krbtgt/CONTOSO.COM',
    clientAddress: '192.168.1.150',
    issueTime: '2024-12-23 11:00:00',
    expiryTime: '2024-12-23 11:30:00',
    encryptionType: 'DES-CBC-MD5',
    status: 'Revoked',
    flags: ['forwardable']
  },
  {
    id: 'KRB-008',
    ticketType: 'TGS',
    username: 'alice.brown@contoso.com',
    service: 'LDAP/dc01.contoso.com',
    clientAddress: '192.168.1.105',
    issueTime: '2024-12-23 08:30:00',
    expiryTime: '2024-12-23 18:30:00',
    encryptionType: 'AES256-CTS-HMAC-SHA1-96',
    status: 'Active',
    flags: ['forwardable', 'renewable']
  }
];

interface KerberosViewProps {
  onBack: () => void;
}

export function KerberosView({ onBack }: KerberosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredTickets = mockKerberosTickets.filter(ticket => {
    const matchesSearch =
      ticket.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.clientAddress.includes(searchTerm);

    const matchesType = filterType === 'All' || ticket.ticketType === filterType;
    const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const activeCount = mockKerberosTickets.filter(t => t.status === 'Active').length;
  const expiredCount = mockKerberosTickets.filter(t => t.status === 'Expired').length;
  const revokedCount = mockKerberosTickets.filter(t => t.status === 'Revoked').length;
  const weakEncryption = mockKerberosTickets.filter(t =>
    t.encryptionType.includes('RC4') || t.encryptionType.includes('DES')
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'Revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEncryptionWarning = (encType: string) => {
    if (encType.includes('DES') || encType.includes('RC4')) {
      return <AlertTriangle className="text-orange-500" size={16} />;
    }
    return null;
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
            <span className="text-gray-900">Kerberos Tickets</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="text-red-600" size={32} />
              <div>
                <h1>Kerberos Ticket Management</h1>
                <p className="text-sm text-gray-600">Active Directory authentication tickets monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <RefreshCw size={18} />
                <span>Refresh</span>
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
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Tickets</p>
              <Lock className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{mockKerberosTickets.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Tickets</p>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-green-600">{activeCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Weak Encryption</p>
              <AlertTriangle className="text-orange-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-orange-600">{weakEncryption}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by username, service, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Ticket Types</option>
              <option value="TGT">TGT (Ticket Granting Ticket)</option>
              <option value="TGS">TGS (Service Ticket)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Kerberos Tickets ({filteredTickets.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encryption</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.ticketType === 'TGT' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {ticket.ticketType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ticket.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.clientAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.issueTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.expiryTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{ticket.encryptionType}</span>
                        {getEncryptionWarning(ticket.encryptionType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Warnings */}
        {weakEncryption > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Security Warning</h3>
                <p className="text-sm text-orange-800 mb-2">
                  {weakEncryption} ticket(s) are using weak encryption algorithms (RC4-HMAC or DES-CBC-MD5).
                </p>
                <p className="text-sm text-orange-800">
                  Recommendation: Upgrade to AES256-CTS-HMAC-SHA1-96 encryption for improved security.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <ScrollToTopButton />
    </div>
  );
}