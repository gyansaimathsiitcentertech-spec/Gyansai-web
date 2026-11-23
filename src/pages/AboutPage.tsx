import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ABOUT_HIGHLIGHTS, APPROACH_STEPS, ASSETS } from '../data/gyansaiData';
import { useSite } from '../context/SiteContext';
import { DualTitle, PageHero } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';

export function AboutPage() {
  const { site } = useSite();

  return (
    <>
      <PageHero
        kicker="About Us · Est. 2009"
        title={site.about_heading}
        description={site.about_intro}
      />

      <section className="shell py-14 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 text-[15px] leading-relaxed text-slate-700">
            <h2 className="display-face text-3xl font-bold text-[#1F386B]">
              Building genuine mathematical confidence{' '}
              <span className="text-[#AA2451]">since 2009</span>
            </h2>
            <div className="section-rule" aria-hidden="true" />
            <p>
              Founded under the academic leadership of{' '}
              <strong>{site.founder_name || 'Prof. Taterao Kendre (KT Sir)'}</strong>,{' '}
              <strong>{site.institute_name}</strong> was established in New Usmanpura, Chhatrapati
              Sambhajinagar with a focused conviction: Mathematics is never difficult when taught
              from first principles with steady daily practice.
            </p>
            {site.founder_message && (
              <blockquote className="rounded-xl border-l-4 border-[#AA2451] bg-[#F5F7FB] p-5 text-sm italic text-slate-700">
                “{site.founder_message}”
                <footer className="mt-2 not-italic text-xs font-bold text-[#1F386B]">
                  — {site.founder_name || 'Prof. Taterao Kendre (KT Sir)'}
                </footer>
              </blockquote>
            )}
            <p>
              Over seventeen years, our students have consistently secured admissions into IITs,
              NITs, IIITs, COEP Technological University, VJTI Mumbai, BITS Pilani, and the
              National Defence Academy (NDA). Equally important, students who join us apprehensive
              about Calculus or Coordinate Geometry discover clarity, discipline, and exam composure.
            </p>
            <p>
              We deliberately keep batch sizes manageable so that our specialist faculty know every
              student by name, track daily practice papers (DPPs), review Sunday test mistakes
              personally, and maintain transparent communication with parents.
            </p>
            <p>
              Alongside our flagship Class 11–12 IIT-JEE, MHT-CET, and Board batches,{' '}
              {site.institute_name} runs dedicated Career Foundation programmes for Classes 8–10 and
              specialized Engineering Mathematics (M1, M2, M3) batches trusted by DBATU and BAMU
              undergraduates across the city.
            </p>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <SafeImage
                src={ASSETS.mentoring}
                alt="Prof. Taterao Kendre explaining calculus derivations to students"
                className="aspect-[4/3] w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ABOUT_HIGHLIGHTS.map((item) => (
                <div key={item.label} className="surface p-5">
                  <p className="display-face font-mono-num text-2xl font-bold text-[#1F386B]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FB] py-14 sm:py-20">
        <div className="shell">
          <DualTitle
            lead="Our Teaching"
            accent="Methodology"
            subtitle="A four-stage academic rhythm repeated across every chapter of the syllabus."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH_STEPS.map((item) => (
              <div key={item.step} className="surface p-6">
                <p className="font-mono-num text-xs font-bold text-[#AA2451]">{item.step}.</p>
                <h3 className="display-face mt-2 text-xl font-bold text-[#1F386B]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#1F386B] p-7 text-white sm:p-9">
            <div className="max-w-xl">
              <h3 className="display-face text-2xl font-bold text-white">
                Visit our New Usmanpura campus for a parent–mentor interaction
              </h3>
              <p className="mt-2 text-sm text-white/80">{site.address}</p>
            </div>
            <Link
              to="/admission"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#AA2451] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#8E1C42]"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
