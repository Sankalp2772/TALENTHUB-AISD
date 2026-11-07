import React, { useState, useEffect } from 'react';
import { interviewsApi } from '../services/interviewsApi';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import { LoadingSpinner, ErrorAlert, EmptyState } from '../components/Modal';
import { Calendar, Clock, MapPin, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UPCOMING, COMPLETED

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await interviewsApi.getInterviews();
      setInterviews(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load interview schedules.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching interview slots and venues..." />;

  const filteredInterviews = interviews.filter((i) => {
    if (activeTab === 'UPCOMING') return i.result === 'PENDING';
    if (activeTab === 'COMPLETED') return i.result !== 'PENDING';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Interview Schedule</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track interview dates, round venues, interviewer feedback notes, and results.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {['ALL', 'UPCOMING', 'COMPLETED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === tab
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {filteredInterviews.length === 0 ? (
        <EmptyState title="No Interviews Found" message="There are no interview slots listed under this view." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInterviews.map((slot) => {
            const dt = new Date(slot.scheduled_at);

            return (
              <div
                key={slot.interview_slot_id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                        R{slot.round_number}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {slot.application?.job?.company?.company_name}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium">
                          {slot.application?.job?.role}
                        </p>
                      </div>
                    </div>
                    <Badge status={slot.result || 'PENDING'} />
                  </div>

                  <div className="space-y-3 py-4 border-t border-b border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <Calendar className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>Date: <strong className="text-white">{dt.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-300">
                      <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Time: <strong className="text-white">{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-300">
                      <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Venue: <strong className="text-white">{slot.venue}</strong></span>
                    </div>
                  </div>

                  {slot.notes && (
                    <div className="mt-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Interviewer Notes</span>
                      </div>
                      <p className="italic text-slate-300">{slot.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 flex justify-between">
                  <span>Application #{slot.application_id}</span>
                  <span>Round #{slot.round_number}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
