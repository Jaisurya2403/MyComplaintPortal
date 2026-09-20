import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, KeyRound, CheckCircle2, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { BackButton } from '../../components/common/BackButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApi } from '../../api/apiClient';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword) {
      setToastMessage({
        title: 'Old Password Required ⚠️',
        desc: 'Please enter your current existing password.',
        type: 'warning',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setToastMessage({
        title: 'Password Too Short ⚠️',
        desc: 'New password must be at least 6 characters long.',
        type: 'warning',
      });
      return;
    }

    if (newPassword === oldPassword) {
      setToastMessage({
        title: 'Invalid New Password ⚠️',
        desc: 'New password cannot be the same as your old password. Please choose a different password.',
        type: 'warning',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage({
        title: 'Password Mismatch ⚠️',
        desc: 'New Password and Confirm Password do not match. Please verify.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    const userEmail = user?.email || '717824p120@kce.ac.in';

    try {
      await authApi.changePassword(userEmail, oldPassword, newPassword);
      setToastMessage({
        title: 'Password Changed Successfully! 🎉',
        desc: 'Your existing password has been updated in the database. You can now use your new password.',
        type: 'success',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.warn('Change password error:', err);
      const errMsg = err?.message || 'Failed to update password. Please check your old password.';
      setToastMessage({
        title: 'Password Change Failed ⚠️',
        desc: errMsg,
        type: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-civic-gradient text-slate-900 transition-colors duration-300">
      <TopNavBar theme="civic" />

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full relative z-10">
        {/* Header Row */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              Change Password
            </h1>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Update your account password safely in the database
            </p>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="glass-civic p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/90">
          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            {/* Old Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 font-serif">
                Old Password (Current Password):
              </label>
              <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <KeyRound className="w-5 h-5 text-amber-600 stroke-[2.2] flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 focus:outline-none flex-shrink-0 cursor-pointer"
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
                    <EyeOff className="w-4.5 h-4.5 text-slate-500 hover:text-blue-600 stroke-[2.2]" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-slate-500 hover:text-blue-600 stroke-[2.2]" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 font-serif">
                New Password:
              </label>
              <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Lock className="w-5 h-5 text-blue-600 stroke-[2.2] flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 focus:outline-none flex-shrink-0 cursor-pointer"
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
                    <EyeOff className="w-4.5 h-4.5 text-slate-500 hover:text-blue-600 stroke-[2.2]" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-slate-500 hover:text-blue-600 stroke-[2.2]" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 font-serif">
                Confirm New Password:
              </label>
              <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Lock className="w-5 h-5 text-emerald-600 stroke-[2.2] flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 focus:outline-none flex-shrink-0 cursor-pointer"
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
                    <EyeOff className="w-4.5 h-4.5 text-slate-500 hover:text-blue-600 stroke-[2.2]" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-slate-500 hover:text-blue-600 stroke-[2.2]" />
                  )}
                </button>
              </div>
            </div>

            {/* Change Password Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
              className="pill-button-dark w-full justify-center py-3.5 shadow-xl text-sm font-extrabold mt-2 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              {loading ? 'Updating Database...' : 'Change Password ➔'}
            </button>
          </form>

          {/* Forgot Password Redirect Link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-200/80">
            <Link
              to="/forgot-password"
              className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline transition-colors inline-flex items-center gap-1"
            >
              Forgot Password? Click here to reset via OTP ➔
            </Link>
          </div>
        </div>
      </main>

      {/* TOAST CONFIRMATION MODAL */}
      {toastMessage && (
        <div
          onClick={handleCloseToast}
          className="compact-modal-overlay"
          style={{ zIndex: 6000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center justify-center py-6 px-8"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-inner ${
              toastMessage.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <AlertCircle className="w-6 h-6 stroke-[2.5]" />
              )}
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
              OK, Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
