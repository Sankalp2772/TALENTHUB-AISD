import React, { useState, useEffect } from 'react';
import { jobsApi } from '../services/jobsApi';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import { LoadingSpinner, ErrorAlert, Modal } from '../components/Modal';
import { Link } from 'react-router-dom';
import { Plus, Building2, Edit2, Users, ToggleLeft, ToggleRight, Check, X, ShieldAlert } from 'lucide-react';

const BRANCH_OPTIONS = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CIVIL'];

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form State for Drive
  const [companyId, setCompanyId] = useState('');
  const [role, setRole] = useState('');
  const [season, setSeason] = useState('2025-2026');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [driveDate, setDriveDate] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [selectedBranches, setSelectedBranches] = useState([]);

  // Form State for Company
  const [newCompanyName, setNewCompanyName] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      const [jobsData, companiesData] = await Promise.all([
        jobsApi.getJobs(),
        jobsApi.getCompanies()
      ]);
      setJobs(jobsData);
      setCompanies(companiesData);
      if (companiesData.length > 0 && !companyId) {
        setCompanyId(companiesData[0].company_id);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load placement drives and company data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setCompanyId(companies[0]?.company_id || '');
    setRole('');
    setSeason('2025-2026');
    setMinCgpa('7.0');
    setMaxBacklogs('0');
    setDriveDate('');
    setIsOpen(true);
    setSelectedBranches([]); // Empty array = open to all branches!
    setIsDriveModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setCompanyId(job.company_id);
    setRole(job.role);
    setSeason(job.season);
    setMinCgpa(job.min_cgpa.toString());
    setMaxBacklogs(job.max_active_backlogs.toString());
    setDriveDate(job.drive_date);
    setIsOpen(job.is_open);
    setSelectedBranches(job.allowed_branches?.map(b => b.branch) || []);
    setIsDriveModalOpen(true);
  };

  const handleBranchToggle = (branch) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter(b => b !== branch));
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleSaveDrive = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const payload = {
      company_id: parseInt(companyId),
      role: role.trim(),
      season: season.trim(),
      min_cgpa: parseFloat(minCgpa),
      max_active_backlogs: parseInt(maxBacklogs),
      drive_date: driveDate,
      is_open: isOpen,
      allowed_branches: selectedBranches // Array of branches or empty [] for all branches
    };

    try {
      if (editingJob) {
        await jobsApi.updateJob(editingJob.job_id, payload);
        setSuccessMsg('Placement drive updated successfully!');
      } else {
        await jobsApi.createJob(payload);
        setSuccessMsg('New placement drive posted successfully!');
      }
      setIsDriveModalOpen(false);
      await fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save placement drive.');
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      await jobsApi.toggleJobStatus(jobId, !currentStatus);
      await fetchInitialData();
    } catch (err) {
      setError('Failed to update drive status.');
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setError('');
    try {
      const created = await jobsApi.createCompany(newCompanyName.trim());
      setCompanies([...companies, created]);
      setCompanyId(created.company_id);
      setNewCompanyName('');
      setIsCompanyModalOpen(false);
      setSuccessMsg(`Company '${created.company_name}' created successfully!`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create company.');
    }
  };

  if (loading) return <LoadingSpinner message="Fetching placement drives..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Placement Drives Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Post new drives, set branch eligibility, and manage applicant evaluation cycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCompanyModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-2 transition"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Add Company</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Drive</span>
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center justify-between text-xs font-semibold">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 text-xs">Dismiss</button>
        </div>
      )}

      {/* Drives Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Season</th>
                <th className="px-6 py-4">Min CGPA</th>
                <th className="px-6 py-4">Max Backlogs</th>
                <th className="px-6 py-4">Allowed Branches</th>
                <th className="px-6 py-4">Drive Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {jobs.map((job) => {
                const allowed = job.allowed_branches?.map(b => b.branch) || [];

                return (
                  <tr key={job.job_id} className="hover:bg-slate-900/50 transition">
                    <td className="px-6 py-4 font-bold text-white">{job.company?.company_name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{job.role}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{job.season}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400">{job.min_cgpa.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-300">{job.max_active_backlogs}</td>
                    <td className="px-6 py-4">
                      {allowed.length === 0 ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                          ALL BRANCHES
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {allowed.map(b => (
                            <span key={b} className="px-1.5 py-0.5 bg-slate-900 text-slate-300 text-[10px] rounded font-mono border border-slate-800">
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">{job.drive_date}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(job.job_id, job.is_open)}
                        className="flex items-center gap-1.5 focus:outline-none"
                        title="Click to toggle open/closed status"
                      >
                        <Badge status={job.is_open ? 'OPEN' : 'CLOSED'} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/jobs/${job.job_id}/applicants`}
                          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold rounded-lg flex items-center gap-1 text-[11px] transition"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Applicants</span>
                        </Link>

                        <button
                          onClick={() => handleOpenEditModal(job)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
                          title="Edit Drive"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post / Edit Drive Modal */}
      <Modal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        title={editingJob ? `Edit Placement Drive #${editingJob.job_id}` : 'Post New Placement Drive'}
      >
        <form onSubmit={handleSaveDrive} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Company</label>
            <select
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            >
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Job Role Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Software Development Engineer I"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Season</label>
              <input
                type="text"
                required
                placeholder="2025-2026"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Drive Date</label>
              <input
                type="date"
                required
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Minimum CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Max Active Backlogs</label>
              <input
                type="number"
                min="0"
                required
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Branch Checkboxes */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-slate-400 font-semibold">Allowed Branches</label>
              <span className="text-[10px] text-amber-400">
                {selectedBranches.length === 0 ? '⚠️ No branches selected = ALL branches allowed' : `${selectedBranches.length} branch(es) selected`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {BRANCH_OPTIONS.map((branch) => {
                const isSelected = selectedBranches.includes(branch);
                return (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => handleBranchToggle(branch)}
                    className={`py-2 px-3 rounded-lg font-mono font-semibold transition border flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{branch}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isOpenCheck"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="w-4 h-4 rounded accent-amber-500"
            />
            <label htmlFor="isOpenCheck" className="text-slate-300 cursor-pointer">
              Drive is Open for Immediate Student Applications
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsDriveModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition"
            >
              {editingJob ? 'Save Changes' : 'Post Drive'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Company Modal */}
      <Modal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        title="Add New Company"
      >
        <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Company Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Microsoft India"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCompanyModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg transition"
            >
              Save Company
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
