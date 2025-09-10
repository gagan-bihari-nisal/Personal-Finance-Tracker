import React from 'react';

export default function BudgetsFilters({
  years,
  selectedYear,
  setSelectedYear,
  filteredMonths,
  selectedMonth,
  setSelectedMonth,
  currentYear,
  currentMonth,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
      {/* Year Selector */}
      <select
        value={selectedYear}
        onChange={(e) => {
          const year = parseInt(e.target.value);
          setSelectedYear(year);
          setSelectedMonth(''); // reset month on year change
        }}
        className="p-2 border rounded"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Month Selector */}
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        className="p-2 border rounded"
      >
        <option value="">Select Month</option>
        {filteredMonths.map((monthName, index) => (
          <option key={index + 1} value={index + 1}>
            {monthName}
          </option>
        ))}
      </select>
    </div>
  );
}
