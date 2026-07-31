import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import LoginPage from './routes/LoginPage.jsx';
import RegisterPage from './routes/RegisterPage.jsx';
import VerifyPage from './routes/VerifyPage.jsx';
import ForgotPasswordPage from './routes/ForgotPasswordPage.jsx';
import ResetPasswordPage from './routes/ResetPasswordPage.jsx';
import NotFoundPage from './routes/NotFoundPage.jsx';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify', element: <VerifyPage /> },
      { path: '/forgot', element: <ForgotPasswordPage /> },
      { path: '/reset', element: <ResetPasswordPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);
