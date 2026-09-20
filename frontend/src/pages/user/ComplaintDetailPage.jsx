import React from 'react';
import { useParams } from 'react-router-dom';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { BackButton } from '../../components/common/BackButton.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const { complaints } = useComplaints();

  const complaint = complaints.find((c) => c.id === id) || complaints[0];

  return (
    <div className="page-complaint-detail bg-civic-gradient min-h-screen flex flex-col justify-between">
      <TopNavBar theme="civic" />

      {/* Main Container with pt-36 sm:pt-32 Top Padding */}
      <main className="max-w-4xl mx-auto px-6 pt-36 sm:pt-32 pb-12 flex-1 w-full relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">Complaint Details</h1>
        </div>

        {complaint ? (
          <ComplaintCard complaint={complaint} isAdmin={false} />
        ) : (
          <p className="text-center font-bold text-slate-700">Complaint not found.</p>
        )}
      </main>
    </div>
  );
};
