import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsApi } from '../services/jobsApi';
import { applicationsApi } from '../services/applicationsApi';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import { LoadingSpinner, ErrorAlert } from '../components/Modal';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  GraduationCap,
  Layers,
  Send
} from 'lucide-react';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await jobsApi.getJobById(jobId);
      setJob(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load drive details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setSubmitting(true);
    setError('');
    setSuccessMsg('');
    try {
      await applicationsApi.applyForJob(jobId);
      setSuccessMsg('Application submitted successfully!');
      // Refresh details to update state
      await fetchJobDetails();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading drive specifications..." />;
  if (error && !job) return <ErrorAlert message={error} />;

  const allowedBranches = job?.allowed_branches?.map(b => b.branch) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/student/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Job Listings</span>
      </Link>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Drive Header Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-xs rounded-lg uppercase tracking-wider">
                {job.season} Placement Drive
              </span>
              <Badge status={job.is_open ? 'OPEN' : 'CLOSED'} />
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">{job.company?.company_name}</h1>
            <p className="text-xl font-semibold text-slate-300 mt-1">{job.role}</p>
          </div>

          {/* Dynamic Apply Action Button */}
          <div className="flex-shrink-0">
            {!job.is_open ? (
              <button disabled className="px-6 py-3.5 bg-slate-800 text-slate-400 text-sm font-bold rounded-2xl border border-slate-700 cursor-not-allowed">
                DRIVE CLOSED
              </button>
            ) : job.already_applied ? (
              <div className="flex flex-col items-end gap-1">
                <button disabled className="px-6 py-3.5 bg-emerald-500/20 text-emerald-300 text-sm font-bold rounded-2xl border border-emerald-500/40 cursor-default flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>ALREADY APPLIED</span>
                </button>
                <Link to="/student/applications" className="text-[11px] text-sky-400 hover:underline font-medium">
                  Track status in My Applications →
                </Link>
              </div>
            ) : !job.is_eligible ? (
              <button disabled className="px-6 py-3.5 bg-rose-500/10 text-rose-400 text-sm font-bold rounded-2xl border border-rose-500/30 cursor-not-allowed flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>NOT ELIGIBLE TO APPLY</span>
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={submitting}
                className="px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-sky-500/25 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{submitting ? 'Submitting Application...' : 'APPLY NOW'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Eligibility Status Card & Drive Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Eligibility Verification Box */}
        <Card title="Eligibility Verification" subtitle="Automated check against your student profile">
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              job.is_eligible
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {job.is_eligible ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold">You are Eligible for this Drive!</div>
                    <div className="text-xs text-emerald-400/80">Your CGPA, backlogs, and branch satisfy all drive requirements.</div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold">Ineligibility Status Detected</div>
                    <div className="text-xs text-rose-300/80">Review the reasons below:</div>
                  </div>
                </>
              )}
            </div>

            {!job.is_eligible && job.ineligibility_reasons?.length > 0 && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase">Reasons:</div>
                <ul className="space-y-1.5 text-xs text-rose-400">
                  {job.ineligibility_reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Drive Criteria Summary */}
        <Card title="Placement Drive Requirements" subtitle="Official criteria set by Placement Cell">
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Minimum CGPA:</span>
              <span className="font-bold text-sky-400">{job.min_cgpa.toFixed(2)} / 10.00</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Max Active Backlogs:</span>
              <span className="font-bold text-slate-200">{job.max_active_backlogs}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Scheduled Drive Date:</span>
              <span className="font-bold text-slate-200">{job.drive_date}</span>
            </div>

            <div className="pt-2">
              <span className="text-slate-400 block mb-2 text-xs font-medium">Eligible Branches:</span>
              {allowedBranches.length === 0 ? (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg">
                  OPEN TO ALL BRANCHES
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {allowedBranches.map((b) => (
                    <span key={b} className="px-3 py-1 bg-slate-900 border border-slate-800 text-sky-300 font-mono text-xs rounded-lg">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
