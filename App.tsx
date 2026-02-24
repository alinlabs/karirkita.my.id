
import React, { useEffect, Suspense } from 'react';
// PANDUAN DEPLOY:
// 1. Saat ini menggunakan 'BrowserRouter' (Clean URL).
// 2. Pastikan server dikonfigurasi untuk SPA (Single Page Application) fallback.
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './komponen/umum/Layout';
import { ScrollToTop } from './komponen/umum/ScrollToTop';
import { SettingsProvider } from './context/SettingsContext';
import { DataProvider } from './context/DataContext';
import { LoadingProvider } from './context/LoadingContext';
import { routingData } from './services/routingData';
import { ErrorBoundary } from './komponen/umum/ErrorBoundary';

// Lazy Load Feature Containers
const Beranda = React.lazy(() => import('./halaman/beranda/Container').then(module => ({ default: module.Container })));
const Pekerjaan = React.lazy(() => import('./halaman/pekerjaan/Container').then(module => ({ default: module.Container })));
const DetailPekerjaan = React.lazy(() => import('./halaman/pekerjaan/DetailPekerjaan').then(module => ({ default: module.DetailPekerjaan })));
const Pelamar = React.lazy(() => import('./halaman/pelamar/Container').then(module => ({ default: module.Container })));
const Perusahaan = React.lazy(() => import('./halaman/perusahaan/Container').then(module => ({ default: module.Container })));
const DetailPerusahaan = React.lazy(() => import('./halaman/perusahaan/DetailPerusahaan').then(module => ({ default: module.DetailPerusahaan })));
const Penawaran = React.lazy(() => import('./halaman/penawaran/Container').then(module => ({ default: module.PenawaranContainer })));
const Kelas = React.lazy(() => import('./halaman/kelas/Container').then(module => ({ default: module.Container })));
const DetailKelas = React.lazy(() => import('./halaman/kelas/SectionDetailKelas').then(module => ({ default: module.SectionDetailKelas })));
const DetailMentor = React.lazy(() => import('./halaman/kelas/SectionDetailMentor').then(module => ({ default: module.SectionDetailMentor })));
const Profil = React.lazy(() => import('./halaman/profil/Container').then(module => ({ default: module.Container })));
const Pembayaran = React.lazy(() => import('./halaman/pembayaran/Container').then(module => ({ default: module.Container })));

// Auth
const AuthLayout = React.lazy(() => import('./halaman/login/AuthLayout').then(module => ({ default: module.AuthLayout })));
const Login = React.lazy(() => import('./halaman/login/Login').then(module => ({ default: module.Login })));
const Register = React.lazy(() => import('./halaman/login/Register').then(module => ({ default: module.Register })));

// User Panel
const UserLayout = React.lazy(() => import('./halaman/user/UserLayout').then(module => ({ default: module.UserLayout })));
const UserDashboard = React.lazy(() => import('./halaman/user/UserDashboard').then(module => ({ default: module.UserDashboard })));
const UserProfile = React.lazy(() => import('./halaman/user/UserProfile').then(module => ({ default: module.UserProfile })));
const UserCompanyProfile = React.lazy(() => import('./halaman/user/UserCompanyProfile').then(module => ({ default: module.UserCompanyProfile }))); 
const UserJobs = React.lazy(() => import('./halaman/user/UserJobs').then(module => ({ default: module.UserJobs })));
const UserJobEditor = React.lazy(() => import('./halaman/user/UserJobEditor').then(module => ({ default: module.UserJobEditor })));
const UserServices = React.lazy(() => import('./halaman/user/UserServices').then(module => ({ default: module.UserServices })));
const UserSettings = React.lazy(() => import('./halaman/user/UserSettings').then(module => ({ default: module.UserSettings })));
const UserNotifications = React.lazy(() => import('./halaman/user/UserNotifications').then(module => ({ default: module.UserNotifications })));
const UserLetterBuilder = React.lazy(() => import('./halaman/user/UserLetterBuilder').then(module => ({ default: module.UserLetterBuilder }))); 
const UserSignature = React.lazy(() => import('./halaman/user/UserSignature').then(module => ({ default: module.UserSignature }))); 
const SignaturePreview = React.lazy(() => import('./halaman/public/SignaturePreview').then(module => ({ default: module.SignaturePreview }))); 
const CVOnline = React.lazy(() => import('./halaman/user/CVOnline').then(module => ({ default: module.CVOnline }))); 

// Admin Panel (Updated)
const AdminLayout = React.lazy(() => import('./halaman/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = React.lazy(() => import('./halaman/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ManageCompanies = React.lazy(() => import('./halaman/admin/ManageCompanies').then(module => ({ default: module.ManageCompanies })));
const AdminCompanyEditor = React.lazy(() => import('./halaman/admin/AdminCompanyEditor').then(module => ({ default: module.AdminCompanyEditor })));
const ManageJobs = React.lazy(() => import('./halaman/admin/ManageJobs').then(module => ({ default: module.ManageJobs })));
const AdminJobEditor = React.lazy(() => import('./halaman/admin/AdminJobEditor').then(module => ({ default: module.AdminJobEditor })));
const AdminSiteSettings = React.lazy(() => import('./halaman/admin/AdminSiteSettings').then(module => ({ default: module.AdminSiteSettings })));
const AdminOptions = React.lazy(() => import('./halaman/admin/AdminOptions').then(module => ({ default: module.AdminOptions })));
const AdminSkills = React.lazy(() => import('./halaman/admin/AdminSkills').then(module => ({ default: module.AdminSkills })));
const AdminUsers = React.lazy(() => import('./halaman/admin/AdminUsers').then(module => ({ default: module.AdminUsers })));
const AdminNotifications = React.lazy(() => import('./halaman/admin/AdminNotifications').then(module => ({ default: module.AdminNotifications })));
const AdminClasses = React.lazy(() => import('./halaman/admin/AdminClasses').then(module => ({ default: module.AdminClasses })));
const AdminPages = React.lazy(() => import('./halaman/admin/AdminPages').then(module => ({ default: module.AdminPages })));

// Legal & Error
const PrivacyPolicy = React.lazy(() => import('./halaman/legal/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = React.lazy(() => import('./halaman/legal/TermsOfService').then(module => ({ default: module.TermsOfService })));
const CookiesPolicy = React.lazy(() => import('./halaman/legal/CookiesPolicy').then(module => ({ default: module.CookiesPolicy })));
const Disclaimer = React.lazy(() => import('./halaman/legal/Disclaimer').then(module => ({ default: module.Disclaimer })));
const HelpCenter = React.lazy(() => import('./halaman/legal/HelpCenter').then(module => ({ default: module.HelpCenter })));
const ContactUs = React.lazy(() => import('./halaman/legal/ContactUs').then(module => ({ default: module.ContactUs })));
const NotFound = React.lazy(() => import('./halaman/error/NotFound').then(module => ({ default: module.NotFound })));
const ServerError = React.lazy(() => import('./halaman/error/ServerError').then(module => ({ default: module.ServerError })));

const AppRoutes = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/user') || location.pathname.startsWith('/admin');

  return (
      <Suspense fallback={null}>
        <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Beranda />} />
              <Route path="pekerjaan" element={<Pekerjaan />} />
              <Route path="pekerjaan/:slug" element={<DetailPekerjaan />} />
              
              <Route path="pelamar" element={<Pelamar />} />
              <Route path="profil/:username" element={<Profil />} />
              
              <Route path="perusahaan" element={<Perusahaan />} />
              <Route path="perusahaan/:slug" element={<DetailPerusahaan />} />
              <Route path="penawaran" element={<Penawaran />} />
              
              <Route path="kelas" element={<Kelas />} />
              <Route path="kelas/:slug" element={<DetailKelas />} />
              <Route path="mentor/:slug" element={<DetailMentor />} />
              <Route path="pembayaran" element={<Pembayaran />} />

              {/* Legal Pages */}
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="cookies" element={<CookiesPolicy />} />
              <Route path="disclaimer" element={<Disclaimer />} />
              <Route path="help" element={<HelpCenter />} />
              <Route path="faq" element={<HelpCenter />} />
              <Route path="contact" element={<ContactUs />} />
              
              {/* Error Pages */}
              <Route path="500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Standalone Routes */}
            <Route path="/user/cv" element={<CVOnline />} />
            <Route path="/cv/:username" element={<CVOnline />} />
            <Route path="/signature/:username" element={<SignaturePreview />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* User Routes */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="company" element={<UserCompanyProfile />} />
              <Route path="jobs" element={<UserJobs />} />
              <Route path="jobs/new" element={<UserJobEditor />} />
              <Route path="jobs/:id/edit" element={<UserJobEditor />} />
              <Route path="services" element={<UserServices />} />
              <Route path="letters" element={<UserLetterBuilder />} /> 
              <Route path="signature" element={<UserSignature />} /> 
              <Route path="settings" element={<UserSettings />} />
              <Route path="notifications" element={<UserNotifications />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="notifications" element={<AdminNotifications />} />
              
              <Route path="companies" element={<ManageCompanies />} />
              <Route path="companies/new" element={<AdminCompanyEditor />} />
              <Route path="companies/:id" element={<AdminCompanyEditor />} />
              
              <Route path="jobs" element={<ManageJobs />} />
              <Route path="jobs/new" element={<AdminJobEditor />} />
              <Route path="jobs/:id" element={<AdminJobEditor />} />
              
              <Route path="settings" element={<AdminSiteSettings />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="options" element={<AdminOptions />} />
              <Route path="skills" element={<AdminSkills />} />
            </Route>
            
        </Routes>
      </Suspense>
  );
};

const App = () => {
  useEffect(() => {
    // Prefetch KV data for optimization
    routingData.prefetchReferenceData();

    // Fetch Identity for Favicon
    routingData.getIdentity().then(data => {
      if (data && data.icoUrl) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = data.icoUrl;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = data.icoUrl;
          document.head.appendChild(newLink);
        }
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <DataProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <LoadingProvider>
              <ScrollToTop /> 
              <AppRoutes />
            </LoadingProvider>
          </Router>
        </DataProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
