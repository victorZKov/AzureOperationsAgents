import { lazy, Suspense } from 'react';
import { Outlet, Routes, Route } from 'react-router-dom';
// auth
import AuthGuard from "../../auth/AuthGuard";
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import Agents from "../../pages/Agents";
import Audit from "../../pages/Audit";
import LiveQueries from "../../pages/LiveQueries";

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
// ACCOUNT
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
const GenerationPage = lazy(() => import('src/pages/dashboard/generation'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'user',
        children: [
          {
            path: 'account',
            element: <UserAccountPage />,
            // Add these properties to handle query parameters
            sensitive: false,
            strict: false,
            caseSensitive: false
          },
        ],
      },
      { path: 'agents', element: <Agents /> },
      { path: 'blank', element: <BlankPage /> },
      { path: 'audit', element: <Audit /> },
      { path: 'chat', element: <LiveQueries /> },
    ],
  },
];
