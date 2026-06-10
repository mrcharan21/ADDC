import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const loginActivityData = [
  { datetime: '06:00', domainAdmin: 5, endpointAdmin: 7 },
  { datetime: '09:00', domainAdmin: 12, endpointAdmin: 23 },
  { datetime: '12:00', domainAdmin: 8, endpointAdmin: 18 },
  { datetime: '15:00', domainAdmin: 15, endpointAdmin: 25 },
  { datetime: '18:00', domainAdmin: 6, endpointAdmin: 14 },
  { datetime: '21:00', domainAdmin: 2, endpointAdmin: 4 },
];

interface AdminActivityGraphProps {
  onClick?: () => void;
}

export function AdminActivityGraph({
  onClick
}: AdminActivityGraphProps) {
  return (
    null
  );
}