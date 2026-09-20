import React, { useState } from 'react';
import { 
  Search, ChevronRight, Ban, Users, X, AlertTriangle, CheckCircle2, 
  Mail, Phone, MapPin, Calendar, FileText, Repeat, ThumbsUp, ShieldAlert, User, Layers, Trash2,
  BadgeCheck, Sparkles, CheckCircle, Clock, ShieldCheck, BarChart3, Copy, Check, Grid, ExternalLink
} from 'lucide-react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { ComplaintCard } from '../../components/common/ComplaintCard.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { imagesApi } from '../../api/apiClient';

export const UsersManagementPage = () => {
  const { theme } = useAuth();
  const { users, complaints, toggleUserBlocked, deleteUser } = useComplaints();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);

  // State for Block/Unblock Confirmation Modal
  const [userToToggle, setUserToToggle] = useState(null); // { id, name, isBlocked }

  // State for Delete User Confirmation Modal
  const [userToDelete, setUserToDelete] = useState(null); // { id, name, email }

  // State for User Profile Inspection View Modal
  const [inspectingUser, setInspectingUser] = useState(null); // user object
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'reposts' | 'insights'
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isDark = theme === 'dark';

  const filteredUsers = users.filter((u) => {
    const isRealCitizen =
      (!u?.role || u?.role === 'CITIZEN') &&
      u?.email?.toLowerCase() !== 'jaisurya7482@gmail.com' &&
      !u?.email?.includes('@citizen.portal');

    if (!isRealCitizen) return false;

    const nameStr = u?.name || u?.username || u?.email || '';
    const emailStr = u?.email || '';
    const matchesSearch =
      nameStr.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      emailStr.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesBlocked = !showBlockedOnly || u?.isBlocked || u?.blocked;
    return matchesSearch && matchesBlocked;
  });

  const handleConfirmToggle = async () => {
    if (userToToggle) {
      await toggleUserBlocked(userToToggle.id);
      if (inspectingUser && (inspectingUser.id === userToToggle.id || inspectingUser.email === userToToggle.email)) {
        setInspectingUser((prev) => prev ? { ...prev, isBlocked: !prev.isBlocked, blocked: !prev.blocked } : null);
      }
      setUserToToggle(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const targetId = userToDelete.id || userToDelete.userId || userToDelete.email;
      await deleteUser(targetId);
      if (inspectingUser && (inspectingUser.id === targetId || inspectingUser.email === userToDelete.email)) {
        setInspectingUser(null);
      }
      setUserToDelete(null);
    }
  };

  // Get posts submitted by inspectingUser
  const userPosts = inspectingUser 
    ? complaints.filter((c) => c.userId === inspectingUser.id || c.userEmail === inspectingUser.email || c.userName?.toLowerCase() === inspectingUser.name?.toLowerCase())
    : [];

  // Get posts reposted / supported by inspectingUser
  const userReposts = inspectingUser
    ? complaints.filter((c) => c.userReposted || c.repostReasons?.some((r) => r.includes(inspectingUser.name)))
    : [];

  // Total Upvotes received by inspectingUser
  const totalUpvotesEarned = userPosts.reduce((sum, p) => sum + (p.upvotes || 0), 0);

  // Resolved posts count
  const resolvedCount = userPosts.filter(p => (p.status || '').toUpperCase() === 'RESOLVED').length;

  // Resolution Rate %
  const resolutionRate = userPosts.length > 0 ? Math.round((resolvedCount / userPosts.length) * 100) : 100;

  // Resolve user avatar URL with fallback
  const getUserAvatarUrl = (userObj) => {
    if (!userObj) return null;
    const raw = userObj.profileImage || userObj.profileImageUrl || userObj.avatar;
    if (raw) return imagesApi.getImageUrl(raw);
    const postWithImg = complaints.find(c => (c.userId === userObj.id || c.userEmail === userObj.email) && c.userProfileImageUrl);
    if (postWithImg?.userProfileImageUrl) return imagesApi.getImageUrl(postWithImg.userProfileImageUrl);
    return null;
  };

  const handleCopyEmail = (email) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className={`page-admin-users min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      <TopNavBar theme={isDark ? 'dark' : 'civic'} />

      {/* CENTERED MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col md:flex-row gap-8 items-start relative z-10">
        <SidebarMenu type="admin" />

        <div className="flex-1 w-full max-w-4xl min-w-0 content-with-sidebar">
          {/* Header Card */}
          <div className={`p-6 sm:p-8 rounded-3xl mb-6 border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-fadeIn ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-serif bg-blue-100 dark:bg-blue-900/60 px-3.5 py-1 rounded-full shadow-sm inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Registered Citizens Directory
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-2">
                Users Management
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                Oversee citizen accounts, inspect Instagram-style profiles, monitor grievances, and moderate access.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg flex-shrink-0">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          {/* ULTRA-PROFESSIONAL SEARCH & FILTER BAR */}
          <div className={`p-3.5 sm:p-4 rounded-3xl mb-6 border shadow-lg flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            {/* SEAMLESS BORDERLESS SEARCH BAR */}
            <div 
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#cbd5e1',
              }}
              className="flex items-center gap-3 flex-1 max-w-md px-4 py-3 rounded-full border shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
            >
              <Search className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.2] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search citizens by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  boxShadow: 'none',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  width: '100%',
                  padding: '0',
                  margin: '0',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* HIGH-CONTRAST BLOCKED USERS ONLY TOGGLE BUTTON */}
            <button
              onClick={() => setShowBlockedOnly(!showBlockedOnly)}
              style={{
                backgroundColor: showBlockedOnly ? '#e11d48' : (isDark ? '#1e293b' : '#ffffff'),
                color: showBlockedOnly ? '#ffffff' : (isDark ? '#ffffff' : '#0f172a'),
                borderColor: showBlockedOnly ? '#be123c' : (isDark ? '#475569' : '#cbd5e1'),
              }}
              className="flex items-center gap-2 text-xs font-serif font-extrabold py-3 px-5 rounded-full border shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Ban className={`w-4 h-4 ${showBlockedOnly ? 'text-white' : 'text-rose-500'}`} />
              <span>Blocked Users Only</span>
            </button>
          </div>

          {/* Users List */}
          <div className={`p-6 rounded-3xl border shadow-xl max-h-[560px] overflow-y-auto ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            <div className="flex flex-col gap-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => {
                  const isUserBlocked = Boolean(user.isBlocked || user.blocked);
                  const userIdKey = user.id || user.userId || user.email || 'usr-item';
                  const userAvatarUrl = getUserAvatarUrl(user);
                  
                  return (
                    <div
                      key={`user-card-${userIdKey}-${idx}`}
                      onClick={() => {
                        setInspectingUser(user);
                        setActiveTab('posts');
                      }}
                      style={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                      }}
                      className="p-4 rounded-2xl border flex items-center justify-between gap-4 hover:scale-[1.01] hover:shadow-md transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <span className="text-xs font-extrabold text-slate-400 font-serif min-w-[20px] flex-shrink-0">
                          {idx + 1}.
                        </span>
                        
                        {/* INSTAGRAM MINI STORY AVATAR */}
                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex-shrink-0 shadow-sm">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center font-extrabold text-sm border-2 border-white dark:border-slate-900">
                            {userAvatarUrl ? (
                              <img
                                src={userAvatarUrl}
                                alt={user.name[0] || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.parentNode.textContent = (user.name || 'U').charAt(0).toUpperCase();
                                }}
                                style={{ display: 'block', width: '40px', height: '40px',borderRadius: '50%' }}
                                
                              />
                            ) : (
                              <span className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-full h-full flex items-center justify-center font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-2 truncate">
                            <span>{user.name}</span>
                            <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20 flex-shrink-0" />
                            {isUserBlocked && (
                              <span className="px-2.5 py-0.5 bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 rounded-full text-[10px] font-extrabold border border-rose-300 dark:border-rose-700 flex-shrink-0">
                                Blocked
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate mt-0.5">
                            {user.email} • {user.phone || '+91 9876543210'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* BLOCK / UNBLOCK BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserToToggle({ id: userIdKey, name: user.name, isBlocked: isUserBlocked, email: user.email });
                          }}
                          className={`pill-input text-xs font-extrabold py-1.5 px-3.5 cursor-pointer shadow-sm ${
                            isUserBlocked 
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-200' 
                              : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-300 hover:bg-rose-200'
                          }`}
                        >
                          {isUserBlocked ? 'Unblock User' : 'Block User'}
                        </button>

                        {/* DELETE USER BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserToDelete({ id: userIdKey, name: user.name, email: user.email });
                          }}
                          className="p-2 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                          title="Permanently Delete User Account"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2]" />
                        </button>

                        {/* INSPECT DETAILS ARROW */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingUser(user);
                            setActiveTab('posts');
                          }}
                          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-500 dark:text-slate-300 group-hover:translate-x-1"
                          title="View Instagram Profile"
                        >
                          <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-extrabold text-slate-500">No registered users match your search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* IPHONE GLASSMORPHISM CITIZEN PROFILE INSPECTOR MODAL */}
      {inspectingUser && (() => {
        const isUserBlocked = Boolean(inspectingUser.isBlocked || inspectingUser.blocked);
        const avatarUrl = getUserAvatarUrl(inspectingUser);
        const citizenName = (inspectingUser.name || inspectingUser.username || 'Citizen').trim();
        const firstLetter = citizenName.charAt(0).toUpperCase();
        const usernameHandle = `@${citizenName.toLowerCase().replace(/\s+/g, '_')}`;
        const userEmail = inspectingUser.email || 'N/A';
        const userPhone = inspectingUser.phone || '+91 9876543210';
        const userLocation = inspectingUser.location || (userPosts[0]?.location) || 'Tamil Nadu, India';
        const userPincode = inspectingUser.pincode || inspectingUser.pinCode || inspectingUser.postalCode || (userPosts[0]?.pincode) || '641001';

        return (
          <div
            onClick={() => setInspectingUser(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999999,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              padding: '2.5rem 1rem 5rem 1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '820px',
                borderRadius: '32px',
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.65)' : 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(40px) saturate(210%)',
                WebkitBackdropFilter: 'blur(40px) saturate(210%)',
                border: isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '0 30px 80px -10px rgba(0, 0, 0, 0.35), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)',
                overflow: 'hidden',
                position: 'relative',
                margin: '0 auto',
              }}
            >
              {/* IPHONE FROSTED GLASS TOP COVER BANNER */}
              <div 
                style={{
                  height: '130px',
                  width: '100%',
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)' 
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(240, 246, 255, 0.35) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.65)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.75rem',
                }}
              >
                <div 
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '9999px',
                    padding: '0.4rem 1rem',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <Sparkles style={{ width: '14px', height: '14px', color: '#0071e3' }} />
                  <span>Citizen Profile</span>
                </div>

                <button
                  onClick={() => setInspectingUser(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    color: isDark ? '#ffffff' : '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                  title="Close Profile"
                >
                  <X style={{ width: '18px', height: '18px', strokeWidth: 2.5 }} />
                </button>
              </div>

              {/* IPHONE GLASS BODY */}
              <div style={{ padding: '0 2rem 2rem 2rem' }}>
                {/* AVATAR + QUICK STATS HERO ROW */}
                <div 
                  style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    alignItems: 'flex-end', 
                    justifyContent: 'space-between', 
                    gap: '1.5rem',
                    marginTop: '-50px',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  {/* IPHONE FROSTED GLASS AVATAR */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div 
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        padding: '4px',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '2px solid rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
                        flexShrink: 0,
                      }}
                    >
                      <div 
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.7)',
                          backdropFilter: 'blur(16px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={citizenName}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}

                        <div 
                          style={{
                            display: avatarUrl ? 'none' : 'flex',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            color: isDark ? '#ffffff' : '#0f172a',
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", var(--font-sans)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          {firstLetter}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h2 
                          style={{
                            fontSize: '1.45rem',
                            fontWeight: '800',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", var(--font-serif)',
                            color: isDark ? '#ffffff' : '#0f172a',
                            margin: 0,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {citizenName}
                        </h2>
                        <BadgeCheck style={{ width: '20px', height: '20px', color: '#0071e3', fill: 'rgba(0, 113, 227, 0.15)' }} />
                        
                        {isUserBlocked ? (
                          <span 
                            style={{
                              backgroundColor: 'rgba(225, 29, 72, 0.12)',
                              color: '#e11d48',
                              border: '1px solid rgba(225, 29, 72, 0.28)',
                              backdropFilter: 'blur(12px)',
                              padding: '2px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            Blocked
                          </span>
                        ) : (
                          <span 
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.12)',
                              color: '#059669',
                              border: '1px solid rgba(16, 185, 129, 0.28)',
                              backdropFilter: 'blur(12px)',
                              padding: '2px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>

                      <p 
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#64748b',
                          margin: '2px 0 0 0',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", monospace',
                        }}
                      >
                        {usernameHandle}
                      </p>
                    </div>
                  </div>

                  {/* IPHONE GLASS 4-STAT METRICS CAPSULE */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.55)',
                      backdropFilter: 'blur(25px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '24px',
                      padding: '0.75rem 1.5rem',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {userPosts.length}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Grievances
                      </span>
                    </div>

                    <div style={{ width: '1px', height: '28px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.1)' }} />

                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {userReposts.length}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Reposts
                      </span>
                    </div>

                    <div style={{ width: '1px', height: '28px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.1)' }} />

                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {totalUpvotesEarned}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Upvotes
                      </span>
                    </div>

                    <div style={{ width: '1px', height: '28px', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.1)' }} />

                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {resolvedCount}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Resolved
                      </span>
                    </div>
                  </div>
                </div>

                {/* IPHONE GLASS DETAILS & ACTION CONTROLS */}
                <div 
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.75)',
                    borderRadius: '24px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {/* CONTACT INFO ROW */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem', fontSize: '0.85rem', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>
                      <Mail style={{ width: '16px', height: '16px', color: '#0071e3' }} />
                      <span>{userEmail}</span>
                      <button
                        onClick={() => handleCopyEmail(userEmail)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#64748b',
                        }}
                        title="Copy Email"
                      >
                        {copiedEmail ? <Check style={{ width: '14px', height: '14px', color: '#059669' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>
                      <Phone style={{ width: '16px', height: '16px', color: '#059669' }} />
                      <span>{userPhone}</span>
                    </div>
                  </div>

                  {/* LOCATION & PIN ROW */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '1rem 2rem', 
                      fontSize: '0.85rem', 
                      fontWeight: '600',
                      paddingTop: '0.75rem',
                      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(15, 23, 42, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>
                      <MapPin style={{ width: '16px', height: '16px', color: '#e11d48' }} />
                      <span>{userLocation}</span>
                    </div>

                   

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                      <Calendar style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                      <span>
                        Joined: {(() => {
                          const rawDate = inspectingUser?.createdAt || inspectingUser?.joinedAt || inspectingUser?.createdDate || inspectingUser?.registeredAt || (userPosts.length > 0 ? userPosts[userPosts.length - 1]?.createdAt : null);
                          if (rawDate) {
                            try {
                              const d = new Date(rawDate);
                              if (!isNaN(d.getTime())) {
                                return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                              }
                            } catch (e) {}
                          }
                          return '15 Sep 2026';
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* IPHONE GLASS ACTION BUTTONS */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(15, 23, 42, 0.06)',
                    }}
                  >
                    <button
                      onClick={() => setUserToToggle({ 
                        id: inspectingUser.id || inspectingUser.userId || inspectingUser.email, 
                        name: citizenName, 
                        isBlocked: isUserBlocked, 
                        email: userEmail 
                      })}
                      style={{
                        backgroundColor: isUserBlocked ? 'rgba(16, 185, 129, 0.14)' : 'rgba(225, 29, 72, 0.12)',
                        color: isUserBlocked ? '#059669' : '#e11d48',
                        border: isUserBlocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(225, 29, 72, 0.3)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '14px',
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Ban style={{ width: '14px', height: '14px' }} />
                      <span>{isUserBlocked ? 'Unblock Citizen Account' : 'Block Citizen Account'}</span>
                    </button>

                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent('Official Notification - Grievance Redressal Portal')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent('Official Communication - Grievance Redressal Portal')}`;
                        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
                      }}
                      style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.06)',
                        color: isDark ? '#ffffff' : '#0f172a',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(15, 23, 42, 0.15)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '14px',
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                        transition: 'all 0.2s ease',
                      }}
                      title="Compose Email in Gmail"
                    >
                      <Mail style={{ width: '14px', height: '14px', color: '#0071e3' }} />
                      <span>Email User</span>
                    </a>

                    <button
                      onClick={() => setUserToDelete({ 
                        id: inspectingUser.id || inspectingUser.userId || inspectingUser.email, 
                        name: citizenName, 
                        email: userEmail 
                      })}
                      style={{
                        backgroundColor: 'rgba(225, 29, 72, 0.08)',
                        color: '#e11d48',
                        border: '1px solid rgba(225, 29, 72, 0.25)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '14px',
                        padding: '0.65rem 0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                      title="Permanently Delete Citizen Record"
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>

                {/* IOS SEGMENTED CONTROL TABS */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: '9999px',
                    padding: '5px',
                    marginBottom: '1.5rem',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('posts')}
                    style={{
                      flex: 1,
                      backgroundColor: activeTab === 'posts' ? (isDark ? 'rgba(255, 255, 255, 0.16)' : '#ffffff') : 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.6rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: activeTab === 'posts' ? '800' : '600',
                      color: activeTab === 'posts' ? (isDark ? '#ffffff' : '#0f172a') : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: activeTab === 'posts' ? '0 3px 12px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)' : 'none',
                    }}
                  >
                    <Grid style={{ width: '15px', height: '15px' }} />
                    <span>Posts ({userPosts.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reposts')}
                    style={{
                      flex: 1,
                      backgroundColor: activeTab === 'reposts' ? (isDark ? 'rgba(255, 255, 255, 0.16)' : '#ffffff') : 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.6rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: activeTab === 'reposts' ? '800' : '600',
                      color: activeTab === 'reposts' ? (isDark ? '#ffffff' : '#0f172a') : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: activeTab === 'reposts' ? '0 3px 12px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)' : 'none',
                    }}
                  >
                    <Repeat style={{ width: '15px', height: '15px' }} />
                    <span>Reposts ({userReposts.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('insights')}
                    style={{
                      flex: 1,
                      backgroundColor: activeTab === 'insights' ? (isDark ? 'rgba(255, 255, 255, 0.16)' : '#ffffff') : 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.6rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: activeTab === 'insights' ? '800' : '600',
                      color: activeTab === 'insights' ? (isDark ? '#ffffff' : '#0f172a') : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: activeTab === 'insights' ? '0 3px 12px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)' : 'none',
                    }}
                  >
                    <BarChart3 style={{ width: '15px', height: '15px' }} />
                    <span>Insights</span>
                  </button>
                </div>

                {/* TAB CONTENT (FLAWLESS NATURAL SCROLLING) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {activeTab === 'posts' && (
                    userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <ComplaintCard key={post.id} complaint={post} isAdmin={true} />
                      ))
                    ) : (
                      <div 
                        style={{
                          textAlign: 'center',
                          padding: '4rem 1rem',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.45)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '24px',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <FileText style={{ width: '44px', height: '44px', color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>No Grievances Filed Yet</h4>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>This citizen has not submitted any complaints yet.</p>
                      </div>
                    )
                  )}

                  {activeTab === 'reposts' && (
                    userReposts.length > 0 ? (
                      userReposts.map((post) => (
                        <ComplaintCard key={post.id} complaint={post} isAdmin={true} />
                      ))
                    ) : (
                      <div 
                        style={{
                          textAlign: 'center',
                          padding: '4rem 1rem',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.45)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '24px',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <Repeat style={{ width: '44px', height: '44px', color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>No Reposts Found</h4>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>This citizen has not supported or reposted any issues yet.</p>
                      </div>
                    )
                  )}

                  {activeTab === 'insights' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div 
                        style={{
                          padding: '1.25rem',
                          borderRadius: '20px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.55)',
                          backdropFilter: 'blur(20px)',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.75)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Resolution Rate
                          </span>
                          <CheckCircle2 style={{ width: '18px', height: '18px', color: '#059669' }} />
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>
                          {resolutionRate}%
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          {resolvedCount} out of {userPosts.length} complaints resolved
                        </p>
                      </div>

                      <div 
                        style={{
                          padding: '1.25rem',
                          borderRadius: '20px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.55)',
                          backdropFilter: 'blur(20px)',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.75)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Community Impact
                          </span>
                          <ThumbsUp style={{ width: '18px', height: '18px', color: '#0071e3' }} />
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>
                          {totalUpvotesEarned}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          Total community endorsements received
                        </p>
                      </div>

                      <div 
                        style={{
                          padding: '1.25rem',
                          borderRadius: '20px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.55)',
                          backdropFilter: 'blur(20px)',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.75)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Account Trust
                          </span>
                          <ShieldCheck style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: isUserBlocked ? '#e11d48' : '#059669', margin: 0 }}>
                          {isUserBlocked ? 'Restricted' : 'High Trust'}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          Verified citizen portal account
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* BLOCK / UNBLOCK CONFIRMATION MODAL */}
      {userToToggle && (
        <div
          onClick={() => setUserToToggle(null)}
          className="fixed inset-0 w-full h-full p-4 flex justify-center items-center transition-all duration-300"
          style={{
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-md rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center shadow-2xl border animate-scaleIn"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              color: isDark ? '#ffffff' : '#0f172a',
              boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner ${
              userToToggle.isBlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {userToToggle.isBlocked ? (
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              ) : (
                <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
              )}
            </div>

            <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-white mb-2">
              {userToToggle.isBlocked ? 'Unblock Citizen Account?' : 'Block Citizen Account?'}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6 leading-relaxed">
              {userToToggle.isBlocked
                ? `Are you sure you want to unblock ${userToToggle.name}? They will regain full access to sign in and post grievances.`
                : `Are you sure you want to block ${userToToggle.name}? When blocked, they will be prevented from logging in.`}
            </p>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => setUserToToggle(null)}
                className="px-5 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmToggle}
                className={`pill-button-dark py-2.5 px-6 text-xs text-white font-extrabold shadow-md cursor-pointer ${
                  userToToggle.isBlocked
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {userToToggle.isBlocked ? 'Confirm Unblock' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <div
          onClick={() => setUserToDelete(null)}
          className="fixed inset-0 w-full h-full p-4 flex justify-center items-center transition-all duration-300"
          style={{
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-md rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center shadow-2xl border animate-scaleIn"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              color: isDark ? '#ffffff' : '#0f172a',
              boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-inner">
              <Trash2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-white mb-2">
              Permanently Delete User?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6 leading-relaxed">
              Are you sure you want to delete <strong>{userToDelete.name}</strong> ({userToDelete.email})? This action will permanently remove their account from the system.
            </p>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-5 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="pill-button-dark py-2.5 px-6 text-xs text-white font-extrabold shadow-md cursor-pointer bg-rose-600 hover:bg-rose-700"
              >
                Permanently Delete 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatbotFAB />
    </div>
  );
};
