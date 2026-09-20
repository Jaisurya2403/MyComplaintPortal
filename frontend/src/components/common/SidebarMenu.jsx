import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, FileText, Repeat, BarChart3, Building2, Users, ShieldAlert, LogOut, Menu, X, Home, Shuffle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const SidebarMenu = ({ type, onToggle }) => {
  const { logout, theme, user, activeRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const isDark = theme === 'dark';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || activeRole === 'SUPER_ADMIN' || user?.email === 'jaisurya7482@gmail.com';

  if (type === 'user') {
    return (
      <aside className={`sidebar-constant p-4 rounded-3xl flex flex-col justify-between self-start border shadow-xl z-20 transition-all duration-300 ${
        isDark ? 'bg-slate-800/80 border-slate-700/80' : 'glass-civic border-white/90'
      }`}>
        <div>
          {/* Top Header Row: Professional Menu Toggle Pill */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#ffffff' : '#0f172a',
                border: isDark ? '1.5px solid #475569' : '1.5px solid #cbd5e1',
                boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.4)' : '0 4px 14px rgba(0,0,0,0.06)',
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-full font-serif font-extrabold text-xs transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-md group"
              title="Toggle Menu Navigation"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1 rounded-lg transition-transform duration-300 group-hover:rotate-12 ${
                  isDark ? 'bg-blue-600/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  {isMenuOpen ? (
                    <X className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Menu className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>
                <span className="tracking-wide font-extrabold">Navigation Menu</span>
              </div>
              
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                isMenuOpen
                  ? 'bg-blue-600 text-white'
                  : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
              }`}>
                {isMenuOpen ? 'Open' : 'Closed'}
              </span>
            </button>
          </div>

          {/* Collapsible Animated Navigation Items */}
          {isMenuOpen && (
            <nav className="flex flex-col gap-2.5 mt-3 transition-all duration-300 ease-in-out animate-fadeIn">
              <NavLink
                to="/dashboard/profile"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#8d92a52c' : (isDark ? '#1e293b' : '#ffffff'),
                  color: isActive ? '#111010' : (isDark ? '#f8fafc' : '#0f172a'),
                  border: isActive ? '1.5px solid #17243e' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
                  boxShadow: isActive ? '0 6px 18px rgba(239, 241, 247, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                })}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group"
              >
                <User className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:scale-110 text-emerald-500" />
                <span className="font-extrabold">My Profile</span>
              </NavLink>

              <NavLink
                to="/dashboard/complaints"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#8d92a52c' : (isDark ? '#1e293b' : '#ffffff'),
                  color: isActive ? '#111010' : (isDark ? '#f8fafc' : '#0f172a'),
                  border: isActive ? '1.5px solid #17243e' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
                  boxShadow: isActive ? '0 6px 18px rgba(239, 241, 247, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                })}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group"
              >
                <FileText className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:scale-110 text-blue-500" />
                <span className="font-extrabold">My Complaints</span>
              </NavLink>

              <NavLink
                to="/dashboard/reposts"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#8d92a52c' : (isDark ? '#1e293b' : '#ffffff'),
                  color: isActive ? '#111010' : (isDark ? '#f8fafc' : '#0f172a'),
                  border: isActive ? '1.5px solid #17243e' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
                  boxShadow: isActive ? '0 6px 18px rgba(239, 241, 247, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                })}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group"
              >
                <Repeat className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:scale-110 text-purple-500" />
                <span className="font-extrabold">My Reposts</span>
              </NavLink>
            </nav>
          )}
        </div>
      </aside>
    );
  }

  // ADMIN SIDEBAR WITH COLLAPSIBLE MENU TOGGLE BUTTON & DROPDOWN LINKS
  return (
    <aside className={`sidebar-constant p-4 rounded-3xl flex flex-col justify-between self-start border shadow-xl z-20 transition-all duration-300 ${
      isDark ? 'bg-slate-800/80 border-slate-700/80' : 'glass-civic border-white/90'
    }`}>
      <div>
        {/* Top Header Row: Menu Toggle Button */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#ffffff' : '#0f172a',
              borderColor: isDark ? '#475569' : '#cbd5e1',
            }}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-full font-serif font-extrabold text-xs transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-md group border"
            title="Toggle Admin Menu"
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1 rounded-lg transition-transform duration-300 group-hover:rotate-12 ${
                isDark ? 'bg-blue-600/30 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                {isMenuOpen ? (
                  <X className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Menu className="w-4 h-4 stroke-[2.5]" />
                )}
              </div>
              <span className="tracking-wide font-extrabold">Admin Navigation</span>
            </div>

            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
              isMenuOpen
                ? 'bg-blue-600 text-white'
                : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
            }`}>
              {isMenuOpen ? 'Open' : 'Closed'}
            </span>
          </button>
        </div>

        {/* Collapsible Animated Admin Menu Options */}
        {isMenuOpen && (
          <nav className="flex flex-col gap-2 mt-3 transition-all duration-300 ease-in-out animate-fadeIn">
            <NavLink
              to="/home"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                border: isActive ? '1.5px solid #1d4ed8' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
              })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group shadow-sm"
            >
              <Home className="w-4 h-4 stroke-[2.2] text-blue-500 group-hover:scale-110 transition-transform" />
              <span>Home Feed</span>
            </NavLink>

            <NavLink
              to="/admin/posts"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                border: isActive ? '1.5px solid #1d4ed8' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
              })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group shadow-sm"
            >
              <FileText className="w-4 h-4 stroke-[2.2] text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Manage Posts 📝</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                border: isActive ? '1.5px solid #1d4ed8' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
              })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group shadow-sm"
            >
              <Users className="w-4 h-4 stroke-[2.2] text-emerald-500 group-hover:scale-110 transition-transform" />
              <span>Users 👥</span>
            </NavLink>

            {/* <NavLink
              to="/admin/redirects"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                border: isActive ? '1.5px solid #1d4ed8' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
              })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group shadow-sm"
            >
              <Shuffle className="w-4 h-4 stroke-[2.2] text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Redirects 🔀</span>
            </NavLink> */}

            <NavLink
              to="/admin/analytics"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                border: isActive ? '1.5px solid #1d4ed8' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
              })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group shadow-sm"
            >
              <BarChart3 className="w-4 h-4 stroke-[2.2] text-rose-500 group-hover:scale-110 transition-transform" />
              <span>Analytics 📊</span>
            </NavLink>

            <NavLink
              to="/admin/departments"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                border: isActive ? '1.5px solid #1d4ed8' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
              })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group shadow-sm"
            >
              <Building2 className="w-4 h-4 stroke-[2.2] text-sky-500 group-hover:scale-110 transition-transform" />
              <span>Departments 🏛️</span>
            </NavLink>

            {isSuperAdmin && (
              <NavLink
                to="/admin/admins"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                  color: isActive ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                  border: isActive ? '1.5px solid #1d4ed8' : (isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1'),
                })}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all duration-200 hover:scale-[1.03] group shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 stroke-[2.2] text-amber-500 group-hover:scale-110 transition-transform" />
                <span>Admins 🛡️</span>
              </NavLink>
            )}

           
          </nav>
        )}
      </div>
    </aside>
  );
};
