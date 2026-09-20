import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Key, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApi } from '../../api/apiClient';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, theme } = useAuth();

  const isDark = theme === 'dark';

  // Read state passed from SignupPage or sessionStorage fallback
  const stateData = location.state || JSON.parse(sessionStorage.getItem('mcp_signup_pending') || '{}');

  const [email] = useState(stateData?.email || '');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // 60-Second Resend OTP Countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    setResendTimer(60);
    setIsResendDisabled(true);
    setErrorMessage('');
    try {
      const data = await authApi.sendOtp(email);
      setToastMessage(`A fresh 6-digit OTP code has been sent to ${email}!`);
    } catch (err) {
      setErrorMessage('Failed to resend OTP. Please try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otp || otp.length < 4) {
      setErrorMessage('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsVerifying(true);

    try {
      const data = await authApi.verifyOtp(email, otp);

      if (data.emailVerified === true || (data.message && data.message.toLowerCase().includes('successfully'))) {
        // OTP verified — now complete registration
        try {
          await signup(
            stateData?.name || 'Citizen User',
            email,
            stateData?.phone || '',
            stateData?.password || 'mysecretpassword'
          );
        } catch (signupErr) {
          // signup may fail if user was already created during sendOtp flow — that's OK
          console.warn('Signup call notice:', signupErr);
        }

        sessionStorage.removeItem('mcp_signup_pending');
        setToastMessage('✅ Email verified successfully! Redirecting...');
        setTimeout(() => navigate('/home'), 1200);
      } else {
        // OTP invalid or expired
        setIsVerifying(false);
        setErrorMessage(data.message || 'Invalid or expired OTP code. Please try again.');
      }
    } catch (err) {
      setIsVerifying(false);
      setErrorMessage(err.message || 'Verification failed. Please check your OTP and try again.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden pb-16 transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      {/* BACK BUTTON FIXED AT TOP LEFT CORNER OF SCREEN */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 9999 }}>
        <BackButton />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 pt-20 sm:pt-0">
        {/* Left Side Security Illustration */}
        <div className="md:col-span-5 hidden md:flex flex-col items-center justify-center text-center p-6">
          <div className="relative w-full max-w-xs mb-6">
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
              alt="Security Verification Lock"
              className="rounded-3xl shadow-2xl border-4 border-white/90 object-cover h-64 w-full"
            />
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              🛡️
            </div>
          </div>
          <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white">
            Email Security Verification
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold max-w-xs mt-1 leading-relaxed">
            Enter the 6-digit OTP code sent to your email to verify your account.
          </p>
        </div>

        {/* Right Side Form Card */}
        <div className={`md:col-span-7 p-6 sm:p-10 rounded-3xl shadow-2xl border ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
        }`}>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200/80 dark:border-slate-700">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                Verify Email OTP
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                OTP sent to <span className="text-blue-600 dark:text-blue-400 font-extrabold">{email}</span>
              </p>
            </div>
          </div>

          {/* INFO BANNER */}
          <div className="mb-5 p-3 px-4 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 flex items-center gap-3 shadow-inner">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
              Check your inbox at <strong className="text-blue-700 dark:text-blue-400">{email}</strong> for the 6-digit verification code.
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="mb-4 p-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 stroke-[2.5]" />
              <span className="text-xs text-rose-700 dark:text-rose-300 font-extrabold">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            {/* Email Field (read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-white font-serif">
                Registered Email:
              </label>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm opacity-70">
                <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400 stroke-[2.2] flex-shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  readOnly
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                  }}
                />
              </div>
            </div>

            {/* OTP Field */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-white font-serif">
                Enter 6-Digit Verification Code:
              </label>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 px-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 stroke-[2.2] flex-shrink-0" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter OTP from email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    letterSpacing: '0.2em',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
              <button
                type="button"
                disabled={isResendDisabled}
                onClick={handleResendOtp}
                className={`pill-button-dark text-xs font-extrabold px-4 py-2.5 rounded-full border transition-all flex items-center gap-1.5 ${
                  isResendDisabled
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-slate-700 hover:scale-105 cursor-pointer'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResendDisabled ? '' : 'animate-spin'}`} />
                {isResendDisabled ? `Resend OTP in ${resendTimer}s` : 'Resend OTP Now'}
              </button>

              <button
                type="submit"
                disabled={isVerifying}
                style={{
                  border: isDark ? '2px solid #ffffff' : '2px solid #0f172a',
                }}
                className="pill-button-dark flex-1 sm:flex-initial py-3 px-8 text-sm font-extrabold shadow-xl hover:scale-105 transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verify OTP & Register 🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SUCCESS TOAST MODAL */}
      {toastMessage && (
        <div
          onClick={() => setToastMessage(null)}
          className="compact-modal-overlay"
          style={{ zIndex: 6000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center justify-center py-6 px-8"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-inner">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-white mb-1">
              Email Verification
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-5">
              {toastMessage}
            </p>

            <button
              onClick={() => setToastMessage(null)}
              className="pill-button-dark py-2.5 px-7 text-xs text-white font-extrabold cursor-pointer"
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
