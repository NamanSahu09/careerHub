import { Quote } from "lucide-react";
import { testimonials } from "../data/mockData";

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-8">
        Hired, not just applied
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <figure key={t.name} className="bg-surface border border-border rounded-xl p-6">
            <Quote className="text-gold" size={22} aria-hidden="true" />
            <blockquote className="mt-3 text-sm text-text leading-relaxed">
              {t.quote}
            </blockquote>
            <figcaption className="mt-4 pt-4 border-t border-border">
              <p className="font-semibold text-sm text-navy">{t.name}</p>
              <p className="text-xs text-text-muted">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
