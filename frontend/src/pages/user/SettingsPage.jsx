import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Moon, Sun, Lock, HelpCircle, ArrowRight, ShieldCheck, Bell, User, CheckCircle2 } from 'lucide-react';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { BackButton } from '../../components/common/BackButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const settingsList = [
    {
      id: 'theme',
      title: 'Appearance & Theme',
      desc: isDark ? 'Current Theme: High-Contrast Dark Mode' : 'Current Theme: Crisp Civic Light Mode',
      type: 'toggle',
      icon: isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />,
      action: toggleTheme,
    },
    {
      id: 'password',
      title: 'Change Password & Security',
      desc: 'Update account password using your current password',
      type: 'link',
      to: '/change-password',
      icon: <Lock className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'support',
      title: 'Help & Municipal Support',
      desc: 'Contact municipal helpline, view FAQs & portal guidelines',
      type: 'link',
      to: '/about',
      icon: <HelpCircle className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const filteredSettings = settingsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-civic-gradient text-slate-900 transition-colors duration-300">
      <TopNavBar theme="civic" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 sm:pt-32 pb-32 sm:pb-24 flex-1 w-full relative z-10">
        {/* Header Row */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              Portal Settings
            </h1>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Customize your portal preferences, theme appearance, and security
            </p>
          </div>
        </div>

        {/* ULTRA-PROFESSIONAL SEAMLESS SEARCH BAR */}
        <div
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
            borderRadius: '9999px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
          }}
          className="p-3 px-5 mb-8 flex items-center gap-3 transition-all focus-within:border-blue-500"
        >
          <Search className="w-5 h-5 text-slate-400 stroke-[2.2] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search settings (e.g. theme, password, dark mode, support)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              boxShadow: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              color: isDark ? '#ffffff' : '#0f172a',
              fontSize: '0.875rem',
              fontWeight: '700',
              width: '100%',
              padding: '0',
              margin: '0',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200 font-extrabold px-2 py-1 rounded-full hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* SETTINGS CARDS CONTAINER */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col gap-4 ${
          isDark ? 'bg-slate-800/80 border-slate-700/80' : 'glass-civic border-white/90'
        }`}>
          {filteredSettings.length > 0 ? (
            filteredSettings.map((item) => (
              <div key={item.id}>
                {item.type === 'toggle' ? (
                  <div className={`flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                    isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm ${
                        isDark ? 'bg-slate-800 text-blue-400' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold font-serif text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* ULTRA-PROFESSIONAL MODERN SLIDING TOGGLE SWITCH */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-serif font-extrabold text-slate-900 dark:text-white hidden sm:inline-block">
                        {isDark ? 'Dark Theme' : 'Light Theme'}
                      </span>
                      <button
                        type="button"
                        onClick={item.action}
                        style={{
                          backgroundColor: isDark ? '#2563eb' : '#cbd5e1',
                          width: '4.25rem',
                          height: '2.25rem',
                          borderRadius: '9999px',
                          padding: '0.25rem',
                          position: 'relative',
                          cursor: 'pointer',
                          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)',
                          transition: 'background-color 0.3s ease',
                          border: 'none',
                        }}
                        title="Toggle Dark / Light Theme"
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '1.75rem',
                            height: '1.75rem',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            color: isDark ? '#2563eb' : '#d97706',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                            transform: isDark ? 'translateX(2rem)' : 'translateX(0rem)',
                            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        >
                          {isDark ? (
                            <Moon className="w-4 h-4 stroke-[2.2] text-blue-600" />
                          ) : (
                            <Sun className="w-4 h-4 stroke-[2.2] text-amber-500" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.to}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-700 hover:bg-slate-900'
                        : 'bg-white/90 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm ${
                        isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold font-serif text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm font-bold text-slate-500">No settings match your search term.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
