import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, LogOut, LogIn, UserPlus, Link2 } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-surface-800 bg-surface-950/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-500 transition-colors">
            <Link2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            Snip<span className="text-brand-400">URL</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`btn-ghost text-sm ${pathname === '/dashboard' ? 'text-brand-400' : ''}`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <div className="w-px h-5 bg-surface-700 mx-1" />
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 hidden sm:block">
                  {user?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                <UserPlus size={15} />
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
