import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { BackButton } from '../../components/common/BackButton.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { useComplaints, sortComplaintsByLocationAndPriority } from '../../context/ComplaintContext.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';

import { useAuth } from '../../context/AuthContext.jsx';

export const PublicFeedPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const pincodeParam = searchParams.get('pincode');
  const { complaints, activePincode } = useComplaints();

  const currentPincode = pincodeParam || user?.pincode || user?.location || activePincode || '641004';

  const rawFiltered = pincodeParam
    ? complaints.filter((c) => c.pincode === pincodeParam || (c.pincode && String(c.pincode).trim() === String(pincodeParam).trim()))
    : complaints;

  const filteredComplaints = sortComplaintsByLocationAndPriority(rawFiltered, currentPincode);

  return (
    <div className="page-public-feed bg-civic-gradient min-h-screen flex flex-col justify-between">
      <TopNavBar theme="civic" />

      {/* Main Container with pt-36 sm:pt-32 Top Padding & pb-32 sm:pb-24 Bottom Scroll Space */}
      <main className="max-w-4xl mx-auto px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                Public Complaints
              </h1>
              <p className="text-xs text-slate-600 font-semibold">
                Browsing grievances for Pincode: <strong className="text-blue-700">{currentPincode}</strong>
              </p>
            </div>
          </div>
        </div>

        {filteredComplaints.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} isAdmin={false} />
            ))}
          </div>
        ) : (
          <div className="glass-civic p-12 text-center rounded-3xl border border-white/80">
            <h3 className="text-xl font-bold font-serif text-slate-800 mb-2">No Complaints Found</h3>
            <p className="text-xs text-slate-600 font-medium mb-6">
              No registered grievances found for pincode {currentPincode}.
            </p>
            <Link to="/complaints/new" className="pill-button-dark text-sm py-2.5 px-6">
              Register First Complaint in this Area ➔
            </Link>
          </div>
        )}
      </main>

      <ChatbotFAB />
    </div>
  );
};
