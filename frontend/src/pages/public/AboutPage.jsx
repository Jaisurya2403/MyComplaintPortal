import React from 'react';
import { Headset } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton.jsx';

export const AboutPage = () => {
  return (
    <div className="page-about bg-civic-gradient min-h-screen p-6 sm:p-10 relative flex flex-col justify-center items-center">
      <div className="max-w-5xl w-full relative z-10">
        {/* Top Header Row with Back Button (NO NAVBAR) */}
        <div className="flex items-center gap-6 mb-6">
          <BackButton />
          <h1 className="about-title">About</h1>
        </div>

        <div className="about-grid">
          {/* Left Column: Glass Content Cards */}
          <div className="about-left-col">
            {/* About Main Card */}
            <div className="glass-civic about-card">
              <p className="about-text mb-4">
                MyComplaint portal is a digital grievance redressal platform designed to bridge the gap between citizens and organizations by providing a transparent, efficient, and user-friendly complaint management system.
              </p>
              <p className="about-text">
                Our mission is to empower users to raise concerns, track complaint progress in real time, and receive timely resolutions through a streamlined process. We aim to enhance accountability, improve communication, and ensure that every grievance is addressed fairly and effectively.
              </p>
            </div>

            {/* Contact Us Section */}
            <h2 className="contact-heading">Contact Us:</h2>

            {/* Contact Pill Box */}
            <div className="glass-civic contact-pill">
              <p className="contact-info">
                Email 1: <span className="contact-value">jaisurya7482@gmail.com</span><br></br>
                Email 2: <span className="contact-value">b.karthikeyan1000@gmail.com</span>
              </p>
              <p className="contact-info">
                Ph. no: <span className="contact-value">735-800-7398</span>
              </p>
            </div>

            {/* Copyright Pill Box */}
            <div className="glass-civic copyright-pill">
              <p className="copyright-text">
                © 2026 MyComplaintPortal. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* Right Column: Support Graphic Illustration */}
          <div className="about-right-col">
            <div className="support-graphic-circle">
              <Headset className="support-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
