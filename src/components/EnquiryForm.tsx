import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { BATCH_PREFERENCES, CLASS_LEVELS } from '../data/gyansaiData';
import { useSite } from '../context/SiteContext';

interface EnquiryFormProps {
  source?: string;
  defaultCourse?: string;
  submitLabel?: string;
  compact?: boolean;
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1F386B] focus:ring-2 focus:ring-[#1F386B]/15';

export function EnquiryForm({
  source = 'website',
  defaultCourse = '',
  submitLabel = 'Send Message',
  compact = false,
}: EnquiryFormProps) {
  const { courses, submitEnquiry } = useSite();
  const [form, setForm] = useState({
    student_name: '',
    parent_name: '',
    phone: '',
    email: '',
    class_level: '',
    course_name: defaultCourse,
    preferred_batch: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

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
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number.';
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('saving');
    setServerError('');
    const res = await submitEnquiry({ ...form, source });
    if (res.ok) {
      setStatus('done');
    } else {
      setStatus('error');
      setServerError(res.error || 'Could not submit enquiry. Please try again.');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-700" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-semibold text-emerald-950">Message received</h3>
        <p className="mt-1.5 text-sm text-emerald-800">
          Thank you. Our academic desk at Gyansai Maths IIT Center will contact you shortly with
          batch timings and counselling details.
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
              course_name: defaultCourse,
              preferred_batch: '',
              message: '',
            });
          }}
          className="mt-5 inline-flex items-center justify-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`enq-student-${source}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
            Student Name <span className="text-[#AA2451]">*</span>
          </label>
          <input
            id={`enq-student-${source}`}
            type="text"
            maxLength={120}
            className={inputCls}
            placeholder="Enter full name"
            value={form.student_name}
            onChange={handleChange('student_name')}
          />
          {errors.student_name && <p className="mt-1 text-xs text-red-600">{errors.student_name}</p>}
        </div>

        <div>
          <label htmlFor={`enq-phone-${source}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
            Mobile Number <span className="text-[#AA2451]">*</span>
          </label>
          <input
            id={`enq-phone-${source}`}
            type="tel"
            maxLength={20}
            className={inputCls}
            placeholder="+91 98XXXXXXXX"
            value={form.phone}
            onChange={handleChange('phone')}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`enq-class-${source}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
            Class / Grade
          </label>
          <select
            id={`enq-class-${source}`}
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
        </div>

        <div>
          <label htmlFor={`enq-course-${source}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
            Target Programme
          </label>
          <select
            id={`enq-course-${source}`}
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

      {!compact && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`enq-parent-${source}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
              Parent / Guardian Name
            </label>
            <input
              id={`enq-parent-${source}`}
              type="text"
              maxLength={120}
              className={inputCls}
              placeholder="Optional"
              value={form.parent_name}
              onChange={handleChange('parent_name')}
            />
          </div>
          <div>
            <label htmlFor={`enq-batch-${source}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
              Preferred Batch Timing
            </label>
            <select
              id={`enq-batch-${source}`}
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
        </div>
      )}

      <div>
        <label htmlFor={`enq-msg-${source}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
          Message / Query
        </label>
        <textarea
          id={`enq-msg-${source}`}
          rows={compact ? 3 : 4}
          maxLength={1000}
          className={inputCls}
          placeholder="Ask about GMAT scholarship test, fee structure, or demo lectures..."
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#AA2451] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#8E1C42] disabled:opacity-60"
      >
        {status === 'saving' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        <span>{status === 'saving' ? 'Submitting...' : submitLabel}</span>
      </button>
    </form>
  );
}
