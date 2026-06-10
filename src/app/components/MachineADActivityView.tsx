import { ArrowLeft, Search, Download, Monitor, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ADActivity {
  id: string;
  machineName: string;
  machineType: 'Desktop' | 'Laptop' | 'Server';
  activityType: 'Joined' | 'Exited';
  timestamp: string;
  ipAddress: string;
  ou: string;
  performedBy: string;
  operatingSystem: string;
  reason: string;
  status: 'Success' | 'Failed';
}

const mockADActivities: ADActivity[] = [
  {
    id: '1',
    machineName: 'DESKTOP-WIN11-045',
    machineType: 'Desktop',
    activityType: 'Joined',
    timestamp: '2024-12-23 14:30',
    ipAddress: '192.168.1.145',
    ou: 'Workstations',
    performedBy: 'it.admin',
    operatingSystem: 'Windows 11 Pro',
    reason: 'New employee onboarding',
    status: 'Success'
  },
  {
    id: '2',
    machineName: 'LAPTOP-ENG-023',
    machineType: 'Laptop',
    activityType: 'Joined',
    timestamp: '2024-12-23 13:15',
    ipAddress: '192.168.1.167',
    ou: 'Engineering',
    performedBy: 'domain.admin1',
    operatingSystem: 'Windows 10 Pro',
    reason: 'Department expansion',
    status: 'Success'
  },
  {
    id: '3',
    machineName: 'DESKTOP-OLD-012',
    machineType: 'Desktop',
    activityType: 'Exited',
    timestamp: '2024-12-23 11:45',
    ipAddress: '192.168.1.98',
    ou: 'Finance',
    performedBy: 'it.helpdesk',
    operatingSystem: 'Windows 7 Pro',
    reason: 'Device decommissioned',
    status: 'Success'
  },
  {
    id: '4',
    machineName: 'SRV-APP-NEW-01',
    machineType: 'Server',
    activityType: 'Joined',
    timestamp: '2024-12-23 10:20',
    ipAddress: '192.168.1.250',
    ou: 'Servers',
    performedBy: 'server.admin',
    operatingSystem: 'Windows Server 2022',
    reason: 'New application server',
    status: 'Success'
  },
  {
    id: '5',
    machineName: 'LAPTOP-SALES-078',
    machineType: 'Laptop',
    activityType: 'Exited',
    timestamp: '2024-12-23 09:30',
    ipAddress: '192.168.1.189',
    ou: 'Sales',
    performedBy: 'it.admin',
    operatingSystem: 'Windows 10 Pro',
    reason: 'Employee termination',
    status: 'Success'
  },
  {
    id: '6',
    machineName: 'DESKTOP-MKT-056',
    machineType: 'Desktop',
    activityType: 'Joined',
    timestamp: '2024-12-22 16:45',
    ipAddress: '192.168.1.203',
    ou: 'Marketing',
    performedBy: 'domain.admin2',
    operatingSystem: 'Windows 11 Pro',
    reason: 'Replacement device',
    status: 'Success'
  },
  {
    id: '7',
    machineName: 'SRV-DB-OLD-02',
    machineType: 'Server',
    activityType: 'Exited',
    timestamp: '2024-12-22 14:20',
    ipAddress: '192.168.1.245',
    ou: 'Database Servers',
    performedBy: 'db.admin',
    operatingSystem: 'Windows Server 2012 R2',
    reason: 'Server migration completed',
    status: 'Success'
  },
  {
    id: '8',
    machineName: 'LAPTOP-HR-034',
    machineType: 'Laptop',
    activityType: 'Joined',
    timestamp: '2024-12-22 11:30',
    ipAddress: '192.168.1.175',
    ou: 'Human Resources',
    performedBy: 'it.helpdesk',
    operatingSystem: 'Windows 11 Pro',
    reason: 'New hire setup',
    status: 'Success'
  },
  {
    id: '9',
    machineName: 'DESKTOP-TEST-091',
    machineType: 'Desktop',
    activityType: 'Exited',
    timestamp: '2024-12-22 09:15',
    ipAddress: '192.168.1.210',
    ou: 'IT Testing',
    performedBy: 'it.admin',
    operatingSystem: 'Windows 10 Pro',
    reason: 'Test environment cleanup',
    status: 'Success'
  },
  {
    id: '10',
    machineName: 'LAPTOP-FIN-067',
    machineType: 'Laptop',
    activityType: 'Joined',
    timestamp: '2024-12-21 15:50',
    ipAddress: '192.168.1.192',
    ou: 'Finance',
    performedBy: 'domain.admin1',
    operatingSystem: 'Windows 11 Pro',
    reason: 'Contractor onboarding',
    status: 'Success'
  }
];

const activityTrendData = [
  { date: '12/17', joined: 12, exited: 3 },
  { date: '12/18', joined: 18, exited: 5 },
  { date: '12/19', joined: 25, exited: 7 },
  { date: '12/20', joined: 15, exited: 4 },
  { date: '12/21', joined: 22, exited: 6 },
  { date: '12/22', joined: 28, exited: 8 },
  { date: '12/23', joined: 20, exited: 5 },
];

interface MachineADActivityViewProps {
  onBack: () => void;
}

export function MachineADActivityView({ onBack }: MachineADActivityViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterActivityType, setFilterActivityType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState<string>('timestamp');

  const filteredActivities = mockADActivities
    .filter(activity => {
      const matchesSearch = 
        activity.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.ou.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesActivityType = filterActivityType === 'All' || activity.activityType === filterActivityType;
      const matchesStatus = filterStatus === 'All' || activity.status === filterStatus;
      
      return matchesSearch && matchesActivityType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return 0;
    });

  const totalJoined = mockADActivities.filter(a => a.activityType === 'Joined').length;
  const totalExited = mockADActivities.filter(a => a.activityType === 'Exited').length;
  const netChange = totalJoined - totalExited;

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
            <span className="text-gray-900">Machine AD Join/Exit Activity</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="text-green-600" size={32} />
              <div>
                <h1>Machine AD Join/Exit Activity</h1>
                <p className="text-sm text-gray-600">Comprehensive tracking of devices joining and leaving Active Directory</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Net Change</p>
                <p className={`text-xl font-semibold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netChange >= 0 ? '+' : ''}{netChange}
                </p>
              </div>
              
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
              <p className="text-sm text-gray-600">Devices Joined (7 days)</p>
              <LogIn className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-green-600">{totalJoined}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Devices Exited (7 days)</p>
              <LogOut className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-red-600">{totalExited}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Net Change</p>
              <Monitor className="text-blue-600" size={20} />
            </div>
            <p className={`text-2xl font-semibold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netChange >= 0 ? '+' : ''}{netChange}
            </p>
          </div>
        </div>

        {/* Activity Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day AD Join/Exit Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="joined" stroke="#10b981" strokeWidth={2} name="AD Joined" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="exited" stroke="#ef4444" strokeWidth={2} name="AD Exited" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by machine name, OU, or performed by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Filters</span>
            <ChevronDown className={`text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} size={20} />
          </button>
          
          {showFilters && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <select
                  value={filterActivityType}
                  onChange={(e) => setFilterActivityType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Activity Types</option>
                  <option value="Joined">Joined Only</option>
                  <option value="Exited">Exited Only</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="timestamp">Sort by Timestamp</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{activity.machineName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {activity.activityType === 'Joined' ? (
                          <LogIn className="text-green-600" size={16} />
                        ) : (
                          <LogOut className="text-red-600" size={16} />
                        )}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.activityType === 'Joined' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.activityType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.ou}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.performedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.operatingSystem}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredActivities.length} of {mockADActivities.length} AD activities
        </div>
      </main>
    </div>
  );
}
