import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';
import { EnquiryForm } from '../components/EnquiryForm';

export function CourseDetailPage() {
  const { id } = useParams();
  const { courses } = useSite();
  const course = courses.find((c) => c.slug === id || c.id === id);

  if (!course) {
    return (
      <section className="shell py-20 text-center">
        <h1 className="display-face text-3xl font-bold text-[#1F386B]">Programme not found</h1>
        <p className="mt-3 text-sm text-slate-600">
          This course may have been updated or moved. Browse all active batches below.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1F386B] px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courses</span>
        </Link>
      </section>
    );
  }

  const highlightList = course.highlights
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero
        kicker={`${course.category} · ${course.class_level} · ${course.duration}`}
        title={course.name}
        description={course.description}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={`/admission?course=${encodeURIComponent(course.name)}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#AA2451] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#8E1C42]"
          >
            <span>Enroll in This Programme</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>All Programmes</span>
          </Link>
        </div>
      </PageHero>

      <section className="shell grid items-start gap-10 py-14 sm:py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <SafeImage src={course.image_url} alt={course.name} className="aspect-[16/9] w-full" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface p-5">
              <p className="text-xs font-semibold text-slate-500">Target Examinations</p>
              <p className="mt-1.5 text-sm font-bold text-[#1F386B]">{course.target_exams}</p>
            </div>
            <div className="surface p-5">
              <p className="text-xs font-semibold text-slate-500">Batch Schedule</p>
              <p className="mt-1.5 text-sm font-bold text-[#1F386B]">{course.batch_timings}</p>
            </div>
          </div>

          <div className="surface p-6 sm:p-7">
            <h2 className="display-face text-2xl font-bold text-[#1F386B]">
              Key Programme Highlights
            </h2>
            <div className="section-rule mt-2.5" aria-hidden="true" />
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {highlightList.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#AA2451]" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="surface p-6">
              <h3 className="display-face text-base font-bold text-[#1F386B]">Eligibility</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{course.eligibility}</p>
            </div>
            <div className="surface p-6">
              <h3 className="display-face text-base font-bold text-[#1F386B]">
                Teaching Methodology
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{course.methodology}</p>
            </div>
          </div>
        </div>

        <aside className="surface p-6 sm:p-7 lg:sticky lg:top-24">
          <h2 className="display-face text-2xl font-bold text-[#1F386B]">
            Enquire About This Batch
          </h2>
          <div className="section-rule mt-2.5" aria-hidden="true" />
          <p className="mb-5 mt-3 text-sm text-slate-600">
            Receive current fee details, upcoming batch start dates, and demo lecture timings.
          </p>
          <EnquiryForm
            source={`course-${course.slug}`}
            defaultCourse={course.name}
            submitLabel="Get Fee & Batch Details"
          />
        </aside>
      </section>
    </>
  );
}
