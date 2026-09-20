import React from 'react';

export const StatCard = ({
  title,
  count,
  icon,
  subtitle,
  gradient = 'from-indigo-500 to-purple-600',
}) => {
  return (
    <div className="glass-indigo p-6 rounded-3xl border border-indigo-950/20 shadow-xl hover-lift relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-indigo-950 font-serif tracking-wide">{title}</span>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-xl shadow-md text-white`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-4xl font-extrabold text-indigo-950 font-serif tracking-tight mb-1">
          {typeof count === 'number' ? count.toLocaleString() : count}
        </h3>
        {subtitle && <p className="text-xs text-indigo-800 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};
