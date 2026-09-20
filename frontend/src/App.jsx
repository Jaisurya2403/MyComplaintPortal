import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ComplaintProvider } from './context/ComplaintContext.jsx';

// Public Pages
import { LandingPage } from './pages/public/LandingPage.jsx';
import { LoginPage } from './pages/public/LoginPage.jsx';
import { SignupPage } from './pages/public/SignupPage.jsx';
import { VerifyEmailPage } from './pages/public/VerifyEmailPage.jsx';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage.jsx';
import { AboutPage } from './pages/public/AboutPage.jsx';
import { PublicFeedPage } from './pages/public/PublicFeedPage.jsx';
import { OfficerTrackPage } from './pages/public/OfficerTrackPage.jsx';

// Citizen & Admin Unified Home & Dashboard Pages
import { AuthenticatedHomePage } from './pages/user/AuthenticatedHomePage.jsx';
import { RegisterComplaintPage } from './pages/user/RegisterComplaintPage.jsx';
import { AIDuplicateCheckPage } from './pages/user/AIDuplicateCheckPage.jsx';
import { ComplaintDetailPage } from './pages/user/ComplaintDetailPage.jsx';
import { MyProfilePage } from './pages/user/MyProfilePage.jsx';
import { MyComplaintsPage } from './pages/user/MyComplaintsPage.jsx';
import { MyRepostsPage } from './pages/user/MyRepostsPage.jsx';
import { SettingsPage } from './pages/user/SettingsPage.jsx';
import { ChangePasswordPage } from './pages/user/ChangePasswordPage.jsx';

// Admin / Department Sub-Management Tools
import { AnalyticsPage } from './pages/admin/AnalyticsPage.jsx';
import { AdminPostsPage } from './pages/admin/AdminPostsPage.jsx';
import { AdminRedirectsPage } from './pages/admin/AdminRedirectsPage.jsx';
import { UsersManagementPage } from './pages/admin/UsersManagementPage.jsx';
import { DepartmentsManagementPage } from './pages/admin/DepartmentsManagementPage.jsx';
import { AddDepartmentPage } from './pages/admin/AddDepartmentPage.jsx';
import { AdminsManagementPage } from './pages/admin/AdminsManagementPage.jsx';
import { AddAdminPage } from './pages/admin/AddAdminPage.jsx';

import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <BrowserRouter>
          {/* Universal iOS 18 Glassmorphism Background Wallpaper Layer */}
          <div className="app-background-wallpaper" id="app-background-wallpaper" />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/posts" element={<PublicFeedPage />} />
            <Route path="/posts/:id" element={<ComplaintDetailPage />} />
            <Route path="/track/:token" element={<OfficerTrackPage />} />
            <Route path="/admin/track/:token" element={<OfficerTrackPage />} />

            {/* Unified Home Page for both Citizens & Admins */}
            <Route path="/home" element={<AuthenticatedHomePage />} />
            
            {/* Protected Citizen Features */}
            <Route path="/complaints/new" element={<ProtectedRoute><RegisterComplaintPage /></ProtectedRoute>} />
            <Route path="/user/ai-check" element={<ProtectedRoute><AIDuplicateCheckPage /></ProtectedRoute>} />
            <Route path="/complaints/new/review" element={<ProtectedRoute><AIDuplicateCheckPage /></ProtectedRoute>} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard/complaints" element={<ProtectedRoute><MyComplaintsPage /></ProtectedRoute>} />
            <Route path="/dashboard/reposts" element={<ProtectedRoute><MyRepostsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

            {/* Redirect /admin directly to /home */}
            <Route path="/admin" element={<Navigate to="/home" replace />} />
            
            {/* Protected Admin Management Tools */}
            <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/posts" element={<ProtectedRoute><AdminPostsPage /></ProtectedRoute>} />
            <Route path="/admin/posts/:id" element={<ProtectedRoute><ComplaintDetailPage /></ProtectedRoute>} />
            <Route path="/admin/redirects" element={<ProtectedRoute><AdminRedirectsPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><UsersManagementPage /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute><DepartmentsManagementPage /></ProtectedRoute>} />
            <Route path="/admin/departments/new" element={<ProtectedRoute><AddDepartmentPage /></ProtectedRoute>} />
            <Route path="/admin/admins" element={<ProtectedRoute><AdminsManagementPage /></ProtectedRoute>} />
            <Route path="/admin/admins/new" element={<ProtectedRoute><AddAdminPage /></ProtectedRoute>} />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ComplaintProvider>
    </AuthProvider>
  );
};

export default App;
