import { Server, Monitor } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CriticalGroupMachinesChartProps {
  onServersClick?: () => void;
  onEndpointsClick?: () => void;
}

export function CriticalGroupMachinesChart({ onServersClick, onEndpointsClick }: CriticalGroupMachinesChartProps) {
  const data = [
    {
      name: 'Servers',
      count: 28,
      color: '#8b5cf6'
    },
    {
      name: 'Endpoints',
      count: 45,
      color: '#3b82f6'
    }
  ];

  const totalMachines = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Critical Group Machines</h2>
          <p className="text-sm text-gray-600">Servers and endpoints in critical security groups</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-gray-900">{totalMachines}</div>
          <div className="text-sm text-gray-600">Total Machines</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
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
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="count" 
            name="Machines in Critical Groups"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  if (index === 0 && onServersClick) onServersClick();
                  if (index === 1 && onEndpointsClick) onEndpointsClick();
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Info */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Critical Groups:</span> Domain Admins, Enterprise Admins, Schema Admins, Administrators, Account Operators
        </p>
      </div>
    </div>
  );
}