import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ResultsPage } from './pages/ResultsPage';
import { ExamsPage } from './pages/ExamsPage';
import { LecturesPage } from './pages/LecturesPage';
import { FacultyPage } from './pages/FacultyPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { GalleryPage } from './pages/GalleryPage';
import { BlogDetailPage, BlogsPage } from './pages/BlogsPage';
import { ContactPage } from './pages/ContactPage';
import { AdmissionPage } from './pages/AdmissionPage';
import { LegalPage } from './pages/LegalPage';
import { LoginPage } from './pages/LoginPage';
import { AdminConsolePage } from './pages/AdminConsolePage';

function NotFoundPage() {
  return (
    <section className="shell py-24 text-center">
      <p className="font-mono-num text-xs font-semibold text-[#AA2451]">404</p>
      <h1 className="display-face mt-2 text-3xl font-bold text-[#1F386B] sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        The page you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-lg bg-[#AA2451] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8E1C42]"
      >
        Return to Homepage
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SiteProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/lectures" element={<LecturesPage />} />
                <Route path="/faculty" element={<FacultyPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blogs/:slug" element={<BlogDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admission" element={<AdmissionPage />} />
                <Route path="/privacy-policy" element={<LegalPage mode="privacy" />} />
                <Route path="/terms" element={<LegalPage mode="terms" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminConsolePage />} />
              <Route path="/admin/:section" element={<AdminConsolePage />} />
            </Routes>
          </BrowserRouter>
        </SiteProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
