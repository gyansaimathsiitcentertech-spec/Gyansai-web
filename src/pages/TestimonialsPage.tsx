import { Star } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';

export function TestimonialsPage() {
  const { testimonials } = useSite();

  return (
    <>
      <PageHero
        kicker="Student & Parent Feedback"
        title="What students and parents say"
        description="Verified reflections from Gyansai Maths IIT Center students and parents on classroom teaching, daily practice discipline, and examination outcomes."
      />

      <section className="shell py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.id} className="surface surface-hover flex flex-col justify-between p-7">
              <div>
                <div
                  className="flex items-center gap-1 text-[#AA2451]"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from({ length: Math.min(5, Math.max(1, item.rating || 5)) }).map(
                    (_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current" aria-hidden="true" />
                    )
                  )}
                </div>
                <p className="mt-4 text-base leading-relaxed text-slate-700">“{item.quote}”</p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="display-face text-base font-bold text-[#1F386B]">
                  {item.display_name}
                </p>
                <p className="text-xs text-slate-500">{item.role_or_class}</p>
                {item.outcome && (
                  <p className="mt-1.5 text-xs font-semibold text-[#AA2451]">{item.outcome}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
