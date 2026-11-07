import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ShieldCheck, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
            TALENT<span className="font-extrabold text-white">HUB</span>
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Campus Placement System</p>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className={`p-1.5 rounded-full ${user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400' : 'bg-sky-500/10 text-sky-400'}`}>
              {user.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user.name}</div>
              <div className="text-[10px] text-slate-400">{user.role} • {user.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}
