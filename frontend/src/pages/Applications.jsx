import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../services/applicationsApi';
import { offersApi } from '../services/offersApi';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import StatusPipeline from '../components/StatusPipeline';
import { LoadingSpinner, ErrorAlert, EmptyState, Modal } from '../components/Modal';
import { Award, CheckCircle2, FileText, ChevronRight, Calendar, ExternalLink } from 'lucide-react';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await applicationsApi.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to ACCEPT this offer? Accepting will finalize your placement and prevent applying to further drives this season.')) {
      return;
    }

    setAcceptingOfferId(offerId);
    setError('');
    try {
      await offersApi.acceptOffer(offerId);
      await fetchApplications();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to accept offer.');
    } finally {
      setAcceptingOfferId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving your submitted applications..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">My Applications</h2>
        <p className="text-xs text-slate-400 mt-1">
          Track real-time progress across recruitment rounds, interview schedules, and job offers.
        </p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {applications.length === 0 ? (
        <EmptyState title="No Applications Submitted" message="You have not applied for any placement drives yet." />
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const hasOffer = !!app.offer;
            const isOfferAccepted = app.offer?.accepted;

            return (
              <div
                key={app.application_id}
                className={`glass-panel p-6 rounded-3xl border transition-all ${
                  isOfferAccepted
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                  <div>
                    <div className="text-[11px] font-mono text-sky-400">
                      APPLICATION #{app.application_id}
                    </div>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">
                      {app.job?.company?.company_name}
                    </h3>
                    <p className="text-sm font-semibold text-slate-300">
                      {app.job?.role} • Season {app.job?.season}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    <Badge status={app.status} />
                    <span className="text-[11px] text-slate-400">
                      Submitted: {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Pipeline Progression View */}
                <div className="py-6 border-b border-slate-800/60">
                  <StatusPipeline currentStatus={app.status} />
                </div>

                {/* Offer Action Banner (If Offered) */}
                {hasOffer && (
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          Job Offer Received — {app.offer.package_lpa.toFixed(2)} LPA
                        </div>
                        <div className="text-xs text-slate-300">
                          Offer Letter Ref: <span className="font-mono text-emerald-300">{app.offer.offer_letter_key}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isOfferAccepted ? (
                        <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>OFFER ACCEPTED</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAcceptOffer(app.offer.offer_id)}
                          disabled={acceptingOfferId === app.offer.offer_id}
                          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition transform hover:scale-105 disabled:opacity-50"
                        >
                          {acceptingOfferId === app.offer.offer_id ? 'Accepting...' : 'ACCEPT OFFER NOW'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer details button */}
                <div className="mt-4 pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Last Updated: {new Date(app.updated_at).toLocaleString()}</span>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-sky-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    View Interview History & Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Detail Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Application #${selectedApp?.application_id} Details`}
      >
        {selectedApp && (
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-base font-bold text-white">{selectedApp.job?.company?.company_name}</div>
              <div className="text-xs text-slate-300">{selectedApp.job?.role}</div>
              <div className="text-xs text-slate-400">Drive Date: {selectedApp.job?.drive_date}</div>
              <div className="pt-2"><Badge status={selectedApp.status} /></div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scheduled Interview Rounds</h4>
              {selectedApp.interview_slots?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No interview slots scheduled yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedApp.interview_slots.map((slot) => (
                    <div key={slot.interview_slot_id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-200">Round {slot.round_number}</div>
                        <div className="text-slate-400">Venue: {slot.venue}</div>
                        <div className="text-slate-500">{new Date(slot.scheduled_at).toLocaleString()}</div>
                      </div>
                      <Badge status={slot.result || 'PENDING'} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
