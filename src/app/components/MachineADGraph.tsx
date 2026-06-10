import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2024-12-17', joined: 12, exited: 3 },
  { date: '2024-12-18', joined: 18, exited: 5 },
  { date: '2024-12-19', joined: 25, exited: 7 },
  { date: '2024-12-20', joined: 15, exited: 4 },
  { date: '2024-12-21', joined: 22, exited: 6 },
  { date: '2024-12-22', joined: 28, exited: 8 },
  { date: '2024-12-23', joined: 20, exited: 5 },
];

interface MachineADGraphProps {
  onClick?: () => void;
}

export function MachineADGraph({ onClick }: MachineADGraphProps) {
  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-green-300 transition-all' : ''}`}
      onClick={onClick}
    >
      <h3 className="mb-2">Machine AD Join/Exit Activity</h3>
      <p className="text-sm text-gray-600 mb-4">Track devices joining and leaving the Active Directory domain</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="joined" stroke="#10b981" strokeWidth={2} name="AD Joined" />
          <Line type="monotone" dataKey="exited" stroke="#ef4444" strokeWidth={2} name="AD Exited" />
        </LineChart>
      </ResponsiveContainer>
      {onClick && (
        <div className="mt-4 text-center">
          <p className="text-xs text-green-600 font-medium">Click to view detailed AD join/exit activity →</p>
        </div>
      )}
    </div>
  );
}