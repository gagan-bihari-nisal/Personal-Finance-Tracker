import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import Loader from '../../../common/Loader';
import OverviewCards from './OverviewCards';
import ChartPie from './ChartPie';
import BudgetUtilization from './BudgetUtilization';
import TopExpenses from './TopExpenses';
import { MONTHS, COLORS, START_YEAR } from '../../../common/constants';
import { getYears } from './utils';

export default function Overview() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const [income, setIncome] = useState(0);
    const [monthlySpend, setMonthlySpend] = useState(0);
    const [savings, setSavings] = useState(0);
    const [overSpent, setOverSpent] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const years = getYears(currentYear, START_YEAR);
    const filteredMonths = selectedYear === currentYear ? MONTHS.slice(0, currentMonth) : MONTHS;

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchOverview = async () => {
            try {
                const [summaryRes, categoryRes, budgetsRes] = await Promise.all([
                    api.get(`/finance/transactions/summary?year=${selectedYear}&month=${selectedMonth}`),
                    api.get(`/finance/transactions/category-summary?year=${selectedYear}&month=${selectedMonth}`),
                    api.get(`/finance/budgets/status?year=${selectedYear}&month=${selectedMonth}`)
                ]);

                setIncome(summaryRes.data.income);
                setMonthlySpend(summaryRes.data.expense);
                setSavings(summaryRes.data.savings);
                setOverSpent(summaryRes.data.overspent);

                setCategoryData(Object.entries(categoryRes.data).map(([categoryName, amountSpent]) => ({
                    categoryName,
                    amountSpent
                })));

                setBudgets(budgetsRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load overview data.');
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, [selectedYear, selectedMonth]);

    return (
        <section>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-semibold text-emerald-700">Overview</h2>

                <div className="flex gap-3 mt-3 md:mt-0 items-center">
                    {/* Year Dropdown */}
                    <select
                        value={selectedYear}
                        onChange={e => {
                            const y = parseInt(e.target.value);
                            setSelectedYear(y);
                            if (y === currentYear && selectedMonth > currentMonth) setSelectedMonth(currentMonth);
                        }}
                        className="border border-gray-300 text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>

                    {/* Month Dropdown */}
                    <select
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(parseInt(e.target.value))}
                        className="border border-gray-300 text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                        {filteredMonths.map((name, index) => (
                            <option key={index} value={index + 1}>{name}</option>
                        ))}
                    </select>

                </div>
            </div>

            {loading && <Loader message="Loading overview..." />}
            {error && <p className="text-red-500 text-center py-4">{error}</p>}

            {!loading && !error && (
                <>
                    <OverviewCards income={income} expenses={monthlySpend} savings={savings} overSpent={overSpent} />
                    <ChartPie categoryData={categoryData} hoveredCategory={hoveredCategory} setHoveredCategory={setHoveredCategory} />
                    <BudgetUtilization budgets={budgets} />
                    <TopExpenses categoryData={categoryData} />
                </>
            )}
        </section>
    );
}
