import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  FileSpreadsheet,
  GraduationCap,
  Laptop,
  MapPin,
  Phone,
  Play,
  Users,
  X,
} from 'lucide-react';
import { ASSETS } from '../data/gyansaiData';
import { useSite } from '../context/SiteContext';
import { SafeImage } from '../components/SafeImage';
import { DualTitle } from '../components/SectionHeading';
import { EnquiryForm } from '../components/EnquiryForm';
import { LectureModal } from '../components/LectureModal';
import type { VideoLecture } from '../types';

interface HeroSlide {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  secondaryLabel: string;
  secondaryLink: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'gmat-scholarship',
    kicker: 'GMAT 2026 · Entrance cum Scholarship Examination',
    title: 'Up to 50% scholarship on IIT-JEE & MHT-CET batches',
    subtitle:
      'Appear for the Gyansai Maths Aptitude & Scholarship Test at our New Usmanpura campus and start your Class 11–12 engineering preparation with Prof. Taterao Kendre (KT Sir).',
    ctaLabel: 'Enroll for GMAT 2026',
    ctaLink: '/exams',
    secondaryLabel: 'Apply for Admission',
    secondaryLink: '/admission',
    image: ASSETS.hero,
  },
  {
    id: 'jee-cet-batches',
    kicker: 'Admissions Open · 2026–27 Academic Session',
    title: 'Structured IIT-JEE, MHT-CET & 11th–12th Maths mastery',
    subtitle:
      'Small classroom batches, graded Daily Practice Papers (DPPs), supervised doubt rooms, and cumulative weekly assessments in Chhatrapati Sambhajinagar since 2009.',
    ctaLabel: 'Apply for Admission',
    ctaLink: '/admission',
    secondaryLabel: 'Explore Programmes',
    secondaryLink: '/courses',
    image: ASSETS.mentoring,
  },
  {
    id: 'topper-legacy',
    kicker: '17+ Years of Academic Excellence · Est. 2009',
    title: 'Consistent IIT, NIT, COEP, VJTI & NDA selections',
    subtitle:
      'From 100/100 HSC Board Mathematics to 99.8+ percentile in JEE Main and MHT-CET — verified student records built through conceptual clarity and disciplined daily practice.',
    ctaLabel: 'View Verified Results',
    ctaLink: '/results',
    secondaryLabel: 'Meet Our Faculty',
    secondaryLink: '/faculty',
    image: ASSETS.toppers,
  },
];

const QUICK_ENROLL_TILES = [
  {
    title: 'GMAT Scholarship Exam',
    subtitle: 'Class 10 to 11 · Up to 50% Fee Waiver',
    to: '/exams',
    bgClass: 'bg-[#0D2775] hover:bg-[#0A1F5E]',
  },
  {
    title: 'Career Foundation',
    subtitle: 'Classes 8, 9 & 10 · Maths & Olympiads',
    to: '/courses/career-foundation-programme',
    bgClass: 'bg-[#480896] hover:bg-[#3A067A]',
  },
  {
    title: 'JEE & CET Test Series',
    subtitle: 'Weekly OMR & CBT Pattern Mocks',
    to: '/exams',
    bgClass: 'bg-[#1F386B] hover:bg-[#162951]',
  },
  {
    title: 'JEE Dropper / Repeaters',
    subtitle: '1-Year Intensive Rank Booster Batch',
    to: '/courses/jee-dropper-repeater-batch',
    bgClass: 'bg-[#AA2451] hover:bg-[#8E1C42]',
  },
];

const WELCOME_PILLARS = [
  {
    title: 'Direct Teaching by KT Sir',
    description:
      'Core IIT-JEE, MHT-CET, and Board Mathematics batches are personally taught and mentored by Prof. Taterao Kendre across the full academic year.',
    icon: GraduationCap,
  },
  {
    title: 'Subject-Specialist Faculty',
    description:
      'Experienced educators dedicated to Calculus, Coordinate Geometry, Algebra, Foundation Olympiads, and University Engineering Maths.',
    icon: Users,
  },
  {
    title: 'Daily Practice & Doubt Desk',
    description:
      'Graded Level 1–3 Daily Practice Papers checked every day alongside a quiet, faculty-supervised study room at New Usmanpura.',
    icon: BookOpen,
  },
  {
    title: 'Weekly Tests & Parent Sync',
    description:
      'Timed Sunday chapter tests and cumulative mock papers with honest attendance and progress updates shared directly with parents.',
    icon: FileSpreadsheet,
  },
];

const VALUE_OFFERINGS = [
  {
    id: 'e-learning',
    title: 'Gyansai e-Learning',
    subtitle: 'Recorded concept derivations, formula compendiums & home revision support',
    bgClass: 'bg-[#1F386B] hover:bg-[#172B54]',
    icon: Laptop,
    ctaLabel: 'Browse Video Lectures',
    ctaLink: '/lectures',
    bullets: [
      'Topic-wise recorded Mathematics derivations by Prof. Taterao Kendre (KT Sir)',
      'Solved 20-year JEE Main, JEE Advanced, and MHT-CET previous-year walkthroughs',
      'Chapterwise formula handbooks and revision checklists for board & entrance months',
      'Seamless backup whenever a student misses a class due to school exams or illness',
    ],
  },
  {
    id: 'e-exams',
    title: 'Gyansai e-Exams',
    subtitle: 'Live Online CBT Test Portal (gyansaipp.vercel.app) with instant scorecards & analytics',
    bgClass: 'bg-[#13254B] hover:bg-[#0D1B38]',
    icon: FileSpreadsheet,
    ctaLabel: 'Open e-Exam Test Portal',
    ctaLink: 'https://gyansaipp.vercel.app/',
    bullets: [
      'Direct access to the official Gyansai Online Test Portal on mobile, tablet & desktop',
      'Weekly chapterwise tests mirroring exact JEE Main and MHT-CET exam interfaces',
      'Instant accuracy breakdown identifying conceptual gaps vs. calculation slips',
      'Cumulative full-syllabus mock series with parent progress updates',
    ],
  },
];

type PopularTrack = 'foundation' | 'engineering' | 'university';

export function HomePage() {
  const { site, courses, results, lectures } = useSite();
  const [slideIdx, setSlideIdx] = useState(0);
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [activeOffering, setActiveOffering] = useState<(typeof VALUE_OFFERINGS)[number] | null>(
    null
  );
  const [resultFilter, setResultFilter] = useState<string>('All');
  const [activeTrack, setActiveTrack] = useState<PopularTrack>('engineering');
  const [activeLecture, setActiveLecture] = useState<VideoLecture | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const liveSlides: HeroSlide[] = [
    {
      ...HERO_SLIDES[0],
      title: site.hero_title || HERO_SLIDES[0].title,
      subtitle: site.hero_subtitle || site.tagline || HERO_SLIDES[0].subtitle,
    },
    HERO_SLIDES[1],
    HERO_SLIDES[2],
  ];

  const currentSlide = liveSlides[slideIdx];
  const resultCategories = ['All', ...Array.from(new Set(results.map((r) => r.category)))];
  const filteredResults =
    resultFilter === 'All' ? results : results.filter((r) => r.category === resultFilter);

  const foundationCourse =
    courses.find((c) => c.slug === 'career-foundation-programme') || courses[4] || courses[0];
  const engineeringCourse =
    courses.find((c) => c.slug === 'iit-jee-two-year-integrated') || courses[0];
  const cetCourse = courses.find((c) => c.slug === 'mht-cet-board-mastery') || courses[1] || courses[0];
  const universityCourse =
    courses.find((c) => c.slug === 'engineering-mathematics-batu') || courses[5] || courses[0];

  const popularTracks: {
    id: PopularTrack;
    tabLabel: string;
    heading: string;
    subHeading: string;
    description: string;
    image: string;
    link: string;
  }[] = [
    {
      id: 'foundation',
      tabLabel: 'Foundation (8–10)',
      heading: 'Foundation',
      subHeading: 'Class 8 to 10 · School + Olympiad',
      description:
        foundationCourse?.description ||
        'Early conceptual grooming for Class 8, 9, and 10 students building strong school board mastery alongside logical problem solving for future IIT-JEE and MHT-CET preparation.',
      image: ASSETS.mentoring,
      link: `/courses/${foundationCourse?.slug || 'career-foundation-programme'}`,
    },
    {
      id: 'engineering',
      tabLabel: 'IIT-JEE & MHT-CET',
      heading: 'IIT-JEE | MHT-CET',
      subHeading: 'Class 11, 12 & Repeaters',
      description:
        engineeringCourse?.description ||
        'Flagship two-year integrated and repeater batches led by KT Sir — pairing first-principles Calculus, Algebra, and Coordinate Geometry with daily DPPs and weekly mock exams.',
      image: ASSETS.hero,
      link: `/courses/${engineeringCourse?.slug || 'iit-jee-two-year-integrated'}`,
    },
    {
      id: 'university',
      tabLabel: 'Boards & Engg. Maths',
      heading: 'Boards & BATU Maths',
      subHeading: '12th HSC/CBSE · F.E. / S.E. M1–M3',
      description:
        `${cetCourse?.name || 'MHT-CET & Board Mastery'} & ${universityCourse?.name || 'DBATU Engineering Mathematics'} — structured theorem presentation, university PYQ banks, and distinction-focused revision.`,
      image: ASSETS.courseDesk,
      link: `/courses/${universityCourse?.slug || 'engineering-mathematics-batu'}`,
    },
  ];

  const mapQuery = encodeURIComponent(
    site.map_query || 'Sant Eknath Rang Mandir, New Usmanpura, Chhatrapati Sambhajinagar, Maharashtra 431001'
  );

  return (
    <>
      {/* 1. Full-Width Interactive Hero Slider (#banner) */}
      <section className="relative overflow-hidden bg-[#13254B] text-white">
        <div className="relative flex min-h-[440px] items-center sm:min-h-[540px] lg:min-h-[600px]">
          <SafeImage
            src={currentSlide.image}
            alt={currentSlide.title}
            eager
            className="absolute inset-0 h-full w-full opacity-40 transition-opacity duration-500"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(95deg, rgba(19,37,75,0.95) 0%, rgba(31,56,107,0.84) 55%, rgba(19,37,75,0.45) 100%)',
            }}
            aria-hidden="true"
          />

          <div className="shell relative z-10 w-full py-10 sm:py-16 lg:py-20">
            <div key={currentSlide.id} className="rise-in max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-[#FF9EC0]">
                {currentSlide.kicker}
              </p>
              <h1 className="display-face mt-3 text-2xl font-extrabold leading-[1.12] text-white sm:text-5xl lg:text-[3.4rem]">
                {currentSlide.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-lg">
                {currentSlide.subtitle}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
                <Link
                  to={currentSlide.ctaLink}
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#AA2451] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#8E1C42] sm:w-auto"
                >
                  <span>{currentSlide.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to={currentSlide.secondaryLink}
                  className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
                >
                  {currentSlide.secondaryLabel}
                </Link>
              </div>
            </div>

            {/* Slide Controls */}
            <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setSlideIdx(idx)}
                    aria-label={`Show slide ${idx + 1}: ${slide.title}`}
                    aria-current={idx === slideIdx}
                    className={`h-2 rounded-full transition-all ${
                      idx === slideIdx
                        ? 'w-9 bg-[#AA2451]'
                        : 'w-2.5 bg-white/45 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                  }
                  aria-label="Previous slide"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
                  aria-label="Next slide"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Enrollment Links (Signature 4-Tile Action Strip) */}
      {site.show_quick_links !== false && (
        <section className="shell py-12 sm:py-16">
          <DualTitle lead="Quick" accent="Enrollment Links" />

          <div className="surface-elevated mt-8 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK_ENROLL_TILES.map((tile) => (
                <Link
                  key={tile.title}
                  to={tile.to}
                  className={`group flex min-h-[138px] flex-col justify-between rounded-xl p-5 text-white transition ${tile.bgClass}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="display-face text-lg font-bold leading-snug text-white">
                      {tile.title}
                    </h3>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-white/80 transition-transform group-hover:translate-x-1 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-white/80">{tile.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Value Offerings (Signature 2-Column Digital Platform Cards) */}
      {site.show_value_offerings !== false && (
        <section className="bg-[#F5F7FB] py-12 sm:py-16">
          <div className="shell">
            <DualTitle
              lead="Value"
              accent="Offerings"
              subtitle="Classroom teaching reinforced by structured digital revision and weekly exam analytics."
            />

            <div className="surface-elevated mt-8 p-4 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {VALUE_OFFERINGS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveOffering(item)}
                      className={`group flex items-center justify-between gap-3.5 rounded-xl p-5 text-left text-white transition sm:gap-5 sm:p-8 ${item.bgClass}`}
                    >
                      <div className="flex min-w-0 items-center gap-3.5 sm:gap-5">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/12 text-white sm:h-14 sm:w-14">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="display-face text-lg font-bold text-white sm:text-2xl">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-white/80 sm:text-sm">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="h-5 w-5 shrink-0 text-white/75 transition-transform group-hover:translate-x-1 group-hover:text-white sm:h-6 sm:w-6"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Welcome / About Section + 4 Pillar Feature Boxes (#about) */}
      <section className="shell py-14 sm:py-20">
        <div className="surface-elevated p-6 sm:p-10">
          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#AA2451]">
                Est. 2009 · New Usmanpura, Chhatrapati Sambhajinagar
              </p>
              <h2 className="display-face mt-2 text-2xl font-bold text-[#1F386B] sm:text-4xl">
                {site.about_heading || (
                  <>
                    Best coaching for{' '}
                    <span className="text-[#AA2451]">IIT-JEE, MHT-CET &amp; Mathematics</span>
                  </>
                )}
              </h2>
              <div className="section-rule mt-3" aria-hidden="true" />

              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-600">
                <p>{site.about_intro}</p>
                <p>
                  Guided by <strong>{site.founder_name || 'Prof. Taterao Kendre (KT Sir)'}</strong>,{' '}
                  <strong>{site.institute_name}</strong> mentors students across Chhatrapati
                  Sambhajinagar and Marathwada to compete confidently at state and national levels,
                  turning Mathematics from an exam hurdle into their highest-scoring strength.
                </p>
                {expandedAbout && (
                  <p>
                    Every classroom lecture begins with clean board derivations from first
                    principles, moves into graded in-class problem solving, and is reinforced by
                    Daily Practice Papers (DPPs), a supervised doubt-clearing desk, and weekly
                    Sunday tests with honest written updates to parents.
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#AA2451] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#8E1C42]"
                >
                  <span>Know More About Us</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setExpandedAbout((prev) => !prev)}
                  className="text-sm font-semibold text-[#1F386B] underline-offset-4 hover:text-[#AA2451] hover:underline"
                >
                  {expandedAbout ? 'Show Less' : 'Read More'}
                </button>
              </div>
            </div>

            {/* 2x2 Feature Pillar Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {WELCOME_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="surface surface-hover flex flex-col justify-between p-5"
                  >
                    <div>
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#1F386B]/10 text-[#1F386B]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="display-face mt-3.5 text-base font-bold text-[#1F386B]">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Selections Counter Band (Signature Dual High-Impact Banner) */}
      <section className="bg-[#1F386B] py-12 text-white sm:py-16">
        <div className="shell">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex items-center gap-5 rounded-xl border border-white/15 bg-white/8 p-6 sm:p-8">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#AA2451] text-white">
                <Compass className="h-8 w-8" aria-hidden="true" />
              </span>
              <div>
                <p className="display-face font-mono-num text-3xl font-extrabold text-white sm:text-4xl">
                  {site.stat_selections_value || '1,450+'}
                </p>
                <p className="mt-1 text-sm font-bold tracking-wide text-[#FF9EC0]">
                  {site.stat_selections_label || 'Engineering & NDA Selections'}
                </p>
                <p className="mt-1 text-xs text-white/75">
                  Alumni admitted to IITs, NITs, IIITs, COEP, VJTI, BITS Pilani &amp; NDA since 2009
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-xl border border-white/15 bg-white/8 p-6 sm:p-8">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#AA2451] text-white">
                <Award className="h-8 w-8" aria-hidden="true" />
              </span>
              <div>
                <p className="display-face font-mono-num text-3xl font-extrabold text-white sm:text-4xl">
                  {site.stat_percentile_value || '99.8+'} %ile
                </p>
                <p className="mt-1 text-sm font-bold tracking-wide text-[#FF9EC0]">
                  {site.stat_percentile_label || 'Top Mathematics Percentiles'}
                </p>
                <p className="mt-1 text-xs text-white/75">
                  Consistent 99+ percentile JEE Main &amp; MHT-CET toppers and 100/100 HSC scores
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Legacy of Excellence (Results Showcase Grid) */}
      {site.show_results_section !== false && (
      <section className="bg-[#F5F7FB] py-14 sm:py-20">
        <div className="shell">
          <DualTitle
            lead="Legacy"
            accent="of Excellence"
            subtitle="Verified JEE, MHT-CET, Board, BITSAT, and NDA achievements published with student consent."
          />

          {/* Interactive Category Filter Bar */}
          <div
            role="tablist"
            aria-label="Filter achievers by exam"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {resultCategories.map((cat) => {
              const active = resultFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setResultFilter(cat)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#AA2451] text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-[#1F386B] hover:border-[#AA2451]/45'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResults.slice(0, 6).map((res) => (
              <article
                key={res.id}
                className="surface surface-hover flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between bg-[#1F386B] px-5 py-3.5 text-white">
                  <span className="text-xs font-medium text-white/80">
                    {res.category} · {res.academic_year}
                  </span>
                  <span className="font-mono-num text-lg font-bold text-[#FF9EC0]">
                    {res.score}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display-face text-xl font-bold text-[#1F386B]">
                    {res.student_name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">{res.achievement_title}</p>
                  <p className="mt-2 text-xs text-slate-500">{res.class_level}</p>
                  {res.college_admitted && (
                    <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-[#AA2451]">
                      {res.college_admitted}
                    </p>
                  )}
                </div>
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <Link
                    to="/results"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F386B] transition hover:text-[#AA2451]"
                  >
                    <span>View More Results</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 7. Inspiring the Aspirants (3-Column Video Showcase) */}
      {site.show_lectures_section !== false && (
      <section className="shell py-14 sm:py-20">
        <DualTitle
          lead="Inspiring"
          accent="the Aspirants"
          subtitle="Watch classroom derivation sessions, topper strategies, and MHT-CET speed workshops."
        />

        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {lectures.slice(0, 3).map((lec) => (
            <article key={lec.id} className="surface surface-hover flex flex-col overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveLecture(lec)}
                className="group relative aspect-video w-full overflow-hidden bg-[#13254B] text-left"
              >
                <SafeImage
                  src={lec.thumbnail_url}
                  alt={lec.title}
                  className="h-full w-full opacity-80 transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#AA2451] text-white shadow-xl transition group-hover:scale-110">
                  <Play className="h-6 w-6 fill-current pl-0.5" aria-hidden="true" />
                </span>
                <span className="font-mono-num absolute bottom-3 right-3 rounded bg-black/75 px-2 py-0.5 text-xs font-medium text-white">
                  {lec.duration_label}
                </span>
              </button>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium text-slate-500">
                  {lec.subject} · {lec.class_level}
                </p>
                <h3 className="display-face mt-1.5 text-lg font-bold text-[#1F386B]">
                  {lec.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
                  {lec.summary}
                </p>
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-[#AA2451]">
                  {lec.teacher_name}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/lectures"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#1F386B]/25 px-5 py-2.5 text-sm font-semibold text-[#1F386B] transition hover:bg-[#F5F7FB]"
          >
            <span>Open Complete Lecture Library</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
      )}

      {/* 8. Popular Courses (Interactive Toggle + 3-Card Programme Showcase) */}
      {site.show_courses_section !== false && (
      <section className="bg-[#F5F7FB] py-14 sm:py-20">
        <div className="shell">
          <DualTitle
            lead="Popular"
            accent="Courses"
            subtitle="Choose the programme aligned with your current class and target engineering or board exam."
          />

          {/* Interactive Track Toggle (Matches Lalit Tutorials Toggle UX) */}
          <div className="mt-7 flex justify-center">
            <div
              role="tablist"
              aria-label="Highlight course track"
              className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs"
            >
              {popularTracks.map((t) => {
                const active = activeTrack === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTrack(t.id)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${
                      active
                        ? 'bg-[#1F386B] text-white'
                        : 'text-[#1F386B] hover:bg-slate-100'
                    }`}
                  >
                    {t.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {popularTracks.map((track) => {
              const highlighted = activeTrack === track.id;
              return (
                <article
                  key={track.id}
                  onClick={() => setActiveTrack(track.id)}
                  className={`flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white transition ${
                    highlighted
                      ? 'border-[#AA2451] shadow-lg ring-2 ring-[#AA2451]/15'
                      : 'border-slate-200 hover:border-[#1F386B]/35'
                  }`}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <SafeImage
                      src={track.image}
                      alt={track.heading}
                      className="h-full w-full transition duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 text-center">
                    <h3 className="display-face text-xl font-bold text-[#1F386B]">
                      {track.heading}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#AA2451]">{track.subHeading}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {track.description}
                    </p>
                    <div className="mt-6">
                      <Link
                        to={track.link}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                          highlighted
                            ? 'bg-[#AA2451] text-white hover:bg-[#8E1C42]'
                            : 'bg-[#1F386B] text-white hover:bg-[#13254B]'
                        }`}
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1F386B] hover:text-[#AA2451]"
            >
              <span>View all 6 programmes including BITSAT, NDA &amp; Repeater batches</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* 9. Find Our Location & Leave a Feedback / Enquiry (Signature 2-Column Split) */}
      {site.show_location_section !== false && (
      <section className="shell py-14 sm:py-20">
        <div className="grid items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: Find Our Location */}
          <div className="surface flex flex-col overflow-hidden">
            <div className="p-6 pb-4">
              <h2 className="display-face text-2xl font-bold text-[#1F386B]">
                Find Our <span className="text-[#AA2451]">Location</span>
              </h2>
              <div className="section-rule mt-2.5" aria-hidden="true" />
            </div>

            <div className="min-h-[270px] flex-1 bg-slate-100">
              <iframe
                title="Gyansai Maths IIT Center New Usmanpura Map"
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="h-full min-h-[270px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="space-y-2 border-t border-slate-100 bg-[#F9FBFE] p-5 text-xs text-slate-700">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#AA2451]" aria-hidden="true" />
                <span>{site.address}</span>
              </p>
              <p className="flex items-center gap-2 font-mono-num">
                <Phone className="h-4 w-4 shrink-0 text-[#AA2451]" aria-hidden="true" />
                <a href={`tel:${site.phone}`} className="font-semibold text-[#1F386B] hover:underline">
                  {site.phone}
                </a>
                {site.secondary_phone && (
                  <>
                    <span>·</span>
                    <a
                      href={`tel:${site.secondary_phone}`}
                      className="font-semibold text-[#1F386B] hover:underline"
                    >
                      {site.secondary_phone}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right: Leave a Feedback / Enquiry */}
          <div className="surface p-6 sm:p-8">
            <h2 className="display-face text-2xl font-bold text-[#1F386B]">
              Leave a <span className="text-[#AA2451]">Feedback / Enquiry</span>
            </h2>
            <div className="section-rule mt-2.5" aria-hidden="true" />
            <p className="mb-6 mt-3 text-sm text-slate-600">
              Have a question about upcoming batch timings, GMAT scholarship dates, or demo
              lectures? Send us a message directly.
            </p>
            <EnquiryForm source="homepage-feedback" submitLabel="Submit Enquiry" compact />
          </div>
        </div>
      </section>
      )}

      {/* Value Offering Interactive Detail Modal */}
      {activeOffering && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeOffering.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1A35]/80 p-4 backdrop-blur-xs"
          onClick={() => setActiveOffering(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 bg-[#1F386B] px-5 py-4 text-white sm:px-6 sm:py-5">
              <div>
                <p className="text-xs font-semibold text-[#FF9EC0]">Digital Support Ecosystem</p>
                <h3 className="display-face mt-1 text-xl font-bold sm:text-2xl">
                  {activeOffering.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOffering(null)}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-white/75 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-sm text-slate-600">{activeOffering.subtitle}</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {activeOffering.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#AA2451]" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActiveOffering(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                {activeOffering.id === 'e-exams' ? (
                  <>
                    <Link
                      to="/exams"
                      onClick={() => setActiveOffering(null)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#1F386B]/25 px-4 py-2 text-xs font-bold text-[#1F386B] hover:bg-slate-50"
                    >
                      <span>Exam Schedule</span>
                    </Link>
                    <a
                      href={site.exam_portal_url || 'https://gyansaipp.vercel.app/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setActiveOffering(null)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#AA2451] px-4 py-2 text-xs font-bold text-white hover:bg-[#8E1C42]"
                    >
                      <span>Open e-Exam Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </>
                ) : (
                  <Link
                    to={activeOffering.ctaLink}
                    onClick={() => setActiveOffering(null)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#AA2451] px-4 py-2 text-xs font-bold text-white hover:bg-[#8E1C42]"
                  >
                    <span>{activeOffering.ctaLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <LectureModal lecture={activeLecture} onClose={() => setActiveLecture(null)} />
    </>
  );
}
