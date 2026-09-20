import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Activity, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { TopNavBar } from '../../components/common/TopNavBar.jsx';
import { ChatbotFAB } from '../../components/common/ChatbotFAB.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Erase complaint draft & pending data whenever user returns to Home / Landing page
  useEffect(() => {
    sessionStorage.removeItem('mcp_complaint_draft');
    sessionStorage.removeItem('mcp_pending_complaint');
  }, []);

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      navigate('/complaints/new');
    } else {
      navigate('/login?redirect=/complaints/new');
    }
  };

  return (
    <div className="hero-full-bg">
      <div className="hero-overlay" />

      {/* Top Floating Glass Navbar */}
      <TopNavBar theme="civic" />

      {/* Hero Content Left */}
      <main className="hero-content-left">
        <h1 className="hero-title-black">Your Voice.</h1>
        <h1 className="hero-title-blue">Our Responsibility.</h1>

        <button onClick={handleRegisterClick} className="figma-cta-button">
          Register Complaint <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </main>

      {/* Bottom Feature Strip (Figma Exact 4 Columns) */}
      <div className="figma-feature-strip">
        {/* Item 1 */}
        <div className="feature-item">
          <div className="feature-icon-badge">
            <Edit3 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="feature-title">Easy to File</h4>
            <p className="feature-desc">Register your complaint in just a few simple steps.</p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="feature-item">
          <div className="feature-icon-badge">
            <Activity className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="feature-title">Track in Real-time</h4>
            <p className="feature-desc">Stay updated with real-time status and updates.</p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="feature-item">
          <div className="feature-icon-badge">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="feature-title">Transparent Process</h4>
            <p className="feature-desc">We ensure accountability at every step.</p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="feature-item">
          <div className="feature-icon-badge">
            <Users className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="feature-title">Better Communities</h4>
            <p className="feature-desc">Together, let's build clean, safe & happy communities.</p>
          </div>
        </div>
      </div>

      {/* Floating Chatbot FAB Bottom-Right */}
      <ChatbotFAB />
    </div>
  );
};
