import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, FileText, Repeat, User as UserIcon, ArrowRight, 
  Users, CheckCircle2, Shuffle, Clock, Building2, TrendingUp, 
  ShieldCheck, AlertTriangle, Layers, Filter, Eye, RefreshCw,
  ChevronDown, Check
} from 'lucide-react';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints, sortComplaintsByLocationAndPriority } from '../../context/ComplaintContext.jsx';

export const AuthenticatedHomePage = () => {
  const { user, isAuthenticated, theme } = useAuth();
  const { complaints, users, dbStats, activePincode } = useComplaints();
  const navigate = useNavigate();

  // Erase complaint draft & pending data whenever user returns to Home page
  useEffect(() => {
    sessionStorage.removeItem('mcp_complaint_draft');
    sessionStorage.removeItem('mcp_pending_complaint');
  }, []);

  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DEPARTMENT_ADMIN' || user?.role === 'ADMIN' || user?.email?.toLowerCase() === 'jaisurya7482@gmail.com';

  // State for Admin Status Filter & Custom Dropdown Popover
  const [adminStatusFilter, setAdminStatusFilter] = useState('ALL');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const filterOptions = [
    { value: 'ALL', label: 'All Grievances', icon: '🌐' },
    { value: 'REGISTERED', label: 'Registered', icon: '📝' },
    { value: 'VISITED', label: 'Visited by Officer', icon: '👀' },
    { value: 'ACTION_IN_PROGRESS', label: 'Action-in-progress', icon: '⏳' },
    { value: 'RESOLVED', label: 'Resolved Complaints', icon: '✅' },
    { value: 'REDIRECTED', label: 'Redirected Complaints', icon: '🔀' },
  ];

  const selectedOption = filterOptions.find((o) => o.value === adminStatusFilter) || filterOptions[0];

  // Computed Analytics Metrics for Admin Dashboard (Fetched Live from Database View VW_COMPLAINT_STATS)
  const totalPostsSubmitted = dbStats?.totalSubmitted ?? complaints.length;
  const totalReposts = dbStats?.totalReposts ?? complaints.reduce((sum, c) => sum + (c.reposts || 0), 0);
  const totalUsers = users.length;
  const totalPostsToday = dbStats?.totalToday ?? complaints.filter(c => c.createdAt === new Date().toISOString().split('T')[0]).length;
  const resolvedComplaints = dbStats?.totalResolved ?? complaints.filter((c) => c.status === 'Resolved' || c.status === 'RESOLVED').length;
  const redirectedComplaints = dbStats?.totalRedirected ?? complaints.filter((c) => c.wasRedirected).length;
  const activeDepartments = 12;
  const resolutionEfficiency = totalPostsSubmitted > 0 ? `${Math.round((resolvedComplaints / totalPostsSubmitted) * 100)}%` : '0%';

  // Citizen-only metrics (Strictly 0 / empty if user is not logged in)
  const myComplaints = (user && isAuthenticated) 
    ? complaints.filter((c) => (user.id && c.userId === user.id) || (user.email && c.userEmail === user.email) || (user.name && c.userName === user.name))
    : [];
  const myRepostsCount = (user && isAuthenticated) 
    ? complaints.filter((c) => c.userReposted).length 
    : 0;

  // Public community feed for citizens: show ALL posts, ordered by location pincode (unresolved first, then upvotes/reposts)
  const userPincode = user?.pincode || user?.location || activePincode || '641004';
  const publicCitizenComplaints = sortComplaintsByLocationAndPriority(complaints, userPincode);

  // Admin filtered complaints list
  const filteredAdminComplaints = complaints.filter((c) => {
    if (adminStatusFilter === 'ALL') return true;
    if (adminStatusFilter === 'REGISTERED') return c.status === 'Registered' || c.status === 'REGISTERED';
    if (adminStatusFilter === 'VISITED') return c.status === 'Visited' || c.status === 'VISITED';
    if (adminStatusFilter === 'ACTION_IN_PROGRESS') return c.status === 'Action-in-progress' || c.status === 'ACTION_IN_PROGRESS' || c.status === 'In Progress';
    if (adminStatusFilter === 'RESOLVED') return c.status === 'Resolved' || c.status === 'RESOLVED';
    if (adminStatusFilter === 'REDIRECTED') return c.wasRedirected;
    return true;
  });

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.grantLevel === 'Super Admin' || user?.email?.toLowerCase() === 'jaisurya7482@gmail.com';
  const isDeptAdmin = !isSuperAdmin && (user?.role === 'DEPARTMENT_ADMIN' || user?.grantLevel === 'Department Admin' || isAdmin);

  const roleBadgeText = isSuperAdmin 
    ? '🛡️ Super Admin Control Center' 
    : (isDeptAdmin ? '🏛️ Department Admin Operations' : '👥 Citizen Member Portal');

  const roleWelcomeTitle = isSuperAdmin
    ? `Welcome Back, Super Admin ${user?.name || 'Jai Surya'}! 👋`
    : (isDeptAdmin ? `Welcome Back, Department Admin ${user?.name || 'Officer'}! 👋` : `Welcome Back, ${user?.name || 'Citizen'}! 👋`);

  // IF USER IS AN ADMIN, RENDER CENTERED LIGHT BLUE CIVIC THEME DASHBOARD
  if (isAdmin) {
    return (
      <div className={`page-home min-h-screen flex flex-col relative transition-colors duration-300 ${
        isDark ? 'bg-slate-900 bg-civic-gradient text-white' : 'bg-civic-gradient text-slate-900'
      }`}>
        <TopNavBar theme="civic" />

        {/* CENTERED MAIN CONTENT CONTAINER */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col items-center justify-center relative z-10">
          <div className="w-full">
            {/* Centered Top Admin Executive Welcome Header Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl mb-8 border shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 animate-fadeIn ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
            }`}>
              <div className="text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-serif bg-blue-100 dark:bg-blue-900/60 px-3.5 py-1 rounded-full shadow-sm">
                    {roleBadgeText}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-serif bg-emerald-100 dark:bg-emerald-900/60 px-3.5 py-1 rounded-full shadow-sm">
                    Real-time Active
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                  {roleWelcomeTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-1">
                  Executive analytics dashboard, grievance redressal control & municipal oversight.
                </p>
              </div>

              {/* Quick Action Navigation Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
                <Link
                  to="/admin/posts"
                  className="pill-button-dark text-xs py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:scale-105 transition-transform"
                >
                  Manage Posts 📝
                </Link>
                <Link
                  to="/admin/users"
                  className="pill-button-dark text-xs py-3 px-5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold shadow-lg hover:scale-105 transition-transform"
                >
                  Users 👥
                </Link>
              </div>
            </div>

            {/* 8 LIGHT BLUE CIVIC ANIMATED EXECUTIVE ANALYTICS STAT CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {/* Stat 1: Total Posts Submitted */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Total Posts Submitted</span>
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <FileText className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{totalPostsSubmitted.toLocaleString()}</h3>
                <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  All civic grievances filed 📈
                </span>
              </div>

              {/* Stat 2: Total Community Reposts */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Total Community Reposts</span>
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <Repeat className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{totalReposts.toLocaleString()}</h3>
                <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Community upvotes & shares 🔄
                </span>
              </div>

              {/* Stat 3: Total Registered Users */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Total Registered Users</span>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <Users className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{totalUsers.toLocaleString()}</h3>
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Active citizen accounts 👥
                </span>
              </div>

              {/* Stat 4: Posts Filed Today */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Posts Filed Today</span>
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <Clock className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">+{totalPostsToday}</h3>
                <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Received in last 24h ⏰
                </span>
              </div>

              {/* Stat 5: Resolved Complaints */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Resolved Complaints</span>
                  <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{resolvedComplaints.toLocaleString()}</h3>
                <span className="text-[11px] font-extrabold text-teal-700 dark:text-teal-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Successfully redressed ✅
                </span>
              </div>

              {/* Stat 6: Redirected Complaints */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Redirected Complaints</span>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <Shuffle className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{redirectedComplaints}</h3>
                <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Transferred departments 🔀
                </span>
              </div>

              {/* Stat 7: Active Departments */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Active Departments</span>
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <Building2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{activeDepartments}</h3>
                <span className="text-[11px] font-extrabold text-sky-700 dark:text-sky-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Municipal bodies connected 🏛️
                </span>
              </div>

              {/* Stat 8: Resolution Efficiency */}
              <div className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between group cursor-pointer stat-grid-card ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'glass-civic border-white/90'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-400">Resolution Efficiency</span>
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300 shadow">
                    <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{resolutionEfficiency}</h3>
                <span className="text-[11px] font-extrabold text-rose-700 dark:text-rose-400 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  SLA Redressal Score ⚡
                </span>
              </div>
            </div>

            {/* ADMIN FEED SECTION HEADER WITH HIGH-CONTRAST CUSTOM DROPDOWN CONTROL */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-slate-900 dark:text-white">
                  Grievance Monitoring Feed
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  Review submitted posts, update statuses, or redirect departments
                </p>
              </div>

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
                      const isSelected = adminStatusFilter === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setAdminStatusFilter(option.value);
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

            {/* ADMIN COMPLAINTS FEED */}
            <div className="flex flex-col gap-4 pb-16">
              {filteredAdminComplaints.length > 0 ? (
                filteredAdminComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} isAdmin={true} />
                ))
              ) : (
                <div className={`p-10 text-center rounded-3xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'glass-civic border-white/80'
                }`}>
                  <p className="text-sm font-bold text-slate-400">No complaints match your selected admin status filter.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <ChatbotFAB />
      </div>
    );
  }

  // CITIZEN VIEW (100% UNCHANGED FOR REGULAR USERS)
  return (
    <div className="page-home min-h-screen flex flex-col relative bg-civic-gradient overflow-x-hidden">
      <div className="absolute inset-0 backdrop-blur-md bg-white/20 pointer-events-none z-0" />
      <TopNavBar theme="civic" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full relative z-10">
        <div className="glass-civic p-6 sm:p-8 rounded-3xl mb-8 border border-white/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 hover-lift mt-2">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-serif">Citizen Portal</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 mt-1">
             Hello {user?.name || 'Citizen'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Report civic issues in your pincode or track your filed grievances.
            </p>
          </div>

          <Link
            to="/complaints/new"
            className="pill-button-dark text-base py-3.5 px-8 shadow-xl hover:scale-105 transition-transform flex-shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-blue-400" /> Register Complaint
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Link to="/dashboard/complaints" className="glass-civic p-6 rounded-3xl border border-white/80 shadow-lg stat-grid-card group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold font-serif text-slate-800">My Complaints</span>
              <FileText className="w-6 h-6 text-blue-600 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-3xl font-extrabold font-serif text-slate-900 mb-1 group-hover:scale-105 transition-transform origin-left">{myComplaints.length}</h3>
            <p className="text-xs text-slate-500 font-medium">Filed grievances</p>
          </Link>

          <Link to="/dashboard/reposts" className="glass-civic p-6 rounded-3xl border border-white/80 shadow-lg stat-grid-card group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold font-serif text-slate-800">My Reposts</span>
              <Repeat className="w-6 h-6 text-purple-600 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-3xl font-extrabold font-serif text-slate-900 mb-1 group-hover:scale-105 transition-transform origin-left">
              {myRepostsCount}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Supported issues</p>
          </Link>

          <Link to="/dashboard/profile" className="glass-civic p-6 rounded-3xl border border-white/80 shadow-lg stat-grid-card group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold font-serif text-slate-800">My Profile</span>
        
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900 truncate mb-1 group-hover:scale-105 transition-transform origin-left">
              {isAuthenticated && user?.name ? user.name : 'Guest User'}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">
              {isAuthenticated && user?.location ? user.location : 'Click to Login'}
            </p>
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">Recent Community Issues</h2>
          <Link to="/posts" className="text-xs font-bold text-blue-700 underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 pb-16">
          {publicCitizenComplaints && publicCitizenComplaints.length > 0 ? (
            publicCitizenComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          ) : (
            <div className="glass-civic p-8 text-center rounded-3xl">
              <p className="text-sm font-medium text-slate-600">No community complaints found.</p>
            </div>
          )}
        </div>
      </main>

      <ChatbotFAB />
    </div>
  );
};
