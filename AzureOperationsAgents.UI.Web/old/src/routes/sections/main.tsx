import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import MainLayout from 'src/layouts/main';
import SimpleLayout from 'src/layouts/simple';
import CompactLayout from 'src/layouts/compact';
// components
import { SplashScreen } from 'src/components/loading-screen';
import PrivacyPolicyPage from "../../pages/privacy-policy";
import TermsAndConditionsPage from "../../pages/terms-conditions";
import SuccessPage from "../../pages/Success";
import Register from "../../pages/auth/Register";
import RemoveMyDataPage from "../../pages/remove-data";

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const FaqsPage = lazy(() => import('src/pages/faqs'));
const AboutPage = lazy(() => import('src/pages/about-us'));
const PricingPage = lazy(() => import('src/pages/pricing'));
const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));
const ChangeLogPage = lazy(() => import('src/pages/change-log'));
const RegisterPage = lazy(() => import('src/pages/auth/Register'));
// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [
      { path: 'about-us', element: <AboutPage /> },
      { path: 'faqs', element: <FaqsPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-conditions', element: <TermsAndConditionsPage /> },
      { path: 'remove-my-data', element: <RemoveMyDataPage /> },
      { path: 'change-log', element: <ChangeLogPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'auth/register', element: <Register />}
    ],
  },
  {
    element: (
      <SimpleLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </SimpleLayout>
    ),
    children: [

      
    ],
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [
      { path: 'coming-soon', element: <ComingSoonPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
      { path: 'checkout/success', element: <SuccessPage /> },
    ],
  },
];
