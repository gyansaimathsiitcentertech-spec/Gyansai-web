import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { PageHero } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';

export function BlogsPage() {
  const { blogs } = useSite();

  return (
    <>
      <PageHero
        kicker="Academic Desk & Newsroom"
        title="Study strategy, schedules & notices"
        description="Practical exam strategy essays, revision frameworks, and institute updates written by our Mathematics faculty."
      />

      <section className="shell py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {blogs.map((post) => (
            <article key={post.id} className="surface surface-hover flex flex-col overflow-hidden">
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#F5F7FB]">
                <SafeImage
                  src={post.featured_image_url}
                  alt={post.title}
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold text-[#AA2451]">
                  {post.category} · {post.published_date} · {post.read_time}
                </p>
                <h2 className="display-face mt-2 text-xl font-bold text-[#1F386B]">
                  <Link to={`/blogs/${post.slug}`} className="hover:text-[#AA2451]">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                  <span className="text-slate-500">{post.author}</span>
                  <Link
                    to={`/blogs/${post.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#1F386B] hover:text-[#AA2451]"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const { blogs } = useSite();
  const post = blogs.find((b) => b.slug === slug || b.id === slug);

  if (!post) {
    return (
      <section className="shell py-20 text-center">
        <h1 className="display-face text-3xl font-bold text-[#1F386B]">Article not found</h1>
        <Link
          to="/blogs"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1F386B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#13254B]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>
      </section>
    );
  }

  const blocks = post.content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero
        kicker={`${post.category} · ${post.published_date} · ${post.read_time}`}
        title={post.title}
        description={`By ${post.author}`}
      >
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>All Study Articles</span>
        </Link>
      </PageHero>

      <article className="shell max-w-3xl py-12 sm:py-16">
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200">
          <SafeImage
            src={post.featured_image_url}
            alt={post.title}
            className="aspect-[16/9] w-full"
          />
        </div>

        <div className="space-y-4 text-base leading-relaxed text-slate-700">
          {blocks.map((block, idx) =>
            block.startsWith('## ') ? (
              <h2
                key={idx}
                className="display-face pt-4 text-2xl font-bold text-[#1F386B]"
              >
                {block.replace(/^##\s+/, '')}
              </h2>
            ) : (
              <p key={idx}>{block}</p>
            )
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-[#F5F7FB] p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="display-face text-base font-bold text-[#1F386B]">
              Want guidance tailored to your class and target exam?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Book an academic counselling visit at our New Usmanpura campus.
            </p>
          </div>
          <Link
            to="/admission"
            className="mt-4 inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#AA2451] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8E1C42] sm:mt-0"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </>
  );
}
