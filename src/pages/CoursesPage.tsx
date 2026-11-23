import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';

export function CoursesPage() {
  const { site, courses } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category)))];
  const visible =
    selectedCategory === 'All'
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <>
      <PageHero
        kicker="Programmes Offered"
        title={site.courses_page_title || 'IIT-JEE, MHT-CET, Board, Foundation & Engineering Maths'}
        description={
          site.courses_page_subtitle ||
          'Structured classroom batches combining first-principles Mathematics teaching, daily practice papers, and weekly assessments.'
        }
      />

      <section className="shell py-12 sm:py-16">
        <div
          className="mb-8 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter programmes by category"
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${
                  active
                    ? 'bg-[#AA2451] text-white'
                    : 'border border-slate-200 bg-white text-[#1F386B] hover:border-[#AA2451]/45'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <article key={course.id} className="surface surface-hover flex flex-col overflow-hidden">
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <SafeImage src={course.image_url} alt={course.name} className="h-full w-full" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-medium text-slate-500">
                  {course.category} · {course.class_level} · {course.duration}
                </p>
                <h2 className="display-face mt-2 text-xl font-bold text-[#1F386B]">
                  <Link to={`/courses/${course.slug}`} className="hover:text-[#AA2451]">
                    {course.name}
                  </Link>
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {course.description}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Target Exams:</span>{' '}
                  {course.target_exams}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <Link
                    to={`/admission?course=${encodeURIComponent(course.name)}`}
                    className="text-xs font-bold text-[#AA2451] hover:underline"
                  >
                    Apply for Batch
                  </Link>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1F386B] hover:text-[#AA2451]"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
