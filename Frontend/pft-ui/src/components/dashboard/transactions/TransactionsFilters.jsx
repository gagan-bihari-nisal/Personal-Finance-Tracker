export default function TransactionsFilters({
  years,
  selectedYear,
  setSelectedYear,
  filteredMonths,
  selectedMonth,
  setSelectedMonth,
  selectedType,
  setSelectedType,
  currentYear,
  currentMonth
}) {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex space-x-4">
        {/* Year */}
        <select
          value={selectedYear}
          onChange={(e) => {
            const y = parseInt(e.target.value);
            setSelectedYear(y);
            if (y === currentYear && selectedMonth > currentMonth) {
              setSelectedMonth(currentMonth);
            }
          }}
          className="px-4 py-2 border rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Month */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="px-4 py-2 border rounded"
        >
          {filteredMonths.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>

        {/* Type */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="ALL">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>
    </div>
  );
}
