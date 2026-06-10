import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const passwordExpiryData = [
  { name: 'Password Never Expires', value: 83 },
  { name: 'Password Expiry Set', value: 275 },
];

const COLORS = ['#f59e0b', '#10b981'];

interface PasswordExpirationChartsProps {
  onNeverExpiresClick?: () => void;
  onExpirySetClick?: () => void;
}

export function PasswordExpirationCharts({ onNeverExpiresClick, onExpirySetClick }: PasswordExpirationChartsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="mb-4">Password Expiration Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={passwordExpiryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onClick={(data) => {
              if (data.name === 'Password Never Expires' && onNeverExpiresClick) {
                onNeverExpiresClick();
              } else if (data.name === 'Password Expiry Set' && onExpirySetClick) {
                onExpirySetClick();
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            {passwordExpiryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Click on segments to view detailed analysis</p>
      </div>
    </div>
  );
}