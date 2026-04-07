export default function ImprovementsList({
  improvements,
}: {
  improvements: string[];
}) {
  if (improvements.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">
        Areas for Improvement
      </h3>
      <ul className="space-y-2">
        {improvements.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
