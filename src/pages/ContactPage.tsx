import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';
import { EnquiryForm } from '../components/EnquiryForm';

export function ContactPage() {
  const { site } = useSite();
  const waDigits = (site.whatsapp || site.phone || '').replace(/\D/g, '');
  const mapQuery = encodeURIComponent(site.map_query || site.address);

  return (
    <>
      <PageHero
        kicker="Get in Touch"
        title={`Contact ${site.institute_name}`}
        description="Visit our campus in New Usmanpura, Chhatrapati Sambhajinagar, call our admissions desk directly, or send an enquiry below."
      />

      <section className="shell grid items-start gap-8 py-12 sm:py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="surface p-6 sm:p-7">
            <h2 className="display-face text-2xl font-bold text-[#1F386B]">
              Campus &amp; <span className="text-[#AA2451]">Admissions Desk</span>
            </h2>
            <div className="section-rule mt-2.5" aria-hidden="true" />
            <p className="mt-3 text-sm text-slate-600">
              Meet our faculty, review daily practice worksheets, and discuss the right batch for
              your child.
            </p>

            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#AA2451]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#1F386B]">Campus Address</p>
                  <p className="mt-0.5 text-slate-600">{site.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-block text-xs font-semibold text-[#AA2451] hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#AA2451]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#1F386B]">Phone Numbers</p>
                  <div className="mt-0.5 space-y-0.5 font-mono-num">
                    <a
                      href={`tel:${site.phone}`}
                      className="block text-slate-700 hover:text-[#AA2451]"
                    >
                      {site.phone}
                    </a>
                    {site.secondary_phone && (
                      <a
                        href={`tel:${site.secondary_phone}`}
                        className="block text-slate-700 hover:text-[#AA2451]"
                      >
                        {site.secondary_phone}
                      </a>
                    )}
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#AA2451]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#1F386B]">Email</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-0.5 block break-all text-slate-700 hover:text-[#AA2451]"
                  >
                    {site.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#AA2451]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#1F386B]">Office Hours</p>
                  <p className="mt-0.5 text-slate-600">{site.office_hours}</p>
                </div>
              </li>
            </ul>

            {waDigits && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <a
                  href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                    `Hello ${site.institute_name}, I would like to enquire about admissions.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe5b]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          <div className="surface overflow-hidden">
            <iframe
              title={`${site.institute_name} Location Map`}
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="surface p-6 sm:p-8">
          <h2 className="display-face text-2xl font-bold text-[#1F386B]">
            Send an <span className="text-[#AA2451]">Enquiry</span>
          </h2>
          <div className="section-rule mt-2.5" aria-hidden="true" />
          <p className="mb-6 mt-3 text-sm text-slate-600">
            Fields marked with * are required. Our team will get back to you with batch schedules
            and counselling timings.
          </p>
          <EnquiryForm source="contact-page" submitLabel="Submit Enquiry" />
        </div>
      </section>
    </>
  );
}
