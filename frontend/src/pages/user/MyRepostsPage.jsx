import React from 'react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const MyRepostsPage = () => {
  const { complaints } = useComplaints();
  const repostedComplaints = complaints.filter((c) => c.userReposted);

  return (
    <div className="page-reposts bg-civic-gradient min-h-screen flex flex-col justify-between">
      <TopNavBar theme="civic" />

      {/* Main Container with pt-36 sm:pt-32 Top Padding & pb-32 sm:pb-24 Bottom Scroll Space */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col md:flex-row gap-8 items-start relative z-10">
        <SidebarMenu type="user" />

        <div className="flex-1 w-full max-w-3xl min-w-0 content-with-sidebar">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 mb-6">My Reposts</h1>

          {repostedComplaints.length > 0 ? (
            <div className="flex flex-col gap-4">
              {repostedComplaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} isAdmin={false} />
              ))}
            </div>
          ) : (
            <div className="glass-civic p-10 text-center rounded-3xl border border-white/80">
              <p className="text-sm font-bold text-slate-700">You haven't reposted any complaints yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
