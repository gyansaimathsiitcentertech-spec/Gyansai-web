import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Laptop,
  MapPin,
  Maximize2,
  Minimize2,
  ShieldCheck,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';

const DEFAULT_PORTAL_URL = 'https://gyansaipp.vercel.app/';

function getSafeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function ExamsPage() {
  const { site, exams } = useSite();
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'upcoming' | 'completed'>('all');
  const [portalOpen, setPortalOpen] = useState(false);

  const portalUrl = (site.exam_portal_url || DEFAULT_PORTAL_URL).trim() || DEFAULT_PORTAL_URL;
  const filteredExams =
    statusFilter === 'all' ? exams : exams.filter((exam) => exam.status === statusFilter);

  return (
    <>
      <PageHero
        kicker="Gyansai e-Exams & Scholarship Assessments"
        title="Online Test Portal & Examination Schedule"
        description="Launch live CBT mock exams directly on the Gyansai e-Exam Test Portal or browse upcoming GMAT scholarship tests, syllabus outlines, and direct test links."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#AA2451] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#8E1C42] sm:w-auto"
          >
            <Laptop className="h-4 w-4" aria-hidden="true" />
            <span>Open Gyansai e-Exam Portal</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setPortalOpen((prev) => !prev)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
          >
            {portalOpen ? (
              <>
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
                <span>Hide Embedded Portal</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                <span>Take Exam Inside Page</span>
              </>
            )}
          </button>
        </div>
      </PageHero>

      {/* Integrated Gyansai e-Exam Online Test Portal Section */}
      <section className="border-b border-slate-200 bg-[#F5F7FB] py-8 sm:py-12">
        <div className="shell">
          <div className="surface-elevated overflow-hidden">
            <div className="flex flex-col gap-5 bg-[#142A58] p-5 text-white sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFBE1B]">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Official Online Examination Platform</span>
                </div>
                <h2 className="display-face text-xl font-bold text-white sm:text-2xl">
                  Gyansai e-Exam Live Test Portal
                </h2>
                <p className="max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
                  Attempt JEE Main, JEE Advanced, MHT-CET, Board, and Foundation practice papers
                  online with real-time timer, instant scorecards, and chapter-level accuracy
                  tracking on mobile, tablet, or desktop.
                </p>
                <p className="font-mono-num truncate text-xs text-white/65">{portalUrl}</p>
              </div>

              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setPortalOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 sm:text-sm"
                >
                  {portalOpen ? (
                    <>
                      <Minimize2 className="h-4 w-4" aria-hidden="true" />
                      <span>Close Portal View</span>
                    </>
                  ) : (
                    <>
                      <Laptop className="h-4 w-4" aria-hidden="true" />
                      <span>Launch Here</span>
                    </>
                  )}
                </button>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFBE1B] px-5 py-2.5 text-xs font-bold text-[#142A58] transition hover:bg-[#f2b10c] sm:text-sm"
                >
                  <span>Open Full Portal</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {portalOpen && (
              <div className="border-t border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
                  <span className="font-mono-num truncate font-medium text-[#142A58]">
                    Live Portal: {getSafeHostname(portalUrl)}
                  </span>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#AA2451] hover:underline"
                  >
                    <span>Open in new tab for fullscreen</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
                <iframe
                  title="Gyansai e-Exam Online Test Portal"
                  src={portalUrl}
                  className="h-[72vh] min-h-[520px] w-full border-0 bg-white"
                  allow="fullscreen; clipboard-write"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scheduled Exams & Direct Test Links */}
      <section className="shell py-10 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display-face text-2xl font-bold text-[#1F386B] sm:text-3xl">
              Examination <span className="text-[#AA2451]">Schedule &amp; Test Links</span>
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Select any scheduled exam below to start on the test portal or register for the next
              attempt.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter exams by status"
            className="flex flex-wrap items-center gap-2"
          >
            {(
              [
                { id: 'all', label: 'All Exams' },
                { id: 'open', label: 'Open Now' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#142A58] text-white'
                      : 'border border-slate-200 bg-white text-[#1F386B] hover:border-[#AA2451]/40'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredExams.length === 0 ? (
          <div className="surface mt-8 p-8 text-center">
            <p className="text-sm font-medium text-slate-600">
              No examinations listed under this status right now.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {filteredExams.map((exam) => {
              const rawUrl = (exam.registration_url || '').trim();
              const isExternal = /^https?:\/\//i.test(rawUrl);

              return (
                <article
                  key={exam.id}
                  className="surface surface-hover flex flex-col p-5 sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-500">
                      {exam.course_category} · {exam.class_level}
                    </span>
                    <span
                      className={`font-bold ${
                        exam.status === 'open'
                          ? 'text-emerald-700'
                          : exam.status === 'upcoming'
                            ? 'text-[#AA2451]'
                            : 'text-slate-500'
                      }`}
                    >
                      {exam.status === 'open'
                        ? 'Registration / Test Open'
                        : exam.status === 'upcoming'
                          ? 'Upcoming'
                          : 'Completed'}
                    </span>
                  </div>

                  <h3 className="display-face mt-2.5 text-xl font-bold text-[#1F386B] sm:text-2xl">
                    {exam.title}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-y border-slate-100 py-3.5 text-xs text-slate-600">
                    <span className="font-mono-num inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-[#AA2451]" aria-hidden="true" />
                      {exam.exam_date} at {exam.exam_time}
                    </span>
                    <span className="font-mono-num inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#AA2451]" aria-hidden="true" />
                      {exam.duration_minutes} minutes
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#AA2451]" aria-hidden="true" />
                      {exam.mode}
                    </span>
                  </div>

                  <div className="mt-4 flex-1 space-y-3 text-sm text-slate-600">
                    {exam.syllabus && (
                      <p>
                        <span className="font-semibold text-[#1F386B]">Syllabus:</span>{' '}
                        {exam.syllabus}
                      </p>
                    )}
                    {exam.instructions && (
                      <p>
                        <span className="font-semibold text-[#1F386B]">Instructions:</span>{' '}
                        {exam.instructions}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-1">
                    {isExternal ? (
                      <>
                        <a
                          href={rawUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#AA2451] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#8E1C42] sm:w-auto"
                        >
                          <span>Start Online Exam / Open Portal</span>
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <span className="font-mono-num truncate text-xs text-slate-400">
                          {getSafeHostname(rawUrl)}
                        </span>
                      </>
                    ) : (
                      <Link
                        to={rawUrl || '/admission'}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#AA2451] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#8E1C42] sm:w-auto"
                      >
                        <span>Register for Examination</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
