export default function CandidatesTable({ candidates }) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-text-muted uppercase tracking-wide">
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Target role</th>
            <th className="px-5 py-3">Location</th>
            <th className="px-5 py-3">Applications</th>
            <th className="px-5 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-bg/60">
              <td className="px-5 py-3.5 font-medium text-navy">{c.name}</td>
              <td className="px-5 py-3.5 text-text-muted">{c.role}</td>
              <td className="px-5 py-3.5 text-text-muted">{c.location}</td>
              <td className="px-5 py-3.5 font-mono-num text-text-muted">{c.applications}</td>
              <td className="px-5 py-3.5 text-text-muted">{c.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
