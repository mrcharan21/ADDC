import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Admin Accounts',
    'Domain Admin': 15,
    'Endpoint Admin': 47,
  },
];

interface AdminAccountsGraphProps {
  onClick?: () => void;
}

export function AdminAccountsGraph({ onClick }: AdminAccountsGraphProps) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-purple-300 transition-all"
      onClick={onClick}
    >
      <h3 className="mb-4">Admin Accounts Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Domain Admin" fill="#dc2626" />
          <Bar dataKey="Endpoint Admin" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-xs text-purple-600 font-medium">Click to view detailed admin accounts overview →</p>
      </div>
    </div>
  );
}