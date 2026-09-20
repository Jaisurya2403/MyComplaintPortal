import React, { useState, useEffect } from 'react';
import { 
  Edit3, Mail, Phone, MapPin, Check, Camera, Trash2, CheckCircle2, 
  AlertTriangle, X, User, ShieldCheck, Building2, BadgeCheck, Activity, Award 
} from 'lucide-react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

import { imagesApi } from '../../api/apiClient';

export const MyProfilePage = () => {
  const { user, updateUser, theme } = useAuth();
  const { complaints = [], departments = [] } = useComplaints();
  const isDark = theme === 'dark';

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DEPARTMENT_ADMIN' || user?.role === 'ADMIN' || user?.email?.toLowerCase() === 'jaisurya7482@gmail.com';

  // Compute live DB statistics based on actual stored records
  const grievancesMonitoredCount = complaints.length;
  const resolutionsApprovedCount = complaints.filter(
    (c) => c?.status === 'Resolved' || c?.status === 'RESOLVED'
  ).length;
  const activeDepartmentsCount = departments.length;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [department, setDepartment] = useState(user?.department || (isAdmin ? 'Public Works Authority' : ''));
  const [designation, setDesignation] = useState(user?.designation || (isAdmin ? 'Administrator' : ''));
  const [badgeId, setBadgeId] = useState(user?.badgeId || (user?.id?.startsWith('admin-') ? user.id.toUpperCase() : ''));
  const [profileImage, setProfileImage] = useState(user?.profileImage || user?.profileImageUrl || null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setDepartment(user.department || (isAdmin ? 'Public Works Authority' : ''));
      setDesignation(user.designation || (isAdmin ? 'Administrator' : ''));
      setBadgeId(user.badgeId || (user.id?.startsWith('admin-') ? user.id.toUpperCase() : ''));
      setProfileImage(user.profileImage || user.profileImageUrl || null);
    }
  }, [user]);
  
  // Modal States
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const res = await imagesApi.uploadImage(file);
        const imageId = res?.imageId || res?.id || res?.filename;
        if (imageId) {
          const imageUrl = imagesApi.getImageUrl(imageId);
          setProfileImage(imageUrl);
          await updateUser({ profileImage: imageUrl });
          setShowImagePreviewModal(false);
          return;
        }
      } catch (err) {
        console.warn('GridFS upload fallback, compressing image:', err);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 150;
            let w = img.width;
            let h = img.height;
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setProfileImage(compressedDataUrl);
            updateUser({ profileImage: compressedDataUrl });
            setShowImagePreviewModal(false);
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmRemoveProfileImage = () => {
    setProfileImage(null);
    updateUser({ profileImage: null });
    setShowDeleteConfirmModal(false);
    setShowImagePreviewModal(false);
  };

  const handleSave = async () => {
    await updateUser({ 
      name, 
      email, 
      phone, 
      location, 
      department, 
      designation, 
      badgeId, 
      profileImage 
    });
    setIsEditing(false);
    setShowSaveSuccessModal(true);
    setTimeout(() => {
      setShowSaveSuccessModal(false);
    }, 2500);
  };

  const activePhoto = profileImage || user?.profileImage || user?.profileImageUrl;

  return (
    <div className={`page-profile min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white bg-civic-gradient' : 'bg-civic-gradient text-slate-900'
    }`}>
      <TopNavBar theme={isDark ? 'dark' : 'civic'} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col md:flex-row gap-8 items-start relative z-10">
        {!isAdmin && <SidebarMenu type="user" />}

        <div className={`flex-1 w-full min-w-0 content-with-sidebar ${isAdmin ? 'max-w-4xl mx-auto' : 'max-w-3xl'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white text-center sm:text-left">
                {isAdmin ? '🛡️ Super Admin Profile' : '👤 My Profile'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-center sm:text-left mt-0.5">
                {isAdmin ? 'Manage official administrative credentials, department roles & email details' : 'Manage citizen personal details & contact preferences'}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="pill-button-dark text-xs py-2.5 px-5 shadow-lg hover:scale-105 transition-transform flex-shrink-0 cursor-pointer font-extrabold"
            >
              <Edit3 className="w-4 h-4 text-blue-400" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile Details'}
            </button>
          </div>

          {/* MAIN PROFILE CARD */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative transition-all ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            {/* PROFILE AVATAR & BADGE SECTION */}
            <div className="flex flex-col items-center mb-8 relative text-center">
              <div className="relative group">
                <div
                  onClick={() => activePhoto && setShowImagePreviewModal(true)}
                  className={`profile-avatar-circle ${activePhoto ? 'cursor-pointer' : ''}`}
                  style={{
                    width: '96px',
                    height: '96px',
                    minWidth: '96px',
                    minHeight: '96px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    border: '3px solid #2563eb',
                  }}
                  title={activePhoto ? 'Click to view photo options' : ''}
                >
                  {activePhoto ? (
                    <img
                      src={activePhoto}
                      alt="User avatar"
                      style={{
                        width: '96px',
                        height: '96px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  ) : (
                    <span className="text-white font-serif font-black text-4xl uppercase">
                      {name ? name.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
                    </span>
                  )}
                </div>
              </div>

              {/* USER / ADMIN NAME & TITLE */}
              <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-slate-900 dark:text-white mt-3">
                {name}
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
                {isAdmin ? (
                  <>
                    <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-3 py-1 rounded-full border border-blue-300 dark:border-blue-700 shadow-sm flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Super Admin
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 shadow-sm flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Badge: {badgeId}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm">
                    Registered Citizen
                  </span>
                )}
              </div>

              {/* ACTION BUTTONS: UPLOAD / REMOVE PHOTO */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {!activePhoto ? (
                  <label
                    style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#ffffff' : '#0f172a', borderColor: isDark ? '#475569' : '#cbd5e1' }}
                    className="pill-input text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105 py-2 px-4 border"
                  >
                    <Camera className="w-4 h-4 text-blue-500 stroke-[2.2]" />
                    <span>Upload Photo 📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmModal(true)}
                    className="pill-input bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all border border-rose-300 dark:border-rose-700 py-1.5 px-4 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Remove Photo 🗑️
                  </button>
                )}
              </div>
            </div>

            {/* ADMIN EXECUTIVE SYSTEM OVERVIEW STATS (ADMIN ONLY) */}
            {isAdmin && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className={`p-4 rounded-2xl border text-center shadow-sm ${
                  isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-300'
                }`}>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
                    Grievances Monitored
                  </span>
                  <h4 className="text-2xl font-black font-serif text-blue-700 dark:text-blue-400 mt-1">
                    {grievancesMonitoredCount}
                  </h4>
                </div>

                <div className={`p-4 rounded-2xl border text-center shadow-sm ${
                  isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-300'
                }`}>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
                    Resolutions Approved
                  </span>
                  <h4 className="text-2xl font-black font-serif text-emerald-700 dark:text-emerald-400 mt-1">
                    {resolutionsApprovedCount}
                  </h4>
                </div>

                <div className={`p-4 rounded-2xl border text-center shadow-sm ${
                  isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-300'
                }`}>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
                    Active Departments
                  </span>
                  <h4 className="text-2xl font-black font-serif text-purple-700 dark:text-purple-400 mt-1">
                    {activeDepartmentsCount} {activeDepartmentsCount === 1 ? 'Body' : 'Bodies'}
                  </h4>
                </div>
              </div>
            )}

            {/* FORM FIELD CARDS WITH ICON BADGES */}
            <div className="flex flex-col gap-4">
              {/* NAME CARD */}
              <div className={`p-4 rounded-2xl border shadow-sm transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/90 border-slate-200/90'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-serif">
                    Full Name
                  </label>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border font-extrabold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                    }}
                  />
                ) : (
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white pl-8">
                    {name}
                  </p>
                )}
              </div>

              {/* EMAIL CARD */}
              <div className={`p-4 rounded-2xl border shadow-sm transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/90 border-slate-200/90'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs shadow-sm">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-serif">
                      Email Address
                    </label>
                  </div>

                  
                </div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white pl-8">
                    {email}
                  </p>
                
              </div>

              {/* ADMIN SPECIFIC CARDS: DEPARTMENT & DESIGNATION */}
              {isAdmin && (
                <>
                  <div className={`p-4 rounded-2xl border shadow-sm transition-all ${
                    isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/90 border-slate-200/90'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs shadow-sm">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-serif">
                        Municipal Department
                      </label>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-3 rounded-xl border font-extrabold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          color: isDark ? '#ffffff' : '#0f172a',
                          borderColor: isDark ? '#475569' : '#cbd5e1',
                        }}
                      />
                    ) : (
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white pl-8">
                        {department}
                      </p>
                    )}
                  </div>

                  <div className={`p-4 rounded-2xl border shadow-sm transition-all ${
                    isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/90 border-slate-200/90'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs shadow-sm">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-serif">
                        Admin Designation & Rank
                      </label>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full p-3 rounded-xl border font-extrabold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: isDark ? '#1e293b' : '#ffffff',
                          color: isDark ? '#ffffff' : '#0f172a',
                          borderColor: isDark ? '#475569' : '#cbd5e1',
                        }}
                      />
                    ) : (
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white pl-8">
                        {designation}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* PHONE CARD */}
              <div className={`p-4 rounded-2xl border shadow-sm transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/90 border-slate-200/90'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs shadow-sm">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-serif">
                    Phone Number
                  </label>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border font-extrabold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                    }}
                  />
                ) : (
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white pl-8">
                    {phone}
                  </p>
                )}
              </div>

              {/* LOCATION CARD */}
              <div className={`p-4 rounded-2xl border shadow-sm transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white/90 border-slate-200/90'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs shadow-sm">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-serif">
                    Assigned Jurisdiction & Pincode
                  </label>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 rounded-xl border font-extrabold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                    }}
                  />
                ) : (
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white pl-8">
                    {location}
                  </p>
                )}
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="pill-button-dark w-full justify-center py-3.5 text-sm mt-4 shadow-xl cursor-pointer font-extrabold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="w-4 h-4 text-white" /> Save Profile Details
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FULL PHOTO VIEW & OPTION MODAL */}
      {showImagePreviewModal && activePhoto && (
        <div
          onClick={() => setShowImagePreviewModal(false)}
          className="compact-modal-overlay"
          style={{ zIndex: 5500 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center py-6 px-6"
          >
            <button
              onClick={() => setShowImagePreviewModal(false)}
              className="compact-modal-close-btn"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-extrabold font-serif text-slate-900 dark:text-white mb-3">
              Profile Photo Options
            </h3>

            <div
              className="profile-preview-modal-box"
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #2563eb',
              }}
            >
              <img
                src={activePhoto}
                alt="Profile picture preview"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <label
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '1.5px solid #0f172a',
                }}
                className="pill-input text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:bg-slate-100 hover:scale-105 py-2 px-4"
              >
                <Camera className="w-4 h-4 text-slate-900 stroke-[2.2]" />
                <span className="text-slate-900 font-extrabold">Upload New Photo 📷</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowImagePreviewModal(false);
                  setShowDeleteConfirmModal(true);
                }}
                className="pill-input bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all border border-rose-300 py-2 px-4 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-700" /> Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION PROMPT MODAL FOR DELETING PROFILE PHOTO */}
      {showDeleteConfirmModal && (
        <div
          onClick={() => setShowDeleteConfirmModal(false)}
          className="compact-modal-overlay"
          style={{ zIndex: 6000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center justify-center py-6 px-6"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-inner">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-white mb-1">
              Delete Profile Photo?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-6">
              Are you sure you want to remove your profile picture? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 w-full justify-center">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveProfileImage}
                className="pill-button-dark py-2 px-5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CENTERED CONFIRMATION TOAST MODAL FOR PROFILE SAVE */}
      {showSaveSuccessModal && (
        <div
          onClick={() => setShowSaveSuccessModal(false)}
          className="compact-modal-overlay"
          style={{ zIndex: 6000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center justify-center py-6 px-8"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-white mb-1">
              Profile Updated!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
              Your profile details have been saved successfully.
            </p>

            <button
              onClick={() => setShowSaveSuccessModal(false)}
              className="pill-button-dark py-2 px-6 text-xs text-white font-extrabold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
