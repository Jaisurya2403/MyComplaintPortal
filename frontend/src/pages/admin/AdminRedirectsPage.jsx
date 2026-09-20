import React from 'react';
import { Shuffle } from 'lucide-react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { FilterBar } from '../../components/common/FilterBar.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const AdminRedirectsPage = () => {
  const { theme } = useAuth();
  const { complaints } = useComplaints();
  const isDark = theme === 'dark';

  const redirectedComplaints = complaints.filter((c) => c.redirectedFromDeptName || c.redirectedAt || c.wasRedirected);

  return (
    <div className={`page-admin-redirects min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      <TopNavBar theme={isDark ? 'dark' : 'civic'} />

      {/* CENTERED MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col md:flex-row gap-8 items-start relative z-10">
        <SidebarMenu type="admin" />

        <div className="flex-1 w-full max-w-4xl min-w-0 content-with-sidebar">
          {/* Top Header Card */}
          <div className={`p-6 sm:p-8 rounded-3xl mb-6 border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-fadeIn ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider font-serif bg-indigo-100 dark:bg-indigo-900/60 px-3.5 py-1 rounded-full shadow-sm">
                🔀 Inter-Department Redirects
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-2">
                Redirected Complaints Feed
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                Monitor grievances transferred between municipal departments.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg flex-shrink-0">
              <Shuffle className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <FilterBar />

          {redirectedComplaints.length > 0 ? (
            <div className="flex flex-col gap-4">
              {redirectedComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className={`p-10 text-center rounded-3xl border shadow-md ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'glass-civic border-white/80'
            }`}>
              <p className="text-sm font-extrabold text-slate-600 dark:text-slate-300">
                No redirected complaints found in queue.
              </p>
            </div>
          )}
        </div>
      </main>

      <ChatbotFAB />
    </div>
  );
};
