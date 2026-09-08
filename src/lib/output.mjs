import process from "node:process";

const COLORS = {
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

export function isTty() {
  return Boolean(process.stdout.isTTY);
}

export function paint(text, color, enabled = isTty()) {
  const code = COLORS[color];
  return enabled && code ? `${code}${text}${COLORS.reset}` : String(text);
}

export function truncate(text, width) {
  let s = String(text ?? "").replace(/\s+/g, " ").trim();
  if (s.length <= width) return s;
  if (width <= 1) return s.slice(0, Math.max(0, width));
  return s.slice(0, width - 1) + "\u2026";
}

export function table(headers, rows, { min = 4, max = 40 } = {}) {
  const cols = headers.length;
  const widths = headers.map((h) => Math.max(h.length, min));
  for (const row of rows) {
    for (let i = 0; i < cols && i < row.length; i++) {
      widths[i] = Math.min(
        max,
        Math.max(widths[i], String(row[i] ?? "").length)
      );
    }
  }
  const fmt = (cell, width, last) =>
    (last ? String(cell) : String(cell).padEnd(width));
  const lines = [
    headers.map((h, i) => fmt(h, widths[i], i === cols - 1)).join(" "),
    widths.map((w) => "-".repeat(w)).join(" "),
  ];
  for (const row of rows) {
    lines.push(row.map((c, i) => fmt(truncate(c, widths[i]), widths[i], i === cols - 1)).join(" "));
  }
  return lines.join("\n");
}
