import { ExternalLink, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { VideoLecture } from '../types';
import { SafeImage } from './SafeImage';

function toEmbedUrl(raw: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function LectureModal({
  lecture,
  onClose,
}: {
  lecture: VideoLecture | null;
  onClose: () => void;
}) {
  if (!lecture) return null;
  const embedUrl = toEmbedUrl(lecture.video_url);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lecture.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1A35]/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {lecture.subject} · {lecture.class_level} · {lecture.duration_label}
            </p>
            <h3 className="display-face mt-1 text-xl font-bold text-[#1F386B]">
              {lecture.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video preview"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-[#13254B]">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={lecture.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <SafeImage
                src={lecture.thumbnail_url}
                alt={lecture.title}
                className="absolute inset-0 h-full w-full opacity-35"
              />
              <div className="relative z-10 max-w-md px-6 text-center text-white">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#AA2451] text-white shadow-lg">
                  <Play className="h-6 w-6 fill-current pl-0.5" aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm font-semibold text-white">
                  Full classroom recording available on Gyansai e-Learning
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/80">
                  Attend a live demo session with {lecture.teacher_name} at our New Usmanpura campus
                  or enroll for complete access to our revision library.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/admission"
                    onClick={onClose}
                    className="inline-flex items-center rounded-lg bg-[#AA2451] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#8E1C42]"
                  >
                    Book a Demo Lecture
                  </Link>
                  {lecture.video_url && (
                    <a
                      href={lecture.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      <span>Watch Externally</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-[#AA2451]">{lecture.teacher_name}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{lecture.summary}</p>
        </div>
      </div>
    </div>
  );
}
