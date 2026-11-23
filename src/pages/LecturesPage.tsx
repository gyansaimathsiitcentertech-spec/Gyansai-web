import { useState } from 'react';
import { Play } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';
import { LectureModal } from '../components/LectureModal';
import type { VideoLecture } from '../types';

export function LecturesPage() {
  const { lectures } = useSite();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeLecture, setActiveLecture] = useState<VideoLecture | null>(null);

  const subjects = ['All', ...Array.from(new Set(lectures.map((l) => l.subject)))];
  const visible =
    selectedSubject === 'All'
      ? lectures
      : lectures.filter((l) => l.subject === selectedSubject);

  return (
    <>
      <PageHero
        kicker="Concept Revision Library"
        title="Featured Mathematics video lectures"
        description="Selected topic explanations, derivation walkthroughs, and previous-year JEE & MHT-CET problem sessions for structured home revision."
      />

      <section className="shell py-12 sm:py-16">
        <div
          className="mb-8 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter lectures by topic"
        >
          {subjects.map((sub) => (
            <button
              key={sub}
              type="button"
              role="tab"
              aria-selected={selectedSubject === sub}
              onClick={() => setSelectedSubject(sub)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                selectedSubject === sub
                  ? 'bg-[#AA2451] text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-[#1F386B]/40 hover:text-[#1F386B]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((lec) => (
            <article key={lec.id} className="surface surface-hover flex flex-col overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveLecture(lec)}
                className="group relative aspect-video w-full overflow-hidden bg-[#13254B] text-left"
              >
                <SafeImage
                  src={lec.thumbnail_url}
                  alt={lec.title}
                  className="h-full w-full opacity-85 transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13254B]/80 via-[#13254B]/20 to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#AA2451] text-white shadow-lg ring-4 ring-white/25 transition group-hover:scale-110 group-hover:bg-[#8E1C42]">
                  <Play className="h-5 w-5 fill-current pl-0.5" aria-hidden="true" />
                </span>
                <span className="font-mono-num absolute bottom-3 right-3 rounded bg-black/75 px-2 py-0.5 text-xs font-medium text-white">
                  {lec.duration_label}
                </span>
              </button>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold text-[#AA2451]">
                  {lec.subject} · {lec.class_level}
                </p>
                <h2 className="display-face mt-1.5 text-lg font-bold text-[#1F386B]">
                  {lec.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{lec.summary}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                  <span>{lec.teacher_name}</span>
                  <button
                    type="button"
                    onClick={() => setActiveLecture(lec)}
                    className="font-semibold text-[#1F386B] hover:text-[#AA2451]"
                  >
                    Watch Lecture
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <LectureModal lecture={activeLecture} onClose={() => setActiveLecture(null)} />
    </>
  );
}
