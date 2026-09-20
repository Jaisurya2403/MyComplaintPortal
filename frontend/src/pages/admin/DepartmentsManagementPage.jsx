import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Building2, ChevronRight, X, Edit3, Trash2, AlertTriangle, CheckCircle2, Save } from 'lucide-react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const DepartmentsManagementPage = () => {
  const { theme } = useAuth();
  const { departments, updateDepartment, deleteDepartment, complaints = [] } = useComplaints();
  const [searchQuery, setSearchQuery] = useState('');

  // Manage Department Modal State
  const [managingDept, setManagingDept] = useState(null); // department object
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCode, setEditCode] = useState('');

  // Delete Confirmation State
  const [deptToDelete, setDeptToDelete] = useState(null); // department object

  const isDark = theme === 'dark';

  const filteredDepts = departments.filter((d) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      (d.name || '').toLowerCase().includes(query) ||
      (d.code || '').toLowerCase().includes(query) ||
      (d.officialEmail || '').toLowerCase().includes(query) ||
      (d.description || '').toLowerCase().includes(query)
    );
  });

  const getAssignedCount = (dept) => {
    if (!complaints || complaints.length === 0) return 0;
    return complaints.filter((c) => {
      if (!c) return false;
      const matchId = c.departmentId && String(c.departmentId).toLowerCase() === String(dept.id).toLowerCase();
      const matchCode = c.departmentId && dept.code && String(c.departmentId).toLowerCase() === String(dept.code).toLowerCase();
      const matchName = c.departmentName && dept.name && (
        c.departmentName.toLowerCase().includes(dept.name.toLowerCase()) ||
        dept.name.toLowerCase().includes(c.departmentName.toLowerCase())
      );
      return matchId || matchCode || matchName;
    }).length;
  };

  const handleStartManage = (dept) => {
    console.log("Selected department:", dept);
    setManagingDept(dept);
    setEditName(dept.name || '');
    setEditEmail(dept.officialEmail || '');
    setEditCode(dept.code || '');
    setIsEditing(false);
  };

  // const handleSaveEdit = (e) => {
  //   e.preventDefault();
  //   if (managingDept && editName.trim()) {
  //     updateDepartment(managingDept.id, {
  //       name: editName,
  //       contactEmail: editEmail,
  //       email: editEmail,
  //       code: editCode,
  //     });
  //     setIsEditing(false);
  //     setManagingDept(null);
  //   }
  // };
  const handleSaveEdit = async (e) => {
  e.preventDefault();

  if (!managingDept || !editName.trim() || !editCode.trim() || !editEmail.trim()) {
    return;
  }

  try {
    await updateDepartment(managingDept.id, {
      name: editName.trim(),
      code: editCode.trim().toUpperCase(),
      officialEmail: editEmail.trim(),
      description: managingDept.description || "",
    });

    setIsEditing(false);
    setManagingDept(null);

  } catch (error) {
    console.error("Department update failed:", error);
    alert("Failed to update department.");
  }
};

  const handleConfirmDelete = () => {
    if (deptToDelete) {
      deleteDepartment(deptToDelete.id);
      setDeptToDelete(null);
      setManagingDept(null);
    }
  };

  return (
    <div className={`page-admin-departments min-h-screen flex flex-col justify-between transition-colors duration-300 ${
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
              <span className="text-[11px] font-extrabold text-sky-700 dark:text-sky-400 uppercase tracking-wider font-serif bg-sky-100 dark:bg-sky-900/60 px-3.5 py-1 rounded-full shadow-sm">
                🏛️ Municipal Bodies & Authorities
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-2">
                Departments Directory
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                Manage active municipal bodies, modify department details, or delete authority profiles.
              </p>
            </div>

            <Link
              to="/admin/departments/new"
              className="pill-button-dark text-xs py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 flex-shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /> Add Department
            </Link>
          </div>

          {/* ULTRA-PROFESSIONAL SEAMLESS SEARCH BAR */}
          <div 
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-full border shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all mb-6"
          >
            <Search className="w-4 h-4 text-sky-600 dark:text-sky-400 stroke-[2.2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search active municipal departments by name..."
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

          {/* Department Cards List with Pixel-Perfect Alignment */}
          <div className="flex flex-col gap-4">
            {filteredDepts.map((dept, idx) => (
              <div
                key={dept.id}
                onClick={() => handleStartManage(dept)}
                style={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                }}
                className="p-6 rounded-3xl border shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-slate-400 font-serif min-w-[20px] flex-shrink-0">
                      {idx + 1}.
                    </span>
                    <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shadow-sm flex-shrink-0">
                      <Building2 className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-serif truncate">
                        {dept.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate mt-0.5">
                        Code: {dept.code || `DEPT-0${idx + 1}`} • Contact: {dept.officialEmail || 'No email configured'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 flex-shrink-0">
                    Active Body
                  </span>
                </div>

                <div className="pt-3 border-t cursor-pointer border-slate-100 dark:border-slate-800/80 flex items-center  justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Assigned Grievances: <strong className="font-extrabold text-slate-900 dark:text-white">{getAssignedCount(dept)}</strong>
                  </span>
                  <div className="flex pill-button-dark items-center  gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
                    <span>Manage Department</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MANAGE DEPARTMENT ACTION MODAL (MODIFY OR DELETE ACCESS) */}
      {managingDept && (
        <div
          onClick={() => setManagingDept(null)}
          className="fixed inset-0 w-full h-full flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn"
          style={{
            zIndex: 99999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all animate-scaleIn relative"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
              color: isDark ? '#ffffff' : '#0f172a',
            }}
          >
            {/* CLEAN MODAL HEADER ROW WITH CLOSE BUTTON ON FAR RIGHT */}
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold flex-shrink-0">
                  <Building2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-serif bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full">
                    Department Settings
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold font-serif text-slate-900 dark:text-white mt-0.5 truncate max-w-[240px]">
                    Manage {managingDept.name}
                  </h3>
                </div>
              </div>

              {/* CLEAN TOP-RIGHT CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setManagingDept(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors flex-shrink-0 cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* EDIT FORM MODE VS OPTION BUTTONS */}
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 mt-2">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                    Department Title :
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
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
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                    }}
                    className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                    Official Contact Email :
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                    }}
                    className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pill-button-dark py-2.5 px-6 text-xs bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Modifications
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-2">
                  Select an action to modify department configuration or delete this municipal authority:
                </p>

                {/* OPTION 1: MODIFY DETAILS */}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-4 rounded-2xl border flex items-center justify-between gap-3 hover:scale-[1.01] transition-all cursor-pointer shadow-sm text-left group"
                  style={{
                    backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                    borderColor: isDark ? '#475569' : '#e2e8f0',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-serif">
                        Modify Department Details
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        Edit department title, code, or contact email.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* OPTION 2: DELETE DEPARTMENT */}
                <button
                  type="button"
                  onClick={() => setDeptToDelete(managingDept)}
                  className="p-4 rounded-2xl border flex items-center justify-between gap-3 hover:scale-[1.01] transition-all cursor-pointer shadow-sm text-left group"
                  style={{
                    backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                    borderColor: isDark ? '#475569' : '#e2e8f0',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-rose-700 dark:text-rose-400 font-serif">
                        Delete Department Body
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        Permanently remove this authority profile from portal.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL WITH BACKDROP BLUR */}
      {deptToDelete && (
        <div
          onClick={() => setDeptToDelete(null)}
          className="fixed inset-0 w-full h-full flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn"
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
              borderColor: isDark ? '#334155' : '#cbd5e1',
              color: isDark ? '#ffffff' : '#0f172a',
              boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 shadow-inner">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-white mb-2">
              Delete Department Body?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-extrabold text-slate-900 dark:text-white">"{deptToDelete.name}"</span>? This action cannot be undone and will unassign active grievances.
            </p>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeptToDelete(null)}
                className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="pill-button-dark py-2.5 px-6 text-xs text-white font-extrabold bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatbotFAB />
    </div>
  );
};
