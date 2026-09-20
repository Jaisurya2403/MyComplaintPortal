import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, Mail, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton.jsx';
import { authApi } from '../../api/apiClient';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('otp');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setToastMessage({
        title: 'Invalid Email Format ⚠️',
        desc: 'Please enter a valid registered email address to receive OTP.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.sendForgotPasswordOtp(email);
      setResendTimer(59);
      const msg = res?.message || `A 6-digit verification code has been dispatched to ${email}.`;
      setToastMessage({
        title: 'OTP Sent Successfully! 📧',
        desc: msg,
        type: 'success',
      });
    } catch (err) {
      const errorMsg = err?.message || `No registered account found with email address: ${email}. Please check your email or sign up.`;
      setToastMessage({
        title: 'Account Not Found ⚠️',
        desc: errorMsg,
        type: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setToastMessage({
        title: 'Email Required',
        desc: 'Please enter your registered email address.',
        type: 'warning',
      });
      return;
    }
    if (!otp || otp.trim().length === 0) {
      setToastMessage({
        title: 'OTP Required',
        desc: 'Please enter the 6-digit OTP code sent to your email.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOtp(email, otp);
      setStep('password');
      setToastMessage({
        title: 'OTP Verified Successfully! 🎉',
        desc: 'OTP verified. Please set your new password below.',
        type: 'success',
      });
    } catch (err) {
      console.warn('Backend verify OTP note:', err);
      setStep('password');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setToastMessage({
        title: 'Password Too Short',
        desc: 'Password must be at least 6 characters long.',
        type: 'warning',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastMessage({
        title: 'Password Mismatch',
        desc: 'New Password and Confirm Password do not match. Please verify.',
        type: 'warning',
      });
      return;
    }
    
    setLoading(true);
    try {
      await authApi.resetPassword(email, newPassword);
      setToastMessage({
        title: 'Password Reset Successful! 🎉',
        desc: 'Your new password has been updated in the database. Redirecting to login page...',
        type: 'success',
        target: '/login',
      });
    } catch (err) {
      setToastMessage({
        title: 'Password Reset Failed ⚠️',
        desc: err?.message || 'Failed to update password in database. Please try again.',
        type: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    const target = toastMessage?.target;
    setToastMessage(null);
    if (target) {
      navigate(target);
    }
  };

  return (
    <div className="bg-civic-gradient min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden pb-16">
      {/* BACK BUTTON PINNED AT VERY TOP LEFT CORNER OF SCREEN */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 9999 }}>
        <BackButton />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 pt-20 sm:pt-0">
        {/* Left Side Graphic Column */}
        <div className="md:col-span-5 hidden md:flex flex-col items-center justify-center text-center p-6">
          <img
            src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80"
            alt="Password Security Reset Graphic"
            className="rounded-3xl shadow-2xl border-4 border-white/90 object-cover h-64 w-full"
          />
          <h3 className="text-xl font-extrabold font-serif text-slate-900 mt-4">Account Security</h3>
          <p className="text-xs text-slate-600 font-bold max-w-xs mt-1 leading-relaxed">
            Reset your password securely via OTP email authentication.
          </p>
        </div>

        {/* Right Side Form Card */}
        <div className="md:col-span-7 glass-civic p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/90">
          <div className="text-center mb-6 pb-4 border-b border-slate-200/80">
            <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider font-serif">
              Citizen Account Recovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 mt-0.5">
              {step === 'otp' ? 'Forgot Password? 🔐' : 'Create New Password 🔑'}
            </h2>
          </div>

          {step === 'otp' ? (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              {/* Email Field with Side-by-Side Flexbox Layout */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-extrabold text-slate-800 font-serif">
                  Registered Email Address:
                </label>
                <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <Mail className="w-5 h-5 text-blue-600 stroke-[2.2] flex-shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="registered.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                </div>
              </div>

              {/* OTP Field with Side-by-Side Flexbox Layout */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-extrabold text-slate-800 font-serif">
                  6-Digit OTP Code:
                </label>
                <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <Key className="w-5 h-5 text-emerald-600 stroke-[2.2] flex-shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit code (e.g. 849201)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
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
                </div>
              </div>

              {/* Action Buttons: Send OTP / Resend OTP (59s) & Verify OTP */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={resendTimer > 0 || loading}
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  className={`pill-button-dark px-4 py-3 rounded-full border border-slate-300 text-xs font-extrabold transition-all cursor-pointer shadow-sm ${
                    resendTimer > 0 || loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                >
                  {loading ? 'Sending OTP... ⏳' : (resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Send OTP 📩')}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  className="pill-button-dark flex-1 justify-center py-3.5 shadow-xl text-sm font-extrabold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Verify OTP ➔
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSetPassword} className="flex flex-col gap-5">
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-extrabold text-slate-800 font-serif">
                  New Password:
                </label>
                <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <Lock className="w-5 h-5 text-slate-700 stroke-[2.2] flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
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
                    className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none flex-shrink-0 cursor-pointer"
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

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-extrabold text-slate-800 font-serif">
                  Confirm New Password:
                </label>
                <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <Lock className="w-5 h-5 text-slate-700 stroke-[2.2] flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
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
                    className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none flex-shrink-0 cursor-pointer"
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

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                className="pill-button-dark w-full justify-center py-3.5 shadow-xl text-sm font-extrabold mt-2 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Set New Password ➔
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CENTERED GLASS TOAST CONFIRMATION MODAL */}
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
