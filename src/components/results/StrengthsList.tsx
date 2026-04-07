export default function StrengthsList({ strengths }: { strengths: string[] }) {
  if (strengths.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">Strengths</h3>
      <ul className="space-y-2">
        {strengths.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
