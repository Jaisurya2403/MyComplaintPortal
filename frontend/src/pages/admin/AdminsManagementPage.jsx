import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ShieldAlert, ChevronRight, X, Edit3, Trash2, AlertTriangle, CheckCircle2, Save, Shield, Lock, Building2, UserCheck } from 'lucide-react';
import { SidebarMenu } from '../../components/common/SidebarMenu.jsx';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminsManagementPage = () => {
  const { theme, user } = useAuth();
  const { admins, updateAdmin, deleteAdmin, departments = [] } = useComplaints();
  const [searchQuery, setSearchQuery] = useState('');

  // Manage Admin Modal State
  const [managingAdmin, setManagingAdmin] = useState(null); // admin object
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('Department Admin');
  const [editDeptId, setEditDeptId] = useState('');

  // Delete/Revoke Confirmation State
  const [adminToDelete, setAdminToDelete] = useState(null); // admin object

  const isDark = theme === 'dark';

  const filteredAdmins = admins.filter((a) => {
    const nameStr = (a.username || a.name || 'Admin').toLowerCase();
    const emailStr = (a.email || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return nameStr.includes(q) || emailStr.includes(q);
  });

  const isCurrentUserSuperAdmin = 
    user?.role === 'SUPER_ADMIN' || 
    user?.grantLevel === 'Super Admin' || 
    user?.email?.toLowerCase() === 'jaisurya7482@gmail.com';

  const isManagingSelf = (adm) => {
    if (!adm || !user) return false;
    return (
      (user.id && adm.id && String(adm.id).toLowerCase() === String(user.id).toLowerCase()) ||
      (user.email && adm.email && adm.email.toLowerCase() === user.email.toLowerCase())
    );
  };

  const isSuperAdminAccount = (adm) => {
    if (!adm) return false;
    return (
      (adm.grantLevel || adm.role || '').toLowerCase().includes('super') ||
      adm.email?.toLowerCase() === 'jaisurya7482@gmail.com' ||
      (adm.id && String(adm.id).toLowerCase().includes('superadmin'))
    );
  };

  const handleStartManage = (adm) => {
    setManagingAdmin(adm);
    setEditUsername(adm.username || adm.name || '');
    setEditEmail(adm.email || '');
    setEditRole(adm.role || adm.grantLevel || 'Department Admin');
    setEditDeptId(adm.departmentId || adm.deptId || '');
    setIsEditing(false);
  };

  const isSelf = managingAdmin ? isManagingSelf(managingAdmin) : false;
  const isTargetSuper = managingAdmin ? isSuperAdminAccount(managingAdmin) : false;
  const isOtherSuperAdmin = isTargetSuper && !isSelf;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!managingAdmin || !editUsername.trim()) return;

    // Rule: Other superadmins cannot be modified by anyone
    if (isOtherSuperAdmin) {
      alert("Access Restricted: Other Super Admin accounts cannot be edited or modified.");
      setIsEditing(false);
      return;
    }

    // Rule: Admins cannot change their own email and role
    const finalEmail = isSelf ? managingAdmin.email : editEmail.trim();
    const finalRole = isSelf ? (managingAdmin.role || managingAdmin.grantLevel || 'Department Admin') : editRole;
    const finalGrantLevel = isSelf ? (managingAdmin.grantLevel || managingAdmin.role || 'Department Admin') : editRole;
    
    // Superadmin can change departments
    const finalDeptId = isCurrentUserSuperAdmin ? editDeptId : (managingAdmin.departmentId || '');

    updateAdmin(managingAdmin.id, {
      username: editUsername.trim(),
      email: finalEmail,
      role: finalRole,
      grantLevel: finalGrantLevel,
      departmentId: finalDeptId,
    });
    setIsEditing(false);
    setManagingAdmin(null);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      if (isSuperAdminAccount(adminToDelete)) {
        alert("Action Denied: Super Admin accounts cannot be deleted.");
        setAdminToDelete(null);
        return;
      }
      deleteAdmin(adminToDelete.id);
      setAdminToDelete(null);
      setManagingAdmin(null);
    }
  };

  const getDepartmentLabel = (deptId) => {
    if (!deptId) return 'All Departments / Central';
    const found = departments.find((d) => d.id === deptId || d.code === deptId);
    return found ? `${found.name} (${found.code})` : deptId;
  };

  return (
    <div className={`page-admin-admins min-h-screen flex flex-col justify-between transition-colors duration-300 ${
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
              <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-serif bg-amber-100 dark:bg-amber-900/60 px-3.5 py-1 rounded-full shadow-sm">
                🛡️ Administrator Credentials & Access
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mt-2">
                Admins Directory
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                Manage administrative accounts, assign municipal departments, and adjust clearance permissions.
              </p>
            </div>

            {isCurrentUserSuperAdmin && (
              <Link
                to="/admin/admins/new"
                className="pill-button-dark text-xs py-3 px-5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-white" /> Add Admin
              </Link>
            )}
          </div>

          {/* ULTRA-PROFESSIONAL SEAMLESS SEARCH BAR */}
          <div 
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-full border shadow-md focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all mb-6"
          >
            <Search className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search admin accounts by username or email..."
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

          {/* Admins List */}
          <div className={`p-6 rounded-3xl border shadow-xl max-h-[560px] overflow-y-auto ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
          }`}>
            <div className="flex flex-col gap-3">
              {filteredAdmins.map((adm, idx) => {
                const isItemSelf = isManagingSelf(adm);
                const isItemSuper = isSuperAdminAccount(adm);
                const isItemOtherSuper = isItemSuper && !isItemSelf;
                const deptName = getDepartmentLabel(adm.departmentId || adm.deptId);

                return (
                  <div
                    key={adm.id || adm.email || idx}
                    onClick={() => handleStartManage(adm)}
                    style={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                    }}
                    className="p-4 rounded-2xl border flex items-center justify-between gap-4 hover:scale-[1.01] transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="text-xs font-extrabold text-slate-400 font-serif min-w-[20px] flex-shrink-0">{idx + 1}.</span>
                      <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm shadow flex-shrink-0">
                        {adm.username ? adm.username.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-2 truncate">
                          <span>{adm.username}</span>
                          {isItemSelf && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full text-[9px] font-extrabold border border-blue-300 dark:border-blue-700 flex-shrink-0">
                              You (Active Session)
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex-shrink-0 ${
                            isItemSuper 
                              ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          }`}>
                            {isItemSuper ? 'Super Admin' : (adm.role || adm.grantLevel || 'Department Admin')}
                          </span>
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <p className="text-slate-500 dark:text-slate-400 font-semibold truncate">{adm.email}</p>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            {deptName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isItemOtherSuper ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Protected Account</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
                        <span>Manage Access</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* MANAGE ADMIN ACCESS ACTION MODAL */}
      {managingAdmin && (
        <div
          onClick={() => setManagingAdmin(null)}
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
            {/* MODAL HEADER ROW */}
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                  <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-serif bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full">
                    Admin Clearance & Roles
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold font-serif text-slate-900 dark:text-white mt-0.5 truncate max-w-[260px]">
                    {managingAdmin.username} {isSelf && '(Your Account)'}
                  </h3>
                </div>
              </div>

              {/* TOP-RIGHT CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setManagingAdmin(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors flex-shrink-0 cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* IF TARGET IS ANOTHER SUPER ADMIN: PROTECTED VIEW ONLY */}
            {isOtherSuperAdmin ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-left">
                  <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-serif">
                      Protected Super Admin Account
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1 leading-relaxed">
                      Super Admin accounts have core system protection. Other administrators (both Super Admins and Department Admins) cannot modify email, change roles, or revoke access for other Super Admins.
                    </p>
                  </div>
                </div>

                <div 
                  style={{
                    backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                  }}
                  className="p-4 rounded-2xl border flex flex-col gap-2.5 text-xs"
                >
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 font-bold">Admin Username:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{managingAdmin.username}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 font-bold">Official Email:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{managingAdmin.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 font-bold">Clearance Level:</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">Super Administrator</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-bold">Jurisdiction:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">All Municipal Departments</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setManagingAdmin(null)}
                    className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : isEditing ? (
              /* EDIT FORM MODE */
              <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 mt-2">
                {/* 1. USERNAME */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                    Username / Full Name :
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    style={{
                      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                    }}
                    className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  />
                </div>

                {/* 2. OFFICIAL EMAIL - LOCKED FOR SELF */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif">
                      Official Email :
                    </label>
                    {isSelf && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked for Self
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    disabled={isSelf}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{
                      backgroundColor: isSelf ? (isDark ? '#0f172a' : '#f1f5f9') : (isDark ? '#1e293b' : '#f8fafc'),
                      color: isSelf ? (isDark ? '#94a3b8' : '#64748b') : (isDark ? '#ffffff' : '#0f172a'),
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                      cursor: isSelf ? 'not-allowed' : 'text',
                    }}
                    className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  />
                  {isSelf && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
                      Security restriction: You cannot modify your own administrative login email.
                    </p>
                  )}
                </div>

                {/* 3. GRANT LEVEL / ROLE - LOCKED FOR SELF */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif">
                      Grant Level / Role :
                    </label>
                    {isSelf && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked for Self
                      </span>
                    )}
                  </div>
                  <select
                    disabled={isSelf}
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{
                      backgroundColor: isSelf ? (isDark ? '#0f172a' : '#f1f5f9') : (isDark ? '#1e293b' : '#f8fafc'),
                      color: isSelf ? (isDark ? '#94a3b8' : '#64748b') : (isDark ? '#ffffff' : '#0f172a'),
                      borderColor: isDark ? '#475569' : '#cbd5e1',
                      cursor: isSelf ? 'not-allowed' : 'pointer',
                    }}
                    className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  >
                    <option value="Department Admin">Department Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                  {isSelf && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
                      Security restriction: You cannot alter your own clearance role level.
                    </p>
                  )}
                </div>

                {/* 4. ASSIGNED DEPARTMENT - SUPER ADMIN CAN CHANGE DEPARTMENTS */}
                {isCurrentUserSuperAdmin && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 font-serif mb-1.5">
                      Assigned Municipal Department :
                    </label>
                    <select
                      value={editDeptId}
                      onChange={(e) => setEditDeptId(e.target.value)}
                      style={{
                        backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                        color: isDark ? '#ffffff' : '#0f172a',
                        borderColor: isDark ? '#475569' : '#cbd5e1',
                      }}
                      className="w-full p-3 px-4 rounded-2xl border text-xs font-extrabold outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
                    >
                      <option value="">All Departments / Central Authority</option>
                      {departments.map((dept) => (
                        <option key={dept.id || dept.code} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
                      Super Admin clearance allows reassigning officer jurisdictions.
                    </p>
                  </div>
                )}

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
                    className="pill-button-dark py-2.5 px-6 text-xs bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Access Changes
                  </button>
                </div>
              </form>
            ) : (
              /* ACTIONS BUTTONS */
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-2">
                  Select an administrative management action:
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
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-serif">
                        Modify Clearance & Assignments
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {isSelf
                          ? 'Update your full name or assigned departmental details.'
                          : 'Edit username, staff email, clearance role, or change department.'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* OPTION 2: DELETE / REVOKE ADMIN */}
                {managingAdmin.email?.toLowerCase() === 'jaisurya7482@gmail.com' ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 text-left">
                    🛡️ <strong>Protected System Account:</strong> Default Super Admin (jaisurya7482@gmail.com) cannot be deleted.
                  </div>
                ) : isSelf ? (
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 text-left">
                    ⚠️ <strong>Self-Protection Notice:</strong> You cannot revoke or delete your own active admin session account.
                  </div>
                ) : isTargetSuper ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 text-left">
                    🛡️ <strong>Super Admin Protected:</strong> Super Admin accounts cannot be revoked by other administrators.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdminToDelete(managingAdmin)}
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
                          Revoke Admin Credentials
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Permanently revoke staff access and remove account.
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE / REVOKE CONFIRMATION MODAL WITH BACKDROP BLUR */}
      {adminToDelete && (
        <div
          onClick={() => setAdminToDelete(null)}
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
              Revoke Admin Credentials?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6 leading-relaxed">
              Are you sure you want to revoke admin access for <span className="font-extrabold text-slate-900 dark:text-white">"{adminToDelete.username}"</span>? This will disable their ability to manage department complaints.
            </p>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setAdminToDelete(null)}
                className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="pill-button-dark py-2.5 px-6 text-xs text-white font-extrabold bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Confirm Revoke</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatbotFAB />
    </div>
  );
};
