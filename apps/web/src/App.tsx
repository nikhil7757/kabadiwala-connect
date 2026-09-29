import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './router.js';
import { useAppStore } from './store/useAppStore.js';
import { syncClient } from './lib/sync.js';
import { initMotionGuard } from './lib/motion.js';

export function App() {
  const initialize = useAppStore((s) => s.initialize);

  useEffect(() => {
    initMotionGuard();
    initialize();
    syncClient.init();

    return () => {
      syncClient.destroy();
    };
  }, [initialize]);

  return <RouterProvider router={router} />;
}
