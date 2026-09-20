import React, { useState } from 'react';
import { RefreshCw, ChevronDown, Check, Calendar } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const FilterBar = () => {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  const {
    departments,
    selectedDeptFilter,
    setSelectedDeptFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    selectedDateFilter,
    setSelectedDateFilter,
  } = useComplaints();

  // Popover State Controls ('dept' | 'status' | null)
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleReset = () => {
    setSelectedDeptFilter('all');
    setSelectedStatusFilter('all');
    setSelectedDateFilter('all');
    setOpenDropdown(null);
  };

  const handleDateChange = (e) => {
    const chosenDate = e.target.value;
    if (chosenDate) {
      setSelectedDateFilter(chosenDate);
    } else {
      setSelectedDateFilter('all');
    }
  };

  // Status Filter Options (Center Aligned, No Icons)
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Registered', label: 'Registered' },
    { value: 'Visited', label: 'Visited' },
    { value: 'Action-in-progress', label: 'Action-in-progress' },
    { value: 'Resolved', label: 'Resolved' },
  ];

  // Active Labels
  const selectedDeptObj = departments.find((d) => d.id === selectedDeptFilter);
  const selectedDeptLabel = selectedDeptFilter === 'all' ? 'All Departments' : (selectedDeptObj?.name || 'Department');
  const selectedStatusObj = statusOptions.find((s) => s.value === selectedStatusFilter) || statusOptions[0];

  return (
    <div className={`w-full p-2.5 px-4 rounded-2xl sm:rounded-full mb-6 shadow-xl border transition-all flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 relative z-40 ${
      isDark ? 'bg-slate-800/90 border-slate-700' : 'glass-civic border-white/90'
    }`}>
      {/* RESET FILTERS BUTTON (CENTERED TEXT) */}
      <button
        onClick={handleReset}
        style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          borderColor: isDark ? '#334155' : '#cbd5e1',
        }}
        className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-full text-xs font-serif font-extrabold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer border flex-shrink-0 text-center"
        title="Reset All Filters"
      >
        <RefreshCw className="w-3.5 h-3.5 stroke-[2.2]" />
        <span>Reset</span>
      </button>

      {/* 1. CENTERED DEPARTMENT POPOVER DROPDOWN */}
      <div className="relative flex-1 min-w-[140px] max-w-full">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'dept' ? null : 'dept')}
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#ffffff' : '#0f172a',
            borderColor: isDark ? '#334155' : '#cbd5e1',
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full border shadow-sm transition-all hover:scale-[1.01] active:scale-95 font-serif font-extrabold text-xs cursor-pointer group text-center"
        >
          <span className="text-slate-500 dark:text-slate-400 font-serif flex-shrink-0">Dept:</span>
          <span className="font-extrabold truncate max-w-[120px] sm:max-w-[160px] text-blue-600 dark:text-blue-400 text-center">
            {selectedDeptLabel}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openDropdown === 'dept' ? 'rotate-180 text-blue-500' : ''}`} />
        </button>

        {/* POPOVER MENU WITH Z-INDEX 9999 TO PREVENT HIDING BEHIND CARDS */}
        {openDropdown === 'dept' && (
          <div
            className="absolute left-0 right-0 mx-auto top-full mt-2 w-64 max-h-64 overflow-y-auto rounded-2xl p-2 shadow-2xl border animate-fadeIn"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
              boxShadow: isDark ? '0 30px 70px rgba(0,0,0,0.9)' : '0 24px 60px rgba(0,0,0,0.22)',
              zIndex: 9999,
            }}
          >
            <button
              onClick={() => {
                setSelectedDeptFilter('all');
                setOpenDropdown(null);
              }}
              style={{
                backgroundColor: selectedDeptFilter === 'all' ? '#2563eb' : 'transparent',
                color: selectedDeptFilter === 'all' ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
              }}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-serif text-xs font-extrabold transition-all cursor-pointer text-center ${
                selectedDeptFilter === 'all'
                  ? 'shadow-md'
                  : isDark ? 'hover:bg-slate-800 hover:text-blue-400' : 'hover:bg-slate-100 hover:text-blue-600'
              }`}
            >
              <span>All Departments</span>
              {selectedDeptFilter === 'all' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </button>

            {departments.map((d) => {
              const isSelected = selectedDeptFilter === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDeptFilter(d.id);
                    setOpenDropdown(null);
                  }}
                  style={{
                    backgroundColor: isSelected ? '#2563eb' : 'transparent',
                    color: isSelected ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-serif text-xs font-extrabold border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'shadow-md'
                      : isDark ? 'hover:bg-slate-800 hover:text-blue-400' : 'hover:bg-slate-100 hover:text-blue-600'
                  }`}
                >
                  <span className="truncate max-w-[180px]">{d.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. DIRECT CALENDAR DATE SELECTION PILL (NO DROPDOWN MENU) */}
      <div className="relative flex-shrink-0">
        <label
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#ffffff' : '#0f172a',
            borderColor: isDark ? '#334155' : '#cbd5e1',
          }}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-full border shadow-sm transition-all hover:scale-[1.01] active:scale-95 font-serif font-extrabold text-xs cursor-pointer group text-center"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
          <span className="text-slate-500 dark:text-slate-400 font-serif">Date:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            {selectedDateFilter !== 'all' ? selectedDateFilter : 'Select Date'}
          </span>
          <input
            type="date"
            value={selectedDateFilter !== 'all' ? selectedDateFilter : ''}
            onChange={handleDateChange}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
          />
        </label>
      </div>

      {/* 3. CENTERED STATUS POPOVER DROPDOWN */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#ffffff' : '#0f172a',
            borderColor: isDark ? '#334155' : '#cbd5e1',
          }}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-full border shadow-sm transition-all hover:scale-[1.01] active:scale-95 font-serif font-extrabold text-xs cursor-pointer group text-center"
        >
          <span className="text-slate-500 dark:text-slate-400 font-serif">Status:</span>
          <span className="font-extrabold text-purple-600 dark:text-purple-400">
            {selectedStatusObj.label}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openDropdown === 'status' ? 'rotate-180 text-purple-500' : ''}`} />
        </button>

        {/* POPOVER MENU WITH Z-INDEX 9999 TO PREVENT HIDING BEHIND CARDS */}
        {openDropdown === 'status' && (
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl p-2 shadow-2xl border animate-fadeIn text-center"
            style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
              boxShadow: isDark ? '0 30px 70px rgba(0,0,0,0.9)' : '0 24px 60px rgba(0,0,0,0.22)',
              zIndex: 9999,
            }}
          >
            {statusOptions.map((opt) => {
              const isSelected = selectedStatusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedStatusFilter(opt.value);
                    setOpenDropdown(null);
                  }}
                  style={{
                    backgroundColor: isSelected ? '#7c3aed' : 'transparent',
                    color: isSelected ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-serif text-xs font-extrabold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'shadow-md'
                      : isDark ? 'hover:bg-slate-800 hover:text-purple-400' : 'hover:bg-slate-100 hover:text-purple-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
