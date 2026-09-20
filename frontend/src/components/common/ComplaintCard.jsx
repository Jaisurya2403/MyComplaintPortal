import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, Repeat, AlertTriangle, ChevronLeft, ChevronRight, RotateCcw, Trash2, Send, CheckCircle2, Clock, MapPin, Tag, Video, Check, AlertCircle, FileText, ArrowRight, ArrowLeft, X, Sparkles, Activity } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { imagesApi } from '../../api/apiClient.js';

const formatDateTimeDDMMYYYY = (rawDate) => {
  if (!rawDate) return '';
  try {
    const rawStr = String(rawDate);
    const hasTime = rawStr.includes('T') || rawStr.includes(':') || rawStr.includes(' ');
    const d = new Date(rawStr);
    
    if (isNaN(d.getTime())) {
      const parts = rawStr.split('T')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      }
      return rawStr;
    }
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    if (!hasTime) {
      return `${day}/${month}/${year}`;
    }
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  } catch (e) {
    return String(rawDate);
  }
};

export const ComplaintCard = ({ complaint, isAdmin = false, onRepost }) => {
  const { user, isAuthenticated, theme } = useAuth();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { toggleUpvote, toggleRepost, reportComplaint, cycleStatus, deleteComplaint, addFeedback, users } = useComplaints();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // Modal States
  const [showReportReasonModal, setShowReportReasonModal] = useState(false);
  const [reportReasonText, setReportReasonText] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animStep, setAnimStep] = useState(0);

  // Resolve Author Profile Image
  const authorUser = users?.find(u => 
    (u.id && (u.id === complaint.userId || u.id === complaint.userEmail)) ||
    (u.userId && (u.userId === complaint.userId || u.userId === complaint.userEmail)) ||
    (u.email && (u.email.toLowerCase() === complaint.userEmail?.toLowerCase() || u.email.toLowerCase() === complaint.userId?.toLowerCase())) ||
    (u.name && complaint.userName && (
      u.name.toLowerCase() === complaint.userName.toLowerCase() ||
      u.name.toLowerCase().startsWith(complaint.userName.toLowerCase()) ||
      complaint.userName.toLowerCase().startsWith(u.name.toLowerCase())
    ))
  );

  const isPostOwner = user && (
    user.id === complaint.userId || 
    user.email === complaint.userEmail || 
    user.name === complaint.userName ||
    (user.name && complaint.userName && (
      user.name.toLowerCase() === complaint.userName.toLowerCase() ||
      user.name.toLowerCase().startsWith(complaint.userName.toLowerCase()) ||
      complaint.userName.toLowerCase().startsWith(user.name.toLowerCase())
    ))
  );
  
  const authorAvatar = isPostOwner 
    ? (user.profileImage || user.profileImageUrl || authorUser?.profileImageUrl || authorUser?.profileImage || complaint.userProfileImageUrl)
    : (authorUser?.profileImageUrl || authorUser?.profileImage || complaint.userProfileImageUrl);

  const rawImages = (complaint.images && complaint.images.length > 0)
    ? complaint.images
    : (complaint.attachmentImageIds && complaint.attachmentImageIds.length > 0)
    ? complaint.attachmentImageIds
    : [];

  const images = rawImages.length > 0
    ? rawImages.map(img => imagesApi.getImageUrl(img))
    : [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      ];

  const isOwner = user?.id === complaint.userId || user?.name === complaint.userName || complaint.userId === 'usr-1' || complaint.userName === 'Aarav Sharma';

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleRepostClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated && !user) {
      navigate('/login');
      return;
    }
    toggleRepost(complaint.id);
    if (onRepost) onRepost();
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated && !user) {
      navigate('/login');
      return;
    }
    setShowDetailModal(false);
    setShowReportReasonModal(true);
  };

  const confirmReportSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    reportComplaint(complaint.id, reportReasonText);
    setShowReportReasonModal(false);
    setReportReasonText('');
  };

  const confirmDelete = (e) => {
    if (e) e.stopPropagation();
    deleteComplaint(complaint.id);
    setShowDeleteModal(false);
    setShowDetailModal(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (feedbackText.trim()) {
      addFeedback(complaint.id, 5, feedbackText);
      setSubmittedFeedback(true);
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Resolved':
      case 'RESOLVED':
        return 4;
      case 'Action-in-progress':
      case 'ACTION_IN_PROGRESS':
        return 3;
      case 'Visited':
      case 'VISITED':
        return 2;
      case 'Registered':
      case 'REGISTERED':
      default:
        return 1;
    }
  };

  const currentStep = getStatusStepIndex(complaint.status);
  const formattedGrievanceId = complaint.id.startsWith('CMP') ? complaint.id : `CMP-2026-${complaint.id}`;
  const postedDateTimeFormatted = formatDateTimeDDMMYYYY(complaint.createdAt || complaint.postedDate);
  const isCompleted = complaint.status === 'RESOLVED' || complaint.status === 'Resolved' || !!complaint.resolvedDate || !!complaint.resolvedAt;

  useEffect(() => {
    if (showDetailModal) {
      setAnimStep(0);
      const timer = setTimeout(() => {
        setAnimStep(currentStep);
      }, 120);
      return () => clearTimeout(timer);
    } else {
      setAnimStep(0);
    }
  }, [showDetailModal, currentStep]);
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'RESOLVED':
      case 'Resolved':
        return 'Resolved';
      case 'ACTION_IN_PROGRESS':
      case 'Action-in-progress':
        return 'Action-in-progress';
      case 'VISITED':
      case 'Visited':
        return 'Visited';
      case 'REGISTERED':
      case 'Registered':
      default:
        return 'Registered';
    }
  };
  const statusDisplayText = getStatusLabel(complaint.status);
  const cleanGrievanceId = formattedGrievanceId.length > 22 ? `${formattedGrievanceId.substring(0, 18)}...` : formattedGrievanceId;

  const hasFeedback = !!(complaint.feedback?.comment || (submittedFeedback && feedbackText.trim()));
  const feedbackCommentText = complaint.feedback?.comment || feedbackText;

  const renderFeedbackSection = () => {
    if (!isCompleted) return null;

    if (hasFeedback) {
      return (
        <div className="bg-slate-100/90 dark:bg-slate-800/90 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 my-3 transition-all shadow-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-slate-900 dark:text-white stroke-[3]" />
            </div>
            <h5 className="text-xs sm:text-sm font-extrabold font-serif text-slate-900 dark:text-white">
              Citizen Feedback on Resolution:
            </h5>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl  shadow-inner">
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 italic">
              "{feedbackCommentText}"
            </p>
          </div>
        </div>
      );
    }

    if (isPostOwner) {
      return (
        <div className="bg-slate-100/90 dark:bg-slate-800/90 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 my-3 transition-all shadow-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-slate-900 dark:text-white stroke-[3]" />
            </div>
            <h5 className="text-xs sm:text-sm font-extrabold font-serif text-slate-900 dark:text-white">
              Citizen Feedback on Resolution:
            </h5>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <textarea
              rows={2}
              placeholder="Satisfied with the municipal repair? Leave a comment..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-3 rounded-2xl  bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-900 font-medium shadow-inner resize-y"
            />
            <button
              type="submit"
              disabled={!feedbackText.trim()}
              className={`pill-button-dark py-3 px-8 rounded-full text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all duration-200 ${
                feedbackText.trim()
                  ? 'bg-slate-900 hover:bg-slate-950 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer hover:scale-[1.02] active:scale-95'
                  : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              Submit Feedback
            </button>
          </form>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* MAIN CARD CONTAINER - Spacious & Executive Design */}
      <div
        onClick={() => setShowDetailModal(true)}
        className={`glass-civic rounded-3xl overflow-hidden p-5 sm:p-6 shadow-xl border border-white/90 hover-lift mb-6 transition-all cursor-pointer ${
          isAdmin ? 'border-indigo-900/30' : ''
        }`}
      >
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow overflow-hidden flex-shrink-0"
              style={{
                width: '38px',
                height: '38px',
                minWidth: '38px',
                minHeight: '38px',
                maxWidth: '38px',
                maxHeight: '38px',
              }}
            >
              {authorAvatar ? (
                <img 
                  src={authorAvatar} 
                  alt={complaint.userName} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <span className="font-serif font-extrabold text-xs uppercase">{complaint.userName ? complaint.userName.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <div>
              <h4 style={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '900' }} className="text-sm font-black font-serif leading-tight">{complaint.userName}</h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> {postedDateTimeFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> {complaint.pincode}
                </span>
              </div>
            </div>
          </div>
                   <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-xs ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : complaint.status === 'In Progress' || complaint.status === 'ACTION_IN_PROGRESS'
                ? 'bg-blue-100 text-blue-800'
                : complaint.status === 'Visited' || complaint.status === 'VISITED'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {statusDisplayText}
            </span>

            {/* DELETE BUTTON FOR POST OWNER OR ADMIN */}
            {(isOwner || isAdmin) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="p-1.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors cursor-pointer"
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {complaint.redirectedFromDeptName && (
          <div className="bg-purple-50 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Redirected from {complaint.redirectedFromDeptName}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-3">
          {/* Media Preview Column */}
          <div className="md:col-span-5 flex flex-col gap-2">
            {images.length > 1 && (
  <div className="w-full flex justify-center">
    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-1 rounded-full text-black text-xs font-bold shadow-lg border border-white/20"><button
                    type="button"
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-opacity border-none outline-none ${
                      currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/20 cursor-pointer'
                    }`}
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-black" />
                  </button>

                  <span className="text-[11px] font-mono font-extrabold px-1 text-black">
                    {currentImageIndex + 1}/{images.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-opacity border-none outline-none ${
                      currentImageIndex === images.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/20 cursor-pointer'
                    }`}
                    title="Next Image"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div></div>
              )}
            <div className="relative group rounded-2xl overflow-hidden h-48 sm:h-52 bg-slate-900 shadow-md w-full flex items-center justify-center">
              <img
                src={images[currentImageIndex] || images[0]}
                alt="Complaint photo evidence"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                }}
              />

              
            </div>

            {complaint.videoUrl && (
              <div className="video-preview-box h-24 rounded-xl overflow-hidden shadow-sm">
                <video src={complaint.videoUrl} controls className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div>
              {/* Department Name Tag */}
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                  {complaint.departmentName}
                </span>
              </div>

              {/* Uploaded Address (Clean Borderless Text) */}
              <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium mb-3">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-extrabold text-slate-900 dark:text-white">Uploaded Address:</strong> {complaint.address || complaint.locationName || 'Coimbatore, Tamil Nadu'}
                </span>
              </div>

              {/* Grievance Description (Clean Borderless Typography) */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-blue-600" /> Grievance Description
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed pl-5">
                  {complaint.description || 'No description details provided.'}
                </p>
              </div>

              {/* Completed Date / Officer Progress Row */}
              {isCompleted ? (
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong className="font-extrabold text-emerald-900 dark:text-emerald-200">Completed Date:</strong> {formatDateTimeDDMMYYYY(complaint.resolvedAt || complaint.resolvedDate || complaint.createdAt)}</span>
                </div>
              ) : complaint.officerNotes ? (
                <div className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-start gap-1.5">
                  <span className="font-extrabold text-blue-700 uppercase flex-shrink-0">Progress:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{complaint.officerNotes}</span>
                </div>
              ) : null}

              {/* Citizen Resolution Feedback Section (Card View) */}
              {renderFeedbackSection()}
            </div>

            {/* Metric Footer */}
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-700/80 pt-2.5">
              
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]" title={formattedGrievanceId}>
                ID: {cleanGrievanceId}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        {!isAdmin ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-3">
            <div className="flex items-center gap-2">
              {/* UPVOTE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAuthenticated && !user) {
                    navigate('/login');
                    return;
                  }
                  toggleUpvote(complaint.id);
                }}
                className={`pill-input flex items-center gap-1.5 text-xs font-extrabold transition-all ${
                  complaint.userUpvoted
                    ? 'bg-blue-100 text-blue-700 border-blue-400 shadow-md scale-105'
                    : 'bg-white/90 text-slate-700 hover:bg-slate-50 border-slate-300'
                }`}
              >
                <ThumbsUp className="w-4 h-4" fill={complaint.userUpvoted ? "currentColor" : "none"} strokeWidth={complaint.userUpvoted ? 2 : 1.5} />
                <span>{complaint.userUpvoted ? 'Upvoted' : 'Upvote'} ({complaint.upvotes})</span>
              </button>

              {/* REPOST BUTTON */}
              <button
                onClick={handleRepostClick}
                className={`pill-input flex items-center gap-1.5 text-xs font-extrabold transition-all ${
                  complaint.userReposted
                    ? 'bg-purple-100 text-purple-700 border-purple-400 shadow-md scale-105'
                    : 'bg-white/90 text-slate-700 hover:bg-slate-50 border-slate-300'
                }`}
              >
                <Repeat className="w-4 h-4" strokeWidth={complaint.userReposted ? 2.5 : 1.5} />
                <span>{complaint.userReposted ? 'Reposted' : 'Repost'} ({complaint.reposts})</span>
              </button>

              {/* DELETE POST BUTTON FOR OWNER */}
            
            </div>

            {/* REPORT BUTTON */}
            <button
              onClick={handleReportClick}
              disabled={complaint.userReported}
              className={`pill-input flex items-center gap-1.5 text-xs font-extrabold border-slate-300 transition-all ${
                complaint.userReported
                  ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" fill={complaint.userReported ? "currentColor" : "none"} />
              <span>{complaint.userReported ? 'Reported' : 'Report'}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                cycleStatus(complaint.id);
              }}
              className="pill-button-indigo text-xs py-2 px-4 shadow-sm text-white font-extrabold"
            >
              Process Started ➔ ({complaint.status})
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cycleStatus(complaint.id);
                }}
                className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold hover:bg-emerald-200"
              >
                Mark Resolved
              </button>
             
            </div>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION GLASS MODAL */}
      {showDeleteModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(false);
          }}
          className="compact-modal-overlay"
          style={{ zIndex: 6500 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center justify-center py-6 px-6"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-inner">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-extrabold font-serif text-slate-900 mb-1">
              Delete Grievance Post?
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-6">
              Are you sure you want to delete this reported issue ({formattedGrievanceId})? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 w-full justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 rounded-full border border-slate-300 text-xs font-extrabold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="pill-button-dark py-2 px-5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT REASON PROMPT MODAL */}
      {showReportReasonModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowReportReasonModal(false);
          }}
          className="compact-modal-overlay"
          style={{ zIndex: 5000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-left flex flex-col gap-4"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReportReasonModal(false);
              }}
              className="compact-modal-close-btn"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold font-serif text-slate-900">
                Report Grievance Issue
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Please enter the reason for reporting complaint #{formattedGrievanceId}:
            </p>

            <textarea
              required
              rows={3}
              placeholder="e.g. Inaccurate location, duplicate post, or inappropriate media..."
              value={reportReasonText}
              onChange={(e) => setReportReasonText(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />

            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReportReasonModal(false);
                }}
                className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReportSubmit}
                className="pill-button-dark py-2 px-5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL POST WIDESCREEN DETAIL MODAL */}
      {showDetailModal && (
        <div
          onClick={() => setShowDetailModal(false)}
          className="detail-modal-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="detail-modal-card"
          >
            {/* Top Close & Back Button */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="pill-input bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 py-1.5 px-3 border-slate-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to List
              </button>

              <div className="flex items-center gap-2">
                {(isOwner || isAdmin) && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="compact-modal-close-btn"
                  style={{ position: 'static' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* INSTAGRAM STORIES STYLE ANIMATED GLASSY STATUS PROGRESS TRACKER */}
            <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 mb-6 backdrop-blur-2xl bg-white/70 dark:bg-slate-900/70 border border-white/80 dark:border-slate-700/80 shadow-2xl transition-all">
              {/* Glowing Background Radial Flares */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* 1. TOP INSTAGRAM STORY STYLE SEGMENTED PROGRESS BARS */}
              <div className="flex items-center justify-between gap-2 mb-4">
                {[1, 2, 3, 4].map((stepNum) => {
                  const isReached = animStep >= stepNum;
                  const isCurrent = animStep === stepNum;
                  return (
                    <div key={stepNum} className="flex-1 h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden relative shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isReached
                            ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 dark:from-amber-400 dark:via-pink-500 dark:to-purple-500 shadow-md'
                            : 'w-0'
                        } ${isCurrent ? 'animate-pulse' : ''}`}
                        style={{
                          width: isReached ? '100%' : '0%',
                          transitionDelay: `${(stepNum - 1) * 180}ms`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 2. HEADER WITH LIVE STATUS RADAR BEACON */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <h4 className="text-xs font-black font-serif uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Live Grievance Lifecycle Tracker
                  </h4>
                </div>

                <span className={`px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full shadow-sm ${
                  currentStep === 4
                    ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/50'
                    : currentStep === 3
                    ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-400/50'
                    : currentStep === 2
                    ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-400/50'
                    : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400/50'
                }`}>
                  Current Status: {statusDisplayText}
                </span>
              </div>

              {/* 3. 4 GLASS STEP CARDS GRID WITH CONNECTING ANIMATED LASER LINE */}
              <div className="relative">
                {/* Background Connecting Rail & Animated Glowing Laser Line */}
                <div className="hidden sm:block absolute top-[28px] left-[12%] right-[12%] h-[3px] bg-slate-200/90 dark:bg-slate-700/90 -z-0 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-rose-500 via-purple-500 to-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(244,63,94,0.9)]"
                    style={{
                      width: animStep <= 1 ? '0%' : animStep === 2 ? '33.3%' : animStep === 3 ? '66.6%' : '100%',
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative z-10">
                  {/* Step 1: Registered */}
                  <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-500 flex sm:flex-col items-center sm:text-center gap-3 ${
                    animStep >= 1
                      ? 'bg-white/90 dark:bg-slate-800/90 border-amber-400/60 shadow-lg shadow-amber-500/10 scale-[1.02]'
                      : 'bg-white/40 dark:bg-slate-800/40 border-white/40 dark:border-slate-700/40 opacity-50'
                  }`}>
                    <div className={`w-12 h-12 rounded-full p-[2.5px] flex items-center justify-center flex-shrink-0 transition-transform duration-500 ${
                      animStep >= 1 ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
                    }`}>
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-800 dark:text-white">
                        ✓
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">1. Registered</p>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                        {postedDateTimeFormatted || complaint.postedDate}
                      </p>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full inline-block mt-1">
                        Grievance Logged
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Visited */}
                  <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-500 flex sm:flex-col items-center sm:text-center gap-3 ${
                    animStep >= 2
                      ? 'bg-white/90 dark:bg-slate-800/90 border-purple-400/60 shadow-lg shadow-purple-500/10 scale-[1.02]'
                      : 'bg-white/40 dark:bg-slate-800/40 border-white/40 dark:border-slate-700/40 opacity-50'
                  }`}>
                    <div className={`w-12 h-12 rounded-full p-[2.5px] flex items-center justify-center flex-shrink-0 transition-transform duration-500 ${
                      animStep >= 2 ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-600 shadow-md animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
                    }`}>
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-800 dark:text-white">
                        {animStep >= 2 ? '✓' : '2'}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">2. Visited</p>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                        Officer Opened Link
                      </p>
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded-full inline-block mt-1">
                        {animStep >= 2 ? 'Site / Post Inspected' : 'Pending View'}
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Action-in-progress */}
                  <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-500 flex sm:flex-col items-center sm:text-center gap-3 ${
                    animStep >= 3
                      ? 'bg-white/90 dark:bg-slate-800/90 border-blue-400/60 shadow-lg shadow-blue-500/10 scale-[1.02]'
                      : 'bg-white/40 dark:bg-slate-800/40 border-white/40 dark:border-slate-700/40 opacity-50'
                  }`}>
                    <div className={`w-12 h-12 rounded-full p-[2.5px] flex items-center justify-center flex-shrink-0 transition-transform duration-500 ${
                      animStep >= 3 ? 'bg-gradient-to-tr from-blue-500 via-cyan-500 to-indigo-600 shadow-md animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
                    }`}>
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-800 dark:text-white">
                        {animStep >= 3 ? '✓' : '3'}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">3. Action-in-progress</p>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                        {complaint.officerNotes || 'Field Inspection & Work'}
                      </p>
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded-full inline-block mt-1">
                        {animStep >= 3 ? 'Work Initiated' : 'Awaiting Action'}
                      </span>
                    </div>
                  </div>

                  {/* Step 4: Resolved */}
                  <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-500 flex sm:flex-col items-center sm:text-center gap-3 ${
                    animStep >= 4
                      ? 'bg-white/90 dark:bg-slate-800/90 border-emerald-400/60 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                      : 'bg-white/40 dark:bg-slate-800/40 border-white/40 dark:border-slate-700/40 opacity-50'
                  }`}>
                    <div className={`w-12 h-12 rounded-full p-[2.5px] flex items-center justify-center flex-shrink-0 transition-transform duration-500 ${
                      animStep >= 4 ? 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-green-600 shadow-md animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
                    }`}>
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-800 dark:text-white">
                        {animStep >= 4 ? '✓' : '4'}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">4. Resolved</p>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                        {formatDateTimeDDMMYYYY(complaint.resolvedAt || complaint.resolvedDate) || 'Pending Action'}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full inline-block mt-1">
                        {animStep >= 4 ? 'Problem Redressed' : 'Pending Resolution'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAIL MODAL GRID CONTENT */}
            <div className="detail-modal-grid">
              {/* Left Column: Full Media Gallery */}
              <div className="flex flex-col gap-4">
                {images.length > 1 && (
  <div className="w-full flex justify-center">
    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-1 rounded-full text-black text-xs font-bold shadow-lg border border-white/20"><button
                    type="button"
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-opacity border-none outline-none ${
                      currentImageIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white/20 cursor-pointer'
                    }`}
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-4 h-4 text-black" />
                  </button>

                  <span className="text-[11px] font-mono font-extrabold px-1 text-black">
                    {currentImageIndex + 1}/{images.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-opacity border-none outline-none ${
                      currentImageIndex === images.length - 1 ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white/20 cursor-pointer'
                    }`}
                    title="Next Image"
                  >
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>
                </div></div>
              )}

                <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-900 shadow-md w-full flex items-center justify-center">
                  <img
                    src={images[currentImageIndex] || images[0]}
                    alt="Grievance evidence large"
                    className="w-full h-full object-cover"
                  />
                  
                </div>

                {complaint.videoUrl && (
                  <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                    <p className="text-xs font-bold text-white p-2.5 bg-slate-800 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-purple-400" /> Video Evidence Attached
                    </p>
                    <video src={complaint.videoUrl} controls className="w-full max-h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Right Column: Complete Details & Department Information */}
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      {complaint.departmentName}
                    </span>
                    <span className="text-xs font-bold text-slate-500">ID: {formattedGrievanceId}</span>
                  </div>

                  <h2 className="text-xl font-bold font-serif text-slate-900 mb-2">
                    Grievance at {complaint.address}
                  </h2>

                  <p className="text-xs text-slate-600 font-medium mb-4">
                    <strong>Pincode:</strong> {complaint.pincode} • <strong>Filed On:</strong> {complaint.postedDate}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                    <h5 className="text-xs font-bold font-serif text-slate-500 uppercase tracking-wider mb-1">
                      Detailed Description:
                    </h5>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                      {complaint.description}
                    </p>
                  </div>

                  {complaint.officerNotes && (
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 mb-4 shadow-sm">
                      <h5 className="text-xs font-bold font-serif text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> Progress:
                      </h5>
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                        {complaint.officerNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-extrabold text-slate-900 border-t border-slate-200 pt-3">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {complaint.upvotes} Upvotes</span>
                    <span className="flex items-center gap-1"><Repeat className="w-4 h-4" /> {complaint.reposts} Reposts</span>
                    <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" /> {complaint.reports || 0} Reports</span>
                  </div>
                </div>

                {/* Citizen Resolution Feedback Section (Modal View) */}
                {renderFeedbackSection()}
              </div>
            </div>

            {/* Bottom Footer Back Button */}
            <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end">
             
            </div>
          </div>
        </div>
      )}
    </>
  );
};
