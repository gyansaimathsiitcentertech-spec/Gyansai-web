import { useState } from 'react';
import { X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';
import type { GalleryItem } from '../types';

export function GalleryPage() {
  const { gallery } = useSite();
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const albums = ['All', ...Array.from(new Set(gallery.map((g) => g.album)))];
  const visible =
    selectedAlbum === 'All' ? gallery : gallery.filter((g) => g.album === selectedAlbum);

  return (
    <>
      <PageHero
        kicker="Campus Life"
        title="Inside Gyansai Maths IIT Center"
        description="Classrooms, supervised study rooms, small-group mentoring sessions, and annual topper felicitations at our New Usmanpura campus."
      />

      <section className="shell py-12 sm:py-16">
        <div
          className="mb-8 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter gallery by album"
        >
          {albums.map((alb) => (
            <button
              key={alb}
              type="button"
              role="tab"
              aria-selected={selectedAlbum === alb}
              onClick={() => setSelectedAlbum(alb)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                selectedAlbum === alb
                  ? 'bg-[#AA2451] text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-[#1F386B]/40 hover:text-[#1F386B]'
              }`}
            >
              {alb}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <figure key={item.id} className="surface surface-hover overflow-hidden">
              <button
                type="button"
                onClick={() => setLightbox(item)}
                className="block aspect-[4/3] w-full overflow-hidden bg-[#F5F7FB] text-left"
              >
                <SafeImage
                  src={item.file_url}
                  alt={item.title}
                  className="h-full w-full transition duration-300 hover:scale-105"
                />
              </button>
              <figcaption className="p-5">
                <p className="text-xs font-semibold text-[#AA2451]">{item.album}</p>
                <h2 className="display-face mt-1 text-base font-bold text-[#1F386B]">
                  {item.title}
                </h2>
                {item.caption && (
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.caption}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13254B]/85 p-4 backdrop-blur-xs"
          onClick={() => setLightbox(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
              <div>
                <p className="text-xs font-semibold text-[#AA2451]">{lightbox.album}</p>
                <h3 className="display-face text-base font-bold text-[#1F386B]">
                  {lightbox.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close photograph"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden bg-[#13254B]">
              <SafeImage
                src={lightbox.file_url}
                alt={lightbox.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
            {lightbox.caption && (
              <p className="px-5 py-4 text-sm text-slate-600">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
