const PALETTE = ["#6C5CE7", "#F5A623", "#2D9CDB", "#00B894", "#EB5757"];

/**
 * Backend-sourced jobs only carry a plain `company` string, not a brand
 * color/initial like the frontend's mock data does. Derive one
 * deterministically from the company name so the same company always gets
 * the same color across the app.
 */
export function brandFor(job) {
  if (job.color && job.logo) return { color: job.color, logo: job.logo };
  const name = job.company || "?";
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return { color: PALETTE[hash % PALETTE.length], logo: name.trim().charAt(0).toUpperCase() || "?" };
}
