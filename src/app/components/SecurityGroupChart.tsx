import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Active Security Groups', value: 168 },
  { name: 'Passive Security Groups', value: 35 },
];

const COLORS = ['#10b981', '#6b7280'];

interface SecurityGroupChartProps {
  onActiveGroupsClick?: () => void;
  onPassiveGroupsClick?: () => void;
  onPassiveGroupsFilterClick?: (filter?: string) => void;
}

export function SecurityGroupChart({ onActiveGroupsClick, onPassiveGroupsClick, onPassiveGroupsFilterClick }: SecurityGroupChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="mb-4">Security Group Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onClick={(data) => {
              if (data.name === 'Active Security Groups' && onActiveGroupsClick) {
                onActiveGroupsClick();
              } else if (data.name === 'Passive Security Groups' && onPassiveGroupsClick) {
                onPassiveGroupsClick();
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Click on segments to view detailed breakdown</p>
      </div>
    </div>
  );
}