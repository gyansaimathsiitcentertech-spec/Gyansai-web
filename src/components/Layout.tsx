import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Clock, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Courses', to: '/courses' },
  { label: 'Exams', to: '/exams' },
  { label: 'Lectures', to: '/lectures' },
  { label: 'Results', to: '/results' },
  { label: 'Faculty', to: '/faculty' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Blogs', to: '/blogs' },
  { label: 'Contact', to: '/contact' },
];

export function Layout() {
  const { pathname } = useLocation();
  const { site, courses } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setMenuOpen(false);
  }, [pathname]);

  const waDigits = (site.whatsapp || site.phone || '').replace(/\D/g, '');
  const waMessage = `Hello ${site.institute_name}, I would like to know about batch timings and admissions.`;
  const [popupDismissed, setPopupDismissed] = useState(false);

  useEffect(() => {
    if (site.popup_enabled) {
      setPopupDismissed(false);
    }
  }, [site.popup_enabled, site.popup_title]);

  const navBg = site.header_bg || '#142A58';
  const navText = site.header_text_color || '#FFFFFF';
  const navActive = site.nav_active_color || '#FFBE1B';

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#AA2451] focus:px-4 focus:py-2 text-sm font-bold text-white"
      >
        Skip to content
      </a>

      {/* Optional Admin-Controlled Top Announcement Bar */}
      {site.announcement_enabled && site.announcement_text && (
        <div
          className="px-4 py-2 text-center text-xs font-semibold sm:text-sm"
          style={{
            backgroundColor: site.announcement_bg || '#FFBE1B',
            color: site.announcement_text_color || '#142A58',
          }}
        >
          <div className="shell">{site.announcement_text}</div>
        </div>
      )}

      {/* Brand & Quick Action Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:static">
        <div className="shell flex min-h-16 items-center justify-between gap-3 py-2 sm:gap-6">
          <Link
            to="/"
            className="display-face flex min-w-0 items-center gap-2 text-base font-extrabold tracking-tight text-[#1F386B] transition hover:text-[#AA2451] sm:text-xl"
          >
            {site.logo_url ? (
              <img
                src={site.logo_url}
                alt={site.institute_name}
                style={{
                  width: `${Math.min(280, Math.max(48, Number(site.logo_width) || 180))}px`,
                  height: `${Math.min(84, Math.max(28, Number(site.logo_height) || 48))}px`,
                }}
                className="max-w-[180px] object-contain object-left sm:max-w-none"
              />
            ) : (
              <span className="truncate">
                {site.institute_name.includes(' ') ? (
                  <>
                    {site.institute_name.split(' ')[0]}{' '}
                    <span className="text-[#AA2451]">
                      {site.institute_name.split(' ').slice(1).join(' ')}
                    </span>
                  </>
                ) : (
                  site.institute_name
                )}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-6 text-xs font-medium text-slate-600 md:flex">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono-num font-semibold text-[#1F386B] transition hover:text-[#AA2451]"
            >
              <Phone className="h-3.5 w-3.5 text-[#AA2451]" aria-hidden="true" />
              <span>{site.phone}</span>
            </a>
            <span className="hidden text-slate-300 xl:inline" aria-hidden="true">
              |
            </span>
            <span className="hidden whitespace-nowrap text-slate-600 xl:inline">
              New Usmanpura, Chhatrapati Sambhajinagar
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {site.show_header_cta !== false && (
              <Link
                to={site.header_cta_link || '/admission'}
                className="hidden shrink-0 whitespace-nowrap rounded-lg bg-[#AA2451] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8E1C42] sm:inline-flex"
              >
                {site.header_cta_label || 'Enroll Now'}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-[#1F386B] transition hover:bg-slate-50 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer */}
        {menuOpen && (
          <div
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 lg:hidden"
            style={{ backgroundColor: navBg }}
          >
            <nav aria-label="Mobile navigation" className="shell grid gap-1 py-4">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  style={({ isActive }) => ({
                    color: isActive ? navActive : navText,
                  })}
                  className={({ isActive }) =>
                    `rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-white/10 font-semibold' : 'opacity-90 hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-3 grid gap-2 border-t border-white/15 pt-3 sm:grid-cols-2">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 font-mono-num text-xs font-semibold text-white"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{site.phone}</span>
                </a>
                {site.show_header_cta !== false && (
                  <Link
                    to={site.header_cta_link || '/admission'}
                    className="inline-flex items-center justify-center rounded-lg bg-[#AA2451] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    {site.header_cta_label || 'Apply for Admission'}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Deep Navy Full-Width Navigation Bar (Sticky on Desktop) */}
      <nav
        aria-label="Primary navigation"
        className="sticky top-0 z-40 hidden shadow-sm lg:block"
        style={{ backgroundColor: navBg }}
      >
        <div className="shell">
          <div className="flex h-12 items-center justify-between gap-3 overflow-x-auto xl:gap-5">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  color: isActive ? navActive : navText,
                })}
                className="shrink-0 whitespace-nowrap py-2 text-sm font-medium tracking-normal transition-opacity hover:opacity-80 xl:text-[15px]"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Deep Charcoal-Navy Footer (Lalit Tutorials Architecture) */}
      <footer className="bg-[#141D33] text-white/80">
        <div className="h-1 w-full bg-gradient-to-r from-[#1F386B] via-[#AA2451] to-[#1F386B]" />
        <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="display-face text-xl font-bold text-white">
              {site.institute_name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{site.footer_about}</p>
            <p className="mt-4 text-xs text-white/55">
              Est. 2009 · {site.founder_name || 'Prof. Taterao Kendre (KT Sir)'}
            </p>
          </div>

          <div>
            <h3 className="display-face text-sm font-bold text-white">Quick Links</h3>
            <div className="mt-2 h-0.5 w-8 bg-[#AA2451]" aria-hidden="true" />
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/results" className="transition hover:text-white">
                  Achievements &amp; Results
                </Link>
              </li>
              <li>
                <Link to="/exams" className="transition hover:text-white">
                  GMAT &amp; Exam Notices
                </Link>
              </li>
              <li>
                <Link to="/lectures" className="transition hover:text-white">
                  Gyansai e-Learning
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="transition hover:text-white">
                  Faculty &amp; Mentors
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="transition hover:text-white">
                  Campus Gallery
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="transition hover:text-white">
                  Study Materials &amp; Articles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="display-face text-sm font-bold text-white">Popular Programmes</h3>
            <div className="mt-2 h-0.5 w-8 bg-[#AA2451]" aria-hidden="true" />
            <ul className="mt-4 space-y-2.5 text-sm">
              {courses.slice(0, 6).map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="transition hover:text-white"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="display-face text-sm font-bold text-white">Quick Contact</h3>
            <div className="mt-2 h-0.5 w-8 bg-[#AA2451]" aria-hidden="true" />
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8FB1]" aria-hidden="true" />
                <div className="space-y-0.5">
                  <a href={`tel:${site.phone}`} className="block font-mono-num hover:text-white">
                    {site.phone}
                  </a>
                  {site.secondary_phone && (
                    <a
                      href={`tel:${site.secondary_phone}`}
                      className="block font-mono-num hover:text-white"
                    >
                      {site.secondary_phone}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8FB1]" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8FB1]" aria-hidden="true" />
                <span>{site.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8FB1]" aria-hidden="true" />
                <span>{site.office_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row">
            <p>
              © {new Date().getFullYear()}{' '}
              {site.footer_copyright ||
                `${site.institute_name}, Chhatrapati Sambhajinagar. All rights reserved.`}
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition hover:text-white">
                Terms &amp; Conditions
              </Link>
              <Link to="/admin" className="transition hover:text-white">
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Optional Admin-Controlled Floating Apply Pill Button */}
      {site.show_floating_cta && (
        <Link
          to={site.floating_cta_link || '/admission'}
          className="fixed bottom-20 right-5 z-30 inline-flex items-center rounded-full bg-[#AA2451] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#8E1C42]"
        >
          {site.floating_cta_label || 'Apply Now'}
        </Link>
      )}

      {/* Floating WhatsApp Quick Help Button */}
      {waDigits && (
        <a
          href={`https://wa.me/${waDigits}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Gyansai Maths IIT Center on WhatsApp"
          className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F386B]"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </a>
      )}

      {/* Optional Admin-Enabled Admission Popup */}
      {site.popup_enabled && !popupDismissed && site.popup_title && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13254B]/70 p-4 backdrop-blur-xs"
          onClick={() => setPopupDismissed(true)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="display-face text-xl font-bold text-[#1F386B]">{site.popup_title}</h3>
              <button
                type="button"
                onClick={() => setPopupDismissed(true)}
                aria-label="Close notice"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {site.popup_body && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{site.popup_body}</p>
            )}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPopupDismissed(true)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Dismiss
              </button>
              <Link
                to={site.popup_cta_link || '/admission'}
                onClick={() => setPopupDismissed(true)}
                className="rounded-lg bg-[#AA2451] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8E1C42]"
              >
                {site.popup_cta_label || 'Register Now'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
