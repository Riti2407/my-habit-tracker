// src/utils/streak.js

// date -> YYYY-MM-DD string
const toISO = (d) => d.toISOString().slice(0, 10);

/**
 * Compute streaks from a set of completed dates.
 * @param {string[]} completedDates - Array of YYYY-MM-DD strings
 */
export function computeStreaks(completedDates, today = new Date()) {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0, streakDateSet: new Set() };
  }

  const set = new Set(completedDates);
  const sorted = [...set].sort();

  // --- best streak ---
  let bestStreak = 0;
  for (let i = 0; i < sorted.length; ) {
    let length = 1;
    let prev = new Date(sorted[i]);
    while (true) {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 1);
      const iso = toISO(next);
      if (set.has(iso)) {
        length++;
        prev = next;
      } else break;
    }
    if (length > bestStreak) bestStreak = length;
    i += length;
  }

  // --- current streak ---
  const todayISO = toISO(today);
  let currentStreak = 0;
  const streakDateSet = new Set();

  if (set.has(todayISO)) {
    currentStreak = 1;
    streakDateSet.add(todayISO);
    let prev = new Date(today);
    while (true) {
      prev.setDate(prev.getDate() - 1);
      const iso = toISO(prev);
      if (set.has(iso)) {
        currentStreak++;
        streakDateSet.add(iso);
      } else break;
    }
  }

  return { currentStreak, bestStreak, streakDateSet };
}

