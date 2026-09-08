const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
  "in", "is", "it", "of", "on", "or", "that", "the", "this", "to",
  "with",
]);

export function scoreRecord(query, record) {
  const q = query.toLowerCase();
  const name = String(record.name ?? "").toLowerCase();
  const desc = String(record.description ?? "").toLowerCase();
  const tags = (Array.isArray(record.tags) ? record.tags : []).map((t) =>
    String(t).toLowerCase()
  );
  const cats = (Array.isArray(record.category) ? record.category : []).map((c) =>
    String(c).toLowerCase()
  );
  const words = q
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));

  let score = 0;
  if (name === q) score += 5;
  else if (name.startsWith(q)) score += 3;
  score += 2 * words.filter((w) => desc.includes(w)).length;
  score += 1 * words.filter(
    (w) =>
      tags.some((t) => t === w || t.startsWith(w)) ||
      cats.some((c) => c === w || c.startsWith(w))
  ).length;
  if (score > 0 && record.tier === "reviewed") score += 1.5;
  return score;
}

export function searchCatalog(records, query) {
  const scored = [];
  for (const r of records) {
    const score = scoreRecord(query, r);
    if (score > 0) scored.push({ score, record: r });
  }
  scored.sort(
    (a, b) => b.score - a.score || a.record.name.localeCompare(b.record.name)
  );
  return scored;
}
