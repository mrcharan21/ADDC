import { UserPlus, Shield, TrendingUp, Server, Network } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CreationActivityChartProps {
  onUserCreationClick?: () => void;
  onGroupCreationClick?: () => void;
}

const activityData = [
  { date: '12/17', users: 5, groups: 2 },
  { date: '12/18', users: 8, groups: 1 },
  { date: '12/19', users: 3, groups: 3 },
  { date: '12/20', users: 12, groups: 4 },
  { date: '12/21', users: 7, groups: 2 },
  { date: '12/22', users: 9, groups: 5 },
  { date: '12/23', users: 15, groups: 3 },
  { date: '12/24', users: 11, groups: 6 },
];

export function CreationActivityChart({ onUserCreationClick, onGroupCreationClick }: CreationActivityChartProps) {
  const totalUsersThisWeek = activityData.reduce((sum, day) => sum + day.users, 0);
  const totalGroupsThisWeek = activityData.reduce((sum, day) => sum + day.groups, 0);
  const usersToday = activityData[activityData.length - 1].users;
  const groupsToday = activityData[activityData.length - 1].groups;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User & Group Creation Activity</h2>
          <p className="text-sm text-gray-600">New users and security groups created at AD and servers</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp size={20} />
          <span className="text-sm font-medium">Active</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div 
          className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onUserCreationClick}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-900">Users Today</span>
            <UserPlus className="text-blue-600" size={16} />
          </div>
          <div className="text-2xl font-semibold text-blue-600">{usersToday}</div>
        </div>

        <div 
          className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onGroupCreationClick}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-900">Groups Today</span>
            <Shield className="text-purple-600" size={16} />
          </div>
          <div className="text-2xl font-semibold text-purple-600">{groupsToday}</div>
        </div>

        <div 
          className="bg-green-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onUserCreationClick}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-900">Users (7 Days)</span>
            <UserPlus className="text-green-600" size={16} />
          </div>
          <div className="text-2xl font-semibold text-green-600">{totalUsersThisWeek}</div>
        </div>

        <div 
          className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onGroupCreationClick}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-indigo-900">Groups (7 Days)</span>
            <Shield className="text-indigo-600" size={16} />
          </div>
          <div className="text-2xl font-semibold text-indigo-600">{totalGroupsThisWeek}</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
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
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="New Users"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="groups" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="New Security Groups"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Source Breakdown */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Network className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-900">Active Directory</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Users Created:</span>
              <span className="font-semibold text-blue-600">58</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Groups Created:</span>
              <span className="font-semibold text-purple-600">21</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Server className="text-green-600" size={20} />
            <span className="text-sm font-medium text-gray-900">Individual Servers</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Users Created:</span>
              <span className="font-semibold text-blue-600">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Groups Created:</span>
              <span className="font-semibold text-purple-600">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Real-time monitoring:</span> Track user and security group creation across AD domain controllers and individual servers for security compliance.
        </p>
      </div>
    </div>
  );
}
