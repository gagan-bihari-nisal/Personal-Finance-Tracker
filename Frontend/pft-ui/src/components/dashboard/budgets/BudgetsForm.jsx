import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { MONTHS, START_YEAR } from '../../../common/constants';
import { getYears } from '../Overview/utils';

const INITIAL_FORM = {
  id: '',
  categoryName: '',
  year: '',
  month: '',
  amount: ''
};

export default function BudgetsForm({ budget, onSuccess, currentYear }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const years = getYears(currentYear, START_YEAR);
  const selectedYear = parseInt(formData.year) || currentYear;
  const currentMonth = new Date().getMonth() + 1;

  const filteredMonths = selectedYear === currentYear
    ? MONTHS.slice(0, currentMonth)
    : MONTHS;

  // Populate form when editing
  useEffect(() => {
    if (budget) {
      setFormData({
        id: budget.id || '',
        categoryName: budget.categoryName || '',
        year: budget.year || '',
        month: budget.month || '',
        amount: budget.amount || ''
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'categoryName' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      await api.post('/finance/budgets', payload);

      onSuccess?.(budget ? 'Budget updated successfully!' : 'Budget added successfully!');
    } catch (err) {
      console.error('Error saving budget:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Category */}
      <div>
        <label className="block mb-1 text-sm">Category Name<span className="text-red-500">*</span></label>
        <input
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          maxLength={30}
          className="w-full border px-3 py-2 rounded uppercase"
          placeholder="E.g. RENT"
          required
        />
      </div>

      {/* Year */}
      <div>
        <label className="block mb-1 text-sm">Year<span className="text-red-500">*</span></label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Month */}
      <div>
        <label className="block mb-1 text-sm">Month<span className="text-red-500">*</span></label>
        <select
          name="month"
          value={formData.month}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          disabled={!formData.year}
        >
          <option value="">Select Month</option>
          {filteredMonths.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1 text-sm">Amount (₹)<span className="text-red-500">*</span></label>
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount in ₹"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      {/* Submit */}
      <div className="md:col-span-2 text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {isSubmitting
            ? 'Submitting...'
            : budget ? 'Update Budget' : 'Save Budget'}
        </button>
      </div>
    </form>
  );
}
