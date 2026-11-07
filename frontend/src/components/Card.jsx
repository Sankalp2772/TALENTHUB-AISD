import React from 'react';

export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, color = 'sky', subtext }) {
  const colorMap = {
    sky: 'from-sky-500/20 to-blue-600/10 text-sky-400 border-sky-500/20',
    indigo: 'from-indigo-500/20 to-purple-600/10 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-teal-600/10 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-600/10 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/20 to-pink-600/10 text-rose-400 border-rose-500/20',
  };

  const styleClass = colorMap[color] || colorMap.sky;

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${styleClass} border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-5 h-5 opacity-90" />}
      </div>
      <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">{value}</div>
      {subtext && <div className="mt-1 text-xs text-slate-400">{subtext}</div>}
    </div>
  );
}
