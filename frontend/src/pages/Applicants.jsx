import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { offersApi } from '../services/offersApi';
import { applicationsApi } from '../services/applicationsApi';
import { interviewsApi } from '../services/interviewsApi';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import { LoadingSpinner, ErrorAlert, Modal, EmptyState } from '../components/Modal';
import { ArrowLeft, User, Calendar, Award, CheckCircle2, ChevronRight, Filter, AlertTriangle, Send } from 'lucide-react';

export default function Applicants() {
  const { jobId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [offerModalApp, setOfferModalApp] = useState(null);

  // Form states for Interview
  const [roundNumber, setRoundNumber] = useState('1');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [venue, setVenue] = useState('Campus Placement Cell / Virtual Room 1');
  const [notes, setNotes] = useState('');

  // Form states for Offer
  const [packageLpa, setPackageLpa] = useState('12.0');
  const [offerLetterKey, setOfferLetterKey] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await offersApi.getJobApplicants(jobId);
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch drive applicants.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setError('');
    setSuccessMsg('');
    try {
      await applicationsApi.updateStatus(appId, newStatus);
      setSuccessMsg(`Application status updated to ${newStatus}`);
      await fetchApplicants();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update application status.');
    }
  };

  const handleOpenScheduleModal = (app) => {
    setInterviewModalApp(app);
    // suggest round number based on existing slots count + 1
    const nextRound = (app.interview_slots?.length || 0) + 1;
    setRoundNumber(nextRound.toString());
    setScheduledDate('');
    setScheduledTime('10:00');
    setVenue('Campus Placement Cell / Virtual Room 1');
    setNotes('');
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewModalApp) return;
    setError('');
    setSuccessMsg('');

    const scheduledAtStr = `${scheduledDate}T${scheduledTime}:00`;

    try {
      await interviewsApi.createInterview({
        application_id: interviewModalApp.application_id,
        round_number: parseInt(roundNumber),
        scheduled_at: scheduledAtStr,
        venue,
        result: 'PENDING',
        notes
      });

      setSuccessMsg(`Interview Round ${roundNumber} scheduled successfully!`);
      setInterviewModalApp(null);
      await fetchApplicants();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to schedule interview round.');
    }
  };

  const handleOpenOfferModal = (app) => {
    setOfferModalApp(app);
    setPackageLpa('12.00');
    setOfferLetterKey(`OFFER_${app.usn}_${Date.now().toString().slice(-4)}.pdf`);
  };

  const handleCreateOfferSubmit = async (e) => {
    e.preventDefault();
    if (!offerModalApp) return;
    setError('');
    setSuccessMsg('');

    try {
      await offersApi.createOffer({
        application_id: offerModalApp.application_id,
        package_lpa: parseFloat(packageLpa),
        offer_letter_key: offerLetterKey
      });

      setSuccessMsg('Job offer generated successfully!');
      setOfferModalApp(null);
      await fetchApplicants();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate offer.');
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving applicant profiles and interview histories..." />;
  if (error && !data) return <ErrorAlert message={error} />;

  const job = data?.job || {};
  const applicants = data?.applicants || [];

  const filteredApplicants = applicants.filter(a => !statusFilter || a.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/admin/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Placement Drives</span>
      </Link>

      {/* Drive Summary Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{job.season} Season</span>
            <Badge status={job.is_open ? 'OPEN' : 'CLOSED'} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">{job.company_name}</h2>
          <p className="text-sm font-semibold text-slate-300">{job.role}</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Applicants</div>
            <div className="text-lg font-bold text-amber-400">{data?.total_applicants}</div>
          </div>
          <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Min CGPA</div>
            <div className="text-lg font-bold text-slate-200">{job.min_cgpa?.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center justify-between text-xs font-semibold">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 text-xs">Dismiss</button>
        </div>
      )}

      {/* Applicants Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <h3 className="text-sm font-bold text-slate-100">Applicants Evaluation List</h3>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="APPLIED">APPLIED</option>
            <option value="SHORTLISTED">SHORTLISTED</option>
            <option value="INTERVIEW_SCHEDULED">INTERVIEW SCHEDULED</option>
            <option value="INTERVIEWED">INTERVIEWED</option>
            <option value="OFFERED">OFFERED</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        {filteredApplicants.length === 0 ? (
          <EmptyState title="No Applicants Found" message="No applicants match the current filter query." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">USN / Branch</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Backlogs</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredApplicants.map((app) => (
                  <tr key={app.application_id} className="hover:bg-slate-900/50 transition">
                    <td className="px-6 py-4 font-bold text-white">
                      <div>{app.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-amber-300 font-semibold">{app.usn}</div>
                      <div className="text-slate-400 text-[11px]">{app.branch}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">{app.cgpa?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-300">{app.active_backlogs}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* Status transition action buttons */}
                        {app.status === 'APPLIED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.application_id, 'SHORTLISTED')}
                            className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[11px] font-semibold rounded-lg transition"
                          >
                            Shortlist
                          </button>
                        )}

                        {(app.status === 'APPLIED' || app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED') && (
                          <button
                            onClick={() => handleOpenScheduleModal(app)}
                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Schedule Interview</span>
                          </button>
                        )}

                        {app.status === 'INTERVIEW_SCHEDULED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.application_id, 'INTERVIEWED')}
                            className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold rounded-lg transition"
                          >
                            Mark Interviewed
                          </button>
                        )}

                        {(app.status === 'INTERVIEWED' || app.status === 'SHORTLISTED') && !app.offer && (
                          <button
                            onClick={() => handleOpenOfferModal(app)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
                          >
                            <Award className="w-3 h-3" />
                            <span>Create Offer</span>
                          </button>
                        )}

                        {app.offer && !app.offer.accepted && (
                          <span className="text-[10px] text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                            Offer Generated ({app.offer.package_lpa} LPA)
                          </span>
                        )}

                        {app.offer?.accepted && (
                          <span className="text-[10px] text-green-300 font-bold px-2 py-1 bg-green-500/20 rounded border border-green-500/40">
                            ACCEPTED 🎉
                          </span>
                        )}

                        {app.status !== 'REJECTED' && app.status !== 'ACCEPTED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.application_id, 'REJECTED')}
                            className="px-2 py-1 text-rose-400 hover:bg-rose-500/10 text-[11px] font-medium rounded transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={!!interviewModalApp}
        onClose={() => setInterviewModalApp(null)}
        title={`Schedule Interview — ${interviewModalApp?.name}`}
      >
        <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Round Number</label>
              <input
                type="number"
                min="1"
                required
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Date</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Time</label>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Venue / Link</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Notes / Instructions</label>
            <textarea
              rows="2"
              placeholder="e.g. Technical DSA round; bring physical resume copy."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setInterviewModalApp(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg transition"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Offer Modal */}
      <Modal
        isOpen={!!offerModalApp}
        onClose={() => setOfferModalApp(null)}
        title={`Generate Job Offer — ${offerModalApp?.name}`}
      >
        <form onSubmit={handleCreateOfferSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Package LPA (Lakhs Per Annum)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              required
              value={packageLpa}
              onChange={(e) => setPackageLpa(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none text-base font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Offer Letter Reference Key / PDF Name</label>
            <input
              type="text"
              required
              value={offerLetterKey}
              onChange={(e) => setOfferLetterKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setOfferModalApp(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-xl shadow-lg transition"
            >
              Issue Job Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
