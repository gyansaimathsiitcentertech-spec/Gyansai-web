import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';

export function ResultsPage() {
  const { results } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(results.map((r) => r.category)))];
  const years = ['All', ...Array.from(new Set(results.map((r) => r.academic_year)))].sort((a, b) =>
    a === 'All' ? -1 : b === 'All' ? 1 : b.localeCompare(a)
  );

  const filtered = results.filter((r) => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchYear = selectedYear === 'All' || r.academic_year === selectedYear;
    return matchCat && matchYear;
  });

  const grouped = Array.from(new Set(filtered.map((r) => r.category))).map((category) => ({
    category,
    items: filtered.filter((r) => r.category === category),
  }));

  return (
    <>
      <PageHero
        kicker="Legacy of Excellence"
        title="Verified student results & rankers"
        description="Every rank, percentile, and board score published here is verified by Gyansai Maths IIT Center and shared with student consent."
      />

      <section className="shell py-12 sm:py-16">
        <div className="mb-10 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-slate-500">Examination:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#AA2451] text-white'
                    : 'border border-slate-200 bg-white text-[#1F386B] hover:border-[#AA2451]/45'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-slate-500">Academic Year:</span>
            {years.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`font-mono-num whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  selectedYear === yr
                    ? 'bg-[#1F386B] text-white'
                    : 'border border-slate-200 bg-white text-[#1F386B] hover:border-[#1F386B]/45'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {grouped.length === 0 ? (
          <div className="surface p-12 text-center">
            <p className="text-base font-bold text-[#1F386B]">No matching results found</p>
            <p className="mt-1 text-sm text-slate-600">
              Try selecting a different examination category or academic year.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map((group, idx) => (
              <section key={group.category}>
                <header className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-[#F5F7FB] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div className="flex items-center gap-4">
                    <span className="font-mono-num grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#1F386B] text-sm font-bold text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#AA2451]">Verified Record Group</p>
                      <h2 className="display-face text-2xl font-bold text-[#1F386B]">
                        {group.category}
                      </h2>
                    </div>
                  </div>
                  <p className="font-mono-num text-xs font-semibold text-slate-500">
                    {group.items.length} {group.items.length === 1 ? 'Achiever' : 'Achievers'}
                  </p>
                </header>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((res) => (
                    <article key={res.id} className="surface surface-hover overflow-hidden">
                      <div className="flex items-center justify-between bg-[#1F386B] px-5 py-3 text-white">
                        <span className="text-xs text-white/80">
                          {res.class_level} · {res.academic_year}
                        </span>
                        <span className="font-mono-num text-lg font-bold text-[#FF9EC0]">
                          {res.score}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="display-face text-xl font-bold text-[#1F386B]">
                          {res.student_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">{res.achievement_title}</p>
                        {res.college_admitted && (
                          <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-[#AA2451]">
                            {res.college_admitted}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
