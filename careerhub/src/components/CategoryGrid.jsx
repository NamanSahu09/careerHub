import { Code2, TrendingUp, Megaphone, Wallet, Users, Palette, Layers, Headset } from "lucide-react";
import { categories } from "../data/mockData";

const iconMap = {
  code: Code2,
  trending: TrendingUp,
  megaphone: Megaphone,
  wallet: Wallet,
  users: Users,
  palette: Palette,
  layers: Layers,
  headset: Headset,
};

export default function CategoryGrid({ onSelect }) {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy">Browse by category</h2>
          <p className="text-text-muted text-sm mt-1">Jump straight to the openings that fit your field.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((c) => {
          const Icon = iconMap[c.icon];
          return (
            <button
              key={c.id}
              onClick={() => onSelect?.(c.name)}
              className="group text-left bg-surface border border-border rounded-xl p-4 hover:border-violet hover:shadow-card transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-violet/10 text-violet flex items-center justify-center group-hover:bg-violet group-hover:text-white transition-colors">
                <Icon size={20} strokeWidth={2} />
              </div>
              <p className="mt-3 font-semibold text-sm text-navy">{c.name}</p>
              <p className="text-xs text-text-muted font-mono-num mt-0.5">{c.count.toLocaleString("en-IN")} jobs</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
