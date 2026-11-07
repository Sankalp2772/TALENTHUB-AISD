import React from 'react';
import { X, Loader2, Inbox, AlertTriangle } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ message = 'Loading placement data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({ title = 'No Data Found', message = 'There are no records available at this time.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-800/80 rounded-2xl bg-slate-950/30">
      <div className="p-3 bg-slate-900 rounded-full text-slate-500 mb-3 border border-slate-800">
        <Inbox className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 flex items-start justify-between gap-3 my-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-rose-400 hover:text-rose-200 text-xs font-semibold">
          Dismiss
        </button>
      )}
    </div>
  );
}
