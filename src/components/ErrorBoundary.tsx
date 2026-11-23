import React from 'react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error) {
    console.error('Application boundary caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB] p-6">
          <div className="surface max-w-md p-8 text-center">
            <h1 className="display-face text-2xl font-bold text-[#1F386B]">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              We encountered an error loading this view. Please reload the page or return to the
              homepage.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#AA2451] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8E1C42]"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
