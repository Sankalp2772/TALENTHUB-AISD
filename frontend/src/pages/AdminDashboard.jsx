import React, { useState, useEffect } from 'react';
import { offersApi } from '../services/offersApi';
import { Card, StatCard } from '../components/Card';
import Badge from '../components/Badge';
import { LoadingSpinner, ErrorAlert } from '../components/Modal';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  Award,
  CheckCircle,
  Building2,
  ArrowRight,
  TrendingUp,
  PlusCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await offersApi.getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to load admin placement statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Aggregating placement portal analytics..." />;
  if (error) return <ErrorAlert message={error} onClose={() => setError('')} />;

  const stats = data?.stats || {};
  const recentDrives = data?.recent_drives || [];
  const recentApps = data?.recent_applications || [];
  const upcomingInterviews = data?.upcoming_interviews || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-slate-900 border border-amber-500/20 shadow-2xl">
        <div>
          <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>Placement Officer Command Center</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Placement Statistics Dashboard</h2>
          <p className="text-xs text-slate-300 mt-1">Real-time drive activity, application workflows, and recruitment metrics.</p>
        </div>

        <Link
          to="/admin/jobs"
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Placement Drive</span>
        </Link>
      </div>

      {/* 6 Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Active Drives" value={stats.active_drives} icon={Briefcase} color="sky" />
        <StatCard label="Closed Drives" value={stats.closed_drives} icon={Building2} color="indigo" />
        <StatCard label="Total Applications" value={stats.total_applications} icon={Users} color="amber" />
        <StatCard label="Pending Interviews" value={stats.upcoming_interviews} icon={Calendar} color="rose" />
        <StatCard label="Total Offers" value={stats.total_offers} icon={Award} color="indigo" />
        <StatCard label="Offers Accepted" value={stats.accepted_offers} icon={CheckCircle} color="emerald" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Drives & Applications) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Placement Drives */}
          <Card
            title="Recent Placement Drives"
            subtitle="Manage drives, view applicants, update statuses"
            action={<Link to="/admin/jobs" className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1">Manage All Drives <ArrowRight className="w-3 h-3" /></Link>}
          >
            <div className="divide-y divide-slate-800/80">
              {recentDrives.map((drive) => (
                <div key={drive.job_id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{drive.company_name}</h4>
                    <p className="text-xs text-slate-400">{drive.role} • Season {drive.season}</p>
                    <span className="text-[10px] text-slate-500">Drive Date: {drive.drive_date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={drive.is_open ? 'OPEN' : 'CLOSED'} />
                    <Link
                      to={`/admin/jobs/${drive.job_id}/applicants`}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-semibold rounded-lg transition"
                    >
                      Applicants →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Applications */}
          <Card title="Recent Application Submissions" subtitle="Latest student applications">
            <div className="divide-y divide-slate-800/80">
              {recentApps.map((app) => (
                <div key={app.application_id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{app.student_name}</span>{' '}
                    <span className="text-slate-400">({app.usn})</span>
                    <div className="text-slate-400 mt-0.5">{app.company_name} — {app.role}</div>
                  </div>
                  <div className="text-right">
                    <Badge status={app.status} />
                    <div className="text-[10px] text-slate-500 mt-1">{new Date(app.applied_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Upcoming Interview Schedule */}
        <div className="space-y-6">
          <Card title="Upcoming Interview Slots" subtitle="Scheduled interview rounds">
            <div className="space-y-3">
              {upcomingInterviews.map((intSlot) => (
                <div key={intSlot.interview_slot_id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{intSlot.company_name}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold rounded text-[10px]">Round {intSlot.round_number}</span>
                  </div>
                  <div className="text-slate-300">Candidate: <strong className="text-slate-100">{intSlot.student_name}</strong></div>
                  <div className="text-slate-400 text-[11px]">📍 Venue: {intSlot.venue}</div>
                  <div className="text-sky-400 font-semibold text-[11px]">{new Date(intSlot.scheduled_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
