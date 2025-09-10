export const getYears = (currentYear, startYear = 2020) =>
  Array.from({ length: currentYear - startYear + 1 }, (_, i) => i + startYear);

export const getUtilization = (spent, budget) =>
  budget ? Math.min((spent / budget) * 100, 100) : 0;