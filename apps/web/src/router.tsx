import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ScrapRates from './pages/ScrapRates';
import Calculator from './pages/Calculator';
import SchedulePickup from './pages/SchedulePickup';
import TrackPickup from './pages/TrackPickup';
import FindCollectors from './pages/FindCollectors';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import RecyclerDashboard from './pages/RecyclerDashboard';
import MunicipalityDashboard from './pages/MunicipalityDashboard';
import Rewards from './pages/Rewards';
import Learn from './pages/Learn';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'rates', element: <ScrapRates /> },
      { path: 'calculator', element: <Calculator /> },
      { path: 'book', element: <SchedulePickup /> },
      { path: 'schedule', element: <SchedulePickup /> },
      { path: 'track', element: <TrackPickup /> },
      { path: 'collectors', element: <FindCollectors /> },
      { path: 'find-collectors', element: <FindCollectors /> },
      { path: 'auth', element: <Login /> },
      { path: 'login', element: <Login /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'collector', element: <CollectorDashboard /> },
      { path: 'recycler', element: <RecyclerDashboard /> },
      { path: 'municipality', element: <MunicipalityDashboard /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'learn', element: <Learn /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);