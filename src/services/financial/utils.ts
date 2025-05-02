
// Shared utility functions

/**
 * Gets the date N days ago in YYYY-MM-DD format
 */
export function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getDateToday(): string {
  return new Date().toISOString().split('T')[0];
}
