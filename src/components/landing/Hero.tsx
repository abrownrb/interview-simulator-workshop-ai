import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Ace Your Next
          <span className="text-indigo-600"> Interview</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Practice with AI-generated interview questions, get instant feedback
          on your answers, and master the STAR framework. Tailored to any role
          or industry.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/interview?mode=practice"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Start Practicing
          </Link>
          <Link
            href="/interview?mode=job-description"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-8 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            Paste a Job Description
          </Link>
        </div>
      </div>
    </section>
  );
}
