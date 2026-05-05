import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Shield, LogOut, Calculator, LogIn } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getInitials = (user) => {
    if (!user) return '';
    const first =
      user.firstName?.charAt(0) ||
      user.name?.split(' ')[0]?.charAt(0) ||
      '';
    const last =
      user.lastName?.charAt(0) ||
      user.name?.split(' ')[1]?.charAt(0) ||
      '';
    return (first + last).toUpperCase();
  };

  const initials = getInitials(user);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-blue-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex justify-between items-center px-6 h-16">

      {/* Top glow line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      {/* ── Logo ── */}
      <Link
        title="HomePage"
        to="/"
        className="flex items-center gap-2 font-black text-xl tracking-tight text-white hover:opacity-80 transition-opacity"
      >
        <Cloud
          size={22}
          className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"
        />
        <span>
          MultiCloud <span className="text-blue-500">DR</span>
        </span>
      </Link>

      {/* ── Nav Links ── */}
      <div className="flex items-center gap-1">

        {/* Dashboard */}
        <Link
          title="Dashboard"
          to="/dashboard"
          className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-blue-500/10 hover:border-blue-500/30 hover:shadow-[0_0_16px_rgba(59,130,246,0.2)] border border-transparent px-3 py-2 rounded-xl transition-all duration-200"
        >
          <Shield size={14} />
          Dashboard
        </Link>

        {/* Calculator */}
        <Link
          title="Cost Calculator"
          to="/calculator"
          className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-blue-500/10 hover:border-blue-500/30 hover:shadow-[0_0_16px_rgba(59,130,246,0.2)] border border-transparent px-3 py-2 rounded-xl transition-all duration-200"
        >
          <Calculator size={14} />
          Calculator
        </Link>

        {/* Sign In — only when NOT logged in */}
        {!user && (
          <Link
            title="Sign In"
            to="/login"
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-blue-500/10 hover:border-blue-500/30 hover:shadow-[0_0_16px_rgba(59,130,246,0.2)] border border-transparent px-3 py-2 rounded-xl transition-all duration-200"
          >
            <LogIn size={14} />
            Sign In
          </Link>
        )}

        {/* Admin Console */}
        {user?.role === 'admin' && (
          <>
            <div className="w-px h-5 bg-blue-500/20 mx-2" />
            <Link
              to="/admin"
              className="text-[10px] font-black tracking-widest uppercase text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-500 hover:to-blue-400 border border-blue-400/30 shadow-[0_0_18px_rgba(59,130,246,0.45)] hover:shadow-[0_0_28px_rgba(59,130,246,0.7)] px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px"
            >
              Admin Console
            </Link>
          </>
        )}

        {/* When logged in: Avatar + Logout */}
        {user && (
          <>
            <div className="w-px h-5 bg-blue-500/20 mx-2" />

            {/* Avatar */}
            <div
              title={user.name || user.email || 'User'}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-700 to-cyan-500 border-2 border-blue-400/40 shadow-[0_0_14px_rgba(59,130,246,0.5)] flex items-center justify-center text-[11px] font-black text-white tracking-wide select-none"
            >
              {initials || '?'}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-red-400/80 hover:text-red-300 hover:bg-red-500/10 hover:border-red-400/30 hover:shadow-[0_0_14px_rgba(248,113,113,0.2)] border border-transparent px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut size={14} />
              Exit
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;