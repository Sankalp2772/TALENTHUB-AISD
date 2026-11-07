import React, { useState, useEffect } from 'react';
import { jobsApi } from '../services/jobsApi';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import { LoadingSpinner, ErrorAlert, EmptyState } from '../components/Modal';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Briefcase, ChevronRight, Award, Layers } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');
  const [isOpenOnly, setIsOpenOnly] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [search, branchFilter, seasonFilter, minCgpaFilter, isOpenOnly]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (branchFilter) params.branch = branchFilter;
      if (seasonFilter) params.season = seasonFilter;
      if (minCgpaFilter) params.min_cgpa = parseFloat(minCgpaFilter);
      if (isOpenOnly) params.is_open = true;

      const data = await jobsApi.getJobs(params);
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load placement drives.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Placement Drives</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse and apply for company drives matching your academic criteria.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ISE">ISE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="ME">ME</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          {/* Season Filter */}
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Seasons</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
          </select>

          {/* Min CGPA Filter */}
          <input
            type="number"
            step="0.1"
            placeholder="Max required Min CGPA"
            value={minCgpaFilter}
            onChange={(e) => setMinCgpaFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          {/* Open Drives Checkbox */}
          <label className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOpenOnly}
              onChange={(e) => setIsOpenOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-sky-500"
            />
            <span>Open Drives Only</span>
          </label>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner message="Searching placement drives..." />
      ) : jobs.length === 0 ? (
        <EmptyState title="No Matching Placement Drives" message="Try relaxing your filters or check back later for new company postings." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const allowed = job.allowed_branches?.map(b => b.branch) || [];
            const isOpen = job.is_open;

            return (
              <div
                key={job.job_id}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                        {job.season} Season
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{job.company?.company_name}</h3>
                      <p className="text-sm font-semibold text-slate-300">{job.role}</p>
                    </div>
                    <Badge status={isOpen ? 'OPEN' : 'CLOSED'} />
                  </div>

                  <div className="space-y-2.5 my-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Min CGPA Required:</span>
                      <strong className="text-slate-200 font-semibold">{job.min_cgpa.toFixed(2)}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>Max Active Backlogs:</span>
                      <strong className="text-slate-200 font-semibold">{job.max_active_backlogs}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>Drive Date:</span>
                      <strong className="text-slate-200 font-semibold">{job.drive_date}</strong>
                    </div>

                    <div className="pt-2 border-t border-slate-800/50">
                      <span className="text-slate-500 text-[11px] block mb-1">Allowed Branches:</span>
                      {allowed.length === 0 ? (
                        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] rounded-md font-semibold">
                          OPEN TO ALL BRANCHES
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {allowed.map((b) => (
                            <span key={b} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 text-[10px] rounded-md font-mono">
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    to={`/student/jobs/${job.job_id}`}
                    className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition"
                  >
                    <span>View Details & Apply</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
