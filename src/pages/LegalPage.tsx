import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';

export function LegalPage({ mode }: { mode: 'privacy' | 'terms' }) {
  const { site } = useSite();

  if (mode === 'privacy') {
    return (
      <>
        <PageHero
          kicker="Legal & Data Practices"
          title="Privacy Policy"
          description={`How ${site.institute_name} collects, protects, and uses student and parent contact information.`}
        />
        <section className="shell max-w-3xl space-y-5 py-12 text-sm leading-relaxed text-slate-700 sm:py-16">
          <h2 className="display-face text-2xl font-bold text-[#1F386B]">
            1. Information We Collect
          </h2>
          <p>
            When you submit an enquiry or admission application on this website, we collect the
            student’s name, parent or guardian name, mobile number, email address, current academic
            class, and preferred batch timing solely to respond to your academic request.
          </p>
          <h2 className="display-face text-2xl font-bold text-[#1F386B]">
            2. How We Protect Your Data
          </h2>
          <p>
            Student enquiries and admission forms are stored with strict administrator-only access
            controls. We never sell, rent, or share parent or student phone numbers with third-party
            marketers.
          </p>
          <h2 className="display-face text-2xl font-bold text-[#1F386B]">
            3. Published Academic Results
          </h2>
          <p>
            Student achievements, photographs, and testimonials are published on our website only
            after verification and consent from the student and family.
          </p>
          <h2 className="display-face text-2xl font-bold text-[#1F386B]">4. Contact</h2>
          <p>
            For any data correction or removal requests, write to{' '}
            <a href={`mailto:${site.email}`} className="font-semibold text-[#AA2451] hover:underline">
              {site.email}
            </a>{' '}
            or call {site.phone}.
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        kicker="Institutional Guidelines"
        title="Terms & Conditions"
        description={`General website usage and admission terms for ${site.institute_name}, Chhatrapati Sambhajinagar.`}
      />
      <section className="shell max-w-3xl space-y-5 py-12 text-sm leading-relaxed text-slate-700 sm:py-16">
        <h2 className="display-face text-2xl font-bold text-[#1F386B]">
          1. Online Application Status
        </h2>
        <p>
          Submitting an online admission form generates an application reference number for
          counselling and seat reservation review. Final enrollment is confirmed only at the New
          Usmanpura campus upon verification and fee registration.
        </p>
        <h2 className="display-face text-2xl font-bold text-[#1F386B]">
          2. Batch Timings &amp; Attendance
        </h2>
        <p>
          Students are expected to maintain regular classroom attendance, submit daily practice
          papers (DPPs), and appear for scheduled weekly assessments. Parents are updated regularly
          regarding attendance and test performance.
        </p>
        <h2 className="display-face text-2xl font-bold text-[#1F386B]">
          3. Study Material Intellectual Property
        </h2>
        <p>
          All printed notes, DPPs, test papers, and recorded concept lectures shared with enrolled
          students are for personal academic use only and may not be redistributed commercially.
        </p>
      </section>
    </>
  );
}
