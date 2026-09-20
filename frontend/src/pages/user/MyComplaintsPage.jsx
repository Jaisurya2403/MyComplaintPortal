import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const MyComplaintsPage = () => {
  const { user, theme } = useAuth();
  const { complaints } = useComplaints();
  const [showOnlyResolved, setShowOnlyResolved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const myComplaints = complaints.filter(
    (c) =>
      (c.userId === user?.id || c.userName === user?.name || c.userId === 'usr-1') &&
      (!showOnlyResolved || c.status === 'Resolved' || c.status === 'RESOLVED') &&
      (c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.departmentName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`page-complaints min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      <TopNavBar theme={isDark ? 'dark' : 'civic'} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col md:flex-row gap-8 items-start relative z-10">
        <SidebarMenu type="user" />

        <div className="flex-1 w-full max-w-3xl min-w-0 content-with-sidebar">
          {/* HEADER ROW WITH SLIDING RESOLVED TOGGLE SWITCH */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className={`text-2xl sm:text-3xl font-extrabold font-serif ${isDark ? 'text-white' : 'text-slate-900'}`}>
              My Complaints
            </h1>

            {/* ULTRA-PROFESSIONAL MODERN SLIDING RESOLVED FILTER TOGGLE */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-serif font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Resolved Complaints Only
              </span>

              <button
                type="button"
                onClick={() => setShowOnlyResolved(!showOnlyResolved)}
                style={{
                  backgroundColor: showOnlyResolved ? '#10b981' : (isDark ? '#334155' : '#cbd5e1'),
                  width: '4.25rem',
                  height: '2.25rem',
                  borderRadius: '9999px',
                  padding: '0.25rem',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'background-color 0.3s ease',
                  border: 'none',
                }}
                title="Toggle Resolved Complaints Only Filter"
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    color: showOnlyResolved ? '#059669' : '#64748b',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                    transform: showOnlyResolved ? 'translateX(2rem)' : 'translateX(0rem)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <CheckCircle2 className={`w-4 h-4 stroke-[2.5] ${showOnlyResolved ? 'text-emerald-600' : 'text-slate-400'}`} />
                </span>
              </button>
            </div>
          </div>

          {/* ULTRA-PROFESSIONAL SEAMLESS SEARCH BAR */}
          <div
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: isDark ? '1.5px solid #475569' : '1.5px solid #cbd5e1',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
            }}
            className="p-3 px-5 mb-6 flex items-center gap-3 transition-all hover:border-slate-400 focus-within:border-blue-500"
          >
            <Search className="w-5 h-5 text-slate-400 stroke-[2.2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search your reported issues by title, location, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                boxShadow: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                color: isDark ? '#ffffff' : '#0f172a',
                fontSize: '0.875rem',
                fontWeight: '700',
                width: '100%',
                padding: '0',
                margin: '0',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-200 font-extrabold px-2 py-1 rounded-full hover:bg-slate-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* COMPLAINTS LIST FEED */}
          {myComplaints.length > 0 ? (
            <div className="flex flex-col gap-4">
              {myComplaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} isAdmin={false} />
              ))}
            </div>
          ) : (
            <div className={`p-10 text-center rounded-3xl border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'glass-civic border-white/80'
            }`}>
              <p className="text-sm font-bold text-slate-400">No complaints match your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
