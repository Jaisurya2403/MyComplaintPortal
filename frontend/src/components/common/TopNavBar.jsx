import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, Menu, X, FileText, Info, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const TopNavBar = ({ theme = 'civic' }) => {
  const { user, isAuthenticated, logout, theme: currentTheme } = useAuth();
  const { activePincode, setActivePincode } = useComplaints();
  const [pincodeInput, setPincodeInput] = useState(activePincode || '641004');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isDark = currentTheme === 'dark';

  const handleSearch = (e) => {
    e.preventDefault();
    if (pincodeInput.trim()) {
      setActivePincode(pincodeInput.trim());
      setMobileMenuOpen(false);
      navigate(`/posts?pincode=${encodeURIComponent(pincodeInput.trim())}`);
    }
  };

  return (
    <div className="navbar-fixed-wrapper">
      <header className="figma-nav-pill">
        {/* Brand Logo (Navigates directly to /home) */}
        <Link to="/home" className="flex flex-col group flex-shrink-0" title="Go to Home">
          <div className="flex items-baseline">
            <span className="logo-my">My</span>
            <span className="logo-complaint">COMPLAINT</span>
          </div>
          <span className="logo-portal">PORTAL</span>
        </Link>

        {/* Desktop View: Center Pincode Search Bar & Right Nav Group */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-8">
          {/* Center Pincode Search Bar */}
          <form onSubmit={handleSearch} className="figma-search-container mx-auto">
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              className="figma-pincode-input"
            />
            <button type="submit" className="figma-search-circle-btn" title="Search Pincode">
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
          </form>

          {/* Right Nav Group */}
          <div className="nav-right-group relative">
            <Link to="/home" className="nav-link-serif flex items-center gap-1">
              <Home className="w-4 h-4 text-blue-600" /> Home
            </Link>
            <Link to="/posts" className="nav-link-serif">
              View Post
            </Link>
            <Link to="/about" className="nav-link-serif">
              About
            </Link>

            {isAuthenticated ? (
              <>
                {/* Circular Avatar Button */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="avatar-circle-btn overflow-hidden p-0 flex items-center justify-center cursor-pointer shadow-md"
                  title="User Menu"
                >
                  {user?.profileImage || user?.profileImageUrl ? (
                    <img
                      src={user.profileImage || user.profileImageUrl}
                      alt={user.name || 'User Avatar'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  ) : user?.name ? (
                    <span className="font-serif font-extrabold text-base uppercase text-slate-900 dark:text-white">{user.name.charAt(0)}</span>
                  ) : (
                    <span className="font-serif font-extrabold text-base uppercase text-slate-900 dark:text-white">U</span>
                  )}
                </button>

                {/* Desktop Frosted Glass Dropdown */}
                {showDropdown && (
                  <div className="figma-avatar-dropdown">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/home');
                      }}
                      className="dropdown-item-serif flex items-center gap-2"
                    >
                      <Home className="w-4 h-4 text-blue-600" /> Home Feed
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/dashboard/profile');
                      }}
                      className="dropdown-item-serif"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/settings');
                      }}
                      className="dropdown-item-serif"
                    >
                      Settings
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                        navigate('/login');
                      }}
                      className="dropdown-item-serif text-rose-600 font-bold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="pill-button-dark py-2 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>

        {/* Mobile View: Small Height Navbar Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2.2]" /> : <Menu className="w-6 h-6 stroke-[2.2]" />}
          </button>
        </div>

        {/* Mobile Slide-Down Frosted Glass Drawer Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer md:hidden">
            {/* Mobile Pincode Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Enter Pincode"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  border: isDark ? '1px solid #475569' : '1px solid #cbd5e1',
                }}
                className="pill-input text-sm w-full font-serif"
              />
              <button
                type="submit"
                style={{
                  backgroundColor: isDark ? '#2563eb' : '#0f172a',
                  color: '#ffffff',
                }}
                className="pill-button-dark py-2.5 px-4 text-xs font-serif flex-shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </form>

            <hr className={`my-1 ${isDark ? 'border-slate-700/80' : 'border-slate-300/80'}`} />

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2">
              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isDark ? '#ffffff' : '#0f172a', background: 'transparent' }}
                className="flex items-center gap-3 text-base font-serif font-extrabold transition-colors py-2 px-3 rounded-xl hover:bg-blue-600/10"
              >
                <Home className="w-5 h-5 text-blue-500 stroke-[2.2]" /> Home
              </Link>

              <Link
                to="/posts"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isDark ? '#ffffff' : '#0f172a', background: 'transparent' }}
                className="flex items-center gap-3 text-base font-serif font-extrabold transition-colors py-2 px-3 rounded-xl hover:bg-blue-600/10"
              >
                <FileText className="w-5 h-5 text-blue-500 stroke-[2.2]" /> View Posts
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: isDark ? '#ffffff' : '#0f172a', background: 'transparent' }}
                className="flex items-center gap-3 text-base font-serif font-extrabold transition-colors py-2 px-3 rounded-xl hover:bg-blue-600/10"
              >
                <Info className="w-5 h-5 text-purple-400 stroke-[2.2]" /> About & Support
              </Link>

              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard/profile');
                    }}
                    style={{ color: isDark ? '#ffffff' : '#0f172a', background: 'transparent', border: 'none' }}
                    className="flex items-center gap-3 text-base font-serif font-extrabold text-left transition-colors py-2 px-3 rounded-xl hover:bg-blue-600/10 cursor-pointer"
                  >
                    <UserIcon className="w-5 h-5 text-emerald-400 stroke-[2.2]" /> Profile ({user?.name || 'User'})
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/settings');
                    }}
                    style={{ color: isDark ? '#ffffff' : '#0f172a', background: 'transparent', border: 'none' }}
                    className="flex items-center gap-3 text-base font-serif font-extrabold text-left transition-colors py-2 px-3 rounded-xl hover:bg-blue-600/10 cursor-pointer"
                  >
                    <Settings className="w-5 h-5 text-slate-400 stroke-[2.2]" /> Settings
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAuthenticated) {
                    logout();
                    navigate('/login');
                  } else {
                    navigate('/login');
                  }
                }}
                style={{ color: isDark ? '#fb7185' : '#e11d48', background: 'transparent', border: 'none' }}
                className={`flex items-center gap-3 text-base font-serif font-extrabold text-left transition-colors py-2.5 px-3 rounded-xl hover:bg-rose-500/10 cursor-pointer border-t ${
                  isDark ? 'border-slate-700/80' : 'border-slate-300/80'
                } pt-3 mt-1`}
              >
                <LogOut className="w-5 h-5 text-rose-500 stroke-[2.2]" /> {isAuthenticated ? 'Logout' : 'Login'}
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
