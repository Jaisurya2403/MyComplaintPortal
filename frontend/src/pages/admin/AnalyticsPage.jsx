import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Clock, Trophy, BarChart3, TrendingUp, Users, AlertCircle, Sparkles, ThumbsUp, Repeat, CheckCircle2 } from 'lucide-react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { FilterBar } from '../../components/common/FilterBar.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const AnalyticsPage = () => {
  const { theme } = useAuth();
  const { complaints, dbStats, users } = useComplaints();
  const isDark = theme === 'dark';

  // Get Top 3 Most Upvoted Posts
  const topUpvotedPosts = [...complaints]
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    .slice(0, 3);

  const totalGrievancesCount = dbStats?.totalSubmitted ?? complaints.length;
  const totalUpvotesCount = dbStats?.totalUpvotes ?? complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0);
  const totalRepostsCount = complaints.reduce((sum, c) => sum + (c.reposts || 0), 0);
  const totalResolvedCount = dbStats?.totalResolved ?? complaints.filter(c => c.status === 'Resolved' || c.status === 'RESOLVED').length;
  const resolutionRatePct = totalGrievancesCount > 0 ? Math.round((totalResolvedCount / totalGrievancesCount) * 100) : 0;

  // 1. Calculate Real Dynamic Status Distribution from DB complaints
  const statusCounts = complaints.reduce((acc, c) => {
    const s = c.status || 'REGISTERED';
    if (s === 'RESOLVED' || s === 'Resolved') acc.Resolved = (acc.Resolved || 0) + 1;
    else if (s === 'ACTION_IN_PROGRESS' || s === 'Action-in-progress' || s === 'In Progress') acc.ActionInProgress = (acc.ActionInProgress || 0) + 1;
    else if (s === 'VISITED' || s === 'Visited') acc.Visited = (acc.Visited || 0) + 1;
    else acc.Registered = (acc.Registered || 0) + 1;
    return acc;
  }, {});

  const dynamicStatusDonutData = [
    { name: 'Registered', value: statusCounts.Registered || 0, color: '#6366f1' },
    { name: 'Visited', value: statusCounts.Visited || 0, color: '#a855f7' },
    { name: 'Action-in-progress', value: statusCounts.ActionInProgress || 0, color: '#3b82f6' },
    { name: 'Resolved', value: statusCounts.Resolved || 0, color: '#10b981' },
  ];

  // 2. Calculate Real Department Performance & Counts from DB
  const deptCountsMap = complaints.reduce((acc, c) => {
    const dName = c.departmentName || 'Public Works Dept';
    if (!acc[dName]) {
      acc[dName] = { name: dName, total: 0, resolved: 0 };
    }
    acc[dName].total += 1;
    if (c.status === 'RESOLVED' || c.status === 'Resolved') {
      acc[dName].resolved += 1;
    }
    return acc;
  }, {});

  const dynamicDeptPerformanceData = Object.values(deptCountsMap).length > 0 
    ? Object.values(deptCountsMap).map(d => ({
        name: d.name.length > 16 ? `${d.name.substring(0, 14)}...` : d.name,
        count: d.total,
        rate: d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0,
      }))
    : [
        { name: 'Roads (PWD)', rate: 90, count: complaints.length },
        { name: 'Electricity', rate: 94, count: 0 },
        { name: 'Sanitation', rate: 91, count: 0 },
      ];

  // 3. Monthly Trends calculated dynamically from complaint timestamps
  const monthMap = {};
  complaints.forEach(c => {
    if (c.createdAt) {
      try {
        const date = new Date(c.createdAt);
        if (!isNaN(date.getTime())) {
          const monthName = date.toLocaleString('default', { month: 'short' });
          if (!monthMap[monthName]) monthMap[monthName] = { month: monthName, filed: 0, resolved: 0 };
          monthMap[monthName].filed += 1;
          if (c.status === 'RESOLVED' || c.status === 'Resolved') {
            monthMap[monthName].resolved += 1;
          }
        }
      } catch (e) {}
    }
  });

  const dynamicMonthlyData = Object.keys(monthMap).length > 0 
    ? Object.values(monthMap) 
    : [{ month: 'Current', filed: complaints.length, resolved: totalResolvedCount }];

  return (
    <div className={`page-analytics min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      <TopNavBar theme={isDark ? 'dark' : 'civic'} />

      {/* CENTERED MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col md:flex-row gap-8 items-start relative z-10">
        <SidebarMenu type="admin" />

        <div className="flex-1 w-full max-w-4xl min-w-0 content-with-sidebar">
          {/* Top Header Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl mb-6 border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-fadeIn ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-serif bg-blue-100 dark:bg-blue-900/60 px-3.5 py-1 rounded-full shadow-sm">
                📊 Real-Time Civic Intelligence
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-2">
                Municipal System Analytics
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                Live performance indicators, grievance resolution metrics, and department throughput.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg flex-shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className={`p-5 rounded-3xl border shadow-lg ${isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif font-extrabold text-slate-500 uppercase">Total Grievances</span>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">{totalGrievancesCount}</h3>
              <p className="text-[11px] font-bold text-emerald-600 mt-1">Registered from citizens</p>
            </div>

            <div className={`p-5 rounded-3xl border shadow-lg ${isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif font-extrabold text-slate-500 uppercase">Resolved Cases</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-emerald-600">{totalResolvedCount}</h3>
              <p className="text-[11px] font-bold text-slate-500 mt-1">{resolutionRatePct}% Resolution Rate</p>
            </div>

            <div className={`p-5 rounded-3xl border shadow-lg ${isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif font-extrabold text-slate-500 uppercase">Community Upvotes</span>
                <ThumbsUp className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-amber-600">{totalUpvotesCount}</h3>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Total citizen endorsements</p>
            </div>

            <div className={`p-5 rounded-3xl border shadow-lg ${isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif font-extrabold text-slate-500 uppercase">Total Reposts</span>
                <Repeat className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-3xl font-extrabold font-serif text-purple-600">{totalRepostsCount}</h3>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Supported ongoing issues</p>
            </div>
          </div>

          {/* MONTHLY COMPLAINT VOLUME VS RESOLUTION TRENDS AREA CHART */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl mb-8 ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <div>
                <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-white">
                  Monthly Complaint Volume & Resolution Trends
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Comparing total grievances submitted vs resolved cases over time.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-extrabold">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span>Filed ({totalGrievancesCount})</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Resolved ({totalResolvedCount})</span>
                </div>
              </div>
            </div>

            <div className="w-full min-h-[280px]">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dynamicMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="filedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="resolvedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#475569'} fontSize={12} tickLine={false} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#475569'} fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#cbd5e1',
                      borderRadius: '16px',
                      color: isDark ? '#ffffff' : '#0f172a',
                      fontWeight: 'bold',
                    }}
                  />
                  <Area type="monotone" dataKey="filed" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#filedColor)" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#resolvedColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SIDE-BY-SIDE CHARTS: STATUS DONUT & DEPARTMENT PERFORMANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Status Breakdown Donut Chart */}
            <div className={`p-6 rounded-3xl border shadow-xl ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
            }`}>
              <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-white mb-2 text-center">
                Status Distribution Breakdown
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 text-center">
                Overview of current redressal pipeline stages.
              </p>
              
              <div className="w-full min-h-[240px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={dynamicStatusDonutData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                      {dynamicStatusDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '16px',
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontWeight: 'bold',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {dynamicStatusDonutData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs font-extrabold">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                    <span className="text-slate-600 dark:text-slate-300">{s.name}:</span>
                    <span className="text-slate-900 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Performance Bar Chart */}
            <div className={`p-6 rounded-3xl border shadow-xl ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
            }`}>
              <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-white mb-2 text-center">
                Department Grievance Volume
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 text-center">
                Complaints count allocated by municipal department.
              </p>

              <div className="w-full min-h-[240px]">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={dynamicDeptPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#475569'} fontSize={11} tickLine={false} />
                    <YAxis stroke={isDark ? '#94a3b8' : '#475569'} fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '16px',
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontWeight: 'bold',
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatbotFAB />
    </div>
  );
};
