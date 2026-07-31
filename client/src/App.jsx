import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './routes/LoginPage.jsx';
import RegisterPage from './routes/RegisterPage.jsx';
import VerifyPage from './routes/VerifyPage.jsx';
import ForgotPasswordPage from './routes/ForgotPasswordPage.jsx';
import ResetPasswordPage from './routes/ResetPasswordPage.jsx';
import NotFoundPage from './routes/NotFoundPage.jsx';
import HomePage from './routes/dashboard/HomePage.jsx';
import InboxPage from './routes/dashboard/InboxPage.jsx';
import ProfilePage from './routes/dashboard/ProfilePage.jsx';
import ManagePage from './routes/dashboard/ManagePage.jsx';
import RequestPage from './routes/dashboard/RequestPage.jsx';
import ProjectRequestWizard from './routes/dashboard/ProjectRequestWizard.jsx';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify', element: <VerifyPage /> },
      { path: '/forgot', element: <ForgotPasswordPage /> },
      { path: '/reset', element: <ResetPasswordPage /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'inbox', element: <InboxPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'manage', element: <ManagePage /> },
          { path: 'request', element: <RequestPage /> },
          { path: 'request/:type', element: <ProjectRequestWizard /> }
        ]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
