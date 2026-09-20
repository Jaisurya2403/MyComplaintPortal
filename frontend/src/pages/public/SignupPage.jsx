import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Lock, Mail, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApi } from '../../api/apiClient';

export const SignupPage = () => {
  const { signup, theme } = useAuth();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [validationWarning, setValidationWarning] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setValidationWarning('Passwords do not match. Please verify your password entry.');
      return;
    }
    if (!acceptedTerms) {
      setValidationWarning('Please accept the Terms & Conditions to create your citizen account.');
      return;
    }

    const targetEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`;
    setIsSubmitting(true);

    try {
      const data = await authApi.sendOtp(targetEmail);

      if (data.message && data.message.includes('already registered')) {
        setValidationWarning('Email address is already registered. Please login instead.');
        setIsSubmitting(false);
        return;
      }

      const pendingSignupPayload = {
        name,
        email: targetEmail,
        phone,
        password,
      };

      sessionStorage.setItem('mcp_signup_pending', JSON.stringify(pendingSignupPayload));

      // Navigate to email OTP verification page
      navigate('/verify-email', {
        state: pendingSignupPayload,
      });
    } catch (err) {
      setValidationWarning(err.message || 'This email address is already registered. 1 email can only belong to 1 user or admin account.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`page-signup min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden pb-16 transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-civic-gradient text-slate-900'
    }`}>
      {/* BACK BUTTON PINNED AT VERY TOP LEFT CORNER OF SCREEN */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 9999 }}>
        <BackButton />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 pt-20 sm:pt-0">
        {/* Left Side Graphic */}
        <div className="md:col-span-5 hidden md:flex flex-col items-center justify-center text-center p-6">
          
          
        </div>

        {/* Right Side Form Card */}
        <div className={`md:col-span-7 p-6 sm:p-10 rounded-3xl shadow-2xl border ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
        }`}>
          <div className="text-center mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-serif">
              New Citizen Registration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-0.5">
              Create Your Account 🚀
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              A 6-digit OTP will be sent to your email for verification
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-white font-serif">
                Full Name:
              </label>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <User className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[2.2] flex-shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-white font-serif">
                Email Address (OTP will be sent here):
              </label>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 stroke-[2.2] flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="citizen@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-white font-serif">
                Phone Number:
              </label>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] flex-shrink-0" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-white font-serif">
                  Password:
                </label>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <Lock className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[2.2] flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      <EyeOff className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 stroke-[2.2]" />
                    ) : (
                      <Eye className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 stroke-[2.2]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-white font-serif">
                  Confirm Password:
                </label>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <Lock className="w-5 h-5 text-slate-700 dark:text-slate-300 stroke-[2.2] flex-shrink-0" />
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
                      color: isDark ? '#ffffff' : '#0f172a',
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
                      <EyeOff className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 stroke-[2.2]" />
                    ) : (
                      <Eye className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 stroke-[2.2]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2.5 my-2 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="terms"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-800 dark:text-slate-200 font-bold cursor-pointer">
                I accept the <span className="font-extrabold text-blue-600 dark:text-blue-400 underline">Terms & Conditions</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                border: isDark ? '2px solid #ffffff' : '2px solid #0f172a',
                opacity: isSubmitting ? 0.8 : 1,
              }}
              className="pill-button-dark w-full justify-center py-3.5 shadow-xl text-sm font-extrabold hover:scale-[1.02] transition-transform cursor-pointer flex items-center gap-2"
             >
              <span>{isSubmitting ? 'sending otp ->' : 'Send OTP to Email 📧'}</span> {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center text-xs text-slate-700 dark:text-slate-300 font-bold mt-2">
              Already registered?{' '}
              <Link to="/login" className="font-extrabold text-blue-600 dark:text-blue-400 underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* CENTERED GLASS TOAST VALIDATION MODAL */}
      {validationWarning && (
        <div
          onClick={() => setValidationWarning(null)}
          className="compact-modal-overlay"
          style={{ zIndex: 6000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="compact-modal-card text-center flex flex-col items-center justify-center py-6 px-8"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-extrabold font-serif text-slate-900 mb-1">
              Account Registration Notice
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-5">
              {validationWarning}
            </p>

            
              <Link to="/login" ><button
              onClick={() => setValidationWarning(null)}
              className="pill-button-dark py-2.5 px-7 text-xs text-white font-extrabold cursor-pointer"
            >
                OK, Got It</button>
              </Link>
              
            
          </div>
        </div>
      )}
    </div>
  );
};
