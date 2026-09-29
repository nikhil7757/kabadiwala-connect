import { createBrowserRouter, Navigate } from 'react-router';
import { WelcomeScreen } from './features/auth/WelcomeScreen.js';
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
    path: '/dev/ui-kit',
    element: <UiKit />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-heading font-bold mb-2">404</h1>
        <p className="text-kc-ink-dim mb-4">Page not found</p>
        <a
          href="/welcome"
          className="px-4 py-2 bg-kc-accent text-kc-accent-ink font-bold rounded-sm text-sm"
        >
          Return Home
        </a>
      </div>
    ),
  },
]);
