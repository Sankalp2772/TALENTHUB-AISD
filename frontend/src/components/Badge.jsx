import React from 'react';

export default function Badge({ status, variant }) {
  const getStyle = (val) => {
    switch (val?.toUpperCase()) {
      case 'APPLIED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'SHORTLISTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW SCHEDULED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'INTERVIEWED':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'OFFERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'ACCEPTED':
        return 'bg-green-500/20 text-green-300 border-green-500/50 font-bold';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'OPEN':
      case 'TRUE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CLOSED':
      case 'FALSE':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'PASSED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'PENDING':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'FAILED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const styleClass = variant ? getStyle(variant) : getStyle(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}
