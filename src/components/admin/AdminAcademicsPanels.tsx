import React, { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';
import { db } from '../../firebase';
import { ASSETS } from '../../data/gyansaiData';
import type {
  BlogPost,
  Course,
  ExamNotice,
  FacultyMember,
  GalleryItem,
  StudentResult,
  Testimonial,
  VideoLecture,
} from '../../types';

export const adminInputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#142A58] focus:ring-2 focus:ring-[#142A58]/15';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

interface AcademicPanelsProps {
  activeTab: string;
  busy: boolean;
  setBusy: (val: boolean) => void;
  notify: (msg: string) => void;
  setErrorMsg: (msg: string) => void;
  onRefresh: () => Promise<void>;
  onDelete: (colName: string, docId: string) => Promise<void>;
  dbCourses: Course[];
  dbExams: ExamNotice[];
  dbLectures: VideoLecture[];
  dbResults: StudentResult[];
  dbFaculty: FacultyMember[];
  dbTestimonials: Testimonial[];
  dbGallery: GalleryItem[];
  dbBlogs: BlogPost[];
}

export function AdminAcademicsPanels({
  activeTab,
  busy,
  setBusy,
  notify,
  setErrorMsg,
  onRefresh,
  onDelete,
  dbCourses,
  dbExams,
  dbLectures,
  dbResults,
  dbFaculty,
  dbTestimonials,
  dbGallery,
  dbBlogs,
}: AcademicPanelsProps) {
  const [newCourse, setNewCourse] = useState({
    name: '',
    category: 'IIT-JEE & Competitive',
    class_level: 'Class 11 & 12 Science',
    duration: '2 Years',
    target_exams: 'JEE Main, JEE Advanced, MHT-CET',
    description: '',
    highlights: '',
    batch_timings: 'Morning & Evening Batches',
    admission_status: 'open' as 'open' | 'closing_soon' | 'closed',
  });

  const DEFAULT_EXAM_FORM = {
    title: '',
    course_category: 'IIT-JEE & MHT-CET Test Series',
    class_level: 'Class 11 & 12 Science',
    exam_date: '2026-12-15',
    exam_time: '10:00 AM',
    duration_minutes: 90,
    mode: 'Gyansai e-Exam Online Portal',
    syllabus: '',
    instructions: 'Login with your student roll number on the Gyansai e-Exam portal 10 minutes before start time.',
    registration_url: 'https://gyansaipp.vercel.app/',
    status: 'open' as 'open' | 'upcoming' | 'completed',
  };
  const [newExam, setNewExam] = useState(DEFAULT_EXAM_FORM);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  const [newLecture, setNewLecture] = useState({
    title: '',
    subject: 'Calculus',
    topic: '',
    class_level: 'Class 12 · IIT-JEE',
    teacher_name: 'Prof. Taterao Kendre (KT Sir)',
    duration_label: '45 min',
    video_url: '',
    summary: '',
  });

  const [newResult, setNewResult] = useState({
    student_name: '',
    achievement_title: '',
    score: '',
    category: 'IIT-JEE',
    class_level: 'Class 12',
    academic_year: '2025-26',
    college_admitted: '',
  });

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    role: '',
    subject: 'IIT-JEE Mathematics',
    qualification: '',
    experience: '',
    bio: '',
    photo_url: ASSETS.mentoring,
  });

  const [newTestimonial, setNewTestimonial] = useState({
    display_name: '',
    role_or_class: '',
    outcome: '',
    quote: '',
    rating: 5,
  });

  const [newGallery, setNewGallery] = useState({
    album: 'Classrooms',
    title: '',
    caption: '',
    file_url: ASSETS.hero,
  });

  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'JEE Strategy',
    author: 'Prof. Taterao Kendre (KT Sir)',
    read_time: '4 min read',
    excerpt: '',
    content: '',
    featured_image_url: ASSETS.courseDesk,
  });

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.name.trim().length < 2) return;
    setBusy(true);
    try {
      const slug = slugify(newCourse.name) || `course-${Date.now()}`;
      await setDoc(doc(db, 'courses', slug), {
        slug,
        name: newCourse.name.trim().slice(0, 160),
        category: newCourse.category.trim().slice(0, 120),
        class_level: newCourse.class_level.trim().slice(0, 80),
        duration: newCourse.duration.trim().slice(0, 60),
        target_exams: newCourse.target_exams.trim().slice(0, 200),
        subjects: 'Mathematics & Entrance Prep',
        batch_timings: newCourse.batch_timings.trim().slice(0, 120),
        description: newCourse.description.trim().slice(0, 1500),
        highlights: newCourse.highlights.trim().slice(0, 1500),
        eligibility: 'Open to eligible students after counselling.',
        methodology: 'Structured lectures, daily practice papers, and weekly tests.',
        admission_status: newCourse.admission_status,
        image_url: ASSETS.courseDesk,
        display_order: dbCourses.length + 1,
        is_featured: true,
        is_published: true,
        updatedAt: serverTimestamp(),
      });
      setNewCourse({ ...newCourse, name: '', description: '', highlights: '' });
      await onRefresh();
      notify('Course published successfully.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create course.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newExam.title.trim().length < 2) return;
    setBusy(true);
    try {
      const payload = {
        title: newExam.title.trim().slice(0, 160),
        course_category: (newExam.course_category.trim() || 'Online Test').slice(0, 80),
        class_level: (newExam.class_level.trim() || 'All Classes').slice(0, 80),
        exam_date: (newExam.exam_date.trim() || '2026-12-15').slice(0, 40),
        exam_time: (newExam.exam_time.trim() || '10:00 AM').slice(0, 40),
        duration_minutes: Number(newExam.duration_minutes) || 90,
        mode: (newExam.mode.trim() || 'Online Portal').slice(0, 60),
        syllabus: newExam.syllabus.trim().slice(0, 1000),
        instructions: newExam.instructions.trim().slice(0, 1000),
        status: newExam.status,
        registration_url: (newExam.registration_url.trim() || 'https://gyansaipp.vercel.app/').slice(0, 500),
        display_order: editingExamId
          ? dbExams.find((ex) => ex.id === editingExamId)?.display_order ?? 1
          : dbExams.length + 1,
        is_published: true,
        updatedAt: serverTimestamp(),
      };

      if (editingExamId) {
        await updateDoc(doc(db, 'exams', editingExamId), payload);
        setEditingExamId(null);
        notify('Examination updated and live on frontend.');
      } else {
        await addDoc(collection(db, 'exams'), payload);
        notify('Examination notice published and live on frontend.');
      }

      setNewExam(DEFAULT_EXAM_FORM);
      await onRefresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save exam.');
    } finally {
      setBusy(false);
    }
  };

  const startEditExam = (ex: ExamNotice) => {
    setEditingExamId(ex.id);
    setNewExam({
      title: ex.title || '',
      course_category: ex.course_category || '',
      class_level: ex.class_level || '',
      exam_date: ex.exam_date || '2026-12-15',
      exam_time: ex.exam_time || '10:00 AM',
      duration_minutes: ex.duration_minutes || 90,
      mode: ex.mode || '',
      syllabus: ex.syllabus || '',
      instructions: ex.instructions || '',
      registration_url: ex.registration_url || 'https://gyansaipp.vercel.app/',
      status: ex.status || 'open',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newLecture.title.trim().length < 2) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'lectures'), {
        title: newLecture.title.trim().slice(0, 180),
        subject: newLecture.subject.trim().slice(0, 80),
        topic: newLecture.topic.trim().slice(0, 120),
        class_level: newLecture.class_level.trim().slice(0, 80),
        teacher_name: newLecture.teacher_name.trim().slice(0, 100),
        duration_label: newLecture.duration_label.trim().slice(0, 40),
        video_url: newLecture.video_url.trim().slice(0, 500),
        thumbnail_url: ASSETS.hero,
        summary: newLecture.summary.trim().slice(0, 800),
        display_order: dbLectures.length + 1,
        is_published: true,
        updatedAt: serverTimestamp(),
      });
      setNewLecture({ ...newLecture, title: '', topic: '', video_url: '', summary: '' });
      await onRefresh();
      notify('Video lecture published.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add lecture.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newResult.student_name.trim().length < 2 || !newResult.score.trim()) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'results'), {
        student_name: newResult.student_name.trim().slice(0, 120),
        achievement_title: (newResult.achievement_title.trim() || newResult.category).slice(0, 160),
        score: newResult.score.trim().slice(0, 80),
        category: newResult.category.trim().slice(0, 80),
        class_level: newResult.class_level.trim().slice(0, 60),
        academic_year: newResult.academic_year.trim().slice(0, 30),
        college_admitted: newResult.college_admitted.trim().slice(0, 160),
        photo_url: ASSETS.toppers,
        display_order: dbResults.length + 1,
        is_featured: true,
        is_published: true,
        updatedAt: serverTimestamp(),
      });
      setNewResult({ ...newResult, student_name: '', achievement_title: '', score: '', college_admitted: '' });
      await onRefresh();
      notify('Student result published.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add result.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFaculty.name.trim().length < 2 || newFaculty.role.trim().length < 2) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'faculty'), {
        name: newFaculty.name.trim().slice(0, 120),
        role: newFaculty.role.trim().slice(0, 120),
        subject: newFaculty.subject.trim().slice(0, 100),
        qualification: newFaculty.qualification.trim().slice(0, 160),
        experience: newFaculty.experience.trim().slice(0, 80),
        bio: newFaculty.bio.trim().slice(0, 1000),
        photo_url: (newFaculty.photo_url.trim() || ASSETS.mentoring).slice(0, 500),
        display_order: dbFaculty.length + 1,
        is_published: true,
        updatedAt: serverTimestamp(),
      });
      setNewFaculty({ ...newFaculty, name: '', role: '', qualification: '', experience: '', bio: '' });
      await onRefresh();
      notify('Faculty profile added.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add faculty member.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTestimonial.display_name.trim().length < 2 || newTestimonial.quote.trim().length < 10) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        display_name: newTestimonial.display_name.trim().slice(0, 120),
        role_or_class: (newTestimonial.role_or_class.trim() || 'Student').slice(0, 140),
        outcome: newTestimonial.outcome.trim().slice(0, 140),
        quote: newTestimonial.quote.trim().slice(0, 1200),
        rating: Math.min(5, Math.max(1, Number(newTestimonial.rating) || 5)),
        display_order: dbTestimonials.length + 1,
        is_published: true,
        updatedAt: serverTimestamp(),
      });
      setNewTestimonial({ display_name: '', role_or_class: '', outcome: '', quote: '', rating: 5 });
      await onRefresh();
      notify('Testimonial published.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to publish testimonial.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGallery.title.trim().length < 2 || newGallery.file_url.trim().length < 2) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'gallery_media'), {
        album: newGallery.album.trim().slice(0, 80),
        title: newGallery.title.trim().slice(0, 140),
        caption: newGallery.caption.trim().slice(0, 400),
        file_url: newGallery.file_url.trim().slice(0, 500),
        display_order: dbGallery.length + 1,
        is_published: true,
        updatedAt: serverTimestamp(),
      });
      setNewGallery({ ...newGallery, title: '', caption: '' });
      await onRefresh();
      notify('Gallery photograph added.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add gallery item.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlog.title.trim().length < 4 || newBlog.content.trim().length < 10) return;
    setBusy(true);
    try {
      const slug = slugify(newBlog.title) || `post-${Date.now()}`;
      await setDoc(doc(db, 'blogs', slug), {
        slug,
        title: newBlog.title.trim().slice(0, 180),
        category: newBlog.category.trim().slice(0, 80),
        excerpt: (newBlog.excerpt.trim() || newBlog.content.trim().slice(0, 160)).slice(0, 400),
        content: newBlog.content.trim().slice(0, 12000),
        featured_image_url: (newBlog.featured_image_url.trim() || ASSETS.courseDesk).slice(0, 500),
        author: newBlog.author.trim().slice(0, 100),
        published_date: new Date().toISOString().slice(0, 10),
        read_time: newBlog.read_time.trim().slice(0, 30),
        is_published: true,
        updatedAt: serverTimestamp(),
      });
      setNewBlog({ ...newBlog, title: '', excerpt: '', content: '' });
      await onRefresh();
      notify('Article published to Blogs.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to publish blog article.');
    } finally {
      setBusy(false);
    }
  };

  if (activeTab === 'courses') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleAddCourse} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="display-face text-lg font-bold text-[#142A58]">Add New Programme</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Course Title *" className={adminInputCls} required value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} />
            <input placeholder="Category (e.g. IIT-JEE & Competitive)" className={adminInputCls} value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} />
            <input placeholder="Class Level" className={adminInputCls} value={newCourse.class_level} onChange={(e) => setNewCourse({ ...newCourse, class_level: e.target.value })} />
            <input placeholder="Duration" className={adminInputCls} value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} />
          </div>
          <textarea rows={2} placeholder="Course overview..." className={adminInputCls} value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#142A58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E1E42]">
              <Plus className="h-4 w-4" />
              <span>Publish Programme</span>
            </button>
          </div>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbCourses.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No Firestore courses yet. Use “Sync All Default Data” on the Dashboard or add one above.</p>
          ) : (
            dbCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-bold text-[#142A58]">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.category} · {c.class_level} · {c.duration}</p>
                </div>
                <button type="button" onClick={() => void onDelete('courses', c.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${c.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'exams') {
    return (
      <div className="space-y-6">
        <form
          onSubmit={handleSaveExam}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="display-face text-lg font-bold text-[#142A58]">
              {editingExamId ? 'Edit Examination Notice & URL' : 'Publish Examination Notice'}
            </h2>
            {editingExamId && (
              <button
                type="button"
                onClick={() => {
                  setEditingExamId(null);
                  setNewExam(DEFAULT_EXAM_FORM);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel edit</span>
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Exam Title *</label>
              <input
                placeholder="e.g. JEE Main Mathematics Mock Test #4"
                className={adminInputCls}
                required
                value={newExam.title}
                onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Target Class *</label>
              <input
                placeholder="e.g. Class 11 & 12 Science"
                className={adminInputCls}
                required
                value={newExam.class_level}
                onChange={(e) => setNewExam({ ...newExam, class_level: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
              <input
                placeholder="e.g. IIT-JEE Test Series / MHT-CET / GMAT"
                className={adminInputCls}
                value={newExam.course_category}
                onChange={(e) => setNewExam({ ...newExam, course_category: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Exam Status</label>
              <select
                className={adminInputCls}
                value={newExam.status}
                onChange={(e) =>
                  setNewExam({
                    ...newExam,
                    status: e.target.value as 'open' | 'upcoming' | 'completed',
                  })
                }
              >
                <option value="open">Open (Active / Live)</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Exam Date</label>
              <input
                type="date"
                className={`${adminInputCls} font-mono-num`}
                value={newExam.exam_date}
                onChange={(e) => setNewExam({ ...newExam, exam_date: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Exam Time</label>
              <input
                placeholder="e.g. 10:00 AM"
                className={adminInputCls}
                value={newExam.exam_time}
                onChange={(e) => setNewExam({ ...newExam, exam_time: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Duration (minutes)</label>
              <input
                type="number"
                min={10}
                max={360}
                className={`${adminInputCls} font-mono-num`}
                value={newExam.duration_minutes}
                onChange={(e) =>
                  setNewExam({ ...newExam, duration_minutes: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Mode / Venue</label>
              <input
                placeholder="e.g. Gyansai e-Exam Online Portal"
                className={adminInputCls}
                value={newExam.mode}
                onChange={(e) => setNewExam({ ...newExam, mode: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-slate-700">
                Exam / Test Portal URL (External link or /admission)
              </label>
              <button
                type="button"
                onClick={() =>
                  setNewExam({ ...newExam, registration_url: 'https://gyansaipp.vercel.app/' })
                }
                className="text-[11px] font-semibold text-[#AA2451] hover:underline"
              >
                Fill Gyansai Portal URL
              </button>
            </div>
            <input
              placeholder="https://gyansaipp.vercel.app/ or specific exam link"
              className={`${adminInputCls} font-mono-num`}
              value={newExam.registration_url}
              onChange={(e) => setNewExam({ ...newExam, registration_url: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Syllabus</label>
              <textarea
                rows={2}
                placeholder="Topics covered in this test..."
                className={adminInputCls}
                value={newExam.syllabus}
                onChange={(e) => setNewExam({ ...newExam, syllabus: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Instructions</label>
              <textarea
                rows={2}
                placeholder="Reporting time or online login instructions..."
                className={adminInputCls}
                value={newExam.instructions}
                onChange={(e) => setNewExam({ ...newExam, instructions: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#142A58] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0E1E42] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>{editingExamId ? 'Update Exam Notice' : 'Publish Notice'}</span>
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbExams.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              No Firestore exam notices yet. Add one above or use “Sync All Default Gyansai Data” on
              the Dashboard.
            </p>
          ) : (
            dbExams.map((ex) => (
              <div
                key={ex.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[#142A58]">{ex.title}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        ex.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ex.status === 'upcoming'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {ex.status}
                    </span>
                  </div>
                  <p className="font-mono-num text-xs text-slate-500">
                    {ex.exam_date} · {ex.exam_time} · {ex.class_level} · {ex.mode}
                  </p>
                  {ex.registration_url && (
                    <a
                      href={ex.registration_url}
                      target={/^https?:\/\//i.test(ex.registration_url) ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="font-mono-num inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-[#AA2451] hover:underline"
                    >
                      <span className="truncate">{ex.registration_url}</span>
                      {/^https?:\/\//i.test(ex.registration_url) && (
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      )}
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEditExam(ex)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#142A58] hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete('exams', ex.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${ex.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'lectures') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleAddLecture} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="display-face text-lg font-bold text-[#142A58]">Add Video Lecture</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Lecture Title *" className={adminInputCls} required value={newLecture.title} onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })} />
            <input placeholder="Subject (e.g. Calculus)" className={adminInputCls} value={newLecture.subject} onChange={(e) => setNewLecture({ ...newLecture, subject: e.target.value })} />
            <input placeholder="Class Level" className={adminInputCls} value={newLecture.class_level} onChange={(e) => setNewLecture({ ...newLecture, class_level: e.target.value })} />
            <input placeholder="Teacher Name" className={adminInputCls} value={newLecture.teacher_name} onChange={(e) => setNewLecture({ ...newLecture, teacher_name: e.target.value })} />
            <input placeholder="Duration (e.g. 45 min)" className={adminInputCls} value={newLecture.duration_label} onChange={(e) => setNewLecture({ ...newLecture, duration_label: e.target.value })} />
            <input placeholder="YouTube / Embed URL (optional)" className={adminInputCls} value={newLecture.video_url} onChange={(e) => setNewLecture({ ...newLecture, video_url: e.target.value })} />
          </div>
          <textarea rows={2} placeholder="Topic summary..." className={adminInputCls} value={newLecture.summary} onChange={(e) => setNewLecture({ ...newLecture, summary: e.target.value })} />
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#142A58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E1E42]">
              <Plus className="h-4 w-4" />
              <span>Publish Lecture</span>
            </button>
          </div>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbLectures.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No Firestore video lectures yet.</p>
          ) : (
            dbLectures.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-bold text-[#142A58]">{l.title}</p>
                  <p className="text-xs text-slate-500">{l.subject} · {l.class_level} · {l.duration_label}</p>
                </div>
                <button type="button" onClick={() => void onDelete('lectures', l.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${l.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'results') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleAddResult} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="display-face text-lg font-bold text-[#142A58]">Add Verified Student Result</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Student Name *" className={adminInputCls} required value={newResult.student_name} onChange={(e) => setNewResult({ ...newResult, student_name: e.target.value })} />
            <input placeholder="Score / Rank (e.g. 99.7 %ile) *" className={adminInputCls} required value={newResult.score} onChange={(e) => setNewResult({ ...newResult, score: e.target.value })} />
            <input placeholder="Achievement Title" className={adminInputCls} value={newResult.achievement_title} onChange={(e) => setNewResult({ ...newResult, achievement_title: e.target.value })} />
            <select className={adminInputCls} value={newResult.category} onChange={(e) => setNewResult({ ...newResult, category: e.target.value })}>
              <option value="IIT-JEE">IIT-JEE</option>
              <option value="MHT-CET">MHT-CET</option>
              <option value="Board Exams">Board Exams</option>
              <option value="BITSAT & NDA">BITSAT &amp; NDA</option>
              <option value="Engineering Maths">Engineering Maths</option>
            </select>
            <input placeholder="Academic Year" className={adminInputCls} value={newResult.academic_year} onChange={(e) => setNewResult({ ...newResult, academic_year: e.target.value })} />
            <input placeholder="College Admitted" className={adminInputCls} value={newResult.college_admitted} onChange={(e) => setNewResult({ ...newResult, college_admitted: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#142A58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E1E42]">
              <Plus className="h-4 w-4" />
              <span>Publish Result</span>
            </button>
          </div>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbResults.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No Firestore results yet.</p>
          ) : (
            dbResults.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-bold text-[#142A58]">{r.student_name} — <span className="font-mono-num">{r.score}</span></p>
                  <p className="text-xs text-slate-500">{r.category} · {r.academic_year} · {r.college_admitted}</p>
                </div>
                <button type="button" onClick={() => void onDelete('results', r.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${r.student_name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'faculty') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleAddFaculty} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="display-face text-lg font-bold text-[#142A58]">Add Faculty Mentor</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Faculty Full Name *" className={adminInputCls} required value={newFaculty.name} onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })} />
            <input placeholder="Designation / Role *" className={adminInputCls} required value={newFaculty.role} onChange={(e) => setNewFaculty({ ...newFaculty, role: e.target.value })} />
            <input placeholder="Subject Specialisation" className={adminInputCls} value={newFaculty.subject} onChange={(e) => setNewFaculty({ ...newFaculty, subject: e.target.value })} />
            <input placeholder="Qualification (e.g. M.Tech NIT)" className={adminInputCls} value={newFaculty.qualification} onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })} />
            <input placeholder="Experience (e.g. 12+ Years)" className={adminInputCls} value={newFaculty.experience} onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })} />
            <input placeholder="Photo URL" className={adminInputCls} value={newFaculty.photo_url} onChange={(e) => setNewFaculty({ ...newFaculty, photo_url: e.target.value })} />
          </div>
          <textarea rows={2} placeholder="Short academic bio..." className={adminInputCls} value={newFaculty.bio} onChange={(e) => setNewFaculty({ ...newFaculty, bio: e.target.value })} />
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#142A58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E1E42]">
              <Plus className="h-4 w-4" />
              <span>Add Faculty Profile</span>
            </button>
          </div>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbFaculty.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No Firestore faculty records yet.</p>
          ) : (
            dbFaculty.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-bold text-[#142A58]">{f.name}</p>
                  <p className="text-xs text-slate-500">{f.role} · {f.subject}</p>
                </div>
                <button type="button" onClick={() => void onDelete('faculty', f.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${f.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'testimonials') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleAddTestimonial} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="display-face text-lg font-bold text-[#142A58]">Add Student / Parent Review</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Name *" className={adminInputCls} required value={newTestimonial.display_name} onChange={(e) => setNewTestimonial({ ...newTestimonial, display_name: e.target.value })} />
            <input placeholder="Batch / Parent Role *" className={adminInputCls} required value={newTestimonial.role_or_class} onChange={(e) => setNewTestimonial({ ...newTestimonial, role_or_class: e.target.value })} />
            <input placeholder="Outcome / Score Highlight" className={adminInputCls} value={newTestimonial.outcome} onChange={(e) => setNewTestimonial({ ...newTestimonial, outcome: e.target.value })} />
            <input type="number" min={1} max={5} placeholder="Rating (1-5)" className={adminInputCls} value={newTestimonial.rating} onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })} />
          </div>
          <textarea rows={3} placeholder="Student or parent quote (min 10 chars) *" required className={adminInputCls} value={newTestimonial.quote} onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })} />
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#142A58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E1E42]">
              <Plus className="h-4 w-4" />
              <span>Publish Testimonial</span>
            </button>
          </div>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbTestimonials.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No Firestore testimonials yet.</p>
          ) : (
            dbTestimonials.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-bold text-[#142A58]">{t.display_name}</p>
                  <p className="text-xs text-slate-500">{t.role_or_class} · {t.outcome}</p>
                </div>
                <button type="button" onClick={() => void onDelete('testimonials', t.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${t.display_name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'gallery') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleAddGallery} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="display-face text-lg font-bold text-[#142A58]">Add Campus Gallery Photo</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Photo Title *" className={adminInputCls} required value={newGallery.title} onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })} />
            <input placeholder="Album (e.g. Classrooms, Achievements)" className={adminInputCls} value={newGallery.album} onChange={(e) => setNewGallery({ ...newGallery, album: e.target.value })} />
            <input placeholder="Image URL *" className={adminInputCls} required value={newGallery.file_url} onChange={(e) => setNewGallery({ ...newGallery, file_url: e.target.value })} />
            <input placeholder="Caption" className={adminInputCls} value={newGallery.caption} onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#142A58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E1E42]">
              <Plus className="h-4 w-4" />
              <span>Add Photograph</span>
            </button>
          </div>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbGallery.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No Firestore gallery items yet.</p>
          ) : (
            dbGallery.map((g) => (
              <div key={g.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <img src={g.file_url} alt={g.title} className="h-10 w-14 rounded-md object-cover bg-slate-100" />
                  <div>
                    <p className="text-sm font-bold text-[#142A58]">{g.title}</p>
                    <p className="text-xs text-slate-500">{g.album}</p>
                  </div>
                </div>
                <button type="button" onClick={() => void onDelete('gallery_media', g.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${g.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'blogs') {
    return (
      <div className="space-y-6">
        <form onSubmit={handleAddBlog} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="display-face text-lg font-bold text-[#142A58]">Publish Study Article / Notice</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Article Title *" className={adminInputCls} required value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} />
            <input placeholder="Category (e.g. JEE Strategy)" className={adminInputCls} value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} />
            <input placeholder="Author" className={adminInputCls} value={newBlog.author} onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })} />
            <input placeholder="Read Time (e.g. 4 min read)" className={adminInputCls} value={newBlog.read_time} onChange={(e) => setNewBlog({ ...newBlog, read_time: e.target.value })} />
          </div>
          <input placeholder="Short excerpt..." className={adminInputCls} value={newBlog.excerpt} onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })} />
          <textarea rows={4} placeholder="Full article content (use ## Heading for subheadings) *" required className={adminInputCls} value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} />
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#142A58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E1E42]">
              <Plus className="h-4 w-4" />
              <span>Publish Article</span>
            </button>
          </div>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          {dbBlogs.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No Firestore blog posts yet.</p>
          ) : (
            dbBlogs.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-bold text-[#142A58]">{b.title}</p>
                  <p className="text-xs text-slate-500">{b.category} · {b.published_date} · {b.author}</p>
                </div>
                <button type="button" onClick={() => void onDelete('blogs', b.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${b.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
}
