import React, { useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { jobsApi } from '../services/jobsApi';
import { applicationsApi } from '../services/applicationsApi';
import { interviewsApi } from '../services/interviewsApi';
import { offersApi } from '../services/offersApi';
import { Card, StatCard } from '../components/Card';
import Badge from '../components/Badge';
import { LoadingSpinner, ErrorAlert, EmptyState } from '../components/Modal';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [openJobs, setOpenJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profData, appsData, intData, offData, jobsData] = await Promise.all([
        authApi.getStudentProfile(),
        applicationsApi.getApplications(),
        interviewsApi.getInterviews(),
        offersApi.getOffers(),
        jobsApi.getJobs({ is_open: true })
      ]);

      setProfile(profData);
      setApplications(appsData);
      setInterviews(intData);
      setOffers(offData);
      setOpenJobs(jobsData);
    } catch (err) {
      console.error(err);
      setError('Unable to load student placement dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading placement dashboard..." />;
  if (error) return <ErrorAlert message={error} onClose={() => setError('')} />;

  // Calculated Stats
  const totalApps = applications.length;
  const shortlistedApps = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED' || a.status === 'INTERVIEWED' || a.status === 'OFFERED' || a.status === 'ACCEPTED').length;
  const totalInterviews = interviews.length;
  const totalOffersCount = offers.length;

  const upcomingInterviews = interviews.filter(i => i.result === 'PENDING');
  const recentApps = applications.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Student Welcome Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900/60 via-indigo-900/40 to-slate-900 border border-sky-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Student Academic & Placement Overview</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome back, {profile?.name}!</h2>
            <p className="text-sm text-slate-300 mt-1">
              USN: <span className="font-mono text-sky-300 font-semibold">{profile?.usn}</span> | Branch: <span className="font-semibold text-slate-100">{profile?.branch}</span>
            </p>
          </div>

          {/* Academic Snapshot Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">CGPA</div>
              <div className="text-lg font-bold text-sky-400">{profile?.cgpa.toFixed(2)}</div>
            </div>

            <div className="px-4 py-2 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Backlogs</div>
              <div className={`text-lg font-bold ${profile?.active_backlogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {profile?.active_backlogs}
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Offer Status</div>
              <div className="mt-0.5">
                {profile?.has_accepted_offer ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Accepted
                  </span>
                ) : (
                  <span className="text-xs font-medium text-amber-400">No Offer Accepted</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Applications" value={totalApps} icon={FileCheck} color="sky" subtext="Jobs applied to" />
        <StatCard label="Shortlisted" value={shortlistedApps} icon={Briefcase} color="indigo" subtext="Advanced in process" />
        <StatCard label="Interviews Scheduled" value={totalInterviews} icon={Calendar} color="amber" subtext="Round schedules" />
        <StatCard label="Offers Received" value={totalOffersCount} icon={Award} color="emerald" subtext="Direct job offers" />
      </div>

      {/* Main Grid: Left column (Interviews & Applications) | Right column (Open Drives) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Interview Schedule Card */}
          <Card
            title="Upcoming Interview Schedule"
            subtitle="Scheduled rounds requiring your preparation"
            action={<Link to="/student/interviews" className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>}
          >
            {upcomingInterviews.length === 0 ? (
              <EmptyState title="No Upcoming Interviews" message="You have no interviews scheduled at the moment." />
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.map((slot) => (
                  <div key={slot.interview_slot_id} className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-sky-500/30 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl font-bold text-sm">
                        R{slot.round_number}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {slot.application?.job?.company?.company_name} — {slot.application?.job?.role}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          📍 Venue: <span className="text-slate-200">{slot.venue}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-semibold text-sky-400">
                        {new Date(slot.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                      <Badge status={slot.result || 'PENDING'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recently Applied Jobs */}
          <Card
            title="Recent Applications"
            subtitle="Status tracking of your latest job submissions"
            action={<Link to="/student/applications" className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>}
          >
            {recentApps.length === 0 ? (
              <EmptyState title="No Applications Yet" message="Explore open job drives and submit your applications!" />
            ) : (
              <div className="divide-y divide-slate-800/80">
                {recentApps.map((app) => (
                  <div key={app.application_id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">
                        {app.job?.company?.company_name}
                      </div>
                      <div className="text-xs text-slate-400">{app.job?.role} • Season {app.job?.season}</div>
                    </div>
                    <div className="text-right">
                      <Badge status={app.status} />
                      <div className="text-[10px] text-slate-500 mt-1">
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Open Drives */}
        <div className="space-y-6">
          <Card
            title="Open Placement Drives"
            subtitle="Drives accepting applications"
            action={<Link to="/student/jobs" className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1">Browse Jobs <ArrowRight className="w-3 h-3" /></Link>}
          >
            {openJobs.length === 0 ? (
              <EmptyState title="No Drives Currently Open" message="Check back soon for new company postings." />
            ) : (
              <div className="space-y-3">
                {openJobs.slice(0, 4).map((job) => (
                  <Link
                    key={job.job_id}
                    to={`/student/jobs/${job.job_id}`}
                    className="block p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-sky-500/40 hover:bg-slate-900 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{job.company?.company_name}</h4>
                        <p className="text-xs text-slate-400">{job.role}</p>
                      </div>
                      <Badge status="OPEN" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                      <span>Min CGPA: <strong className="text-slate-200">{job.min_cgpa.toFixed(2)}</strong></span>
                      <span>Drive Date: <strong className="text-slate-200">{job.drive_date}</strong></span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
