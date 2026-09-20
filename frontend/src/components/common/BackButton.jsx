import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ onClick, label }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="w-10 h-10 rounded-full glass-civic flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-300/80 group"
      title="Go back"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      {label && <span className="ml-2 text-sm font-semibold pr-2">{label}</span>}
    </button>
  );
};
