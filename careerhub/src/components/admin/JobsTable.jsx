const statusStyles = {
  Live: "bg-teal/10 text-teal",
  "Pending review": "bg-gold/15 text-[#8a5a10]",
  Flagged: "bg-red-100 text-red-600",
};

export default function JobsTable({ jobs }) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-text-muted uppercase tracking-wide">
            <th className="px-5 py-3">Job title</th>
            <th className="px-5 py-3">Company</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Applicants</th>
            <th className="px-5 py-3">Posted</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className="border-b border-border last:border-0 hover:bg-bg/60">
              <td className="px-5 py-3.5 font-medium text-navy">{j.title}</td>
              <td className="px-5 py-3.5 text-text-muted">{j.company}</td>
              <td className="px-5 py-3.5">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[j.status] || ""}`}>
                  {j.status}
                </span>
              </td>
              <td className="px-5 py-3.5 font-mono-num text-text-muted">{j.applicants}</td>
              <td className="px-5 py-3.5 text-text-muted">{j.posted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
