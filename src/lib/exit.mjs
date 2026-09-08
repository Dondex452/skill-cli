export const CODES = {
  OK: 0,
  USAGE: 1,
  NOT_FOUND: 2,
  CONFLICT: 3,
  UNAVAILABLE: 4,
};

export function usageError(message, usage) {
  console.error(`error: ${message}`);
  if (usage) console.error(`usage: skill-cli ${usage}`);
  return CODES.USAGE;
}
