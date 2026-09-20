import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowLeft, Mail, FileText, Check } from 'lucide-react';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const AddDepartmentPage = () => {
  const navigate = useNavigate();
  const { theme } = useAuth();
  const { addDepartment } = useComplaints();

  const isDark = theme === 'dark';

  const [name, setName] = useState('');
const [code, setCode] = useState('');
const [email, setEmail] = useState('');
const [description, setDescription] = useState(''); 
  // Confirmation Card Modal State
  const [successData, setSuccessData] = useState(null); // { name, email, description }

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (name.trim() && email.trim()) {
  //     addDepartment(name, email, description);
  //     setSuccessData({ name, email, description });
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !name.trim() ||
    !code.trim() ||
    !email.trim() ||
    !description.trim()
  ) {
    return;
  }

  try {
    const created = await addDepartment(
      name.trim(),
      code.trim(),
      email.trim(),
      description.trim()
    );

    if (created) {
      setSuccessData({
        name: created.name || name.trim(),
        code: created.code || code.trim(),
        email: created.officialEmail || email.trim(),
        description: created.description || description.trim(),
      });
    }

  } catch (error) {
    console.error('Failed to create department:', error);
    alert('Failed to create department. Please try again.');
  }
};

  // const handleAddAnother = () => {
  //   setName('');
  //   setEmail('');
  //   setDescription('');
  //   setSuccessData(null);
  // };

const handleAddAnother = () => {
  setName('');
  setCode('');
  setEmail('');
  setDescription('');
  setSuccessData(null);
};

  return (
    <div className={`page-add-department min-h-screen flex flex-col justify-between transition-colors duration-300 ${
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
              onClick={() => navigate('/admin/departments')}
              className="flex items-center gap-2 py-2 px-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-serif font-extrabold shadow-sm hover:scale-105 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Departments</span>
            </button>

            <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-serif bg-blue-100 dark:bg-blue-900/60 px-3 py-1 rounded-full">
              🏛️ Create Body
            </span>
          </div>

          {/* PAGE TITLE */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg flex-shrink-0">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                Add Municipal Department
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                Register a new municipal authority, department code & contact details.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                Department Name :
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Roads & Bridges Division (PWD)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  borderColor: isDark ? '#475569' : '#cbd5e1',
                }}
                className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

                <div>
  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
    Department Code :
  </label>

  <input
    type="text"
    required
    placeholder="e.g. PWD, HEALTH, SANITATION"
    value={code}
    onChange={(e) => setCode(e.target.value.toUpperCase())}
    maxLength={32}
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#ffffff' : '#0f172a',
      borderColor: isDark ? '#475569' : '#cbd5e1',
    }}
    className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
  />
</div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                Official Department Email :
              </label>
              <input
                type="email"
                required
                placeholder="dept.email@mycomplaintportal.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  borderColor: isDark ? '#475569' : '#cbd5e1',
                }}
                className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                Jurisdiction & Operational Scope :
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe scope of civic responsibilities and geographical jurisdiction..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  borderColor: isDark ? '#475569' : '#cbd5e1',
                }}
                className="w-full p-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="pill-button-dark w-full justify-center py-3.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-xl mt-3 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Add Department</span>
            </button>
          </form>
        </div>
      </main>

      {/* CONFIRMATION CARD MODAL WITH BACKDROP BLUR (NO BROWSER ALERT) */}
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
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mb-1">
              Department Created!
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5">
              The new municipal authority has been added to the portal directory.
            </p>

            {/* DETAILS CARD BOX */}
            <div className={`w-full p-4 rounded-2xl border text-left mb-6 ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="text-sm font-extrabold font-serif text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{successData.name}</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>{successData.email}</span>
              </p>
              {successData.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  "{successData.description}"
                </p>
              )}
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
                onClick={() => navigate('/admin/departments')}
                className="pill-button-dark w-full sm:w-auto py-2.5 px-6 text-xs text-white font-extrabold bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Directory</span>
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
