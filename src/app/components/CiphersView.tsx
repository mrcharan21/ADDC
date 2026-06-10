import { ArrowLeft, Key, Search, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { ScrollToTopButton } from './ScrollToTopButton';

interface Cipher {
  id: string;
  cipherName: string;
  algorithm: string;
  keyLength: number;
  protocol: string;
  strength: 'Strong' | 'Medium' | 'Weak';
  status: 'Active' | 'Deprecated';
  usageCount: number;
  lastUsed: string;
  createdDate: string;
}

const mockCiphers: Cipher[] = [
  {
    id: '1',
    cipherName: 'TLS_AES_256_GCM_SHA384',
    algorithm: 'AES-GCM',
    keyLength: 256,
    protocol: 'TLS 1.3',
    strength: 'Strong',
    status: 'Active',
    usageCount: 1247,
    lastUsed: '2024-12-22 11:45 AM',
    createdDate: '2023-01-10'
  },
  {
    id: '2',
    cipherName: 'TLS_AES_128_GCM_SHA256',
    algorithm: 'AES-GCM',
    keyLength: 128,
    protocol: 'TLS 1.3',
    strength: 'Strong',
    status: 'Active',
    usageCount: 892,
    lastUsed: '2024-12-22 10:30 AM',
    createdDate: '2023-01-10'
  },
  {
    id: '3',
    cipherName: 'TLS_CHACHA20_POLY1305_SHA256',
    algorithm: 'ChaCha20-Poly1305',
    keyLength: 256,
    protocol: 'TLS 1.3',
    strength: 'Strong',
    status: 'Active',
    usageCount: 534,
    lastUsed: '2024-12-22 09:15 AM',
    createdDate: '2023-02-15'
  },
  {
    id: '4',
    cipherName: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
    algorithm: 'AES-GCM',
    keyLength: 256,
    protocol: 'TLS 1.2',
    strength: 'Strong',
    status: 'Active',
    usageCount: 678,
    lastUsed: '2024-12-22 08:20 AM',
    createdDate: '2022-06-20'
  },
  {
    id: '5',
    cipherName: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
    algorithm: 'AES-GCM',
    keyLength: 128,
    protocol: 'TLS 1.2',
    strength: 'Strong',
    status: 'Active',
    usageCount: 445,
    lastUsed: '2024-12-22 07:50 AM',
    createdDate: '2022-06-20'
  },
  {
    id: '6',
    cipherName: 'TLS_RSA_WITH_AES_256_CBC_SHA256',
    algorithm: 'AES-CBC',
    keyLength: 256,
    protocol: 'TLS 1.2',
    strength: 'Medium',
    status: 'Active',
    usageCount: 234,
    lastUsed: '2024-12-21 04:30 PM',
    createdDate: '2021-03-15'
  },
  {
    id: '7',
    cipherName: 'TLS_RSA_WITH_AES_128_CBC_SHA',
    algorithm: 'AES-CBC',
    keyLength: 128,
    protocol: 'TLS 1.2',
    strength: 'Medium',
    status: 'Active',
    usageCount: 187,
    lastUsed: '2024-12-21 03:15 PM',
    createdDate: '2021-03-15'
  },
  {
    id: '8',
    cipherName: 'TLS_RSA_WITH_3DES_EDE_CBC_SHA',
    algorithm: '3DES',
    keyLength: 168,
    protocol: 'TLS 1.0',
    strength: 'Weak',
    status: 'Deprecated',
    usageCount: 12,
    lastUsed: '2024-11-10 02:20 PM',
    createdDate: '2020-01-05'
  },
  {
    id: '9',
    cipherName: 'TLS_DHE_RSA_WITH_AES_256_CBC_SHA256',
    algorithm: 'AES-CBC',
    keyLength: 256,
    protocol: 'TLS 1.2',
    strength: 'Medium',
    status: 'Active',
    usageCount: 156,
    lastUsed: '2024-12-20 11:00 AM',
    createdDate: '2022-08-10'
  },
  {
    id: '10',
    cipherName: 'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
    algorithm: 'AES-GCM',
    keyLength: 256,
    protocol: 'TLS 1.2',
    strength: 'Strong',
    status: 'Active',
    usageCount: 723,
    lastUsed: '2024-12-22 11:20 AM',
    createdDate: '2022-09-05'
  }
];

interface CiphersViewProps {
  onBack: () => void;
}

export function CiphersView({ onBack }: CiphersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStrength, setFilterStrength] = useState<'All' | 'Strong' | 'Medium' | 'Weak'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Deprecated'>('All');

  const filteredCiphers = mockCiphers.filter(cipher => {
    const matchesSearch = 
      cipher.cipherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cipher.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cipher.protocol.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStrength = filterStrength === 'All' || cipher.strength === filterStrength;
    const matchesStatus = filterStatus === 'All' || cipher.status === filterStatus;
    
    return matchesSearch && matchesStrength && matchesStatus;
  });

  const strongCiphers = mockCiphers.filter(c => c.strength === 'Strong').length;
  const mediumCiphers = mockCiphers.filter(c => c.strength === 'Medium').length;
  const weakCiphers = mockCiphers.filter(c => c.strength === 'Weak').length;
  const deprecatedCiphers = mockCiphers.filter(c => c.status === 'Deprecated').length;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Weak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'Strong': return <CheckCircle className="text-green-500" size={32} />;
      case 'Medium': return <AlertTriangle className="text-yellow-500" size={32} />;
      case 'Weak': return <XCircle className="text-red-500" size={32} />;
      default: return <Key className="text-gray-500" size={32} />;
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
            <Key className="text-blue-600" size={32} />
            <div>
              <h1>Cipher Suite Management</h1>
              <p className="text-sm text-gray-600">Encryption algorithms and key configurations</p>
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
                <p className="text-sm text-gray-600">Strong Ciphers</p>
                <p className="text-2xl font-semibold text-green-600">{strongCiphers}</p>
              </div>
              {getStrengthIcon('Strong')}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medium Ciphers</p>
                <p className="text-2xl font-semibold text-yellow-600">{mediumCiphers}</p>
              </div>
              {getStrengthIcon('Medium')}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weak Ciphers</p>
                <p className="text-2xl font-semibold text-red-600">{weakCiphers}</p>
              </div>
              {getStrengthIcon('Weak')}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deprecated</p>
                <p className="text-2xl font-semibold text-gray-600">{deprecatedCiphers}</p>
              </div>
              <XCircle className="text-gray-500" size={32} />
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
                placeholder="Search ciphers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterStrength}
              onChange={(e) => setFilterStrength(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Strengths</option>
              <option value="Strong">Strong</option>
              <option value="Medium">Medium</option>
              <option value="Weak">Weak</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Deprecated">Deprecated</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCiphers.length} of {mockCiphers.length} cipher suites
          </div>
        </div>

        {/* Ciphers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cipher Suite</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Length</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strength</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCiphers.map((cipher) => (
                  <tr key={cipher.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Key className="text-orange-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 text-sm">{cipher.cipherName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cipher.algorithm}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cipher.keyLength} bits
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {cipher.protocol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStrengthColor(cipher.strength)}`}>
                        {cipher.strength}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cipher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cipher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cipher.usageCount.toLocaleString()}
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
