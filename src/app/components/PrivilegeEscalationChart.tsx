import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const escalationData = [
  { date: '12/17', users: 3, groups: 1 },
  { date: '12/18', users: 5, groups: 2 },
  { date: '12/19', users: 2, groups: 0 },
  { date: '12/20', users: 7, groups: 3 },
  { date: '12/21', users: 4, groups: 1 },
  { date: '12/22', users: 8, groups: 4 },
  { date: '12/23', users: 6, groups: 2 },
];

interface PrivilegeEscalationChartProps {
  onClick?: () => void;
}

export function PrivilegeEscalationChart({ onClick }: PrivilegeEscalationChartProps) {
  const totalEscalations = escalationData.reduce((sum, item) => sum + item.users + item.groups, 0);
  
  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-amber-300 transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="mb-1">Privilege Escalation Tracking</h3>
            <AlertTriangle className="text-amber-600" size={20} />
          </div>
          <p className="text-sm text-gray-600">Monitor privilege changes for users and groups over time</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Events (7 days)</p>
          <p className="text-2xl font-semibold text-amber-600">{totalEscalations}</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={escalationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            name="User Privilege Escalations"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="groups" 
            stroke="#dc2626" 
            strokeWidth={2} 
            name="Group Privilege Escalations"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">User Escalations</p>
          <p className="text-xl font-semibold text-amber-600">
            {escalationData.reduce((sum, item) => sum + item.users, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Group Escalations</p>
          <p className="text-xl font-semibold text-red-600">
            {escalationData.reduce((sum, item) => sum + item.groups, 0)}
          </p>
        </div>
      </div>
      
      {onClick && (
        <div className="mt-4 text-center">
          <p className="text-xs text-amber-600 font-medium">Click to view detailed escalation events →</p>
        </div>
      )}
    </div>
  );
}
