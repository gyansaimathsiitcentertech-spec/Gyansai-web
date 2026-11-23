import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
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
  BlogPost,
  Course,
  ExamNotice,
  FacultyMember,
  GalleryItem,
  SiteSettings,
  StudentResult,
  Testimonial,
  VideoLecture,
} from '../types';

interface SiteContextValue {
  site: SiteSettings;
  courses: Course[];
  exams: ExamNotice[];
  results: StudentResult[];
  lectures: VideoLecture[];
  faculty: FacultyMember[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  loading: boolean;
  refreshSiteData: () => Promise<void>;
  submitEnquiry: (payload: {
    student_name: string;
    parent_name?: string;
    phone: string;
    email?: string;
    class_level?: string;
    course_name?: string;
    preferred_batch?: string;
    message?: string;
    source?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  submitAdmission: (payload: {
    student_name: string;
    parent_name: string;
    phone: string;
    email?: string;
    class_level: string;
    course_name?: string;
    preferred_batch?: string;
    school?: string;
    address?: string;
    message?: string;
  }) => Promise<{ ok: boolean; referenceCode?: string; error?: string }>;
}

const SiteContext = createContext<SiteContextValue | null>(null);

function sortByDisplayOrder<T extends { display_order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99));
}

function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GSM-${suffix}`;
}

async function fetchPublishedCollection<T extends { id: string; display_order?: number }>(
  colName: string,
  fallback: T[]
): Promise<T[]> {
  try {
    const q = query(collection(db, colName), where('is_published', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) return fallback;
    const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<T, 'id'>) }) as T);
    return sortByDisplayOrder(rows);
  } catch (err) {
    console.warn(`Using default ${colName} dataset:`, err);
    return fallback;
  }
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const coreSettingsRef = useRef<Partial<SiteSettings>>({});
  const pageSettingsRef = useRef<Partial<SiteSettings>>({});

  const [site, setSite] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [exams, setExams] = useState<ExamNotice[]>(DEFAULT_EXAMS);
  const [results, setResults] = useState<StudentResult[]>(DEFAULT_RESULTS);
  const [lectures, setLectures] = useState<VideoLecture[]>(DEFAULT_LECTURES);
  const [faculty, setFaculty] = useState<FacultyMember[]>(DEFAULT_FACULTY);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOGS);
  const [loading, setLoading] = useState(true);

  const mergeSiteState = useCallback(() => {
    setSite({
      ...DEFAULT_SITE_SETTINGS,
      ...coreSettingsRef.current,
      ...pageSettingsRef.current,
    });
  }, []);

  const refreshSiteData = useCallback(async () => {
    try {
      const [
        siteSnap,
        pagesSnap,
        coursesList,
        examsList,
        resultsList,
        lecturesList,
        facultyList,
        testimonialsList,
        galleryList,
        blogsList,
      ] = await Promise.all([
        getDoc(doc(db, 'settings', 'site')).catch(() => null),
        getDoc(doc(db, 'settings', 'pages')).catch(() => null),
        fetchPublishedCollection<Course>('courses', DEFAULT_COURSES),
        fetchPublishedCollection<ExamNotice>('exams', DEFAULT_EXAMS),
        fetchPublishedCollection<StudentResult>('results', DEFAULT_RESULTS),
        fetchPublishedCollection<VideoLecture>('lectures', DEFAULT_LECTURES),
        fetchPublishedCollection<FacultyMember>('faculty', DEFAULT_FACULTY),
        fetchPublishedCollection<Testimonial>('testimonials', DEFAULT_TESTIMONIALS),
        fetchPublishedCollection<GalleryItem>('gallery_media', DEFAULT_GALLERY),
        fetchPublishedCollection<BlogPost>('blogs', DEFAULT_BLOGS),
      ]);

      if (siteSnap && siteSnap.exists()) {
        coreSettingsRef.current = siteSnap.data() as Partial<SiteSettings>;
      }
      if (pagesSnap && pagesSnap.exists()) {
        pageSettingsRef.current = pagesSnap.data() as Partial<SiteSettings>;
      }
      mergeSiteState();

      setCourses(coursesList);
      setExams(examsList);
      setResults(resultsList);
      setLectures(lecturesList);
      setFaculty(facultyList);
      setTestimonials(testimonialsList);
      setGallery(galleryList);
      setBlogs(
        [...blogsList].sort((a, b) => (b.published_date || '').localeCompare(a.published_date || ''))
      );
    } finally {
      setLoading(false);
    }
  }, [mergeSiteState]);

  // Real-time Firestore subscriptions so Admin Panel edits reflect live on the frontend immediately
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(
      onSnapshot(
        doc(db, 'settings', 'site'),
        (snap) => {
          if (snap.exists()) {
            coreSettingsRef.current = snap.data() as Partial<SiteSettings>;
            mergeSiteState();
          }
          setLoading(false);
        },
        (err) => {
          console.warn('Site settings listener fallback:', err);
          setLoading(false);
        }
      )
    );

    unsubs.push(
      onSnapshot(
        doc(db, 'settings', 'pages'),
        (snap) => {
          if (snap.exists()) {
            pageSettingsRef.current = snap.data() as Partial<SiteSettings>;
            mergeSiteState();
          }
        },
        (err) => {
          console.warn('Page settings listener fallback:', err);
        }
      )
    );

    const watchCollection = <T extends { id: string; display_order?: number }>(
      colName: string,
      fallback: T[],
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      customSort?: (items: T[]) => T[]
    ) => {
      const q = query(collection(db, colName), where('is_published', '==', true));
      unsubs.push(
        onSnapshot(
          q,
          (snap) => {
            if (snap.empty) {
              setter(fallback);
              return;
            }
            const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<T, 'id'>) }) as T);
            setter(customSort ? customSort(rows) : sortByDisplayOrder(rows));
          },
          (err) => {
            console.warn(`Live listener fallback for ${colName}:`, err);
          }
        )
      );
    };

    watchCollection<Course>('courses', DEFAULT_COURSES, setCourses);
    watchCollection<ExamNotice>('exams', DEFAULT_EXAMS, setExams);
    watchCollection<StudentResult>('results', DEFAULT_RESULTS, setResults);
    watchCollection<VideoLecture>('lectures', DEFAULT_LECTURES, setLectures);
    watchCollection<FacultyMember>('faculty', DEFAULT_FACULTY, setFaculty);
    watchCollection<Testimonial>('testimonials', DEFAULT_TESTIMONIALS, setTestimonials);
    watchCollection<GalleryItem>('gallery_media', DEFAULT_GALLERY, setGallery);
    watchCollection<BlogPost>('blogs', DEFAULT_BLOGS, setBlogs, (items) =>
      [...items].sort((a, b) => (b.published_date || '').localeCompare(a.published_date || ''))
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [mergeSiteState]);

  useEffect(() => {
    if (site.seo_title) {
      document.title = site.seo_title;
    }
    if (site.seo_description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', site.seo_description);
    }
    if (site.seo_keywords) {
      let kwMeta = document.querySelector('meta[name="keywords"]');
      if (!kwMeta) {
        kwMeta = document.createElement('meta');
        kwMeta.setAttribute('name', 'keywords');
        document.head.appendChild(kwMeta);
      }
      kwMeta.setAttribute('content', site.seo_keywords);
    }
    if (site.favicon_url) {
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = site.favicon_url;
    }
  }, [site.seo_title, site.seo_description, site.seo_keywords, site.favicon_url]);

  const submitEnquiry = useCallback(
    async (payload: {
      student_name: string;
      parent_name?: string;
      phone: string;
      email?: string;
      class_level?: string;
      course_name?: string;
      preferred_batch?: string;
      message?: string;
      source?: string;
    }) => {
      const clean: Record<string, unknown> = {
        student_name: payload.student_name.trim().slice(0, 120),
        phone: payload.phone.trim().slice(0, 20),
        status: 'new',
        createdAt: serverTimestamp(),
      };
      if (payload.parent_name?.trim()) clean.parent_name = payload.parent_name.trim().slice(0, 120);
      if (payload.email?.trim()) clean.email = payload.email.trim().slice(0, 120);
      if (payload.class_level?.trim()) clean.class_level = payload.class_level.trim().slice(0, 80);
      if (payload.course_name?.trim()) clean.course_name = payload.course_name.trim().slice(0, 160);
      if (payload.preferred_batch?.trim())
        clean.preferred_batch = payload.preferred_batch.trim().slice(0, 80);
      if (payload.message?.trim()) clean.message = payload.message.trim().slice(0, 1000);
      if (payload.source?.trim()) clean.source = payload.source.trim().slice(0, 60);

      try {
        await addDoc(collection(db, 'enquiries'), clean);
        return { ok: true };
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.CREATE, 'enquiries');
        } catch {
          return {
            ok: false,
            error: 'Could not save your enquiry right now. Please call +91 9970603939 directly.',
          };
        }
      }
    },
    []
  );

  const submitAdmission = useCallback(
    async (payload: {
      student_name: string;
      parent_name: string;
      phone: string;
      email?: string;
      class_level: string;
      course_name?: string;
      preferred_batch?: string;
      school?: string;
      address?: string;
      message?: string;
    }) => {
      const referenceCode = generateReferenceCode();
      const clean: Record<string, unknown> = {
        reference_code: referenceCode,
        student_name: payload.student_name.trim().slice(0, 120),
        parent_name: payload.parent_name.trim().slice(0, 120),
        phone: payload.phone.trim().slice(0, 20),
        class_level: payload.class_level.trim().slice(0, 80),
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      if (payload.email?.trim()) clean.email = payload.email.trim().slice(0, 120);
      if (payload.course_name?.trim()) clean.course_name = payload.course_name.trim().slice(0, 160);
      if (payload.preferred_batch?.trim())
        clean.preferred_batch = payload.preferred_batch.trim().slice(0, 80);
      if (payload.school?.trim()) clean.school = payload.school.trim().slice(0, 160);
      if (payload.address?.trim()) clean.address = payload.address.trim().slice(0, 300);
      if (payload.message?.trim()) clean.message = payload.message.trim().slice(0, 1000);

      try {
        await addDoc(collection(db, 'admissions'), clean);
        return { ok: true, referenceCode };
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.CREATE, 'admissions');
        } catch {
          return {
            ok: false,
            error: 'Could not save your application right now. Please call +91 9970603939 directly.',
          };
        }
      }
    },
    []
  );

  return (
    <SiteContext.Provider
      value={{
        site,
        courses,
        exams,
        results,
        lectures,
        faculty,
        testimonials,
        gallery,
        blogs,
        loading,
        refreshSiteData,
        submitEnquiry,
        submitAdmission,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
}
