import React from 'react';

export const Card = ({ children, className = '', padding = true, hover = false }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
        padding ? 'p-6' : ''
      } ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const KPICard = ({ title, value, change, trend, icon: Icon, color = 'green' }) => {
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  const isPositive = trend === 'up';

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 google-sans-flex">{value}</h3>
          {change && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-semibold google-sans-flex ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? '↑' : '↓'} {change}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};
