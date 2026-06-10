import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';

const timeBasedLoginData = [
  { time: '00:00', domainAdmin: 2, endpointAdmin: 1 },
  { time: '02:00', domainAdmin: 1, endpointAdmin: 0 },
  { time: '04:00', domainAdmin: 0, endpointAdmin: 1 },
  { time: '06:00', domainAdmin: 3, endpointAdmin: 2 },
  { time: '08:00', domainAdmin: 12, endpointAdmin: 18 },
  { time: '10:00', domainAdmin: 8, endpointAdmin: 15 },
  { time: '12:00', domainAdmin: 6, endpointAdmin: 10 },
  { time: '14:00', domainAdmin: 9, endpointAdmin: 14 },
  { time: '16:00', domainAdmin: 7, endpointAdmin: 12 },
  { time: '18:00', domainAdmin: 5, endpointAdmin: 8 },
  { time: '20:00', domainAdmin: 3, endpointAdmin: 4 },
  { time: '22:00', domainAdmin: 2, endpointAdmin: 2 },
];

interface AdminEndpointLoginsChartProps {
  onClick?: () => void;
}

export function AdminEndpointLoginsChart({ onClick }: AdminEndpointLoginsChartProps) {
  const totalDomainAdmin = timeBasedLoginData.reduce((sum, item) => sum + item.domainAdmin, 0);
  const totalEndpointAdmin = timeBasedLoginData.reduce((sum, item) => sum + item.endpointAdmin, 0);
  const totalLogins = totalDomainAdmin + totalEndpointAdmin;

  // Find peak hour
  const peakHour = timeBasedLoginData.reduce((max, item) => 
    (item.domainAdmin + item.endpointAdmin) > (max.domainAdmin + max.endpointAdmin) ? item : max
  );

  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-red-300 transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="mb-1">Endpoints vs domain admin login distribution</h3>
          <p className="text-sm text-gray-600">Today's domain and endpoint admin login activity by time</p>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <Clock size={20} />
          <span className="text-sm font-medium">Real-time</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Total Logins</span>
            <TrendingUp className="text-gray-600" size={14} />
          </div>
          <div className="text-xl font-semibold text-gray-900">{totalLogins}</div>
        </div>

        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-red-900">Domain Admin</span>
            <Clock className="text-red-600" size={14} />
          </div>
          <div className="text-xl font-semibold text-red-600">{totalDomainAdmin}</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-900">Endpoint Admin</span>
            <Clock className="text-blue-600" size={14} />
          </div>
          <div className="text-xl font-semibold text-blue-600">{totalEndpointAdmin}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={timeBasedLoginData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            style={{ fontSize: '12px' }}
            stroke="#6b7280"
          />
          <YAxis 
            style={{ fontSize: '12px' }}
            stroke="#6b7280"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="domainAdmin" 
            fill="#dc2626" 
            name="Domain Admin Logins" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="endpointAdmin" 
            fill="#3b82f6" 
            name="Endpoint Admin Logins" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Peak Activity:</span> {peakHour.time} ({peakHour.domainAdmin + peakHour.endpointAdmin} logins)
          </p>
          {onClick && (
            <p className="text-xs text-red-600 font-medium">Click for detailed analysis →</p>
          )}
        </div>
      </div>
    </div>
  );
}