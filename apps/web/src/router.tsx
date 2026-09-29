import { createBrowserRouter, Navigate } from 'react-router';
import { WelcomeScreen } from './features/auth/WelcomeScreen.js';
import { LoginScreen } from './features/auth/LoginScreen.js';
import { OtpScreen } from './features/auth/OtpScreen.js';
import { HomeScreen } from './features/home/HomeScreen.js';
import { NewLotPhotoScreen } from './features/lots/NewLotPhotoScreen.js';
import { NewLotMaterialScreen } from './features/lots/NewLotMaterialScreen.js';
import { NewLotWeightScreen } from './features/lots/NewLotWeightScreen.js';
import { NewLotEstimateScreen } from './features/lots/NewLotEstimateScreen.js';
import { RecyclerMatchScreen } from './features/lots/RecyclerMatchScreen.js';
import { LotsListScreen } from './features/lots/LotsListScreen.js';
import { LotDetailScreen } from './features/lots/LotDetailScreen.js';
import { HandoverScreen } from './features/handover/HandoverScreen.js';
import { PriceBoardScreen } from './features/prices/PriceBoardScreen.js';
import { EarningsScreen } from './features/earnings/EarningsScreen.js';
import { SafetyScreen } from './features/safety/SafetyScreen.js';
import { SyncScreen } from './features/sync/SyncScreen.js';
import { SettingsScreen } from './features/settings/SettingsScreen.js';

import { RecyclerLoginScreen } from './features/recycler/RecyclerLoginScreen.js';
import { RecyclerDashboard } from './features/recycler/RecyclerDashboard.js';
import { RecyclerHandoverConfirm } from './features/recycler/RecyclerHandoverConfirm.js';
import { RecyclerRatesScreen } from './features/recycler/RecyclerRatesScreen.js';

import { AdminLoginScreen } from './features/admin/AdminLoginScreen.js';
import { AdminDashboard } from './features/admin/AdminDashboard.js';

import { UiKit } from './components/dev/UiKit.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/welcome" replace />,
  },
  {
    path: '/welcome',
    element: <WelcomeScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/otp',
    element: <OtpScreen />,
  },
  {
    path: '/home',
    element: <HomeScreen />,
  },
  {
    path: '/lot/new/photo',
    element: <NewLotPhotoScreen />,
  },
  {
    path: '/lot/new/material',
    element: <NewLotMaterialScreen />,
  },
  {
    path: '/lot/new/weight',
    element: <NewLotWeightScreen />,
  },
  {
    path: '/lot/new/estimate',
    element: <NewLotEstimateScreen />,
  },
  {
    path: '/lot/:clientId/match',
    element: <RecyclerMatchScreen />,
  },
  {
    path: '/lots',
    element: <LotsListScreen />,
  },
  {
    path: '/lot/:clientId',
    element: <LotDetailScreen />,
  },
  {
    path: '/lot/:clientId/handover',
    element: <HandoverScreen />,
  },
  {
    path: '/prices',
    element: <PriceBoardScreen />,
  },
  {
    path: '/earnings',
    element: <EarningsScreen />,
  },
  {
    path: '/safety',
    element: <SafetyScreen />,
  },
  {
    path: '/sync',
    element: <SyncScreen />,
  },
  {
    path: '/settings',
    element: <SettingsScreen />,
  },

  // Recycler Routes (Control Theme)
  {
    path: '/recycler/login',
    element: <RecyclerLoginScreen />,
  },
  {
    path: '/recycler',
    element: <RecyclerDashboard />,
  },
  {
    path: '/recycler/lots',
    element: <RecyclerDashboard />,
  },
  {
    path: '/recycler/handover',
    element: <RecyclerHandoverConfirm />,
  },
  {
    path: '/recycler/rates',
    element: <RecyclerRatesScreen />,
  },

  // Admin Routes (Control Theme)
  {
    path: '/admin/login',
    element: <AdminLoginScreen />,
  },
  {
    path: '/admin',
    element: <Navigate to="/admin/recyclers" replace />,
  },
  {
    path: '/admin/recyclers',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/flags',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/data',
    element: <AdminDashboard />,
  },

  // Dev & Component Catalog
  {
    path: '/dev/ui-kit',
    element: <UiKit />,
  },

  // 404 Handler
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-kc-bg text-kc-ink">
        <h1 className="text-4xl font-mono font-bold mb-2">404</h1>
        <p className="text-kc-ink-dim mb-4">Page not found</p>
        <a
          href="/home"
          className="px-4 py-2 bg-kc-accent text-kc-accent-ink font-bold rounded-xs text-sm"
        >
          Return Home
        </a>
      </div>
    ),
  },
]);
