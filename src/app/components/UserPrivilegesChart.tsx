import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const data = [
  {
    name: 'User Privileges',
    'High Privilege Users': 95,
    'Normal Users': 303,
    'High Privilege with Internet': 19,
  },
];

interface UserPrivilegesChartProps {
  onPrivilegedUsersClick?: () => void;
}

export function UserPrivilegesChart({ onPrivilegedUsersClick }: UserPrivilegesChartProps) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
      onClick={onPrivilegedUsersClick}
    >
      <h3 className="mb-4">User Privileges Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="High Privilege Users" 
            fill="#ef4444"
          />
          <Bar dataKey="Normal Users" fill="#3b82f6" />
          <Bar dataKey="High Privilege with Internet" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-xs text-blue-600 font-medium">Click to view detailed breakdown →</p>
      </div>
    </div>
  );
}