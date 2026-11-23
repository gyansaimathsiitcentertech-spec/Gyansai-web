import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';

export function FacultyPage() {
  const { faculty } = useSite();

  return (
    <>
      <PageHero
        kicker="Academic Leadership"
        title="Faculty and mentors"
        description="Experienced Mathematics educators led by Founder Prof. Taterao Kendre (KT Sir), staying with every batch from the first lecture to the final examination."
      />

      <section className="shell py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {faculty.map((member) => (
            <article
              key={member.id}
              className="surface surface-hover grid overflow-hidden sm:grid-cols-[0.42fr_0.58fr]"
            >
              <div className="aspect-[4/3] w-full bg-[#F5F7FB] sm:aspect-auto sm:h-full">
                <SafeImage src={member.photo_url} alt={member.name} className="h-full w-full" />
              </div>
              <div className="flex flex-col justify-center p-6">
                <p className="text-xs font-semibold text-[#AA2451]">{member.subject}</p>
                <h2 className="display-face mt-1.5 text-2xl font-bold text-[#1F386B]">
                  {member.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-700">{member.role}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {member.qualification} · {member.experience}
                </p>
                <p className="mt-3.5 text-sm leading-relaxed text-slate-600">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
