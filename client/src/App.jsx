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
import MarketingHomePage from './routes/MarketingHomePage.jsx';
import ContactPage from './routes/ContactPage.jsx';
import CancelPage from './routes/CancelPage.jsx';
import SuccessPage from './routes/SuccessPage.jsx';
import ContractorLoginPage from './routes/ContractorLoginPage.jsx';
import ContractorDashboardPage from './routes/ContractorDashboardPage.jsx';
import ChangePasswordPage from './routes/ChangePasswordPage.jsx';
import AdminPage from './routes/AdminPage.jsx';
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
      { path: '/', element: <MarketingHomePage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify', element: <VerifyPage /> },
      { path: '/forgot', element: <ForgotPasswordPage /> },
      { path: '/reset', element: <ResetPasswordPage /> },
      { path: '/contractor', element: <ContractorLoginPage /> },
      { path: '/404', element: <NotFoundPage /> }
    ]
  },
  { path: '/cancel', element: <CancelPage /> },
  { path: '/success', element: <SuccessPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/change-password', element: <ChangePasswordPage /> }]
  },
  {
    element: <ProtectedRoute roles={['customer']} />,
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
  {
    element: <ProtectedRoute roles={['Admin']} />,
    children: [{ path: '/admin', element: <AdminPage /> }]
  },
  {
    element: <ProtectedRoute roles={['Contractor']} />,
    children: [{ path: '/contractor/dashboard', element: <ContractorDashboardPage /> }]
  },
  { path: '*', element: <NotFoundPage /> }
]);
