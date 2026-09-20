import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Repeat, CheckCircle2, Layers, X } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { imagesApi } from '../../api/apiClient.js';
import confetti from 'canvas-confetti';

export const AIDuplicateCheckPage = () => {
  const navigate = useNavigate();
  const { addComplaint, toggleRepost, complaints = [] } = useComplaints();

  const [pendingData, setPendingData] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [repostNotice, setRepostNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('mcp_pending_complaint');
    if (stored) {
      const parsed = JSON.parse(stored);
      setPendingData(parsed);
      const res = parsed.aiResult;
      const actualAi = (res && res.aiResult) ? res.aiResult : res;
      setMatchResult({
        ...actualAi,
        candidateGrievances: res?.candidateGrievances || actualAi?.candidateGrievances || [],
        matchedComplaints: (actualAi?.matchedComplaints && actualAi.matchedComplaints.length > 0)
          ? actualAi.matchedComplaints
          : (res?.candidateGrievances || []),
      });
    } else {
      navigate('/complaints/new');
    }
  }, [navigate]);

  if (!pendingData) return null;

  // Extract raw candidate list strictly filtered by same pincode + same department + unresolved only
  const rawList = (matchResult?.matchedComplaints && matchResult.matchedComplaints.length > 0)
    ? matchResult.matchedComplaints
    : (matchResult?.candidateGrievances && matchResult.candidateGrievances.length > 0)
    ? matchResult.candidateGrievances
    : (matchResult?.matchedComplaint ? [matchResult.matchedComplaint] : []);

  const isMatchFound = Boolean(rawList.length > 0);

  // MAP CANDIDATES TO LIVE DB COMPLAINTS IN CONTEXT STATE
  const matchedList = isMatchFound ? rawList.map((item, idx) => {
    const itemId = item.id || item.complaintId;
    const liveComplaint = complaints.find(c => 
      String(c.id).toLowerCase() === String(itemId).toLowerCase() ||
      String(c.complaintId).toLowerCase() === String(itemId).toLowerCase()
    );

    if (liveComplaint) {
      return liveComplaint;
    }

    return {
      id: item.id || item.complaintId || `CMP-2026-c${idx + 101}`,
      complaintId: item.complaintId || item.id || `c${idx + 101}`,
      title: item.title || item.description || 'Civic Grievance',
      description: item.description || pendingData?.description || 'Reported grievance issue',
      locationName: item.locationName || pendingData?.address || 'Coimbatore',
      pincode: item.pincode || pendingData?.pincode || '641004',
      departmentName: item.departmentName || pendingData?.departmentName || 'Public Works Department (PWD)',
      status: item.status || 'REGISTERED',
      userName: item.userName || 'Citizen',
      userEmail: item.userEmail || '',
      userProfileImageUrl: item.userProfileImageUrl || item.userProfileImage || '',
      upvotes: item.upvotes || 0,
      reposts: item.reposts || 0,
      userUpvoted: false,
      userReposted: false,
      images: (item.images && item.images.length > 0)
        ? item.images.map(img => imagesApi.getImageUrl(img))
        : (item.attachmentImageIds && item.attachmentImageIds.length > 0
          ? item.attachmentImageIds.map(id => imagesApi.getImageUrl(id))
          : (pendingData?.images || [])),
      attachmentImageIds: item.attachmentImageIds || [],
      createdAt: item.createdAt || new Date().toISOString(),
    };
  }) : [];

  // REPOST HANDLER: STAYS ON SAME PAGE (NO CONFETTI ON REPOST)
  const handleRepostSpecificComplaint = async (targetId) => {
    try {
      if (targetId) {
        await toggleRepost(targetId);
      }
      setRepostNotice(`Existing grievance reposted successfully! Repost count updated in database.`);
      setTimeout(() => setRepostNotice(null), 4000);
    } catch (e) {
      console.error('Repost failed:', e);
    }
  };

  // REGISTER MY OWN COMPLAINT (CONFETTI ONLY HERE)
  const handleRegisterOwnComplaint = async () => {
    setIsSubmitting(true);
    try {
      const topMatched = matchedList[0];
      await addComplaint({
        userId: pendingData.userId,
        userName: pendingData.userName,
        userEmail: pendingData.userEmail || pendingData.userId,
        officerEmail: pendingData.officerEmail || '',
        departmentId: pendingData.departmentId,
        departmentName: pendingData.departmentName,
        address: pendingData.address,
        pincode: pendingData.pincode,
        description: pendingData.description,
        images: pendingData.images,
        attachmentImageIds: pendingData.attachmentImageIds || [],
        aiMatchedGrievanceId: topMatched?.id || topMatched?.complaintId || null,
        aiMatchType: 'RULE_MATCH',
      });

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      sessionStorage.removeItem('mcp_pending_complaint');
      sessionStorage.removeItem('mcp_complaint_draft');

      setToastMessage({
        title: 'Civic Grievance Registered Successfully! 🚀',
        desc: `Your new complaint for ${pendingData.departmentName} has been submitted to municipal authorities.`,
        target: '/dashboard/complaints',
      });
    } catch (e) {
      console.error('Registration failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseToast = () => {
    const target = toastMessage?.target || '/dashboard/complaints';
    setToastMessage(null);
    navigate(target);
  };

  return (
    <div className="page-ai-check bg-civic-gradient min-h-screen p-4 sm:p-8 relative flex flex-col justify-start items-center pb-28">
      <div className="max-w-4xl w-full flex flex-col gap-6 relative z-10 mb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/complaints/new')}
            className="pill-input bg-white text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" /> Edit Form
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-extrabold shadow-md">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" /> Rule AI Area Grievance Match
          </div>
        </div>

        {/* IN-PAGE REPOST NOTICE ALERT BANNER */}
        {repostNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-extrabold flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{repostNotice}</span>
            </div>
            <button onClick={() => setRepostNotice(null)} className="p-1 hover:bg-emerald-200 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Your Submission Summary */}
        <div className="glass-civic p-5 sm:p-6 rounded-3xl border border-white/90 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold font-serif text-slate-500 uppercase tracking-wider">
              Your Filed Grievance Details:
            </h4>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold border border-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Pincode & Department Matched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-800 font-bold">
            <p><strong className="text-slate-900">Address:</strong> {pendingData.address}</p>
            <p><strong className="text-slate-900">Pincode:</strong> {pendingData.pincode}</p>
            <p><strong className="text-slate-900">Department:</strong> {pendingData.departmentName}</p>
          </div>
        </div>

        {/* Main Rule AI Unsolved Grievances Box */}
        <div className="glass-civic p-6 sm:p-8 rounded-3xl border-2 border-blue-400/80 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                {matchedList.length > 0 ? `Unresolved Issues in Pincode ${pendingData.pincode} (${matchedList.length})` : 'No Active Unresolved Grievances Found'}
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {matchedList.length > 0
                  ? `Showing active unresolved grievances strictly matching Pincode ${pendingData.pincode} and ${pendingData.departmentName}.`
                  : `No active unresolved complaints found for Pincode ${pendingData.pincode} in ${pendingData.departmentName}.`}
              </p>
            </div>
          </div>

          {/* SCROLLABLE LIST OF UNSOLVED MATCHES OR NO MATCHING FOUND CARD */}
          {matchedList.length > 0 ? (
            <div className="flex flex-col gap-6">
              {matchedList.map((matchedItem, idx) => (
                <div key={matchedItem.id || idx} className="flex flex-col gap-3 p-4 rounded-3xl bg-white/90 border border-slate-200 shadow-md">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider font-serif">
                      Matching Unresolved Grievance #{idx + 1}
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-extrabold border border-amber-300">
                      Status: {matchedItem.status}
                    </span>
                  </div>

                  <ComplaintCard complaint={matchedItem} onRepost={() => handleRepostSpecificComplaint(matchedItem.id)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/95 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center justify-center gap-4 border border-slate-200 shadow-md my-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold font-serif text-slate-900 mb-1.5">
                  No Matching Unresolved Grievances Found 🎉
                </h3>
                <p className="text-xs text-slate-600 font-bold max-w-md mx-auto leading-relaxed">
                  Rule AI searched Pincode <strong>{pendingData.pincode}</strong> for <strong>{pendingData.departmentName}</strong>. No active unresolved duplicate complaints match your grievance. Please proceed to register your complaint.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRegisterOwnComplaint}
                disabled={isSubmitting}
                className="mt-2 pill-button-dark bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-3 px-8 rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>Registering... ⏳</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Register My Complaint 🚀</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STICKY BOTTOM FOOTER BAR - FIXED TO ABSOLUTE BOTTOM OF VIEWPORT */}
      <div 
        className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700/80 p-3 sm:p-4 flex items-center justify-center shadow-2xl"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}
      >
        <button
          type="button"
          onClick={handleRegisterOwnComplaint}
          disabled={isSubmitting}
          className="pill-button-dark bg-slate-900 hover:bg-black text-white font-extrabold text-sm py-3.5 px-10 rounded-full shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 max-w-md w-full border-2 border-emerald-400"
        >
          {isSubmitting ? (
            <>
              <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
              <span>Registering... ⏳</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Register My Complaint 🚀</span>
            </>
          )}
        </button>
      </div>

      {/* CENTERED GLASS TOAST CONFIRMATION MODAL */}
      {toastMessage && (
        <div
          onClick={handleCloseToast}
          className="compact-modal-overlay"
          style={{ zIndex: 10000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center justify-center py-6 px-8"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-extrabold font-serif text-slate-900 mb-1">
              {toastMessage.title}
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-5">
              {toastMessage.desc}
            </p>

            <button
              onClick={handleCloseToast}
              className="pill-button-dark py-2.5 px-7 text-xs text-white font-extrabold cursor-pointer"
            >
              OK, View Details ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
