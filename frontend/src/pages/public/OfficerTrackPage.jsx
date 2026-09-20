import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintsApi, imagesApi } from '../../api/apiClient.js';
import { CheckCircle2, Clock, MapPin, Tag, ShieldCheck, FileText, AlertCircle, ArrowLeft, PlayCircle } from 'lucide-react';

export const OfficerTrackPage = () => {
  const { token } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notes, setNotes] = useState('');
  const [proofImageId, setProofImageId] = useState('');
  const [startingAction, setStartingAction] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchAndTrack = async () => {
      try {
        setLoading(true);
        const data = await complaintsApi.track(token);
        setComplaint(data);
        setError(null);
      } catch (err) {
        console.error('Officer track fetch error:', err);
        setError(err.message || 'Unable to load grievance post. Token may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAndTrack();
    }
  }, [token]);

  const handleStartAction = async () => {
    try {
      setStartingAction(true);
      const updated = await complaintsApi.officerStartAction(token, notes || 'Process started by department officer.');
      setComplaint(updated);
    } catch (err) {
      console.error('Officer start action error:', err);
      alert('Error updating action status: ' + err.message);
    } finally {
      setStartingAction(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const updated = await complaintsApi.officerComplete(token, proofImageId, notes || 'Inspection completed on site.');
      setComplaint(updated);
      setCompleted(true);
    } catch (err) {
      console.error('Officer complete error:', err);
      alert('Error marking grievance resolved: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedGrievanceId = complaint ? (complaint.complaintId?.startsWith('CMP') ? complaint.complaintId : `CMP-2026-${complaint.complaintId}`) : '';

  const images = complaint?.attachmentImageIds && complaint.attachmentImageIds.length > 0
    ? complaint.attachmentImageIds.map(id => imagesApi.getImageUrl(id))
    : (complaint?.images && complaint.images.length > 0
      ? complaint.images.map(img => imagesApi.getImageUrl(img))
      : ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80']);

  const isRegistered = complaint?.status === 'REGISTERED' || complaint?.status === 'Registered';
  const isVisited = complaint?.status === 'VISITED' || complaint?.status === 'Visited';
  const isInProgress = complaint?.status === 'ACTION_IN_PROGRESS' || complaint?.status === 'Action-in-progress' || complaint?.status === 'In Progress';
  const isCompleted = complaint?.status === 'RESOLVED' || complaint?.status === 'Resolved' || completed;

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-3xl glass-civic p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/80">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                Officer Grievance Tracking Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Official Department Direct Access Inspection Page
              </p>
            </div>
          </div>
          <Link to="/posts" className="pill-input bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Public Feed
          </Link>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-700">Loading Grievance Post & Registering Visit...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-rose-900 mb-1">Grievance Not Found</h3>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        )}

        {complaint && !loading && (
          <div className="space-y-6">
            
            {/* Status Banner */}
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600 animate-pulse" />
                <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                  Current Status: {complaint.status}
                </span>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                {isCompleted ? 'Status: Resolved' : isInProgress ? 'Status: Action-in-progress' : isVisited ? 'Status: Visited by Officer' : 'Status: Registered'}
              </span>
            </div>

            {/* Complaint Key Info */}
            <div className="bg-white/80 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  <Tag className="w-3 h-3 inline mr-1" /> {complaint.departmentName || 'Municipal Dept'}
                </span>
                <span className="text-xs font-bold text-slate-500">ID: {formattedGrievanceId}</span>
              </div>

              <h2 className="text-xl font-bold font-serif text-slate-900">
                {complaint.title || 'Civic Grievance Report'}
              </h2>

              <p className="text-xs text-slate-600 font-medium">
                <strong>Location:</strong> {complaint.locationName} • <strong>Pincode:</strong> {complaint.pincode}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold font-serif text-slate-500 uppercase mb-1">Issue Description:</h4>
                <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Evidence Photo Gallery */}
            <div>
              <h4 className="text-xs font-bold font-serif text-slate-700 uppercase tracking-wider mb-3">
                Uploaded Evidence Media:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                    <img src={img} alt="Evidence photo" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Tracker Timeline */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold font-serif text-slate-500 uppercase tracking-wider mb-3">
                Status Resolution Progress Tracker:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-xl border border-emerald-300 text-center shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs mx-auto mb-1 flex items-center justify-center">✓</div>
                  <span className="text-[11px] font-bold text-slate-800 block">Registered</span>
                </div>
                <div className={`p-3 rounded-xl text-center shadow-sm ${isVisited || isInProgress || isCompleted ? 'bg-purple-100 border-purple-300' : 'bg-slate-100 border-slate-200'}`}>
                  <div className={`w-6 h-6 rounded-full font-bold text-xs mx-auto mb-1 flex items-center justify-center ${isVisited || isInProgress || isCompleted ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    ✓
                  </div>
                  <span className="text-[11px] font-extrabold text-purple-900 block">Visited</span>
                </div>
                <div className={`p-3 rounded-xl text-center shadow-sm ${isInProgress || isCompleted ? 'bg-blue-100 border-blue-300' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                  <div className={`w-6 h-6 rounded-full font-bold text-xs mx-auto mb-1 flex items-center justify-center ${isInProgress || isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    {isInProgress || isCompleted ? '✓' : '3'}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block">Action-in-progress</span>
                </div>
                <div className={`p-3 rounded-xl text-center shadow-sm ${isCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                  <div className={`w-6 h-6 rounded-full font-bold text-xs mx-auto mb-1 flex items-center justify-center ${isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                    {isCompleted ? '✓' : '4'}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block">Resolved</span>
                </div>
              </div>
            </div>

            {/* Officer Action Form & 2 Buttons Workflow */}
            {!isCompleted ? (
              <form onSubmit={handleComplete} className="bg-white p-5 sm:p-6 rounded-2xl border border-indigo-200 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 border-b border-indigo-100 pb-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold font-serif">Officer On-Site Action & Resolution Form</h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Officer Resolution Comments / Inspection Notes:
                  </label>
                  <textarea
                    rows={3}
                    required={isInProgress}
                    placeholder="Enter inspection results, repair actions taken, or maintenance report..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {/* 2 HIGH-VISIBILITY VIBRANT OFFICER WORKFLOW BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  {/* Button 1: Action Started */}
                  <button
                    type="button"
                    onClick={handleStartAction}
                    disabled={!isVisited || startingAction}
                    className={`pill-button-dark py-3 px-6 text-xs sm:text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 border-2 ${
                      isInProgress || isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-bold cursor-default'
                        : isVisited
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-lg shadow-blue-500/30 cursor-pointer animate-pulse active:scale-95'
                        : 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {isInProgress || isCompleted ? (
                      <>
                        <CheckCircle2 className=" w-5 h-5 text-white stroke-[3]" />
                        ✓ Action Started
                      </>
                    ) : (
                      <>
                        <PlayCircle className=" w-5 h-5 stroke-[2.5]" />
                        {startingAction ? 'Updating Status...' : '1. Action Started ➔'}
                      </>
                    )}
                  </button>

                  {/* Button 2: Mark Resolved & Complete (Enabled ONLY after Action Started) */}
                  <button
                    type="submit"
                    disabled={!isInProgress || submitting}
                    title={!isInProgress && !isCompleted ? 'Please click "Action Started" first before completing' : ''}
                    className={`pill-button-dark py-3 px-6 text-xs sm:text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 border-2 ${
                      isInProgress
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xl shadow-emerald-600/40 cursor-pointer active:scale-95 animate-bounce'
                        : isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-bold cursor-default'
                        : 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed opacity-70'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    {submitting ? 'Completing Task...' : '2. Mark Resolved & Complete'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Grievance Successfully Resolved</h3>
                <p className="text-xs text-emerald-800 font-medium">
                  {complaint.officerNotes || 'Verified & resolved on-site. Citizen problem solved email dispatched.'}
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerTrackPage;
