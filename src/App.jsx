import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import GuestBookPage from './pages/GuestBookPage';
import RegistrationPage from './pages/RegistrationPage';
import DirectoryPage from './pages/DirectoryPage';
import SchedulePage from './pages/SchedulePage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import EducationPage from './pages/EducationPage';
import AboutPage from './pages/AboutPage';
import LayananPublikPage from './pages/LayananPublikPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="pt-16 min-h-screen">
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/profil-dlh" element={<AboutPage />} />
          <Route path="/layanan-publik" element={<LayananPublikPage />} />
          <Route path="/dashboard-statistics" element={<DashboardPage />} />
          <Route path="/guest-book" element={<GuestBookPage />} />
          <Route path="/galeri-kegiatan" element={<ActivitiesPage />} />
          <Route path="/activity/:id" element={<ActivityDetailPage />} />
          <Route path="/education-guidelines" element={<EducationPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
