import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Repeat, Users, Clock, CheckCircle2, Shuffle, 
  Building2, TrendingUp, Bell, ShieldCheck, Filter, ChevronDown, Check
} from 'lucide-react';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const AdminDashboardPage = () => {
  const { user, theme } = useAuth();
  const { complaints, users, dbStats } = useComplaints();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const filterOptions = [
    { value: 'ALL', label: 'All Grievances', icon: '🌐' },
    { value: 'REGISTERED', label: 'Registered', icon: '📝' },
    { value: 'VISITED', label: 'Visited by Officer', icon: '👀' },
    { value: 'ACTION_IN_PROGRESS', label: 'Action-in-progress', icon: '⏳' },
    { value: 'RESOLVED', label: 'Resolved Complaints', icon: '✅' },
    { value: 'REDIRECTED', label: 'Redirected Complaints', icon: '🔀' },
  ];

  const selectedOption = filterOptions.find((o) => o.value === statusFilter) || filterOptions[0];

  const isDark = theme === 'dark';

  // Live Database Analytics Metrics (Fetched from View VW_COMPLAINT_STATS)
  const totalPostsSubmitted = dbStats?.totalSubmitted ?? complaints.length;
  const totalReposts = dbStats?.totalReposts ?? complaints.reduce((sum, c) => sum + (c.reposts || 0), 0);
  const totalUsers = users.length;
  const totalPostsToday = dbStats?.totalToday ?? complaints.filter(c => c.createdAt === new Date().toISOString().split('T')[0]).length;
  const resolvedComplaints = dbStats?.totalResolved ?? complaints.filter((c) => c.status === 'Resolved' || c.status === 'RESOLVED').length;
  const redirectedComplaints = dbStats?.totalRedirected ?? complaints.filter((c) => c.wasRedirected).length;
  const activeDepartments = 12;
  const resolutionEfficiency = totalPostsSubmitted > 0 ? `${Math.round((resolvedComplaints / totalPostsSubmitted) * 100)}%` : '0%';

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'REGISTERED') return c.status === 'Registered' || c.status === 'REGISTERED';
    if (statusFilter === 'VISITED') return c.status === 'Visited' || c.status === 'VISITED';
    if (statusFilter === 'ACTION_IN_PROGRESS') return c.status === 'Action-in-progress' || c.status === 'ACTION_IN_PROGRESS' || c.status === 'In Progress';
    if (statusFilter === 'RESOLVED') return c.status === 'Resolved' || c.status === 'RESOLVED';
    if (statusFilter === 'REDIRECTED') return c.wasRedirected;
    return true;
  });

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      <TopNavBar theme="civic" />

      {/* CENTERED MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col items-center justify-center relative z-10">
        <div className="w-full">
          {/* Header Card */}
          <div className={`p-6 sm:p-8 rounded-3xl mb-8 border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-fadeIn ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-serif bg-blue-100 dark:bg-blue-900/60 px-3.5 py-1 rounded-full shadow-sm">
                🛡️ Super Admin Executive Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-2">
                Executive Control & Analytics 👋
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                Welcome, {user?.name || 'Super Admin Jai Surya'} • Real-time Municipal Intelligence
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/admin/posts"
                className="pill-button-dark text-xs py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:scale-105 transition-transform"
              >
                Manage Posts 📝
              </Link>
            </div>
          </div>

          {/* 8 ULTRA-PREMIUM ANIMATED STAT ANALYTICS CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {/* 1. Total Posts Submitted */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Total Posts Submitted</span>
                <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <FileText className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{totalPostsSubmitted.toLocaleString()}</h3>
              <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 mt-2">Grievances filed in portal 📈</span>
            </div>

            {/* 2. Total Community Reposts */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Total Reposts</span>
                <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <Repeat className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{totalReposts.toLocaleString()}</h3>
              <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-400 mt-2">Community upvotes & shares 🔄</span>
            </div>

            {/* 3. Total Registered Users */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Total Users</span>
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <Users className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{totalUsers.toLocaleString()}</h3>
              <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 mt-2">Registered citizen accounts 👥</span>
            </div>

            {/* 4. Posts Filed Today */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Posts Today</span>
                <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <Clock className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">+{totalPostsToday}</h3>
              <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 mt-2">Logged in last 24 hours ⏰</span>
            </div>

            {/* 5. Resolved Complaints */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Resolved Complaints</span>
                <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{resolvedComplaints.toLocaleString()}</h3>
              <span className="text-[11px] font-extrabold text-teal-700 dark:text-teal-400 mt-2">Redressed grievances ✅</span>
            </div>

            {/* 6. Redirected Complaints */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Redirected Complaints</span>
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <Shuffle className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{redirectedComplaints}</h3>
              <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 mt-2">Inter-dept transfers 🔀</span>
            </div>

            {/* 7. Active Departments */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Active Departments</span>
                <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <Building2 className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{activeDepartments}</h3>
              <span className="text-[11px] font-extrabold text-sky-700 dark:text-sky-400 mt-2">Connected bodies 🏛️</span>
            </div>

            {/* 8. Resolution Efficiency */}
            <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'glass-civic border-white/90'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Efficiency Index</span>
                <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                  <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{resolutionEfficiency}</h3>
              <span className="text-[11px] font-extrabold text-rose-700 dark:text-rose-400 mt-2">SLA Redressal Score ⚡</span>
            </div>
          </div>

          {/* Grievance Feed Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-slate-900 dark:text-white">
              Grievance Oversight Feed
            </h2>
            
            {/* Custom Animated High-Contrast Glass Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-3 py-2.5 px-5 rounded-full border shadow-md transition-all hover:scale-105 active:scale-95 font-serif font-extrabold text-xs cursor-pointer group"
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                }}
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Filter className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Filter Status:</span>
                <span 
                  className="font-extrabold flex items-center gap-1.5 px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: isDark ? '#0f172a' : '#eff6ff',
                    color: isDark ? '#ffffff' : '#1d4ed8',
                    borderColor: isDark ? '#3b82f6' : '#bfdbfe',
                  }}
                >
                  <span>{selectedOption.icon}</span>
                  <span>{selectedOption.label}</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${filterDropdownOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
              </button>

              {filterDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl p-2 shadow-2xl border z-50 animate-fadeIn"
                  style={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.85)' : '0 20px 48px rgba(0,0,0,0.18)',
                  }}
                >
                  {filterOptions.map((option) => {
                    const isSelected = statusFilter === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setFilterDropdownOpen(false);
                        }}
                        style={{
                          backgroundColor: isSelected 
                            ? '#2563eb' 
                            : 'transparent',
                          color: isSelected 
                            ? '#ffffff' 
                            : (isDark ? '#f8fafc' : '#0f172a'),
                        }}
                        className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl font-serif text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? 'shadow-md'
                            : isDark
                            ? 'hover:bg-slate-800 hover:text-blue-400'
                            : 'hover:bg-slate-100 hover:text-blue-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">{option.icon}</span>
                          <span className="font-extrabold">{option.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-16">
            {filteredComplaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} isAdmin={true} />
            ))}
          </div>
        </div>
      </main>

      <ChatbotFAB />
    </div>
  );
};
