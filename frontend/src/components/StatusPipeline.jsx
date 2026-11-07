import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const PIPELINE_STEPS = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { key: 'INTERVIEWED', label: 'Interviewed' },
  { key: 'OFFERED', label: 'Offered' },
  { key: 'ACCEPTED', label: 'Accepted' },
];

export default function StatusPipeline({ currentStatus }) {
  const isRejected = currentStatus === 'REJECTED';

  const getStepStatus = (stepKey) => {
    if (isRejected) return 'rejected';

    const currentIdx = PIPELINE_STEPS.findIndex(s => s.key === currentStatus);
    const stepIdx = PIPELINE_STEPS.findIndex(s => s.key === stepKey);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  if (isRejected) {
    return (
      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold">Application Rejected</div>
          <div className="text-xs text-rose-300/80">This application was not selected for further rounds.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />

        {PIPELINE_STEPS.map((step, index) => {
          const state = getStepStatus(step.key);

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                state === 'completed'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : state === 'active'
                  ? 'bg-sky-500 text-white font-bold ring-4 ring-sky-500/20 animate-pulse'
                  : 'bg-slate-900 border-2 border-slate-700 text-slate-500'
              }`}>
                {state === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <span className={`mt-2 text-[11px] font-medium text-center max-w-[80px] ${
                state === 'active' ? 'text-sky-400 font-semibold' : state === 'completed' ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
