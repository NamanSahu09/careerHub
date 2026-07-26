export default function StatCard({ label, value, delta }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="font-mono-num text-2xl font-semibold text-navy mt-1.5">{value}</p>
      {delta && <p className="text-xs text-teal font-medium mt-1">{delta}</p>}
    </div>
  );
}
