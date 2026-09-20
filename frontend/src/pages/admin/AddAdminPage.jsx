import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ArrowLeft, Mail, User, Shield, Check, Eye, EyeOff } from 'lucide-react';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const AddAdminPage = () => {
  const navigate = useNavigate();
  const { theme } = useAuth();
  const { addAdmin } = useComplaints();

  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [grantLevel, setGrantLevel] = useState('Department Admin');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation Card Modal State
  const [successData, setSuccessData] = useState(null); // { username, email, grantLevel }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (username.trim() && email.trim()) {
      setIsSubmitting(true);
      try {
        await addAdmin(username, email, grantLevel, password);
        setSuccessData({ username, email, grantLevel });
      } catch (err) {
        console.error('Admin creation error:', err);
        setErrorMessage(err.message || 'Failed to create admin account. This email address is already registered in database.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddAnother = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setGrantLevel('Department Admin');
    setErrorMessage('');
    setSuccessData(null);
  };

  return (
    <div className={`page-add-admin min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      <TopNavBar theme={isDark ? 'dark' : 'civic'} />

      {/* CENTERED MAIN FORM CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full flex flex-col items-center justify-center relative z-10">
        <div className={`w-full max-w-2xl p-6 sm:p-10 rounded-3xl border shadow-2xl transition-all duration-300 animate-fadeIn ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
        }`}>
          {/* TOP-LEFT BACK BUTTON */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigate('/admin/admins')}
              className="flex items-center gap-2 py-2 px-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-serif font-extrabold shadow-sm hover:scale-105 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Admins</span>
            </button>

            <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-serif bg-amber-100 dark:bg-amber-900/60 px-3 py-1 rounded-full">
              🛡️ Executive Access
            </span>
          </div>

          {/* PAGE TITLE */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-lg flex-shrink-0">
              <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                Add Administrator Account
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                Grant staff permissions, executive role clearance & admin credentials.
              </p>
            </div>
          </div>

          {/* ERROR ALERT BANNER */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs font-serif font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-3 animate-fadeIn shadow-sm">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                Username / Full Name :
              </label>
              <input
                type="text"
                required
                placeholder="e.g. officer_karthik"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  borderColor: isDark ? '#475569' : '#cbd5e1',
                }}
                className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                Official Staff Email :
              </label>
              <input
                type="email"
                required
                placeholder="admin.karthik@coimbatore.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  borderColor: isDark ? '#475569' : '#cbd5e1',
                }}
                className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                Temporary Password :
              </label>
              <div 
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: isDark ? '#475569' : '#cbd5e1',
                }}
                className="flex items-center gap-2 p-3 px-4 rounded-2xl border shadow-sm focus-within:ring-2 focus-within:ring-amber-500 transition-all"
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none flex-shrink-0 cursor-pointer"
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    margin: '0',
                  }}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400 hover:text-amber-600 stroke-[2.2]" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400 hover:text-amber-600 stroke-[2.2]" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                Grant Level / Permission Role :
              </label>
              <select
                value={grantLevel}
                onChange={(e) => setGrantLevel(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  borderColor: isDark ? '#475569' : '#cbd5e1',
                }}
                className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
              >
                <option value="Department Admin">Department Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="pill-button-dark w-full justify-center py-3.5 text-sm bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-xl mt-3 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>{isSubmitting ? 'Verifying & Creating...' : 'Create Administrator Account'}</span>
            </button>
          </form>
        </div>
      </main>

      {/* CONFIRMATION CARD MODAL WITH BACKDROP BLUR */}
      {successData && (
        <div
          className="fixed inset-0 w-full h-full flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn"
          style={{
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div
            className="my-auto w-full max-w-md rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center shadow-2xl border animate-scaleIn"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              color: isDark ? '#ffffff' : '#0f172a',
              boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* SUCCESS ICON */}
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mb-1">
              Admin Account Created!
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5">
              The administrator account has been granted clearance.
            </p>

            {/* DETAILS CARD BOX */}
            <div className={`w-full p-4 rounded-2xl border text-left mb-6 ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="text-sm font-extrabold font-serif text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{successData.username}</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>{successData.email}</span>
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-extrabold flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <Shield className="w-3.5 h-3.5" />
                <span>Grant Level: {successData.grantLevel}</span>
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={handleAddAnother}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Add Another
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/admins')}
                className="pill-button-dark w-full sm:w-auto py-2.5 px-6 text-xs text-white font-extrabold bg-amber-600 hover:bg-amber-700 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Admins Directory</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatbotFAB />
    </div>
  );
};
