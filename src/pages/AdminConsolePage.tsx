import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import {
  Award,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  ListChecks,
  Loader2,
  LogOut,
  Menu,
  MessageSquareQuote,
  Navigation,
  PanelBottom,
  Phone,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Type,
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import {
  ASSETS,
  CAMPUS_ECOSYSTEM,
  DEFAULT_BLOGS,
  DEFAULT_COURSES,
  DEFAULT_EXAMS,
  DEFAULT_FACULTY,
  DEFAULT_GALLERY,
  DEFAULT_LECTURES,
  DEFAULT_RESULTS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TESTIMONIALS,
} from '../data/gyansaiData';
import type {
  AdmissionRecord,
  BlogPost,
  Course,
  EnquiryRecord,
  ExamNotice,
  FacultyMember,
  GalleryItem,
  SiteSettings,
  StudentResult,
  Testimonial,
  VideoLecture,
} from '../types';
import { AdminAcademicsPanels, adminInputCls } from '../components/admin/AdminAcademicsPanels';

type AdminTab =
  | 'dashboard'
  | 'settings'
  | 'navigation'
  | 'homepage'
  | 'about'
  | 'courses-page'
  | 'labels'
  | 'facilities'
  | 'banners'
  | 'popup'
  | 'seo'
  | 'footer'
  | 'contact'
  | 'courses'
  | 'exams'
  | 'lectures'
  | 'results'
  | 'faculty'
  | 'testimonials'
  | 'gallery'
  | 'blogs'
  | 'enquiries'
  | 'admissions';

interface NavGroup {
  heading: string;
  items: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const SIDEBAR_GROUPS: NavGroup[] = [
  {
    heading: 'OVERVIEW',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    heading: 'WEBSITE CONTENT',
    items: [
      { id: 'settings', label: 'Website Settings', icon: Settings },
      { id: 'navigation', label: 'Header & Navigation', icon: Navigation },
      { id: 'homepage', label: 'Homepage Sections', icon: LayoutTemplate },
      { id: 'about', label: 'About Page', icon: FileText },
      { id: 'courses-page', label: 'Courses Page', icon: ListChecks },
      { id: 'labels', label: 'Page Texts & Labels', icon: Type },
      { id: 'facilities', label: 'Campus Facilities', icon: Building2 },
      { id: 'banners', label: 'Homepage Banners', icon: LayoutGrid },
      { id: 'popup', label: 'Admission Popup', icon: Sparkles },
      { id: 'seo', label: 'SEO Settings', icon: Search },
      { id: 'footer', label: 'Footer Settings', icon: PanelBottom },
      { id: 'contact', label: 'Contact Settings', icon: Phone },
    ],
  },
  {
    heading: 'ACADEMICS',
    items: [
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'exams', label: 'Exams', icon: Calendar },
      { id: 'lectures', label: 'Lectures', icon: Video },
      { id: 'results', label: 'Results', icon: Award },
      { id: 'faculty', label: 'Faculty', icon: Users },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
      { id: 'gallery', label: 'Gallery', icon: ImageIcon },
      { id: 'blogs', label: 'Blogs', icon: FileText },
    ],
  },
  {
    heading: 'LEADS & ENROLLMENT',
    items: [
      { id: 'enquiries', label: 'Enquiries', icon: Inbox },
      { id: 'admissions', label: 'Admissions', icon: Bell },
    ],
  },
];

const BUILTIN_ASSETS = [
  { label: 'Main Classroom', url: ASSETS.hero },
  { label: 'Mentoring Session', url: ASSETS.mentoring },
  { label: 'Study Hall', url: ASSETS.studyHall },
  { label: 'IIT Study Desk', url: ASSETS.courseDesk },
  { label: 'Toppers Celebration', url: ASSETS.toppers },
];

const ALL_VALID_TABS = new Set<string>(
  SIDEBAR_GROUPS.flatMap((g) => g.items.map((item) => item.id))
);

export function AdminConsolePage() {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const { site, refreshSiteData } = useSite();

  const initialTab: AdminTab =
    section && ALL_VALID_TABS.has(section) ? (section as AdminTab) : 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'logo_url' | 'favicon_url' | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [siteForm, setSiteForm] = useState<SiteSettings>(site);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [dbExams, setDbExams] = useState<ExamNotice[]>([]);
  const [dbLectures, setDbLectures] = useState<VideoLecture[]>([]);
  const [dbResults, setDbResults] = useState<StudentResult[]>([]);
  const [dbFaculty, setDbFaculty] = useState<FacultyMember[]>([]);
  const [dbTestimonials, setDbTestimonials] = useState<Testimonial[]>([]);
  const [dbGallery, setDbGallery] = useState<GalleryItem[]>([]);
  const [dbBlogs, setDbBlogs] = useState<BlogPost[]>([]);
  const [dbEnquiries, setDbEnquiries] = useState<EnquiryRecord[]>([]);
  const [dbAdmissions, setDbAdmissions] = useState<AdmissionRecord[]>([]);

  useEffect(() => {
    if (section && ALL_VALID_TABS.has(section)) {
      setActiveTab(section as AdminTab);
    }
  }, [section]);

  useEffect(() => {
    setSiteForm(site);
  }, [site]);

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    navigate(`/admin/${tab}`, { replace: true });
  };

  const loadAllAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setBusy(true);
    setErrorMsg('');
    try {
      const [
        cSnap,
        eSnap,
        lSnap,
        rSnap,
        fSnap,
        tSnap,
        gSnap,
        bSnap,
        enqSnap,
        admSnap,
      ] = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'exams')),
        getDocs(collection(db, 'lectures')),
        getDocs(collection(db, 'results')),
        getDocs(collection(db, 'faculty')),
        getDocs(collection(db, 'testimonials')),
        getDocs(collection(db, 'gallery_media')),
        getDocs(collection(db, 'blogs')),
        getDocs(collection(db, 'enquiries')),
        getDocs(collection(db, 'admissions')),
      ]);

      setDbCourses(cSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Course, 'id'>) })));
      setDbExams(eSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ExamNotice, 'id'>) })));
      setDbLectures(
        lSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VideoLecture, 'id'>) }))
      );
      setDbResults(
        rSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StudentResult, 'id'>) }))
      );
      setDbFaculty(
        fSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FacultyMember, 'id'>) }))
      );
      setDbTestimonials(
        tSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) }))
      );
      setDbGallery(gSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) })));
      setDbBlogs(bSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) })));
      setDbEnquiries(
        enqSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EnquiryRecord, 'id'>) }))
      );
      setDbAdmissions(
        admSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdmissionRecord, 'id'>) }))
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to load admin records.');
    } finally {
      setBusy(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    void loadAllAdminData();
  }, [loadAllAdminData]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB]">
        <Loader2 className="h-6 w-6 animate-spin text-[#142A58]" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const notify = (msg: string) => {
    setFeedback(msg);
    setErrorMsg('');
    window.setTimeout(() => setFeedback(''), 4000);
  };

  const safeRequired = (val: string | undefined, minLen: number, maxLen: number, fallback: string) => {
    const cleaned = (val || '').trim();
    return (cleaned.length >= minLen ? cleaned : fallback).slice(0, maxLen);
  };

  const buildCoreSitePayload = (form: SiteSettings) => ({
    institute_name: safeRequired(form.institute_name, 2, 140, DEFAULT_SITE_SETTINGS.institute_name),
    tagline: (form.tagline || '').trim().slice(0, 300),
    phone: safeRequired(form.phone, 7, 40, DEFAULT_SITE_SETTINGS.phone),
    secondary_phone: (form.secondary_phone || '').trim().slice(0, 40),
    email: safeRequired(form.email, 5, 120, DEFAULT_SITE_SETTINGS.email),
    whatsapp: (form.whatsapp || '').trim().slice(0, 30),
    address: safeRequired(form.address, 5, 300, DEFAULT_SITE_SETTINGS.address),
    office_hours: (form.office_hours || '').trim().slice(0, 120),
    logo_url: (form.logo_url || '').trim().slice(0, 500),
    favicon_url: (form.favicon_url || '').trim().slice(0, 500),
    logo_width: Number(form.logo_width) || 180,
    logo_height: Number(form.logo_height) || 48,
    header_bg: (form.header_bg || '#142A58').trim().slice(0, 20),
    header_text_color: (form.header_text_color || '#FFFFFF').trim().slice(0, 20),
    nav_active_color: (form.nav_active_color || '#FFBE1B').trim().slice(0, 20),
    announcement_enabled: Boolean(form.announcement_enabled),
    announcement_text: (form.announcement_text || '').trim().slice(0, 260),
    announcement_bg: (form.announcement_bg || '#FFBE1B').trim().slice(0, 20),
    announcement_text_color: (form.announcement_text_color || '#142A58').trim().slice(0, 20),
    show_header_cta: Boolean(form.show_header_cta),
    header_cta_label: (form.header_cta_label || 'Enroll Now').trim().slice(0, 60),
    header_cta_link: (form.header_cta_link || '/admission').trim().slice(0, 200),
    show_floating_cta: Boolean(form.show_floating_cta),
    floating_cta_label: (form.floating_cta_label || 'Apply Now').trim().slice(0, 60),
    floating_cta_link: (form.floating_cta_link || '/admission').trim().slice(0, 200),
    hero_title: (form.hero_title || '').trim().slice(0, 160),
    hero_subtitle: (form.hero_subtitle || '').trim().slice(0, 260),
    about_heading: (form.about_heading || '').trim().slice(0, 200),
    about_intro: (form.about_intro || '').trim().slice(0, 600),
    footer_about: (form.footer_about || '').trim().slice(0, 400),
    updatedAt: serverTimestamp(),
  });

  const buildPagesSettingsPayload = (form: SiteSettings) => ({
    founder_name: (form.founder_name || '').trim().slice(0, 120),
    founder_message: (form.founder_message || '').trim().slice(0, 800),
    courses_page_title: (form.courses_page_title || '').trim().slice(0, 160),
    courses_page_subtitle: (form.courses_page_subtitle || '').trim().slice(0, 300),
    show_quick_links: Boolean(form.show_quick_links),
    show_value_offerings: Boolean(form.show_value_offerings),
    show_results_section: Boolean(form.show_results_section),
    show_lectures_section: Boolean(form.show_lectures_section),
    show_courses_section: Boolean(form.show_courses_section),
    show_location_section: Boolean(form.show_location_section),
    stat_selections_value: (form.stat_selections_value || '1,450+').trim().slice(0, 30),
    stat_selections_label: (form.stat_selections_label || '').trim().slice(0, 120),
    stat_percentile_value: (form.stat_percentile_value || '99.8+').trim().slice(0, 30),
    stat_percentile_label: (form.stat_percentile_label || '').trim().slice(0, 120),
    popup_enabled: Boolean(form.popup_enabled),
    popup_title: (form.popup_title || '').trim().slice(0, 140),
    popup_body: (form.popup_body || '').trim().slice(0, 500),
    popup_cta_label: (form.popup_cta_label || 'Register Now').trim().slice(0, 60),
    popup_cta_link: (form.popup_cta_link || '/admission').trim().slice(0, 200),
    seo_title: (form.seo_title || '').trim().slice(0, 140),
    seo_description: (form.seo_description || '').trim().slice(0, 300),
    seo_keywords: (form.seo_keywords || '').trim().slice(0, 300),
    footer_copyright: (form.footer_copyright || '').trim().slice(0, 200),
    map_query: (form.map_query || '').trim().slice(0, 300),
    exam_portal_url: (form.exam_portal_url || 'https://gyansaipp.vercel.app/').trim().slice(0, 300),
    updatedAt: serverTimestamp(),
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'site'), buildCoreSitePayload(siteForm)),
        setDoc(doc(db, 'settings', 'pages'), buildPagesSettingsPayload(siteForm)),
      ]);
      await refreshSiteData();
      notify('Changes saved and live on the website immediately.');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, 'settings/site');
      } catch (wrapped) {
        setErrorMsg(wrapped instanceof Error ? wrapped.message : 'Could not save settings.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSeedDefaults = async () => {
    setBusy(true);
    setErrorMsg('');
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'site'), buildCoreSitePayload(DEFAULT_SITE_SETTINGS)),
        setDoc(doc(db, 'settings', 'pages'), buildPagesSettingsPayload(DEFAULT_SITE_SETTINGS)),
      ]);
      for (const c of DEFAULT_COURSES) {
        const { id, ...rest } = c;
        await setDoc(doc(db, 'courses', id), { ...rest, updatedAt: serverTimestamp() });
      }
      for (const ex of DEFAULT_EXAMS) {
        const { id, ...rest } = ex;
        await setDoc(doc(db, 'exams', id), { ...rest, updatedAt: serverTimestamp() });
      }
      for (const lec of DEFAULT_LECTURES) {
        const { id, ...rest } = lec;
        await setDoc(doc(db, 'lectures', id), { ...rest, updatedAt: serverTimestamp() });
      }
      for (const r of DEFAULT_RESULTS) {
        const { id, ...rest } = r;
        await setDoc(doc(db, 'results', id), { ...rest, updatedAt: serverTimestamp() });
      }
      for (const fac of DEFAULT_FACULTY) {
        const { id, ...rest } = fac;
        await setDoc(doc(db, 'faculty', id), { ...rest, updatedAt: serverTimestamp() });
      }
      for (const tes of DEFAULT_TESTIMONIALS) {
        const { id, ...rest } = tes;
        await setDoc(doc(db, 'testimonials', id), { ...rest, updatedAt: serverTimestamp() });
      }
      for (const gal of DEFAULT_GALLERY) {
        const { id, ...rest } = gal;
        await setDoc(doc(db, 'gallery_media', id), { ...rest, updatedAt: serverTimestamp() });
      }
      for (const b of DEFAULT_BLOGS) {
        const { id, ...rest } = b;
        await setDoc(doc(db, 'blogs', id), { ...rest, updatedAt: serverTimestamp() });
      }
      await Promise.all([loadAllAdminData(), refreshSiteData()]);
      notify('All default Gyansai Maths IIT Center content synced to Firestore.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to sync default data.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteDoc = async (colName: string, docId: string) => {
    setBusy(true);
    try {
      await deleteDoc(doc(db, colName, docId));
      await Promise.all([loadAllAdminData(), refreshSiteData()]);
      notify('Record deleted.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not delete record.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateLeadStatus = async (
    colName: 'enquiries' | 'admissions',
    docId: string,
    status: string
  ) => {
    try {
      await updateDoc(doc(db, colName, docId), { status });
      await loadAllAdminData();
      notify('Lead status updated.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not update status.');
    }
  };

  const isAcademicTab = [
    'courses',
    'exams',
    'lectures',
    'results',
    'faculty',
    'testimonials',
    'gallery',
    'blogs',
  ].includes(activeTab);

  const SaveButton = () => (
    <div className="flex justify-end pt-4">
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-[#142A58] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0D1E42] disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>Save changes</span>
      </button>
    </div>
  );

  const SidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Sidebar Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FFBE1B] text-base font-extrabold text-[#142A58]">
          G
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#142A58]">Admin console</p>
          <p className="truncate text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            {siteForm.institute_name || 'GYANSAI MATHS IIT'}
          </p>
        </div>
      </div>

      {/* Scrollable Categorized Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.heading}
            </p>
            <nav className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectTab(id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition ${
                      active
                        ? 'bg-[#142A58] font-semibold text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#142A58]'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Pinned Bottom Actions */}
      <div className="shrink-0 border-t border-slate-200 p-3 space-y-1">
        <Link
          to="/"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#142A58]"
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
          <span>View website</span>
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] text-slate-900">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="relative h-full w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Crisp White Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="rounded-lg border border-slate-200 p-1.5 text-[#142A58] hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <p className="truncate text-xs font-medium text-slate-500">
              Content management for {siteForm.institute_name}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">{user?.email}</span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
              ADMIN
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#142A58] transition hover:bg-slate-50"
            >
              <span>View site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content Workspace */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">
          {feedback && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Live overview of Firestore CMS collections, student enquiries, and admission
                  applications.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Courses', count: dbCourses.length, tab: 'courses' as AdminTab },
                  { label: 'Published Results', count: dbResults.length, tab: 'results' as AdminTab },
                  { label: 'Parent Enquiries', count: dbEnquiries.length, tab: 'enquiries' as AdminTab },
                  { label: 'Admissions', count: dbAdmissions.length, tab: 'admissions' as AdminTab },
                  { label: 'Exam Notices', count: dbExams.length, tab: 'exams' as AdminTab },
                  { label: 'Video Lectures', count: dbLectures.length, tab: 'lectures' as AdminTab },
                  { label: 'Faculty Profiles', count: dbFaculty.length, tab: 'faculty' as AdminTab },
                  { label: 'Blog Articles', count: dbBlogs.length, tab: 'blogs' as AdminTab },
                ].map((stat) => (
                  <button
                    key={stat.label}
                    type="button"
                    onClick={() => selectTab(stat.tab)}
                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-xs transition hover:border-[#142A58]/40"
                  >
                    <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                    <p className="font-mono-num mt-2 text-3xl font-bold text-[#142A58]">
                      {stat.count}
                    </p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="display-face text-lg font-bold text-[#142A58]">
                  Initialize Full Firestore CMS Dataset
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Sync all default Gyansai Maths IIT Center website settings, courses, exam
                  notices, video lectures, verified student results, faculty profiles, testimonials,
                  gallery photos, and articles to Firestore in one click.
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleSeedDefaults()}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#142A58] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0D1E42] disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  <span>Sync All Default Gyansai Data to Firestore</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. WEBSITE SETTINGS & ANNOUNCEMENTS (Exact Layout from Reference) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">
                  Website Settings &amp; Announcements
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Update institute name, logo dimensions, favicon, header colours, and top
                  announcement bar.
                </p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6"
              >
                {/* Row 1: Institute Name + Tagline */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Institute name
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.institute_name}
                      onChange={(e) => setSiteForm({ ...siteForm, institute_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Tagline
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.tagline}
                      onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 2: Institute Logo + Site Favicon with Preview Boxes */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Institute Logo
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        placeholder="/src/assets/images/... or https://..."
                        className={adminInputCls}
                        value={siteForm.logo_url}
                        onChange={(e) => setSiteForm({ ...siteForm, logo_url: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setAssetPickerTarget('logo_url')}
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-[#142A58] transition hover:bg-slate-100"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload image</span>
                      </button>
                    </div>
                    <div className="mt-3 flex h-24 w-full max-w-[11rem] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {siteForm.logo_url ? (
                        <img
                          src={siteForm.logo_url}
                          alt="Institute logo preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <p className="display-face text-sm font-extrabold text-[#1F386B]">
                            {siteForm.institute_name || 'Gyansai Maths IIT Center'}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">Wordmark active</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Site Favicon
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        placeholder="/favicon.png or https://..."
                        className={adminInputCls}
                        value={siteForm.favicon_url}
                        onChange={(e) => setSiteForm({ ...siteForm, favicon_url: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setAssetPickerTarget('favicon_url')}
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-[#142A58] transition hover:bg-slate-100"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload image</span>
                      </button>
                    </div>
                    <div className="mt-3 flex h-24 w-full max-w-[11rem] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {siteForm.favicon_url ? (
                        <img
                          src={siteForm.favicon_url}
                          alt="Favicon preview"
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#142A58] text-xl font-extrabold text-[#FFBE1B]">
                          G
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 3: Dimensions + Header Colors */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Logo width (px)
                    </label>
                    <input
                      type="number"
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.logo_width}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, logo_width: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Logo height (px)
                    </label>
                    <input
                      type="number"
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.logo_height}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, logo_height: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Header background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        aria-label="Header background color picker"
                        value={siteForm.header_bg || '#142A58'}
                        onChange={(e) => setSiteForm({ ...siteForm, header_bg: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-slate-200 p-1"
                      />
                      <input
                        className={`${adminInputCls} font-mono-num`}
                        value={siteForm.header_bg}
                        onChange={(e) => setSiteForm({ ...siteForm, header_bg: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Header text color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        aria-label="Header text color picker"
                        value={siteForm.header_text_color || '#FFFFFF'}
                        onChange={(e) =>
                          setSiteForm({ ...siteForm, header_text_color: e.target.value })
                        }
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-slate-200 p-1"
                      />
                      <input
                        className={`${adminInputCls} font-mono-num`}
                        value={siteForm.header_text_color}
                        onChange={(e) =>
                          setSiteForm({ ...siteForm, header_text_color: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Top Announcement Bar */}
                <div className="space-y-4 border-t border-slate-100 pt-5">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-[#142A58]">
                    <input
                      type="checkbox"
                      checked={siteForm.announcement_enabled}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, announcement_enabled: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#142A58] focus:ring-[#142A58]"
                    />
                    <span>Show top announcement bar</span>
                  </label>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Announcement text
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.announcement_text}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, announcement_text: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Announcement background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          aria-label="Announcement background picker"
                          value={siteForm.announcement_bg || '#FFBE1B'}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, announcement_bg: e.target.value })
                          }
                          className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-slate-200 p-1"
                        />
                        <input
                          className={`${adminInputCls} font-mono-num`}
                          value={siteForm.announcement_bg}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, announcement_bg: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Announcement text color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          aria-label="Announcement text color picker"
                          value={siteForm.announcement_text_color || '#142A58'}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, announcement_text_color: e.target.value })
                          }
                          className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-slate-200 p-1"
                        />
                        <input
                          className={`${adminInputCls} font-mono-num`}
                          value={siteForm.announcement_text_color}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, announcement_text_color: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 5: Header & Floating Action Buttons */}
                <div className="space-y-3 border-t border-slate-100 pt-5">
                  <h2 className="text-sm font-bold text-[#142A58]">
                    Header &amp; Floating Action Buttons
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-5 space-y-3.5">
                      <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs font-bold text-[#142A58]">
                        <input
                          type="checkbox"
                          checked={siteForm.show_header_cta}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, show_header_cta: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-[#142A58]"
                        />
                        <span>Show Header CTA Button</span>
                      </label>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Header button label
                        </label>
                        <input
                          className={adminInputCls}
                          value={siteForm.header_cta_label}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, header_cta_label: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Header button link
                        </label>
                        <input
                          className={adminInputCls}
                          value={siteForm.header_cta_link}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, header_cta_link: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-5 space-y-3.5">
                      <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs font-bold text-[#142A58]">
                        <input
                          type="checkbox"
                          checked={siteForm.show_floating_cta}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, show_floating_cta: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-[#142A58]"
                        />
                        <span>Show Floating Apply Pill Button</span>
                      </label>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Floating button label
                        </label>
                        <input
                          className={adminInputCls}
                          value={siteForm.floating_cta_label}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, floating_cta_label: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Floating button link
                        </label>
                        <input
                          className={adminInputCls}
                          value={siteForm.floating_cta_link}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, floating_cta_link: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <SaveButton />
              </form>
            </div>
          )}

          {/* 3. HEADER & NAVIGATION */}
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">
                  Header &amp; Navigation
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Customize the 11-link deep-navy navigation bar appearance and live active link
                  highlight.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
              >
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-500">Live Bar Preview</p>
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-3 text-xs font-medium"
                    style={{ backgroundColor: siteForm.header_bg || '#142A58' }}
                  >
                    {[
                      'Home',
                      'About',
                      'Courses',
                      'Exams',
                      'Lectures',
                      'Results',
                      'Faculty',
                      'Testimonials',
                      'Gallery',
                      'Blogs',
                      'Contact',
                    ].map((lbl, i) => (
                      <span
                        key={lbl}
                        style={{
                          color:
                            i === 0
                              ? siteForm.nav_active_color || '#FFBE1B'
                              : siteForm.header_text_color || '#FFFFFF',
                        }}
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Nav bar background
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.header_bg}
                      onChange={(e) => setSiteForm({ ...siteForm, header_bg: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Link text color
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.header_text_color}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, header_text_color: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Active link highlight
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.nav_active_color}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, nav_active_color: e.target.value })
                      }
                    />
                  </div>
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 4. HOMEPAGE SECTIONS */}
          {activeTab === 'homepage' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">Homepage Sections</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Enable or hide homepage blocks and update the impact counter statistics.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { key: 'show_quick_links' as const, label: 'Quick Enrollment 4-Tile Strip' },
                    { key: 'show_value_offerings' as const, label: 'Value Offerings (e-Learning & e-Exams)' },
                    { key: 'show_results_section' as const, label: 'Legacy of Excellence Results Grid' },
                    { key: 'show_lectures_section' as const, label: 'Inspiring the Aspirants Video Cards' },
                    { key: 'show_courses_section' as const, label: 'Popular Courses Track Showcase' },
                    { key: 'show_location_section' as const, label: 'Find Our Location & Enquiry Split' },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={siteForm[key]}
                        onChange={(e) => setSiteForm({ ...siteForm, [key]: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-[#142A58]"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Counter 1 Value (e.g. 1,450+)
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.stat_selections_value}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, stat_selections_value: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Counter 1 Label
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.stat_selections_label}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, stat_selections_label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Counter 2 Value (e.g. 99.8+)
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.stat_percentile_value}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, stat_percentile_value: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Counter 2 Label
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.stat_percentile_label}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, stat_percentile_label: e.target.value })
                      }
                    />
                  </div>
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 5. ABOUT PAGE */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">About Page</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Update the institutional overview and founder’s message displayed across the
                  website.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    About Section Heading
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.about_heading}
                    onChange={(e) => setSiteForm({ ...siteForm, about_heading: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Institutional Introduction
                  </label>
                  <textarea
                    rows={4}
                    className={adminInputCls}
                    value={siteForm.about_intro}
                    onChange={(e) => setSiteForm({ ...siteForm, about_intro: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Founder &amp; Lead Mentor Name
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.founder_name}
                    onChange={(e) => setSiteForm({ ...siteForm, founder_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Founder’s Message
                  </label>
                  <textarea
                    rows={4}
                    className={adminInputCls}
                    value={siteForm.founder_message}
                    onChange={(e) => setSiteForm({ ...siteForm, founder_message: e.target.value })}
                  />
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 6. COURSES PAGE */}
          {activeTab === 'courses-page' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">Courses Page</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Configure the Courses directory page header and introductory copy.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Courses Page Title
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.courses_page_title}
                    onChange={(e) =>
                      setSiteForm({ ...siteForm, courses_page_title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Courses Page Subtitle
                  </label>
                  <textarea
                    rows={3}
                    className={adminInputCls}
                    value={siteForm.courses_page_subtitle}
                    onChange={(e) =>
                      setSiteForm({ ...siteForm, courses_page_subtitle: e.target.value })
                    }
                  />
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 7. PAGE TEXTS & LABELS / 8. HOMEPAGE BANNERS */}
          {(activeTab === 'labels' || activeTab === 'banners') && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">
                  {activeTab === 'banners' ? 'Homepage Banners' : 'Page Texts & Labels'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Edit the primary hero headline, subtitle, and action button labels shown to
                  visitors.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Primary Hero Headline
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.hero_title}
                    onChange={(e) => setSiteForm({ ...siteForm, hero_title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={3}
                    className={adminInputCls}
                    value={siteForm.hero_subtitle}
                    onChange={(e) => setSiteForm({ ...siteForm, hero_subtitle: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Header Primary CTA Label
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.header_cta_label}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, header_cta_label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Floating Apply Pill Label
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.floating_cta_label}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, floating_cta_label: e.target.value })
                      }
                    />
                  </div>
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 9. CAMPUS FACILITIES */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">Campus Facilities</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Active New Usmanpura campus ecosystem highlights showcased on the About and
                  Gallery pages.
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {CAMPUS_ECOSYSTEM.map((item) => (
                  <div
                    key={item.title}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                    <div className="p-5">
                      <h2 className="display-face text-base font-bold text-[#142A58]">
                        {item.title}
                      </h2>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. ADMISSION POPUP */}
          {activeTab === 'popup' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">Admission Popup</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Optionally display a dismissible admission or scholarship test notice modal for
                  new visitors.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
              >
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs font-bold text-[#142A58]">
                  <input
                    type="checkbox"
                    checked={siteForm.popup_enabled}
                    onChange={(e) => setSiteForm({ ...siteForm, popup_enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#142A58]"
                  />
                  <span>Enable Admission Notice Popup on Website</span>
                </label>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Popup Headline
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.popup_title}
                    onChange={(e) => setSiteForm({ ...siteForm, popup_title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Popup Description
                  </label>
                  <textarea
                    rows={3}
                    className={adminInputCls}
                    value={siteForm.popup_body}
                    onChange={(e) => setSiteForm({ ...siteForm, popup_body: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      CTA Button Label
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.popup_cta_label}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, popup_cta_label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      CTA Destination Link
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.popup_cta_link}
                      onChange={(e) => setSiteForm({ ...siteForm, popup_cta_link: e.target.value })}
                    />
                  </div>
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 11. SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">SEO Settings</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage search engine title, meta description, and keywords dynamically applied to
                  the site.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5"
              >
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Search Engine Preview</span>
                  </div>
                  <p className="mt-1.5 text-base font-semibold text-[#1a0dab]">
                    {siteForm.seo_title || siteForm.institute_name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {siteForm.seo_description}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Meta Title
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.seo_title}
                    onChange={(e) => setSiteForm({ ...siteForm, seo_title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    className={adminInputCls}
                    value={siteForm.seo_description}
                    onChange={(e) => setSiteForm({ ...siteForm, seo_description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Keywords (comma separated)
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.seo_keywords}
                    onChange={(e) => setSiteForm({ ...siteForm, seo_keywords: e.target.value })}
                  />
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 12. FOOTER SETTINGS */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">Footer Settings</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Update the institute description and legal copyright line displayed in the dark
                  footer.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Footer About Summary
                  </label>
                  <textarea
                    rows={3}
                    className={adminInputCls}
                    value={siteForm.footer_about}
                    onChange={(e) => setSiteForm({ ...siteForm, footer_about: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Copyright Text
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.footer_copyright}
                    onChange={(e) => setSiteForm({ ...siteForm, footer_copyright: e.target.value })}
                  />
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 13. CONTACT SETTINGS */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">Contact Settings</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Update phone numbers, WhatsApp desk, campus address, office hours, and Google Maps
                  query.
                </p>
              </div>
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Primary Phone
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.phone}
                      onChange={(e) => setSiteForm({ ...siteForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Secondary Phone
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.secondary_phone}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, secondary_phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      WhatsApp Number
                    </label>
                    <input
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.whatsapp}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsapp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Official Email
                    </label>
                    <input
                      className={adminInputCls}
                      value={siteForm.email}
                      onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Office Hours
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.office_hours}
                    onChange={(e) => setSiteForm({ ...siteForm, office_hours: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Full Campus Address
                  </label>
                  <textarea
                    rows={2}
                    className={adminInputCls}
                    value={siteForm.address}
                    onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Google Map Location Query
                  </label>
                  <input
                    className={adminInputCls}
                    value={siteForm.map_query}
                    onChange={(e) => setSiteForm({ ...siteForm, map_query: e.target.value })}
                  />
                </div>
                <SaveButton />
              </form>
            </div>
          )}

          {/* 14. ACADEMICS CRUD PANELS */}
          {isAcademicTab && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold capitalize text-[#142A58]">
                  Manage {activeTab}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Publish, edit, or remove live {activeTab} records stored in Firestore.
                </p>
              </div>

              {activeTab === 'exams' && (
                <form
                  onSubmit={handleSaveSettings}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="display-face text-base font-bold text-[#142A58]">
                        Main Gyansai e-Exam Online Test Portal URL
                      </h2>
                      <p className="text-xs text-slate-500">
                        Powers the Gyansai e-Exams card on the Homepage and the embedded Test Portal
                        on the Exams page.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      placeholder="https://gyansaipp.vercel.app/"
                      className={`${adminInputCls} font-mono-num`}
                      value={siteForm.exam_portal_url || 'https://gyansaipp.vercel.app/'}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, exam_portal_url: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#142A58] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0D1E42] disabled:opacity-60"
                    >
                      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Save Portal URL</span>
                    </button>
                  </div>
                </form>
              )}

              <AdminAcademicsPanels
                activeTab={activeTab}
                busy={busy}
                setBusy={setBusy}
                notify={notify}
                setErrorMsg={setErrorMsg}
                onRefresh={async () => {
                  await Promise.all([loadAllAdminData(), refreshSiteData()]);
                }}
                onDelete={handleDeleteDoc}
                dbCourses={dbCourses}
                dbExams={dbExams}
                dbLectures={dbLectures}
                dbResults={dbResults}
                dbFaculty={dbFaculty}
                dbTestimonials={dbTestimonials}
                dbGallery={dbGallery}
                dbBlogs={dbBlogs}
              />
            </div>
          )}

          {/* 15. ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">
                  Student &amp; Parent Enquiries ({dbEnquiries.length})
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Callback requests submitted via the Homepage and Contact page.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                {dbEnquiries.length === 0 ? (
                  <p className="p-6 text-sm text-slate-500">No enquiries submitted yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {dbEnquiries.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-[#142A58]">
                            {item.student_name}{' '}
                            {item.parent_name && (
                              <span className="font-normal text-slate-500">
                                (Parent: {item.parent_name})
                              </span>
                            )}
                          </p>
                          <p className="font-mono-num text-xs text-slate-600">
                            {item.phone} {item.email ? `· ${item.email}` : ''}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.class_level || 'Class not specified'} ·{' '}
                            {item.course_name || 'General enquiry'}
                          </p>
                          {item.message && (
                            <p className="text-xs text-slate-700">Note: {item.message}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold"
                            value={item.status}
                            onChange={(e) =>
                              void handleUpdateLeadStatus('enquiries', item.id, e.target.value)
                            }
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => void handleDeleteDoc('enquiries', item.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            aria-label="Delete enquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 16. ADMISSIONS */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div>
                <h1 className="display-face text-2xl font-bold text-[#142A58]">
                  Admission Applications ({dbAdmissions.length})
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Formal admission requests with generated reference codes.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                {dbAdmissions.length === 0 ? (
                  <p className="p-6 text-sm text-slate-500">No admission applications yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {dbAdmissions.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="font-mono-num text-xs font-bold text-[#AA2451]">
                            {item.reference_code}
                          </p>
                          <p className="text-sm font-bold text-[#142A58]">
                            {item.student_name}{' '}
                            <span className="font-normal text-slate-500">
                              (Parent: {item.parent_name})
                            </span>
                          </p>
                          <p className="font-mono-num text-xs text-slate-600">
                            {item.phone} {item.email ? `· ${item.email}` : ''}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.class_level} · {item.course_name || 'General'} ·{' '}
                            {item.preferred_batch || 'Any batch'}
                          </p>
                          {item.school && (
                            <p className="text-xs text-slate-500">School: {item.school}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold"
                            value={item.status}
                            onChange={(e) =>
                              void handleUpdateLeadStatus('admissions', item.id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => void handleDeleteDoc('admissions', item.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            aria-label="Delete application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Asset Picker Modal for "Upload image" buttons */}
      {assetPickerTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#142A58]/70 p-4 backdrop-blur-xs"
          onClick={() => setAssetPickerTarget(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="display-face text-base font-bold text-[#142A58]">
                Select Institute Image Asset
              </h3>
              <button
                type="button"
                onClick={() => setAssetPickerTarget(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Choose a campus image asset below, or paste any hosted HTTPS image URL directly into
              the input field.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BUILTIN_ASSETS.map((asset) => (
                <button
                  key={asset.url}
                  type="button"
                  onClick={() => {
                    setSiteForm({ ...siteForm, [assetPickerTarget]: asset.url });
                    setAssetPickerTarget(null);
                  }}
                  className="overflow-hidden rounded-xl border border-slate-200 text-left transition hover:border-[#142A58]"
                >
                  <img
                    src={asset.url}
                    alt={asset.label}
                    className="aspect-video w-full object-cover"
                  />
                  <p className="truncate px-2.5 py-1.5 text-[11px] font-semibold text-[#142A58]">
                    {asset.label}
                  </p>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSiteForm({ ...siteForm, [assetPickerTarget]: '' });
                  setAssetPickerTarget(null);
                }}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs font-semibold text-slate-600 hover:border-[#142A58] hover:text-[#142A58]"
              >
                <span>Use Default Wordmark</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
