import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/home';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedInRole = await login(email.trim(), password);
      if (loggedInRole === 'SUPER_ADMIN' || loggedInRole === 'DEPARTMENT_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-login bg-civic-gradient min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden pb-16">
      {/* BACK BUTTON PINNED AT VERY TOP LEFT CORNER OF SCREEN */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 9999 }}>
        <BackButton />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 pt-20 sm:pt-0">
        {/* Left Side Graphic Column */}
        <div className="md:col-span-5 hidden md:flex flex-col items-center justify-center text-center p-6">
          <div className="relative w-full max-w-xs mb-6">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
              alt="Citizen Waving Graphic"
              className="rounded-3xl shadow-2xl border-4 border-white/90 object-cover h-64 w-full"
            />
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              ✨
            </div>
            <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-lg">
              🏛️
            </div>
          </div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-900 mb-2">MyComplaintPortal</h2>
          <p className="text-xs text-slate-600 font-semibold max-w-xs leading-relaxed">
            Transparent, swift civic grievance redressal and municipal tracking for all citizens.
          </p>
        </div>

        {/* Right Side Form Card */}
        <div className="md:col-span-7 glass-civic p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/90">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider font-serif">
                {isAdminMode ? 'Administrator Authentication' : 'Citizen Portal Access'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 mt-0.5">
                {isAdminMode ? 'Admin Sign In' : 'Welcome Back! 👋'}
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-1">
                {isAdminMode ? 'Staff credentials required' : 'Enter your details to sign in'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
              {isAdminMode ? <ShieldAlert className="w-6 h-6 text-amber-400" /> : <User className="w-6 h-6 text-blue-400" />}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-extrabold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field with Side-by-Side Flexbox Layout */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 font-serif">
                Email Address:
              </label>
              <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Mail className="w-5 h-5 text-blue-600 stroke-[2.2] flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder={isAdminMode ? 'admin@mycomplaintportal.gov.in' : 'citizen@example.com'}
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

            {/* Password Field with Side-by-Side Flexbox Layout */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-extrabold text-slate-800 font-serif">
                Password:
              </label>
              <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-full border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Lock className="w-5 h-5 text-slate-600 stroke-[2.2] flex-shrink-0" />
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

            <div className="flex justify-end my-1">
              <Link to="/forgot-password" className="text-xs font-extrabold text-blue-700 hover:text-blue-900 hover:underline transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
              className="pill-button-dark w-full justify-center py-3.5 shadow-xl text-sm font-extrabold mt-1 hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In ➔'}
            </button>

            <div className="text-center mt-4 pt-4 border-t border-slate-200/80 flex flex-col gap-2.5">
              <p className="text-xs text-slate-700 font-bold">
                New to the portal?{' '}
                <Link to="/signup" className="font-extrabold text-blue-700 underline hover:text-blue-900">
                  Create an Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
