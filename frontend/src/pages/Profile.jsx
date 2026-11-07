import React, { useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { Card } from '../components/Card';
import { LoadingSpinner, ErrorAlert } from '../components/Modal';
import { User, Mail, GraduationCap, Award, Edit3, Save, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [activeBacklogs, setActiveBacklogs] = useState(0);
  const [clearedBacklogs, setClearedBacklogs] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.getStudentProfile();
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setBranch(data.branch);
      setCgpa(data.cgpa);
      setActiveBacklogs(data.active_backlogs);
      setClearedBacklogs(data.cleared_backlogs);
    } catch (err) {
      console.error(err);
      setError('Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      const updated = await authApi.updateStudentProfile({
        name,
        email,
        branch,
        cgpa: parseFloat(cgpa),
        active_backlogs: parseInt(activeBacklogs),
        cleared_backlogs: parseInt(clearedBacklogs)
      });
      setProfile(updated);
      setIsEditing(false);
      setSuccessMsg('Academic profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading academic profile..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Academic Profile</h2>
          <p className="text-xs text-slate-400 mt-1">Official student record registered in TalentHub DBMS.</p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <Card>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value="CSE">CSE</option>
                  <option value="ISE">ISE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="ME">ME</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">CGPA (0.0 - 10.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={activeBacklogs}
                  onChange={(e) => setActiveBacklogs(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cleared Backlogs</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={clearedBacklogs}
                  onChange={(e) => setClearedBacklogs(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-sky-500/20">
                {profile?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{profile?.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">USN: {profile?.usn} • {profile?.email}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-[10px] rounded-md">
                  STUDENT ROLE
                </span>
              </div>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">University Seat Number (USN)</span>
                <span className="text-base font-bold text-white font-mono">{profile?.usn}</span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Department Branch</span>
                <span className="text-base font-bold text-sky-300">{profile?.branch}</span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Cumulative GPA (CGPA)</span>
                <span className="text-xl font-extrabold text-emerald-400">{profile?.cgpa.toFixed(2)}</span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block font-semibold">Active / Cleared Backlogs</span>
                <span className="text-base font-bold text-slate-200">
                  <span className={profile?.active_backlogs > 0 ? 'text-rose-400' : 'text-slate-200'}>{profile?.active_backlogs} Active</span>
                  {' / '}
                  <span className="text-slate-400">{profile?.cleared_backlogs} Cleared</span>
                </span>
              </div>
            </div>

            {/* Offer Status Box */}
            <div className="p-4 rounded-xl border bg-slate-950/80 border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Placement Offer Acceptance Flag</div>
                  <div className="text-[11px] text-slate-400">STUDENTS.has_accepted_offer constraint status</div>
                </div>
              </div>
              <div>
                {profile?.has_accepted_offer ? (
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-lg">
                    TRUE (OFFER ACCEPTED)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded-lg">
                    FALSE (ELIGIBLE TO APPLY)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
