import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  Calendar,
  User,
  Users,
  LogOut,
  Building2
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const studentNavItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Jobs', path: '/student/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/student/applications', icon: FileCheck },
    { label: 'Interviews', path: '/student/interviews', icon: Calendar },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Placement Drives', path: '/admin/jobs', icon: Briefcase },
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-950/60 border-r border-slate-800 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          {user?.role === 'ADMIN' ? 'Admin Portal' : 'Student Portal'}
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
