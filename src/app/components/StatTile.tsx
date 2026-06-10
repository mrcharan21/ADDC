import { LucideIcon } from 'lucide-react';

interface StatTileProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
}

export function StatTile({ title, value, icon: Icon, color = 'bg-blue-500', subtitle, onClick }: StatTileProps) {
  const baseClasses = "bg-white p-6 rounded-lg shadow-sm border border-gray-200";
  const interactiveClasses = onClick ? "cursor-pointer hover:shadow-md hover:border-gray-300 transition-all" : "";
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}