import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { BATCH_PREFERENCES, CLASS_LEVELS } from '../data/gyansaiData';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1F386B] focus:ring-2 focus:ring-[#1F386B]/15';

export function AdmissionPage() {
  const { site, courses, submitAdmission } = useSite();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    student_name: '',
    parent_name: '',
    phone: '',
    email: '',
    class_level: '',
    course_name: searchParams.get('course') || '',
    preferred_batch: '',
    school: '',
    address: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [refCode, setRefCode] = useState('');

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.student_name.trim().length < 2) {
      nextErrors.student_name = 'Please enter the student’s full name.';
    }
    if (form.parent_name.trim().length < 2) {
      nextErrors.parent_name = 'Please enter the parent or guardian’s name.';
    }
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      nextErrors.phone = 'Enter a valid mobile number (10–13 digits).';
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.class_level) {
      nextErrors.class_level = 'Please select the student’s class.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('saving');
    setServerError('');
    const res = await submitAdmission(form);
    if (res.ok) {
      setRefCode(res.referenceCode || 'GSM-NEW');
      setStatus('done');
    } else {
      setStatus('error');
      setServerError(res.error || 'Could not save your application right now.');
    }
  };

  return (
    <>
      <PageHero
        kicker="Admissions · 2026–27 Session"
        title="Apply for admission at Gyansai Maths IIT Center"
        description="Submit your student profile below to receive an instant application reference number, batch schedule, and counselling appointment with Prof. Taterao Kendre (KT Sir)."
      >
        <a
          href={`tel:${site.phone}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF9EC0] hover:underline"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span className="font-mono-num">Prefer to talk? Call {site.phone}</span>
        </a>
      </PageHero>

      <section className="shell grid items-start gap-8 py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface p-6 sm:p-8">
          <h2 className="display-face text-2xl font-bold text-[#1F386B]">
            Admission <span className="text-[#AA2451]">Application Form</span>
          </h2>
          <div className="section-rule mt-2.5" aria-hidden="true" />
          <p className="mb-6 mt-3 text-sm text-slate-600">
            Fields marked with * are required. No online payment is needed at this step.
          </p>

          {status === 'done' ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-7 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-semibold text-emerald-950">
                Application received
              </h3>
              <p className="mt-2 text-sm text-emerald-800">
                Save your reference code{' '}
                <span className="font-mono-num rounded bg-white px-2 py-0.5 font-bold text-[#1F386B]">
                  {refCode}
                </span>
                . Our admissions coordinator will contact you shortly to verify details and confirm
                your batch timing.
              </p>
              <p className="mt-2 text-xs text-emerald-700">
                Final seat confirmation takes place at our New Usmanpura campus after counselling
                and document verification.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setForm({
                    student_name: '',
                    parent_name: '',
                    phone: '',
                    email: '',
                    class_level: '',
                    course_name: '',
                    preferred_batch: '',
                    school: '',
                    address: '',
                    message: '',
                  });
                }}
                className="mt-6 inline-flex items-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="adm-student" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Student Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="adm-student"
                    maxLength={120}
                    className={inputCls}
                    value={form.student_name}
                    onChange={handleChange('student_name')}
                  />
                  {errors.student_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.student_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adm-parent" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Parent / Guardian Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="adm-parent"
                    maxLength={120}
                    className={inputCls}
                    value={form.parent_name}
                    onChange={handleChange('parent_name')}
                  />
                  {errors.parent_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.parent_name}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="adm-phone" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="adm-phone"
                    type="tel"
                    maxLength={20}
                    placeholder="+91 98XXXXXXXX"
                    className={inputCls}
                    value={form.phone}
                    onChange={handleChange('phone')}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="adm-email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    id="adm-email"
                    type="email"
                    maxLength={120}
                    placeholder="Optional"
                    className={inputCls}
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="adm-class" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Class / Academic Level <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="adm-class"
                    className={inputCls}
                    value={form.class_level}
                    onChange={handleChange('class_level')}
                  >
                    <option value="">Select class</option>
                    {CLASS_LEVELS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  {errors.class_level && (
                    <p className="mt-1 text-xs text-red-600">{errors.class_level}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adm-course" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Programme Applying For
                  </label>
                  <select
                    id="adm-course"
                    className={inputCls}
                    value={form.course_name}
                    onChange={handleChange('course_name')}
                  >
                    <option value="">Select programme</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="adm-batch" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Preferred Batch Timing
                  </label>
                  <select
                    id="adm-batch"
                    className={inputCls}
                    value={form.preferred_batch}
                    onChange={handleChange('preferred_batch')}
                  >
                    <option value="">Any available batch</option>
                    {BATCH_PREFERENCES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="adm-school" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Current School / Junior College
                  </label>
                  <input
                    id="adm-school"
                    maxLength={160}
                    className={inputCls}
                    placeholder="School or college name"
                    value={form.school}
                    onChange={handleChange('school')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="adm-address" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Residential Area / Address
                </label>
                <input
                  id="adm-address"
                  maxLength={300}
                  className={inputCls}
                  placeholder="Area / locality in Chhatrapati Sambhajinagar"
                  value={form.address}
                  onChange={handleChange('address')}
                />
              </div>

              <div>
                <label htmlFor="adm-notes" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Additional Notes or Scholarship Test Request
                </label>
                <textarea
                  id="adm-notes"
                  rows={3}
                  maxLength={1000}
                  className={inputCls}
                  placeholder="Mention previous board percentage, target exam, or demo lecture preference..."
                  value={form.message}
                  onChange={handleChange('message')}
                />
              </div>

              {status === 'error' && serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'saving'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#AA2451] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8E1C42] disabled:opacity-60"
              >
                {status === 'saving' && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                <span>
                  {status === 'saving' ? 'Submitting Application...' : 'Submit Admission Application'}
                </span>
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="surface p-6 sm:p-7">
            <h3 className="display-face text-xl font-bold text-[#1F386B]">
              How Admission <span className="text-[#AA2451]">Works</span>
            </h3>
            <div className="section-rule mt-2" aria-hidden="true" />
            <ol className="mt-4 space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="font-mono-num font-bold text-[#AA2451]">01.</span>
                <span>Submit your application online and note your reference code.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono-num font-bold text-[#AA2451]">02.</span>
                <span>
                  Our admissions team calls within 24 hours to schedule a campus counselling slot
                  and optional demo class.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono-num font-bold text-[#AA2451]">03.</span>
                <span>
                  Visit our New Usmanpura campus to review study material, GMAT scholarship
                  eligibility, and confirm your seat.
                </span>
              </li>
            </ol>
          </div>

          <div className="surface p-6 sm:p-7">
            <h3 className="display-face text-xl font-bold text-[#1F386B]">
              Documents Required at Campus
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {[
                '2 passport-size photographs of the student',
                'Copy of previous class marksheet (10th / 11th / Semester)',
                'Student Aadhaar card or School ID copy',
                'Parent / Guardian contact details for weekly test SMS & reports',
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#AA2451]" aria-hidden="true" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
