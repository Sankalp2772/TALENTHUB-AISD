import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, User, ArrowRight, KeyRound, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('asha@student.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'ADMIN') {
      setEmail('admin@talenthub.edu');
      setPassword('adminpass');
    } else {
      setEmail('asha@student.edu');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password, role });
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-2xl shadow-xl shadow-sky-500/20 mb-4 border border-sky-400/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            TALENT<span className="text-sky-400">HUB</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">College Placement Management System</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('STUDENT')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition ${
                role === 'STUDENT'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('ADMIN')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition ${
                role === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Placement Admin</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                {role === 'STUDENT' ? 'Student Email / USN' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'STUDENT' ? 'asha@student.edu or 1RV21CS001' : 'admin@talenthub.edu'}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition ${
                role === 'ADMIN'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-500/20'
              } disabled:opacity-50`}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium text-center mb-2">Quick Demo Accounts:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => { setRole('STUDENT'); setEmail('asha@student.edu'); setPassword('password123'); }}
                className="px-2.5 py-1.5 bg-slate-900/70 border border-slate-800 text-slate-300 rounded-lg hover:border-slate-700 text-left truncate"
              >
                🎓 Asha (CSE 9.20)
              </button>
              <button
                type="button"
                onClick={() => { setRole('STUDENT'); setEmail('rahul@student.edu'); setPassword('password123'); }}
                className="px-2.5 py-1.5 bg-slate-900/70 border border-slate-800 text-slate-300 rounded-lg hover:border-slate-700 text-left truncate"
              >
                🎓 Rahul (ISE 8.40)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
