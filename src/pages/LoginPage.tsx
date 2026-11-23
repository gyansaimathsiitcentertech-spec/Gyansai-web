import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';

export function LoginPage() {
  const { user, isAdmin, loading, authError, signInWithGoogle, logout } = useAuth();
  const { site } = useSite();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [loading, isAdmin, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F7FB] px-4 py-12">
      <div className="surface w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1F386B] text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-[#AA2451]">Administrator Console</p>
            <h1 className="display-face text-xl font-bold text-[#1F386B]">
              {site.institute_name}
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-600">
          Sign in with your authorized institute Google account to manage courses, results,
          examination schedules, enquiries, and admission applications.
        </p>

        {authError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {authError}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => void signInWithGoogle()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#AA2451] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8E1C42] disabled:opacity-60"
          >
            <span>Continue with Google</span>
          </button>

          {user && !isAdmin && (
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Sign out ({user.email})
            </button>
          )}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F386B] hover:text-[#AA2451]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
