import { RouterProvider } from 'react-router';
import { router } from './router.js';

export function App() {
  return <RouterProvider router={router} />;
}
