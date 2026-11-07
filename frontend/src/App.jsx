import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { LoadingSpinner } from './components/Modal';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Applications from './pages/Applications';
import Interviews from './pages/Interviews';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManageJobs from './pages/ManageJobs';
import Applicants from './pages/Applicants';

// Protected Layout Wrapper
function ProtectedLayout({ allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Authenticating session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            {/* Student Routes */}
            {user.role === 'STUDENT' && (
              <>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/jobs" element={<Jobs />} />
                <Route path="/student/jobs/:jobId" element={<JobDetails />} />
                <Route path="/student/applications" element={<Applications />} />
                <Route path="/student/interviews" element={<Interviews />} />
                <Route path="/student/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
              </>
            )}

            {/* Admin Routes */}
            {user.role === 'ADMIN' && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/jobs" element={<ManageJobs />} />
                <Route path="/admin/jobs/:jobId/applicants" element={<Applicants />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Starting TalentHub Portal..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace /> : <Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
